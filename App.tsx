
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
// Investor Views
import { DashboardView } from './components/DashboardView';
import { ExploreView } from './components/ExploreView';
import { ProfileView } from './components/ProfileView';
import { ActivityView } from './components/ActivityView';
import { PortfolioAnalyticsView } from './components/PortfolioAnalyticsView';
import { ActiveInvestmentDetailView } from './components/ActiveInvestmentDetailView';
import { AutoInvestView } from './components/AutoInvestView';
import { TransactionDetailView } from './components/TransactionDetailView';
import { SecondaryMarketView } from './components/SecondaryMarketView';
import { TiersView } from './components/TiersView';
import { ImpactProfileView } from './components/ImpactProfileView';
import { InvestorSavingsView } from './components/InvestorSavingsView';
import { SavingsStreakDetailView } from './components/SavingsStreakDetailView';
import { InvestorSlashShopView } from './components/InvestorSlashShopView';
import { RealEstateDetailView } from './components/RealEstateDetailView';
import { StockDetailView } from './components/StockDetailView';
import { StartupDetailView } from './components/StartupDetailView';
// Common Views
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';
import { PaymentMethodsView } from './components/PaymentMethodsView';
import { KYCVerificationView } from './components/KYCVerificationView';
import { SecuritySettingsView } from './components/SecuritySettingsView';
import { HelpSupportView } from './components/HelpSupportView';
import { ReferralProgramView } from './components/ReferralProgramView';
import { LearnView } from './components/LearnView';
import { NotificationSettingsView } from './components/NotificationSettingsView';
// Trader Views
import { RoleSelectionView } from './components/RoleSelectionView';
import { TraderDashboardView } from './components/TraderDashboardView';
import { LoanApplicationView } from './components/LoanApplicationView';
import { EsusuView } from './components/EsusuView';
import { TraderSavingsView } from './components/TraderSavingsView';
import { CreateSavingsPlanView } from './components/CreateSavingsPlanView';
import { SavingsPlanDetailView } from './components/SavingsPlanDetailView';
import { LoanDetailView } from './components/LoanDetailView';
// Spine Views
import { SpineDashboardView } from './components/SpineDashboardView';
import { SpineShopSetupView } from './components/SpineShopSetupView';
import { SpineInventoryView } from './components/SpineInventoryView';
import { SpineProductDetailView } from './components/SpineProductDetailView';
import { SpineAddProductView } from './components/SpineAddProductView';
import { SpinePOSView } from './components/SpinePOSView';
import { SpineSalesHistoryView } from './components/SpineSalesHistoryView';
import { SpineSaleDetailView } from './components/SpineSaleDetailView';
import { SpineCalculatorView } from './components/SpineCalculatorView';
import { SpineGrowthView } from './components/SpineGrowthView';
import { SpineActivitiesView } from './components/SpineActivitiesView';
import { SpineManagementView } from './components/SpineManagementView';
import { SpineAuthView } from './components/SpineAuthView';
import { SpineStockTransferView } from './components/SpineStockTransferView';
import { SpineDebtCenterView } from './components/SpineDebtCenterView';
import { SpineAdjustStockView } from './components/SpineAdjustStockView';
import { SpineAddStockView } from './components/SpineAddStockView';
import { SpineSlashOrdersView } from './components/SpineSlashOrdersView';
import { SpineCamerasView } from './components/SpineCamerasView';
// Agent Views
import { AgentDashboardView } from './components/AgentDashboardView';
import { AgentTraderManagementView } from './components/AgentTraderManagementView';
import { AgentFieldReportView } from './components/AgentFieldReportView';
import { AgentDailyCollectionsView } from './components/AgentDailyCollectionsView';
import { AgentAssistedSessionView } from './components/AgentAssistedSessionView';
// TaxDesk Views
import { TaxProfileView } from './components/TaxProfileView';
import { TaxDashboardView } from './components/TaxDashboardView';
import { TaxFilingView } from './components/TaxFilingView';
import { TaxAdminView } from './components/TaxAdminView';

