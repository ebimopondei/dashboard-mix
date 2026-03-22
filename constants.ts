
import { ChartDataPoint, Investment, Collection, Cluster, ActivityItem, Notification, PaymentMethod, FinancialGoal, UserProfile, CollectionUpdate, MarketListing, TierLevel, ImpactMetric, TraderProfile, Loan, EsusuGroup, ViewType, AgentProfile, ManagedTrader, SavingsPlan, TaxProfile, TaxTransaction, TaxFiling, SpineProduct, SpineSale, SpineShop, SpineActivity, SpineOutlet, SpineUser, RealEstateProperty, StockBond, StartupPitch, RealEstateUnit } from "./types";

// --- BASE CONFIGS ---
export const PROFILE_IMAGE_URL = "https://picsum.photos/100/100";

// --- CHART DATA ---
export const CHART_DATA: ChartDataPoint[] = [
  { day: 'Mon', value: 80 }, { day: 'Tue', value: 120 }, { day: 'Wed', value: 90 },
  { day: 'Thu', value: 140 }, { day: 'Fri', value: 70 }, { day: 'Sat', value: 180 }, { day: 'Sun', value: 130 },
];

const MOCK_UNITS: RealEstateUnit[] = [
    { id: 'u1', name: 'Unit A1', price: 50000, isAvailable: true, sizeSqft: 250 },
    { id: 'u2', name: 'Unit A2', price: 50000, isAvailable: false, sizeSqft: 250 },
    { id: 'u3', name: 'Unit B1', price: 150000, isAvailable: true, sizeSqft: 600 },
];

// --- COLLECTIONS & CLUSTERS ---
export const COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    name: 'Computer Village Hub',
    category: 'Technology',
    location: 'Ikeja, Lagos',
    country: 'Nigeria',
    description: 'Wholesale import and distribution of smartphones, laptops, and accessories in the largest ICT hub.',
    maxReturn: 18.5,
    minInvestment: 5000,
    riskLevel: 'Medium',
    iconName: 'devices',
    totalInvestors: 342,
    securityType: 'Inventory Backed'
  },
  {
    id: 'c2',
    name: 'Alaba Electronics Syndicate',
    category: 'Electronics',
    location: 'Ojo, Lagos',
    country: 'Nigeria',
    description: 'Partnership with major electronics importers sourcing direct from Asian manufacturers.',
    maxReturn: 15.8,
    minInvestment: 2500,
    riskLevel: 'Low',
    iconName: 'tv',
    totalInvestors: 520,
    securityType: 'Trade Credit'
  },
  {
    id: 'c3',
    name: 'Nairobi Flower Export',
    category: 'Agriculture',
    location: 'Naivasha',
    country: 'Kenya',
    description: 'Export-grade floriculture supply chain funding for smallholder greenhouses serving European markets.',
    maxReturn: 22.4,
    minInvestment: 7500,
    riskLevel: 'Medium',
    iconName: 'local_florist',
    totalInvestors: 840,
    securityType: 'Export Receivables'
  },
  {
    id: 'c4',
    name: 'Accra Tech Restock',
    category: 'Technology',
    location: 'Circle, Accra',
    country: 'Ghana',
    description: 'Working capital for major gadget retailers in the bustling Circle market area of Accra.',
    maxReturn: 14.5,
    minInvestment: 3000,
    riskLevel: 'Low',
    iconName: 'laptop_mac',
    totalInvestors: 215,
    securityType: 'Inventory Lien'
  },
  {
    id: 'c5',
    name: 'Kigali Coffee Co-op',
    category: 'Agriculture',
    location: 'Gisenyi',
    country: 'Rwanda',
    description: 'Specialty coffee washing station operations and global export financing for rural cooperatives.',
    maxReturn: 19.8,
    minInvestment: 12000,
    riskLevel: 'Medium',
    iconName: 'coffee',
    totalInvestors: 156,
    securityType: 'Commodity Backed'
  },
  {
    id: 'c6',
    name: 'Cape Logistics Fleet',
    category: 'Industrial',
    location: 'Cape Town',
    country: 'South Africa',
    description: 'Last-mile logistics expansion for e-commerce delivery partners operating in the Western Cape.',
    maxReturn: 12.2,
    minInvestment: 50000,
    riskLevel: 'Low',
    iconName: 'local_shipping',
    totalInvestors: 92,
    securityType: 'Asset Lease'
  },
  {
    id: 'c7',
    name: 'Kumasi Timber Trade',
    category: 'Industrial',
    location: 'Kumasi',
    country: 'Ghana',
    description: 'Sustainable wood processing and furniture export procurement for regional West African trade.',
    maxReturn: 17.5,
    minInvestment: 10000,
    riskLevel: 'High',
    iconName: 'forest',
    totalInvestors: 64,
    securityType: 'Trade Finance'
  }
];

