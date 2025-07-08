# Product Pages Redesign Template

## Overview
Comprehensive redesign specifications for product category pages and individual product detail pages, focusing on enhanced user experience, improved product discovery, and increased conversion rates.

---

## Product Category Pages

### 1. Page Header Section

#### Visual Design
```typescript
<section className="category-header gradient-bg-primary">
  <div className="container">
    <div className="breadcrumb-nav glass-light">
      <Link href="/">Home</Link>
      <ChevronRight />
      <Link href="/products">Products</Link>
      <ChevronRight />
      <span className="current">Smart Boards</span>
    </div>
    
    <div className="category-hero">
      <h1 className="heading-hero gradient-text-white animate-fade-up">
        Interactive Smart Boards
      </h1>
      <p className="subtitle-hero text-white animate-fade-up stagger-1">
        Transform your presentations with cutting-edge touch technology
      </p>
      
      <div className="category-stats animate-fade-up stagger-2">
        <div className="stat-badge glass-white">
          <Package /> 24 Products
        </div>
        <div className="stat-badge glass-white">
          <Star /> 4.8 Average Rating
        </div>
        <div className="stat-badge glass-white">
          <TrendingUp /> Best Sellers
        </div>
      </div>
    </div>
  </div>
</section>
```

### 2. Advanced Filter System

#### Filter UI Design
```typescript
<div className="product-listing-container">
  <aside className="filter-sidebar glass-light">
    <div className="filter-header">
      <h3 className="gradient-text-primary">Filter Products</h3>
      <button className="reset-filters text-sm">
        <RotateCcw /> Reset All
      </button>
    </div>
    
    <div className="filter-sections">
      {/* Price Range Filter */}
      <div className="filter-section">
        <h4 className="filter-title">Price Range</h4>
        <div className="price-slider">
          <input 
            type="range" 
            min="0" 
            max="10000" 
            className="range-input gradient-track"
          />
          <div className="price-inputs">
            <input type="number" placeholder="Min" className="price-input glass-white" />
            <span>-</span>
            <input type="number" placeholder="Max" className="price-input glass-white" />
          </div>
        </div>
      </div>
      
      {/* Size Filter */}
      <div className="filter-section">
        <h4 className="filter-title">Screen Size</h4>
        <div className="size-options">
          <label className="filter-checkbox">
            <input type="checkbox" />
            <span className="checkbox-custom gradient-checked"></span>
            <span>55" - 65"</span>
            <span className="count">(8)</span>
          </label>
          <label className="filter-checkbox">
            <input type="checkbox" />
            <span className="checkbox-custom gradient-checked"></span>
            <span>70" - 75"</span>
            <span className="count">(12)</span>
          </label>
          <label className="filter-checkbox">
            <input type="checkbox" />
            <span className="checkbox-custom gradient-checked"></span>
            <span>80" - 86"</span>
            <span className="count">(4)</span>
          </label>
        </div>
      </div>
      
      {/* Feature Filter */}
      <div className="filter-section">
        <h4 className="filter-title">Features</h4>
        <div className="feature-tags">
          <button className="filter-tag glass-light">
            <Wifi /> Wireless
          </button>
          <button className="filter-tag active gradient-bg-primary">
            <Layers /> Multi-touch
          </button>
          <button className="filter-tag glass-light">
            <Camera /> Built-in Camera
          </button>
          <button className="filter-tag glass-light">
            <Volume2 /> Audio System
          </button>
        </div>
      </div>
    </div>
    
    <div className="active-filters">
      <h4>Active Filters (3)</h4>
      <div className="filter-chips">
        <span className="filter-chip gradient-bg-primary">
          Multi-touch <X />
        </span>
        <span className="filter-chip gradient-bg-primary">
          70" - 75" <X />
        </span>
      </div>
    </div>
  </aside>
  
  <main className="product-grid-section">
    {/* Sorting and View Options */}
    <div className="grid-controls glass-light">
      <div className="result-count">
        <strong>24 Products</strong> found
      </div>
      
      <div className="view-options">
        <button className="view-toggle active">
          <Grid /> Grid
        </button>
        <button className="view-toggle">
          <List /> List
        </button>
      </div>
      
      <div className="sort-dropdown">
        <select className="sort-select glass-white">
          <option>Most Popular</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
          <option>Best Rated</option>
        </select>
      </div>
    </div>
    
    {/* Product Grid */}
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </main>
</div>
```

