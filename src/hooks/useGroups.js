import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

export const useGroups = (filters = {}) => {
  const { currentAdmin } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadGroups();
  }, [JSON.stringify(filters)]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.statut) params.statut = filters.statut;
      else if (!currentAdmin) params.statut = 'actif'; // Only show active groups to visitors
      if (filters.theme) params.theme = filters.theme;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      const response = await apiService.getGroups(params);
      setGroups(response.groups || []);
      setPagination(response.pagination || null);
    } catch (err) {
      console.error('Error loading groups:', err);
      setError(err.message);
      setGroups([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const getGroup = async (id) => {
    try {
      const response = await apiService.getGroup(id);
      return response.group;
    } catch (err) {
      console.error('Error getting group:', err);
      throw err;
    }
  };

  const createGroup = async (groupData) => {
    try {
      const response = await apiService.createGroup(groupData);
      toast.success('Groupe créé avec succès');
      loadGroups();
      return response.groupId;
    } catch (err) {
      console.error('Error creating group:', err);
      toast.error('Erreur lors de la création du groupe');
      throw err;
    }
  };

  const updateGroup = async (id, groupData) => {
    try {
      await apiService.updateGroup(id, groupData);
      toast.success('Groupe mis à jour avec succès');
      loadGroups();
    } catch (err) {
      console.error('Error updating group:', err);
      toast.error('Erreur lors de la mise à jour du groupe');
      throw err;
    }
  };

  const deleteGroup = async (id) => {
    try {
      await apiService.deleteGroup(id);
      toast.success('Groupe supprimé avec succès');
      loadGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
      toast.error('Erreur lors de la suppression du groupe');
      throw err;
    }
  };

  const getGroupMembers = async (groupId) => {
    try {
      const response = await apiService.getGroupMembers(groupId);
      return response.members || [];
    } catch (err) {
      console.error('Error getting group members:', err);
      return [];
    }
  };

  const addMember = async (groupId, memberData) => {
    try {
      await apiService.addGroupMember(groupId, memberData);
      toast.success('Membre ajouté avec succès');
      loadGroups();
    } catch (err) {
      console.error('Error adding member:', err);
      toast.error('Erreur lors de l\'ajout du membre');
      throw err;
    }
  };

  const removeMember = async (groupId, memberId) => {
    try {
      await apiService.removeGroupMember(groupId, memberId);
      toast.success('Membre retiré avec succès');
      loadGroups();
    } catch (err) {
      console.error('Error removing member:', err);
      toast.error('Erreur lors du retrait du membre');
      throw err;
    }
  };

  return {
    groups,
    loading,
    error,
    pagination,
    loadGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupMembers,
    addMember,
    removeMember
  };
};