// Standard 3 Cycles for each collection
export const CLUSTERS: Cluster[] = [
  {
    id: 'c1-30',
    collectionId: 'c1',
    durationDays: 30,
    fixedReturn: 10.5,
    minInvestment: 5000,
    fundingProgress: 85,
    status: 'Filling Fast',
    description: "Short-term liquidity cycle for mobile accessory procurement.",
    startDate: 'Nov 1, 2023',
    maturityDate: 'Dec 1, 2023',
    payoutDate: 'Dec 3, 2023'
  },
  {
    id: 'c1-60',
    collectionId: 'c1',
    durationDays: 60,
    fixedReturn: 14.2,
    minInvestment: 10000,
    fundingProgress: 42,
    status: 'Open',
    description: "Medium-term inventory restocking for laptops and tablets.",
    startDate: 'Nov 5, 2023',
    maturityDate: 'Jan 4, 2024',
    payoutDate: 'Jan 6, 2024'
  },
  {
    id: 'c1-90',
    collectionId: 'c1',
    durationDays: 90,
    fixedReturn: 18.5,
    minInvestment: 20000,
    fundingProgress: 15,
    status: 'Open',
    description: "Quarterly bulk import expansion cycle.",
    startDate: 'Nov 10, 2023',
    maturityDate: 'Feb 8, 2024',
    payoutDate: 'Feb 11, 2024'
  },
  {
    id: 'c3-30',
    collectionId: 'c3',
    durationDays: 30,
    fixedReturn: 12.0,
    minInvestment: 7500,
    fundingProgress: 95,
    status: 'Filling Fast',
    description: "Monthly logistics and cold-chain support for flower exports.",
    startDate: 'Nov 2, 2023',
    maturityDate: 'Dec 2, 2023',
    payoutDate: 'Dec 5, 2023'
  },
  {
    id: 'c4-90',
    collectionId: 'c4',
    durationDays: 90,
    fixedReturn: 14.5,
    minInvestment: 3000,
    fundingProgress: 60,
    status: 'Open',
    description: "Bulk hardware procurement for festive season sales in Accra.",
    startDate: 'Nov 15, 2023',
    maturityDate: 'Feb 13, 2024',
    payoutDate: 'Feb 16, 2024'
  },
  {
    id: 'c5-180',
    collectionId: 'c5',
    durationDays: 180,
    fixedReturn: 19.8,
    minInvestment: 12000,
    fundingProgress: 30,
    status: 'Open',
    description: "Full harvest cycle financing for Rwandan coffee exporters.",
    startDate: 'Nov 20, 2023',
    maturityDate: 'May 18, 2024',
    payoutDate: 'May 21, 2024'
  }
];

// --- REAL ESTATE MOCK ---
export const REAL_ESTATE: RealEstateProperty[] = [
  {
    id: 're1',
    name: 'Lekki Heights Tower',
    location: 'Lekki Phase 1, Lagos',
    country: 'Nigeria',
    totalValue: 120000000,
    purchaseType: 'Fractional',
    minInvestment: 50000,
    expectedYield: 14.2,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    fundedProgress: 65,
    isCrossBorder: true,
    smartContractId: '0x71C765...d897',
    totalUnits: 100,
    availableUnits: 35,
    investorsCount: 42,
    description: 'High-yield residential apartments. This fractional pool is managed exclusively by Mix Afrika to ensure automated rent collection and maintenance.',
    units: MOCK_UNITS
  },
  {
    id: 're2',
    name: 'Epe Waterfront Villa',
    location: 'Epe, Lagos',
    country: 'Nigeria',
    totalValue: 45000000,
    purchaseType: 'Whole',
    minInvestment: 45000000,
    expectedYield: 9.5,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=400',
    fundedProgress: 100,
    isCrossBorder: false,
    smartContractId: '0x3A2E81...f1c2',
    investorsCount: 1,
    description: 'A private waterfront luxury villa. Buy the whole asset to own the exclusive tokenized deed. You can self-manage or opt for Mix Afrika professional management.',
    units: []
  },
  {
    id: 're3',
    name: 'Brooklyn Smart Studio',
    location: 'Bedford-Stuyvesant, NY',
    country: 'USA',
    totalValue: 850000000,
    purchaseType: 'Fractional',
    minInvestment: 250000,
    expectedYield: 8.4,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
    fundedProgress: 88,
    isCrossBorder: true,
    smartContractId: '0x1D9A4C...e2b4',
    totalUnits: 1000,
    availableUnits: 120,
    investorsCount: 842,
    description: 'Eco-friendly studios in Brooklyn. Fully tokenized for global fractional ownership with professional US-based management coordinated by Mix Afrika.',
    units: MOCK_UNITS
  }
];

