import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { AdminCategory } from '../../services/categoryService';
import { ProductCategory } from '../../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<AdminCategory>) => void;
  initialCategory?: AdminCategory | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory
}) => {
  const [name, setName] = useState<ProductCategory>('Wooden & Montessori');
  const [description, setDescription] = useState('');
  const [ageFocus, setAgeFocus] = useState('0–5 Years');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600');

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setDescription(initialCategory.description);
      setAgeFocus(initialCategory.ageBracketFocus);
      setImage(initialCategory.featuredImage);
    } else {
      setName('Wooden & Montessori');
      setDescription('');
      setAgeFocus('0–5 Years');
      setImage('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600');
    }
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSave({
      name,
      slug,
      description,
      ageBracketFocus: ageFocus,
      featuredImage: image,
      status: 'active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E9E6DC] p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E6DC]">
          <h3 className="font-display font-bold text-base text-[#19191B]">
            {initialCategory ? 'Edit Toy Category' : 'Add New Toy Category'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A7A80] hover:text-[#19191B] hover:bg-[#FAF9F5] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#19191B] mb-1">Category Title</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value as ProductCategory)}
              placeholder="e.g. Wooden & Montessori"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#19191B] mb-1">Target Age Focus</label>
            <input
              type="text"
              value={ageFocus}
              onChange={e => setAgeFocus(e.target.value)}
              placeholder="e.g. 0–5 Years"
              className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#19191B] mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short category description..."
              className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#19191B] mb-1">Featured Banner Image URL</label>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-[#E9E6DC] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E9E6DC] text-xs font-bold text-[#57585C] hover:bg-[#FAF9F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