### 3. Enhanced Product Cards

#### Product Card Component
```typescript
<article className="product-card glass-white animate-fade-up">
  {/* Product Badge */}
  <div className="product-badges">
    <span className="badge gradient-bg-success">New</span>
    <span className="badge gradient-bg-warning">Best Seller</span>
  </div>
  
  {/* Quick Actions */}
  <div className="quick-actions">
    <button className="action-btn glass-light" aria-label="Add to wishlist">
      <Heart />
    </button>
    <button className="action-btn glass-light" aria-label="Compare">
      <GitBranch />
    </button>
  </div>
  
  {/* Product Image */}
  <div className="product-image-container">
    <img 
      src={product.image} 
      alt={product.name}
      className="product-image"
    />
    <div className="image-overlay">
      <button className="button-glass">
        <Eye /> Quick View
      </button>
    </div>
  </div>
  
  {/* Product Info */}
  <div className="product-info">
    <div className="product-meta">
      <span className="brand-name">DTEN</span>
      <div className="rating">
        <Stars rating={4.5} />
        <span className="rating-count">(23)</span>
      </div>
    </div>
    
    <h3 className="product-name">
      <Link href={`/products/${product.slug}`}>
        {product.name}
      </Link>
    </h3>
    
    <p className="product-summary">
      86" 4K Multi-touch Display with Built-in AI Camera
    </p>
    
    <div className="product-features">
      <span className="feature-pill glass-light">4K UHD</span>
      <span className="feature-pill glass-light">40-point Touch</span>
      <span className="feature-pill glass-light">Android 11</span>
    </div>
    
    <div className="product-pricing">
      <div className="price-group">
        <span className="price-label">Starting at</span>
        <span className="price gradient-text-primary">$4,999</span>
        <span className="price-original">$5,999</span>
      </div>
      
      <button className="button-gradient button-sm">
        View Details
      </button>
    </div>
  </div>
</article>
```

### 4. Load More / Pagination

```typescript
<div className="pagination-section">
  <button className="button-glass button-lg load-more">
    <RefreshCw /> Load More Products
  </button>
  
  {/* Alternative: Traditional Pagination */}
  <nav className="pagination glass-light">
    <button className="page-btn" disabled>
      <ChevronLeft />
    </button>
    <button className="page-btn active gradient-bg-primary">1</button>
    <button className="page-btn">2</button>
    <button className="page-btn">3</button>
    <span className="page-dots">...</span>
    <button className="page-btn">8</button>
    <button className="page-btn">
      <ChevronRight />
    </button>
  </nav>
</div>
```

---

## Product Detail Pages

### 1. Product Hero Section