// --- STOCKS & BONDS MOCK ---
export const STOCKS_BONDS: StockBond[] = [
  { 
    id: 'sb1', name: 'Mix Afrika Corp', ticker: 'MIX', type: 'Stock', price: 142.50, change: 3.42, changePercent: 2.4, 
    prevClose: 139.08, open: 140.00, volume: 1240000, marketCap: 1500000000, high52w: 165.00, low52w: 110.00, 
    dividendYield: 4.2, peRatio: 18.5, country: 'Kenya', exchange: 'NSE', sector: 'Financial Services', isCrossBorder: true,
    description: 'Mix Afrika Corp is a leading pan-African financial technology group specializing in cross-border trade settlements and local market liquidity.'
  },
  { 
    id: 'sb2', name: 'Nigeria FGN Bond 2028', ticker: 'FGN28', type: 'Bond', price: 985.00, change: -1.00, changePercent: -0.1, 
    prevClose: 986.00, open: 985.50, volume: 45000, marketCap: 5000000000, high52w: 1050.00, low52w: 920.00, 
    country: 'Nigeria', exchange: 'NGX', sector: 'Government', isCrossBorder: true,
    description: 'Federal Government of Nigeria Sovereign Bond with a maturity date in 2028. Backed by the full faith and credit of the Nigerian government.'
  },
  { 
    id: 'sb3', name: 'Tesla Inc', ticker: 'TSLA', type: 'Stock', price: 215.40, change: 2.58, changePercent: 1.2, 
    prevClose: 212.82, open: 214.00, volume: 85000000, marketCap: 680000000000, high52w: 299.00, low52w: 152.00, 
    peRatio: 72.4, country: 'USA', exchange: 'NASDAQ', sector: 'Automotive', isCrossBorder: true,
    description: 'Tesla designs and manufactures electric vehicles, battery energy storage from home to grid-scale, solar panels and solar roof tiles.'
  },
  { 
    id: 'sb4', name: 'Safaricom PLC', ticker: 'SCOM', type: 'Stock', price: 25.10, change: -0.12, changePercent: -0.5, 
    prevClose: 25.22, open: 25.15, volume: 12500000, marketCap: 1000000000, high52w: 32.00, low52w: 21.00, 
    dividendYield: 6.8, peRatio: 12.1, country: 'Kenya', exchange: 'NSE', sector: 'Telecommunications', isCrossBorder: true,
    description: 'Safaricom is a listed Kenyan mobile network operator, which is the largest telecommunications provider in Kenya.'
  },
  { 
    id: 'sb5', name: 'Microsoft Corp', ticker: 'MSFT', type: 'Stock', price: 342.10, change: 2.74, changePercent: 0.8, 
    prevClose: 339.36, open: 340.50, volume: 22000000, marketCap: 2500000000000, high52w: 366.00, low52w: 213.00, 
    dividendYield: 0.9, peRatio: 34.2, country: 'USA', exchange: 'NASDAQ', sector: 'Technology', isCrossBorder: true,
    description: 'Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, and personal computers.'
  },
  { 
    id: 'sb6', name: 'Dangote Cement', ticker: 'DANGCEM', type: 'Stock', price: 310.00, change: 5.50, changePercent: 1.8, 
    prevClose: 304.50, open: 305.00, volume: 2500000, marketCap: 5200000000, high52w: 350.00, low52w: 240.00, 
    dividendYield: 6.5, peRatio: 14.2, country: 'Nigeria', exchange: 'NGX', sector: 'Industrial Goods', isCrossBorder: true,
    description: 'Dangote Cement PLC is a Nigerian multinational publicly traded cement manufacturer headquartered in Lagos.'
  },
  { 
    id: 'sb7', name: 'MTN Nigeria', ticker: 'MTNN', type: 'Stock', price: 245.00, change: -2.45, changePercent: -1.0, 
    prevClose: 247.45, open: 246.00, volume: 4200000, marketCap: 4800000000, high52w: 285.00, low52w: 195.00, 
    dividendYield: 7.2, peRatio: 11.5, country: 'Nigeria', exchange: 'NGX', sector: 'Telecommunications', isCrossBorder: true,
    description: 'MTN Nigeria is part of the MTN Group, a multinational telecommunications group, and is the largest provider in Nigeria.'
  }
];

// --- STARTUP PITCHES MOCK ---
export const STARTUPS: StartupPitch[] = [
  {
    id: 'st1',
    name: 'AgroPay',
    founder: 'Kwame Mensah',
    location: 'Accra, Ghana',
    description: 'DeFi lending platform for smallholder farmers across West Africa.',
    vision: 'Empowering 50 million smallholder farmers with instant access to low-interest credit via decentralized mobile money protocols.',
    equityOffered: 15,
    valuation: 150000000,
    targetFunding: 250000,
    raisedAmount: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
    tags: ['Fintech', 'Agri'],
    isStrictlyAfrica: true
  }
];

export const COLLECTION_UPDATES: CollectionUpdate[] = [
    {
        id: 'u1',
        collectionId: 'c1',
        title: 'New Shipment Arrived',
        date: '2 hours ago',
        content: 'A major consignment of high-end laptops from Shenzhen has successfully cleared customs.',
        type: 'news',
        imageUrl: 'https://picsum.photos/seed/tech1/400/200'
    }
];

// --- SHARED UI DATA ---
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Payout Received', message: 'You received ₦340.50 from Aba Textile Co.', time: '2h ago', read: false, type: 'success' },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', type: 'bank', name: 'Chase Checking', mask: '**** 8823', status: 'active', icon: 'account_balance' },
  { id: 'pm2', type: 'card', name: 'Visa Desktop', mask: '**** 4242', status: 'active', icon: 'credit_card' },
];

