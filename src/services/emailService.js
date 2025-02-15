const nodemailer = require("nodemailer");

// Email service to send emails
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Tasky" <${process.env.EMAIL_FROM}>`,
      to, // receiver address
      subject, // Subject of the email
      html: htmlContent, // HTML body
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

// Generate HTML content for welcome email
const getWelcomeEmailTemplate = (userName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Tasky</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              background-color: #ffffff;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              background-color: #4CAF50;
              padding: 20px;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
          }
          .header h1 {
              margin: 0;
              color: white;
              font-size: 24px;
          }
          .header p {
              color: white;
              font-size: 16px;
              margin-top: 5px;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content h2 {
              font-size: 22px;
              color: #333;
          }
          .content p {
              font-size: 16px;
              color: #666;
              line-height: 1.6;
          }
          .btn {
              display: inline-block;
              padding: 12px 24px;
              font-size: 16px;
              color: white;
              background-color: #4CAF50;
              border-radius: 4px;
              text-decoration: none;
              margin-top: 20px;
          }
          .footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #999;
          }
          .footer a {
              color: #4CAF50;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to Tasky!</h1>
              <p>Manage your tasks easily and efficiently</p>
          </div>
          <div class="content">
              <h2>Hello ${userName},</h2>
              <p>
                  We're excited to have you on board! Tasky is the best platform to help you manage all your tasks, meet deadlines, and stay organized.
                  <br/><br/>
                  If you have any questions, feel free to reach out to us anytime.
              </p>
              <a class="btn" href="#">Get Started</a>
          </div>
          <div class="footer">
              <p>Need help? Contact us at <a href="mailto:support@tasky.com">support@tasky.com</a></p>
          </div>
      </div>
  </body>
  </html>
  `;
};

// Send a welcome email to the newly registered user
const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Tasky!";
  const htmlContent = getWelcomeEmailTemplate(name);
  await sendEmail(email, subject, htmlContent);
};

module.exports = {
  sendWelcomeEmail,
};
