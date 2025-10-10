import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import { generateReservationNumber } from '../utils/formatters';
import toast from 'react-hot-toast';
import emailService from '../services/email';

export const useReservations = (filters = {}) => {
  const { db } = useDatabase();
  const { currentAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservations();
  }, [JSON.stringify(filters)]);

  const loadReservations = () => {
    try {
      setLoading(true);
      let query = `
        SELECT 
          r.*,
          l.titre as livre_titre,
          l.auteur_id,
          a.nom_complet as auteur_nom,
          adm.nom_complet as validateur_nom
        FROM reservations r
        LEFT JOIN livres l ON r.livre_id = l.id
        LEFT JOIN auteurs a ON l.auteur_id = a.id
        LEFT JOIN administrateurs adm ON r.valide_par = adm.id
        WHERE 1=1
      `;
      
      const params = [];

      // Apply filters
      if (filters.statut) {
        query += ` AND r.statut = ?`;
        params.push(filters.statut);
      }

      if (filters.date_souhaitee) {
        query += ` AND r.date_souhaitee = ?`;
        params.push(filters.date_souhaitee);
      }

      if (filters.livre_id) {
        query += ` AND r.livre_id = ?`;
        params.push(filters.livre_id);
      }

      if (filters.search) {
        query += ` AND (r.nom_visiteur LIKE ? OR r.email_visiteur LIKE ? OR r.numero_reservation LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ` ORDER BY r.date_creation DESC`;

      const results = db.query(query, params);
      setReservations(results || []);
      setError(null);
    } catch (err) {
      console.error('Error loading reservations:', err);
      setError(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const getReservation = (id) => {
    try {
      const query = `
        SELECT 
          r.*,
          l.titre as livre_titre,
          l.image_couverture,
          a.nom_complet as auteur_nom,
          adm.nom_complet as validateur_nom
        FROM reservations r
        LEFT JOIN livres l ON r.livre_id = l.id
        LEFT JOIN auteurs a ON l.auteur_id = a.id
        LEFT JOIN administrateurs adm ON r.valide_par = adm.id
        WHERE r.id = ?
      `;
      return db.queryOne(query, [id]);
    } catch (err) {
      console.error('Error getting reservation:', err);
      throw err;
    }
  };

  const createReservation = async (reservationData) => {
    try {
      // Generate unique reservation number
      const numeroReservation = generateReservationNumber();

      // Check availability
      const book = db.queryOne('SELECT * FROM livres WHERE id = ?', [reservationData.livre_id]);
      if (!book || book.exemplaires_disponibles < 1) {
        throw new Error('Ce livre n\'est pas disponible');
      }

      // Insert reservation
      const query = `
        INSERT INTO reservations (
          numero_reservation, livre_id, nom_visiteur, email_visiteur,
          telephone_visiteur, date_souhaitee, creneau, commentaire, statut
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        numeroReservation,
        reservationData.livre_id,
        reservationData.nom_visiteur,
        reservationData.email_visiteur,
        reservationData.telephone_visiteur,
        reservationData.date_souhaitee,
        reservationData.creneau,
        reservationData.commentaire || null,
        'en_attente'
      ]);

      const id = db.getLastInsertId();

      // Update book availability
      db.run(
        'UPDATE livres SET exemplaires_disponibles = exemplaires_disponibles - 1 WHERE id = ?',
        [reservationData.livre_id]
      );

      // Send confirmation email
      await emailService.sendReservationConfirmation({ 
        ...reservationData, 
        numero_reservation: numeroReservation 
      }, book);

      toast.success(`Réservation créée: ${numeroReservation}`);
      loadReservations();
      
      return { id, numero_reservation: numeroReservation };
    } catch (err) {
      console.error('Error creating reservation:', err);
      toast.error(err.message || 'Erreur lors de la création de la réservation');
      throw err;
    }
  };

  const validateReservation = async (id) => {
    try {
      const reservation = getReservation(id);
      if (!reservation) throw new Error('Réservation introuvable');

      db.run(
        `UPDATE reservations SET 
          statut = ?, 
          date_validation = ?,
          valide_par = ?
        WHERE id = ?`,
        ['validee', new Date().toISOString(), currentAdmin?.id, id]
      );

      // Get book info
      const book = db.queryOne('SELECT * FROM livres WHERE id = ?', [reservation.livre_id]);

      // Send validation email
      await emailService.sendReservationValidation(reservation, book);

      toast.success('Réservation validée');
      loadReservations();
    } catch (err) {
      console.error('Error validating reservation:', err);
      toast.error('Erreur lors de la validation');
      throw err;
    }
  };

  const refuseReservation = async (id, motif) => {
    try {
      const reservation = getReservation(id);
      if (!reservation) throw new Error('Réservation introuvable');

      db.run(
        `UPDATE reservations SET 
          statut = ?, 
          remarque_admin = ?,
          valide_par = ?
        WHERE id = ?`,
        ['refusee', motif, currentAdmin?.id, id]
      );

      // Restore book availability
      db.run(
        'UPDATE livres SET exemplaires_disponibles = exemplaires_disponibles + 1 WHERE id = ?',
        [reservation.livre_id]
      );

      // Get book info
      const book = db.queryOne('SELECT * FROM livres WHERE id = ?', [reservation.livre_id]);

      // Send refusal email
      await emailService.sendReservationRefusal(reservation, book, motif);

      toast.success('Réservation refusée');
      loadReservations();
    } catch (err) {
      console.error('Error refusing reservation:', err);
      toast.error('Erreur lors du refus');
      throw err;
    }
  };

  const completeReservation = async (id) => {
    try {
      db.run(
        `UPDATE reservations SET 
          statut = ?, 
          date_visite = ?
        WHERE id = ?`,
        ['terminee', new Date().toISOString(), id]
      );

      toast.success('Réservation marquée comme terminée');
      loadReservations();
    } catch (err) {
      console.error('Error completing reservation:', err);
      toast.error('Erreur lors de la finalisation');
      throw err;
    }
  };

  const cancelReservation = async (id) => {
    try {
      const reservation = getReservation(id);
      if (!reservation) throw new Error('Réservation introuvable');

      db.run(
        'UPDATE reservations SET statut = ? WHERE id = ?',
        ['annulee', id]
      );

      // Restore book availability if not already validated
      if (reservation.statut === 'en_attente' || reservation.statut === 'validee') {
        db.run(
          'UPDATE livres SET exemplaires_disponibles = exemplaires_disponibles + 1 WHERE id = ?',
          [reservation.livre_id]
        );
      }

      toast.success('Réservation annulée');
      loadReservations();
    } catch (err) {
      console.error('Error canceling reservation:', err);
      toast.error('Erreur lors de l\'annulation');
      throw err;
    }
  };

  const getReservationStats = () => {
    try {
      const stats = {
        total: db.queryOne('SELECT COUNT(*) as count FROM reservations')?.count || 0,
        en_attente: db.queryOne('SELECT COUNT(*) as count FROM reservations WHERE statut = ?', ['en_attente'])?.count || 0,
        validees: db.queryOne('SELECT COUNT(*) as count FROM reservations WHERE statut = ?', ['validee'])?.count || 0,
        refusees: db.queryOne('SELECT COUNT(*) as count FROM reservations WHERE statut = ?', ['refusee'])?.count || 0,
        terminees: db.queryOne('SELECT COUNT(*) as count FROM reservations WHERE statut = ?', ['terminee'])?.count || 0,
      };
      return stats;
    } catch (err) {
      console.error('Error getting reservation stats:', err);
      return {};
    }
  };

  return {
    reservations,
    loading,
    error,
    loadReservations,
    getReservation,
    createReservation,
    validateReservation,
    refuseReservation,
    completeReservation,
    cancelReservation,
    getReservationStats
  };
};

