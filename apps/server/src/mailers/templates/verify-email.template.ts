export const verifyEmailTemplate = (
  url: string,
  brandColor = "#000000",
  brandName = "Locatr",
) => ({
  subject: `Confirm your ${brandName} account`,
  text: `Please verify your email address by clicking the following link: ${url}`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-weight:bold; font-size: 24px; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .header img { max-width: 40px; margin-bottom: 10px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 24px; color: #333333; }
      .content p { font-size: 16px; color: #666666; margin: 10px 0 20px; }
      .button { display: inline-block; padding: 15px 25px; font-size: 16px; font-weight: bold;  background-color: ${brandColor}; color: #fff!important; border-radius: 5px; text-decoration: none; margin-top: 20px; }
      .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">${brandName}</div>
        <div class="content">
          <h1>Confirm Your Email Address</h1>
          <p>Thank you for signing up! Please confirm your account by clicking the button below.</p>
          <a href="${url}" class="button">Confirm account</a>
          <p>If you did not create this account, please disregard this email.</p>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
      </div>
    </body></html>
  `,
});
