# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2afec4ee-023b-4080-b202-ddc705935328

## Test Dökümantasyonu

Proje, Jest ve React Testing Library kullanılarak test edilmiştir. Testler `src/pages/__tests__` ve `src/components/__tests__` dizinlerinde bulunmaktadır.

### Testleri Çalıştırma

```sh
npm test
```

### Test Kapsamı

#### Register (Kayıt) Sayfası Testleri

Register sayfası aşağıdaki senaryolar için test edilmiştir:

1. **Form Render Testi**

   - Tüm form alanlarının doğru şekilde render edildiğini kontrol eder
   - Gerekli input alanlarının varlığını doğrular
   - Submit butonunun varlığını kontrol eder

2. **Şifre Validasyonu**

   - Şifre uzunluğu kontrolü (minimum 6 karakter)
   - Şifre eşleşme kontrolü
   - Hata mesajlarının doğru gösterilmesi

3. **Form Gönderimi**

   - Form submit işleminin doğru çalışması
   - Kullanım koşulları onayı kontrolü
   - Başarılı kayıt sonrası yönlendirme

4. **Loading State**
   - Form gönderimi sırasında loading durumunun kontrolü
   - Submit butonunun disabled durumu

#### Login (Giriş) Sayfası Testleri

Login sayfası aşağıdaki senaryolar için test edilmiştir:

1. **Form Render Testi**

   - Email ve şifre alanlarının varlığı
   - Giriş yap butonunun varlığı

2. **Form Gönderimi**
   - Başarılı giriş senaryosu
   - Hatalı giriş senaryosu
   - Loading durumu kontrolü

#### Menu (Menü) Sayfası Testleri

Menü sayfası aşağıdaki senaryolar için test edilmiştir:

1. **Sayfa Render Testi**

   - Menü kategorilerinin listelenmesi
   - Ürünlerin doğru kategorilerde gösterilmesi

2. **Kategori Filtreleme**

   - Kategori seçimi
   - Ürünlerin kategoriye göre filtrelenmesi

3. **Sepet İşlemleri**
   - Ürün ekleme
   - Ürün çıkarma
   - Sepet toplamı hesaplama

### Test Yazım Prensipleri

1. **Test İsimlendirmesi**

   - Test isimleri açıklayıcı olmalı
   - "should" veya "when" ile başlamalı
   - Test edilen fonksiyonaliteyi açıkça belirtmeli

2. **Test Organizasyonu**

   - İlgili testler describe bloğu içinde gruplandırılmalı
   - Her test bağımsız olmalı
   - Test öncesi gerekli setup işlemleri yapılmalı

3. **Assertion Prensipleri**
   - Her test tek bir şeyi test etmeli
   - Beklenen sonuç açıkça belirtilmeli
   - Hata mesajları anlaşılır olmalı

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2afec4ee-023b-4080-b202-ddc705935328) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2afec4ee-023b-4080-b202-ddc705935328) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
