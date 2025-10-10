import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useGroups = (filters = {}) => {
  const { db } = useDatabase();
  const { currentAdmin } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGroups();
  }, [JSON.stringify(filters)]);

  const loadGroups = () => {
    try {
      setLoading(true);
      let query = `
        SELECT 
          g.*,
          l.titre as livre_du_mois_titre,
          a.nom_complet as createur_nom
        FROM groupes_lecture g
        LEFT JOIN livres l ON g.livre_du_mois = l.id
        LEFT JOIN administrateurs a ON g.cree_par = a.id
        WHERE 1=1
      `;
      
      const params = [];

      if (filters.statut) {
        query += ` AND g.statut = ?`;
        params.push(filters.statut);
      }

      if (filters.theme) {
        query += ` AND g.theme LIKE ?`;
        params.push(`%${filters.theme}%`);
      }

      if (filters.search) {
        query += ` AND (g.nom LIKE ? OR g.description LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ` ORDER BY g.date_creation DESC`;

      const results = db.query(query, params);
      setGroups(results || []);
      setError(null);
    } catch (err) {
      console.error('Error loading groups:', err);
      setError(err.message);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const getGroup = (id) => {
    try {
      const query = `
        SELECT 
          g.*,
          l.titre as livre_du_mois_titre,
          l.auteur_id,
          aut.nom_complet as livre_auteur_nom,
          a.nom_complet as createur_nom
        FROM groupes_lecture g
        LEFT JOIN livres l ON g.livre_du_mois = l.id
        LEFT JOIN auteurs aut ON l.auteur_id = aut.id
        LEFT JOIN administrateurs a ON g.cree_par = a.id
        WHERE g.id = ?
      `;
      return db.queryOne(query, [id]);
    } catch (err) {
      console.error('Error getting group:', err);
      throw err;
    }
  };

  const createGroup = (groupData) => {
    try {
      const query = `
        INSERT INTO groupes_lecture (
          nom, description, theme, image_couverture, 
          prochaine_rencontre, lieu_rencontre, livre_du_mois,
          cree_par, statut
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        groupData.nom,
        groupData.description,
        groupData.theme,
        groupData.image_couverture || null,
        groupData.prochaine_rencontre || null,
        groupData.lieu_rencontre || null,
        groupData.livre_du_mois || null,
        currentAdmin?.id,
        groupData.statut || 'actif'
      ]);

      const id = db.getLastInsertId();
      toast.success('Groupe créé avec succès');
      loadGroups();
      return id;
    } catch (err) {
      console.error('Error creating group:', err);
      toast.error('Erreur lors de la création du groupe');
      throw err;
    }
  };

  const updateGroup = (id, groupData) => {
    try {
      const query = `
        UPDATE groupes_lecture SET
          nom = ?, description = ?, theme = ?, 
          image_couverture = ?, prochaine_rencontre = ?,
          lieu_rencontre = ?, livre_du_mois = ?, statut = ?
        WHERE id = ?
      `;
      
      db.run(query, [
        groupData.nom,
        groupData.description,
        groupData.theme,
        groupData.image_couverture,
        groupData.prochaine_rencontre,
        groupData.lieu_rencontre,
        groupData.livre_du_mois,
        groupData.statut,
        id
      ]);

      toast.success('Groupe mis à jour avec succès');
      loadGroups();
    } catch (err) {
      console.error('Error updating group:', err);
      toast.error('Erreur lors de la mise à jour du groupe');
      throw err;
    }
  };

  const deleteGroup = (id) => {
    try {
      db.run('DELETE FROM groupes_lecture WHERE id = ?', [id]);
      toast.success('Groupe supprimé avec succès');
      loadGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
      toast.error('Erreur lors de la suppression du groupe');
      throw err;
    }
  };

  const getGroupMembers = (groupId) => {
    try {
      const query = `
        SELECT * FROM membres_groupes 
        WHERE groupe_id = ? AND statut = ?
        ORDER BY date_inscription DESC
      `;
      return db.query(query, [groupId, 'actif']);
    } catch (err) {
      console.error('Error getting group members:', err);
      return [];
    }
  };

  const addMember = (groupId, memberData) => {
    try {
      const query = `
        INSERT INTO membres_groupes (
          groupe_id, nom_complet, email, telephone
        ) VALUES (?, ?, ?, ?)
      `;
      
      db.run(query, [
        groupId,
        memberData.nom_complet,
        memberData.email,
        memberData.telephone || null
      ]);

      toast.success('Membre ajouté avec succès');
      loadGroups();
    } catch (err) {
      console.error('Error adding member:', err);
      toast.error('Erreur lors de l\'ajout du membre');
      throw err;
    }
  };

  const removeMember = (memberId) => {
    try {
      db.run('DELETE FROM membres_groupes WHERE id = ?', [memberId]);
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

