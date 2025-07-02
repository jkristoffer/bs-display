# Functional Programming Standards

> **MANDATORY**: All code development must follow functional programming principles. This is a core architectural requirement for maintainability, testability, and reliability.

## Core Principles

### 1. **Pure Functions**
- **No side effects**: Functions should not modify external state
- **Deterministic**: Same input always produces same output
- **Isolated**: Function behavior depends only on input parameters

```typescript
// ✅ Pure function
const calculateTotal = (items: Item[]) => 
  items.reduce((sum, item) => sum + item.price, 0);

// ❌ Impure function (side effects)
let total = 0;
const addToTotal = (price: number) => { total += price; };
```

### 2. **Immutability**
- **Never mutate**: Always return new objects/arrays instead of modifying existing ones
- **Use spread operators**: For object/array updates
- **Prefer const**: For all variable declarations unless reassignment needed

```typescript
// ✅ Immutable update
const updateProduct = (product: Product, updates: Partial<Product>) => ({
  ...product,
  ...updates
});

// ❌ Mutation
const updateProduct = (product: Product, updates: Partial<Product>) => {
  Object.assign(product, updates); // Mutates original
  return product;
};
```

### 3. **Function Composition**
- **Small, focused functions**: Each function should do one thing well
- **Compose larger functionality**: From smaller, reusable functions
- **Higher-order functions**: Functions that take/return other functions

```typescript
// ✅ Function composition
const filterActive = (products: Product[]) => products.filter(p => p.active);
const sortByPrice = (products: Product[]) => [...products].sort((a, b) => a.price - b.price);
const formatForDisplay = (products: Product[]) => products.map(formatProduct);

const getActiveProductsSorted = (products: Product[]) =>
  formatForDisplay(sortByPrice(filterActive(products)));

// Or using pipe/compose utilities
const getActiveProductsSorted = pipe(
  filterActive,
  sortByPrice,
  formatForDisplay
);
```

## React Component Patterns

### **Functional Components Only**
- **No class components**: Use only functional components with hooks
- **Custom hooks**: Extract stateful logic into reusable hooks
- **Props as pure data**: Components should be functions of their props

```typescript
// ✅ Functional component with hooks
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = useCallback(() => {
    onSelect(product.id);
  }, [product.id, onSelect]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Component content */}
    </div>
  );
};
```

### **State Management**
- **useState for local state**: Keep component state functional
- **useReducer for complex state**: Use reducer pattern for complex state logic
- **Avoid direct mutations**: Always use functional updates

```typescript
// ✅ Functional state updates
const [filters, setFilters] = useState<ProductFilters>({});

const updateFilter = useCallback((key: string, value: string) => {
  setFilters(prev => ({ ...prev, [key]: value }));
}, []);

// ✅ Reducer for complex state
const filtersReducer = (state: ProductFilters, action: FilterAction) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.key]: action.value };
    case 'RESET_FILTERS':
      return {};
    default:
      return state;
  }
};
```

## Data Transformation Patterns

### **Array Processing**
- **Use map, filter, reduce**: Instead of imperative loops
- **Chain operations**: Use method chaining for readable transformations
- **Avoid forEach**: When you need to return transformed data

```typescript
// ✅ Functional array processing
const processProducts = (products: Product[], filters: ProductFilters) =>
  products
    .filter(product => matchesFilters(product, filters))
    .map(product => enrichProductData(product))
    .sort((a, b) => a.price - b.price);

// ❌ Imperative approach
const processProducts = (products: Product[], filters: ProductFilters) => {
  const result = [];
  for (let i = 0; i < products.length; i++) {
    if (matchesFilters(products[i], filters)) {
      const enriched = enrichProductData(products[i]);
      result.push(enriched);
    }
  }
  result.sort((a, b) => a.price - b.price);
  return result;
};
```

### **Object Transformations**
- **Use object spread**: For updates and merging
- **Destructuring**: For clean property access
- **Optional chaining**: For safe property access