export const MARKET_LISTINGS: MarketListing[] = [
    {
        id: 'm1',
        investmentName: 'Kano Rice Mills - 90 Days',
        category: 'Agriculture',
        originalAmount: 5000,
        currentValue: 5200,
        askingPrice: 5100,
        discount: 1.9,
        daysRemaining: 45,
        returnRate: 16.5,
        sellerName: 'Michael B.',
        iconName: 'agriculture'
    }
];

export const TIER_LEVELS: TierLevel[] = [
    { name: 'Bronze', minInvestment: 0, color: 'bg-amber-600', icon: 'star_outline', benefits: ['Standard support'] },
    { name: 'Gold', minInvestment: 25000, color: 'bg-yellow-500', icon: 'star', benefits: ['Premium support'] }
];

export const IMPACT_STATS: ImpactMetric[] = [
    { id: 'i1', label: 'Farmers Funded', value: '42', icon: 'agriculture', color: 'bg-emerald-500' }
];

// --- INVESTMENTS & GOALS ---
export const INVESTMENTS: Investment[] = [
  { id: '2', name: 'Aba Textile Co.', category: 'Manufacturing', status: 'Active', investedAmount: 8500, currentReturn: 980, progress: 82, iconName: 'checkroom', cycleDuration: '30 Days', startDate: 'Oct 01, 2023', maturityDate: 'Oct 31, 2023', payoutDate: 'Nov 02, 2023' },
];

export const GOALS: FinancialGoal[] = [
  { id: 'g1', name: 'New Car Fund', targetAmount: 25000, currentAmount: 15880, icon: 'directions_car', color: 'bg-blue-500', deadline: 'Dec 2024' },
];

export const ACTIVITIES: ActivityItem[] = [
  { id: 'a1', type: 'deposit', title: 'Wallet Deposit', description: 'Transfer from Bank', amount: 5000, date: 'Today, 10:23 AM', status: 'completed' },
];

// --- ESUSU ---
export const ESUSU_GROUPS: EsusuGroup[] = [
    {
        id: 'e1',
        name: 'Lagos Traders Circle',
        contributionAmount: 5000,
        frequency: 'Daily',
        membersCount: 10,
        myPosition: 4,
        payoutDate: 'Nov 12, 2023',
        totalSaved: 45000
    }
];

// --- ONBOARDING ---
const COMMON_ONBOARDING = [
    { id: 's1', label: 'Verify Identity', isCompleted: true, action: ViewType.KYC, icon: 'badge' },
    { id: 's2', label: 'Add Payment Method', isCompleted: true, action: ViewType.PAYMENT_METHODS, icon: 'credit_card' },
];

// --- USER PROFILES ---
export const PROFILE_FRESH: UserProfile = {
    id: 'fresh_01',
    name: 'New User',
    email: 'user@example.com',
    tier: 'Bronze',
    joinDate: 'Just now',
    walletBalance: 0,
    totalInvested: 0,
    totalEarnings: 0,
    activeInvestmentsCount: 0,
    investments: [],
    activities: [],
    goals: [],
    chartData: [],
    savingsPlans: [],
    onboardingSteps: COMMON_ONBOARDING.map(s => ({ ...s, isCompleted: false }))
};

export const PROFILE_STARTER: UserProfile = {
    ...PROFILE_FRESH,
    id: 'start_01',
    name: 'Sarah Smith',
    walletBalance: 500,
    totalInvested: 1000,
    investments: [INVESTMENTS[0]],
    onboardingSteps: COMMON_ONBOARDING
};

export const PROFILE_EXPERT: UserProfile = {
    id: 'expert_01',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    tier: 'Gold',
    joinDate: 'Jan 15, 2023',
    walletBalance: 3400520.00,
    totalInvested: 125430.00,
    totalEarnings: 15880.00,
    activeInvestmentsCount: 12,
    investments: INVESTMENTS,
    activities: ACTIVITIES,
    goals: GOALS,
    chartData: CHART_DATA,
    savingsPlans: [],
    onboardingSteps: COMMON_ONBOARDING
};

// --- SPINE MOCK DATA ---
export const SPINE_OUTLETS_MOCK: SpineOutlet[] = [
    { id: 'o1', name: 'Main Shop (Lagos)', address: '12 Marina Rd, Lagos Island', isHQ: true },
    { id: 'o2', name: 'Airport Branch', address: 'MM2 Departure Hall', isHQ: false },
    { id: 'o3', name: 'Warehouse Hub', address: 'Orile Iganmu Ind. Estate', isHQ: false },
];

export const SPINE_USERS_MOCK: SpineUser[] = [
    { id: 'u1', name: 'Bisi Adebayo', role: 'Owner', assignedOutletId: 'all', phone: '+234 800 123 4567' },
    { id: 'u2', name: 'Kemi Staff', role: 'Staff', assignedOutletId: 'o1', phone: '+234 800 999 8888' },
    { id: 'u3', name: 'James Manager', role: 'Manager', assignedOutletId: 'o2', phone: '+234 800 777 6666' },
];