```typescript
<section className="product-detail-hero">
  <div className="container">
    {/* Breadcrumbs */}
    <div className="breadcrumb-nav glass-light">
      <Link href="/">Home</Link>
      <ChevronRight />
      <Link href="/products">Products</Link>
      <ChevronRight />
      <Link href="/products/smartboards">Smart Boards</Link>
      <ChevronRight />
      <span className="current">DTEN D7X 86"</span>
    </div>
    
    <div className="product-detail-grid">
      {/* Product Gallery */}
      <div className="product-gallery">
        <div className="gallery-main">
          <div className="zoom-container">
            <img 
              src={activeImage} 
              alt="Product"
              className="main-image"
              data-zoom={activeImage}
            />
          </div>
          
          <div className="gallery-badges">
            <span className="badge gradient-bg-success">In Stock</span>
            <span className="badge gradient-bg-info">Free Shipping</span>
          </div>
        </div>
        
        <div className="gallery-thumbs">
          {images.map((img, idx) => (
            <button 
              key={idx}
              className={`thumb ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveImage(img)}
            >
              <img src={img.thumb} alt={`View ${idx + 1}`} />
            </button>
          ))}
        </div>
        
        <div className="gallery-actions">
          <button className="button-glass">
            <Maximize2 /> View Full Screen
          </button>
          <button className="button-glass">
            <Video /> Watch Demo
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="product-info-panel">
        <div className="product-header">
          <h1 className="product-title">
            DTEN D7X 86" Interactive Display
          </h1>
          
          <div className="product-meta">
            <div className="rating-section">
              <Stars rating={4.8} size="lg" />
              <span className="rating-text">4.8 out of 5</span>
              <a href="#reviews" className="review-link">
                (47 Reviews)
              </a>
            </div>
            
            <div className="sku-info">
              SKU: <span className="sku-code">DTN-D7X-86</span>
            </div>
          </div>
        </div>
        
        <div className="product-description">
          <p className="lead-text">
            Transform your meeting room with the ultimate all-in-one 
            collaboration display featuring 4K resolution, 40-point 
            multi-touch, and integrated AI-powered camera.
          </p>
          
          <div className="key-features">
            <h3 className="features-title gradient-text-primary">
              Key Features
            </h3>
            <ul className="feature-list">
              <li>
                <Check className="feature-icon" />
                86" 4K UHD Display (3840 x 2160)
              </li>
              <li>
                <Check className="feature-icon" />
                40-point simultaneous touch
              </li>
              <li>
                <Check className="feature-icon" />
                Built-in 4K AI tracking camera
              </li>
              <li>
                <Check className="feature-icon" />
                16-microphone array with noise cancellation
              </li>
            </ul>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="pricing-section glass-light">
          <div className="price-display">
            <span className="price-label">Your Price</span>
            <div className="price-group">
              <span className="price-current gradient-text-primary">
                $4,999
              </span>
              <span className="price-original">$5,999</span>
              <span className="price-save gradient-bg-success">
                Save $1,000
              </span>
            </div>
          </div>
          
          <div className="financing-option">
            <CreditCard className="finance-icon" />
            <span>As low as <strong>$139/mo</strong> with financing</span>
            <button className="link-button">Learn More</button>
          </div>
        </div>
        
        {/* Purchase Options */}
        <div className="purchase-options">
          <div className="option-group">
            <label className="option-label">Warranty</label>
            <div className="option-buttons">
              <button className="option-btn active gradient-bg-primary">
                Standard (3 Years)
              </button>
              <button className="option-btn glass-light">
                Extended (5 Years) +$299
              </button>
            </div>
          </div>
          
          <div className="option-group">
            <label className="option-label">Installation</label>
            <div className="option-buttons">
              <button className="option-btn glass-light">
                Self Install
              </button>
              <button className="option-btn active gradient-bg-primary">
                Professional +$399
              </button>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="product-actions">
          <div className="quantity-selector glass-light">
            <button className="qty-btn">
              <Minus />
            </button>
            <input type="number" value="1" className="qty-input" />
            <button className="qty-btn">
              <Plus />
            </button>
          </div>
          
          <button className="button-gradient button-xl flex-grow animate-float">
            <ShoppingCart /> Add to Quote
          </button>
          
          <button className="button-glass button-xl">
            <Heart /> Save
          </button>
        </div>
        
        {/* Trust Signals */}
        <div className="trust-signals">
          <div className="trust-item">
            <Shield className="trust-icon" />
            <span>30-Day Return Policy</span>
          </div>
          <div className="trust-item">
            <Truck className="trust-icon" />
            <span>Free Shipping</span>
          </div>
          <div className="trust-item">
            <Headphones className="trust-icon" />
            <span>Expert Support</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 2. Product Information Tabs

