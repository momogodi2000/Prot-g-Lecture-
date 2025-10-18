import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

export const useContact = (filters = {}) => {
  const { currentAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadMessages();
  }, [JSON.stringify(filters)]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.statut) params.statut = filters.statut;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      const response = await apiService.getContactMessages(params);
      setMessages(response.messages || []);
      setPagination(response.pagination || null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const response = await apiService.submitContactMessage(messageData);
      toast.success('Message envoyé avec succès');
      return response.messageId;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Erreur lors de l\'envoi du message');
      throw err;
    }
  };

  const getMessage = async (id) => {
    try {
      const response = await apiService.getContactMessage(id);
      return response.message;
    } catch (err) {
      console.error('Error getting message:', err);
      throw err;
    }
  };

  const markAsRead = async (id) => {
    try {
      await getMessage(id); // This will mark as read when fetching
      toast.success('Message marqué comme lu');
      loadMessages();
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Erreur');
      throw err;
    }
  };

  const replyToMessage = async (id, reponse) => {
    try {
      await apiService.replyContactMessage(id, reponse);
      toast.success('Réponse enregistrée');
      loadMessages();
    } catch (err) {
      console.error('Error replying:', err);
      toast.error('Erreur lors de la réponse');
      throw err;
    }
  };

  const archiveMessage = async (id) => {
    try {
      await apiService.archiveContactMessage(id);
      toast.success('Message archivé');
      loadMessages();
    } catch (err) {
      console.error('Error archiving:', err);
      toast.error('Erreur');
      throw err;
    }
  };

  const getMessageStats = async () => {
    try {
      // This would need to be implemented in the backend API
      // For now, return empty stats or fetch from API if endpoint exists
      return {
        total: 0,
        non_lu: 0,
        lu: 0,
        repondu: 0
      };
    } catch (err) {
      return {};
    }
  };

  return {
    messages,
    loading,
    pagination,
    loadMessages,
    sendMessage,
    getMessage,
    markAsRead,
    replyToMessage,
    archiveMessage,
    getMessageStats
  };
};

