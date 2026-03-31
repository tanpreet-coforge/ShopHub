# Adobe Analytics Integration Guide

This guide explains how to implement Adobe Analytics tracking on the e-commerce prototype.

## Overview

Adobe Analytics (formerly Omniture SiteCatalyst) is a powerful web analytics platform. This prototype includes placeholder event structures for:

- Page views
- Product views
- Search tracking
- Add to cart events
- Checkout funnel tracking
- Order completion tracking

---

## Setup Steps

### 1. Get Adobe Analytics Account

You need an Adobe Analytics account. If you don't have one:

1. Sign up at https://adobe.com (Experience Cloud)
2. Create a report suite
3. Get your **Tracking ID** (format: `XXXX-XXXX`)
4. Obtain your **Launch Property** or direct implementation code

### 2. Choose Implementation Method

#### Option A: Adobe Launch (Recommended)

**Adobe Launch** is a modern tag management system.

**Setup:**
1. Go to https://experience.adobe.com/#/home
2. Navigate to **Launch**
3. Create a new property
4. Name: "E-Commerce Prototype"
5. Select domain
6. Configure extensions:
   - Adobe Analytics extension
   - Add your tracking ID

7. Create data elements for common variables:
   - Page Name
   - User ID
   - Product Name
   - Product SKU
   - Cart Total

8. Create rules for tracking:
   - Page Load - Track page view
   - Click Elements - Track add to cart
   - Custom Events - Track checkout flow

9. Copy the **Embed Code** from Publishing

#### Option B: Direct Implementation

If using direct implementation, add to `frontend/index.html`:

```html
<script>
  var s=s_gi("XXXX-XXXX"); // Replace with your tracking ID
  s.trackingServer="mycompany.sc.omtrdc.net";
  s.trackingServerSecure="mycompany.sc.omtrdc.net";
</script>
<script language="JavaScript" type="text/javascript"
src="https://mycompany.javascript.sc.omtrdc.net/b/js/AppMeasurement.js">
</script>
```

---

## Event Tracking Implementation

### 1. Page View Tracking

**File:** `frontend/src/pages/HomePage.jsx`

Add at component mount:
```javascript
useEffect(() => {
  // Track page view
  if (window.s) {
    window.s.pageName = "Home";
    window.s.pageType = "Homepage";
    window.s.prop1 = "Homepage";
    window.s.eVar1 = "homepage_visit"; // User Journey
    window.s.t();
  }
}, []);
```

### 2. Product View Tracking

**File:** `frontend/src/pages/ProductDetailsPage.jsx`

```javascript
useEffect(() => {
  if (window.s && product) {
    window.s.pageName = "Product: " + product.name;
    window.s.eVar2 = product.category; // Product Category
    window.s.eVar3 = product._id; // Product ID
    window.s.prop2 = product.price; // Product Price
    window.s.prop3 = product.rating; // Product Rating
    window.s.products = `;${product.name};${product.price};;; productView=1;`;
    window.s.t();
  }
}, [product]);
```

### 3. Search Tracking

**File:** `frontend/src/pages/ProductsPage.jsx`

```javascript
const handleSearch = (e) => {
  e.preventDefault();
  
  // Track search
  if (window.s) {
    window.s.eVar4 = filters.search; // Search Term
    window.s.events = "event1"; // Search event
    window.s.linkTrackVars = "eVar4,events";
    window.s.tl(true, 'o', 'Product Search');
  }
  
  setFilters({ ...filters, page: 1 });
};
```

### 4. Add to Cart Tracking

**File:** `frontend/src/components/ProductCard.jsx`

```javascript
const handleAddToCart = async (e) => {
  e.stopPropagation();
  try {
    await addToCart(product._id, quantity);
    
    // Track add to cart
    if (window.s) {
      window.s.eVar5 = product.name; // Product Name
      window.s.prop4 = product.price; // Product Price
      window.s.events = "scAdd"; // Adobe Commerce Event
      window.s.products = `;${product.name};1;${product.price};;; ;`;
      window.s.tl(true, 'o', 'Add to Cart');
    }
    
    alert('Added to cart!');
  } catch (error) {
    alert('Please login to add items to cart');
  }
};
```

