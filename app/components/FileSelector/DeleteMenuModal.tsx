import { ConfirmModal } from '../ui/ConfirmModal';

interface DeleteMenuModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteMenuModal({ isOpen, onConfirm, onCancel }: DeleteMenuModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Delete Menu"
      message="Are you sure you want to delete this menu? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
} 