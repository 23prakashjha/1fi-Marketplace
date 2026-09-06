const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const stores = [
  { id: 1, name: 'Air India', category: 'online', tag: 'Travel', mark: 'AI', tone: 'red', detail: 'No-cost EMIs upto 18 months', url: 'https://www.airindia.com' },
  { id: 2, name: 'Apple Premium Reseller', category: 'online', tag: 'Tech', mark: 'AP', tone: 'ink', detail: 'No-cost EMIs upto 24 months', url: 'https://www.apple.com/in' },
  { id: 3, name: 'CaratLane', category: 'online', tag: 'Jewellery', mark: 'CL', tone: 'blue', detail: 'No-cost EMIs upto 6 months', url: 'https://www.caratlane.com' },
  { id: 4, name: 'Croma', category: 'online', tag: 'Electronics', mark: 'CR', tone: 'green', detail: 'No-cost EMIs upto 6 months', url: 'https://www.croma.com' },
  { id: 5, name: 'MakeMyTrip', category: 'online', tag: 'Travel', mark: 'MM', tone: 'orange', detail: 'No-cost EMIs upto 18 months', url: 'https://www.makemytrip.com' },
  { id: 6, name: 'Mokobara', category: 'online', tag: 'Lifestyle', mark: 'MO', tone: 'teal', detail: 'No-cost EMIs upto 18 months', url: 'https://www.mokobara.com' },
  { id: 7, name: 'Tanishq', category: 'online', tag: 'Jewellery', mark: 'T', tone: 'gold', detail: 'No-cost EMIs upto 9 months', url: 'https://www.tanishq.co.in' },
  { id: 8, name: 'Wakefit', category: 'online', tag: 'Home', mark: 'WF', tone: 'violet', detail: 'No-cost EMIs upto 12 months', url: 'https://www.wakefit.co' },
  { id: 9, name: 'Croma Phoenix Mall', category: 'nearby', tag: 'Electronics', mark: 'CR', tone: 'green', detail: '1.2 km away · No-cost EMIs upto 6 months', url: 'https://www.croma.com' },
  { id: 10, name: 'Tanishq Indiranagar', category: 'nearby', tag: 'Jewellery', mark: 'T', tone: 'gold', detail: '2.4 km away · No-cost EMIs upto 9 months', url: 'https://www.tanishq.co.in' },
  { id: 11, name: 'Wakefit Experience Centre', category: 'nearby', tag: 'Home', mark: 'WF', tone: 'violet', detail: '3.1 km away · No-cost EMIs upto 12 months', url: 'https://www.wakefit.co' },
  { id: 12, name: 'Apple Banjara Hills', category: 'nearby', tag: 'Tech', mark: 'AP', tone: 'ink', detail: '0.9 km away · No-cost EMIs upto 24 months', url: 'https://www.apple.com/in' }
];

