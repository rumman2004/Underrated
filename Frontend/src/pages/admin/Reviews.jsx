import React, { useEffect, useState } from 'react';
import { Check, X, MapPin, Loader2, Heart, Star, Trash2, Quote } from 'lucide-react';
import API from '../../utils/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Reviews on Mount
  const fetchReviews = async () => {
    try {
      // Ensure backend has GET /api/reviews route
      const { data } = await API.get('/reviews');
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 2. Handle Actions
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
      await API.put(`/reviews/${id}`, { status: newStatus });
    } catch (error) {
      console.error("Update failed", error);
      fetchReviews();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      setReviews(prev => prev.filter(r => r._id !== id));
      await API.delete(`/reviews/${id}`);
    } catch (error) {
      console.error("Delete failed", error);
      fetchReviews();
    }
  };

  const toggleTestimonial = async (review) => {
    try {
      const newVal = !review.isTestimonial;
      setReviews(prev => prev.map(r => r._id === review._id ? { ...r, isTestimonial: newVal } : r));
      await API.put(`/reviews/${review._id}`, { isTestimonial: newVal });
    } catch (error) {
      console.error("Toggle testimonial failed", error);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-xs font-bold uppercase tracking-widest">Loading Reviews...</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">
          Public Reviews
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-muted)]">
          Managing {reviews.length} user submissions
        </p>
      </div>

      {/* --- MOBILE VIEW (Cards) < 768px --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-2xl border border-[var(--color-sapling-200)] shadow-sm relative">
              
              {/* Header: User & Rating */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-sapling-100)] flex items-center justify-center font-bold text-[var(--color-darkblue-700)] text-xs">
                    {(review.user || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-darkblue-900)] text-sm">{review.user || "Anonymous"}</h3>
                    <div className="flex text-yellow-400 text-[10px]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Status Badge */}
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  review.status === "Approved" 
                    ? 'bg-green-50 text-green-600 border border-green-100' 
                    : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                }`}>
                  {review.status === "Approved" ? "Live" : "Pending"}
                </div>
              </div>

              {/* Place Context */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-darkblue-600)] bg-gray-50 px-3 py-2 rounded-lg mb-3">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-sapling-400)]" />
                <span className="truncate">{review.placeName || "Unknown Location"}</span>
              </div>

              {/* Comment Content */}
              <div className="relative mb-4">
                <Quote className="absolute -left-1 -top-1 w-3 h-3 text-gray-300 transform scale-x-[-1]" />
                <p className="text-sm text-[var(--color-text-muted)] pl-3 italic leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  {review.isTestimonial && (
                    <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-full">
                      Testimonial
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleTestimonial(review)}
                    className={`p-2 rounded-lg border ${review.isTestimonial ? 'border-pink-200 bg-pink-50 text-pink-500' : 'border-gray-100 text-gray-400'}`}
                  >
                    <Heart className={`w-4 h-4 ${review.isTestimonial ? 'fill-current' : ''}`} />
                  </button>
                  {review.status !== "Approved" && (
                    <button 
                      onClick={() => handleStatusUpdate(review._id, "Approved")}
                      className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(review._id)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-[var(--color-text-muted)] text-sm">
            No reviews found.
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW (Table) >= 768px --- */}
      <div className="hidden md:block bg-white rounded-[2rem] border border-[var(--color-sapling-200)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-sapling-50)] border-b border-[var(--color-sapling-200)]">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider">User</th>
                <th className="px-6 py-5 text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider">Place</th>
                <th className="px-6 py-5 text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider">Review</th>
                <th className="px-8 py-5 text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-sapling-100)]">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-[var(--color-bg-surface)] transition-colors group">
                    <td className="px-8 py-6 align-top w-1/5">
                      <div className="font-bold text-[var(--color-darkblue-900)]">{review.user || "Anonymous"}</div>
                      <div className="flex text-yellow-400 text-xs mt-1">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                         ))}
                      </div>
                      {review.status === "Pending" ? (
                        <span className="mt-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-full">Pending</span>
                      ) : (
                        <span className="mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">Live</span>
                      )}
                    </td>

                    <td className="px-6 py-6 align-top w-1/5">
                      <div className="flex items-center gap-2 text-[var(--color-darkblue-600)] text-sm font-medium">
                        <MapPin className="w-4 h-4 text-[var(--color-sapling-400)]" />
                        <span className="line-clamp-2">{review.placeName || "Unknown"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-6 align-top">
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">"{review.comment}"</p>
                      {review.isTestimonial && (
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-pink-500">
                          <Heart className="w-3 h-3 fill-current" /> Featured Testimonial
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-6 text-right align-top">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleTestimonial(review)}
                          className={`p-2 rounded-lg transition-all border ${
                            review.isTestimonial 
                              ? 'bg-pink-50 text-pink-500 border-pink-100' 
                              : 'bg-white text-gray-400 border-gray-200 hover:text-pink-400'
                          }`}
                          title="Toggle Testimonial"
                        >
                          <Heart className={`w-4 h-4 ${review.isTestimonial ? 'fill-current' : ''}`} />
                        </button>

                        {review.status !== "Approved" && (
                          <button 
                            onClick={() => handleStatusUpdate(review._id, "Approved")}
                            className="p-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-600 hover:text-white transition-all" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        <button 
                          onClick={() => handleDelete(review._id)}
                          className="p-2 bg-white text-red-400 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-[var(--color-text-muted)]">No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;