
export interface InvestmentHistoryItem {
  date: string;
  amount: number;
  equityOwned?: number;
  units?: number;
  method: 'wallet' | 'card';
}

export interface Investment {
  id: string;
  name: string;
  category: string;
  status: 'Pending' | 'Active';
  investedAmount: number;
  currentReturn: number;
  progress: number;
  iconName: string;
  cycleDuration: string;
  startDate?: string;
  maturityDate?: string;
  payoutDate?: string;
  // Real Estate specific fields
  propertyId?: string;
  managementType?: RealEstateManagementType;
  purchaseType?: RealEstatePurchaseType;
  // Stock specific fields
  ticker?: string;
  units?: number;
  // Startup specific
  equityOwned?: number;
  // Aggregation field
  history?: InvestmentHistoryItem[];
}

export interface Collection {
  id: string;
  name: string;
  category: string;
  location: string;
  country: string;
  description: string;
  maxReturn: number;
  minInvestment: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  iconName: string;
  totalInvestors: number;
  securityType: string;
}

export interface RealEstateUnit {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  sizeSqft: number;
}

export type RealEstatePurchaseType = 'Whole' | 'Fractional';
export type RealEstateManagementType = 'Self' | 'Mix Afrika';

export interface RealEstateProperty {
  id: string;
  name: string;
  location: string;
  country: string;
  totalValue: number;
  purchaseType: RealEstatePurchaseType;
  minInvestment: number; // For fractional, it's unit price. For whole, it's total value.
  expectedYield: number;
  imageUrl: string;
  fundedProgress: number;
  isCrossBorder: boolean;
  smartContractId: string;
  totalUnits?: number; // Only for fractional
  availableUnits?: number; // Only for fractional
  investorsCount: number;
  description: string;
  units: RealEstateUnit[];
}

export interface StockBond {
  id: string;
  name: string;
  ticker: string;
  type: 'Stock' | 'Bond' | 'Security';
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  open: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  dividendYield?: number;
  peRatio?: number;
  country: string;
  exchange: string;
  sector: string;
  isCrossBorder: boolean;
  description?: string;
}

export interface StartupPitch {
  id: string;
  name: string;
  founder: string;
  location: string;
  description: string;
  equityOffered: number;
  targetFunding: number;
  raisedAmount: number;
  imageUrl: string;
  tags: string[];
  isStrictlyAfrica: boolean;
  vision?: string;
  slides?: string[];
  valuation?: number;
}

export interface CollectionUpdate {
    id: string;
    collectionId: string;
    title: string;
    date: string;
    content: string;
    type: 'news' | 'impact' | 'milestone';
    imageUrl?: string;
}

export interface Cluster {
  id: string;
  collectionId: string;
  durationDays: number;
  fixedReturn: number;
  minInvestment: number;
  fundingProgress: number;
  status: 'Open' | 'Filling Fast' | 'Sold Out';
  description: string;
  startDate: string;
  maturityDate: string;
  payoutDate: string;
}

export interface ChartDataPoint {
  day: string;
  value: number;
}

export type OfferingTab = 'clusters' | 'real_estate' | 'stocks' | 'startup';

export enum ViewType {
  // Common
  DASHBOARD = 'Dashboard',
  PROFILE = 'Profile',
  PAYMENT_METHODS = 'PaymentMethods',
  KYC = 'KYC',
  SECURITY = 'Security',
  HELP = 'Help',
  NOTIFICATIONS_SETTINGS = 'NotificationsSettings',
  
  // Investor Specific
  EXPLORE = 'Explore',
  ACTIVITY = 'Activity',
  ANALYTICS = 'Analytics',
  REFERRAL = 'Referral',
  LEARN = 'Learn',
  INVESTMENT_DETAIL = 'InvestmentDetail',
  AUTO_INVEST = 'AutoInvest',
  TRANSACTION_DETAIL = 'TransactionDetail',
  SECONDARY_MARKET = 'SecondaryMarket',
  TIERS = 'Tiers',
  IMPACT = 'Impact',
  INVESTOR_SAVINGS = 'InvestorSavings',
  INVESTOR_SAVINGS_CREATE = 'InvestorSavingsCreate',
  INVESTOR_SAVINGS_DETAIL = 'InvestorSavingsDetail',
  SAVINGS_STREAK_DETAIL = 'SavingsStreakDetail',
  INVESTOR_SLASH_SHOP = 'InvestorSlashShop',
  REAL_ESTATE_DETAIL = 'RealEstateDetail',
  STOCK_DETAIL = 'StockDetail',
  STARTUP_DETAIL = 'StartupDetail',

  // Trader Specific
  TRADER_LOAN_APPLY = 'TraderLoanApply',
  TRADER_ESUSU = 'TraderEsusu',
  TRADER_LOAN_DETAIL = 'TraderLoanDetail',
  TRADER_SAVINGS = 'TraderSavings',
  TRADER_SAVINGS_CREATE = 'TraderSavingsCreate',
  TRADER_SAVINGS_PLAN_DETAIL = 'TraderSavingsPlanDetail',

