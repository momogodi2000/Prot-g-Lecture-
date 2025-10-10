import { X } from 'lucide-react';
import Select from '../common/Select';
import Button from '../common/Button';
import Card from '../common/Card';
import { useCategories } from '../../hooks/useBooks';
import { BOOK_STATUS_OPTIONS, LANGUAGE_OPTIONS } from '../../utils/constants';

const BookFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const { categories } = useCategories();

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    ...BOOK_STATUS_OPTIONS
  ];

  const langueOptions = [
    { value: '', label: 'Toutes les langues' },
    ...LANGUAGE_OPTIONS
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filtres
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClearFilters}
          >
            Effacer
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <Select
          label="Catégorie"
          value={filters.categorie_id || ''}
          onChange={(e) => handleChange('categorie_id', e.target.value)}
          options={[
            { value: '', label: 'Toutes les catégories' },
            ...categories.map(cat => ({
              value: cat.id.toString(),
              label: cat.nom
            }))
          ]}
        />

        {/* Status Filter */}
        <Select
          label="Disponibilité"
          value={filters.statut || ''}
          onChange={(e) => handleChange('statut', e.target.value)}
          options={statusOptions}
        />

        {/* Language Filter */}
        <Select
          label="Langue"
          value={filters.langue || ''}
          onChange={(e) => handleChange('langue', e.target.value)}
          options={langueOptions}
        />
      </div>
    </Card>
  );
};

export default BookFilters;

