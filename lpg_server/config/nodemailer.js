import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
        
        await transporter.sendMail({
            from: `"LPG Server" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        })

        res.status(200).json({ message: `Email sent successfully to ${to}` });

    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
}