  // Spine Module
  SPINE_DASHBOARD = 'SpineDashboard',
  SPINE_SETUP = 'SpineSetup',
  SPINE_INVENTORY = 'SpineInventory',
  SPINE_PRODUCT_DETAIL = 'SpineProductDetail',
  SPINE_ADD_PRODUCT = 'SpineAddProduct',
  SPINE_POS = 'SpinePOS',
  SPINE_SALES_HISTORY = 'SpineSalesHistory',
  SPINE_SALE_DETAIL = 'SpineSaleDetail',
  SPINE_CALCULATOR = 'SpineCalculator',
  SPINE_GROWTH = 'SpineGrowth',
  SPINE_ACTIVITIES = 'SpineActivities',
  SPINE_MANAGEMENT = 'SpineManagement',
  SPINE_STOCK_TRANSFER = 'SpineStockTransfer',
  SPINE_DEBT_CENTER = 'SpineDebtCenter',
  SPINE_ADJUST_STOCK = 'SpineAdjustStock',
  SPINE_ADD_STOCK = 'SpineAddStock',
  SPINE_SLASH_ORDERS = 'SpineSlashOrders',
  SPINE_CAMERAS = 'SpineCameras',

  // Agent Specific
  AGENT_TRADERS = 'AgentTraders',
  AGENT_REPORTS = 'AgentReports',
  AGENT_WALLET = 'AgentWallet',
  AGENT_DAILY_COLLECTIONS = 'AgentDailyCollections',
  AGENT_ASSISTED_SESSION = 'AgentAssistedSession',

  // TaxDesk
  TAX_PROFILE = 'TaxProfile',
  TAX_DASHBOARD = 'TaxDashboard',
  TAX_FILING = 'TaxFiling',
  TAX_ADMIN = 'TaxAdmin',
}

// Spine Interfaces
export interface SpineOutlet {
    id: string;
    name: string;
    address: string;
    isHQ: boolean;
}

export type SpineUserRole = 'Owner' | 'Manager' | 'Staff';

export interface SpineUser {
    id: string;
    name: string;
    role: SpineUserRole;
    assignedOutletId: string; // "all" for owners
    phone: string;
}

export interface SpineCustomer {
    id: string;
    name: string;
    phone: string;
    totalOwed: number;
}

export interface SpineShop {
    id: string;
    traderId: string;
    name?: string;
    category: string;
    mainItems: string[];
    language: string;
    currency: string;
    outlets: SpineOutlet[];
    users: SpineUser[];
    customers: SpineCustomer[];
    isPublicOnSlash?: boolean;
}

export interface SpineStockBalance {
    outletId: string;
    bulkQuantity: number;
    pieceQuantity: number;
}

export interface SpineBatch {
    id: string;
    expiryDate: string;
    bulkQuantity: number;
    pieceQuantity: number;
    addedAt: string;
    outletId: string;
}

export interface SpineReview {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface SpineProduct {
    id: string;
    name: string;
    bulkUnitName: string; 
    pieceUnitName: string;
    unitsPerBulk: number;
    costPricePerPiece: number;
    sellingPricePerPiece: number;
    sellingPricePerBulk?: number;
    category?: string;
    serialNumber?: string;
    stockBalances: SpineStockBalance[]; // Per-outlet stock
    batches?: SpineBatch[]; // New Batch tracking for expiration
    bulkQuantity: number;
    pieceQuantity: number;
    imageUrl?: string;
    images?: string[]; 
    reviews?: SpineReview[]; 
}

export interface SpineSaleItem {
    productId: string;
    productName: string;
    quantity: number;
    priceAtSale: number;
    unitType: 'piece' | 'bulk';
}
//  id UUID PK
// branch_id UUID FK → branches(id)
// customer_id UUID FK → customers(id) NULLABLE
// total_amount DECIMAL(12,2)
// payment_method ENUM('cash','transfer','card','credit')
// status ENUM('completed','cancelled','refunded')
// created_by UUID FK → users(id)
// created_at TIMESTAMP
export interface SpineSale {
    id: string;
    items: SpineSaleItem[];
    totalAmount: number;
    totalProfit: number;
    paymentMethod: 'cash' | 'transfer' | 'wallet' | 'debt';
    amountPaid: number;
    balanceDue: number;
    customerId?: string;
    timestamp: string;
    outletId: string;
    recordedByUserId: string;
}

export interface SpineActivity {
    id: string;
    action: 'product_added' | 'stock_update' | 'price_change' | 'sale_recorded' | 'sale_voided' | 'shop_settings_update' | 'stock_transfer' | 'stock_adjustment' | 'debt_repayment';
    performer: string;
    timestamp: string;
    details: string;
    severity: 'info' | 'warning' | 'alert';
    outletId?: string;
}

export type ActivityType = 'deposit' | 'withdrawal' | 'investment' | 'payout' | 'yield' | 'repayment' | 'esusu_contribution' | 'commission' | 'savings_deposit' | 'purchase';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'card' | 'wallet';
  name: string;
  mask: string;
  status: 'active' | 'expired' | 'requires_verification';
  icon: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  deadline: string;
}

