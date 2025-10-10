import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir continuer ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger', // danger, warning, info
  loading = false
}) => {
  const icons = {
    danger: <AlertTriangle className="w-12 h-12 text-red-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    info: <AlertTriangle className="w-12 h-12 text-blue-500" />
  };

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {icons[variant]}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        <div className="flex space-x-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={variant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

