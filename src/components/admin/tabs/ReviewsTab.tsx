import React, { useState, useEffect } from 'react';
import { Star, Check, EyeOff, Trash2, ShieldCheck } from 'lucide-react';
import { reviewService, AdminReview } from '../../../services/reviewService';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingReview, setDeletingReview] = useState<AdminReview | null>(null);

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const loadReviews = async () => {
    const list = await reviewService.getReviews(filterStatus);
    setReviews(list);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'pending' | 'hidden') => {
    await reviewService.updateReviewStatus(id, status);
    loadReviews();
  };

  const handleDeleteReview = async () => {
    if (deletingReview) {
      await reviewService.deleteReview(deletingReview.id);
      loadReviews();
      setDeletingReview(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div>
          <h2 className="font-display font-bold text-lg text-[#19191B]">Customer Reviews Moderation</h2>
          <p className="text-xs text-[#7A7A80]">Approve and monitor verified buyer reviews and ratings</p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex items-center p-1 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs font-semibold overflow-x-auto self-start sm:self-auto">
          {['all', 'approved', 'pending', 'hidden'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filterStatus === st ? 'bg-[#19191B] text-white font-bold shadow-2xs' : 'text-[#7A7A80] hover:text-[#19191B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white rounded-2xl border border-[#E9E6DC] p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F4F2EA]">
              <div className="flex items-center gap-3">
                <img src={rev.productImage} alt={rev.productName} className="w-10 h-10 rounded-xl object-cover bg-[#FAF9F5] border border-[#E9E6DC]" />
                <div>
                  <div className="font-display font-bold text-xs text-[#19191B]">{rev.productName}</div>
                  <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-[10px] font-bold text-[#19191B] ml-1">{rev.rating}.0</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  rev.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : rev.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {rev.status}
                </span>
                <span className="text-[10px] text-[#7A7A80]">{rev.date}</span>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-[#19191B]">{rev.title}</h4>
              <p className="text-xs text-[#57585C] mt-1 leading-relaxed">"{rev.comment}"</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#F4F2EA] text-xs">
              <div className="flex items-center gap-2 text-[#7A7A80]">
                <span className="font-semibold text-[#19191B]">{rev.customerName}</span>
                {rev.verifiedPurchase && (
                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 self-end sm:self-auto">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'approved')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {rev.status !== 'hidden' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'hidden')}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </button>
                )}

                <button
                  onClick={() => setDeletingReview(rev)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={deletingReview !== null}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        message="Permanently remove this review from product page listings."
      />
    </div>
  );
};
