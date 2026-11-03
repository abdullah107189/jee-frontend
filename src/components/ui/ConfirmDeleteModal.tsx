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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-50 w-full max-w-md transform overflow-hidden rounded-2xl sm:rounded-3xl bg-card border border-border text-card-foreground p-6 text-left align-middle shadow-2xl transition-all sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 dark:bg-rose-950/60 sm:h-14 sm:w-14">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-rose-400 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold leading-6 text-foreground">
              {title}
            </h3>
          </div>
        </div>

        <div className="mt-2 mb-8">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          {itemName && (
            <div className="mt-3 p-3 bg-muted/50 rounded-xl border border-border">
              <p className="text-sm font-semibold text-foreground break-all">
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
            className="w-full sm:w-auto h-11 rounded-xl font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto h-11 rounded-xl shadow-lg shadow-red-500/20 font-bold"
          >
            {isLoading ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </div>
      </div>
    </div>
  );
}
