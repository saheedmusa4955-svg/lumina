import nodemailer from 'nodemailer';
import prisma from '../db';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    // 1. Fetch settings from DB
    const settingsRaw = await prisma.setting.findMany();
    const config: Record<string, string> = {};
    settingsRaw.forEach(s => {
      config[s.key] = s.value;
    });

    const provider = config['EMAIL_PROVIDER'] || 'SMTP';
    const fromAddress = config['SMTP_FROM'] || process.env.SMTP_FROM || '"Lumina Bank" <noreply@luminabank.com>';

    console.log(`Preparing to send email to ${to} via ${provider}`);

    if (provider === 'BREVO' && config['BREVO_API_KEY']) {
      // Send using Brevo HTTP API
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': config['BREVO_API_KEY'],
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { email: fromAddress.replace(/^".*"\s+</, '').replace(/>$/, ''), name: 'Lumina Bank' },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Brevo API Error:', errorData);
      } else {
        console.log(`\n\n=== BREVO API EMAIL SENT TO ${to} ===`);
        console.log(`Subject: ${subject}`);
        console.log(`===================================\n\n`);
      }
      return;
    }

    // SMTP logic (either configured via Admin Panel or fallback to environment or fallback to ethereal test)
    let transporter: nodemailer.Transporter | null = null;

    if (config['SMTP_HOST'] && config['SMTP_USER'] && config['SMTP_PASS']) {
      transporter = nodemailer.createTransport({
        host: config['SMTP_HOST'],
        port: parseInt(config['SMTP_PORT'] || '587'),
        secure: config['SMTP_PORT'] === '465' || config['SMTP_SECURE'] === 'true',
        auth: {
          user: config['SMTP_USER'],
          pass: config['SMTP_PASS']
        }
      });
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    if (!transporter) {
      // Fallback to test/log
      console.log(`\n\n=== NO SMTP/BREVO CONFIGURED: FALLBACK TO CONSOLE ===`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content (HTML omitted for brevity)`);
      console.log(`===================================\n\n`);
      return;
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html
    });

    console.log(`\n\n=== SMTP EMAIL SENT TO ${to} ===`);
    console.log(`Subject: ${subject}`);
    console.log(`Message ID: ${info.messageId}`);
    if (!process.env.SMTP_HOST && !config['SMTP_HOST']) {
      try {
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      } catch (e) {}
    }
    console.log(`===================================\n\n`);

  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Very simple email templates matching Lumina Bank branding
export const templates = {
  welcome: (name: string) => `
    <div style="font-family: Arial, sans-serif; max-w-lg mx-auto; background-color: #0d1117; color: #fff; padding: 20px; border-radius: 10px;">
      <h1 style="color: #6366f1;">Welcome to Lumina Bank</h1>
      <p>Hi ${name},</p>
      <p>Your account has been successfully created. You can now log in and complete your KYC verification to access all features.</p>
      <p style="color: #8b949e; font-size: 12px; margin-top: 30px;">- The Lumina Bank Team</p>
    </div>
  `,
  transferSent: (amount: number, recipient: string) => `
    <div style="font-family: Arial, sans-serif; max-w-lg mx-auto; background-color: #0d1117; color: #fff; padding: 20px; border-radius: 10px;">
      <h1 style="color: #6366f1;">Transfer Sent</h1>
      <p>You have successfully sent <strong>$${amount.toFixed(2)}</strong> to ${recipient}.</p>
      <p style="color: #8b949e; font-size: 12px; margin-top: 30px;">- The Lumina Bank Team</p>
    </div>
  `,
  transferReceived: (amount: number, sender: string) => `
    <div style="font-family: Arial, sans-serif; max-w-lg mx-auto; background-color: #0d1117; color: #fff; padding: 20px; border-radius: 10px;">
      <h1 style="color: #6366f1;">Funds Received</h1>
      <p>You have received a transfer of <strong>$${amount.toFixed(2)}</strong> from ${sender}.</p>
      <p style="color: #8b949e; font-size: 12px; margin-top: 30px;">- The Lumina Bank Team</p>
    </div>
  `
};
