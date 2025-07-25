import { ToastFns } from '@/hooks/useToast';

interface HandleModalActionParams<T> {
  action: () => Promise<T>;
  onClose: () => void;
  onActionComplete?: () => void;
  toast: any; // ToastFns yerine any
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