import { ViewType, UserProfile, UserRole, TraderProfile, AgentProfile, SpineProduct, SpineSale, SpineActivity, SpineSaleItem, SpineUser, SpineCustomer, OfferingTab, Investment, ActivityItem, ManagedTrader, SpineBatch, SpineOutlet } from './types';
import { Icon } from './components/Icon';
import { PROFILE_FRESH, PROFILE_STARTER, PROFILE_EXPERT, PROFILE_TRADER_NEW, PROFILE_TRADER_ACTIVE, PROFILE_AGENT, SPINE_PRODUCTS_MOCK, SPINE_SALES_MOCK, SPINE_ACTIVITIES_MOCK, SPINE_OUTLETS_MOCK, SPINE_USERS_MOCK, REAL_ESTATE, STOCKS_BONDS, STARTUPS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [viewHistory, setViewHistory] = useState<ViewType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Auth & Role State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  // Feature Toggles State
  const [isSpineEnabled, setIsSpineEnabled] = useState(true);
  const [isInvestorSlashEnabled, setIsInvestorSlashEnabled] = useState(false);
  const [activeSpineUser, setActiveSpineUser] = useState<SpineUser | null>(null);
  
  // Selection State
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedRealEstateId, setSelectedRealEstateId] = useState<string | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  const [posMode, setPosMode] = useState<'normal' | 'checkout'>('normal');
  const [pushedItems, setPushedItems] = useState<SpineSaleItem[] | null>(null);
  const [activeAssistedTrader, setActiveAssistedTrader] = useState<ManagedTrader | null>(null);

  // Persistent Explore Tab
  const [activeExploreTab, setActiveExploreTab] = useState<OfferingTab>('clusters');

  // Spine Specific Multi-User/Outlet State
  const [activeOutletId, setActiveOutletId] = useState<string>('o1');

  // User State - Simulating Data Context
  const [userProfile, setUserProfile] = useState<UserProfile>(PROFILE_EXPERT);
  const [traderProfile, setTraderProfile] = useState<TraderProfile>(PROFILE_TRADER_ACTIVE);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(PROFILE_AGENT);

  // Spine Module State
  const [spineProducts, setSpineProducts] = useState<SpineProduct[]>(SPINE_PRODUCTS_MOCK);
  const [spineSales, setSpineSales] = useState<SpineSale[]>(SPINE_SALES_MOCK);
  const [spineActivities, setSpineActivities] = useState<SpineActivity[]>(SPINE_ACTIVITIES_MOCK);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateTo = (view: ViewType, id?: string, clearHistory: boolean = false) => {
    if (clearHistory) {
      setViewHistory([]);
    } else {
      if (view !== currentView) {
        setViewHistory(prev => [...prev, currentView]);
      }
    }
    
    setCurrentView(view);
    
    // Selection logic
    if (view === ViewType.INVESTMENT_DETAIL && id) {
        setSelectedInvestmentId(id);
    }
    if (view === ViewType.REAL_ESTATE_DETAIL && id) {
        setSelectedRealEstateId(id);
    }
    if (view === ViewType.STOCK_DETAIL && id) {
        setSelectedStockId(id);
    }
    if (view === ViewType.STARTUP_DETAIL && id) {
        setSelectedStartupId(id);
    }
    if (view === ViewType.TRANSACTION_DETAIL && id) {
        setSelectedTransactionId(id);
    }
    if ((view === ViewType.TRADER_SAVINGS_PLAN_DETAIL || view === ViewType.INVESTOR_SAVINGS_DETAIL) && id) {
        setSelectedPlanId(id);
    }
    if (view === ViewType.SPINE_PRODUCT_DETAIL && id) {
        setSelectedProductId(id);
    }
    if (view === ViewType.SPINE_SALE_DETAIL && id) {
        setSelectedSaleId(id);
    }
    if (view === ViewType.SPINE_ADD_PRODUCT && id) {
        setSelectedProductId(id);
    }
    if (view === ViewType.SPINE_STOCK_TRANSFER && id) {
        setSelectedProductId(id);
    }
    if (view === ViewType.SPINE_ADJUST_STOCK && id) {
        setSelectedProductId(id);
    }
    if (view === ViewType.SPINE_ADD_STOCK && id) {
        setSelectedProductId(id);
    }
    if (view === ViewType.SPINE_POS) {
        setPosMode(id === 'checkout' ? 'checkout' : 'normal');
    } else {
        if (view !== ViewType.SPINE_CALCULATOR) {
            setPushedItems(null);
            setPosMode('normal');
        }
    }
  };

  const handleBack = () => {
    if (viewHistory.length > 0) {
      const prevView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentView(prevView);
    } else {
      setCurrentView(ViewType.DASHBOARD);
    }
  };

  const handleAddInvestment = (investment: Investment, pMethod: 'wallet' | 'card') => {
    const newTx: ActivityItem = {
        id: `tx-${Date.now()}`,
        type: 'investment',
        title: `Investment: ${investment.name}`,
        description: `Source: ${pMethod === 'wallet' ? 'Mix Wallet' : 'Linked Card'}`,
        amount: -investment.investedAmount,
        date: 'Just now',
        status: 'completed'
    };

    setUserProfile(prev => {
        const existingIndex = prev.investments.findIndex(i => i.name === investment.name && i.category === investment.category);
        let updatedInvestments;
        if (existingIndex > -1) {
            const existing = prev.investments[existingIndex];
            const historyItem: any = {
                date: 'Just now',
                amount: investment.investedAmount,
                equityOwned: investment.equityOwned,
                units: investment.units,
                method: pMethod
            };
            const merged: Investment = {
                ...existing,
                investedAmount: existing.investedAmount + investment.investedAmount,
                equityOwned: (existing.equityOwned || 0) + (investment.equityOwned || 0),
                units: (existing.units || 0) + (investment.units || 0),
                history: [...(existing.history || []), historyItem]
            };
            updatedInvestments = [...prev.investments];
            updatedInvestments[existingIndex] = merged;
        } else {
            const firstHistory: any = {
                date: investment.startDate || 'Initial',
                amount: investment.investedAmount,
                equityOwned: investment.equityOwned,
                units: investment.units,
                method: pMethod
            };
            updatedInvestments = [{ ...investment, history: [firstHistory] }, ...prev.investments];
        }
        return {
            ...prev,
            investments: updatedInvestments,
            activities: [newTx, ...prev.activities],
            activeInvestmentsCount: existingIndex > -1 ? prev.activeInvestmentsCount : prev.activeInvestmentsCount + 1,
            totalInvested: prev.totalInvested + investment.investedAmount,
            walletBalance: pMethod === 'wallet' ? prev.walletBalance - investment.investedAmount : prev.walletBalance
        };
    });
  };

  const handleSlashPurchase = (total: number, itemsCount: number, pMethod: 'wallet' | 'card') => {
    const newTx: ActivityItem = {
        id: `tx-sp-${Date.now()}`,
        type: 'purchase',
        title: `Slash Purchase`,
        description: `${itemsCount} item(s) • via ${pMethod}`,
        amount: -total,
        date: 'Just now',
        status: 'completed'
    };
    setUserProfile(prev => ({
        ...prev,
        activities: [newTx, ...prev.activities],
        walletBalance: pMethod === 'wallet' ? prev.walletBalance - total : prev.walletBalance
    }));
  };

  const addSpineActivity = (action: SpineActivity['action'], details: string, severity: SpineActivity['severity'] = 'info', performerOverride?: string) => {
    const newActivity: SpineActivity = {
        id: `sa-${Date.now()}`,
        action,
        details,
        severity,
        performer: performerOverride || activeSpineUser?.name || 'Owner',
        timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        outletId: activeOutletId
    };
    setSpineActivities([newActivity, ...spineActivities]);
  };

  const handleRecordSpineSale = (sale: SpineSale) => {
    const timestamp = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const enrichedSale: SpineSale = { 
        ...sale, 
        timestamp,
        outletId: activeOutletId, 
        recordedByUserId: activeSpineUser?.id || 'u1' 
    };
    setSpineSales([enrichedSale, ...spineSales]);
    const activityMsg = sale.paymentMethod === 'debt' 
        ? `New Credit Sale recorded for ₦${sale.totalAmount.toLocaleString()}`
        : `New sale recorded for ₦${sale.totalAmount.toLocaleString()}`;
    addSpineActivity('sale_recorded', activityMsg, sale.paymentMethod === 'debt' ? 'warning' : 'info');
    setSpineProducts(prev => prev.map(p => {
        const saleItem = sale.items.find(i => i.productId === p.id);
        if (saleItem) {
            const nextBalances = p.stockBalances.map(bal => {
                if (bal.outletId === activeOutletId) {
                    return { 
                        ...bal, 
                        pieceQuantity: Math.max(0, bal.pieceQuantity - saleItem.quantity) 
                    };
                }
                return bal;
            });
            return { ...p, stockBalances: nextBalances };
        }
        return p;
    }));
    if (sale.paymentMethod === 'debt' && sale.customerId) {
        setTraderProfile(prev => {
            if (!prev.spineShop) return prev;
            const nextShop = {
                ...prev.spineShop,
                customers: prev.spineShop.customers.map(c => 
                    c.id === sale.customerId ? { ...c, totalOwed: c.totalOwed + sale.totalAmount } : c
                )
            };
            return { ...prev, spineShop: nextShop };
        });
    }
    handleBack();
  };

  const handleSpineRepayment = (customerId: string, amount: number, method: string) => {
    setTraderProfile(prev => {
        if (!prev.spineShop) return prev;
        return {
            ...prev,
            spineShop: {
                ...prev.spineShop,
                customers: prev.spineShop.customers.map(c => 
                    c.id === customerId ? { ...c, totalOwed: Math.max(0, c.totalOwed - amount) } : c
                )
            }
        };
    });
    setSpineSales(prev => {
        let remainingRepayment = amount;
        return prev.map(sale => {
            if (sale.customerId === customerId && sale.paymentMethod === 'debt' && sale.balanceDue > 0 && remainingRepayment > 0) {
                const deduction = Math.min(sale.balanceDue, remainingRepayment);
                remainingRepayment -= deduction;
                return { ...sale, amountPaid: sale.amountPaid + deduction, balanceDue: sale.balanceDue - deduction };
            }
            return sale;
        });
    });
    const customer = traderProfile.spineShop?.customers.find(c => c.id === customerId);
    const customerName = customer?.name || 'Customer';
    addSpineActivity('debt_repayment', `Received ₦${amount.toLocaleString()} from ${customerName} via ${method}`, 'info');
  };

  const handleAddSpineCustomer = (name: string, phone: string) => {
    const newCustomer: SpineCustomer = { id: `c-${Date.now()}`, name, phone, totalOwed: 0 };
    setTraderProfile(prev => {
        if (!prev.spineShop) return prev;
        return { ...prev, spineShop: { ...prev.spineShop, customers: [...prev.spineShop.customers, newCustomer] } };
    });
    addSpineActivity('shop_settings_update', `Registered new customer: ${name}`, 'info');
    return newCustomer.id;
  };

  const handleVoidSpineSale = (saleId: string) => {
    const sale = spineSales.find(s => s.id === saleId);
    if (!sale) return;
    setSpineSales(prev => prev.filter(s => s.id !== saleId));
    addSpineActivity('sale_voided', `Voided sale of ₦${sale.totalAmount.toLocaleString()}`, 'alert');
    setSpineProducts(prev => prev.map(p => {
        const saleItem = sale.items.find(i => i.productId === p.id);
        if (saleItem) {
            const nextBalances = p.stockBalances.map(bal => {
                if (bal.outletId === sale.outletId) { return { ...bal, pieceQuantity: bal.pieceQuantity + saleItem.quantity }; }
                return bal;
            });
            return { ...p, stockBalances: nextBalances };
        }
        return p;
    }));
    handleBack();
  };

  const handleSaveSpineProduct = (product: SpineProduct) => {
    const existingIndex = spineProducts.findIndex(p => p.id === product.id);
    if (existingIndex > -1) {
        setSpineProducts(prev => {
            const next = [...prev];
            next[existingIndex] = product;
            return next;
        });
        addSpineActivity('stock_update', `Updated details/stock for ${product.name}`);
    } else {
        setSpineProducts([product, ...spineProducts]);
        addSpineActivity('product_added', `New product added: ${product.name}`);
    }
    handleBack();
  };

  const handleSpineStockTransfer = (productId: string, fromOutletId: string, toOutletId: string, bulkQty: number, pieceQty: number) => {
      setSpineProducts(prev => prev.map(p => {
          if (p.id === productId) {
              const nextBalances = p.stockBalances.map(bal => {
                  if (bal.outletId === fromOutletId) {
                      return { ...bal, bulkQuantity: Math.max(0, bal.bulkQuantity - bulkQty), pieceQuantity: Math.max(0, bal.pieceQuantity - pieceQty) };
                  }
                  if (bal.outletId === toOutletId) {
                      return { ...bal, bulkQuantity: bal.bulkQuantity + bulkQty, pieceQuantity: bal.pieceQuantity + pieceQty };
                  }
                  return bal;
              });
              return { ...p, stockBalances: nextBalances };
          }
          return p;
      }));
      const fromName = SPINE_OUTLETS_MOCK.find(o => o.id === fromOutletId)?.name;
      const toName = SPINE_OUTLETS_MOCK.find(o => o.id === toOutletId)?.name;
      const product = spineProducts.find(p => p.id === productId);
      addSpineActivity('stock_transfer', `Moved ${bulkQty > 0 ? `${bulkQty} ${product?.bulkUnitName}s ` : ''}${pieceQty > 0 ? `${pieceQty} ${product?.pieceUnitName}s` : ''} from ${fromName} to ${toName}`, 'info');
  };

  const handleSpineStockAdjustment = (productId: string, outletId: string, type: 'damage' | 'loss' | 'return' | 'expired', bulkQty: number, pieceQty: number) => {
      setSpineProducts(prev => prev.map(p => {
          if (p.id === productId) {
              const nextBalances = p.stockBalances.map(bal => {
                  if (bal.outletId === outletId) {
                      return { ...bal, bulkQuantity: Math.max(0, bal.bulkQuantity - bulkQty), pieceQuantity: Math.max(0, bal.pieceQuantity - pieceQty) };
                  }
                  return bal;
              });
              let remainingBulkToDeduct = bulkQty;
              let remainingPieceToDeduct = pieceQty;
              const sortedBatches = [...(p.batches || [])].sort((a, b) => {
                  if (!a.expiryDate) return 1;
                  if (!b.expiryDate) return -1;
                  return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
              });
              const nextBatches = sortedBatches.map(batch => {
                  if (batch.outletId !== outletId) return batch;
                  let nextBatch = { ...batch };
                  if (remainingBulkToDeduct > 0 && nextBatch.bulkQuantity > 0) {
                      const deduct = Math.min(nextBatch.bulkQuantity, remainingBulkToDeduct);
                      nextBatch.bulkQuantity -= deduct;
                      remainingBulkToDeduct -= deduct;
                  }
                  if (remainingPieceToDeduct > 0 && nextBatch.pieceQuantity > 0) {
                      const deduct = Math.min(nextBatch.pieceQuantity, remainingPieceToDeduct);
                      nextBatch.pieceQuantity -= deduct;
                      remainingPieceToDeduct -= deduct;
                  }
                  return nextBatch;
              });
              return { ...p, stockBalances: nextBalances, batches: nextBatches, bulkQuantity: Math.max(0, p.bulkQuantity - bulkQty), pieceQuantity: Math.max(0, p.pieceQuantity - pieceQty) };
          }
          return p;
      }));
      const outletName = SPINE_OUTLETS_MOCK.find(o => o.id === outletId)?.name;
      const product = spineProducts.find(p => p.id === productId);
      addSpineActivity('stock_adjustment', `Adjusted stock for ${product?.name} at ${outletName} due to ${type}: -${bulkQty} bulk, -${pieceQty} pieces`, type === 'expired' ? 'alert' : 'warning');
      handleBack();
  };

  const handleSpineAddStock = (productId: string, outletId: string, bulkQty: number, pieceQty: number, costPrice: number, expiryDate: string) => {
    setSpineProducts(prev => prev.map(p => {
        if (p.id === productId) {
            const newBatch: SpineBatch = {
                id: `batch-${Date.now()}`,
                expiryDate,
                bulkQuantity: bulkQty,
                pieceQuantity: pieceQty,
                addedAt: new Date().toISOString(),
                outletId
            };
            
            const updatedBalances = [...p.stockBalances];
            const bIndex = updatedBalances.findIndex(b => b.outletId === outletId);
            if (bIndex >= 0) {
                updatedBalances[bIndex] = {
                    ...updatedBalances[bIndex],
                    bulkQuantity: updatedBalances[bIndex].bulkQuantity + bulkQty,
                    pieceQuantity: updatedBalances[bIndex].pieceQuantity + pieceQty
                };
            } else {
                updatedBalances.push({ outletId, bulkQuantity: bulkQty, pieceQuantity: pieceQty });
            }

            return {
                ...p,
                bulkQuantity: p.bulkQuantity + bulkQty,
                pieceQuantity: p.pieceQuantity + pieceQty,
                stockBalances: updatedBalances,
                batches: [...(p.batches || []), newBatch],
                costPricePerPiece: costPrice > 0 ? (costPrice / p.unitsPerBulk) : p.costPricePerPiece
            };
        }
        return p;
    }));

    const prod = spineProducts.find(p => p.id === productId);
    const outletName = SPINE_OUTLETS_MOCK.find(o => o.id === outletId)?.name;
    addSpineActivity('stock_update', `Restocked ${bulkQty} bulk & ${pieceQty} pieces of ${prod?.name || 'item'} at ${outletName}`, 'info');
    handleBack();
  };

  const handleToggleSpine = () => {
    const newState = !isSpineEnabled;
    setIsSpineEnabled(newState);
    if (!newState) {
        setActiveSpineUser(null);
        if (currentView.toString().startsWith('Spine')) {
            navigateTo(ViewType.DASHBOARD, undefined, true);
        }
    }
  };

  const handleToggleInvestorSlash = () => {
    const newState = !isInvestorSlashEnabled;
    setIsInvestorSlashEnabled(newState);
    if (!newState && currentView === ViewType.INVESTOR_SLASH_SHOP) {
        navigateTo(ViewType.DASHBOARD, undefined, true);
    }
  };

  const handleSpineAuthSuccess = (user: SpineUser) => {
      setActiveSpineUser(user);
      addSpineActivity('shop_settings_update', `Logged in to Spine as ${user.role}`, 'info', user.name);
  };

  const toggleSlashStorefront = () => {
    if (!traderProfile.spineShop) return;
    const nextStatus = !traderProfile.spineShop.isPublicOnSlash;
    setTraderProfile({
        ...traderProfile,
        spineShop: { ...traderProfile.spineShop, isPublicOnSlash: nextStatus }
    });
    addSpineActivity('shop_settings_update', nextStatus ? 'Activated Slash E-commerce Storefront' : 'Disabled Slash Storefront', 'info');
  };

  const simulateProfile = (type: 'fresh' | 'starter' | 'expert') => {
      setActiveSpineUser(null);
      
      switch(type) {
          case 'fresh': 
              setUserProfile(PROFILE_FRESH); 
              setTraderProfile(PROFILE_TRADER_NEW);
              setSpineProducts([]);
              setSpineSales([]);
              setSpineActivities([]);
              break;
          case 'starter': 
              setUserProfile(PROFILE_STARTER); 
              setTraderProfile(PROFILE_TRADER_NEW);
              setSpineProducts(SPINE_PRODUCTS_MOCK.slice(0, 3));
              setSpineSales(SPINE_SALES_MOCK.slice(0, 5));
              setSpineActivities(SPINE_ACTIVITIES_MOCK.slice(0, 2));
              break;
          case 'expert': 
              setUserProfile(PROFILE_EXPERT); 
              setTraderProfile(PROFILE_TRADER_ACTIVE);
              setSpineProducts(SPINE_PRODUCTS_MOCK);
              setSpineSales(SPINE_SALES_MOCK);
              setSpineActivities(SPINE_ACTIVITIES_MOCK);
              break;
      }
      navigateTo(ViewType.DASHBOARD, undefined, true);
  };

  if (!userRole) {
      return <RoleSelectionView onSelectRole={setUserRole} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="relative w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden transition-colors duration-300">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full size-10 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            <Icon name={isDarkMode ? "light_mode" : "dark_mode"} className="text-xl" />
          </button>
        </div>
        {authView === 'login' ? (
          <LoginView onLogin={() => setIsAuthenticated(true)} onNavigateToSignup={() => setAuthView('signup')} role={userRole} onChangeRole={() => setUserRole(null)} />
        ) : (
          <SignupView onSignup={() => setIsAuthenticated(true)} onNavigateToLogin={() => setAuthView('login')} role={userRole} />
        )}
      </div>
    );
  }

  const renderContent = () => {
    if (userRole === 'investor') {
        switch (currentView) {
            case ViewType.DASHBOARD: return <DashboardView onNavigate={navigateTo} userProfile={userProfile} />;
            case ViewType.EXPLORE: return <ExploreView onNavigate={navigateTo} initialTab={activeExploreTab} onTabChange={setActiveExploreTab} onAddInvestment={handleAddInvestment} userBalance={userProfile.walletBalance} />;
            case ViewType.ACTIVITY: return <ActivityView onNavigate={navigateTo} />; 
            case ViewType.PROFILE: return (
                <ProfileView 
                    onLogout={() => { setIsAuthenticated(false); setUserRole(null); }} 
                    onNavigate={navigateTo} 
                    userProfile={userProfile} 
                    onSimulateProfile={simulateProfile}
                    isSlashEnabled={isInvestorSlashEnabled}
                    onToggleSlash={handleToggleInvestorSlash}
                />
            );
            case ViewType.ANALYTICS: return <PortfolioAnalyticsView onBack={handleBack} userProfile={userProfile} />;
            case ViewType.AUTO_INVEST: return <AutoInvestView onBack={handleBack} />;
            case ViewType.SECONDARY_MARKET: return <SecondaryMarketView onBack={handleBack} userTier={userProfile.tier} />;
            case ViewType.TIERS: return <TiersView onBack={handleBack} currentTier={userProfile.tier} totalInvested={userProfile.totalInvested} />;
            case ViewType.IMPACT: return <ImpactProfileView onBack={handleBack} />;
            case ViewType.INVESTMENT_DETAIL:
                const inv = userProfile.investments.find(i => i.id === selectedInvestmentId);
                return inv ? <ActiveInvestmentDetailView investment={inv} onBack={handleBack} /> : <DashboardView onNavigate={navigateTo} userProfile={userProfile} />;
            case ViewType.REAL_ESTATE_DETAIL:
                const property = REAL_ESTATE.find(r => r.id === selectedRealEstateId);
                if (!property) { handleBack(); return null; }
                return <RealEstateDetailView property={property} onBack={handleBack} onAddInvestment={handleAddInvestment} userBalance={userProfile.walletBalance} />;
            case ViewType.STOCK_DETAIL:
                const stock = STOCKS_BONDS.find(s => s.id === selectedStockId);
                if (!stock) { handleBack(); return null; }
                return <StockDetailView stock={stock} onBack={handleBack} onAddInvestment={handleAddInvestment} userBalance={userProfile.walletBalance} />;
            case ViewType.STARTUP_DETAIL:
                const startup = STARTUPS.find(s => s.id === selectedStartupId);
                if (!startup) { handleBack(); return null; }
                return <StartupDetailView startup={startup} onBack={handleBack} onAddInvestment={handleAddInvestment} userBalance={userProfile.walletBalance} />;
            case ViewType.INVESTOR_SAVINGS: return <InvestorSavingsView onNavigate={navigateTo} userProfile={userProfile} />;
            case ViewType.INVESTOR_SAVINGS_CREATE: return <CreateSavingsPlanView onBack={handleBack} />;
            case ViewType.INVESTOR_SAVINGS_DETAIL:
                const plan = userProfile.savingsPlans.find(p => p.id === selectedPlanId);
                return plan ? <SavingsPlanDetailView plan={plan} onBack={handleBack} /> : <InvestorSavingsView onNavigate={navigateTo} userProfile={userProfile} />;
            case ViewType.SAVINGS_STREAK_DETAIL: return <SavingsStreakDetailView onBack={handleBack} />;
            case ViewType.INVESTOR_SLASH_SHOP:
                return <InvestorSlashShopView products={spineProducts} userProfile={userProfile} onBack={handleBack} onPurchase={handleSlashPurchase} />;
        }
    } 
    else if (userRole === 'trader') {
        const isSpineView = currentView.toString().startsWith('Spine');
        
        if (isSpineView && isSpineEnabled && (!activeSpineUser || !traderProfile.spineShop)) {
            if (!traderProfile.spineShop) {
                return <SpineShopSetupView onComplete={() => {
                    setTraderProfile({...traderProfile, spineShop: { id: 'ks1', traderId: traderProfile.id, category: 'General', mainItems: [], language: 'English', currency: 'NGN', outlets: SPINE_OUTLETS_MOCK, users: SPINE_USERS_MOCK, customers: [] }});
                }} />;
            }
            return <SpineAuthView users={traderProfile.spineShop.users} onAuthSuccess={handleSpineAuthSuccess} onBack={() => navigateTo(ViewType.DASHBOARD)} />;
        }

        switch (currentView) {
            case ViewType.DASHBOARD: return <TraderDashboardView onNavigate={navigateTo} traderProfile={traderProfile} />;
            case ViewType.SPINE_DASHBOARD:
                if (!traderProfile.spineShop) { handleBack(); return null; }
                return <SpineDashboardView 
                            onNavigate={navigateTo} 
                            products={spineProducts} 
                            sales={spineSales} 
                            shop={traderProfile.spineShop} 
                            activeOutletId={activeOutletId} 
                            onSwitchOutlet={setActiveOutletId} 
                        />;
            case ViewType.SPINE_INVENTORY: return <SpineInventoryView onBack={handleBack} onNavigate={navigateTo} products={spineProducts} />;
            case ViewType.SPINE_PRODUCT_DETAIL:
                const prod = spineProducts.find(p => p.id === selectedProductId);
                if (!prod) { handleBack(); return null; }
                return <SpineProductDetailView product={prod} onBack={handleBack} onNavigate={navigateTo} />;
            case ViewType.SPINE_ADD_PRODUCT:
                const existingProd = spineProducts.find(p => p.id === selectedProductId);
                return <SpineAddProductView onBack={handleBack} existingProduct={existingProd} onSave={handleSaveSpineProduct} products={spineProducts} />;
            case ViewType.SPINE_POS:
                return <SpinePOSView products={spineProducts} customers={traderProfile.spineShop?.customers || []} onBack={handleBack} onNavigate={navigateTo} onRecordSale={handleRecordSpineSale} onAddCustomer={handleAddSpineCustomer} startAtCheckout={posMode === 'checkout'} initialCart={pushedItems || []} />;
            case ViewType.SPINE_SALES_HISTORY: 
                if (!traderProfile.spineShop) { handleBack(); return null; }
                return <SpineSalesHistoryView sales={spineSales} shop={traderProfile.spineShop} onBack={handleBack} onNavigate={navigateTo} />;
            case ViewType.SPINE_SALE_DETAIL:
                const sale = spineSales.find(s => s.id === selectedSaleId);
                if (!sale || !traderProfile.spineShop) { handleBack(); return null; }
                return <SpineSaleDetailView sale={sale} shop={traderProfile.spineShop} onBack={handleBack} onVoid={handleVoidSpineSale} />;
            case ViewType.SPINE_CALCULATOR: 
                return <SpineCalculatorView 
                            products={spineProducts} 
                            onBack={handleBack} 
                            onNavigate={navigateTo} 
                            onPushToSale={(items) => {
                                const mapped: SpineSaleItem[] = items.map(i => ({
                                    productId: i.isInventory ? i.id.split('-')[1] : i.id,
                                    productName: i.name,
                                    quantity: i.quantity,
                                    priceAtSale: i.amount,
                                    unitType: 'piece'
                                }));
                                setPushedItems(mapped);
                                navigateTo(ViewType.SPINE_POS, 'checkout');
                            }}
                        />;
            case ViewType.SPINE_GROWTH: 
                if (!traderProfile.spineShop) { handleBack(); return null; }
                return <SpineGrowthView 
                            products={spineProducts} 
                            sales={spineSales} 
                            shop={traderProfile.spineShop}
                            onBack={handleBack} 
                            onNavigate={navigateTo} 
                            onToggleSlash={toggleSlashStorefront}
                        />;
            case ViewType.SPINE_ACTIVITIES: return <SpineActivitiesView activities={spineActivities} onBack={handleBack} />;
            case ViewType.SPINE_MANAGEMENT: 
                if (!traderProfile.spineShop) { handleBack(); return null; }
                return <SpineManagementView shop={traderProfile.spineShop} onBack={handleBack} />;
            case ViewType.SPINE_STOCK_TRANSFER:
                const transferProd = spineProducts.find(p => p.id === selectedProductId);
                if (!transferProd || !traderProfile.spineShop) { handleBack(); return null; }
                return <SpineStockTransferView product={transferProd} outlets={traderProfile.spineShop.outlets} onBack={handleBack} onTransfer={handleSpineStockTransfer} />;
            case ViewType.SPINE_DEBT_CENTER:
                if (!traderProfile.spineShop) { handleBack(); return null; }
                return <SpineDebtCenterView shop={traderProfile.spineShop} sales={spineSales} onBack={handleBack} onRepayment={handleSpineRepayment} onAddCustomer={handleAddSpineCustomer} />;
            case ViewType.SPINE_ADJUST_STOCK:
                const adjustProd = spineProducts.find(p => p.id === selectedProductId);
                if (!adjustProd || !traderProfile.spineShop) { handleBack(); return null; }
                return <SpineAdjustStockView product={adjustProd} outlets={traderProfile.spineShop.outlets} onBack={handleBack} onAdjust={handleSpineStockAdjustment} />;
            case ViewType.SPINE_ADD_STOCK:
                if (!traderProfile.spineShop) { handleBack(); return null; }
                return <SpineAddStockView 
                            products={spineProducts} 
                            outlets={traderProfile.spineShop.outlets} 
                            onBack={handleBack} 
                            onAddStock={handleSpineAddStock} 
                            initialProductId={selectedProductId}
                        />;
            case ViewType.SPINE_SLASH_ORDERS:
                return <SpineSlashOrdersView onBack={handleBack} onNavigate={navigateTo} products={spineProducts} />;
            case ViewType.SPINE_CAMERAS:
                return <SpineCamerasView onBack={handleBack} shopName={traderProfile.businessName} />;
            case ViewType.ACTIVITY: return <ActivityView onNavigate={navigateTo} role="trader" />;
            case ViewType.TRADER_LOAN_APPLY: return <LoanApplicationView onBack={handleBack} />;
            case ViewType.TRADER_LOAN_DETAIL:
                return traderProfile.activeLoan ? <LoanDetailView loan={traderProfile.activeLoan} onBack={handleBack} /> : <TraderDashboardView onNavigate={navigateTo} traderProfile={traderProfile} />;
            case ViewType.TRADER_ESUSU: return <EsusuView onBack={handleBack} />;
            case ViewType.TRADER_SAVINGS: return <TraderSavingsView onNavigate={navigateTo} traderProfile={traderProfile} />;
            case ViewType.TRADER_SAVINGS_CREATE: return <CreateSavingsPlanView onBack={handleBack} />;
            case ViewType.TRADER_SAVINGS_PLAN_DETAIL:
                const plan = traderProfile.savingsPlans.find(p => p.id === selectedPlanId);
                return plan ? <SavingsPlanDetailView plan={plan} onBack={handleBack} /> : <TraderSavingsView onNavigate={navigateTo} traderProfile={traderProfile} />;
            case ViewType.SAVINGS_STREAK_DETAIL: return <SavingsStreakDetailView onBack={handleBack} />;
            case ViewType.PROFILE:
                const mappedProfile: UserProfile = { ...userProfile, name: traderProfile.name, email: traderProfile.email, walletBalance: traderProfile.walletBalance, tier: 'Trader', taxProfile: traderProfile.taxProfile };
                return (
                  <ProfileView 
                    onLogout={() => { setIsAuthenticated(false); setUserRole(null); }} 
                    onNavigate={navigateTo} 
                    userProfile={mappedProfile} 
                    onSimulateProfile={simulateProfile} 
                    assignedAgent={traderProfile.assignedAgent}
                    isSpineEnabled={isSpineEnabled}
                    onToggleSpine={handleToggleSpine}
                  />
                );
        }
    }
    else if (userRole === 'agent') {
        switch (currentView) {
            case ViewType.DASHBOARD: return <AgentDashboardView onNavigate={navigateTo} agentProfile={agentProfile} />;
            case ViewType.AGENT_TRADERS: return <AgentTraderManagementView onBack={() => navigateTo(ViewType.DASHBOARD)} agentProfile={agentProfile} />;
            case ViewType.AGENT_REPORTS: return <AgentFieldReportView onBack={() => navigateTo(ViewType.DASHBOARD)} />;
            case ViewType.AGENT_DAILY_COLLECTIONS: return <AgentDailyCollectionsView onBack={() => navigateTo(ViewType.DASHBOARD)} agentProfile={agentProfile} />;
            case ViewType.AGENT_WALLET: return <ActivityView onNavigate={navigateTo} activities={agentProfile.activities} role="agent" />;
            case ViewType.ACTIVITY: return <ActivityView onNavigate={navigateTo} activities={agentProfile.activities} role="agent" />;
            case ViewType.PROFILE:
                const mappedProfile = { ...userProfile, name: agentProfile.name, email: agentProfile.email, walletBalance: agentProfile.walletBalance, tier: 'Agent' };
                return <ProfileView onLogout={() => { setIsAuthenticated(false); setUserRole(null); }} onNavigate={navigateTo} userProfile={mappedProfile as any} onSimulateProfile={simulateProfile} />;
        }
    }

    switch(currentView) {
        case ViewType.PAYMENT_METHODS: return <PaymentMethodsView onBack={handleBack} />;
        case ViewType.KYC: return <KYCVerificationView onBack={handleBack} />;
        case ViewType.SECURITY: return <SecuritySettingsView onBack={handleBack} />;
        case ViewType.NOTIFICATIONS_SETTINGS: return <NotificationSettingsView onBack={handleBack} />;
        case ViewType.HELP: return <HelpSupportView onBack={handleBack} />;
        case ViewType.REFERRAL: return <ReferralProgramView onBack={handleBack} />;
        case ViewType.LEARN: return <LearnView onBack={handleBack} />;
        case ViewType.TRANSACTION_DETAIL:
            const activity = userProfile.activities.find(t => t.id === selectedTransactionId) || 
                             traderProfile.activities.find(t => t.id === selectedTransactionId) || 
                             agentProfile.activities.find(t => t.id === selectedTransactionId);
            return activity ? (
                <TransactionDetailView transaction={activity} onBack={handleBack} />
            ) : (
                <ActivityView onNavigate={navigateTo} />
            );
        case ViewType.TAX_PROFILE: return <TaxProfileView onBack={handleBack} onNavigate={navigateTo} />;
        case ViewType.TAX_DASHBOARD: return <TaxDashboardView onBack={handleBack} onNavigate={navigateTo} />;
        case ViewType.TAX_FILING: return <TaxFilingView onBack={handleBack} onNavigate={navigateTo} />;
        case ViewType.TAX_ADMIN: return <TaxAdminView onBack={handleBack} />;
        default:
             if (userRole === 'agent') return <AgentDashboardView onNavigate={navigateTo} agentProfile={agentProfile} />;
             if (userRole === 'trader') return <TraderDashboardView onNavigate={navigateTo} traderProfile={traderProfile} />;
             return <DashboardView onNavigate={navigateTo} userProfile={userProfile} />;
    }
  };

  const fullScreenViews = [
    ViewType.ANALYTICS, ViewType.PAYMENT_METHODS, ViewType.KYC, ViewType.SECURITY, ViewType.NOTIFICATIONS_SETTINGS,
    ViewType.HELP, ViewType.REFERRAL, ViewType.LEARN, ViewType.INVESTMENT_DETAIL, ViewType.AUTO_INVEST,
    ViewType.TRANSACTION_DETAIL, ViewType.SECONDARY_MARKET, ViewType.TIERS, ViewType.IMPACT,
    ViewType.TRADER_LOAN_APPLY, ViewType.TRADER_LOAN_DETAIL, ViewType.TRADER_ESUSU, ViewType.TRADER_SAVINGS_CREATE,
    ViewType.TRADER_SAVINGS_PLAN_DETAIL, ViewType.INVESTOR_SAVINGS_CREATE, ViewType.INVESTOR_SAVINGS_DETAIL,
    ViewType.SAVINGS_STREAK_DETAIL, ViewType.SPINE_SETUP, ViewType.SPINE_ADD_PRODUCT, ViewType.SPINE_PRODUCT_DETAIL,
    ViewType.SPINE_POS, ViewType.SPINE_SALE_DETAIL, ViewType.SPINE_GROWTH, ViewType.SPINE_CALCULATOR, ViewType.SPINE_ACTIVITIES,
    ViewType.TAX_PROFILE, ViewType.TAX_DASHBOARD, ViewType.TAX_FILING, ViewType.TAX_ADMIN, ViewType.SPINE_MANAGEMENT,
    ViewType.SPINE_STOCK_TRANSFER, ViewType.SPINE_DEBT_CENTER, ViewType.SPINE_ADJUST_STOCK, ViewType.SPINE_ADD_STOCK,
    ViewType.SPINE_SLASH_ORDERS, ViewType.INVESTOR_SLASH_SHOP, ViewType.REAL_ESTATE_DETAIL, ViewType.STOCK_DETAIL, 
    ViewType.STARTUP_DETAIL, ViewType.SPINE_CAMERAS, ViewType.AGENT_DAILY_COLLECTIONS, ViewType.AGENT_ASSISTED_SESSION
  ];

  const showBottomNav = !fullScreenViews.includes(currentView);
  const showGlobalHeader = showBottomNav && currentView !== ViewType.AGENT_TRADERS;

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-full size-10 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Theme"
        >
          <Icon name={isDarkMode ? "light_mode" : "dark_mode"} className="text-xl" />
        </button>
      </div>
      {showGlobalHeader && <Header onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
      <main className={`flex-1 flex flex-col gap-6 px-4 ${showBottomNav ? 'pb-28' : 'pb-0'} pt-2`}>
        {renderContent()}
      </main>
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 pb-safe pt-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center h-14">
                <button
                    onClick={() => navigateTo(ViewType.DASHBOARD)}
                    className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.DASHBOARD ? 'text-primary' : 'text-slate-400'}`}
                >
                    <Icon name="home" className="text-[26px]" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                {userRole === 'trader' ? (
                    isSpineEnabled && (
                      <button
                          onClick={() => navigateTo(ViewType.SPINE_DASHBOARD)}
                          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView.toString().startsWith('Spine') ? 'text-primary' : 'text-slate-400'}`}
                      >
                          <Icon name="storefront" className="text-[26px]" />
                          <span className="text-[10px] font-medium">Spine</span>
                      </button>
                    )
                ) : userRole === 'investor' ? (
                     <button
                        onClick={() => navigateTo(ViewType.EXPLORE)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.EXPLORE ? 'text-primary' : 'text-slate-400'}`}
                    >
                        <Icon name="travel_explore" className="text-[26px]" />
                        <span className="text-[10px] font-medium">Explore</span>
                    </button>
                ) : (
                    <button
                        onClick={() => navigateTo(ViewType.AGENT_TRADERS)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.AGENT_TRADERS ? 'text-primary' : 'text-slate-400'}`}
                    >
                        <Icon name="groups" className="text-[26px]" />
                        <span className="text-[10px] font-medium">Traders</span>
                    </button>
                )}

                {userRole === 'trader' ? (
                    <button
                        onClick={() => navigateTo(ViewType.TRADER_SAVINGS)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.TRADER_SAVINGS ? 'text-primary' : 'text-slate-400'}`}
                    >
                        <Icon name="savings" className="text-[26px]" />
                        <span className="text-[10px] font-medium">Savings</span>
                    </button>
                ) : userRole === 'investor' ? (
                    <button
                        onClick={() => navigateTo(ViewType.INVESTOR_SAVINGS)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.INVESTOR_SAVINGS ? 'text-primary' : 'text-slate-400'}`}
                    >
                        <Icon name="savings" className="text-[26px]" />
                        <span className="text-[10px] font-medium">Savings</span>
                    </button>
                ) : (
                    <button
                        onClick={() => navigateTo(ViewType.AGENT_REPORTS)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.AGENT_REPORTS ? 'text-primary' : 'text-slate-400'}`}
                    >
                        <Icon name="assignment" className="text-[26px]" />
                        <span className="text-[10px] font-medium">Reports</span>
                    </button>
                )}

                {userRole === 'trader' ? (
                    <button
                        onClick={() => navigateTo(ViewType.TRADER_LOAN_APPLY)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.TRADER_LOAN_APPLY ? 'text-primary' : 'text-slate-400'}`}
                    >
                        <Icon name="request_quote" className="text-[26px]" />
                        <span className="text-[10px] font-medium">Loan</span>
                    </button>
                ) : (
                    <button
                        onClick={() => navigateTo(ViewType.ACTIVITY)}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.ACTIVITY ? 'text-primary' : 'text-slate-400'}`}
                >
                        <Icon name="history" className="text-[26px]" />
                        <span className="text-[10px] font-medium">Activity</span>
                    </button>
                )}

                <button
                    onClick={() => navigateTo(ViewType.PROFILE)}
                    className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${currentView === ViewType.PROFILE ? 'text-primary' : 'text-slate-400'}`}
                >
                    <Icon name="person" className="text-[26px]" />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </div>
            <div className="h-4 w-full" /> 
        </div>
      )}
    </div>
  );
};

export default App;
