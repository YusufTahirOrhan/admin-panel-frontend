# Kullanılabilirlik İncelemesi (Kasım 2026)

Admin ve satış ekranlarının hepsi masaüstünde (1280px) ve telefonda (375px) örnek veriyle gezildi. Sonra `feature/ux-improvements` branch'inde düzeltildi. Doğrulama boş bir kurulumla yapıldı. İlk girişten satışa, iadeye, tamire, reçeteye ve personel eklemeye kadar 16 adımlık uçtan uca test çalıştırıldı. Ardından 16 sayfa iki ekran genişliğinde tarandı. Konsol hatası, yatay taşma ya da 5xx yanıt çıkmadı.

## İşi engelleyen hatalar (düzeltildi)

| Sorun | Ne yapıldı |
| --- | --- |
| Ayarlar'dan **işlem türü eklenemiyordu**. API `metadataJson` istiyordu ve listede geçersiz "OTHER" kategorisi vardı. Bu yüzden tamir, reçete ve kasa ekranları da kayıt açamıyordu. | Ayarlar formu kategoriye göre gerekli ayarı kendisi gönderiyor. Eksik türler tek tıkla eklenebiliyor ("Önerilenleri ekle"). |
| Tamir ve reçete formları **müşteri ve tür için UUID** istiyordu. | Aranabilir müşteri seçici geldi (ad, soyad, telefon; Türkçe karakter duyarsız). Yazılan isimden yeni müşteri de açılabiliyor. Tür tek ise otomatik seçiliyor. |
| Envanterde **stok düzenlemesi sessizce yok sayılıyordu**. API stok değişikliğini düzenleme isteğinde kabul etmiyor. | "Stok" düğmesi eklendi: giriş, çıkış veya sayım; yeni stok önizlemesi ve açıklama alanı var. |
| Admin'deki "Yeni satış" penceresi tutar girilmezse **100 TL'lik satış** kaydediyordu. | Pencere kaldırıldı, kasaya yönlendiriyor. |
| Personelin **rolü ve durumu değiştirilemiyordu**. | Satırda rol menüsü ve Pasifleştir/Aktifleştir düğmeleri var; ikisi de onay soruyor. |
| Giriş sadece e-posta kabul ediyordu. | "E-posta veya kullanıcı adı" ile giriş yapılabiliyor. Menüde yazılan değil hesabın kullanıcı adı görünüyor. |

## Kasa (POS)

- Ürünlerin **satış fiyatı** artık var. Fiyat KDV dahil giriliyor, "1.499,90" yazımı da kabul ediliyor. Sepete bu fiyatla düşüyor ve sepette değiştirilebiliyor. Fiyatı girilmemiş ürün sepete girebiliyor ama satış fiyatı yazılmadan tamamlanamıyor.
- **Barkod:** arama kutusu açılışta odaklı (dokunmatik ekranlarda klavye kendiliğinden açılmasın diye odaklanmıyor). Okutup Enter'a basınca ürün doğrudan sepete düşüyor.
- KDV oranı seçilebiliyor (%20/10/1/0), tutar fiyatın içinden hesaplanıyor. İndirim yüzde ya da tutar olarak girilebiliyor ve toplamı aşamıyor. Stoktan fazla ürün eklenemiyor.
- İade ve iptal `window.prompt` yerine onay penceresiyle yapılıyor. İade penceresi kalan tutarı gösteriyor ve aşılmasına izin vermiyor.
- Telefonda sepet ürünlerin hemen altında. Altta sabit bir toplam çubuğu var, "Sepete git" ile sepete inilebiliyor.

## Genel

- Liste ekranlarının hepsi aynı bileşeni kullanıyor. Telefonda kart görünümü, sayılara ve tarihlere göre doğru sıralama ve Türkçe para/tarih biçimi geldi.
- Formda alan doğrulaması alanın altında gösteriliyor ve ilk hatalı alana odaklanılıyor. Kaydetme ve silme sonucunu kısa bildirimler (toast) haber veriyor.
- API hataları Türkçe gösteriliyor. Backend'deki tüm hata mesajlarının karşılığı var.
- Reçete: SPH/CYL 0,25 adımlarıyla kontrol ediliyor, CYL girildiyse AX zorunlu. PD "62" ya da "31/31" yazılabiliyor. Liste optisyen yazımıyla gösteriliyor (`-1.25 -0.50 × 90`).
- Tamir listesinde "İşleme al → Hazır → Teslim et" adımları tek tıkla ilerletiliyor.
- Müşteri detayında toplam alışveriş, son satış, tamir ve reçete sayısı ve açık tamirler görünüyor.
- Gösterge paneline yeni mağaza için bir kurulum listesi eklendi (işlem türleri, fiyatlı ürün, personel, web sitesi). Panelde az kalan ürünler ve "dikkat isteyen işlemler" de var: iptal, iade, silme, rol değişikliği, stok sayımı ve engellenen girişler. Bu ikinci liste daha önce hep boştu, çünkü backend hiç loglanmayan olay adlarını arıyordu. KPI kartlarındaki sabit "yukarı ok" kaldırıldı; gerçek bir karşılaştırma göstermiyordu.
- Denetim kaydında olaylar kod yerine cümle olarak yazılıyor ("Rol değiştirildi: mert, yeni rol: Yönetici"). İşlemi kimin yaptığı da görünüyor.

## Backend tarafı (`feature/php-backend`)

- Ürünlere `salePrice` alanı eklendi.
- Silinmiş kaydın kullanıcı adı, e-postası, SKU'su, kodu ya da kategori adı yeniden kullanılabiliyor. Önceden 500 dönüyordu.
- Kategori yeniden adlandırılınca o kategorideki ürünler de yeni ada taşınıyor.
- Audit kayıtlarında işlemi yapan kişi tutuluyor.

## Sıradaki öneriler

| Öneri | Neden | Efor |
| --- | --- | --- |
| Dashboard grafiğini son 200 satış yerine tarih aralıklı özet uçlarıyla hesaplamak | Satış sayısı arttıkça grafik eksik kalır | Orta |
| Tamir "Hazır" olunca müşteriye tek tıkla SMS/WhatsApp mesajı (şablonlu) | En sık telefon trafiği "gözlüğüm hazır mı?" sorusu | Orta |
| 58/80 mm fiş yazıcı çıktısı (PDF faturaya ek olarak) | Kasada A4 PDF yavaş | Küçük |
| Kalan 17 ESLint hatası (dekoratif bileşenlerde `any` ve effect içinde `setState`) | Bu branch'te yeni hata eklenmedi, sayı 20'den 17'ye indi | Küçük |
