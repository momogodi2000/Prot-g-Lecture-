import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

export const useReservations = (filters = {}) => {
  const { currentAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadReservations();
  }, [JSON.stringify(filters)]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.statut) params.statut = filters.statut;
      if (filters.date_souhaitee) params.date_souhaitee = filters.date_souhaitee;
      if (filters.livre_id) params.livre_id = filters.livre_id;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      const response = await apiService.getReservations(params);
      setReservations(response.reservations || []);
      setPagination(response.pagination || null);
    } catch (err) {
      console.error('Error loading reservations:', err);
      setError(err.message);
      setReservations([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const getReservation = async (id) => {
    try {
      const response = await apiService.getReservation(id);
      return response.reservation;
    } catch (err) {
      console.error('Error getting reservation:', err);
      throw err;
    }
  };

  const createReservation = async (reservationData) => {
    try {
      const response = await apiService.createReservation(reservationData);
      toast.success(`Réservation créée: ${response.numero_reservation}`);
      loadReservations();
      return { id: response.reservationId, numero_reservation: response.numero_reservation };
    } catch (err) {
      console.error('Error creating reservation:', err);
      toast.error(err.message || 'Erreur lors de la création de la réservation');
      throw err;
    }
  };

  const validateReservation = async (id) => {
    try {
      await apiService.updateReservationStatus(id, 'validee');
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
      await apiService.updateReservationStatus(id, 'refusee', motif);
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
      await apiService.updateReservationStatus(id, 'terminee');
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
      await apiService.updateReservationStatus(id, 'annulee');
      toast.success('Réservation annulée');
      loadReservations();
    } catch (err) {
      console.error('Error canceling reservation:', err);
      toast.error('Erreur lors de l\'annulation');
      throw err;
    }
  };

  const getReservationStats = async () => {
    try {
      // This would need to be implemented in the backend API
      // For now, return empty stats or fetch from API if endpoint exists
      return {
        total: 0,
        en_attente: 0,
        validees: 0,
        refusees: 0,
        terminees: 0,
      };
    } catch (err) {
      console.error('Error getting reservation stats:', err);
      return {};
    }
  };

  return {
    reservations,
    loading,
    error,
    pagination,
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

