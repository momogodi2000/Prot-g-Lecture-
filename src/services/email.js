// Email service for sending notifications
// In production, this should connect to a backend email service

class EmailService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || '';
  }

  // Send reservation confirmation email
  async sendReservationConfirmation(reservation, book) {
    const emailData = {
      to: reservation.email_visiteur,
      subject: 'Confirmation de réservation - Protégé Lecture+',
      template: 'reservation_confirmation',
      data: {
        nom: reservation.nom_visiteur,
        numeroReservation: reservation.numero_reservation,
        titreLivre: book.titre,
        dateSouhaitee: reservation.date_souhaitee,
        creneau: reservation.creneau === 'matin' ? 'Matin (9h-13h)' : 'Après-midi (14h-18h)',
        commentaire: reservation.commentaire
      }
    };

    return this.sendEmail(emailData);
  }

  // Send reservation validation email
  async sendReservationValidation(reservation, book) {
    const emailData = {
      to: reservation.email_visiteur,
      subject: 'Réservation validée - Protégé Lecture+',
      template: 'reservation_validated',
      data: {
        nom: reservation.nom_visiteur,
        numeroReservation: reservation.numero_reservation,
        titreLivre: book.titre,
        dateSouhaitee: reservation.date_souhaitee,
        creneau: reservation.creneau === 'matin' ? 'Matin (9h-13h)' : 'Après-midi (14h-18h)',
        adresseCentre: 'Rond-Point Express, Yaoundé, Cameroun'
      }
    };

    return this.sendEmail(emailData);
  }

  // Send reservation refusal email
  async sendReservationRefusal(reservation, book, motif) {
    const emailData = {
      to: reservation.email_visiteur,
      subject: 'Réservation refusée - Protégé Lecture+',
      template: 'reservation_refused',
      data: {
        nom: reservation.nom_visiteur,
        numeroReservation: reservation.numero_reservation,
        titreLivre: book.titre,
        motif: motif || 'Non spécifié'
      }
    };

    return this.sendEmail(emailData);
  }

  // Send new reservation notification to admins
  async sendNewReservationNotification(reservation, book, adminEmails) {
    const emailData = {
      to: adminEmails,
      subject: 'Nouvelle réservation - Protégé Lecture+',
      template: 'new_reservation_admin',
      data: {
        numeroReservation: reservation.numero_reservation,
        visiteur: reservation.nom_visiteur,
        email: reservation.email_visiteur,
        telephone: reservation.telephone_visiteur,
        titreLivre: book.titre,
        dateSouhaitee: reservation.date_souhaitee,
        creneau: reservation.creneau
      }
    };

    return this.sendEmail(emailData);
  }

  // Send contact message confirmation
  async sendContactConfirmation(message) {
    const emailData = {
      to: message.email,
      subject: 'Message reçu - Protégé Lecture+',
      template: 'contact_confirmation',
      data: {
        nom: message.nom_complet,
        sujet: message.sujet,
        message: message.message
      }
    };

    return this.sendEmail(emailData);
  }

  // Send newsletter subscription confirmation
  async sendNewsletterConfirmation(subscriber) {
    const emailData = {
      to: subscriber.email,
      subject: 'Bienvenue à la newsletter - Protégé Lecture+',
      template: 'newsletter_welcome',
      data: {
        nom: subscriber.nom_complet || 'Cher lecteur',
        token: subscriber.token_desinscription
      }
    };

    return this.sendEmail(emailData);
  }

  // Send newsletter campaign
  async sendNewsletterCampaign(campaign, subscribers) {
    const emailData = {
      to: subscribers.map(s => s.email),
      subject: campaign.objet,
      template: 'newsletter_campaign',
      data: {
        contenu: campaign.contenu
      }
    };

    return this.sendEmail(emailData);
  }

  // Send group invitation
  async sendGroupInvitation(member, group) {
    const emailData = {
      to: member.email,
      subject: `Inscription au groupe "${group.nom}" - Protégé Lecture+`,
      template: 'group_invitation',
      data: {
        nom: member.nom_complet,
        nomGroupe: group.nom,
        description: group.description,
        prochaineRencontre: group.prochaine_rencontre
      }
    };

    return this.sendEmail(emailData);
  }

  // Send password reset email
  async sendPasswordReset(email) {
    // This is handled by Firebase Auth
    console.log('Password reset email sent via Firebase to:', email);
    return { success: true };
  }

  // Generic send email function
  async sendEmail(emailData) {
    try {
      // In production, this should call a backend API
      console.log('📧 Email would be sent:', emailData);
      
      // Simulate API call
      // const response = await fetch(`${this.apiUrl}/api/send-email`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(emailData)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to send email');
      // }

      // return await response.json();

      // For now, just return success
      return { success: true, message: 'Email sent successfully (simulated)' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Get email template
  getEmailTemplate(templateName) {
    const templates = {
      reservation_confirmation: {
        subject: 'Confirmation de réservation',
        body: (data) => `
          Bonjour ${data.nom},
          
          Votre réservation a été enregistrée avec succès.
          
          Numéro de réservation: ${data.numeroReservation}
          Livre: ${data.titreLivre}
          Date souhaitée: ${data.dateSouhaitee}
          Créneau: ${data.creneau}
          
          Nous traiterons votre demande dans les plus brefs délais.
          
          Cordialement,
          L'équipe Protégé Lecture+
        `
      },
      reservation_validated: {
        subject: 'Réservation validée',
        body: (data) => `
          Bonjour ${data.nom},
          
          Votre réservation a été validée !
          
          Numéro: ${data.numeroReservation}
          Livre: ${data.titreLivre}
          Date: ${data.dateSouhaitee}
          Créneau: ${data.creneau}
          
          Rendez-vous au ${data.adresseCentre}
          
          À bientôt !
          L'équipe Protégé Lecture+
        `
      }
    };

    return templates[templateName];
  }
}

export default new EmailService();

