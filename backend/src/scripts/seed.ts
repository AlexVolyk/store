import { hashPassword } from '../utils/password.utils.ts';
import { slugify } from '../utils/slug.utils.ts';
import { clearCachePattern } from '../utils/cache.utils.ts';
import {
    CartModel,
    CategoryModel,
    OrderModel,
    ProductModel,
    ReviewModel,
    UserModel,
    WishlistModel,
} from '../models/index.ts';

export const seedDatabase = async () => {
    console.log('🌱 Starting full database seeding (60 Products, 6 Users, 6 Categories, Orders & Reviews)...');

    // 1. Clear all existing collections
    await Promise.all([
        UserModel.deleteMany({}),
        CategoryModel.deleteMany({}),
        ProductModel.deleteMany({}),
        ReviewModel.deleteMany({}),
        OrderModel.deleteMany({}),
        CartModel.deleteMany({}),
        WishlistModel.deleteMany({}),
    ]);
    console.log('🧹 Cleaned existing database collections');

    // 2. Seed 6 Users (1 Admin + 5 Diverse Customers)
    const passwordHash = hashPassword('User123!');
    const adminPasswordHash = hashPassword('Admin123!');

    const admin = await UserModel.create({
        firstName: 'Admin',
        lastName: 'Forma',
        email: 'admin@forma.store',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        bio: 'Head of Curation at Forma Atelier.',
        shippingAddress: {
            street: '100 Design District Blvd',
            city: 'San Francisco',
            postalCode: '94103',
            country: 'United States',
        },
    });

    const alex = await UserModel.create({
        firstName: 'Alex',
        lastName: 'Volyk',
        email: 'alex@forma.store',
        password: passwordHash,
        role: 'user',
        phone: '+1 (555) 012-3456',
        bio: 'Industrial designer and mechanical watch collector.',
        shippingAddress: {
            street: '742 Evergreen Terrace',
            city: 'San Francisco',
            postalCode: '94103',
            country: 'United States',
        },
    });

    const sarah = await UserModel.create({
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@forma.store',
        password: passwordHash,
        role: 'user',
        phone: '+1 (212) 555-8921',
        bio: 'Architectural photographer based in Soho.',
        shippingAddress: {
            street: '450 Broome Street, Apt 4B',
            city: 'New York',
            postalCode: '10013',
            country: 'United States',
        },
    });

    const marcus = await UserModel.create({
        firstName: 'Marcus',
        lastName: 'Webb',
        email: 'marcus.webb@forma.store',
        password: passwordHash,
        role: 'user',
        phone: '+44 20 7946 0912',
        bio: 'Audio engineer and acoustic specialist.',
        shippingAddress: {
            street: '18 Redchurch Street',
            city: 'London',
            postalCode: 'E2 7DD',
            country: 'United Kingdom',
        },
    });

    const elena = await UserModel.create({
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena.rostova@forma.store',
        password: passwordHash,
        role: 'user',
        phone: '+49 30 901820',
        bio: 'Interior architect and minimalist curator in Mitte.',
        shippingAddress: {
            street: 'Auguststraße 24',
            city: 'Berlin',
            postalCode: '10117',
            country: 'Germany',
        },
    });

    const kenji = await UserModel.create({
        firstName: 'Kenji',
        lastName: 'Sato',
        email: 'kenji.sato@forma.store',
        password: passwordHash,
        role: 'user',
        phone: '+81 3 5555 0143',
        bio: 'Industrial hardware craftsman and typography enthusiast.',
        shippingAddress: {
            street: '5-7-2 Minami-Aoyama',
            city: 'Tokyo',
            postalCode: '107-0062',
            country: 'Japan',
        },
    });

    const users = [admin, alex, sarah, marcus, elena, kenji];
    console.log(`👥 Created ${users.length} users (1 Admin + 5 Global Customers)`);

    // 3. Seed 6 Categories
    const categoriesData = [
        {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Curated leather goods, desk artifacts, and personal carry objects.',
        },
        {
            name: 'Cameras',
            slug: 'cameras',
            description: 'Vintage rangefinders, mechanical 35mm cameras, and prime portrait lenses.',
        },
        {
            name: 'Audio',
            slug: 'audio',
            description: 'Studio reference headphones, wireless acoustic devices, and precision DACs.',
        },
        {
            name: 'Wearables',
            slug: 'wearables',
            description: 'Precision mechanical timepieces, field watches, and minimalist wrist instruments.',
        },
        {
            name: 'Computers',
            slug: 'computers',
            description: 'Machined aluminum productivity hardware, mechanical keyboards, and studio displays.',
        },
        {
            name: 'Living',
            slug: 'living',
            description: 'Sculptural lighting, architectural furniture, and minimalist interior objects.',
        },
    ];

    const categories = await CategoryModel.insertMany(categoriesData);
    const catMap = new Map(categories.map((c) => [c.name, c._id]));
    console.log(`🏷️ Created 6 categories`);

    // 4. Seed 60 Curated Luxury Products (10 per Category)
    const rawProducts = [
        // ══════════════════════════════════════════════
        // ── 1. ACCESSORIES (10 Products) ──────────────
        // ══════════════════════════════════════════════
        {
            name: 'Analog Timepiece No. 7',
            brand: 'Leica',
            categoryName: 'Accessories',
            price: 349,
            discountPrice: 245,
            stock: 18,
            badge: 'Sale' as const,
            images: [
                'https://images.unsplash.com/photo-1630558673281-46d2d315e235?w=900&h=1050&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&h=1050&fit=crop&auto=format',
            ],
            description: 'A refined analog watch crafted from a single block of 316L stainless steel with hand-brushed satin texture and sapphire crystal.',
        },
        {
            name: 'Ceramic Desk Object',
            brand: 'Muuto',
            categoryName: 'Accessories',
            price: 89,
            stock: 30,
            badge: 'New Arrival' as const,
            images: ['https://images.unsplash.com/photo-1617214922084-5db8d3c3df5a?w=900&h=1050&fit=crop&auto=format'],
            description: 'Sculptural stoneware vessel designed to hold pens, brushes, or standalone aesthetic artifacts on your workspace.',
        },
        {
            name: 'Sand Glass Diffuser',
            brand: 'Aesop',
            categoryName: 'Accessories',
            price: 64,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1677726050564-6abb77837338?w=900&h=1050&fit=crop&auto=format'],
            description: 'Subtle hour-glass shaped room diffuser that gently releases botanical cedarwood and frankincense aroma.',
        },
        {
            name: 'Vintage Desk Clock',
            brand: 'Leica',
            categoryName: 'Accessories',
            price: 178,
            stock: 8,
            badge: 'Limited Edition' as const,
            images: ['https://images.unsplash.com/photo-1689525970033-948720b0ccf8?w=900&h=1050&fit=crop&auto=format'],
            description: 'Solid brass desktop mechanical clock inspired by 1960s German automotive dashboard instruments.',
        },
        {
            name: 'Coastal Edition Lotion',
            brand: 'Aesop',
            categoryName: 'Accessories',
            price: 42,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1677725283527-fcf4d2973c07?w=900&h=1050&fit=crop&auto=format'],
            description: 'Nourishing botanical formulation with notes of bergamot, sea fennel, and smoked vetiver in an amber glass bottle.',
        },
        {
            name: 'Full Grain Leather Folio',
            brand: 'Hardgraft',
            categoryName: 'Accessories',
            price: 260,
            discountPrice: 220,
            stock: 14,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1050&fit=crop&auto=format'],
            description: 'Vegetable-tanned Tuscan leather portfolio designed to hold a 14-inch laptop, notebook, and drawing utensils.',
        },
        {
            name: 'Machined Brass Rollerball Pen',
            brand: 'Ystudio',
            categoryName: 'Accessories',
            price: 110,
            stock: 28,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=900&h=1050&fit=crop&auto=format'],
            description: 'Heavy hexagonal brass body balanced for effortless ink flow and developing a rich natural patina over time.',
        },
        {
            name: 'Minimalist Card Holder',
            brand: 'Bellroy',
            categoryName: 'Accessories',
            price: 65,
            stock: 45,
            images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1050&fit=crop&auto=format'],
            description: 'Slim bifold pocket sleeve holding 8 cards and folded bills with RFID blocking lining.',
        },
        {
            name: 'Matte Black Key Organiser',
            brand: 'Orbitkey',
            categoryName: 'Accessories',
            price: 48,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?w=900&h=1050&fit=crop&auto=format'],
            description: 'Cushioned leather band that holds up to 7 keys in a silent stack, eliminating pocket jingle.',
        },
        {
            name: 'Sculpted Incense Burner',
            brand: 'Muuto',
            categoryName: 'Accessories',
            price: 95,
            stock: 19,
            badge: 'Trending' as const,
            images: ['https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&h=1050&fit=crop&auto=format'],
            description: 'Cast iron minimalist vessel catching falling ash with an integrated lid to store Japanese incense sticks.',
        },

        // ══════════════════════════════════════════════
        // ── 2. CAMERAS (10 Products) ──────────────────
        // ══════════════════════════════════════════════
        {
            name: 'Compact Film Camera',
            brand: 'Canon',
            categoryName: 'Cameras',
            price: 480,
            discountPrice: 389,
            stock: 12,
            badge: 'New Arrival' as const,
            images: ['https://images.unsplash.com/photo-1704942764294-25761b3932c4?w=900&h=1050&fit=crop&auto=format'],
            description: 'Full manual 35mm rangefinder with tactile brass dials, mechanical shutter advance, and f/2.0 prime optics.',
        },
        {
            name: 'Portrait Lens 85mm',
            brand: 'Canon',
            categoryName: 'Cameras',
            price: 699,
            stock: 6,
            badge: 'Featured' as const,
            images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=900&h=1050&fit=crop&auto=format'],
            description: 'Ultra-fast f/1.4 prime portrait lens with circular 9-blade aperture creating creamy bokeh and edge-to-edge sharpness.',
        },
        {
            name: 'Medium Format Rangefinder',
            brand: 'Hasselblad',
            categoryName: 'Cameras',
            price: 1450,
            discountPrice: 1290,
            stock: 5,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=1050&fit=crop&auto=format'],
            description: 'Legendary medium format camera with leaf shutter lenses for unmatched dynamic range and film grain fidelity.',
        },
        {
            name: 'Monochrome 35mm Body',
            brand: 'Leica',
            categoryName: 'Cameras',
            price: 2200,
            stock: 4,
            badge: 'Limited Edition' as const,
            images: ['https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=900&h=1050&fit=crop&auto=format'],
            description: 'Dedicated black-and-white optical sensor body with zero color filter array for extreme tonal resolution.',
        },
        {
            name: 'Classic Vintage SLR 50mm',
            brand: 'Nikon',
            categoryName: 'Cameras',
            price: 520,
            stock: 15,
            badge: 'Trending' as const,
            images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=1050&fit=crop&auto=format'],
            description: 'Mechanical metal SLR body with titanium shutter curtains and pancake 50mm f/1.8 manual prime lens.',
        },
        {
            name: 'Street Photography Compact',
            brand: 'Fujifilm',
            categoryName: 'Cameras',
            price: 890,
            discountPrice: 790,
            stock: 9,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=900&h=1050&fit=crop&auto=format'],
            description: 'Fixed 23mm f/2.0 leaf-shutter camera with hybrid optical viewfinder and legendary film simulations.',
        },
        {
            name: 'Wide Angle Cine Lens 24mm',
            brand: 'Sigma',
            categoryName: 'Cameras',
            price: 849,
            stock: 8,
            images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&h=1050&fit=crop&auto=format'],
            description: 'All-metal geared cine prime with clickless aperture ring and zero optical distortion for architectural video.',
        },
        {
            name: 'Carbon Fiber Studio Tripod',
            brand: 'Gitzo',
            categoryName: 'Cameras',
            price: 490,
            stock: 11,
            images: ['https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=900&h=1050&fit=crop&auto=format'],
            description: '6X carbon eXact tubing with ultra-smooth magnesium center ball head supporting up to 15kg.',
        },
        {
            name: 'Waterproof Camera Sling 6L',
            brand: 'Peak Design',
            categoryName: 'Cameras',
            price: 135,
            stock: 30,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=900&h=1050&fit=crop&auto=format'],
            description: 'Weatherproof 400D recycled nylon shell with Origami flex-fold dividers for one camera and two lenses.',
        },
        {
            name: 'Light Meter Digital Exposure',
            brand: 'Sekonic',
            categoryName: 'Cameras',
            price: 290,
            stock: 14,
            images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=1050&fit=crop&auto=format'],
            description: 'Precision ambient and flash light meter with rotating lumisphere and touch-screen LCD display.',
        },

        // ══════════════════════════════════════════════
        // ── 3. AUDIO (10 Products) ────────────────────
        // ══════════════════════════════════════════════
        {
            name: 'Studio Monitor Headphones',
            brand: 'Sony',
            categoryName: 'Audio',
            price: 299,
            stock: 25,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1655657874630-2da5679ef515?w=900&h=1050&fit=crop&auto=format'],
            description: 'Closed-back dynamic monitoring headphones engineered for transparent audio mixing and accurate low-end response.',
        },
        {
            name: 'Wireless Earbuds Pro',
            brand: 'Apple',
            categoryName: 'Audio',
            price: 229,
            discountPrice: 179,
            stock: 40,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1737805173358-e88d2e05c49e?w=900&h=1050&fit=crop&auto=format'],
            description: 'Active noise cancelling wireless acoustic earbuds with custom high-excursion driver and spatial audio tracking.',
        },
        {
            name: 'Noise-Cancel Speakers',
            brand: 'Sony',
            categoryName: 'Audio',
            price: 549,
            stock: 10,
            badge: 'Trending' as const,
            images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&h=1050&fit=crop&auto=format'],
            description: 'High-resolution room acoustics stereo system with dual passive radiators and balanced armature tweeters.',
        },
        {
            name: 'Portable Synthesizer OP-1',
            brand: 'Teenage Engineering',
            categoryName: 'Audio',
            price: 999,
            stock: 9,
            badge: 'Featured' as const,
            images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&h=1050&fit=crop&auto=format'],
            description: 'All-in-one portable synthesizer, sampler, and 4-track tape recorder encased in CNC milled aluminum.',
        },
        {
            name: 'Audiophile Open-Back Reference',
            brand: 'Sennheiser',
            categoryName: 'Audio',
            price: 499,
            discountPrice: 429,
            stock: 16,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=1050&fit=crop&auto=format'],
            description: 'Acoustically transparent open-back headphones delivering expansive three-dimensional sound staging.',
        },
        {
            name: 'Machined Aluminum Desktop DAC',
            brand: 'Chord',
            categoryName: 'Audio',
            price: 590,
            stock: 7,
            badge: 'Limited Edition' as const,
            images: ['https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=900&h=1050&fit=crop&auto=format'],
            description: 'Custom FPGA digital-to-analog converter with illuminated polychromatic glass spheres and 768kHz upsampling.',
        },
        {
            name: 'Modular Wireless Speaker',
            brand: 'Bang & Olufsen',
            categoryName: 'Audio',
            price: 799,
            stock: 12,
            badge: 'New Arrival' as const,
            images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=900&h=1050&fit=crop&auto=format'],
            description: 'Sculptural book-shaped acoustic speaker wrapped in tactile Kvadrat wool fabric and pearl-blasted aluminum.',
        },
        {
            name: 'Analog Belt-Drive Turntable',
            brand: 'Pro-Ject',
            categoryName: 'Audio',
            price: 450,
            stock: 11,
            images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=900&h=1050&fit=crop&auto=format'],
            description: 'Heavy MDF plinth turntable with single-piece carbon fiber tonearm and pre-fitted Ortofon 2M Red cartridge.',
        },
        {
            name: 'Studio Large Diaphragm Mic',
            brand: 'Shure',
            categoryName: 'Audio',
            price: 399,
            stock: 22,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&h=1050&fit=crop&auto=format'],
            description: 'Legendary dynamic cardioid vocal microphone with air suspension shock isolation and electromagnetic shielding.',
        },
        {
            name: 'Pocket FM Radio & Synth',
            brand: 'Teenage Engineering',
            categoryName: 'Audio',
            price: 199,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&h=1050&fit=crop&auto=format'],
            description: 'Minimalist magic radio with internal antenna, recording memory, and Bluetooth wireless audio transmission.',
        },

        // ══════════════════════════════════════════════
        // ── 4. WEARABLES (10 Products) ────────────────
        // ══════════════════════════════════════════════
        {
            name: 'Precision Wrist Tracker',
            brand: 'Apple',
            categoryName: 'Wearables',
            price: 399,
            discountPrice: 299,
            stock: 15,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&h=1050&fit=crop&auto=format'],
            description: 'Aerospace-grade titanium chassis with continuous heart-rate variability, sleep architecture, and GPS tracking.',
        },
        {
            name: 'Atelier Chronograph 39',
            brand: 'Braun',
            categoryName: 'Wearables',
            price: 580,
            discountPrice: 490,
            stock: 11,
            badge: 'Featured' as const,
            images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1050&fit=crop&auto=format'],
            description: 'Bauhaus-inspired 39mm automatic chronograph with yellow seconds accent hand and Milanese mesh strap.',
        },
        {
            name: 'Minimalist Automatic Watch',
            brand: 'Nomos',
            categoryName: 'Wearables',
            price: 890,
            stock: 7,
            badge: 'Trending' as const,
            images: ['https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&h=1050&fit=crop&auto=format'],
            description: 'Ultra-thin manual-winding movement with tempered blue steel hands and galvanized white silver-plated dial.',
        },
        {
            name: 'Titanium Smart Ring',
            brand: 'Oura',
            categoryName: 'Wearables',
            price: 349,
            stock: 22,
            badge: 'New Arrival' as const,
            images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&h=1050&fit=crop&auto=format'],
            description: 'Seamless titanium ring packing dual infrared temperature sensors and pulse oximeter into a featherlight band.',
        },
        {
            name: 'Field Watch Mechanical 38',
            brand: 'Hamilton',
            categoryName: 'Wearables',
            price: 495,
            discountPrice: 425,
            stock: 19,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&h=1050&fit=crop&auto=format'],
            description: 'Military-heritage 38mm bead-blasted matte steel case with H-50 caliber movement and 80-hour power reserve.',
        },
        {
            name: 'Monochrome Solar Timepiece',
            brand: 'Seiko',
            categoryName: 'Wearables',
            price: 280,
            stock: 24,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=1050&fit=crop&auto=format'],
            description: 'Solar-powered quartz movement absorbing light from any angle with sapphire crystal and perforated silicone strap.',
        },
        {
            name: 'Ceramic Diver Watch 300m',
            brand: 'Tudor',
            categoryName: 'Wearables',
            price: 1850,
            stock: 4,
            badge: 'Limited Edition' as const,
            images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1050&fit=crop&auto=format'],
            description: 'Matte black monobloc ceramic case with unidirectional rotating bezel and COSC-certified chronometer movement.',
        },
        {
            name: 'Handcrafted Horween Leather Strap',
            brand: 'Forma Atelier',
            categoryName: 'Wearables',
            price: 85,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&h=1050&fit=crop&auto=format'],
            description: '20mm tapered watch strap handmade in Chicago from full-grain Chromexcel pull-up leather.',
        },
        {
            name: 'Minimalist Steel Mesh Band',
            brand: 'Skagen',
            categoryName: 'Wearables',
            price: 65,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1510017803434-a899398421b3?w=900&h=1050&fit=crop&auto=format'],
            description: 'Ultra-flexible woven stainless steel Milanese loop with magnetic infinite adjustment clasp.',
        },
        {
            name: 'Mechanical Pocket Watch Brass',
            brand: 'Tissot',
            categoryName: 'Wearables',
            price: 360,
            stock: 8,
            images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&h=1050&fit=crop&auto=format'],
            description: 'Traditional open-face pocket watch with Roman numerals and mineral crystal display back showing the balance wheel.',
        },

        // ══════════════════════════════════════════════
        // ── 5. COMPUTERS (10 Products) ────────────────
        // ══════════════════════════════════════════════
        {
            name: 'Slim Laptop Pro 14"',
            brand: 'Apple',
            categoryName: 'Computers',
            price: 1299,
            discountPrice: 999,
            stock: 14,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=1050&fit=crop&auto=format'],
            description: 'Unibody aluminum workspace machine with Liquid Retina XDR 120Hz display and 22-hour battery life.',
        },
        {
            name: 'Machined Mechanical Keyboard',
            brand: 'Keychron',
            categoryName: 'Computers',
            price: 195,
            stock: 35,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&h=1050&fit=crop&auto=format'],
            description: '75% layout custom mechanical keyboard with hot-swappable tactile switches and acoustic silicone dampening.',
        },
        {
            name: '4K Studio Reference Monitor',
            brand: 'LG',
            categoryName: 'Computers',
            price: 749,
            discountPrice: 679,
            stock: 8,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=1050&fit=crop&auto=format'],
            description: '32-inch 4K IPS panel calibrated to 99% DCI-P3 color gamut with single-cable 90W USB-C power delivery.',
        },
        {
            name: 'Precision Aluminum Trackpad',
            brand: 'Apple',
            categoryName: 'Computers',
            price: 149,
            stock: 28,
            images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=1050&fit=crop&auto=format'],
            description: 'Edge-to-edge glass multi-touch surface with haptic Force Touch sensors and rechargeable lithium battery.',
        },
        {
            name: 'Ergonomic Vertical Mouse',
            brand: 'Logitech',
            categoryName: 'Computers',
            price: 99,
            stock: 32,
            badge: 'Trending' as const,
            images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=900&h=1050&fit=crop&auto=format'],
            description: '57-degree natural handshake posture design reducing muscular strain by 10% during prolonged computer work.',
        },
        {
            name: 'Aluminum Thunderbolt 4 Dock',
            brand: 'CalDigit',
            categoryName: 'Computers',
            price: 350,
            discountPrice: 310,
            stock: 12,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=900&h=1050&fit=crop&auto=format'],
            description: '18 ports of connectivity with 98W host charging, dual 6K display support, and UHS-II SD card slot.',
        },
        {
            name: 'Desk Mat Merino Wool Felt',
            brand: 'Grovemade',
            categoryName: 'Computers',
            price: 80,
            stock: 45,
            badge: 'New Arrival' as const,
            images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=1050&fit=crop&auto=format'],
            description: 'Extra-large 38x16 inch natural German merino wool felt pad providing soft tactile cushion for desk peripherals.',
        },
        {
            name: 'Walnut Wood Monitor Stand',
            brand: 'Grovemade',
            categoryName: 'Computers',
            price: 140,
            stock: 18,
            badge: 'Featured' as const,
            images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&h=1050&fit=crop&auto=format'],
            description: 'Bent walnut plywood monitor riser with brushed aluminum shelf holding keyboard and notebooks underneath.',
        },
        {
            name: 'Studio Streaming Microphone',
            brand: 'Elgato',
            categoryName: 'Computers',
            price: 160,
            stock: 26,
            images: ['https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=900&h=1050&fit=crop&auto=format'],
            description: 'Tight cardioid pickup pattern condenser capsule with built-in Clipguard anti-distortion limiter technology.',
        },
        {
            name: '4K Ultra HD Magnetic Webcam',
            brand: 'Logitech',
            categoryName: 'Computers',
            price: 199,
            stock: 15,
            images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&h=1050&fit=crop&auto=format'],
            description: '4K HDR glass optics with dual noise-cancelling omnidirectional mics and magnetic display mounting base.',
        },

        // ══════════════════════════════════════════════
        // ── 6. LIVING (10 Products) ───────────────────
        // ══════════════════════════════════════════════
        {
            name: 'Cast Aluminum Table Lamp',
            brand: 'Flos',
            categoryName: 'Living',
            price: 320,
            stock: 16,
            badge: 'New Arrival' as const,
            images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&h=1050&fit=crop&auto=format'],
            description: 'Architectural desk lamp with warm 2700K diffused LED glow and step-less optical touch dimmer.',
        },
        {
            name: 'Ergonomic Task Chair',
            brand: 'Herman Miller',
            categoryName: 'Living',
            price: 1195,
            discountPrice: 995,
            stock: 6,
            badge: 'Best Seller' as const,
            images: ['https://images.unsplash.com/photo-1580481077195-c94f54d6eb75?w=900&h=1050&fit=crop&auto=format'],
            description: 'Pioneering ergonomic mesh seating designed with PostureFit SL sacral support and harmonic tilt.',
        },
        {
            name: 'Sculptural Walnut Stool',
            brand: 'Vitra',
            categoryName: 'Living',
            price: 450,
            stock: 10,
            badge: 'Featured' as const,
            images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=900&h=1050&fit=crop&auto=format'],
            description: 'Solid turned American walnut stool with concave profile, functioning equally as a seat or side table.',
        },
        {
            name: 'Minimalist Steel Bookend',
            brand: 'Muuto',
            categoryName: 'Living',
            price: 75,
            stock: 45,
            images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&h=1050&fit=crop&auto=format'],
            description: 'Heavy folded powder-coated sheet steel bookends with non-slip cork base pads.',
        },
        {
            name: 'Portable Cordless Lantern',
            brand: 'Menu',
            categoryName: 'Living',
            price: 180,
            discountPrice: 155,
            stock: 22,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&h=1050&fit=crop&auto=format'],
            description: 'Rechargeable Opal glass and brushed brass atmospheric light giving 10 hours of ambient warmth.',
        },
        {
            name: 'Molded Plywood Lounge Chair',
            brand: 'Eames',
            categoryName: 'Living',
            price: 895,
            stock: 5,
            badge: 'Limited Edition' as const,
            images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=1050&fit=crop&auto=format'],
            description: 'Historic organic molded ash plywood seat with curved backrest following the natural contours of the body.',
        },
        {
            name: 'Concrete Minimalist Planter',
            brand: 'Kinto',
            categoryName: 'Living',
            price: 60,
            stock: 35,
            badge: 'Trending' as const,
            images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&h=1050&fit=crop&auto=format'],
            description: 'Porous unglazed architectural concrete planter with drainage hole and detachable matching saucer.',
        },
        {
            name: 'Mouth-Blown Glass Carafe & Tumbler',
            brand: 'Iittala',
            categoryName: 'Living',
            price: 95,
            stock: 28,
            images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&h=1050&fit=crop&auto=format'],
            description: 'Lead-free Finnish crystal bedside water carafe with nested drinking glass serving as a hygienic dust stopper.',
        },
        {
            name: 'Cast Iron Kettle 1.2L',
            brand: 'Iwachu',
            categoryName: 'Living',
            price: 165,
            stock: 14,
            images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&h=1050&fit=crop&auto=format'],
            description: 'Traditional Japanese Nambu Tekki iron teapot with enameled interior and stainless steel tea infuser.',
        },
        {
            name: 'Linen Throw Blanket 140x200',
            brand: 'HAY',
            categoryName: 'Living',
            price: 130,
            discountPrice: 110,
            stock: 25,
            badge: 'Sale' as const,
            images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&h=1050&fit=crop&auto=format'],
            description: 'Pre-washed Belgian flax linen throw blanket with fringed edges in washed charcoal and natural oat tones.',
        },
    ];

    const productsToInsert = rawProducts.map((p) => {
        const categoryId = catMap.get(p.categoryName);
        if (!categoryId) {
            throw new Error(`Category "${p.categoryName}" not found in catMap`);
        }

        return {
            name: p.name,
            slug: slugify(p.name),
            brand: p.brand,
            category: categoryId,
            price: p.price,
            discountPrice: p.discountPrice,
            stock: p.stock,
            images: p.images,
            description: p.description,
            badge: p.badge,
            averageRating: 0,
            reviewCount: 0,
            isActive: true,
        };
    });

    const products = await ProductModel.insertMany(productsToInsert);
    const prodMap = new Map(products.map((p) => [p.name, p]));
    console.log(`📦 Created ${products.length} luxury products (10 per category across all 6 categories)`);

    // 5. Seed Realistic Client Orders Across Multiple Users
    const watchProd = prodMap.get('Analog Timepiece No. 7')!;
    const cameraProd = prodMap.get('Compact Film Camera')!;
    const headphonesProd = prodMap.get('Studio Monitor Headphones')!;
    const lampProd = prodMap.get('Cast Aluminum Table Lamp')!;
    const keyboardProd = prodMap.get('Machined Mechanical Keyboard')!;
    const chairProd = prodMap.get('Ergonomic Task Chair')!;
    const diffuserProd = prodMap.get('Sand Glass Diffuser')!;
    const earbudProd = prodMap.get('Wireless Earbuds Pro')!;

    // Order 1: Delivered Order for Alex (Enables Verified Reviews!)
    const order1 = await OrderModel.create({
        orderNumber: 'ORD-839201-492',
        trackingNumber: 'TRK-98210349281',
        user: alex._id,
        items: [
            {
                product: watchProd._id,
                name: watchProd.name,
                image: watchProd.images[0],
                price: watchProd.discountPrice || watchProd.price,
                quantity: 1,
            },
            {
                product: cameraProd._id,
                name: cameraProd.name,
                image: cameraProd.images[0],
                price: cameraProd.discountPrice || cameraProd.price,
                quantity: 1,
            },
        ],
        shippingAddress: {
            fullName: `${alex.firstName} ${alex.lastName}`,
            phone: alex.phone,
            addressLine: alex.shippingAddress.street,
            city: alex.shippingAddress.city,
            postalCode: alex.shippingAddress.postalCode,
            country: alex.shippingAddress.country,
        },
        notes: 'Please leave by the front door behind the planter box.',
        paymentMethod: 'Credit Card (Stripe)',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        itemsPrice: 634,
        shippingPrice: 0,
        taxPrice: 50.72,
        totalPrice: 684.72,
        paidAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    });

    // Order 2: Delivered Order for Sarah
    const order2 = await OrderModel.create({
        orderNumber: 'ORD-194820-103',
        trackingNumber: 'TRK-58190382910',
        user: sarah._id,
        items: [
            {
                product: lampProd._id,
                name: lampProd.name,
                image: lampProd.images[0],
                price: lampProd.price,
                quantity: 1,
            },
            {
                product: keyboardProd._id,
                name: keyboardProd.name,
                image: keyboardProd.images[0],
                price: keyboardProd.price,
                quantity: 1,
            },
        ],
        shippingAddress: {
            fullName: `${sarah.firstName} ${sarah.lastName}`,
            phone: sarah.phone,
            addressLine: sarah.shippingAddress.street,
            city: sarah.shippingAddress.city,
            postalCode: sarah.shippingAddress.postalCode,
            country: sarah.shippingAddress.country,
        },
        notes: '24/7 doorman building. Leave with front reception desk.',
        paymentMethod: 'Apple Pay',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        itemsPrice: 515,
        shippingPrice: 0,
        taxPrice: 41.2,
        totalPrice: 556.2,
        paidAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    // Order 3: Shipped Order for Marcus
    const order3 = await OrderModel.create({
        orderNumber: 'ORD-572019-847',
        trackingNumber: 'TRK-39182049102',
        user: marcus._id,
        items: [
            {
                product: headphonesProd._id,
                name: headphonesProd.name,
                image: headphonesProd.images[0],
                price: headphonesProd.price,
                quantity: 1,
            },
            {
                product: diffuserProd._id,
                name: diffuserProd.name,
                image: diffuserProd.images[0],
                price: diffuserProd.price,
                quantity: 2,
            },
        ],
        shippingAddress: {
            fullName: `${marcus.firstName} ${marcus.lastName}`,
            phone: marcus.phone,
            addressLine: marcus.shippingAddress.street,
            city: marcus.shippingAddress.city,
            postalCode: marcus.shippingAddress.postalCode,
            country: marcus.shippingAddress.country,
        },
        notes: 'Ring buzzer #12 on arrival.',
        paymentMethod: 'Credit Card (Visa)',
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        itemsPrice: 427,
        shippingPrice: 15,
        taxPrice: 34.16,
        totalPrice: 476.16,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Order 4: Processing Order for Elena
    const order4 = await OrderModel.create({
        orderNumber: 'ORD-682019-482',
        user: elena._id,
        items: [
            {
                product: chairProd._id,
                name: chairProd.name,
                image: chairProd.images[0],
                price: chairProd.discountPrice || chairProd.price,
                quantity: 1,
            },
        ],
        shippingAddress: {
            fullName: `${elena.firstName} ${elena.lastName}`,
            phone: elena.phone,
            addressLine: elena.shippingAddress.street,
            city: elena.shippingAddress.city,
            postalCode: elena.shippingAddress.postalCode,
            country: elena.shippingAddress.country,
        },
        notes: 'Please phone prior to delivery for freight gate access.',
        paymentMethod: 'Klarna / Sofort',
        paymentStatus: 'paid',
        orderStatus: 'processing',
        itemsPrice: 995,
        shippingPrice: 50,
        taxPrice: 198.55,
        totalPrice: 1243.55,
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Order 5: Pending Order for Kenji
    const order5 = await OrderModel.create({
        orderNumber: 'ORD-920148-319',
        user: kenji._id,
        items: [
            {
                product: earbudProd._id,
                name: earbudProd.name,
                image: earbudProd.images[0],
                price: earbudProd.discountPrice || earbudProd.price,
                quantity: 1,
            },
        ],
        shippingAddress: {
            fullName: `${kenji.firstName} ${kenji.lastName}`,
            phone: kenji.phone,
            addressLine: kenji.shippingAddress.street,
            city: kenji.shippingAddress.city,
            postalCode: kenji.shippingAddress.postalCode,
            country: kenji.shippingAddress.country,
        },
        paymentMethod: 'Credit Card (Mastercard)',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        itemsPrice: 179,
        shippingPrice: 20,
        taxPrice: 19.9,
        totalPrice: 218.9,
    });

    console.log(`🧾 Created 5 client orders across customers (${[order1, order2, order3, order4, order5].length} orders)`);

    // 6. Seed Reviews with DIVERSE RATINGS (5★, 4★, 3★, 2★, 1★)
    const reviewsData = [
        // 5★ - Verified Review on Watch (Alex - Order 1)
        {
            user: alex._id,
            product: watchProd._id,
            rating: 5,
            comment: 'Exceptional quality. The finishing on the 316L stainless steel case is immaculate. The weight distribution is perfectly balanced on the wrist and the strap broke in after a week.',
            isVerifiedPurchase: true,
        },
        // 4★ - Verified Review on Camera (Alex - Order 1)
        {
            user: alex._id,
            product: cameraProd._id,
            rating: 4,
            comment: 'The mechanical shutter sound is pure joy. Optics on the f/2.0 prime lens are tack-sharp. Only minor complaint is the viewfinder could be slightly brighter in low light.',
            isVerifiedPurchase: true,
        },
        // 5★ - Verified Review on Lamp (Sarah - Order 2)
        {
            user: sarah._id,
            product: lampProd._id,
            rating: 5,
            comment: 'The cast aluminum texture feels architectural and grounded. The 2700K warm glow transforms my evening desk environment completely.',
            isVerifiedPurchase: true,
        },
        // 4★ - Verified Review on Keyboard (Sarah - Order 2)
        {
            user: sarah._id,
            product: keyboardProd._id,
            rating: 4,
            comment: 'Deep, satisfying acoustic thock thanks to the silicone dampening. Keycaps have a wonderful matte texture that resists shine.',
            isVerifiedPurchase: true,
        },
        // 5★ - Unverified Review on Headphones (Marcus)
        {
            user: marcus._id,
            product: headphonesProd._id,
            rating: 5,
            comment: 'Flawlessly flat frequency curve. As an audio engineer, hearing uncoloured reference playback is essential and these deliver masterfully.',
            isVerifiedPurchase: false,
        },
        // 3★ - Constructive Critique on Chair (Elena)
        {
            user: elena._id,
            product: chairProd._id,
            rating: 3,
            comment: 'Superb ergonomic back support, but adjusting the armrest height took a bit of fiddling on the first day. Delivery packaging was pristine.',
            isVerifiedPurchase: false,
        },
        // 4★ - Review on Earbuds (Kenji)
        {
            user: kenji._id,
            product: earbudProd._id,
            rating: 4,
            comment: 'Noise cancellation is surprisingly powerful for this form factor. Spatial audio tracking feels natural during video conferences.',
            isVerifiedPurchase: false,
        },
        // 2★ - Critical Review on Diffuser (Elena)
        {
            user: elena._id,
            product: diffuserProd._id,
            rating: 2,
            comment: 'The cedarwood scent is divine, but the glass hour-glass chamber empties faster than advertised. Needs frequent refilling.',
            isVerifiedPurchase: false,
        },
    ];

    await ReviewModel.insertMany(reviewsData);
    console.log(`⭐ Created ${reviewsData.length} reviews with diverse ratings (5★, 4★, 3★, 2★)`);

    // 7. Recalculate averageRating and reviewCount for all reviewed products
    const allReviews = await ReviewModel.find();
    const productRatingMap = new Map<string, { total: number; count: number }>();

    for (const r of allReviews) {
        const pId = r.product.toString();
        const existing = productRatingMap.get(pId) || { total: 0, count: 0 };
        existing.total += r.rating;
        existing.count += 1;
        productRatingMap.set(pId, existing);
    }

    for (const [pId, stats] of productRatingMap.entries()) {
        const avg = Number((stats.total / stats.count).toFixed(1));
        await ProductModel.findByIdAndUpdate(pId, {
            averageRating: avg,
            reviewCount: stats.count,
        });
    }
    console.log(`📊 Recalculated average ratings across all products`);

    // 8. Wipe Redis Cache
    await clearCachePattern('cache:*');
    console.log(`⚡ Cleared Redis cache`);

    console.log(`\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`• Admin Account:    admin@forma.store   / Admin123!`);
    console.log(`• Customer Account: alex@forma.store    / User123!`);
    console.log(`• Customer Account: sarah.chen@forma.store / User123!`);
    console.log(`• Customer Account: marcus.webb@forma.store / User123!`);
    console.log(`• Customer Account: elena.rostova@forma.store / User123!`);
    console.log(`• Customer Account: kenji.sato@forma.store / User123!`);
    console.log(`• Categories:       6 active categories with slugs`);
    console.log(`• Products:         60 luxury design products (10 per category)`);
    console.log(`• Orders:           5 historical client orders`);
    console.log(`• Reviews:          8 diverse customer reviews (5★, 4★, 3★, 2★)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
};

// Auto-run if executed directly
if (process.argv[1]?.includes('seed')) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('❌ Seeding failed:', err);
            process.exit(1);
        });
}
