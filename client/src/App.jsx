import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Home,
  MapPin,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  UserRound,
  Wallet,
  X,
} from 'lucide-react'
import './App.css'

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Shop', icon: Store },
  { label: 'EMI Dues', icon: ReceiptText },
  { label: 'Limit', icon: BarChart3 },
  { label: 'Profile', icon: UserRound },
]

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const defaultDashboard = {
  stats: [
    { label: 'Eligible limit', value: '₹81.6k', tone: 'purple' },
    { label: 'Monthly dues', value: '₹10.2k', tone: 'orange' },
    { label: 'Active partners', value: '12', tone: 'green' },
    { label: 'Healthy score', value: '94%', tone: 'blue' },
  ],
  stores: [],
  marketplace: [],
  dues: [],
  limit: {
    totalLimit: 245000,
    usedLimit: 163400,
    available: 81600,
    utilization: 67,
    pledgedFunds: 450000,
    minimumBuffer: 240000,
    monthlyIncome: 120000,
  },
  profile: {
    name: 'Aarav Sharma',
    email: 'aarav@1fi.in',
    city: 'Bengaluru',
    investments: '₹4.5L mutual fund pledged',
    creditProfile: 'Healthy • No late dues',
    plan: '1Fi Premium',
  },
}

function App() {
  const [activeTab, setActiveTab] = useState('brands')
  const [query, setQuery] = useState('')
  const [activeNav, setActiveNav] = useState('Shop')
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [checkoutNotice, setCheckoutNotice] = useState(null)
  const [marketplaceQuery, setMarketplaceQuery] = useState('')
  const [marketplaceCategory, setMarketplaceCategory] = useState('All')
  const [marketplaceSort, setMarketplaceSort] = useState('featured')
  const [dashboard, setDashboard] = useState(defaultDashboard)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Failed to load dashboard')
        }
        const data = await response.json()
        setDashboard(data)
      } catch (error) {
        console.error(error)
        setDashboard(defaultDashboard)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const onlineStores = dashboard.stores.filter((store) => store.category === 'online')
  const nearbyStores = dashboard.stores.filter((store) => store.category === 'nearby')
  const source = activeTab === 'brands' ? onlineStores : nearbyStores

  const filteredBrands = useMemo(
    () => source.filter((brand) => `${brand.name} ${brand.tag}`.toLowerCase().includes(query.toLowerCase())),
    [query, source],
  )

  const totalDue = (dashboard.dues || []).reduce((sum, due) => sum + due.amount, 0)
  const limit = dashboard.limit || defaultDashboard.limit
  const marketplaceProducts = dashboard.marketplace ?? defaultDashboard.marketplace
  const marketplaceCategories = ['All', ...new Set(marketplaceProducts.map((product) => product.category))]

  const filteredMarketplace = useMemo(() => {
    const normalizedQuery = marketplaceQuery.trim().toLowerCase()
    const products = marketplaceProducts.filter((product) => {
      const matchesCategory = marketplaceCategory === 'All' || product.category === marketplaceCategory
      const matchesQuery = !normalizedQuery || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })

    return [...products].sort((firstProduct, secondProduct) => {
      if (marketplaceSort === 'price-low') return firstProduct.price - secondProduct.price
      if (marketplaceSort === 'price-high') return secondProduct.price - firstProduct.price
      if (marketplaceSort === 'rating') return (secondProduct.rating || 0) - (firstProduct.rating || 0)
      return firstProduct.id - secondProduct.id
    })
  }, [marketplaceCategory, marketplaceProducts, marketplaceQuery, marketplaceSort])

  const openProduct = (product) => {
    setSelectedProduct(product)
    setSelectedPlan(product.emiPlans?.[1] || product.emiPlans?.[0])
    setSelectedVariant(product.variants?.[0] || '')
  }

  const proceedWithEmi = () => {
    setCheckoutNotice({
      productName: selectedProduct.name,
      variant: selectedVariant,
      plan: selectedPlan,
    })
    setSelectedProduct(null)
  }

  const renderHome = () => (
    <div className="section-stack">
      <div className="summary-block summary-primary">
        <div>
          <p className="section-kicker">YOUR ACTIVE POWER</p>
          <h2>Instant buy power is ready</h2>
        </div>
        <div className="pill-success"><CheckCircle2 size={14} /> Healthy</div>
      </div>

      <div className="stats-grid">
        {(dashboard.stats || defaultDashboard.stats).map((card) => (
          <div key={card.label} className={`stat-card ${card.tone}`}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="info-card">
        <div className="card-header">
          <div className="mini-icon purple"><Wallet size={18} /></div>
          <div>
            <p className="section-kicker">LATEST UPDATE</p>
            <h3>1Fi wallet status</h3>
          </div>
        </div>
        <div className="wallet-row">
          <div>
            <small>Available to spend</small>
            <strong>{currency.format(limit.available || 81600)}</strong>
          </div>
          <button className="ghost-button" onClick={() => setActiveNav('Shop')}>Browse stores</button>
        </div>
      </div>

      <div className="feature-list">
        {[
          { title: 'Mutual fund-backed EMIs', description: 'Use your pledged fund balance to unlock instant purchases without a credit check.' },
          { title: 'Transparent repayment', description: 'Track every EMI due date, amount, and repayment health in one place.' },
          { title: 'Real-time spending limits', description: 'Stay inside your eligible limit with smart utilization monitoring.' },
        ].map((item) => (
          <div className="feature-item" key={item.title}>
            <div className="mini-icon orange"><TrendingUp size={16} /></div>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderShop = () => (
    <div className="section-stack shop-stack">
      <div className="tabs" role="tablist" aria-label="Shop sections">
        <button className={activeTab === 'brands' ? 'active' : ''} onClick={() => setActiveTab('brands')} role="tab" aria-selected={activeTab === 'brands'}><span>Top Brands</span></button>
        <button className={activeTab === 'nearby' ? 'active' : ''} onClick={() => setActiveTab('nearby')} role="tab" aria-selected={activeTab === 'nearby'}><MapPin size={15} /><span>Nearby Stores</span></button>
        <button className={activeTab === 'marketplace' ? 'active' : ''} onClick={() => setActiveTab('marketplace')} role="tab" aria-selected={activeTab === 'marketplace'}><ShoppingBag size={15} /><span>1Fi Marketplace</span></button>
      </div>

      {activeTab === 'marketplace' ? (
        <div className="marketplace-section">
          <div className="section-heading marketplace-heading">
            <div>
              <p className="section-kicker">SHOP WITH YOUR 1FI LIMIT</p>
              <h2>1Fi Marketplace</h2>
            </div>
            <span className="result-count">{filteredMarketplace.length} of {marketplaceProducts.length}</span>
          </div>
          <p className="marketplace-intro">Browse products and choose a repayment plan backed by your mutual funds.</p>
          <label className="search-box marketplace-search">
            <Search size={19} />
            <input value={marketplaceQuery} onChange={(event) => setMarketplaceQuery(event.target.value)} placeholder="Search products..." aria-label="Search marketplace products" />
            {marketplaceQuery && <button type="button" className="clear-search" onClick={() => setMarketplaceQuery('')} aria-label="Clear product search"><X size={15} /></button>}
          </label>
          <div className="marketplace-toolbar">
            <div className="category-scroll" aria-label="Product categories">
              {marketplaceCategories.map((category) => (
                <button key={category} className={marketplaceCategory === category ? 'active' : ''} onClick={() => setMarketplaceCategory(category)}>{category}</button>
              ))}
            </div>
            <label className="sort-control">
              <SlidersHorizontal size={15} />
              <select value={marketplaceSort} onChange={(event) => setMarketplaceSort(event.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>
          <div className="product-grid">
            {filteredMarketplace.map((product) => (
              <button className="product-card" key={product.id} onClick={() => openProduct(product)}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-badge">{product.badge}</span>
                </div>
                <span className="product-category">{product.category}</span>
                <strong>{product.name}</strong>
                <span className="product-rating"><Star size={12} fill="currentColor" /> {product.rating} <em>·</em> {product.stock}</span>
                <span className="product-price">{currency.format(product.price)}</span>
                <span className="product-emi">From {currency.format(product.emiPlans?.[0]?.amount || product.price)} / month</span>
              </button>
            ))}
            {!filteredMarketplace.length && (
              <div className="empty-state marketplace-empty">
                No products match your search.
                <button onClick={() => { setMarketplaceQuery(''); setMarketplaceCategory('All') }}>Clear filters</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>

      <label className="search-box">
        <Search size={19} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={activeTab === 'brands' ? 'Search online stores...' : 'Search nearby stores...'} aria-label="Search stores" />
        {query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}
      </label>

      <div className="section-heading">
        <div>
          <p className="section-kicker">{activeTab === 'brands' ? 'CURATED FOR YOU' : 'AROUND YOU'}</p>
          <h2>{activeTab === 'brands' ? 'Top Brands' : 'Nearby Stores'}</h2>
        </div>
        <span className="result-count">{filteredBrands.length} stores</span>
      </div>
      <div className="brand-list">
        {filteredBrands.map((brand) => (
          <button className="brand-card" key={brand.id || brand.name} onClick={() => setSelectedBrand(brand)}>
            <span className={`brand-mark ${brand.tone}`}>{brand.mark}</span>
            <span className="brand-info"><strong>{brand.name}</strong><small>{brand.detail}</small></span>
            <ArrowUpRight className="card-arrow" size={19} />
          </button>
        ))}
        {!filteredBrands.length && (
          <div className="empty-state">
            No stores match “{query}”.
            <button onClick={() => setQuery('')}>Clear search</button>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  )

  const renderDues = () => (
    <div className="section-stack">
      <div className="summary-block">
        <div>
          <p className="section-kicker">REPAYMENT OVERVIEW</p>
          <h2>EMI dues</h2>
        </div>
        <div className="pill-muted">{(dashboard.dues || []).length} active</div>
      </div>

      <div className="dues-summary">
        <span>Total due</span>
        <strong>{currency.format(totalDue)}</strong>
      </div>

      <div className="dues-list">
        {(dashboard.dues || []).map((due) => (
          <div className="due-card" key={due.id}>
            <div className="due-left">
              <div className="mini-icon blue"><CreditCard size={15} /></div>
              <div>
                <strong>{due.name}</strong>
                <small>Due {due.dueDate}</small>
              </div>
            </div>
            <div className="due-right">
              <strong>{currency.format(due.amount)}</strong>
              <span className={due.status === 'Due today' ? 'danger' : 'neutral'}>{due.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLimit = () => (
    <div className="section-stack">
      <div className="summary-block">
        <div>
          <p className="section-kicker">SPENDING CAP</p>
          <h2>Limit overview</h2>
        </div>
        <div className="pill-success"><ShieldCheck size={14} /> Safe</div>
      </div>

      <div className="limit-panel">
        <div className="ring-wrap">
          <div className="ring-chart" style={{ '--value': `${limit.utilization || 67}` }}>
            <div className="ring-inner">
              <span>{limit.utilization || 67}%</span>
              <small>used</small>
            </div>
          </div>
        </div>

        <div className="limit-metrics">
          <div>
            <small>Total limit</small>
            <strong>{currency.format(limit.totalLimit || 245000)}</strong>
          </div>
          <div>
            <small>Available</small>
            <strong>{currency.format(limit.available || 81600)}</strong>
          </div>
          <div>
            <small>Pledged funds</small>
            <strong>{currency.format(limit.pledgedFunds || 450000)}</strong>
          </div>
        </div>
      </div>

      <div className="meter-wrap">
        <div className="meter-head">
          <span>Utilization</span>
          <strong>{limit.utilization || 67}%</strong>
        </div>
        <div className="meter-bar"><span style={{ width: `${limit.utilization || 67}%` }} /></div>
      </div>

      <div className="info-grid">
        <div className="info-box">
          <small>Monthly income</small>
          <strong>{currency.format(limit.monthlyIncome || 120000)}</strong>
        </div>
        <div className="info-box">
          <small>Minimum buffer</small>
          <strong>{currency.format(limit.minimumBuffer || 240000)}</strong>
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="section-stack">
      <div className="summary-block">
        <div>
          <p className="section-kicker">ACCOUNT</p>
          <h2>Profile</h2>
        </div>
        <div className="pill-muted"><Bell size={14} /> Active</div>
      </div>

      <div className="profile-card">
        <div className="avatar">AS</div>
        <div>
          <h3>{dashboard.profile?.name || 'Aarav Sharma'}</h3>
          <p>{dashboard.profile?.plan || '1Fi Premium'}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-row"><span>Email</span><strong>{dashboard.profile?.email || 'aarav@1fi.in'}</strong></div>
        <div className="detail-row"><span>City</span><strong>{dashboard.profile?.city || 'Bengaluru'}</strong></div>
        <div className="detail-row"><span>Investments</span><strong>{dashboard.profile?.investments || '₹4.5L mutual fund pledged'}</strong></div>
        <div className="detail-row"><span>Profile</span><strong>{dashboard.profile?.creditProfile || 'Healthy • No late dues'}</strong></div>
      </div>

      <button className="primary-button full-width">View account details <ChevronRight size={16} /></button>
    </div>
  )

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> MUTUAL FUND POWERED</span>
          <h1>Shop today,<br /><em>pay later</em> with 1Fi.</h1>
          <p>Turn your investments into instant buying power. No credit score. No interest.</p>
          <div className="hero-trust"><ShieldCheck size={16} /> Backed by your investments</div>
        </div>
        <div className="hero-scene" aria-hidden="true">
          <div className="scene-glow" />
          <div className="scene-device device-phone" />
          <div className="scene-device device-laptop" />
          <div className="scene-bag"><span>1Fi</span></div>
          <div className="scene-star star-one">✦</div>
          <div className="scene-star star-two">✦</div>
        </div>
      </section>

      <div className="content-wrap">
        {loading ? (
          <div className="loading-state">Loading your marketplace…</div>
        ) : (
          <>
            {activeNav === 'Home' && renderHome()}
            {activeNav === 'Shop' && renderShop()}
            {activeNav === 'EMI Dues' && renderDues()}
            {activeNav === 'Limit' && renderLimit()}
            {activeNav === 'Profile' && renderProfile()}
          </>
        )}
      </div>

      {checkoutNotice && (
        <div className="checkout-notice" role="status">
          <div>
            <strong>EMI plan selected</strong>
            <span>{checkoutNotice.productName} · {checkoutNotice.plan?.months} months · {currency.format(checkoutNotice.plan?.amount || 0)}/month</span>
          </div>
          <button onClick={() => { setCheckoutNotice(null); setActiveNav('EMI Dues') }}>View EMI dues <ChevronRight size={15} /></button>
          <button className="notice-close" onClick={() => setCheckoutNotice(null)} aria-label="Dismiss confirmation"><X size={15} /></button>
        </div>
      )}

      <nav className="bottom-nav" aria-label="Primary navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => setActiveNav(label)}>
            <Icon size={20} strokeWidth={activeNav === label ? 2.5 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {selectedBrand && (
        <div className="modal-backdrop" onClick={() => setSelectedBrand(null)}>
          <div className="merchant-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBrand(null)} aria-label="Close">
              <X size={18} />
            </button>
            <span className={`brand-mark large ${selectedBrand.tone}`}>{selectedBrand.mark}</span>
            <p className="section-kicker">ELIGIBLE PARTNER</p>
            <h2>{selectedBrand.name}</h2>
            <p className="modal-detail">{selectedBrand.detail}. Your purchase is backed by your pledged mutual fund balance.</p>
            <button className="modal-action" onClick={() => window.open(selectedBrand.url || 'https://app.1fi.in/shop', '_blank', 'noopener,noreferrer')}>
              Continue to store <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="merchant-modal product-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close"><X size={18} /></button>
            <img className="product-modal-image" src={selectedProduct.image} alt={selectedProduct.name} />
            <p className="section-kicker">1FI MARKETPLACE</p>
            <h2>{selectedProduct.name}</h2>
            <strong className="modal-price">{currency.format(selectedProduct.price)}</strong>
            <p className="modal-detail">{selectedProduct.description}</p>
            <ul className="product-details">
              {selectedProduct.details?.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
            <label className="modal-label" htmlFor="product-variant">Variant</label>
            <select id="product-variant" value={selectedVariant} onChange={(event) => setSelectedVariant(event.target.value)}>
              {selectedProduct.variants?.map((variant) => <option key={variant}>{variant}</option>)}
            </select>
            <label className="modal-label" htmlFor="emi-plan">Choose EMI plan</label>
            <select id="emi-plan" value={selectedPlan?.months || ''} onChange={(event) => setSelectedPlan(selectedProduct.emiPlans.find((plan) => plan.months === Number(event.target.value)))}>
              {selectedProduct.emiPlans?.map((plan) => <option key={plan.months} value={plan.months}>{plan.label} · {currency.format(plan.amount)}/month</option>)}
            </select>
            <div className="emi-summary"><span>Selected monthly payment</span><strong>{currency.format(selectedPlan?.amount || 0)}</strong></div>
            <button className="modal-action" onClick={proceedWithEmi}>Proceed with EMI <ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