export const SPINE_SHOP_MOCK: SpineShop = {
    id: 'ks1',
    traderId: 'trader_active',
    name: 'Bisi Market Point',
    category: 'General',
    mainItems: ['Produce', 'Groceries'],
    language: 'English',
    currency: 'NGN',
    outlets: SPINE_OUTLETS_MOCK,
    users: SPINE_USERS_MOCK,
    customers: [
        { id: 'c1', name: 'Mama Shade', phone: '+234 810 555 1234', totalOwed: 2500 },
        { id: 'c2', name: 'Brother John', phone: '+234 810 444 9876', totalOwed: 0 },
        { id: 'c3', name: 'Aunty Bunmi', phone: '+234 810 333 4567', totalOwed: 12400 }
    ],
    isPublicOnSlash: true
};

const now = new Date();
const threeDaysFromNow = new Date();
threeDaysFromNow.setDate(now.getDate() + 3);

export const SPINE_PRODUCTS_MOCK: SpineProduct[] = [
    {
        id: 'p1', name: 'Organic Bananas', bulkUnitName: 'Bunch', pieceUnitName: 'Finger',
        bulkQuantity: 12, pieceQuantity: 12, unitsPerBulk: 15, costPricePerPiece: 45,
        sellingPricePerPiece: 80, category: 'Produce', serialNumber: 'BAN-001',
        imageUrl: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?auto=format&fit=crop&q=80&w=400',
        images: ['https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?auto=format&fit=crop&q=80&w=400'],
        reviews: [{ id: 'r1', userName: 'Sarah O.', rating: 5, comment: 'Fresh!', date: '2 days ago' }],
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 8, pieceQuantity: 7 },
            { outletId: 'o2', bulkQuantity: 4, pieceQuantity: 5 }
        ],
        batches: [
            {
                id: 'b-p1-1',
                expiryDate: threeDaysFromNow.toISOString(),
                bulkQuantity: 2,
                pieceQuantity: 5,
                addedAt: '2023-11-01',
                outletId: 'o1'
            }
        ]
    },
    {
        id: 'p2', name: 'Classic Ankara (Red)', bulkUnitName: 'Bolt', pieceUnitName: 'Yard',
        bulkQuantity: 3, pieceQuantity: 42, unitsPerBulk: 50, costPricePerPiece: 800,
        sellingPricePerPiece: 1200, category: 'Fabrics', serialNumber: 'TEX-882',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 2, pieceQuantity: 30 },
            { outletId: 'o3', bulkQuantity: 1, pieceQuantity: 12 }
        ]
    },
    {
        id: 'p3', name: 'Smart Tablet X1', bulkUnitName: 'Carton', pieceUnitName: 'Device',
        bulkQuantity: 0, pieceQuantity: 4, unitsPerBulk: 10, costPricePerPiece: 45000,
        sellingPricePerPiece: 62000, category: 'Electronics', serialNumber: 'ELC-901',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 0, pieceQuantity: 4 }
        ]
    },
    {
        id: 'p4', name: 'Premium Parboiled Rice', bulkUnitName: 'Sack', pieceUnitName: 'Mudu',
        bulkQuantity: 15, pieceQuantity: 22, unitsPerBulk: 25, costPricePerPiece: 1200,
        sellingPricePerPiece: 1800, category: 'Groceries', serialNumber: 'GRO-442',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 5, pieceQuantity: 10 },
            { outletId: 'o3', bulkQuantity: 10, pieceQuantity: 12 }
        ],
        batches: [
            {
                id: 'b-p4-1',
                expiryDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                bulkQuantity: 5,
                pieceQuantity: 0,
                addedAt: '2023-10-15',
                outletId: 'o1'
            }
        ]
    },
    {
        id: 'p5', name: 'Vegetable Oil (Gold)', bulkUnitName: 'Crate', pieceUnitName: 'Bottle',
        bulkQuantity: 8, pieceQuantity: 5, unitsPerBulk: 12, costPricePerPiece: 1800,
        sellingPricePerPiece: 2400, category: 'Groceries', serialNumber: 'GRO-102',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 4, pieceQuantity: 2 },
            { outletId: 'o2', bulkQuantity: 4, pieceQuantity: 3 }
        ]
    },
    {
        id: 'p6', name: 'Shea Butter Soap', bulkUnitName: 'Pack', pieceUnitName: 'Bar',
        bulkQuantity: 0, pieceQuantity: 0, unitsPerBulk: 24, costPricePerPiece: 150,
        sellingPricePerPiece: 300, category: 'Beauty', serialNumber: 'BTY-005',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 0, pieceQuantity: 0 }
        ]
    },
    {
        id: 'p7', name: 'Power Bank 10Ah', bulkUnitName: 'Pack', pieceUnitName: 'Unit',
        bulkQuantity: 4, pieceQuantity: 12, unitsPerBulk: 10, costPricePerPiece: 3200,
        sellingPricePerPiece: 5500, category: 'Electronics', serialNumber: 'ELC-223',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 2, pieceQuantity: 8 },
            { outletId: 'o2', bulkQuantity: 2, pieceQuantity: 4 }
        ]
    },
    {
        id: 'p8', name: 'Cotton Fabric Bolt', bulkUnitName: 'Bolt', pieceUnitName: 'Yard',
        bulkQuantity: 12, pieceQuantity: 15, unitsPerBulk: 40, costPricePerPiece: 450,
        sellingPricePerPiece: 700, category: 'Fabrics', serialNumber: 'TEX-112',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 6, pieceQuantity: 10 },
            { outletId: 'o3', bulkQuantity: 6, pieceQuantity: 5 }
        ]
    },
    {
        id: 'p9', name: 'Yam Tubers (Large)', bulkUnitName: 'Bundle', pieceUnitName: 'Tuber',
        bulkQuantity: 20, pieceQuantity: 50, unitsPerBulk: 20, costPricePerPiece: 400,
        sellingPricePerPiece: 850, category: 'Produce', serialNumber: 'PRD-772',
        stockBalances: [
            { outletId: 'o1', bulkQuantity: 20, pieceQuantity: 50 }
        ]
    },
    {
        id: 'p10', name: 'Standard Cement Bag', bulkUnitName: 'Pallet', pieceUnitName: 'Bag',
        bulkQuantity: 2, pieceQuantity: 14, unitsPerBulk: 50, costPricePerPiece: 3800,
        sellingPricePerPiece: 4800, category: 'Hardware', serialNumber: 'HRD-001',
        stockBalances: [
            { outletId: 'o3', bulkQuantity: 2, pieceQuantity: 14 }
        ]
    }
];

