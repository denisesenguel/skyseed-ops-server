const nodemailer = require('nodemailer');

// credentials for mail account the mails will be sent from 
const credentials = {
    host: process.env.MAIL_HOST,
    // host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
}

// setup nodemailer with above credentials
const transporter = nodemailer.createTransport(credentials);

// export async function that returns a promise
async function sendEmailConfirm(user) {

    // set to and from email addresses
    const contacts = {
        from: process.env.MAIL_USER,
        to
    }

    const content = {
        subject: "Confirm your Email",
        html:`
            <h3>Hello, ${user.firstName}!</h3>
            <p> Thanks for signing up! Just one step missing until you can use the Skyseed App:</p>
            <a href=${process.env.ORIGIN}/confirm/${user._id}> Click to confirm your email </a>
        `,
        text: `Copy and paste this link: ${process.env.ORIGIN}/confirm/${userId}`
    };

    const email = Object.assign({}, content, contacts);
    await transporter.sendMail(email);
}

module.exports = sendEmailConfirm;
