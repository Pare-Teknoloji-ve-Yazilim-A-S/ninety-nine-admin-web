import { useToast } from '@/hooks/useToast';

type ToastFns = {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

interface HandleModalActionParams<T> {
  action: () => Promise<T>;
  onClose: () => void;
  onActionComplete?: () => void;
  toast: ToastFns;
  label: string;
  setLoading?: (loading: boolean) => void;
}

export async function handleModalAction<T>({
  action,
  onClose,
  onActionComplete,
  toast,
  label,
  setLoading,
}: HandleModalActionParams<T>) {
  setLoading?.(true);
  try {
    await action();
    toast.success('Başarılı', `${label} başarıyla gerçekleştirildi.`);
    onClose();
    onActionComplete?.();
  } catch (e) {
    toast.error('Hata', 'İşlem başarısız oldu. Lütfen tekrar deneyin.');
  } finally {
    setLoading?.(false);
  }
} 