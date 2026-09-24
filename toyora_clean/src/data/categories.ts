import { AgeBracket, PlayType, ProductCategory, PlayroomStory } from '../types';

export interface AgeCategoryInfo {
  bracket: AgeBracket;
  label: string;
  range: string;
  description: string;
  milestoneTag: string;
  image: string;
}

export const AGE_CATEGORIES: AgeCategoryInfo[] = [
  {
    bracket: '0-2',
    label: '0–2 Years',
    range: 'Infant & Toddler',
    description: 'Sensory discovery, stacking textures, non-toxic grasping teethers, and gentle gross-motor milestones.',
    milestoneTag: 'Sensory & First Steps',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'
  },
  {
    bracket: '3-5',
    label: '3–5 Years',
    range: 'Early Explorer',
    description: 'Imaginative pretend play, magnetic construction, balance tracks, and collaborative social games.',
    milestoneTag: 'Imagination & Balance',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80'
  },
  {
    bracket: '6-8',
    label: '6–8 Years',
    range: 'Curious Learner',
    description: 'Introductory STEM kits, botanical arts, optical microscopes, and intricate kinetic marble tracks.',
    milestoneTag: 'STEM & Fine Arts',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80'
  },
  {
    bracket: '9-12',
    label: '9–12 Years',
    range: 'Junior Inventor',
    description: 'Solar robotic mechanics, complex strategy mazes, observational field biology, and architectural builds.',
    milestoneTag: 'Engineering & Logic',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80'
  },
  {
    bracket: '12+',
    label: '12+ Years',
    range: 'Teen & Family',
    description: 'Mechanical automata sculptures, advanced physics labs, and heirloom tabletop design puzzles.',
    milestoneTag: 'Automata & Design',
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80'
  }
];

export interface PlayTypeInfo {
  type: PlayType;
  title: string;
  tagline: string;
  iconName: string;
  accentColor: string;
}

export const PLAY_TYPES: PlayTypeInfo[] = [
  {
    type: 'Build',
    title: 'Build',
    tagline: 'Architectural tiles, marble runs, stacking arches & balance physics',
    iconName: 'Blocks',
    accentColor: '#D85A38'
  },
  {
    type: 'Create',
    title: 'Create',
    tagline: 'Botanical pigments, beeswax clay, sculpting & automata crafts',
    iconName: 'Palette',
    accentColor: '#9F361A'
  },
  {
    type: 'Explore',
    title: 'Explore',
    tagline: 'Planetary solar rovers, 40x optical microscopes & field forager gear',
    iconName: 'Compass',
    accentColor: '#22382E'
  },
  {
    type: 'Imagine',
    title: 'Imagine',
    tagline: 'Artisan kitchen pantries, heirloom plush companions & city vehicles',
    iconName: 'Sparkles',
    accentColor: '#4A3E72'
  },
  {
    type: 'Move',
    title: 'Move',
    tagline: 'Sensory stepping stones, balancing rockers & gross-motor active courses',
    iconName: 'Footprints',
    accentColor: '#A36829'
  }
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Wooden & Montessori',
  'Building & STEM',
  'Arts & Crafts',
  'Puzzles & Brainteasers',
  'Pretend & Imaginative',
  'Active & Outdoor',
  'Sensory & Plush'
];

export const PLAYROOM_STORIES: PlayroomStory[] = [
  {
    id: 'creative-corner',
    title: 'The Creative Corner',
    subtitle: 'For little makers, artists, and architectural dreamers',
    description: 'A serene play environment curated to foster boundless design, tactile coloring, and open-ended structural engineering. Every material is natural, reusable, and calming for young nervous systems.',
    heroImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80',
    playTypes: ['Build', 'Create'],
    suggestedAge: '3–10 Years',
    featuredProductIds: ['toy-02', 'toy-03', 'toy-09', 'toy-16']
  },
  {
    id: 'adventure-shelf',
    title: 'The Adventure Shelf',
    subtitle: 'For curious observers and budding natural scientists',
    description: 'Designed for the child who turns every garden walk into an archaeological expedition. Real optics, solar engines, and field gear that answer real scientific questions.',
    heroImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    playTypes: ['Explore', 'Build'],
    suggestedAge: '5–14 Years',
    featuredProductIds: ['toy-04', 'toy-07', 'toy-11', 'toy-13']
  },
  {
    id: 'sensory-wooden-studio',
    title: 'Sensory & Wooden Studio',
    subtitle: 'Calm, organic tactile exploration from first steps onward',
    description: 'Plastic-free, solid beech and rubberwood essentials that look organic in the nursery and feel comforting to little hands. Warm tones, acoustic rattles, and gentle developmental milestones.',
    heroImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80',
    playTypes: ['Imagine', 'Move', 'Explore'],
    suggestedAge: '0–6 Years',
    featuredProductIds: ['toy-01', 'toy-05', 'toy-08', 'toy-10', 'toy-12', 'toy-14']
  }
];
