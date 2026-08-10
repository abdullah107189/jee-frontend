import { toast as sonnerToast } from 'sonner';

type ToastVariant = 'default' | 'destructive' | 'success';

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

function showToast(options: ToastOptions) {
  const message = options.description ? `${options.title ?? ''}${options.title ? '\n' : ''}${options.description}` : options.title ?? '';

  if (options.variant === 'destructive') {
    sonnerToast.error(message);
    return;
  }

  if (options.variant === 'success') {
    sonnerToast.success(message);
    return;
  }

  sonnerToast(message);
}

export function useToast() {
  return {
    toast: showToast,
  };
}