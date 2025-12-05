import nodemailer from 'nodemailer';
import { checkEmailFormat,checkEmailDomain } from './emailValidation.js';

export const sendEmail = async (to,subject,text) => {
    /* if(!to || !subject || !text){
        return res.status(400).json({message: "Missing required fields"});
    }
    if(!checkEmailFormat(to)){
        return res.status(400).json({message: "Invalid email format"});
    }
    const domainValid = await checkEmailDomain(to);
    if(!domainValid){
        return res.status(400).json({message: "Email domain does not exist"});
    } */
    try {
        console.log("Preparing to send email...");
        const transporter = nodemailer.createTransport({
            //host: process.env.MAILTRAP_HOST,
            //port: process.env.MAILTRAP_PORT,
            //secure: false, // true for 465, false for other ports
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        })
        console.log("Transporter created, sending email...");
        await transporter.sendMail({
            from: `"LPG Server" : <${process.env.EMAIL_USER}>`,
            to : to,
            subject: subject,
            text : text,
        })
        console.log("Email sent successfully to ", to);
        return { success: true, message: `Email sent to ${to}` };

    } catch (error) {
        console.error("Email sending failed:", error.message);
        return { success: false, error: error.message };
    }
}