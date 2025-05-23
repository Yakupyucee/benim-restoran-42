
import React from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6">
          <Link 
            to="/kayit" 
            className="inline-flex items-center text-restaurant-700 hover:text-restaurant-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kayıt sayfasına dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Gizlilik Politikası</h1>
          <p className="text-gray-600 mt-2">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Toplanan Bilgiler</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Hizmetimizi kullanırken aşağıdaki bilgileri toplarız:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Ad, soyad ve iletişim bilgileri</li>
              <li>• E-posta adresi ve telefon numarası</li>
              <li>• Teslimat adresi bilgileri</li>
              <li>• Sipariş geçmişi ve tercihleri</li>
              <li>• Ödeme bilgileri (güvenli şekilde işlenir)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Bilgilerin Kullanımı</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Topladığımız bilgileri şu amaçlarla kullanırız:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Siparişlerinizi işlemek ve teslim etmek</li>
              <li>• Müşteri hizmetleri sunmak</li>
              <li>• Hesap güvenliğini sağlamak</li>
              <li>• Hizmet kalitesini artırmak</li>
              <li>• Yasal yükümlülükleri yerine getirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Bilgi Paylaşımı</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel bilgilerinizi üçüncü taraflarla paylaşmayız. Ancak aşağıdaki durumlarda 
              sınırlı paylaşım yapabiliriz:
            </p>
            <ul className="text-gray-700 space-y-2 mt-3">
              <li>• Teslimat hizmet sağlayıcıları ile (sadece teslimat için gerekli bilgiler)</li>
              <li>• Ödeme işlem sağlayıcıları ile (güvenli ödeme işlemi için)</li>
              <li>• Yasal zorunluluklar durumunda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Veri Güvenliği</h2>
            <p className="text-gray-700 leading-relaxed">
              Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanırız. 
              Şifreli bağlantılar, güvenli sunucular ve düzenli güvenlik denetimleri yapılır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Çerezler (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed">
              Web sitemiz deneyiminizi iyileştirmek için çerezler kullanır. Bu çerezler 
              tercihlerinizi hatırlamak ve site performansını analiz etmek için kullanılır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Haklarınız</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>• İşlenen verileriniz hakkında bilgi talep etme</li>
              <li>• Yanlış verilerin düzeltilmesini isteme</li>
              <li>• Verilerinizin silinmesini talep etme</li>
              <li>• Veri işlemeye itiraz etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Veri Saklama</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel verileriniz yasal gereklilikler ve hizmet sağlama amacıyla gerekli olan 
              süre boyunca saklanır. Hesabınızı sildiğinizde verileriniz güvenli şekilde imha edilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. İletişim</h2>
            <p className="text-gray-700 leading-relaxed">
              Gizlilik politikamız hakkında sorularınız varsa veya haklarınızı kullanmak istiyorsanız 
              bizimle iletişime geçebilirsiniz. Bu politika değişiklikleri bu sayfada duyurulacaktır.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
