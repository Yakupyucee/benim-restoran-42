
import React from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Kullanım Koşulları</h1>
          <p className="text-gray-600 mt-2">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Hizmet Kapsamı</h2>
            <p className="text-gray-700 leading-relaxed">
              Benim Restoranım, online yemek sipariş hizmeti sunmaktadır. Bu hizmet kapsamında kullanıcılar 
              menümüzden yemek seçebilir, sipariş verebilir ve ödeme yapabilirler.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Kullanıcı Sorumlulukları</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Doğru ve güncel bilgiler vermeyi kabul edersiniz</li>
              <li>• Hesap güvenliğinizden sorumlusunuz</li>
              <li>• Siparişlerinizi zamanında teslim almakla yükümlüsünüz</li>
              <li>• Platform kurallarına uymayı kabul edersiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Sipariş ve Ödeme</h2>
            <p className="text-gray-700 leading-relaxed">
              Siparişler onaylandıktan sonra değiştirilemez. Ödeme işlemleri güvenli kanallar üzerinden yapılır. 
              Sipariş iptalleri için restoran ile iletişime geçmeniz gerekmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Teslimat Koşulları</h2>
            <p className="text-gray-700 leading-relaxed">
              Teslimat süreleri tahminidir ve trafik, hava koşulları gibi dış faktörlerden etkilenebilir. 
              Restoran gecikmelerden sorumlu değildir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. İptal ve İade</h2>
            <p className="text-gray-700 leading-relaxed">
              Hazırlığa başlanmış siparişler iptal edilemez. İade durumları bireysel olarak değerlendirilir 
              ve restoran yönetiminin onayına tabidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Gizlilik</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel verileriniz Gizlilik Politikamız doğrultusunda korunur ve işlenir. 
              Detaylar için Gizlilik Politikası sayfasını inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Değişiklikler</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu koşullar önceden haber verilmeksizin değiştirilebilir. Güncel koşulları düzenli olarak 
              kontrol etmenizi öneriyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. İletişim</h2>
            <p className="text-gray-700 leading-relaxed">
              Sorularınız için bizimle iletişime geçebilirsiniz. Bu koşulları kabul ederek hizmetimizi 
              kullanmayı onaylıyorsunuz.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService;
