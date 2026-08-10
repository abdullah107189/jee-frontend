declare module '@/hooks/use-toast' {
  export type ToastVariant = 'default' | 'destructive' | 'success';

  export type ToastOptions = {
    title?: string;
    description?: string;
    variant?: ToastVariant;
  };

  export function useToast(): {
    toast: (options: ToastOptions) => void;
  };
}