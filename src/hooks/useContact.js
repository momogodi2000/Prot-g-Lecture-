import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import emailService from '../services/email';

export const useContact = (filters = {}) => {
  const { db } = useDatabase();
  const { currentAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [JSON.stringify(filters)]);

  const loadMessages = () => {
    try {
      setLoading(true);
      let query = `
        SELECT 
          m.*,
          a.nom_complet as lecteur_nom,
          r.nom_complet as repondeur_nom
        FROM messages_contact m
        LEFT JOIN administrateurs a ON m.lu_par = a.id
        LEFT JOIN administrateurs r ON m.repondu_par = r.id
        WHERE 1=1
      `;
      
      const params = [];

      if (filters.statut) {
        query += ` AND m.statut = ?`;
        params.push(filters.statut);
      }

      if (filters.search) {
        query += ` AND (m.nom_complet LIKE ? OR m.email LIKE ? OR m.sujet LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ` ORDER BY m.date_envoi DESC`;

      const results = db.query(query, params);
      setMessages(results || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const query = `
        INSERT INTO messages_contact (
          nom_complet, email, telephone, sujet, message
        ) VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        messageData.nom_complet,
        messageData.email,
        messageData.telephone || null,
        messageData.sujet,
        messageData.message
      ]);

      // Send confirmation email
      await emailService.sendContactConfirmation(messageData);

      toast.success('Message envoyé avec succès');
      return db.getLastInsertId();
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Erreur lors de l\'envoi du message');
      throw err;
    }
  };

  const markAsRead = (id) => {
    try {
      db.run(
        'UPDATE messages_contact SET statut = ?, lu_par = ?, date_lecture = ? WHERE id = ?',
        ['lu', currentAdmin?.id, new Date().toISOString(), id]
      );
      toast.success('Message marqué comme lu');
      loadMessages();
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Erreur');
      throw err;
    }
  };

  const replyToMessage = (id, reponse) => {
    try {
      db.run(
        `UPDATE messages_contact SET 
          statut = ?, reponse = ?, date_reponse = ?, repondu_par = ?
        WHERE id = ?`,
        ['repondu', reponse, new Date().toISOString(), currentAdmin?.id, id]
      );
      toast.success('Réponse enregistrée');
      loadMessages();
    } catch (err) {
      console.error('Error replying:', err);
      toast.error('Erreur lors de la réponse');
      throw err;
    }
  };

  const archiveMessage = (id) => {
    try {
      db.run('UPDATE messages_contact SET statut = ? WHERE id = ?', ['archive', id]);
      toast.success('Message archivé');
      loadMessages();
    } catch (err) {
      console.error('Error archiving:', err);
      toast.error('Erreur');
      throw err;
    }
  };

  const getMessageStats = () => {
    try {
      return {
        total: db.queryOne('SELECT COUNT(*) as count FROM messages_contact')?.count || 0,
        non_lu: db.queryOne('SELECT COUNT(*) as count FROM messages_contact WHERE statut = ?', ['non_lu'])?.count || 0,
        lu: db.queryOne('SELECT COUNT(*) as count FROM messages_contact WHERE statut = ?', ['lu'])?.count || 0,
        repondu: db.queryOne('SELECT COUNT(*) as count FROM messages_contact WHERE statut = ?', ['repondu'])?.count || 0
      };
    } catch (err) {
      return {};
    }
  };

  return {
    messages,
    loading,
    loadMessages,
    sendMessage,
    markAsRead,
    replyToMessage,
    archiveMessage,
    getMessageStats
  };
};

