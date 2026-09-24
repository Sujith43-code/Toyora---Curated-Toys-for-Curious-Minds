import React, { useState, useEffect } from 'react';
import { Plus, FolderTree, Pencil, Trash2, Layers } from 'lucide-react';
import { categoryService, AdminCategory } from '../../../services/categoryService';
import { CategoryModal } from '../CategoryModal';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const CategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const list = await categoryService.getCategories();
    setCategories(list);
  };

  const handleSaveCategory = async (data: Partial<AdminCategory>) => {
    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id, data);
    } else {
      await categoryService.createCategory(data as any);
    }
    loadCategories();
    setEditingCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (deletingCategory) {
      await categoryService.deleteCategory(deletingCategory.id);
      loadCategories();
      setDeletingCategory(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E6DC] shadow-2xs">
        <div>
          <h2 className="font-display font-bold text-lg text-[#19191B]">Toyora Categories</h2>
          <p className="text-xs text-[#7A7A80]">Organize store catalogue groupings and play taxonomy</p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-[#E9E6DC] overflow-hidden shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="aspect-16/9 overflow-hidden bg-[#FAF9F5] relative border-b border-[#E9E6DC]">
                <img src={cat.featuredImage} alt={cat.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-[#19191B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {cat.productCount} products
                </span>
              </div>

              <div className="p-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D85A38]">
                  Focus: {cat.ageBracketFocus}
                </span>
                <h3 className="font-display font-bold text-base text-[#19191B]">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#57585C] line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-[#F4F2EA] flex items-center justify-between gap-2 mt-auto">
              <span className="text-[10px] font-mono text-[#7A7A80]">
                /{cat.slug}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-[#57585C] hover:text-[#D85A38] hover:bg-[#FAEEE9] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Edit Category"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingCategory(cat)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        initialCategory={editingCategory}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        itemName={deletingCategory?.name}
        message="Deleting this category will remove its grouping. Products assigned to it will remain in inventory."
      />
    </div>
  );
};
