import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:p-8 m-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:h-14 sm:w-14">
            <AlertTriangle className="h-6 w-6 text-red-600 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold leading-6 text-slate-900">
              {title}
            </h3>
          </div>
        </div>

        <div className="mt-2 mb-8">
          <p className="text-sm text-slate-500">
            {description}
          </p>
          {itemName && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm font-semibold text-slate-800 break-all">
                {itemName}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto h-12 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto h-12 rounded-xl shadow-lg shadow-red-500/20"
          >
            {isLoading ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </div>
      </div>
    </div>
  );
}
