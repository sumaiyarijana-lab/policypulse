const nodemailer = require('nodemailer');
// const twilio = require('twilio'); // Commented out to avoid crashing without valid API keys

// Notification Service
class NotificationService {
  constructor() {
    this.io = null;
    
    // Setup NodeMailer Transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Twilio setup (placeholder keys)
    // this.twilioClient = twilio(process.env.TWILIO_SID || 'ACxxxx', process.env.TWILIO_AUTH_TOKEN || 'xxxx');
  }

  setIO(io) {
    this.io = io;
  }

  emitNewComplaint(complaint) {
    if (this.io) {
      console.log(`[Notification Engine] Emitting new complaint real-time: ${complaint.complaintId}`);
      this.io.emit('new-complaint', complaint);
    }
  }

  async sendAlert(payload) {
    const { type, title, message, priority, targetEmail, targetPhone } = payload;
    
    console.log(`[Notification Engine] Processing ${priority} alert: ${title}`);

    // 1. Send WebSocket (Real-Time In-App Alert)
    if (this.io) {
      this.io.emit('new-alert', {
        type, // e.g., 'violation', 'complaint', 'emergency', 'system'
        title,
        message,
        priority, // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
        timestamp: new Date()
      });
    }

    // 2. Send Email Alert (If priority is high or email provided)
    if (targetEmail || priority === 'CRITICAL' || priority === 'HIGH') {
      const emailTo = targetEmail || 'admin@policypulse.gov'; // Default admin email
      try {
        await this.transporter.sendMail({
          from: '"PolicyPulse Alert System" <alerts@policypulse.gov>',
          to: emailTo,
          subject: `[${priority}] ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
              <h2 style="color: ${priority === 'CRITICAL' ? 'red' : 'orange'};">${title}</h2>
              <p><strong>Type:</strong> ${type}</p>
              <p><strong>Message:</strong> ${message}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <hr/>
              <p style="font-size: 12px; color: #888;">This is an automated alert from the PolicyPulse environmental compliance engine.</p>
            </div>
          `
        });
        console.log(`[Notification Engine] Email sent to ${emailTo}`);
      } catch (err) {
        console.error(`[Notification Engine] Email failed: ${err.message}`);
      }
    }

    // 3. Send SMS Integration (If CRITICAL)
    if (priority === 'CRITICAL' && targetPhone) {
      try {
        /* 
        await this.twilioClient.messages.create({
          body: `[PolicyPulse CRITICAL]: ${title} - ${message}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: targetPhone
        });
        */
        console.log(`[Notification Engine] SMS sent to ${targetPhone} (Simulated)`);
      } catch (err) {
        console.error(`[Notification Engine] SMS failed: ${err.message}`);
      }
    }
  }
}

const notificationService = new NotificationService();
module.exports = notificationService;
