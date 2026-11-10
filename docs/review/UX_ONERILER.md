# Kullanılabilirlik İncelemesi ve Öneriler (Kasım 2026)

Tüm admin ve satış sayfaları masaüstü (1280px) ve telefon (375px) genişliğinde, örnek veriyle (müşteri, ürün, satış, tamir, reçete) gezildi. Hiçbir sayfada konsol hatası yok. Bu branch'te düzeltilenler en altta; diğerleri onayını bekliyor.

## Öncelikli (personelin günlük işini doğrudan engelliyor)

| # | Sorun | Neden önemli | Öneri | Efor |
| --- | --- | --- | --- | --- |
| 1 | **Tamir** ve **Reçete** formları "Müşteri ID" ve "İşlem türü ID" alanlarına UUID yazılmasını istiyor | Personel bu kimlikleri bilemez; formlar pratikte kullanılamıyor | Aranabilir müşteri seçici ve işlem türü açılır listesi (POS'taki müşteri aramasıyla aynı bileşen) | Orta |
| 2 | Reçete ve tamir listelerinde **Müşteri** sütunu "-" ya da UUID gösteriyor | Kimin kaydı olduğu anlaşılmıyor | Müşteri listesini bir kez çekip ID'yi ad-soyada çevir | Küçük |
| 3 | POS'ta ürün kartları **₺0,00** gösteriyor; fiyat sepette elle yazılıyor | Envanterde fiyat alanı yok, her satışta fiyat tahmini/elle giriş | Envantere satış fiyatı alanı ekle (backend + form); sepete fiyatla düşsün, elle değiştirme kalsın | Orta (backend dahil) |
| 4 | Giriş formu sadece e-posta kabul ediyor; API kullanıcı adını da kabul ediyor | Kullanıcı adıyla oluşturulan personel "geçerli e-posta" hatası alıyor | Alanı "E-posta veya kullanıcı adı" yap | Küçük |

## Orta

| # | Sorun | Öneri | Efor |
| --- | --- | --- | --- |
| 5 | Satışlar tablosu telefonda yatay taşıyor | Dar ekranda kart görünümü (fiş no, müşteri, tutar, durum) | Küçük |
| 6 | Satış türü sütunu kod gösteriyor (RETAIL) | İşlem türü adını göster (listeyi bir kez çek) | Küçük |
| 7 | Dashboard grafiği sadece son 200 satışı sayıyor | `/summary` ve tarih aralıklı sorgularla hesapla | Orta |
| 8 | Tamir durum değişikliği listeden yapılamıyor | Satırda "sonraki duruma geçir" butonu (API geçişleri zaten kontrol ediyor) | Küçük |

## Kod kalitesi

- `main`'de 20 ESLint hatası var (çoğu `setState`'in effect içinde çağrılması ve `any` tipi). Davranışı değiştirmeden temizlenebilir.

## Bu branch'te düzeltilenler

- Dashboard ciro grafiği hep sıfır çiziyordu (API'de olmayan `totalAmount`/`transactionDate` alanlarını okuyordu); kategori grafiği her satışı "Diğer" sayıyordu.
- Satışlar tablosundaki "Satış Türü" sütunu hep "-" idi.
- POS'taki son satışlar "CARD · COMPLETED" gibi İngilizce gösteriyordu.
- Şifre sıfırlama 6 karakter kabul ediyordu, API 8 istiyor.