### 5. Cart View Tracking

**File:** `frontend/src/pages/CartPage.jsx`

```javascript
useEffect(() => {
  if (window.s && cart) {
    window.s.pageName = "Shopping Cart";
    window.s.eVar6 = cart.totalItems; // Items in cart
    window.s.eVar7 = cart.totalPrice; // Cart Total
    window.s.events = "event2"; // Cart view event
    window.s.t();
  }
}, [cart]);
```

### 6. Checkout Tracking

**File:** `frontend/src/pages/CheckoutPage.jsx`

```javascript
// Track when entering checkout
useEffect(() => {
  if (window.s && step) {
    window.s.events = `event3:${step}`; // event3:step1, event3:step2, event3:step3
    window.s.eVar8 = `checkout_step_${step}`;
    window.s.t();
  }
}, [step]);

// Track step completion
const handleSubmitOrder = async () => {
  try {
    const response = await orderAPI.createOrder(orderData);
    
    // Track purchase
    if (window.s) {
      window.s.pageName = "Order Confirmation";
      window.s.events = "purchase"; // Very important!
      window.s.eVar9 = response.data.order._id; // Order ID
      window.s.eVar10 = orderData.totalPrice; // Order Total
      window.s.eVar11 = cart.totalItems; // Items ordered
      
      // Product details
      let productsString = "";
      cart.items.forEach((item) => {
        productsString += `;${item.productId.name};${item.quantity};${item.price};;;`;
      });
      window.s.products = productsString;
      
      window.s.t();
    }
    
    setOrderId(response.data.order._id);
  } catch (error) {
    alert('Error creating order: ' + error.message);
  }
};
```

### 7. Login/Registration Tracking

**File:** `frontend/src/pages/LoginPage.jsx`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(formData.email, formData.password);
    
    // Track login
    if (window.s) {
      window.s.eVar12 = "user_login"; // User action
      window.s.events = "event4"; // Login event
      window.s.tl(true, 'o', 'User Login');
    }
    
    navigate('/');
  } catch (err) {
    setErrors({ submit: err.message });
  }
};
```

---

## Data Variables Reference

### eVars (Custom Variables)
| Variable | Purpose | Value |
|----------|---------|-------|
| eVar1 | User Journey | page_type (homepage, product, cart, etc.) |
| eVar2 | Product Category | Electronics, Fashion, Home, etc. |
| eVar3 | Product ID | Unique product identifier |
| eVar4 | Search Term | User's search query |
| eVar5 | Product Name | Product being interacted with |
| eVar6 | Cart Items | Number of items in cart |
| eVar7 | Cart Total | Total value of cart |
| eVar8 | Checkout Step | Current checkout step |
| eVar9 | Order ID | Unique order number |
| eVar10 | Order Total | Total purchase value |
| eVar11 | Items Ordered | Quantity of items ordered |
| eVar12 | User Action | login, register, logout, etc. |

### Props (Traffic Variables)
| Prop | Purpose | Value |
|------|---------|-------|
| prop1 | Page Type | Homepage, Product Detail, Checkout, etc. |
| prop2 | Product Price | Price of product |
| prop3 | Product Rating | 1-5 star rating |
| prop4 | Add to Cart Price | Price when adding to cart |

### Events
| Event | Trigger |
|-------|---------|
| event1 | Search performed |
| event2 | Cart viewed |
| event3 | Checkout step visited |
| event4 | User login |
| scAdd | Add to cart (automatic) |
| scRemove | Remove from cart (automatic) |
| purchase | Order completed |

---

## Products Variable (Commerce Tracking)

The `s.products` variable tracks products:

**Format:**
```javascript
s.products = ";product_name;quantity;price;;;category=value;";
```

**Example - Add to Cart:**
```javascript
s.products = ";Wireless Headphones Pro;1;199.99;;; ;";
```

**Example - Purchase:**
```javascript
// For multiple items:
s.products = 
  ";Wireless Headphones Pro;1;199.99;;; ;" +
  ";Smart Watch Ultra;1;349.99;;; ;" +
  ";Yoga Mat Premium;2;49.99;;; ;";
