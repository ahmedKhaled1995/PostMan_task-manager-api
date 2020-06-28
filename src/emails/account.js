const nodemailer = require("nodemailer");

const smtpConfig = {
    host: 'smtp.gmail.com',
    //service: 'gmail',                 // also works
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

const greetUser = async (email, userName) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Thanks for joining',
        text: `Welcome to the app ${userName}, hope you enjoy our sevice.`
    };
    if(transporter){
        // transporter.sendMail(mailOptions).then(()=>{
        //     console.log("Greet mail sent Successfully!");
        // }).catch((e)=>{
        //     console.log(e);
        // });
        await transporter.sendMail(mailOptions);
    }
};

const userCancellationMail = async (email, userName) =>{
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Sorry you are leaving us',
        text: `${userName}, we are sorry that you are leaving us. Care to send an email to tell us why.`
    };
    if(transporter){
        // transporter.sendMail(mailOptions).then(()=>{
        //     console.log("User leaving mail sent Successfully!");
        // }).catch((e)=>{
        //     console.log(e);
        // });
        await transporter.sendMail(mailOptions);
    }
};

module.exports = {
    greetUser,
    userCancellationMail
};