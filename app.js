const nodemailer = require('nodemailer');
var express     = require("express"),
    flash       = require("connect-flash"),
    app         = express(),
    bodyParser  = require("body-parser");
    
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
app.use(require("express-session")({
    secret: "contactusform",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '', //provide your own email address
        pass: '' //provide your password
    }
});

transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});



app.get("/", function(req, res){
    res.render("mail");
});

app.post("/login", function(req, res){
    var mailOptions = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;', // sender address
        to: 'ali-raza@outlook.com', // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.email + "\n\n" + req.body.message // plain text body
    };
    iscomplete(req, res, mailOptions);
});

function iscomplete (req, res, mailOptions){
    if(req.body.name.length < 1 || req.body.email.length < 1 || req.body.message.length < 1){
        req.flash("error", "required field was empty");
        res.redirect("/");
    } else {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
                req.flash("error", error);
                res.redirect("back");
            } else {
                console.log('Message %s sent: %s', info.messageId, info.response);
                req.flash("success", "Message was sent");
                res.redirect("/");
            }
        });
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Mail SERVER HAS STARTED");
});
