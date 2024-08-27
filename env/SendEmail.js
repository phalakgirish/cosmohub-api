import nodemailer from 'nodemailer';

export default async function SendEmail (staff_email_id,password) {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "pravinkarande2483@gmail.com",
            pass: "zvorjuoqhfmubwbp",
            },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"CosmoHub Group Of Business" <pravinkarande2483@gmail.com>', // sender address
            to: staff_email_id, // list of receivers
            subject: "User Login Credentials", // Subject line
            text: "Hello world?", // plain text body
            html: `
            <div>
                <p>Hi User,</p>
                <p style="margin-bottom:10px;">Please Find below <b>User Credential</b> for Login.</p>
                <p style="margin:5px;font-family:Arial">User Email Id:<b>${staff_email_id}</b></p>
                <p style="margin:5px;font-family:Arial">Password:<b>${password}</b></p>

                <p ><b>Note:</b> This is system generated email.<p>
                <p>Thanks & Regards,<br />CosmoHub Team</p>
            <div>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>
        //
}



