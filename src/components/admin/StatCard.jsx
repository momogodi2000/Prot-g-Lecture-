import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import { formatNumber } from '../../utils/formatters';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  trendValue,
  color = 'blue',
  linkTo 
}) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-500' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-500' },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-500' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-500' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-500' }
  };

  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <Card hover={!!linkTo} className={linkTo ? 'cursor-pointer' : ''}>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClass.bg}`}>
          <Icon className={`h-8 w-8 ${colorClass.text}`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(value)}
            </p>
            {trend && trendValue && (
              <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{trendValue}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

