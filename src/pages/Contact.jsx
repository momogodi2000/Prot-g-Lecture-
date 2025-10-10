import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { contactSchema } from '../utils/validators';
import { useContact } from '../hooks/useContact';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { sendMessage } = useContact();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendMessage(data);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Contact error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sujetOptions = [
    { value: '', label: 'Sélectionnez un sujet', disabled: true },
    { value: 'Informations générales', label: 'Informations générales' },
    { value: 'Réservation de livre', label: 'Réservation de livre' },
    { value: 'Inscription à un groupe', label: 'Inscription à un groupe' },
    { value: 'Partenariat', label: 'Partenariat' },
    { value: 'Don de livres', label: 'Don de livres' },
    { value: 'Autre', label: 'Autre' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Contactez-nous
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Une question ? Une suggestion ? N'hésitez pas à nous contacter !
          </p>

          <div className="space-y-6">
            <Card>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Adresse
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Rond-Point Express<br />
                    Yaoundé, Cameroun
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <Phone className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Téléphone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    +237 6XX XX XX XX
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <Mail className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    contact@protegeqv.org
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <Card padding="lg">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Message envoyé !
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button onClick={() => setSuccess(false)} variant="outline">
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Envoyez-nous un message
                </h2>

                <Input
                  label="Nom complet"
                  {...register('nom_complet')}
                  error={errors.nom_complet?.message}
                  placeholder="Jean Dupont"
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="jean@example.com"
                  required
                />

                <Input
                  label="Téléphone (optionnel)"
                  type="tel"
                  {...register('telephone')}
                  error={errors.telephone?.message}
                  placeholder="+237 6XX XX XX XX"
                />

                <Select
                  label="Sujet"
                  {...register('sujet')}
                  error={errors.sujet?.message}
                  options={sujetOptions}
                  required
                />

                <Textarea
                  label="Message"
                  {...register('message')}
                  error={errors.message?.message}
                  placeholder="Écrivez votre message ici..."
                  rows={6}
                  helperText="Minimum 20 caractères"
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  icon={Send}
                >
                  Envoyer le Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;

