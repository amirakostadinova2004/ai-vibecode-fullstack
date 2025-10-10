"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ToolDetails({ params }) {
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    user_id: null
  });
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUser();
    fetchToolDetails();
    fetchReviews();
  }, [params.id]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8201/api/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setNewReview(prev => ({ ...prev, user_id: userData.id }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchToolDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8201/api/ai-tools/${params.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const toolData = await response.json();
        setTool(toolData);
      }
    } catch (error) {
      console.error("Error fetching tool:", error);
    }
  };

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8201/api/ai-tools/${params.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const toolData = await response.json();
        setReviews(toolData.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch("http://localhost:8201/api/reviews", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ai_tool_id: parseInt(params.id),
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(prev => [data.review, ...prev]);
        setNewReview({
          rating: 5,
          comment: "",
          user_id: user.id
        });
        alert("Review submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error submitting review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Зареждане...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Инструментът не е намерен</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Обратно към Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-900 text-white p-6 shadow-xl border-b border-slate-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-white hover:text-purple-300 transition-colors"
            >
              ← Назад
            </button>
            <h1 className="text-2xl font-bold">{tool.name}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {tool.price_tier === 1 ? 'Безплатен' :
               tool.price_tier === 2 ? 'Freemium' : 'Платен'}
            </span>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔗 Отвори инструмент
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tool Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tool Details */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                {tool.image_url ? (
                  <img
                    src={tool.image_url}
                    alt={tool.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center text-3xl">
                    🤖
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{tool.name}</h2>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tool.category}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Описание</h3>
                <p className="text-slate-300 leading-relaxed">{tool.description}</p>
              </div>

              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Тагове</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag, index) => (
                      <span key={index} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-md text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Рейтинг</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-2xl ${
                        star <= tool.rating ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xl font-bold text-white">{tool.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Add Review Form */}
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Добави рецензия</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Рейтинг:
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 ⭐⭐⭐⭐</option>
                    <option value={3}>3 ⭐⭐⭐</option>
                    <option value={2}>2 ⭐⭐</option>
                    <option value={1}>1 ⭐</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Коментар:
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Сподели своето мнение..."
                    rows={4}
                    className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Публикувай рецензия
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-6">
            Рецензии ({reviews.length})
          </h3>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h4 className="text-xl font-semibold text-slate-200 mb-2">Няма рецензии</h4>
              <p className="text-slate-400">Бъди първият, който споделя мнение за този инструмент!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-700 border border-slate-600 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{review.user?.name || 'Анонимен'}</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-sm ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm">
                      {new Date(review.created_at).toLocaleDateString('bg-BG')}
                    </span>
                  </div>
                  
                  {review.comment && (
                    <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
