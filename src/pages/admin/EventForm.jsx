import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    description_fr: '',
    description_en: '',
    event_date: '',
    event_time: '',
    location: '',
    organizer: '',
    max_participants: '',
    registration_deadline: '',
    image: null,
  });

  const loadEvent = useCallback(async () => {
    try {
      const result = db.exec(`SELECT * FROM events WHERE id = ?`, [id]);
      if (result.length > 0) {
        const columns = result[0].columns;
        const values = result[0].values[0];
        const event = {};
        columns.forEach((col, idx) => {
          event[col] = values[idx];
        });

        // Format dates for input fields
        const eventDate = event.event_date ? event.event_date.split('T')[0] : '';
        const registrationDate = event.registration_deadline ? event.registration_deadline.split('T')[0] : '';

        setFormData({
          title_fr: event.title_fr || '',
          title_en: event.title_en || '',
          description_fr: event.description_fr || '',
          description_en: event.description_en || '',
          event_date: eventDate,
          event_time: event.event_time || '',
          location: event.location || '',
          organizer: event.organizer || '',
          max_participants: event.max_participants || '',
          registration_deadline: registrationDate,
          image: event.image || null,
        });

        if (event.image) {
          setImagePreview(event.image);
        }
      }
    } catch (error) {
      console.error('Error loading event:', error);
      toast.error('Erreur lors du chargement de l\'événement');
    }
  }, [db, id]);

  useEffect(() => {
    if (id && db) {
      loadEvent();
    }
  }, [id, db, loadEvent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5 Mo');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title_fr || !formData.event_date || !formData.location) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      // Format dates to ISO string
      const eventDateTime = new Date(`${formData.event_date}T${formData.event_time || '00:00'}`).toISOString();
      const registrationDeadline = formData.registration_deadline 
        ? new Date(formData.registration_deadline).toISOString() 
        : null;

      if (id) {
        // Update existing event
        db.run(`
          UPDATE events SET
            title_fr = ?,
            title_en = ?,
            description_fr = ?,
            description_en = ?,
            event_date = ?,
            event_time = ?,
            location = ?,
            organizer = ?,
            max_participants = ?,
            registration_deadline = ?,
            image = ?
          WHERE id = ?
        `, [
          formData.title_fr,
          formData.title_en || null,
          formData.description_fr || null,
          formData.description_en || null,
          eventDateTime,
          formData.event_time || null,
          formData.location,
          formData.organizer || null,
          formData.max_participants ? parseInt(formData.max_participants) : null,
          registrationDeadline,
          formData.image || null,
          id
        ]);
        toast.success('Événement mis à jour avec succès');
      } else {
        // Create new event
        db.run(`
          INSERT INTO events (
            title_fr, title_en, description_fr, description_en,
            event_date, event_time, location, organizer,
            max_participants, registration_deadline, image
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          formData.title_fr,
          formData.title_en || null,
          formData.description_fr || null,
          formData.description_en || null,
          eventDateTime,
          formData.event_time || null,
          formData.location,
          formData.organizer || null,
          formData.max_participants ? parseInt(formData.max_participants) : null,
          registrationDeadline,
          formData.image || null
        ]);
        toast.success('Événement créé avec succès');
      }

      navigate('/admin/events');
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id ? 'Modifier l\'Événement' : 'Nouvel Événement'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* French Title */}
          <Input
            label="Titre (Français) *"
            name="title_fr"
            value={formData.title_fr}
            onChange={handleInputChange}
            required
          />

          {/* English Title */}
          <Input
            label="Titre (Anglais)"
            name="title_en"
            value={formData.title_en}
            onChange={handleInputChange}
          />

          {/* French Description */}
          <Textarea
            label="Description (Français)"
            name="description_fr"
            value={formData.description_fr}
            onChange={handleInputChange}
            rows={4}
          />

          {/* English Description */}
          <Textarea
            label="Description (Anglais)"
            name="description_en"
            value={formData.description_en}
            onChange={handleInputChange}
            rows={4}
          />

          {/* Event Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date de l'Événement *"
              name="event_date"
              type="date"
              value={formData.event_date}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Heure de l'Événement"
              name="event_time"
              type="time"
              value={formData.event_time}
              onChange={handleInputChange}
            />
          </div>

          {/* Location */}
          <Input
            label="Lieu *"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />

          {/* Organizer */}
          <Input
            label="Organisateur"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
          />

          {/* Max Participants and Registration Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre Maximum de Participants"
              name="max_participants"
              type="number"
              min="1"
              value={formData.max_participants}
              onChange={handleInputChange}
            />
            <Input
              label="Date Limite d'Inscription"
              name="registration_deadline"
              type="date"
              value={formData.registration_deadline}
              onChange={handleInputChange}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image de l'Événement
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                dark:file:bg-primary-900 dark:file:text-primary-300
                hover:file:bg-primary-100 dark:hover:file:bg-primary-800
                cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/events')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (id ? 'Mettre à Jour' : 'Créer l\'Événement')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
