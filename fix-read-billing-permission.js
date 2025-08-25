// Fix Read Billing Permission Issue
// Bu script kullanıcının localStorage'ındaki eski Türkçe permission adlarını
// yeni İngilizce adlarla değiştirir

console.log('🔧 Read Billing Permission Fix Script');
console.log('=====================================');

// localStorage'dan mevcut verileri al
const userData = localStorage.getItem('userData');
const userPermissions = localStorage.getItem('userPermissions');

if (!userData) {
  console.log('❌ userData bulunamadı. Lütfen önce login olun.');
} else {
  console.log('✅ userData bulundu');
  
  try {
    const parsedUserData = JSON.parse(userData);
    console.log('👤 Kullanıcı:', parsedUserData.name || parsedUserData.email);
    
    if (parsedUserData.roles && Array.isArray(parsedUserData.roles)) {
      console.log('🔍 Roller kontrol ediliyor...');
      
      let hasChanges = false;
      
      parsedUserData.roles.forEach((role, roleIndex) => {
        if (role.permissions && Array.isArray(role.permissions)) {
          console.log(`📋 Rol: ${role.name} - ${role.permissions.length} permission`);
          
          role.permissions.forEach((permission, permIndex) => {
            // Eski Türkçe permission adlarını yeni İngilizce adlarla değiştir
            if (permission.name === 'Fatura Görüntüle') {
              console.log('🔄 "Fatura Görüntüle" -> "Read Billing" olarak güncelleniyor');
              permission.name = 'Read Billing';
              permission.description = 'Permission to view billing information';
              hasChanges = true;
            }
            if (permission.name === 'Fatura Oluştur') {
              console.log('🔄 "Fatura Oluştur" -> "Create Billing" olarak güncelleniyor');
              permission.name = 'Create Billing';
              permission.description = 'Permission to create new bills';
              hasChanges = true;
            }
            if (permission.name === 'Fatura Düzenle') {
              console.log('🔄 "Fatura Düzenle" -> "Update Billing" olarak güncelleniyor');
              permission.name = 'Update Billing';
              permission.description = 'Permission to update billing information';
              hasChanges = true;
            }
            if (permission.name === 'Fatura Sil') {
              console.log('🔄 "Fatura Sil" -> "Delete Billing" olarak güncelleniyor');
              permission.name = 'Delete Billing';
              permission.description = 'Permission to delete billing records';
              hasChanges = true;
            }
            if (permission.name === 'Fatura İstatistikleri') {
              console.log('🔄 "Fatura İstatistikleri" -> "Billing Statistics" olarak güncelleniyor');
              permission.name = 'Billing Statistics';
              permission.description = 'Permission to view billing statistics';
              hasChanges = true;
            }
            // Ödeme permission'ları da güncelle
            if (permission.name === 'Ödeme Görüntüle') {
              console.log('🔄 "Ödeme Görüntüle" -> "Read Payment" olarak güncelleniyor');
              permission.name = 'Read Payment';
              permission.description = 'Permission to view payment information';
              hasChanges = true;
            }
            if (permission.name === 'Ödeme Oluştur') {
              console.log('🔄 "Ödeme Oluştur" -> "Create Payment" olarak güncelleniyor');
              permission.name = 'Create Payment';
              permission.description = 'Permission to create new payment records';
              hasChanges = true;
            }
            if (permission.name === 'Ödeme Düzenle') {
              console.log('🔄 "Ödeme Düzenle" -> "Update Payment" olarak güncelleniyor');
              permission.name = 'Update Payment';
              permission.description = 'Permission to update payment information';
              hasChanges = true;
            }
            if (permission.name === 'Ödeme Sil') {
              console.log('🔄 "Ödeme Sil" -> "Delete Payment" olarak güncelleniyor');
              permission.name = 'Delete Payment';
              permission.description = 'Permission to delete payment records';
              hasChanges = true;
            }
          });
        }
      });
      
      if (hasChanges) {
        // Güncellenmiş userData'yı localStorage'a kaydet
        localStorage.setItem('userData', JSON.stringify(parsedUserData));
        console.log('✅ localStorage güncellendi!');
        console.log('🔄 Sayfa yenileniyor...');
        
        // Sayfayı yenile
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.log('ℹ️ Güncellenecek permission bulunamadı.');
      }
      
    } else {
      console.log('❌ Kullanıcı rollerinde permission bulunamadı');
    }
    
  } catch (error) {
    console.error('❌ userData parse edilemedi:', error);
  }
}

// Read Billing permission'ını kontrol et
const readBillingId = 'd3e4f5g6-7h8i-9j0k-1l2m-3n4o5p6q7r8s';
console.log('\n🔍 Read Billing Permission Kontrolü:');
console.log('ID:', readBillingId);

if (userData) {
  try {
    const parsedUserData = JSON.parse(userData);
    let hasReadBilling = false;
    
    if (parsedUserData.roles) {
      parsedUserData.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (permission.id === readBillingId || permission.name === 'Read Billing') {
              hasReadBilling = true;
              console.log('✅ Read Billing permission bulundu!');
              console.log('   ID:', permission.id);
              console.log('   Name:', permission.name);
            }
          });
        }
      });
    }
    
    if (!hasReadBilling) {
      console.log('❌ Read Billing permission bulunamadı!');
    }
    
  } catch (error) {
    console.error('❌ Permission kontrolü sırasında hata:', error);
  }
}

console.log('\n📝 Notlar:');
console.log('- Bu script localStorage\'daki eski Türkçe permission adlarını İngilizce\'ye çevirir');
console.log('- Değişiklik yapıldıysa sayfa otomatik olarak yenilenir');
console.log('- Eğer sorun devam ederse, logout yapıp tekrar login olun');