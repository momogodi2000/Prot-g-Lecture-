import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, ClockIcon, UserIcon, MailIcon, PhoneIcon, MessageSquareIcon } from '../common/Icons';
import { reservationSchema } from '../../utils/validators';
import { useReservations } from '../../hooks/useReservations';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

const ReservationForm = ({ book, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { createReservation } = useReservations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(reservationSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await createReservation({
        ...data,
        livre_id: book.id
      });
      
      reset();
      onSuccess && onSuccess(result);
      onClose();
    } catch (error) {
      console.error('Reservation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const creneauOptions = [
    { value: '', label: 'Sélectionnez un créneau', disabled: true },
    { value: 'matin', label: 'Matin (9h - 13h)' },
    { value: 'apres_midi', label: 'Après-midi (14h - 18h)' }
  ];

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Réserver: ${book?.title || book?.titre}`}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Book Info */}
        <Card padding="sm" className="bg-gray-50 dark:bg-dark-elevated">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {book?.title || book?.titre}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {book?.author || book?.auteur_nom} • {book?.publication_year || book?.annee_publication}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {book?.copies_available || book?.exemplaires_disponibles} exemplaire(s) disponible(s)
              </p>
            </div>
          </div>
        </Card>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            icon={UserIcon}
            {...register('nom_visiteur')}
            error={errors.nom_visiteur?.message}
            placeholder="Jean Dupont"
            required
          />

          <Input
            label="Email"
            type="email"
            icon={MailIcon}
            {...register('email_visiteur')}
            error={errors.email_visiteur?.message}
            placeholder="jean@example.com"
            required
          />
        </div>

        <Input
          label="Téléphone"
          type="tel"
          icon={PhoneIcon}
          {...register('telephone_visiteur')}
          error={errors.telephone_visiteur?.message}
          placeholder="+237 6XX XX XX XX"
          helperText="Format: +237XXXXXXXXX ou 6XXXXXXXX"
          required
        />

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date souhaitée"
            type="date"
            icon={CalendarIcon}
            {...register('date_souhaitee')}
            error={errors.date_souhaitee?.message}
            min={minDate}
            max={maxDateStr}
            required
          />

          <Select
            label="Créneau horaire"
            {...register('creneau')}
            error={errors.creneau?.message}
            options={creneauOptions}
            required
          />
        </div>

        {/* Comment */}
        <Textarea
          label="Commentaire (optionnel)"
          icon={MessageSquareIcon}
          {...register('commentaire')}
          error={errors.commentaire?.message}
          placeholder="Avez-vous des remarques particulières ?"
          rows={3}
        />

        {/* Info Message */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            📍 <strong>Important:</strong> Cette réservation est pour une lecture sur place au centre.
            Vous recevrez une confirmation par email une fois validée par l'administrateur.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Confirmer la Réservation
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservationForm;