export const SPINE_SALES_MOCK: SpineSale[] = [
    // TODAY
    { 
        id: 's-today-1', timestamp: 'Today, 2:45 PM', totalAmount: 18000, totalProfit: 4500, 
        paymentMethod: 'cash', amountPaid: 18000, balanceDue: 0, 
        items: [{ productId: 'p2', productName: 'Classic Ankara (Red)', quantity: 15, priceAtSale: 1200, unitType: 'piece' }],
        outletId: 'o1', recordedByUserId: 'u2'
    },
    { 
        id: 's-today-2', timestamp: 'Today, 11:30 AM', totalAmount: 5500, totalProfit: 2300, 
        paymentMethod: 'wallet', amountPaid: 5500, balanceDue: 0, 
        items: [{ productId: 'p7', productName: 'Power Bank 10Ah', quantity: 1, priceAtSale: 5500, unitType: 'piece' }],
        outletId: 'o1', recordedByUserId: 'u2'
    },
    { 
        id: 's-today-3', timestamp: 'Today, 9:15 AM', totalAmount: 2400, totalProfit: 600, 
        paymentMethod: 'transfer', amountPaid: 2400, balanceDue: 0, 
        items: [{ productId: 'p5', productName: 'Vegetable Oil (Gold)', quantity: 1, priceAtSale: 2400, unitType: 'piece' }],
        outletId: 'o2', recordedByUserId: 'u3'
    },
    // YESTERDAY
    { 
        id: 's-yest-1', timestamp: 'Yesterday, 5:20 PM', totalAmount: 62000, totalProfit: 17000, 
        paymentMethod: 'cash', amountPaid: 62000, balanceDue: 0, 
        items: [{ productId: 'p3', productName: 'Smart Tablet X1', quantity: 1, priceAtSale: 62000, unitType: 'piece' }],
        outletId: 'o1', recordedByUserId: 'u2'
    },
    { 
        id: 's-yest-2', timestamp: 'Yesterday, 3:45 PM', totalAmount: 12500, totalProfit: 3000, 
        paymentMethod: 'debt', amountPaid: 2500, balanceDue: 10000, customerId: 'c1',
        items: [{ productId: 'p4', productName: 'Premium Parboiled Rice', quantity: 7, priceAtSale: 1785, unitType: 'piece' }],
        outletId: 'o1', recordedByUserId: 'u1'
    },
    { 
        id: 's-yest-3', timestamp: 'Yesterday, 10:00 AM', totalAmount: 4800, totalProfit: 1000, 
        paymentMethod: 'cash', amountPaid: 4800, balanceDue: 0, 
        items: [{ productId: 'p10', productName: 'Standard Cement Bag', quantity: 1, priceAtSale: 4800, unitType: 'piece' }],
        outletId: 'o3', recordedByUserId: 'u1'
    },
    // WEEKLY (Last 7 Days)
    { 
        id: 's-week-1', timestamp: '3 days ago, 4:10 PM', totalAmount: 45000, totalProfit: 12000, 
        paymentMethod: 'transfer', amountPaid: 45000, balanceDue: 0, 
        items: [{ productId: 'p2', productName: 'Classic Ankara (Red)', quantity: 1, priceAtSale: 45000, unitType: 'bulk' }],
        outletId: 'o1', recordedByUserId: 'u2'
    },
    { 
        id: 's-week-2', timestamp: '5 days ago, 2:30 PM', totalAmount: 15600, totalProfit: 4200, 
        paymentMethod: 'cash', amountPaid: 15600, balanceDue: 0, 
        items: [{ productId: 'p1', productName: 'Organic Bananas', quantity: 2, priceAtSale: 7800, unitType: 'bulk' }],
        outletId: 'o2', recordedByUserId: 'u3'
    },
    { 
        id: 's-week-3', timestamp: '7 days ago, 11:00 AM', totalAmount: 8500, totalProfit: 4500, 
        paymentMethod: 'cash', amountPaid: 8500, balanceDue: 0, 
        items: [{ productId: 'p9', productName: 'Yam Tubers (Large)', quantity: 10, priceAtSale: 850, unitType: 'piece' }],
        outletId: 'o1', recordedByUserId: 'u2'
    },
    // MONTHLY (Last 30 Days)
    { 
        id: 's-month-1', timestamp: '12 days ago, 5:00 PM', totalAmount: 124000, totalProfit: 35000, 
        paymentMethod: 'transfer', amountPaid: 124000, balanceDue: 0, 
        items: [{ productId: 'p3', productName: 'Smart Tablet X1', quantity: 2, priceAtSale: 62000, unitType: 'piece' }],
        outletId: 'o1', recordedByUserId: 'u1'
    },
    { 
        id: 's-month-2', timestamp: '18 days ago, 1:20 PM', totalAmount: 48000, totalProfit: 10000, 
        paymentMethod: 'cash', amountPaid: 48000, balanceDue: 0, 
        items: [{ productId: 'p10', productName: 'Standard Cement Bag', quantity: 10, priceAtSale: 4800, unitType: 'piece' }],
        outletId: 'o3', recordedByUserId: 'u1'
    },
    { 
        id: 's-month-3', timestamp: '25 days ago, 4:45 PM', totalAmount: 14000, totalProfit: 5000, 
        paymentMethod: 'debt', amountPaid: 0, balanceDue: 14000, customerId: 'c3',
        items: [{ productId: 'p8', productName: 'Cotton Fabric Bolt', quantity: 20, priceAtSale: 700, unitType: 'piece' }],
        outletId: 'o1', recordedByUserId: 'u2'
    },
    { 
        id: 's-month-4', timestamp: '30 days ago, 10:15 AM', totalAmount: 28800, totalProfit: 7200, 
        paymentMethod: 'transfer', amountPaid: 28800, balanceDue: 0, 
        items: [{ productId: 'p5', productName: 'Vegetable Oil (Gold)', quantity: 1, priceAtSale: 2400, unitType: 'piece' }],
        outletId: 'o2', recordedByUserId: 'u3'
    }
];

