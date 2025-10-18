import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    try {
      // Configure email transporter (for Gmail SMTP)
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'yvangodimomo@gmail.com',
          pass: process.env.EMAIL_PASSWORD || process.env.APP_PASSWORD // Use App Password for Gmail
        }
      });

      this.fromEmail = process.env.EMAIL_USER || 'yvangodimomo@gmail.com';
      this.adminEmail = process.env.ADMIN_EMAIL || 'yvangodimomo@gmail.com';
      this.emailConfigured = true;
    } catch (error) {
      console.warn('Email service not configured properly:', error.message);
      this.emailConfigured = false;
    }
  }

  // Send reservation notification to admin
  async sendReservationNotification(reservation, book) {
    if (!this.emailConfigured) {
      console.log('📧 Email not configured, skipping admin notification');
      return { success: false, error: 'Email not configured' };
    }
    
    try {
      const subject = `Nouvelle réservation - ${reservation.numero_reservation}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">Nouvelle réservation reçue</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Détails de la réservation</h3>
            <p><strong>Numéro:</strong> ${reservation.numero_reservation}</p>
            <p><strong>Livre:</strong> ${book.titre}</p>
            <p><strong>Auteur:</strong> ${book.auteur_nom || 'N/A'}</p>
            <p><strong>Date souhaitée:</strong> ${new Date(reservation.date_souhaitee).toLocaleDateString('fr-FR')}</p>
            <p><strong>Créneau:</strong> ${reservation.creneau === 'matin' ? 'Matin (9h-13h)' : 'Après-midi (14h-18h)'}</p>
          </div>

          <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Informations visiteur</h3>
            <p><strong>Nom:</strong> ${reservation.nom_visiteur}</p>
            <p><strong>Email:</strong> ${reservation.email_visiteur}</p>
            <p><strong>Téléphone:</strong> ${reservation.telephone_visiteur}</p>
            ${reservation.commentaire ? `<p><strong>Commentaire:</strong> ${reservation.commentaire}</p>` : ''}
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
            <p><strong>Action requise:</strong> Veuillez valider ou refuser cette réservation via le panneau d'administration.</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Cet email a été envoyé automatiquement par le système de réservation Protégé Lecture+
          </p>
        </div>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: this.adminEmail,
        subject: subject,
        html: html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Reservation notification sent to admin: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending reservation notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send reservation confirmation to user
  async sendReservationConfirmation(reservation, book) {
    if (!this.emailConfigured) {
      console.log('📧 Email not configured, skipping user confirmation');
      return { success: false, error: 'Email not configured' };
    }
    
    try {
      const subject = `Confirmation de réservation - ${reservation.numero_reservation}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">Réservation confirmée</h2>
          
          <p>Bonjour ${reservation.nom_visiteur},</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Détails de votre réservation</h3>
            <p><strong>Numéro:</strong> ${reservation.numero_reservation}</p>
            <p><strong>Livre:</strong> ${book.titre}</p>
            <p><strong>Auteur:</strong> ${book.auteur_nom || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date_souhaitee).toLocaleDateString('fr-FR')}</p>
            <p><strong>Créneau:</strong> ${reservation.creneau === 'matin' ? 'Matin (9h-13h)' : 'Après-midi (14h-18h)'}</p>
          </div>

          <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Prochaines étapes</h3>
            <p>Votre réservation a été enregistrée et sera traitée par notre équipe. Vous recevrez un email de confirmation une fois que votre réservation aura été validée.</p>
            ${reservation.commentaire ? `<p><strong>Votre commentaire:</strong> ${reservation.commentaire}</p>` : ''}
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Protégé Lecture+ - Centre de lecture et de culture
          </p>
        </div>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: reservation.email_visiteur,
        subject: subject,
        html: html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Reservation confirmation sent to ${reservation.email_visiteur}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending reservation confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  // Send reservation validation/refusal to user
  async sendReservationUpdate(reservation, book, status, adminNote = '') {
    if (!this.emailConfigured) {
      console.log('📧 Email not configured, skipping status update email');
      return { success: false, error: 'Email not configured' };
    }
    
    try {
      const isApproved = status === 'validee';
      const subject = `${isApproved ? 'Réservation validée' : 'Réservation refusée'} - ${reservation.numero_reservation}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${isApproved ? '#2d5a27' : '#dc3545'};">
            ${isApproved ? '✅ Réservation validée' : '❌ Réservation refusée'}
          </h2>
          
          <p>Bonjour ${reservation.nom_visiteur},</p>
          
          <div style="background-color: ${isApproved ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Statut de votre réservation</h3>
            <p><strong>Numéro:</strong> ${reservation.numero_reservation}</p>
            <p><strong>Livre:</strong> ${book.titre}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date_souhaitee).toLocaleDateString('fr-FR')}</p>
            <p><strong>Créneau:</strong> ${reservation.creneau === 'matin' ? 'Matin (9h-13h)' : 'Après-midi (14h-18h)'}</p>
            <p><strong>Statut:</strong> <span style="color: ${isApproved ? '#155724' : '#721c24'}; font-weight: bold;">
              ${isApproved ? 'VALIDÉE' : 'REFUSÉE'}
            </span></p>
          </div>

          ${isApproved ? `
            <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Informations de visite</h3>
              <p><strong>Adresse:</strong> Rond-Point Express, Yaoundé, Cameroun</p>
              <p><strong>Horaires:</strong> ${reservation.creneau === 'matin' ? '9h - 13h' : '14h - 18h'}</p>
              <p>Merci de respecter votre créneau horaire et de venir avec une pièce d'identité.</p>
            </div>
          ` : ''}

          ${adminNote ? `
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Message de l'équipe</h3>
              <p>${adminNote}</p>
            </div>
          ` : ''}

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Protégé Lecture+ - Centre de lecture et de culture
          </p>
        </div>
      `;

      const mailOptions = {
        from: this.fromEmail,
        to: reservation.email_visiteur,
        subject: subject,
        html: html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Reservation update sent to ${reservation.email_visiteur}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending reservation update:', error);
      return { success: false, error: error.message };
    }
  }

  // Test email configuration
  async testConnection() {
    if (!this.emailConfigured) {
      console.log('⚠️ Email service not configured');
      return false;
    }
    
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration error:', error);
      return false;
    }
  }
}

export default new EmailService();