```typescript
// ✅ Functional object handling
const formatProductForApi = ({ id, name, price, ...otherProps }: Product) => ({
  productId: id,
  displayName: name,
  priceInCents: price * 100,
  metadata: otherProps
});

const safeGetProperty = (obj: any, path: string) =>
  path.split('.').reduce((current, key) => current?.[key], obj);
```

## Async Operations

### **Promise Composition**
- **Use async/await**: For readable asynchronous code
- **Error boundaries**: Handle errors functionally
- **Avoid nested callbacks**: Use Promise chaining or async/await

```typescript
// ✅ Functional async operations
const fetchProductWithDetails = async (productId: string): Promise<EnrichedProduct> => {
  const product = await fetchProduct(productId);
  const reviews = await fetchReviews(productId);
  const relatedProducts = await fetchRelatedProducts(productId);
  
  return {
    ...product,
    reviews,
    relatedProducts
  };
};

// ✅ Error handling
const safeApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
};
```

## TypeScript Integration

### **Type Safety with Functions**
- **Generic functions**: For reusable, type-safe functions
- **Union types**: For function parameters with multiple possibilities
- **Function signatures**: Clear typing for all function parameters and returns

```typescript
// ✅ Type-safe functional patterns
type FilterFunction<T> = (item: T) => boolean;
type MapFunction<T, U> = (item: T) => U;

const createFilter = <T>(predicate: FilterFunction<T>) => 
  (items: T[]): T[] => items.filter(predicate);

const createMapper = <T, U>(transform: MapFunction<T, U>) =>
  (items: T[]): U[] => items.map(transform);

// Usage
const activeProductFilter = createFilter<Product>(p => p.active);
const productDisplayMapper = createMapper<Product, ProductDisplay>(formatProduct);
```

## Testing Functional Code

### **Unit Testing Pure Functions**
- **Easy to test**: Pure functions are highly testable
- **No mocking needed**: Pure functions don't require complex test setup
- **Property-based testing**: Test function properties rather than specific cases

```typescript
// ✅ Testing pure functions
describe('calculateTotal', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('should sum all item prices', () => {
    const items = [{ price: 10 }, { price: 20 }, { price: 30 }];
    expect(calculateTotal(items)).toBe(60);
  });
});
```

## Performance Considerations

### **Memoization**
- **React.memo**: For component memoization
- **useMemo**: For expensive calculations
- **useCallback**: For function reference stability

```typescript
// ✅ Memoization patterns
const ProductList = React.memo<ProductListProps>(({ products, filters }) => {
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  const handleProductSelect = useCallback(
    (productId: string) => {
      // Handle selection
    },
    []
  );

  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onSelect={handleProductSelect}
        />
      ))}
    </div>
  );
});
```

## Anti-Patterns to Avoid

### **Common Mistakes**
- **Direct mutations**: Never modify props, state, or passed objects directly
- **Imperative loops**: Avoid for/while loops when functional methods work
- **Global state mutations**: Keep all state changes functional
- **Side effects in render**: Keep components pure

```typescript
// ❌ Anti-patterns
const ProductComponent = ({ products }) => {
  // DON'T: Mutate props
  products.push(newProduct);
  
  // DON'T: Side effects in render
  localStorage.setItem('products', JSON.stringify(products));
  
  // DON'T: Imperative array building
  const activeProducts = [];
  for (const product of products) {
    if (product.active) {
      activeProducts.push(product);
    }
  }
  
  return <div>{/* render */}</div>;
};
```

## Development Workflow

### **Implementation Steps**
1. **Design function signatures**: Start with clear input/output types
2. **Write pure functions**: Implement core logic without side effects
3. **Compose larger functions**: Build complexity through composition
4. **Add side effects at boundaries**: Handle I/O, state updates at component edges
5. **Test thoroughly**: Unit test all pure functions

### **Code Review Checklist**
- [ ] All functions are pure (no side effects)
- [ ] No direct mutations of objects/arrays
- [ ] State updates use functional patterns
- [ ] Complex logic is broken into small, composable functions
- [ ] TypeScript types are properly defined
- [ ] Async operations use proper error handling
- [ ] Components are memoized appropriately

---

**Philosophy**: Start simple, add complexity only when needed. Focus on practical patterns that improve development velocity while maintaining code quality.