export const SPINE_ACTIVITIES_MOCK: SpineActivity[] = [
    { id: 'sa7', action: 'sale_recorded', performer: 'Kemi Staff', timestamp: 'Today, 4:12 PM', details: 'Sold 15 units of Classic Ankara (Red)', severity: 'info', outletId: 'o1' },
    { id: 'sa8', action: 'stock_update', performer: 'Bisi Adebayo', timestamp: 'Today, 10:00 AM', details: 'Restocked Standard Cement Bags at Warehouse', severity: 'info', outletId: 'o3' },
    { id: 'sa9', action: 'sale_recorded', performer: 'James Manager', timestamp: 'Today, 9:15 AM', details: 'Credit sale to Mama Shade: ₦12,500', severity: 'warning', outletId: 'o1' }
];

// --- TRADER PROFILES ---
export const PROFILE_TRADER_ACTIVE: TraderProfile = {
    id: 'trader_active',
    name: 'Bisi Adebayo',
    businessName: 'Bisi Textiles',
    email: 'bisi@example.com',
    location: 'Lagos, Nigeria',
    kycStatus: 'Verified',
    creditScore: 720,
    walletBalance: 503780,
    activeLoan: null,
    esusuGroups: ESUSU_GROUPS,
    savingsPlans: [
        {
            id: 'sp-1',
            name: 'New Shop Rent',
            targetAmount: 500000,
            balance: 125000,
            tenorDays: 180,
            interestRate: 14.5,
            liquidityType: 'Locked',
            autoSaveEnabled: true,
            contributionFrequency: 'Weekly',
            startDate: 'Sep 01, 2023',
            maturityDate: 'Mar 01, 2024',
            nextDepositDate: 'Oct 22, 2023',
            status: 'Active'
        }
    ],
    activities: [
        { id: 'ta1', type: 'repayment', title: 'Daily Loan Repayment', description: 'Computer Village Hub', amount: -1833, date: 'Today, 9:00 AM', status: 'completed' },
    ],
    onboardingSteps: COMMON_ONBOARDING,
    spineShop: SPINE_SHOP_MOCK
};

export const PROFILE_TRADER_NEW: TraderProfile = {
    ...PROFILE_TRADER_ACTIVE,
    id: 'trader_new',
    kycStatus: 'None',
    creditScore: 0,
    walletBalance: 0,
    spineShop: undefined,
    savingsPlans: [],
    activities: []
};

