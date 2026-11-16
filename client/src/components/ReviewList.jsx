import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchReviews, createReview, deleteReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { formatDate, capitalize } from '../utils/formatters';
import { CardRowSkeleton } from './Skeletons';

const ReviewList = ({ destinationId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, title: '', comment: '', tripType: 'solo' });
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    fetchReviews(destinationId)
      .then(({ data }) => setReviews(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to write a review');
      return;
    }
    setSubmitting(true);
    try {
      await createReview(destinationId, form);
      toast.success('Review submitted!');
      setForm({ rating: 5, title: '', comment: '', tripType: 'solo' });
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      toast.success('Review deleted');
      loadReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-semibold">Reviews & Ratings</h3>

      {user && (
        <form onSubmit={handleSubmit} className="card space-y-3 p-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Your rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button type="button" key={star} onClick={() => setForm({ ...form, rating: star })}>
                <FiStar className={star <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} size={20} />
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Share your experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            rows={3}
            className="input-field"
            required
          />
          <select value={form.tripType} onChange={(e) => setForm({ ...form, tripType: e.target.value })} className="input-field sm:w-48">
            {['solo', 'family', 'romantic', 'adventure', 'budget'].map((t) => (
              <option key={t} value={t}>
                {capitalize(t)} trip
              </option>
            ))}
          </select>
          <button type="submit" disabled={submitting} className="btn-primary text-sm">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <CardRowSkeleton count={3} />
      ) : reviews.length === 0 ? (
        <p className="text-sm text-slate-500">No reviews yet. Be the first to share your experience!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{review.user?.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(review.createdAt)} · {capitalize(review.tripType)} trip</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar key={idx} size={13} className={idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                    ))}
                  </div>
                  {user?._id === review.user?._id && (
                    <button onClick={() => handleDelete(review._id)} className="text-slate-400 hover:text-red-500">
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {review.title && <p className="mb-1 text-sm font-semibold">{review.title}</p>}
              <p className="text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