export interface OnboardingStep {
    id: string;
    label: string;
    isCompleted: boolean;
    action: ViewType;
    icon: string;
}

export interface MarketListing {
    id: string;
    investmentName: string;
    originalAmount: number;
    currentValue: number;
    askingPrice: number;
    discount: number;
    daysRemaining: number;
    returnRate: number;
    sellerName: string;
    category: string;
    iconName: string;
}

export interface TierLevel {
    name: string;
    minInvestment: number;
    color: string;
    benefits: string[];
    icon: string;
}

export interface ImpactMetric {
    id: string;
    label: string;
    value: string;
    icon: string;
    color: string;
}

export interface SavingsPlan {
    id: string;
    name: string;
    targetAmount: number;
    balance: number;
    tenorDays: number;
    interestRate: number;
    liquidityType: 'Locked' | 'Partial' | 'Flexible';
    autoSaveEnabled: boolean;
    contributionFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Market Day' | 'Custom';
    startDate: string;
    maturityDate: string;
    nextDepositDate: string;
    status: 'Active' | 'Completed' | 'Paused';
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    tier: string;
    joinDate: string;
    walletBalance: number;
    totalInvested: number;
    totalEarnings: number;
    activeInvestmentsCount: number;
    investments: Investment[];
    activities: ActivityItem[];
    goals: FinancialGoal[];
    chartData: ChartDataPoint[];
    onboardingSteps: OnboardingStep[];
    savingsPlans: SavingsPlan[];
    taxProfile?: TaxProfile;
}

export type UserRole = 'investor' | 'trader' | 'agent';

export interface Loan {
    id: string;
    amount: number;
    collectionName: string;
    durationDays: number;
    startDate: string;
    dueDate: string;
    totalRepayment: number;
    amountPaid: number;
    dailyRepaymentAmount: number;
    status: 'Active' | 'Completed' | 'Defaulted' | 'Pending Approval';
    progress: number;
}

export interface EsusuGroup {
    id: string;
    name: string;
    contributionAmount: number;
    frequency: 'Daily' | 'Weekly';
    membersCount: number;
    myPosition: number;
    payoutDate: string;
    totalSaved: number;
}

export interface TraderProfile {
    id: string;
    name: string;
    businessName: string;
    email: string;
    location: string;
    kycStatus: 'Verified' | 'Pending' | 'None';
    creditScore: number;
    walletBalance: number;
    activeLoan: Loan | null;
    esusuGroups: EsusuGroup[];
    savingsPlans: SavingsPlan[];
    activities: ActivityItem[];
    onboardingSteps: OnboardingStep[];
    taxProfile?: TaxProfile;
    assignedAgent?: {
        name: string;
        phone: string;
        photo: string;
    };
    spineShop?: SpineShop; 
}

export interface ManagedTrader {
    id: string;
    name: string;
    businessName: string;
    location: string;
    status: 'Active' | 'Pending Verification' | 'Default Risk' | 'New';
    loanStatus?: 'On Track' | 'Late' | 'No Loan';
    lastVisit?: string;
    assistedModeEnabled?: boolean;
}

export interface AgentProfile {
    id: string;
    name: string;
    region: string;
    email: string;
    walletBalance: number;
    commissionEarned: number;
    tradersCount: number;
    repaymentRate: number;
    managedTraders: ManagedTrader[];
    activities: ActivityItem[];
    onboardingSteps: OnboardingStep[];
}

export interface TaxProfile {
    countryCode: string;
    taxId: string;
    businessType: 'Individual' | 'Sole Prop' | 'Company';
    vatRegistered: boolean;
    accountingBasis: 'Cash' | 'Accrual';
    optInAutoFile: boolean;
}

export interface TaxTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: 'Sales' | 'Expense' | 'Asset' | 'Cost of Sales';
    taxable: boolean;
    vatAmount: number;
    status: 'Auto-Classified' | 'Review Needed' | 'Verified';
    hasInvoice: boolean;
}

export interface TaxTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: 'Sales' | 'Expense' | 'Asset' | 'Cost of Sales';
    taxable: boolean;
    vatAmount: number;
    status: 'Auto-Classified' | 'Review Needed' | 'Verified';
    hasInvoice: boolean;
}

export interface TaxFiling {
    id: string;
    period: string;
    taxType: 'VAT' | 'Income' | 'WHT';
    amountDue: number;
    status: 'Draft' | 'Filed' | 'Failed';
    dateFiled?: string;
}
