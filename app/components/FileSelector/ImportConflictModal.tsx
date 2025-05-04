import { ConfirmModal } from '../ui/ConfirmModal';
import { MenuData } from '../../types';

interface ImportConflictProps {
  conflict: {
    exists: boolean;
    isNewer: boolean;
    data: MenuData;
    id: string;
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ImportConflictModal({ conflict, onConfirm, onCancel }: ImportConflictProps) {
  if (!conflict) return null;

  return (
    <ConfirmModal
      isOpen={true}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={conflict.isNewer ? "Older version exists" : "Newer version exists"}
      message={
        conflict.isNewer
          ? "You're importing a newer version of a menu that already exists. Would you like to update the existing menu?"
          : "You're importing an older version of a menu that already exists. The existing menu is newer than the one you're importing. Would you like to replace the existing newer version with this older version?"
      }
      confirmText={conflict.isNewer ? "Update Menu" : "Replace with Older Version"}
      cancelText="Open Existing Menu"
    />
  );
} 