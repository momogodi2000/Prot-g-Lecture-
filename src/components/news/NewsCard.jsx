import { Link } from 'react-router-dom';
import { Newspaper, User, Calendar, Eye } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate, truncate } from '../../utils/formatters';
import storageService from '../../services/storage';

const NewsCard = ({ news, isAdmin = false }) => {
  const linkPath = isAdmin ? `/admin/news/${news.id}` : `/news/${news.id}`;

  return (
    <Link to={linkPath}>
      <Card hover className="h-full">
        {/* News Image */}
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
          {news.image_principale ? (
            <img
              src={storageService.getImageUrl(news.image_principale)}
              alt={news.titre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Newspaper className="h-16 w-16 text-blue-500 opacity-50" />
            </div>
          )}
        </div>

        {/* News Info */}
        <div className="space-y-3">
          {/* Category Badge */}
          {news.categorie && (
            <Badge variant="primary" size="sm">
              {news.categorie}
            </Badge>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
            {news.titre}
          </h3>

          {/* Resume */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {news.resume || truncate(news.contenu, 150)}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{news.auteur_nom}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(news.date_creation)}</span>
            </div>
          </div>

          {/* Views */}
          {news.nombre_vues > 0 && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Eye className="h-3 w-3 mr-1" />
              <span>{news.nombre_vues} vue(s)</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default NewsCard;

