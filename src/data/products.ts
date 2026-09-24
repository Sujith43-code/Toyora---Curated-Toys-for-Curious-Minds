import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'toy-01',
    slug: 'nordic-wooden-rainbow-stacker',
    name: 'Nordic Solid Beech Rainbow Stacker',
    tagline: '12-piece open-ended Waldorf nesting arches crafted from sustainably harvested beechwood.',
    category: 'Wooden & Montessori',
    ageBracket: '0-2',
    ageDisplay: '12 Months+',
    playType: 'Imagine',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 1299,
    originalPrice: 1699,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 128,
    inStock: true,
    stockCount: 18,
    isBestSeller: true,
    isStaffPick: true,
    isEcoFriendly: true,
    description: 'A timeless, open-ended staple for early childhood. Each arch is precision-cut from single blocks of European beechwood and finished with baby-safe, water-based plant stains. Toddlers stack, nest, bridge, and build miniature worlds while developing hand-eye coordination and spatial reasoning.',
    developmentalBenefits: [
      'Encourages open-ended creative thinking with no right or wrong way to play',
      'Refines gross and fine motor coordination and balance perception',
      'Introduces grading sizes, color harmony, and geometric architecture'
    ],
    features: [
      '12 graduated nested wooden arches',
      'Non-toxic organic plant dyes with velvety grip texture',
      'Smooth hand-sanded beveled edges safe for teething explorers',
      'FSC-certified renewable beechwood'
    ],
    specifications: {
      material: '100% Solid European Beechwood, water-based matte non-toxic stain',
      dimensions: '36 cm × 18 cm × 7 cm',
      pieceCount: 12,
      safetyStandards: 'BIS IS-9873, ASTM F963, EN71 Safety Certified',
      care: 'Wipe with a damp cloth; do not submerge in water. Allow to air dry.',
      boxContents: '12 Wooden Stacking Arches, Linen Storage Bag, Open-Ended Play Guide'
    },
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-01',
        author: 'Ananya S.',
        verified: true,
        rating: 5,
        date: '14 Jan 2026',
        title: 'Outstanding quality and endless play',
        comment: 'My 2-year-old builds bridges, tunnels for wooden trains, and baby beds for her dolls with this. The wood texture is velvety and does not slip when stacking high.',
        childAge: '2 years old'
      },
      {
        id: 'rev-02',
        author: 'Rohan M.',
        verified: true,
        rating: 5,
        date: '02 Feb 2026',
        title: 'Beautiful on the shelf and loved by both kids',
        comment: 'Both my 18-month-old and 5-year-old play with this daily. Heirloom-level craftsmanship.',
        childAge: '1.5 & 5 years old'
      }
    ]
  },
  {
    id: 'toy-02',
    slug: 'magna-architect-100-magnetic-tiles',
    name: 'Magna-Architect 100-Piece Magnetic Builder',
    tagline: 'Translucent crystal 3D magnetic building tiles with reinforced sonic-welded seams.',
    category: 'Building & STEM',
    ageBracket: '3-5',
    ageDisplay: '3–8 Years',
    playType: 'Build',
    playroomCollection: 'The Creative Corner',
    price: 2499,
    originalPrice: 3299,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    stockCount: 34,
    isBestSeller: true,
    isStaffPick: true,
    description: 'Ignite hours of engineering and spatial design. Featuring rare-earth neodymium magnets sealed in rivet-reinforced, food-grade ABS plastic, these faceted jewel tiles click together easily at any angle to build castles, towering skyscrapers, rocket ships, and geometric spheres.',
    developmentalBenefits: [
      'Develops foundational STEM principles: magnetism, balance, 3D geometry',
      'Promotes patience, perseverance, and collaborative peer play',
      'Sensory light exploration: beautiful when built near windows or light tables'
    ],
    features: [
      '100 vibrant translucent tiles in 8 architectural shapes',
      'Dual-riveted magnetic encasements for unmatched drop durability',
      'Scratch-resistant lattice surface pattern',
      'Includes 2 wheeled car chassis for moving vehicles'
    ],
    specifications: {
      material: 'BPA-free Food-Grade MABS Plastic with encapsulated Neodymium magnets',
      dimensions: 'Tile base standard: 7.5 cm × 7.5 cm',
      pieceCount: 100,
      safetyStandards: 'BIS IS-9873 part 1/2/3, ASTM F963-17 certified',
      care: 'Wipe clean with a mild soapy cloth. Keep away from high heat.',
      boxContents: '100 magnetic tiles, 2 wheeled bases, ideas inspiration booklet, canvas tote bag'
    },
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-03',
        author: 'Priya K.',
        verified: true,
        rating: 5,
        date: '28 Jan 2026',
        title: 'The single best toy investment in our house',
        comment: 'Keeps my 4-year-old engaged for over an hour without any screen. The magnets are remarkably strong and do not collapse easily.',
        childAge: '4 years old'
      }
    ]
  },
  {
    id: 'toy-03',
    slug: 'botanical-eco-art-studio-kit',
    name: 'Botanical Eco-Pigment Watercolor & Clay Studio',
    tagline: '100% natural flower & mineral art box with organic beeswax crayons and terracotta clay.',
    category: 'Arts & Crafts',
    ageBracket: '6-8',
    ageDisplay: '4–10 Years',
    playType: 'Create',
    playroomCollection: 'The Creative Corner',
    price: 1199,
    originalPrice: 1499,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 94,
    inStock: true,
    stockCount: 15,
    isNewArrival: true,
    isEcoFriendly: true,
    description: 'An earth-friendly fine arts studio designed specifically for budding artists. Handcrafted from crushed dried petals, spirulina, turmeric, and mineral earth clays. Free of synthetic petrochemical pigments and artificial fragrances.',
    developmentalBenefits: [
      'Fosters tactile sensory grounding and emotional self-expression',
      'Builds tripod grip strength and precise motor control',
      'Encourages mindfulness and nature appreciation'
    ],
    features: [
      '8 cake botanical watercolors in real metal palette tin',
      '8 triangular ergonomic organic beeswax crayons',
      '500g natural air-dry terracotta modeling clay',
      '2 FSC wooden horsehair brushes & 20 sheets cold-press textured cotton paper'
    ],
    specifications: {
      material: 'Organic beeswax, plant pigments, natural terracotta clay, cotton paper',
      dimensions: 'Box: 28 cm × 20 cm × 6 cm',
      pieceCount: 32,
      safetyStandards: 'AP Non-Toxic Certified, BIS IS-9873 compliant',
      care: 'Store in a cool dry place. Clay seals in included airtight tin.',
      boxContents: 'Watercolor tin, 8 crayons, 500g clay, 2 brushes, paper pack, wooden sculpting tools'
    },
    images: [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-04',
        author: 'Meera V.',
        verified: true,
        rating: 5,
        date: '10 Feb 2026',
        title: 'Colors smell like honey and lavender',
        comment: 'So refreshing to have an art kit that is truly non-toxic. The paper quality is substantial and does not buckle when wet.',
        childAge: '6 years old'
      }
    ]
  },
  {
    id: 'toy-04',
    slug: 'solarpowered-mars-rover-engineer-lab',
    name: 'Solar Rover STEM Planetary Lab',
    tagline: 'Build 4 functional off-road robotic rovers powered by direct sunlight and gear mechanics.',
    category: 'Building & STEM',
    ageBracket: '9-12',
    ageDisplay: '8–14 Years',
    playType: 'Explore',
    playroomCollection: 'The Adventure Shelf',
    price: 1899,
    originalPrice: 2299,
    discountPercent: 17,
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    stockCount: 22,
    isBestSeller: true,
    description: 'A hands-on mechanical engineering expedition for curious inventors. Kids assemble gears, high-efficiency monocrystalline solar cells, planetary axles, and suspension springs to conquer indoor terrain and sunny outdoor pavements.',
    developmentalBenefits: [
      'Teaches renewable solar energy, gear ratios, and torque mechanics',
      'Strengthens complex schematic reading and systematic problem solving',
      'Inspires aerospace curiosity and scientific inquiry'
    ],
    features: [
      'Modular snap-fit chassis (no glue or soldering needed)',
      'High-efficiency micro solar panel + auxiliary battery hybrid pack',
      'Independent 4-wheel suspension with rubber grip terrain treads',
      'Detailed 36-page comic style planetary mission guidebook'
    ],
    specifications: {
      material: 'Impact-resistant ABS polymer, copper micro-motor, silicon solar wafer',
      dimensions: 'Rover assembled: 22 cm × 14 cm × 11 cm',
      pieceCount: 142,
      safetyStandards: 'BIS IS-9873, FCC Part 15, CE Certified',
      care: 'Keep motor compartment dry. Store solar panel facing up.',
      boxContents: '142 snap parts, solar panel unit, electric motor, gears, mission log journal'
    },
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-05',
        author: 'Vikram S.',
        verified: true,
        rating: 5,
        date: '04 Feb 2026',
        title: 'My son was fascinated when it moved in sunlight',
        comment: 'The step by step manual was very lucid. It teaches real physics and gear mechanics without being dry.',
        childAge: '10 years old'
      }
    ]
  },
  {
    id: 'toy-05',
    slug: 'montessori-sensory-wooden-kitchen-pantry',
    name: 'Artisan Wooden Chef & Farmers Market Pantry',
    tagline: 'Hand-carved solid rubberwood culinary set with magnetic slicing vegetables and chef apron.',
    category: 'Pretend & Imaginative',
    ageBracket: '3-5',
    ageDisplay: '2–6 Years',
    playType: 'Imagine',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 1799,
    originalPrice: 2399,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 162,
    inStock: true,
    stockCount: 12,
    isBestSeller: true,
    isEcoFriendly: true,
    description: 'Transform playtime into a bustling kitchen or farm stand. Features 16 realistic wooden vegetables and fruits connected by satisfying magnetic cores that "crunch" apart when sliced with the blunt wooden safety knife.',
    developmentalBenefits: [
      'Develops language through rich social culinary roleplay and grocery games',
      'Introduces fractions and portioning through sliceable segments',
      'Builds nutritional familiarity with farm-fresh produce'
    ],
    features: [
      '16 sliceable fruits & vegetables (avocado, carrot, tomato, sourdough, etc.)',
      'Smooth wooden chef knife and chopping board with juice groove',
      'Linen shopping crate and 100% organic cotton chef apron',
      'Hidden magnets for gentle, repeatable slicing tactile feedback'
    ],
    specifications: {
      material: 'Plantation rubberwood, non-toxic food-safe lacquer, cotton apron',
      dimensions: 'Crate: 26 cm × 19 cm × 12 cm',
      pieceCount: 20,
      safetyStandards: 'BIS certified IS-9873, EN71-3 food safe contact compliant',
      care: 'Wipe with damp cloth. Do not soak in water.',
      boxContents: '16 food pieces, wooden cutting board, wooden knife, crate, chef apron'
    },
    images: [
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-06',
        author: 'Shalini D.',
        verified: true,
        rating: 5,
        date: '20 Jan 2026',
        title: 'The magnetic slicing sound is so satisfying',
        comment: 'Unlike velcro that wears out and catches lint, these magnets are safely concealed and feel great to cut with the wooden knife.',
        childAge: '3 years old'
      }
    ]
  },
  {
    id: 'toy-06',
    slug: 'wildlife-wooden-balancing-ark-game',
    name: 'Wilderness Animals Balancing Stacking Rocker',
    tagline: '14 hand-painted safari animals on an undulating balancing crescent moon boat.',
    category: 'Wooden & Montessori',
    ageBracket: '3-5',
    ageDisplay: '3–7 Years',
    playType: 'Build',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    stockCount: 25,
    isBestSeller: true,
    description: 'A test of equilibrium, physics, and gentle hands. Children take turns balancing the elephant, giraffe, lion, and monkey atop the rocking wooden hull without tipping the animals overboard.',
    developmentalBenefits: [
      'Nurtures emotional resilience and concentration during high-stakes balance',
      'Teaches counterweight physics and center of gravity intuition',
      'Supports turn-taking family game nights and solo quiet time'
    ],
    features: [
      '14 chunky wooden animals with distinctive tactile profiles',
      'Weighted rocker base with smooth tilt radius',
      'Water-based matte paints with natural wood grain visible',
      'Includes illustrated animal fact cards'
    ],
    specifications: {
      material: 'Sustainable pine and birch plywood, non-toxic pigment',
      dimensions: 'Ark base: 24 cm × 12 cm × 4 cm',
      pieceCount: 15,
      safetyStandards: 'BIS IS-9873 compliant, ASTM tested',
      care: 'Clean with dry or slightly damp soft cloth.',
      boxContents: '14 animal figures, 1 balance base, 1 dice, animal card deck'
    },
    images: [
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-07',
        author: 'Kavita N.',
        verified: true,
        rating: 5,
        date: '08 Feb 2026',
        title: 'Perfect birthday present under 1000',
        comment: 'Simple concept, high quality, and surprisingly challenging even for adults playing with the kids.',
        childAge: '4 years old'
      }
    ]
  },
  {
    id: 'toy-07',
    slug: 'optical-wooden-microscope-explorer',
    name: 'Curious Naturalist 40x Wooden Optical Field Scope',
    tagline: 'Real dual-lens 40x optical microscope crafted from birch ply with glass specimen slides.',
    category: 'Building & STEM',
    ageBracket: '6-8',
    ageDisplay: '6–12 Years',
    playType: 'Explore',
    playroomCollection: 'The Adventure Shelf',
    price: 1599,
    originalPrice: 1999,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 62,
    inStock: true,
    stockCount: 19,
    isStaffPick: true,
    description: 'Brings the unseen wonders of leaves, pollen, butterfly wings, and fabric weaves into razor-sharp optical focus. Features real optical glass lenses, precision thumb-wheel rack and pinion focus, and built-in natural ambient light mirror.',
    developmentalBenefits: [
      'Sparks genuine scientific curiosity and observational documentation',
      'Bridges outdoor field walks with indoor analytical discovery',
      'Cultivates patience and fine motor focus calibration'
    ],
    features: [
      'True 40x magnification with ground optical glass (not cheap plastic lenses)',
      'Natural light reflector mirror plus clip-on soft LED illuminator',
      'Includes 6 prepared botanical slides and 4 blank slides for custom foraging',
      'Field notebook with specimen drawing prompts'
    ],
    specifications: {
      material: 'Birch plywood, precision optical glass, brass thumbscrews',
      dimensions: '18 cm × 12 cm × 26 cm',
      pieceCount: 14,
      safetyStandards: 'BIS IS-9873 compliant',
      care: 'Keep optical lenses clean with included microfiber lens cloth.',
      boxContents: '1 Microscope unit, 6 prepared slides, 4 blank slides, pipette, tweezers, field journal'
    },
    images: [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-08',
        author: 'Devendra T.',
        verified: true,
        rating: 5,
        date: '15 Jan 2026',
        title: 'Real glass optics make a huge difference',
        comment: 'So many toy microscopes are blurry plastic gimmicks. This one actually lets my daughter see the vein patterns of garden leaves clearly.',
        childAge: '8 years old'
      }
    ]
  },
  {
    id: 'toy-08',
    slug: 'organic-cotton-cuddle-bear-heirloom',
    name: 'Heirloom Organic Cotton Cuddle Bear & Wardrobe',
    tagline: 'Hand-knitted GOTS certified organic cotton plush bear with removable linen dungarees.',
    category: 'Sensory & Plush',
    ageBracket: '0-2',
    ageDisplay: 'From Birth (0+)',
    playType: 'Imagine',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 999,
    originalPrice: 1299,
    discountPercent: 23,
    rating: 5.0,
    reviewCount: 110,
    inStock: true,
    stockCount: 20,
    isBestSeller: true,
    isEcoFriendly: true,
    description: 'A soothing lifelong companion for naps, nursery snuggles, and imaginative storytelling. Spun from 100% GOTS certified organic Egyptian cotton with embroidered features to ensure safety for newborns and sensitive skin.',
    developmentalBenefits: [
      'Provides comforting sensory reassurance and emotional regulation',
      'Encourages early nurturing and empathetic caregiver play',
      'Develops finger dexterity through dressing and buttoning linen garments'
    ],
    features: [
      '100% GOTS Organic Cotton knit outer & hypoallergenic corn-fiber stuffing',
      'Embroidered eyes, nose, and paws—zero plastic choking hazards',
      'Includes 2 interchangeable linen outfits (dungarees and knit cardigan)',
      'Machine washable on gentle cold cycle'
    ],
    specifications: {
      material: '100% GOTS Organic Cotton, plant fiber filling',
      dimensions: 'Height: 32 cm seated / 40 cm standing',
      pieceCount: 3,
      safetyStandards: 'BIS IS-9873 compliant, Oeko-Tex Standard 100 Class 1 (Baby safe)',
      care: 'Machine wash delicate cold in a laundry mesh bag; line dry flat.',
      boxContents: '1 Bear Plush, 1 Linen Dungaree, 1 Knit Sweater, Cotton Keepsake Pouch'
    },
    images: [
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-09',
        author: 'Tarini R.',
        verified: true,
        rating: 5,
        date: '25 Jan 2026',
        title: 'The softest toy we own',
        comment: 'Gave this as a baby shower gift and the parents loved that it was completely organic and machine washable.',
        childAge: '6 months old'
      }
    ]
  },
  {
    id: 'toy-09',
    slug: 'wooden-marble-run-kinetic-rollercoaster',
    name: 'Architect Kinetic Wooden Marble Run Cascade',
    tagline: '75-piece modular hardwood tracks with spiral elevators, bells, and steel marbles.',
    category: 'Building & STEM',
    ageBracket: '6-8',
    ageDisplay: '5–10 Years',
    playType: 'Build',
    playroomCollection: 'The Creative Corner',
    price: 2199,
    originalPrice: 2899,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 92,
    inStock: true,
    stockCount: 14,
    isStaffPick: true,
    description: 'Design gravity-defying raceways. Children configure ramps, switchbacks, chime bells, and vortex spirals to send heavy glass and wooden marbles hurtling through physics-based kinetic pathways.',
    developmentalBenefits: [
      'Grasps potential vs kinetic energy and momentum conservation',
      'Deepens spatial planning, iterative testing, and trial-and-error resilience',
      'Offers mesmerizing, calming visual-tracking sensory focus'
    ],
    features: [
      '75 interlocking solid hardwood track blocks and chutes',
      'Includes brass acoustic chime bells that ring as marbles roll past',
      '20 smooth glass marbles and 5 wooden speed balls',
      'Endless reconfigurable layouts from simple slopes to towering multi-tier tracks'
    ],
    specifications: {
      material: 'Solid rubberwood, polished brass accents, glass marbles',
      dimensions: 'Constructs up to 60 cm tall and 1 meter wide',
      pieceCount: 75,
      safetyStandards: 'BIS IS-9873 compliant, ASTM F963',
      care: 'Wipe wooden components with a dry cloth. Contains small balls (choking hazard under 3).',
      boxContents: '75 track pieces, 25 marbles, storage bag, layout blueprint guide'
    },
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-10',
        author: 'Arjun B.',
        verified: true,
        rating: 5,
        date: '31 Jan 2026',
        title: 'Mesmerizing for both kids and adults',
        comment: 'Building it together is half the fun, and watching the marbles cascade through different routes is addictive.',
        childAge: '7 years old'
      }
    ]
  },
  {
    id: 'toy-10',
    slug: 'montessori-wooden-sensory-activity-cube',
    name: 'Montessori 6-in-1 Sensory Toddler Activity Center',
    tagline: 'Multi-functional play cube with bead maze, clock, shape sorter, and gears.',
    category: 'Wooden & Montessori',
    ageBracket: '0-2',
    ageDisplay: '10M–3 Years',
    playType: 'Explore',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 1899,
    originalPrice: 2499,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 140,
    inStock: true,
    stockCount: 16,
    isBestSeller: true,
    description: 'Packed with 6 distinct discovery zones on every facet. Toddlers spin interlocking gears, guide beads along twisting wire rollercoasters, sort geometric hardwood prisms, match animal puzzles, and slide sliding sliders.',
    developmentalBenefits: [
      'Develops pincer grasp, wrist rotation, and fine finger isolation',
      'Teaches cause and effect, matching logic, and spatial insertion',
      'The top bead maze inverts inside the cube for compact flat storage'
    ],
    features: [
      '6 distinct activity stations in one space-saving footprint',
      'Heavy weighted base stays stable when toddlers pull up to stand',
      'Water-based organic food-safe finishes',
      'Invertible lid doubles as a sturdy storage box for blocks'
    ],
    specifications: {
      material: 'Sustainably farmed New Zealand Pine, non-toxic water-based paint, coated steel wire',
      dimensions: '30 cm × 30 cm × 32 cm',
      pieceCount: 6,
      safetyStandards: 'BIS IS-9873, EN-71, ASTM F963',
      care: 'Wipe with a damp towel.',
      boxContents: '1 Activity cube base, 1 reversible wire maze lid, 4 geometric sorting blocks'
    },
    images: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-11',
        author: 'Geetika P.',
        verified: true,
        rating: 5,
        date: '18 Feb 2026',
        title: 'Built like a rock, sturdy and beautiful',
        comment: 'My 11-month-old uses this to steady herself standing and spends so much time exploring the spinning gears.',
        childAge: '11 months old'
      }
    ]
  },
  {
    id: 'toy-11',
    slug: 'outdoor-nature-detective-forager-backpack',
    name: 'Nature Detective & Stargazer Field Expedition Kit',
    tagline: 'Canvas forager pack with real 8x binoculars, brass compass, specimen jars, and LED headlamp.',
    category: 'Active & Outdoor',
    ageBracket: '6-8',
    ageDisplay: '5–12 Years',
    playType: 'Explore',
    playroomCollection: 'The Adventure Shelf',
    price: 1499,
    originalPrice: 1899,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 79,
    inStock: true,
    stockCount: 28,
    isNewArrival: true,
    description: 'Equips young outdoor enthusiasts for backyard birdwatching, forest trails, park treasure hunts, and nighttime stargazing. All instruments are ruggedized for active outdoor adventures.',
    developmentalBenefits: [
      'Inspires outdoor active movement, trail exploration, and nature conservation',
      'Teaches real navigational skills with a functional magnetic compass',
      'Encourages scientific journaling and specimen collection without harming fauna'
    ],
    features: [
      'Shock-proof rubberized 8x21 optical binoculars with neck strap',
      'Heavyweight water-resistant waxed cotton canvas messenger backpack',
      'Liquid-filled military-style brass sighting compass',
      '2 ventilated insect/leaf observation catchers with 3x magnifying lids',
      'Adjustable wide-beam LED headlamp with red night-vision mode'
    ],
    specifications: {
      material: 'Waxed cotton canvas, optical glass, aluminum alloy, ABS',
      dimensions: 'Bag: 28 cm × 24 cm × 9 cm',
      pieceCount: 8,
      safetyStandards: 'BIS compliant, CE certified',
      care: 'Spot clean canvas bag. Wipe binoculars with microfiber lens cloth.',
      boxContents: '1 Canvas bag, 1 Binoculars, 1 Compass, 2 Specimen jars, 1 Headlamp, 1 Whistle, 1 Field logbook'
    },
    images: [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-12',
        author: 'Siddharth J.',
        verified: true,
        rating: 5,
        date: '12 Feb 2026',
        title: 'Turned every park visit into an expedition',
        comment: 'The binoculars have remarkably clear focus for a children’s kit. The waxed canvas bag is very handsome and durable.',
        childAge: '6 years old'
      }
    ]
  },
  {
    id: 'toy-12',
    slug: 'wooden-balance-stepping-stones-river-set',
    name: 'River Stones Wooden Balance Stepping Path (Set of 6)',
    tagline: 'Non-slip solid beech stepping stones for active gross motor balance circuits and indoor floor play.',
    category: 'Active & Outdoor',
    ageBracket: '3-5',
    ageDisplay: '2–8 Years',
    playType: 'Move',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 1999,
    originalPrice: 2699,
    discountPercent: 26,
    rating: 4.9,
    reviewCount: 84,
    inStock: true,
    stockCount: 15,
    isStaffPick: true,
    description: 'Transform your living room into an adventurous "the floor is lava" obstacle course or zen garden trail. Each stepping stone has a gentle domed curvature, distinct height grading, and silicone non-slip rubber grip ring beneath.',
    developmentalBenefits: [
      'Develops vestibular balance, ankle stability, and bilateral coordination',
      'Promotes energetic indoor physical play on rainy afternoons',
      'Helps children calibrate distance estimation and jump landing mechanics'
    ],
    features: [
      '6 graduated wooden river stones with textured sensory patterns',
      'Full perimeter non-skid silicone base protects hardwood and tiles',
      'Supports up to 90 kg (accommodates parents too!)',
      'Nests compactly into a single stack for space-saving storage'
    ],
    specifications: {
      material: 'High-density beech plywood, natural non-slip silicone rim',
      dimensions: 'Diameters from 18 cm to 32 cm; heights from 4 cm to 14 cm',
      pieceCount: 6,
      safetyStandards: 'BIS IS-9873, EN-71, ASTM F963-17',
      care: 'Wipe with damp cloth. Indoor and dry outdoor patio use.',
      boxContents: '6 Graduated Wooden Stepping Stones, 1 Linen Drawstring Bag'
    },
    images: [
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-13',
        author: 'Nandita C.',
        verified: true,
        rating: 5,
        date: '05 Feb 2026',
        title: 'Savior for energetic toddlers indoors',
        comment: 'The non-slip ring works perfectly on our marble flooring. Doesn’t slide even an inch during enthusiastic leaps.',
        childAge: '3.5 years old'
      }
    ]
  },
  {
    id: 'toy-13',
    slug: 'strategic-wooden-labyrinth-maze-game',
    name: 'Grand Labyrinth Precision Tilt Maze Table',
    tagline: 'Two-axis brass knob mechanical wooden maze with 3 interchangeable obstacle plates.',
    category: 'Puzzles & Brainteasers',
    ageBracket: '9-12',
    ageDisplay: '7–99 Years',
    playType: 'Build',
    playroomCollection: 'The Creative Corner',
    price: 1399,
    originalPrice: 1799,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 53,
    inStock: true,
    stockCount: 14,
    isNewArrival: true,
    description: 'A masterpiece of classic mechanical gaming. Players navigate a steel ball bearing through a treacherous maze of drop-holes using two calibrated thumb dials that tilt the gimbaled birch platform in X and Y axes.',
    developmentalBenefits: [
      'Trains sustained patience, micro-motor control, and hand-eye coordination',
      'Provides a tactile, screen-free focus challenge for kids and adults alike',
      'Interchangeable plates allow progressive difficulty scaling'
    ],
    features: [
      'Dual precision brass gimbal tilt dials with smooth fluid gearing',
      '3 magnetic drop-in maze plates (Beginner, Intermediate, Master)',
      'Solid acacia and birch hardwood cabinet',
      '4 steel ball bearings with magnetic storage dock'
    ],
    specifications: {
      material: 'Solid Acacia frame, Birch plywood, Brass gearing, Steel balls',
      dimensions: '30 cm × 26 cm × 8 cm',
      pieceCount: 5,
      safetyStandards: 'BIS IS-9873 compliant',
      care: 'Keep in dry environment. Polish wood with beeswax occasionally.',
      boxContents: '1 Labyrinth unit, 3 maze plates, 4 steel balls, velvet storage bag'
    },
    images: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-14',
        author: 'Deepak V.',
        verified: true,
        rating: 5,
        date: '22 Jan 2026',
        title: 'Whole family competes for the best time',
        comment: 'The craftsmanship is top-notch. It sits permanently on our living room coffee table now.',
        childAge: '11 years old'
      }
    ]
  },
  {
    id: 'toy-14',
    slug: 'sensory-wooden-sound-blocks-melody-set',
    name: 'Sensory Acoustics Wooden Sound & Texture Cubes (12 Pc)',
    tagline: 'Acoustic discovery blocks filled with beads, bells, sand, and optical prisms.',
    category: 'Sensory & Plush',
    ageBracket: '0-2',
    ageDisplay: '6M–3 Years',
    playType: 'Explore',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 949,
    originalPrice: 1249,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 97,
    inStock: true,
    stockCount: 30,
    isBestSeller: true,
    isEcoFriendly: true,
    description: 'Each solid rubberwood cube conceals a distinct sensory surprise: pleasant gentle rattles, ringing brass chimes, soothing rainfall beads, colored acrylic mirrors, and magnifying windows for multi-sensory toddler discovery.',
    developmentalBenefits: [
      'Heightens auditory discrimination and sensory pitch recognition',
      'Encourages early tactile stacking and gentle shaking grasp',
      'Visual light prisms create colorful patterns in sunlight'
    ],
    features: [
      '12 smooth rounded beech cubes with sealed acoustic chambers',
      'Acoustic variety: soft maraca, metallic chime, rainfall, ticking clicks',
      'Sized specifically for little palms to hold and shake effortlessly',
      'Includes wooden storage tray'
    ],
    specifications: {
      material: 'Sustainably farmed rubberwood, acrylic panels, steel beads, brass chimes',
      dimensions: 'Cube: 4.5 cm × 4.5 cm × 4.5 cm; Tray: 20 cm × 15 cm',
      pieceCount: 13,
      safetyStandards: 'BIS IS-9873, ASTM F963-17, CE Class 1',
      care: 'Wipe with soft damp cloth. Sealed ultrasound chamber ensures zero loose beads.',
      boxContents: '12 Acoustic cubes, 1 wooden display tray'
    },
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-15',
        author: 'Lavanya M.',
        verified: true,
        rating: 5,
        date: '11 Feb 2026',
        title: 'Gentle, pleasant sounds (not annoying loud noise!)',
        comment: 'As a parent, I love that these are natural acoustic sounds rather than blaring electronic beeps. My 8-month-old is transfixed by the rain block.',
        childAge: '8 months old'
      }
    ]
  },
  {
    id: 'toy-15',
    slug: 'architect-wooden-city-vehicles-set',
    name: 'Artisan City Emergency & Transit Vehicles (Set of 6)',
    tagline: 'Solid maple die-cut minimalist emergency & public transit vehicles with rubber grip wheels.',
    category: 'Wooden & Montessori',
    ageBracket: '3-5',
    ageDisplay: '2–6 Years',
    playType: 'Imagine',
    playroomCollection: 'Sensory & Wooden Studio',
    price: 1149,
    originalPrice: 1499,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 71,
    inStock: true,
    stockCount: 22,
    description: 'A heritage collection of 6 stylized urban service vehicles: Fire Engine with rotating ladder, Ambulance, City Bus, Police Cruiser, Tow Truck, and Postal Van. Features steel axles and quiet rubber tread wheels.',
    developmentalBenefits: [
      'Inspires narrative community helper roleplay and city planning',
      'Refines push-pull gross motor dynamics and speed tracking',
      'Fits standard wooden railway tracks and block roads'
    ],
    features: [
      '6 solid maple vehicles with ergonomic roof cutout grip handles',
      'Real rolling steel axles with silent non-marking rubber tire rings',
      'Non-toxic matte color block accents with natural grain show-through',
      'Compatible with all major wooden train tracks'
    ],
    specifications: {
      material: 'Solid Maple hardwood, steel axles, food-grade rubber O-rings',
      dimensions: 'Average vehicle: 11 cm × 6 cm × 7 cm',
      pieceCount: 6,
      safetyStandards: 'BIS IS-9873, EN-71 Part 1/2/3',
      care: 'Wipe with clean dry or damp cloth.',
      boxContents: '6 Wooden community vehicles, illustrated roadway playmat cloth'
    },
    images: [
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-16',
        author: 'Sanjay G.',
        verified: true,
        rating: 5,
        date: '29 Jan 2026',
        title: 'Very solid, survives endless crashes',
        comment: 'These have taken numerous drops down the stairs without a single chip. The wheels roll super smoothly and silently on tiles.',
        childAge: '3 years old'
      }
    ]
  },
  {
    id: 'toy-16',
    slug: 'origami-kinetic-paper-sculpture-automata',
    name: 'Mechanical Automata Flying Bird Kinetic Paper Kit',
    tagline: 'Hand-cranked mechanical automaton model with flapping wings and gear linkage.',
    category: 'Arts & Crafts',
    ageBracket: '12+',
    ageDisplay: '10–99 Years',
    playType: 'Create',
    playroomCollection: 'The Creative Corner',
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 48,
    inStock: true,
    stockCount: 17,
    isNewArrival: true,
    description: 'Where paper engineering meets clockwork kinetics. Construct a mesmerizing mechanical Kingfisher with articulated wings that flap gracefully when the hand crank is turned. Precision laser-cut high-grammage cardstock snaps together without glue or scissors.',
    developmentalBenefits: [
      'Teaches mechanical linkages, camshafts, and kinetic motion transfer',
      'Demands deep focus, patience, and 3D folding accuracy',
      'Results in a stunning sculptural desk automaton to display proudly'
    ],
    features: [
      'Pre-cut laser scored heavyweight recycled cardstock sheets',
      'Smooth wooden drive crank and brass linkage pins',
      'Zero glue or cutting required: precision interlocking tab assembly',
      'Fascinating open-mechanism view of internal cam movement'
    ],
    specifications: {
      material: '350gsm FSC Recycled Paperboard, brass pins, wooden crank handle',
      dimensions: 'Assembled: 24 cm × 22 cm × 28 cm',
      pieceCount: 68,
      safetyStandards: 'BIS IS-9873 compliant, CE Certified',
      care: 'Keep in dry room environment away from moisture.',
      boxContents: '6 laser-cut card sheets, brass hardware pack, step-by-step pictorial manual'
    },
    images: [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80'
    ],
    reviews: [
      {
        id: 'rev-17',
        author: 'Rashmi A.',
        verified: true,
        rating: 5,
        date: '03 Feb 2026',
        title: 'Captivating engineering project',
        comment: 'Built this with my 12-year-old daughter. The wing flapping motion is astonishingly smooth.',
        childAge: '12 years old'
      }
    ]
  }
];
