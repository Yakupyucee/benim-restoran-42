
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { menuAPI, reviewAPI } from "@/services/api";
import { toast } from "sonner";
import { useParams, Link } from "react-router-dom";
import { Star, StarHalf, StarOff } from "lucide-react";

interface MenuItem {
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
  const { foodId } = useParams<{ foodId: string }>();
  const [food, setFood] = useState<MenuItem | null>(null);
  const [reviews, setReviews] = useState<FoodReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchFoodAndReviews = async () => {
      try {
        setLoading(true);
        if (foodId) {
          const foodData = await menuAPI.getFoodById(foodId);
          setFood(foodData);

          try {
            const reviewsData = await reviewAPI.getReviewsByFoodId(foodId);
            setReviews(reviewsData);
          } catch (error) {
            console.error("Yorumlar alınamadı:", error);
          }
        }
      } catch (error) {
        console.error("Yemek detayları alınamadı:", error);
        toast.error("Yemek detayları yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodAndReviews();
  }, [foodId]);

  const handleAddToCart = () => {
    if (food) {
      addItem({
        id: food.food_id,
        name: food.name,
        price: parseFloat(food.price_dine_in),
        image: food.image || "/placeholder.svg"
      });
      
      toast.success("Ürün sepete eklendi");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Yorum yapabilmek için giriş yapmalısınız");
      return;
    }

    try {
      setReviewLoading(true);
      await reviewAPI.createReview({
        food_id: foodId as string,
        rating,
        comment
      });

      // Yeniden yorumları getir
      const reviewsData = await reviewAPI.getReviewsByFoodId(foodId as string);
      setReviews(reviewsData);
      
      setRating(5);
      setComment("");
      toast.success("Yorumunuz başarıyla eklendi");
    } catch (error) {
      console.error("Yorum eklenemedi:", error);
      toast.error("Yorumunuz eklenirken bir hata oluştu");
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  // Yıldız değerlendirme bileşeni
  const RatingStars = ({ rating }: { rating: number }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<StarOff key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-700"></div>
        </div>
      </MainLayout>
    );
  }

  if (!food) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ürün Bulunamadı</h1>
            <p className="mb-6">İstediğiniz ürün bulunamadı veya kaldırılmış olabilir.</p>
            <Link to="/menu">
              <Button>Menüye Dön</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={food.image || "/placeholder.svg"} 
              alt={food.name} 
              className="w-full h-80 object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{food.name}</h1>
            <div className="mb-4">
              <span className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                {food.category}
              </span>
              {food.availability ? (
                <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Mevcut
                </span>
              ) : (
                <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  Tükendi
                </span>
              )}
            </div>
            
            <div className="mb-4">
              {reviews && (
                <div className="flex items-center mb-2">
                  <RatingStars rating={reviews.average_rating} />
                  <span className="ml-2 text-gray-600">
                    ({reviews.average_rating.toFixed(1)}) - {reviews.total_reviews} yorum
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{food.description}</p>
            
            <div className="flex flex-col mb-8">
              <div className="mb-2">
                <span className="font-semibold">Restoran fiyatı: </span>
                <span className="text-xl font-bold text-restaurant-700">
                  {parseFloat(food.price_dine_in).toFixed(2)} ₺
                </span>
              </div>
              <div>
                <span className="font-semibold">Paket servisi fiyatı: </span>
                <span className="text-xl font-bold text-restaurant-700">
                  {parseFloat(food.price_takeaway).toFixed(2)} ₺
                </span>
              </div>
            </div>
            
            {food.availability && (
              <div className="flex space-x-4">
                <Button onClick={handleAddToCart} size="lg">
                  Sepete Ekle
                </Button>
                <Link to="/siparis">
                  <Button variant="outline" size="lg">
                    Sipariş Ver
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Yorumlar</h2>
            
            {isAuthenticated && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Değerlendirmenizi Yazın</h3>
                
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Puanınız</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none mr-1"
                        >
                          {star <= rating ? (
                            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <Star className="h-8 w-8 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="comment" className="block text-gray-700 mb-2">
                      Yorumunuz
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={reviewLoading}>
                    {reviewLoading ? "Gönderiliyor..." : "Yorumu Gönder"}
                  </Button>
                </form>
              </div>
            )}
            
            {!isAuthenticated && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-gray-600">
                  Yorum yapabilmek için 
                  <Link to="/giris" className="text-restaurant-700 font-medium mx-1">
                    giriş yapmalısınız
                  </Link>
                </p>
              </div>
            )}
            
            {reviews && reviews.reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-md p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <RatingStars rating={review.rating} />
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      {user && user.user_id === review.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={async () => {
                            try {
                              await reviewAPI.deleteReview(review.id.toString());
                              const newReviewsData = await reviewAPI.getReviewsByFoodId(foodId as string);
                              setReviews(newReviewsData);
                              toast.success("Yorum silindi");
                            } catch (error) {
                              toast.error("Yorum silinemedi");
                            }
                          }}
                        >
                          Sil
                        </Button>
                      )}
                    </div>
                    
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">Henüz yorum yapılmamış.</p>
                {isAuthenticated && (
                  <p className="text-gray-600 mt-1">İlk yorumu siz yapın!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MenuDetail;
