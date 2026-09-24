import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Removal',
  message = 'This action will remove the item from the Toyora admin list.',
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E9E6DC] p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#7A7A80] hover:text-[#19191B] rounded-lg hover:bg-[#FAF9F5] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#19191B]">{title}</h3>
            {itemName && (
              <p className="text-xs font-semibold text-[#D85A38] truncate max-w-xs">{itemName}</p>
            )}
          </div>
        </div>

        <p className="text-xs text-[#57585C] leading-relaxed">
          {message}
        </p>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F4F2EA]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E9E6DC] text-xs font-bold text-[#57585C] hover:bg-[#FAF9F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