```typescript
<section className="product-tabs-section">
  <div className="container">
    <div className="tabs-container glass-light">
      <nav className="tab-nav">
        <button className="tab-btn active gradient-bg-primary">
          <FileText /> Overview
        </button>
        <button className="tab-btn">
          <Settings /> Specifications
        </button>
        <button className="tab-btn">
          <Package /> What's Included
        </button>
        <button className="tab-btn">
          <Download /> Downloads
        </button>
        <button className="tab-btn">
          <MessageSquare /> Reviews (47)
        </button>
      </nav>
      
      <div className="tab-content">
        {/* Overview Tab */}
        <div className="tab-panel active">
          <div className="overview-grid">
            <div className="overview-text">
              <h2 className="gradient-text-primary">
                Designed for Modern Collaboration
              </h2>
              <p>
                The DTEN D7X brings teams together with an immersive 
                86-inch 4K display that makes every detail crystal clear...
              </p>
              
              <div className="feature-highlights">
                <div className="highlight-card glass-light">
                  <div className="icon-container-gradient">
                    <Users />
                  </div>
                  <h3>Team Collaboration</h3>
                  <p>Up to 40 people can interact simultaneously</p>
                </div>
                {/* More highlight cards */}
              </div>
            </div>
            
            <div className="overview-media">
              <div className="video-player glass-strong">
                <video controls poster="/product-video-poster.jpg">
                  <source src="/product-demo.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
        
        {/* Specifications Tab */}
        <div className="tab-panel">
          <div className="specs-grid">
            <div className="spec-group">
              <h3 className="spec-title gradient-text-primary">Display</h3>
              <dl className="spec-list">
                <div className="spec-item">
                  <dt>Screen Size</dt>
                  <dd>86 inches (diagonal)</dd>
                </div>
                <div className="spec-item">
                  <dt>Resolution</dt>
                  <dd>3840 x 2160 (4K UHD)</dd>
                </div>
                {/* More specs */}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 3. Related Products Section

```typescript
<section className="related-products gradient-bg-subtle">
  <div className="container">
    <div className="section-header">
      <h2 className="heading-section">Complete Your Setup</h2>
      <p className="subtitle-section">
        Recommended accessories and complementary products
      </p>
    </div>
    
    <div className="related-carousel">
      <div className="carousel-track">
        {relatedProducts.map(product => (
          <div className="related-card glass-white">
            <div className="related-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="related-info">
              <h4>{product.name}</h4>
              <p className="related-price gradient-text-primary">
                ${product.price}
              </p>
              <button className="button-gradient button-sm">
                Add to Quote
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-btn prev glass-light">
        <ChevronLeft />
      </button>
      <button className="carousel-btn next glass-light">
        <ChevronRight />
      </button>
    </div>
  </div>
</section>
```

---

## Mobile Optimizations

### Responsive Product Grid
```scss
@media (max-width: 768px) {
  .product-listing-container {
    flex-direction: column;
    
    .filter-sidebar {
      position: fixed;
      left: -100%;
      top: 0;
      height: 100vh;
      width: 80%;
      z-index: 1000;
      transition: left 0.3s ease;
      
      &.active {
        left: 0;
      }
    }
  }
  
  .product-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .product-detail-grid {
    grid-template-columns: 1fr;
    
    .product-gallery {
      position: sticky;
      top: 0;
    }
  }
}
```

### Touch Gestures
- Swipe to change product images
- Pull-to-refresh on category pages
- Pinch to zoom on product images
- Swipe to dismiss filters

---

## Performance Optimizations

### Image Loading
```typescript
// Progressive image loading
<img 
  src="placeholder.jpg"
  data-src="high-res.jpg"
  loading="lazy"
  className="progressive-image"
/>

// Responsive images
<picture>
  <source media="(max-width: 768px)" srcset="product-mobile.jpg" />
  <source media="(max-width: 1200px)" srcset="product-tablet.jpg" />
  <img src="product-desktop.jpg" alt="Product" />
</picture>
```

### Filtering Performance
```typescript
// Debounced filter updates
const debouncedFilter = debounce((filters) => {
  updateProducts(filters);
}, 300);

// Virtual scrolling for large lists
<VirtualList
  items={products}
  itemHeight={400}
  renderItem={(product) => <ProductCard product={product} />}
/>
```

---

## Conversion Optimization

### Strategic CTA Placement
1. **Sticky Add to Cart**: Always visible on scroll
2. **Quick Add**: One-click from category pages
3. **Bundle Suggestions**: Increase order value
4. **Urgency Indicators**: Stock levels, sale timers

### Trust Building
- Customer reviews with photos
- Expert badges and certifications
- Detailed warranty information
- Live chat support integration

---

This product pages redesign template provides a comprehensive blueprint for creating modern, conversion-focused product experiences that showcase BigShine Display's premium offerings while making it easy for customers to find, evaluate, and purchase products.