```

---

## User ID Tracking

To track authenticated users:

```javascript
// In AuthContext.jsx or after login
if (window.s && user) {
  window.s.visitorID = user._id; // Unique user identifier
  window.s.setVisitorID = user.email; // Or email
}
```

---

## Custom Events

For custom tracking needs:

```javascript
// Track custom event
if (window.s) {
  // Event name
  window.s.events = "event5"; // Use event5-99 for custom
  
  // Custom variable
  window.s.eVar20 = "custom_value";
  
  // Link tracking
  window.s.tl(true, 'o', 'Custom Event Name');
}
```

---

## Testing Analytics

### 1. Debug View

Use Adobe Analytics DebugView:
1. Go to Analytics dashboard
2. Enable "DebugView" in settings
3. Perform actions on your site
4. See hits in real-time

### 2. Adobe Experience Cloud Debugger

Browser extension:
1. Install "Adobe Experience Cloud Debugger"
2. Open DevTools (F12)
3. Go to "Experience Cloud Debugger" tab
4. See all analytics calls

### 3. Browser Console

Check for errors:
```javascript
// In browser console
if (window.s) {
  console.log('Adobe Analytics object:', window.s);
}
```

---

## Best Practices

✅ **DO:**
- Track meaningful user actions
- Use consistent variable names
- Set page name for every page
- Include product info in commerce events
- Test before going to production
- Review data in Analytics dashboard regularly

❌ **DON'T:**
- Track personally identifiable information (PII)
- Send sensitive data
- Track every click (causes data bloat)
- Use undefined variables
- Forget to call `s.t()` or `s.tl()`

---

## Sample Reporting

After implementing tracking, you can create reports:

1. **Traffic Report:** Users, page views, bounce rate
2. **Product Report:** Most viewed products, conversion rates
3. **Search Report:** Top search terms, search results
4. **Commerce Report:** Revenue, transactions, average order value
5. **Funnel Report:** Users by checkout step
6. **Cohort Analysis:** User groups by acquisition date

---

## Troubleshooting

### Issue: Data not showing in Adobe Analytics
- **Check if Analytics tag is loaded:** Open DevTools, go to Network tab, filter for Adobe
- **Verify Tracking ID:** Ensure correct ID in implementation
- **Check for JavaScript errors:** Look in browser console
- **Verify eVars are allocated:** Check Admin settings in Analytics dashboard

### Issue: Some events not tracking
- **Check event numbers:** Make sure you're using unallocated events
- **Verify linkTrackVars:** Ensure variables are included in `linkTrackVars`
- **Check timing:** Events may need slight delay before page navigation

### Issue: User ID not persisting
- **Set visitorID on every page:** Not just after login
- **Use consistent identifier:** Don't change user ID format
- **Check cookie settings:** Ensure cookies are enabled

---

## Production Deployment

When deploying to production:

1. Update Launch property environment
2. Change tracking ID if needed
3. Update domain/CNAME
4. Test data collection thoroughly
5. Monitor dashboards for 24 hours
6. Adjust report suites if needed

---

## Additional Resources

- Adobe Analytics Docs: https://experienceleague.adobe.com/docs/analytics
- Launch Documentation: https://experienceleague.adobe.com/docs/launch
- Analytics Debugger: https://experienceleague.adobe.com/docs/debugger
- Best Practices: https://experienceleague.adobe.com/docs/analytics/implementation

---

## Next Steps

1. ✅ Set up Adobe Analytics account
2. ✅ Choose implementation method (Launch or Direct)
3. ✅ Add tracking code to index.html or set up Launch
4. ✅ Customize eVars and Props for your business
5. ✅ Implement event tracking in components (code snippets provided)
6. ✅ Test with browser extension
7. ✅ Monitor data in Analytics dashboard
8. ✅ Create custom reports
9. ✅ Analyze user behavior
10. ✅ Optimize based on insights

---

The foundation is set! Just add your Adobe Analytics tracking code and implement the event calls where indicated throughout the application.
