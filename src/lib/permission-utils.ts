/**
 * Permission değişikliklerini tetiklemek için utility fonksiyonlar
 */

/**
 * Permission değişikliği event'ini tetikle
 * Bu fonksiyon çağrıldığında tüm usePermissionCheck hook'ları yeniden çalışır
 */
export const triggerPermissionChange = () => {
  console.log('Triggering permission change event...');
  window.dispatchEvent(new CustomEvent('permission-changed'));
};

/**
 * Belirli bir permission'ın değiştiğini bildir
 * @param permissionName Değişen permission'ın adı
 */
export const notifyPermissionChange = (permissionName: string) => {
  console.log(`Permission changed: ${permissionName}`);
  triggerPermissionChange();
};

/**
 * Tüm permission'ların yeniden yüklenmesi gerektiğini bildir
 */
export const notifyPermissionsRefresh = () => {
  console.log('All permissions need refresh');
  triggerPermissionChange();
};

