
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { menuAPI, reviewAPI } from "@/services/api";
import { toast } from "sonner";
import { Star, Plus, Minus } from "lucide-react";

interface FoodItem {
  food_id: string;
  name: string;
  description: string;
  category: string;
  price_dine_in: string;
  price_takeaway: string;
  image: string | null;
  availability: boolean;
}

interface Review {
  id: number;
  user_id: string;
  food_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface FoodReviews {
  food_id: string;
  average_rating: number;
  total_reviews: number;
  reviews: Review[];
}

const MenuDetail = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<FoodReviews | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (foodId) {
      fetchFoodDetails();
      fetchReviews();
    }
  }, [foodId]);

  const fetchFoodDetails = async () => {
    try {
      setLoading(true);
      const data = await menuAPI.getFoodById(foodId!);
      setFood(data);
    } catch (error) {
      console.error("Yemek detayları alınırken hata:", error);
      toast.error("Yemek detayları yüklenirken bir hata oluştu");
      navigate("/menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewAPI.getReviewsByFoodId(foodId!);
      setReviews(data);
    } catch (error) {
      console.error("Değerlendirmeler alınırken hata:", error);
      // Sadece hata günlüğü, kritik bir hata değil
    }
  };

  const handleAddToCart = () => {
    if (food) {
      addItem({
        id: food.food_id,
        name: food.name,
        price: parseFloat(food.price_takeaway), // Default olarak paket fiyatı
        image: food.image || "/placeholder.svg"
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Değerlendirme yapmak için giriş yapmalısınız");
      navigate("/giris");
      return;
    }
    
    setSubmittingReview(true);
    
    try {
      await reviewAPI.createReview({
        food_id: foodId!,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      toast.success("Değerlendirmeniz başarıyla eklendi");
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      fetchReviews(); // Değerlendirmeleri yeniden yükle
    } catch (error) {
      console.error("Değerlendirme eklenirken hata:", error);
      toast.error("Değerlendirme eklenirken bir hata oluştu");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-700"></div>
        </div>
      </MainLayout>
    );
  }

  if (!food) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-700">Ürün bulunamadı</h2>
          <p className="mt-2 text-gray-500">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Button className="mt-4" onClick={() => navigate("/menu")}>
            Menüye Dön
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-4">
          <Button variant="outline" onClick={() => navigate("/menu")}>
            &larr; Menüye Dön
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={food.image || "/placeholder.svg"}
                alt={food.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{food.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">{food.category}</p>
                </div>
                <div className="flex items-center">
                  {reviews && (
                    <>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(reviews.average_rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({reviews.total_reviews} değerlendirme)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold">Açıklama</h3>
                <p className="mt-2 text-gray-600">{food.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold">Fiyat</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Restoranda:</span>
                    <span className="font-bold text-xl text-restaurant-700">
                      {parseFloat(food.price_dine_in).toFixed(2)} ₺
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Paket Servis:</span>
                    <span className="font-bold text-xl text-restaurant-700">
                      {parseFloat(food.price_takeaway).toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-l-md"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-t border-b border-gray-300 text-center min-w-[60px]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-r-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={!food.availability}
                >
                  {food.availability ? "Sepete Ekle" : "Ürün Tükendi"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Değerlendirmeler Bölümü */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Değerlendirmeler</h2>
            {isAuthenticated && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? "İptal" : "Değerlendirme Yap"}
              </Button>
            )}
          </div>

          {showReviewForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Yeni Değerlendirme</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puanınız
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Yorumunuz
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                  />
                </div>
                <div className="text-right">
                  <Button type="submit" disabled={submittingReview}>
                    {submittingReview ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {reviews && reviews.reviews.length > 0 ? (
              reviews.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-restaurant-700 text-white rounded-full w-10 h-10 flex items-center justify-center">
                        {review.user_id.substring(0, 2)}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Kullanıcı</p>
                        <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Henüz değerlendirme yapılmamış. İlk değerlendirmeyi yapan siz olun!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MenuDetail;
