-- Permission tablosundaki name alanlarını İngilizce'ye çevirme
-- Duplicate key constraint violation'ı önlemek için güvenli güncelleme

-- Önce mevcut durumu kontrol et
SELECT 'Checking current permission names...' as status;

-- Tüm Türkçe isimleri tek seferde güvenli şekilde güncelle
-- Sadece hedef İngilizce isimde kayıt yoksa güncelle
UPDATE permissions 
SET 
    name = CASE 
        WHEN name = 'Kullanıcı Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create User') THEN 'Create User'
        WHEN name = 'Kullanıcı Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read User') THEN 'Read User'
        WHEN name = 'Kullanıcı Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update User') THEN 'Update User'
        WHEN name = 'Kullanıcı Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete User') THEN 'Delete User'
        WHEN name = 'Rol Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Role') THEN 'Create Role'
        WHEN name = 'Rol Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Role') THEN 'Read Role'
        WHEN name = 'Rol Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Role') THEN 'Update Role'
        WHEN name = 'Rol Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Role') THEN 'Delete Role'
        WHEN name = 'İzin Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Permission') THEN 'Create Permission'
        WHEN name = 'İzin Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Permission') THEN 'Read Permission'
        WHEN name = 'İzin Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Permission') THEN 'Update Permission'
        WHEN name = 'İzin Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Permission') THEN 'Delete Permission'
        WHEN name = 'Mülk Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Property') THEN 'Create Property'
        WHEN name = 'Mülk Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Property') THEN 'Read Property'
        WHEN name = 'Mülk Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Property') THEN 'Update Property'
        WHEN name = 'Mülk Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Property') THEN 'Delete Property'
        WHEN name = 'Fatura Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Billing') THEN 'Create Billing'
        WHEN name = 'Fatura Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Billing') THEN 'Read Billing'
        WHEN name = 'Fatura Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Billing') THEN 'Update Billing'
        WHEN name = 'Fatura Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Billing') THEN 'Delete Billing'
        WHEN name = 'Fatura İstatistikleri' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Billing Statistics') THEN 'Billing Statistics'
        WHEN name = 'Ödeme Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Payment') THEN 'Create Payment'
        WHEN name = 'Ödeme Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Payment') THEN 'Read Payment'
        WHEN name = 'Ödeme Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Payment') THEN 'Update Payment'
        WHEN name = 'Ödeme Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Payment') THEN 'Delete Payment'
        WHEN name = 'Talep Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Ticket') THEN 'Create Ticket'
        WHEN name = 'Talep Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Ticket') THEN 'Read Ticket'
        WHEN name = 'Talep Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Ticket') THEN 'Update Ticket'
        WHEN name = 'Talep Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Ticket') THEN 'Delete Ticket'
        WHEN name = 'QR Kod Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create QR Code') THEN 'Create QR Code'
        WHEN name = 'QR Kod Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read QR Code') THEN 'Read QR Code'
        WHEN name = 'QR Kod Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update QR Code') THEN 'Update QR Code'
        WHEN name = 'QR Kod Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete QR Code') THEN 'Delete QR Code'
        WHEN name = 'Ayar Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Config') THEN 'Create Config'
        WHEN name = 'Ayar Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Config') THEN 'Read Config'
        WHEN name = 'Ayar Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Config') THEN 'Update Config'
        WHEN name = 'Ayar Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Config') THEN 'Delete Config'
        ELSE name
    END,
    description = CASE 
        WHEN name = 'Kullanıcı Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create User') THEN 'Permission to create new users in the system'
        WHEN name = 'Kullanıcı Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read User') THEN 'Permission to view user information'
        WHEN name = 'Kullanıcı Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update User') THEN 'Permission to update user information'
        WHEN name = 'Kullanıcı Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete User') THEN 'Permission to delete user records'
        WHEN name = 'Rol Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Role') THEN 'Permission to create new roles'
        WHEN name = 'Rol Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Role') THEN 'Permission to view role information'
        WHEN name = 'Rol Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Role') THEN 'Permission to update role information'
        WHEN name = 'Rol Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Role') THEN 'Permission to delete role definitions'
        WHEN name = 'İzin Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Permission') THEN 'Permission to create new permissions'
        WHEN name = 'İzin Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Permission') THEN 'Permission to view permission information'
        WHEN name = 'İzin Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Permission') THEN 'Permission to update permission information'
        WHEN name = 'İzin Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Permission') THEN 'Permission to delete permission definitions'
        WHEN name = 'Mülk Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Property') THEN 'Permission to create new property records'
        WHEN name = 'Mülk Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Property') THEN 'Permission to view property information'
        WHEN name = 'Mülk Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Property') THEN 'Permission to update property information'
        WHEN name = 'Mülk Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Property') THEN 'Permission to delete property records'
        WHEN name = 'Fatura Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Billing') THEN 'Permission to create new bills'
        WHEN name = 'Fatura Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Billing') THEN 'Permission to view billing information'
        WHEN name = 'Fatura Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Billing') THEN 'Permission to update billing information'
        WHEN name = 'Fatura Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Billing') THEN 'Permission to delete billing records'
        WHEN name = 'Fatura İstatistikleri' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Billing Statistics') THEN 'Permission to view billing statistics'
        WHEN name = 'Ödeme Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Payment') THEN 'Permission to create new payment records'
        WHEN name = 'Ödeme Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Payment') THEN 'Permission to view payment information'
        WHEN name = 'Ödeme Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Payment') THEN 'Permission to update payment information'
        WHEN name = 'Ödeme Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Payment') THEN 'Permission to delete payment records'
        WHEN name = 'Talep Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Ticket') THEN 'Permission to create new tickets'
        WHEN name = 'Talep Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Ticket') THEN 'Permission to view ticket information'
        WHEN name = 'Talep Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Ticket') THEN 'Permission to update ticket information'
        WHEN name = 'Talep Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Ticket') THEN 'Permission to delete ticket records'
        WHEN name = 'QR Kod Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create QR Code') THEN 'Permission to create new QR codes'
        WHEN name = 'QR Kod Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read QR Code') THEN 'Permission to view QR code information'
        WHEN name = 'QR Kod Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update QR Code') THEN 'Permission to update QR code information'
        WHEN name = 'QR Kod Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete QR Code') THEN 'Permission to delete QR code records'
        WHEN name = 'Ayar Oluştur' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Create Config') THEN 'Permission to create new system configurations'
        WHEN name = 'Ayar Görüntüle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Read Config') THEN 'Permission to view system configurations'
        WHEN name = 'Ayar Düzenle' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Update Config') THEN 'Permission to update system configurations'
        WHEN name = 'Ayar Sil' AND NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'Delete Config') THEN 'Permission to delete system configurations'
        ELSE description
    END
WHERE name IN (
    'Kullanıcı Oluştur', 'Kullanıcı Görüntüle', 'Kullanıcı Düzenle', 'Kullanıcı Sil',
    'Rol Oluştur', 'Rol Görüntüle', 'Rol Düzenle', 'Rol Sil',
    'İzin Oluştur', 'İzin Görüntüle', 'İzin Düzenle', 'İzin Sil',
    'Mülk Oluştur', 'Mülk Görüntüle', 'Mülk Düzenle', 'Mülk Sil',
    'Fatura Oluştur', 'Fatura Görüntüle', 'Fatura Düzenle', 'Fatura Sil', 'Fatura İstatistikleri',
    'Ödeme Oluştur', 'Ödeme Görüntüle', 'Ödeme Düzenle', 'Ödeme Sil',
    'Talep Oluştur', 'Talep Görüntüle', 'Talep Düzenle', 'Talep Sil',
    'QR Kod Oluştur', 'QR Kod Görüntüle', 'QR Kod Düzenle', 'QR Kod Sil',
    'Ayar Oluştur', 'Ayar Görüntüle', 'Ayar Düzenle', 'Ayar Sil'
);

-- Güncelleme tamamlandı mesajı
SELECT 'Permission names have been safely updated to English!' as mesaj;
