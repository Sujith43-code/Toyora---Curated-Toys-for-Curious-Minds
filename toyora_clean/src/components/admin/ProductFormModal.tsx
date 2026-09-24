import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Product, ProductCategory, AgeBracket, PlayType } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  initialProduct?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Wooden & Montessori',
  'Building & STEM',
  'Arts & Crafts',
  'Puzzles & Brainteasers',
  'Pretend & Imaginative',
  'Active & Outdoor',
  'Sensory & Plush'
];

const AGE_BRACKETS: AgeBracket[] = ['0-2', '3-5', '6-8', '9-12', '12+'];

const PLAY_TYPES: PlayType[] = ['Build', 'Create', 'Explore', 'Imagine', 'Move'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'specs' | 'media'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Wooden & Montessori');
  const [ageBracket, setAgeBracket] = useState<AgeBracket>('3-5');
  const [ageDisplay, setAgeDisplay] = useState('3 Years+');
  const [playType, setPlayType] = useState<PlayType>('Build');
  const [price, setPrice] = useState<number>(1499);
  const [originalPrice, setOriginalPrice] = useState<number>(1899);
  const [stockCount, setStockCount] = useState<number>(20);
  const [sku, setSku] = useState('');
  const [inStock, setInStock] = useState<boolean>(true);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [developmentalBenefits, setDevelopmentalBenefits] = useState<string>('Spatial reasoning, Fine motor control');
  const [material, setMaterial] = useState('FSC Natural Beechwood');
  const [dimensions, setDimensions] = useState('25 x 18 x 8 cm');
  const [pieceCount, setPieceCount] = useState<number>(12);
  const [safetyStandards, setSafetyStandards] = useState('BIS IS-9873, ASTM F963, CE');
  const [boxContents, setBoxContents] = useState('Product Set, Care Guide, Canvas Bag');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setTagline(initialProduct.tagline || '');
      setCategory(initialProduct.category || 'Wooden & Montessori');
      setAgeBracket(initialProduct.ageBracket || '3-5');
      setAgeDisplay(initialProduct.ageDisplay || '3 Years+');
      setPlayType(initialProduct.playType || 'Build');
      setPrice(initialProduct.price || 1499);
      setOriginalPrice(initialProduct.originalPrice || initialProduct.price || 1899);
      setStockCount(initialProduct.stockCount ?? 20);
      setSku(initialProduct.sku || '');
      setInStock(initialProduct.inStock ?? true);
      setIsBestSeller(initialProduct.isBestSeller ?? false);
      setIsNewArrival(initialProduct.isNewArrival ?? false);
      setDescription(initialProduct.description || '');
      setDevelopmentalBenefits(initialProduct.developmentalBenefits?.join(', ') || '');
      setMaterial(initialProduct.specifications?.material || 'FSC Natural Beechwood');
      setDimensions(initialProduct.specifications?.dimensions || '25 x 18 x 8 cm');
      setPieceCount(initialProduct.specifications?.pieceCount || 12);
      setSafetyStandards(initialProduct.specifications?.safetyStandards || 'BIS IS-9873');
      setBoxContents(initialProduct.specifications?.boxContents || 'Product Set, Guide');
      setImages(initialProduct.images?.length > 0 ? initialProduct.images : [
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'
      ]);
    } else {
      setName('');
      setTagline('');
      setCategory('Wooden & Montessori');
      setAgeBracket('3-5');
      setAgeDisplay('3 Years+');
      setPlayType('Build');
      setPrice(1499);
      setOriginalPrice(1899);
      setStockCount(20);
      setSku(`TYR-WOD-${Math.floor(100 + Math.random() * 900)}`);
      setInStock(true);
      setIsBestSeller(false);
      setIsNewArrival(true);
      setDescription('');
      setDevelopmentalBenefits('Spatial reasoning, Fine motor control');
      setMaterial('FSC Natural Beechwood');
      setDimensions('25 x 18 x 8 cm');
      setPieceCount(12);
      setSafetyStandards('BIS IS-9873, ASTM F963');
      setBoxContents('Product Set, Care Guide');
      setImages([
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'
      ]);
    }
    setErrors({});
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDemoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImages(prev => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!tagline.trim()) errs.tagline = 'Short tagline is required';
    if (!price || price <= 0) errs.price = 'Valid price is required';
    if (images.length === 0) errs.images = 'At least one product image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const benefitsArray = developmentalBenefits
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const productPayload = {
      ...(initialProduct ? { id: initialProduct.id } : {}),
      slug,
      sku: sku || `TYR-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      tagline: tagline.trim(),
      category,
      ageBracket,
      ageDisplay,
      playType,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      rating: initialProduct?.rating || 4.8,
      reviewCount: initialProduct?.reviewCount || 1,
      inStock: stockCount > 0,
      stockCount: Number(stockCount),
      isBestSeller,
      isNewArrival,
      description: description.trim() || tagline.trim(),
      developmentalBenefits: benefitsArray.length > 0 ? benefitsArray : ['Hand-eye coordination', 'Creative problem solving'],
      features: ['Sustainably produced', 'Child-safe non-toxic finishes'],
      specifications: {
        material,
        dimensions,
        pieceCount: Number(pieceCount),
        safetyStandards,
        care: 'Wipe clean with a soft damp cloth',
        boxContents
      },
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'],
      reviews: initialProduct?.reviews || []
    };

    onSave(productPayload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E9E6DC] flex flex-col max-h-[90dvh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E9E6DC] flex items-center justify-between bg-[#FAF9F5] shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg text-[#19191B]">
              {initialProduct ? 'Edit Toyora Catalogue Item' : 'Create New Toy Product'}
            </h2>
            <p className="text-xs text-[#7A7A80]">Fill in details for storefront display and inventory tracking</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A7A80] hover:text-[#19191B] hover:bg-[#E9E6DC] rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Tabs */}
        <div className="flex border-b border-[#E9E6DC] bg-[#FAF9F5] px-4 shrink-0 overflow-x-auto">
          {[
            { id: 'basic', label: '1. Basic Info' },
            { id: 'pricing', label: '2. Pricing & Stock' },
            { id: 'specs', label: '3. Specifications' },
            { id: 'media', label: '4. Images & Media' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#D85A38] text-[#D85A38]'
                  : 'border-transparent text-[#7A7A80] hover:text-[#19191B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#19191B] mb-1">
                  Product Name <span className="text-[#D85A38]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rainbow Wooden Stacking Arch"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                />
                {errors.name && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19191B] mb-1">
                  Tagline / Short Summary <span className="text-[#D85A38]">*</span>
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. 12-piece FSC certified beechwood nesting arch"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                />
                {errors.tagline && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.tagline}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">Age Bracket</label>
                  <select
                    value={ageBracket}
                    onChange={e => setAgeBracket(e.target.value as AgeBracket)}
                    className="w-full px-3 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  >
                    {AGE_BRACKETS.map(a => (
                      <option key={a} value={a}>{a} Years</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">Play Intent</label>
                  <select
                    value={playType}
                    onChange={e => setPlayType(e.target.value as PlayType)}
                    className="w-full px-3 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  >
                    {PLAY_TYPES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19191B] mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detailed description for the product page..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STOCK */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">
                    Selling Price (₹) <span className="text-[#D85A38]">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden font-bold"
                  />
                  {errors.price && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">
                    Original Price (MRP)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={e => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">
                    Inventory Stock Count
                  </label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={e => setStockCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="e.g. TYR-WOD-012"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] font-mono focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 border-t border-[#F4F2EA]">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#19191B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={e => setIsBestSeller(e.target.checked)}
                    className="rounded-md border-[#D8D4C5] text-[#D85A38] focus:ring-[#D85A38]"
                  />
                  <span>Mark as Best Seller Badge</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#19191B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={e => setIsNewArrival(e.target.checked)}
                    className="rounded-md border-[#D8D4C5] text-[#D85A38] focus:ring-[#D85A38]"
                  />
                  <span>Mark as New Arrival Badge</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#19191B] mb-1">
                  Developmental Benefits (comma separated)
                </label>
                <input
                  type="text"
                  value={developmentalBenefits}
                  onChange={e => setDevelopmentalBenefits(e.target.value)}
                  placeholder="e.g. Fine motor skills, Spatial awareness"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={e => setMaterial(e.target.value)}
                    placeholder="e.g. FSC Certified Beechwood"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={e => setDimensions(e.target.value)}
                    placeholder="e.g. 30 x 15 x 7 cm"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">Safety Certification Standards</label>
                  <input
                    type="text"
                    value={safetyStandards}
                    onChange={e => setSafetyStandards(e.target.value)}
                    placeholder="e.g. BIS IS-9873, ASTM F963, CE"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#19191B] mb-1">Piece Count</label>
                  <input
                    type="number"
                    value={pieceCount}
                    onChange={e => setPieceCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19191B] mb-1">Box Contents</label>
                <input
                  type="text"
                  value={boxContents}
                  onChange={e => setBoxContents(e.target.value)}
                  placeholder="e.g. 12 Nesting Arches, Cotton Bag, Care Manual"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 4: IMAGES & MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#19191B] mb-1">Product Images Preview</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#E9E6DC] group bg-[#FAF9F5]">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.images}</p>}
              </div>

              {/* Add Image via URL */}
              <div>
                <label className="block text-xs font-bold text-[#19191B] mb-1">Add Image via Web URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs text-[#19191B] focus:bg-white focus:border-[#D85A38] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[#19191B] text-white rounded-xl text-xs font-bold hover:bg-[#D85A38] transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Drag/Drop Local Upload Dropzone */}
              <div className="border-2 border-dashed border-[#D8D4C5] rounded-xl p-5 text-center bg-[#FAF9F5] hover:bg-white transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDemoFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-[#7A7A80] mx-auto mb-2" />
                <div className="text-xs font-bold text-[#19191B]">Click or drag local image file</div>
                <div className="text-[10px] text-[#7A7A80] mt-0.5">Supports PNG, JPG, WEBP (Local Preview Only)</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E9E6DC] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E9E6DC] text-xs font-bold text-[#57585C] hover:bg-[#FAF9F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#19191B] hover:bg-[#D85A38] text-white text-xs font-bold shadow-md transition-colors inline-flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialProduct ? 'Save Product Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
