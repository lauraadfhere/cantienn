const nodemailer = require('nodemailer');

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 465,
  secure: true,
  auth: {
    user: 'replies',
    pass: '7lMZVJ8P6WICr9RM'
  }
});

// HTML Email Templates
const orderNotificationTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <div style="width: 160px; height: 45px; margin: 0 auto 20px; background-color: #000; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 900; font-size: 26px; letter-spacing: 3px; color: #FFD700; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                WIPPEL
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #000; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                🎉 New Order Received!
              </h1>
            </td>
          </tr>
        </table>
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #333; line-height: 1.6;">
                You have received a new project order from <strong>${data.name}</strong>.
              </p>
              
              <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px; border-bottom: 1px solid #e5e5e5;">Client Name:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e5e5;">${data.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px; border-bottom: 1px solid #e5e5e5;">Email:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e5e5;">${data.email}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px; border-bottom: 1px solid #e5e5e5;">Company:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e5e5;">${data.company || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px; border-bottom: 1px solid #e5e5e5;">Service:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e5e5;">${data.service}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px;">Budget:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600;">${data.budget}</td>
                </tr>
              </table>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #666; font-size: 14px;">Project Details:</p>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">${data.message}</p>
              </div>
            </td>
          </tr>
        </table>
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #666;">
                Thanks for using WIPPEL!
              </p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} WIPPEL. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const thankYouTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <div style="width: 160px; height: 45px; margin: 0 auto 20px; background-color: #000; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 900; font-size: 26px; letter-spacing: 3px; color: #FFD700; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                WIPPEL
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #000; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ✨ Thank You, ${data.name}!
              </h1>
            </td>
          </tr>
        </table>
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 18px; color: #333; line-height: 1.6; font-weight: 600;">
                Your project request has been received successfully!
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; color: #555; line-height: 1.6;">
                We're excited to work with you on your project. Our team will review your requirements and get back to you within 24-48 hours with a detailed quote and timeline.
              </p>
              
              <div style="background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 2px solid #FFD700;">
                <p style="margin: 0 0 12px; font-weight: 700; color: #000; font-size: 16px;">📋 Your Request Summary:</p>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="font-weight: 600; color: #666; font-size: 14px;">Service:</td>
                    <td style="color: #000; font-size: 14px; font-weight: 700;">${data.service}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #666; font-size: 14px;">Budget:</td>
                    <td style="color: #000; font-size: 14px; font-weight: 700;">${data.budget}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0080ff; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #0080ff; font-size: 14px;">💡 What's Next?</p>
                <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.8;">
                  <li>Our team reviews your project details</li>
                  <li>We prepare a custom quote and timeline</li>
                  <li>You'll receive our proposal via email</li>
                  <li>We schedule a call to discuss next steps</li>
                </ul>
              </div>
              
              <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                If you have any questions in the meantime, feel free to reply to this email or contact us at <a href="mailto:replies@wappil.com" style="color: #0080ff; text-decoration: none; font-weight: 600;">replies@wappil.com</a>
              </p>
            </td>
          </tr>
        </table>
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #666; font-weight: 600;">
                Looking forward to building something amazing together! 🚀
              </p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} WIPPEL. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const contactNotificationTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <div style="width: 160px; height: 45px; margin: 0 auto 20px; background-color: #000; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 900; font-size: 26px; letter-spacing: 3px; color: #FFD700; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                WIPPEL
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #000; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                📬 New Contact Message
              </h1>
            </td>
          </tr>
        </table>
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #333; line-height: 1.6;">
                You have received a new contact message from <strong>${data.name}</strong>.
              </p>
              
              <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px; border-bottom: 1px solid #e5e5e5;">Name:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e5e5;">${data.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px; border-bottom: 1px solid #e5e5e5;">Email:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e5e5;">${data.email}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #666; font-size: 14px;">Subject:</td>
                  <td style="color: #000; font-size: 14px; font-weight: 600;">${data.subject || 'General Inquiry'}</td>
                </tr>
              </table>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #666; font-size: 14px;">Message:</p>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">${data.message}</p>
              </div>
            </td>
          </tr>
        </table>
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #666;">
                Thanks for using WIPPEL!
              </p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} WIPPEL. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Test Data
const testOrderData = {
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Tech Startup Inc',
  service: 'Full Website Development',
  budget: '50,000 DZD',
  message: 'We need a modern, responsive website with user authentication, admin dashboard, and payment integration. The project should be completed within 2 months.'
};

const testContactData = {
  name: 'Jane Smith',
  email: 'jane@company.com',
  subject: 'Partnership Inquiry',
  message: 'Hello, I am interested in discussing a potential partnership opportunity. Could we schedule a call next week?'
};

// Send Test Emails
async function sendTestEmails() {
  try {
    const testRecipient = process.env.SMTP_TEST_TO;
    if (!testRecipient) throw new Error('SMTP_TEST_TO is required');
    console.log('🚀 Starting email tests...\n');

    // Test 1: Order Notification
    console.log('📧 Sending Order Notification email...');
    await transporter.sendMail({
      from: '"WIPPEL" <replies@wappil.com>',
      to: 'belhachemiamohammed@gmail.com',
      subject: '🎉 New Order Received - WIPPEL',
      html: orderNotificationTemplate(testOrderData)
    });
    console.log('✅ Order Notification sent successfully!\n');

    // Test 2: Thank You Email
    console.log('📧 Sending Thank You email...');
    await transporter.sendMail({
      from: '"WIPPEL" <replies@wappil.com>',
      to: 'belhachemiamohammed@gmail.com',
      subject: '✨ Thank You for Your Order - WIPPEL',
      html: thankYouTemplate(testOrderData)
    });
    console.log('✅ Thank You email sent successfully!\n');

    // Test 3: Contact Notification
    console.log('📧 Sending Contact Notification email...');
    await transporter.sendMail({
      from: '"WIPPEL" <replies@wappil.com>',
      to: 'belhachemiamohammed@gmail.com',
      subject: '📬 New Contact Message - WIPPEL',
      html: contactNotificationTemplate(testContactData)
    });
    console.log('✅ Contact Notification sent successfully!\n');

    console.log('🎉 All test emails sent successfully!');
    console.log('📬 Check your inbox at: belhachemiamohammed@gmail.com');
    
  } catch (error) {
    console.error('❌ Error sending emails:', error);
  }
}

// Run the tests
sendTestEmails();
