import Badge from '../common/Badge';
import { formatReservationStatus } from '../../utils/formatters';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusInfo = formatReservationStatus(status);
  
  const variantMap = {
    yellow: 'warning',
    green: 'success',
    red: 'danger',
    blue: 'info',
    gray: 'default'
  };

  return (
    <Badge variant={variantMap[statusInfo.color]} size={size}>
      {statusInfo.text}
    </Badge>
  );
};

export default StatusBadge;