const marketplace = [
  {
    id: 1,
    name: 'Apple iPhone 15',
    category: 'Smartphones',
    price: 69900,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=85',
    description: 'A16 Bionic performance, a 48MP main camera, and all-day battery life in a durable, colourful design.',
    badge: 'Popular',
    rating: 4.8,
    stock: 'In stock',
    details: ['6.1-inch Super Retina XDR display', '48MP main camera system', 'USB-C charging'],
    variants: ['128 GB · Blue', '256 GB · Black', '512 GB · Pink'],
    emiPlans: [
      { months: 6, amount: 11650, label: '6 months · No-cost EMI' },
      { months: 12, amount: 5825, label: '12 months · No-cost EMI' },
      { months: 18, amount: 3883, label: '18 months · No-cost EMI' }
    ]
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 29990,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=85',
    description: 'Industry-leading noise cancellation with rich, detailed sound and a lightweight, comfortable fit.',
    badge: 'Best seller',
    rating: 4.7,
    stock: 'In stock',
    details: ['Active noise cancellation', 'Up to 30 hours battery life', 'Multipoint Bluetooth connection'],
    variants: ['Black', 'Silver'],
    emiPlans: [
      { months: 3, amount: 9997, label: '3 months · No-cost EMI' },
      { months: 6, amount: 4998, label: '6 months · No-cost EMI' },
      { months: 12, amount: 2499, label: '12 months · No-cost EMI' }
    ]
  },
  {
    id: 3,
    name: 'Wakefit ErgoTech Chair',
    category: 'Home office',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=85',
    description: 'A supportive ergonomic chair with adjustable lumbar support, armrests, and breathable mesh.',
    badge: 'Work from home',
    rating: 4.5,
    stock: 'Only 4 left',
    details: ['Adjustable lumbar support', 'Breathable mesh back', '3-year warranty'],
    variants: ['Charcoal', 'Stone Grey'],
    emiPlans: [
      { months: 3, amount: 5333, label: '3 months · No-cost EMI' },
      { months: 6, amount: 2667, label: '6 months · No-cost EMI' },
      { months: 12, amount: 1333, label: '12 months · No-cost EMI' }
    ]
  },
  {
    id: 4,
    name: 'Samsung Galaxy Tab S9 FE',
    category: 'Tablets',
    price: 32999,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=85',
    description: 'A versatile tablet for streaming, sketching, and getting more done with the included S Pen.',
    badge: 'New',
    rating: 4.6,
    stock: 'In stock',
    details: ['10.9-inch immersive display', 'S Pen included', 'IP68 water and dust resistance'],
    variants: ['128 GB · Grey', '256 GB · Mint'],
    emiPlans: [
      { months: 6, amount: 5500, label: '6 months · No-cost EMI' },
      { months: 12, amount: 2750, label: '12 months · No-cost EMI' },
      { months: 18, amount: 1833, label: '18 months · No-cost EMI' }
    ]
  },
  {
    id: 5,
    name: 'Nike Air Max Pulse',
    category: 'Fashion',
    price: 11995,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85',
    description: 'A cushioned everyday sneaker with a breathable upper and bold street-ready styling.',
    badge: 'Trending',
    rating: 4.4,
    stock: 'In stock',
    details: ['Air cushioning in the heel', 'Breathable textile upper', 'Rubber outsole for traction'],
    variants: ['UK 7 · Red/Black', 'UK 8 · Red/Black', 'UK 9 · Red/Black'],
    emiPlans: [
      { months: 3, amount: 3998, label: '3 months · No-cost EMI' },
      { months: 6, amount: 1999, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 6,
    name: 'Dyson V12 Detect Slim',
    category: 'Home',
    price: 54900,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=85',
    description: 'A lightweight cordless vacuum with laser dust detection and powerful whole-home cleaning.',
    badge: '1Fi pick',
    rating: 4.6,
    stock: 'In stock',
    details: ['Laser reveals microscopic dust', 'Up to 60 minutes runtime', 'Six cleaning attachments'],
    variants: ['Gold/Red'],
    emiPlans: [
      { months: 6, amount: 9150, label: '6 months · No-cost EMI' },
      { months: 12, amount: 4575, label: '12 months · No-cost EMI' },
      { months: 18, amount: 3050, label: '18 months · No-cost EMI' }
    ]
  },
  {
    id: 7,
    name: 'Fossil Gen 6 Smartwatch',
    category: 'Wearables',
    price: 18995,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',
    description: 'A classic stainless-steel smartwatch with health tracking, notifications, and fast charging.',
    badge: 'Smart living',
    rating: 4.3,
    stock: 'In stock',
    details: ['Heart rate and SpO2 tracking', 'Built-in GPS', 'Wear OS by Google'],
    variants: ['Black Stainless Steel', 'Smoke Stainless Steel'],
    emiPlans: [
      { months: 3, amount: 6332, label: '3 months · No-cost EMI' },
      { months: 6, amount: 3166, label: '6 months · No-cost EMI' },
      { months: 12, amount: 1583, label: '12 months · No-cost EMI' }
    ]
  },
  {
    id: 8,
    name: 'Mokobara The Cabin',
    category: 'Travel',
    price: 12990,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=85',
    description: 'A hard-shell cabin suitcase designed for smooth airport days, with thoughtful organisation inside.',
    badge: 'Travel ready',
    rating: 4.5,
    stock: 'In stock',
    details: ['360-degree spinner wheels', 'TSA-approved lock', 'Two-year warranty'],
    variants: ['Cabin · Sage', 'Cabin · Black', 'Cabin · Clay'],
    emiPlans: [
      { months: 3, amount: 4330, label: '3 months · No-cost EMI' },
      { months: 6, amount: 2165, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 9,
    name: 'MacBook Air M2',
    category: 'Laptops',
    price: 89990,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85',
    description: 'A thin, silent laptop with all-day battery life and the powerful Apple M2 chip.',
    badge: 'Work essential',
    rating: 4.8,
    stock: 'In stock',
    details: ['13.6-inch Liquid Retina display', 'Apple M2 chip', 'Up to 18 hours battery life'],
    variants: ['256 GB · Midnight', '512 GB · Starlight'],
    emiPlans: [
      { months: 6, amount: 14998, label: '6 months · No-cost EMI' },
      { months: 12, amount: 7499, label: '12 months · No-cost EMI' },
      { months: 18, amount: 4999, label: '18 months · No-cost EMI' }
    ]
  },
  {
    id: 10,
    name: 'Kindle Paperwhite',
    category: 'Books & tech',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=800&q=85',
    description: 'A glare-free, waterproof e-reader with a warm adjustable light for comfortable reading anywhere.',
    badge: 'Reader favourite',
    rating: 4.6,
    stock: 'In stock',
    details: ['6.8-inch glare-free display', '16 GB storage', 'Up to 10 weeks battery life'],
    variants: ['16 GB · Black', '16 GB · Denim'],
    emiPlans: [
      { months: 3, amount: 4999, label: '3 months · No-cost EMI' },
      { months: 6, amount: 2499, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 11,
    name: 'GoPro HERO12 Black',
    category: 'Cameras',
    price: 44990,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=85',
    description: 'Capture smooth 5.3K video and your biggest adventures with a rugged, waterproof action camera.',
    badge: 'Adventure ready',
    rating: 4.5,
    stock: 'In stock',
    details: ['5.3K60 video resolution', 'HyperSmooth 6.0 stabilisation', 'Waterproof to 10 metres'],
    variants: ['Creator kit', 'Camera only'],
    emiPlans: [
      { months: 6, amount: 7498, label: '6 months · No-cost EMI' },
      { months: 12, amount: 3749, label: '12 months · No-cost EMI' }
    ]
  },
  {
    id: 12,
    name: 'Bose SoundLink Flex',
    category: 'Audio',
    price: 14900,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85',
    description: 'A portable Bluetooth speaker with rich sound, waterproof design, and up to 12 hours of playtime.',
    badge: 'Weekend pick',
    rating: 4.4,
    stock: 'In stock',
    details: ['PositionIQ technology', 'IP67 waterproof rating', '12-hour battery life'],
    variants: ['Black', 'Stone Blue', 'Carmine Red'],
    emiPlans: [
      { months: 3, amount: 4967, label: '3 months · No-cost EMI' },
      { months: 6, amount: 2483, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 13,
    name: 'Philips Airfryer XL',
    category: 'Kitchen',
    price: 12995,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=85',
    description: 'Make crispy favourites with little to no oil using a spacious, easy-to-clean air fryer.',
    badge: 'Kitchen upgrade',
    rating: 4.3,
    stock: 'In stock',
    details: ['6.2 litre capacity', 'Rapid Air technology', 'Touchscreen presets'],
    variants: ['Black · 6.2 L', 'Black · 4.1 L'],
    emiPlans: [
      { months: 3, amount: 4332, label: '3 months · No-cost EMI' },
      { months: 6, amount: 2166, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 14,
    name: 'Canon EOS R50',
    category: 'Cameras',
    price: 67990,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85',
    description: 'A compact mirrorless camera for sharp photos, cinematic video, and confident creator workflows.',
    badge: 'Creator pick',
    rating: 4.7,
    stock: 'Only 3 left',
    details: ['24.2MP APS-C sensor', '4K video recording', 'Eye detection autofocus'],
    variants: ['Body only', '18-45 mm kit'],
    emiPlans: [
      { months: 6, amount: 11332, label: '6 months · No-cost EMI' },
      { months: 12, amount: 5666, label: '12 months · No-cost EMI' },
      { months: 18, amount: 3777, label: '18 months · No-cost EMI' }
    ]
  },
  {
    id: 15,
    name: 'Adidas Ultraboost Light',
    category: 'Fashion',
    price: 16999,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85',
    description: 'Responsive running shoes with lightweight cushioning for everyday miles and long walks.',
    badge: 'Active life',
    rating: 4.5,
    stock: 'In stock',
    details: ['Light BOOST cushioning', 'Breathable knit upper', 'Continental rubber outsole'],
    variants: ['UK 7 · Core Black', 'UK 8 · Core Black', 'UK 9 · Core Black'],
    emiPlans: [
      { months: 3, amount: 5666, label: '3 months · No-cost EMI' },
      { months: 6, amount: 2833, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 16,
    name: 'Levi’s 501 Original Jeans',
    category: 'Fashion',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85',
    description: 'The original straight-fit jeans with timeless styling and a comfortable everyday feel.',
    badge: 'Everyday classic',
    rating: 4.2,
    stock: 'In stock',
    details: ['Original straight fit', 'Button fly', 'Cotton denim construction'],
    variants: ['30 · Medium Wash', '32 · Medium Wash', '34 · Medium Wash'],
    emiPlans: [
      { months: 3, amount: 1666, label: '3 months · No-cost EMI' }
    ]
  },
  {
    id: 17,
    name: 'Nespresso Essenza Mini',
    category: 'Kitchen',
    price: 9990,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=85',
    description: 'A compact capsule coffee machine that delivers barista-style espresso in seconds.',
    badge: 'Coffee corner',
    rating: 4.4,
    stock: 'In stock',
    details: ['Two programmable cup sizes', '19-bar pressure pump', 'Compact countertop design'],
    variants: ['Black', 'White'],
    emiPlans: [
      { months: 3, amount: 3330, label: '3 months · No-cost EMI' },
      { months: 6, amount: 1665, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 18,
    name: 'IKEA Stockholm Floor Lamp',
    category: 'Home',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85',
    description: 'A warm, sculptural floor lamp that brings a soft evening glow to your living space.',
    badge: 'Home refresh',
    rating: 4.1,
    stock: 'In stock',
    details: ['Warm diffused light', 'Adjustable shade', 'Works with LED bulbs'],
    variants: ['Brass', 'Black'],
    emiPlans: [
      { months: 3, amount: 2666, label: '3 months · No-cost EMI' }
    ]
  },
  {
    id: 19,
    name: 'Mi Smart Air Purifier 4',
    category: 'Home',
    price: 13999,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85',
    description: 'Quiet, connected air purification for cleaner rooms and better sleep every night.',
    badge: 'Better air',
    rating: 4.3,
    stock: 'In stock',
    details: ['Covers up to 516 sq ft', '99.97% particle filtration', 'App and voice control'],
    variants: ['White'],
    emiPlans: [
      { months: 3, amount: 4666, label: '3 months · No-cost EMI' },
      { months: 6, amount: 2333, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 20,
    name: 'Garmin Forerunner 265',
    category: 'Wearables',
    price: 44990,
    image: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?auto=format&fit=crop&w=800&q=85',
    description: 'A bright AMOLED running watch with training insights, GPS, and recovery tracking.',
    badge: 'Run smarter',
    rating: 4.7,
    stock: 'In stock',
    details: ['AMOLED touchscreen', 'Advanced training metrics', 'Up to 15 days smartwatch battery'],
    variants: ['Black · 46 mm', 'White · 42 mm'],
    emiPlans: [
      { months: 6, amount: 7498, label: '6 months · No-cost EMI' },
      { months: 12, amount: 3749, label: '12 months · No-cost EMI' }
    ]
  },
  {
    id: 21,
    name: 'Samsonite Cabin Spinner',
    category: 'Travel',
    price: 18990,
    image: 'https://images.unsplash.com/photo-1553531384-397c80973a0b?auto=format&fit=crop&w=800&q=85',
    description: 'A lightweight cabin suitcase with smooth wheels, secure storage, and durable construction.',
    badge: 'Travel smart',
    rating: 4.4,
    stock: 'In stock',
    details: ['Cabin-compatible dimensions', 'TSA combination lock', 'Ten-year limited warranty'],
    variants: ['55 cm · Navy', '55 cm · Black'],
    emiPlans: [
      { months: 3, amount: 6330, label: '3 months · No-cost EMI' },
      { months: 6, amount: 3165, label: '6 months · No-cost EMI' }
    ]
  },
  {
    id: 22,
    name: 'Tanishq Minimal Gold Pendant',
    category: 'Jewellery',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85',
    description: 'A delicate everyday pendant with a refined finish, designed to layer or wear on its own.',
    badge: 'Made to gift',
    rating: 4.6,
    stock: 'Made to order',
    details: ['18K yellow gold', 'BIS hallmarked', 'Complimentary gift packaging'],
    variants: ['18K Gold · 1.8 g', '18K Gold · 2.4 g'],
    emiPlans: [
      { months: 6, amount: 4167, label: '6 months · No-cost EMI' },
      { months: 12, amount: 2083, label: '12 months · No-cost EMI' }
    ]
  }
];

const additionalMarketplaceSeeds = [
  { id: 23, name: 'OnePlus 12R', category: 'Smartphones', price: 39999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85', badge: 'Fast performer', rating: 4.5, stock: 'In stock', variants: ['128 GB · Cool Blue', '256 GB · Iron Gray'] },
  { id: 24, name: 'Google Pixel 8a', category: 'Smartphones', price: 52999, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85', badge: 'Camera favourite', rating: 4.6, stock: 'In stock', variants: ['128 GB · Bay', '256 GB · Obsidian'] },
  { id: 25, name: 'JBL Live 660NC', category: 'Audio', price: 8999, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85', badge: 'Daily audio', rating: 4.2, stock: 'In stock', variants: ['Black', 'Blue'] },
  { id: 26, name: 'Marshall Emberton II', category: 'Audio', price: 16999, image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=85', badge: 'Room filling', rating: 4.5, stock: 'In stock', variants: ['Black & Brass', 'Cream'] },
  { id: 27, name: 'Lenovo Yoga Slim 6', category: 'Laptops', price: 74990, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85', badge: 'Study ready', rating: 4.3, stock: 'In stock', variants: ['16 GB · Arctic Grey', '16 GB · Storm Grey'] },
  { id: 28, name: 'ASUS ROG Zephyrus G14', category: 'Laptops', price: 144990, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=85', badge: 'Gaming power', rating: 4.7, stock: 'Only 2 left', variants: ['16 GB · Eclipse Gray', '32 GB · Eclipse Gray'] },
  { id: 29, name: 'Apple iPad Air', category: 'Tablets', price: 59900, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=85', badge: 'Creative tool', rating: 4.7, stock: 'In stock', variants: ['128 GB · Blue', '256 GB · Purple'] },
  { id: 30, name: 'Microsoft Surface Go 4', category: 'Tablets', price: 57990, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=85', badge: 'Desk to travel', rating: 4.2, stock: 'In stock', variants: ['128 GB · Platinum', '256 GB · Platinum'] },
  { id: 31, name: 'DJI Osmo Pocket 3', category: 'Cameras', price: 54990, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85', badge: 'Pocket creator', rating: 4.6, stock: 'In stock', variants: ['Standard combo', 'Creator combo'] },
  { id: 32, name: 'Fujifilm Instax Mini 12', category: 'Cameras', price: 8999, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=85', badge: 'Make memories', rating: 4.4, stock: 'In stock', variants: ['Pastel Blue', 'Blossom Pink', 'Mint Green'] },
  { id: 33, name: 'Nike Pegasus 40', category: 'Fashion', price: 11995, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85', badge: 'Run daily', rating: 4.4, stock: 'In stock', variants: ['UK 7 · White', 'UK 8 · White', 'UK 9 · White'] },
  { id: 34, name: 'Puma Suede Classic', category: 'Fashion', price: 6999, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85', badge: 'Street classic', rating: 4.1, stock: 'In stock', variants: ['UK 7 · Black', 'UK 8 · Black', 'UK 9 · Black'] },
  { id: 35, name: 'Ray-Ban Wayfarer', category: 'Fashion', price: 12990, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85', badge: 'Iconic style', rating: 4.5, stock: 'In stock', variants: ['Black · 50 mm', 'Havana · 50 mm'] },
  { id: 36, name: 'Philips LatteGo Coffee Maker', category: 'Kitchen', price: 49999, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85', badge: 'Cafe at home', rating: 4.4, stock: 'In stock', variants: ['Black', 'Black/Chrome'] },
  { id: 37, name: 'KitchenAid Stand Mixer', category: 'Kitchen', price: 42990, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85', badge: 'Baking season', rating: 4.6, stock: 'In stock', variants: ['Empire Red', 'Contour Silver'] },
  { id: 38, name: 'Instant Pot Duo Plus', category: 'Kitchen', price: 11990, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=85', badge: 'Cook smarter', rating: 4.3, stock: 'In stock', variants: ['5.7 L', '8 L'] },
  { id: 39, name: 'Dyson Purifier Cool', category: 'Home', price: 39900, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85', badge: 'Fresh spaces', rating: 4.5, stock: 'In stock', variants: ['White/Silver', 'Black/Nickel'] },
  { id: 40, name: 'Philips Hue Starter Kit', category: 'Home', price: 9999, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85', badge: 'Set the mood', rating: 4.2, stock: 'In stock', variants: ['White ambience', 'Colour ambience'] },
  { id: 41, name: 'IKEA Bekant Work Desk', category: 'Home office', price: 22990, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=85', badge: 'Work better', rating: 4.2, stock: 'In stock', variants: ['White · 120 cm', 'Black · 160 cm'] },
  { id: 42, name: 'Herman Miller Sayl Chair', category: 'Home office', price: 69990, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=85', badge: 'Ergonomic pick', rating: 4.7, stock: 'Made to order', variants: ['Black', 'White'] },
  { id: 43, name: 'Apple Watch Series 9', category: 'Wearables', price: 41900, image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=800&q=85', badge: 'Stay connected', rating: 4.6, stock: 'In stock', variants: ['41 mm · Midnight', '45 mm · Starlight'] },
  { id: 44, name: 'Fitbit Charge 6', category: 'Wearables', price: 14999, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=85', badge: 'Health tracker', rating: 4.2, stock: 'In stock', variants: ['Black/Graphite', 'Champagne Gold'] },
  { id: 45, name: 'Bose QuietComfort Earbuds II', category: 'Audio', price: 22900, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=85', badge: 'Quiet moments', rating: 4.5, stock: 'In stock', variants: ['Black', 'White Smoke'] },
  { id: 46, name: 'Sennheiser Momentum 4', category: 'Audio', price: 29990, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=85', badge: 'Audiophile pick', rating: 4.6, stock: 'In stock', variants: ['Black', 'White'] },
  { id: 47, name: 'American Tourister Curio', category: 'Travel', price: 8999, image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=800&q=85', badge: 'Easy travel', rating: 4.1, stock: 'In stock', variants: ['55 cm · Navy', '55 cm · Red'] },
  { id: 48, name: 'Osprey Farpoint 40', category: 'Travel', price: 18990, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85', badge: 'Carry-on ready', rating: 4.5, stock: 'In stock', variants: ['Black', 'Volcanic Grey'] },
  { id: 49, name: 'Tanishq Gold Hoop Earrings', category: 'Jewellery', price: 28999, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85', badge: 'Everyday gold', rating: 4.5, stock: 'Made to order', variants: ['18K Gold · Small', '18K Gold · Medium'] },
  { id: 50, name: 'CaratLane Silver Bracelet', category: 'Jewellery', price: 7999, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85', badge: 'Gift favourite', rating: 4.3, stock: 'In stock', variants: ['Sterling Silver · S', 'Sterling Silver · M'] },
  { id: 51, name: 'LEGO Botanical Bouquet', category: 'Lifestyle', price: 5499, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=85', badge: 'Creative time', rating: 4.8, stock: 'In stock', variants: ['Standard set'],
  },
  { id: 52, name: 'Kindle Kids Edition', category: 'Books & tech', price: 12999, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85', badge: 'Young readers', rating: 4.4, stock: 'In stock', variants: ['Blue cover', 'Green cover'] }
];

const additionalMarketplaceProducts = additionalMarketplaceSeeds.map((product) => ({
  ...product,
  description: `${product.name} brings thoughtful design and dependable performance to your everyday routine.`,
  details: [
    `Curated ${product.category.toLowerCase()} essential`,
    'Designed for everyday use',
    '1Fi partner warranty included'
  ],
  emiPlans: [
    { months: 3, amount: Math.round(product.price / 3), label: '3 months · No-cost EMI' },
    { months: 6, amount: Math.round(product.price / 6), label: '6 months · No-cost EMI' },
    { months: 12, amount: Math.round(product.price / 12), label: '12 months · No-cost EMI' }
  ]
}));

marketplace.push(...additionalMarketplaceProducts);

const dues = [
  { id: 1, name: 'Croma', amount: 4800, dueDate: '12 Sep 2026', status: 'Upcoming', daysLeft: 6 },
  { id: 2, name: 'Wakefit', amount: 3200, dueDate: '17 Sep 2026', status: 'Due today', daysLeft: 1 },
  { id: 3, name: 'Tanishq', amount: 2250, dueDate: '23 Sep 2026', status: 'Upcoming', daysLeft: 11 }
];

const investmentLimit = {
  totalLimit: 245000,
  usedLimit: 163400,
  available: 81600,
  utilization: 67,
  pledgedFunds: 450000,
  minimumBuffer: 240000,
  monthlyIncome: 120000
};

const profile = {
  name: 'Aarav Sharma',
  email: 'aarav@1fi.in',
  city: 'Bengaluru',
  investments: '₹4.5L mutual fund pledged',
  creditProfile: 'Healthy · No late dues',
  plan: '1Fi Premium'
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '1Fi marketplace API is running' });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    title: '1Fi Marketplace',
    stats: [
      { label: 'Eligible limit', value: '₹81.6k', tone: 'purple' },
      { label: 'Monthly dues', value: '₹10.2k', tone: 'orange' },
      { label: 'Active partners', value: '12', tone: 'green' },
      { label: 'Healthy score', value: '94%', tone: 'blue' }
    ],
    stores,
    marketplace,
    dues,
    limit: investmentLimit,
    profile
  });
});

app.get('/api/stores', (req, res) => res.json(stores));
app.get('/api/marketplace', (req, res) => res.json(marketplace));
app.get('/api/dues', (req, res) => res.json(dues));
app.get('/api/limit', (req, res) => res.json(investmentLimit));
app.get('/api/profile', (req, res) => res.json(profile));

const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI || '';
  if (!mongoUri) {
    console.log('Mongo connection skipped: no MONGO_URI provided. Using in-memory demo data.');
    return;
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed. Falling back to demo data.', error.message);
  }
};

connectMongo();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
