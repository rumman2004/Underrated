import React, { useState } from 'react';
import { Star, Send, MessageSquare, Loader2, User } from 'lucide-react';
import { PrimaryButton } from '../common/Buttons'; 
import API from '../../utils/api';
import { toast } from 'react-toastify'; // 1. Import Toast

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.rating === 0) {
        toast.warning("Please select a star rating! ⭐"); // 2. Warning Toast
        setLoading(false);
        return;
      }

      await API.post('/reviews', {
        user: formData.name,
        rating: formData.rating,
        comment: formData.message,
        placeName: 'General Feedback' 
      });
      
      toast.success("Review submitted! Waiting for approval. 🎉"); // 3. Success Toast
      setFormData({ name: '', rating: 0, message: '' });
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again."); // 4. Error Toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background - Dark Blue Block */}
      <div className="absolute inset-0 bg-[var(--color-darkblue-600)] -z-20"></div>
      
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Text Side */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-darkblue-500)] text-[var(--color-sapling-100)] text-xs font-bold uppercase tracking-widest mb-6">
            <MessageSquare className="w-3 h-3" />
            Community Voice
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            Share your <br /> experience.
          </h2>
          <p className="text-[var(--color-darkblue-500)] text-lg leading-relaxed mb-8">
            Love the platform? Have a suggestion? Rate your experience and help us grow the community.
          </p>
        </div>

        {/* Form Side - Glass Card */}
        <div className="flex-1 w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl relative">
            <div className="space-y-5">
              
              {/* Name Input */}
              <div>
                <label className="text-xs font-bold text-[var(--color-darkblue-700)] uppercase tracking-wider mb-2 block">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-white/50" />
                  <input 
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[var(--color-darkblue-900)]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-sapling-300)] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Rating Input */}
              <div>
                <label className="text-xs font-bold text-[var(--color-darkblue-700)] uppercase tracking-wider mb-2 block">
                  Rate Us
                </label>
                <div className="flex gap-2 bg-[var(--color-darkblue-900)]/50 border border-white/10 rounded-xl p-3 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoveredStar || formData.rating)
                            ? 'fill-[var(--color-sapling-300)] text-[var(--color-sapling-300)]' 
                            : 'text-gray-500'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="text-xs font-bold text-[var(--color-darkblue-700)] uppercase tracking-wider mb-2 block">
                  Review
                </label>
                <textarea 
                  rows="4" 
                  required
                  placeholder="Tell us what you think..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[var(--color-darkblue-900)]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-sapling-300)] focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              <PrimaryButton 
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 bg-[var(--color-sapling-300)] hover:bg-[var(--color-sapling-400)] text-[var(--color-darkblue-900)] border-none py-4 font-bold shadow-lg shadow-[var(--color-sapling-300)]/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Submitting...' : 'Submit Review'}
              </PrimaryButton>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ReviewForm;