// --- AGENT PROFILES ---
export const MANAGED_TRADERS: ManagedTrader[] = [
    { id: 't1', name: 'Bisi Adebayo', businessName: 'Bisi Textiles', location: 'Lagos Island', status: 'Active', loanStatus: 'On Track', lastVisit: '2 days ago' },
    { id: 't2', name: 'Musa Ibrahim', businessName: 'Musa Provisions', location: 'Obalende', status: 'Active', loanStatus: 'On Track', lastVisit: '1 day ago' },
    { id: 't3', name: 'Sarah Chima', businessName: ' Sarah Boutique', location: 'Lagos Island', status: 'Active', loanStatus: 'On Track', lastVisit: '3 days ago' },
    { id: 't4', name: 'John Doe', businessName: 'John Electronics', location: 'Ikeja', status: 'Default Risk', loanStatus: 'Late', lastVisit: '5 days ago' },
    { id: 't5', name: 'Grace Ajayi', businessName: 'Grace Groceries', location: 'Surulere', status: 'Active', loanStatus: 'On Track', lastVisit: 'Today' },
    { id: 't6', name: 'Samuel Okoro', businessName: 'Sam Hardware', location: 'Yaba', status: 'Pending Verification', lastVisit: '4 days ago' },
    { id: 't7', name: 'Ibrahim Bello', businessName: 'Bello Mall', location: 'Lekki', status: 'Active', loanStatus: 'On Track', lastVisit: '2 days ago' },
    { id: 't8', name: 'Folasade Ade', businessName: 'Sade Cosmetics', location: 'Victoria Island', status: 'Active', loanStatus: 'On Track', lastVisit: '6 days ago' },
    { id: 't9', name: 'Chinedu Eze', businessName: 'Eze Stores', location: 'Ajah', status: 'Active', loanStatus: 'On Track', lastVisit: '1 week ago' },
    { id: 't10', name: 'Mary Udoh', businessName: 'Mary Fabrics', location: 'Ikorodu', status: 'Pending Verification', lastVisit: '2 days ago' },
    { id: 't11', name: 'Kalu Uche', businessName: 'Kalu Motors', location: 'Festac', status: 'Default Risk', loanStatus: 'Late', lastVisit: '3 days ago' },
    { id: 't12', name: 'Joy Amadi', businessName: 'Joy Saloon', location: 'Mushin', status: 'Active', loanStatus: 'On Track', lastVisit: 'Today' },
    { id: 't13', name: 'Peter Obi', businessName: 'Obi Parts', location: 'Nnewi', status: 'New', loanStatus: 'No Loan', lastVisit: 'N/A' },
    { id: 't14', name: 'Esther Kanu', businessName: 'Esther Salon', location: 'Aba', status: 'Active', loanStatus: 'On Track', lastVisit: '4 days ago' },
    { id: 't15', name: 'Yusuf Lawal', businessName: 'Lawal Grains', location: 'Kano', status: 'Default Risk', loanStatus: 'Late', lastVisit: '1 day ago' },
];

export const PROFILE_AGENT: AgentProfile = {
    id: 'agent_01',
    name: 'Agent Michael',
    region: 'Lagos Mainland',
    email: 'agent.michael@mix.com',
    walletBalance: 45000,
    commissionEarned: 125000,
    tradersCount: 15,
    repaymentRate: 94.5,
    managedTraders: MANAGED_TRADERS,
    activities: [
        { id: 'aa1', type: 'commission', title: 'Onboarding Bonus', description: 'Sarah Chima verified', amount: 1500, date: 'Today, 2:00 PM', status: 'completed' },
        { id: 'aa2', type: 'commission', title: 'Collection Bonus', description: 'Daily target reached', amount: 3000, date: 'Yesterday, 6:00 PM', status: 'completed' },
        { id: 'aa3', type: 'repayment', title: 'Manual Collection', description: 'Received from Musa Ibrahim', amount: 5000, date: 'Yesterday, 11:00 AM', status: 'completed' },
        { id: 'aa4', type: 'commission', title: 'KYC Referral', description: 'Grace Ajayi Level 2', amount: 500, date: '2 days ago', status: 'completed' },
        { id: 'aa5', type: 'commission', title: 'Verification Reward', description: 'Peter Obi New Onboarding', amount: 1000, date: '3 days ago', status: 'completed' },
        { id: 'aa6', type: 'repayment', title: 'Manual Collection', description: 'Received from John Doe (Partial)', amount: 2500, date: '4 days ago', status: 'completed' },
        { id: 'aa7', type: 'commission', title: 'Portfolio Health Bonus', description: '94% Repayment achieved', amount: 5000, date: '1 week ago', status: 'completed' },
        { id: 'aa8', type: 'withdrawal', title: 'Earnings Payout', description: 'To Personal Bank', amount: -25000, date: '1 week ago', status: 'completed' },
    ],
    onboardingSteps: []
};

// --- TAX ---
export const TAX_TRANSACTIONS_MOCK: TaxTransaction[] = [];
export const TAX_FILINGS_MOCK: TaxFiling[] = [];
export const TAX_PROFILE_MOCK: TaxProfile = {
    countryCode: 'NG', taxId: '23894021', businessType: 'Sole Prop',
    vatRegistered: true, accountingBasis: 'Cash', optInAutoFile: true
};
