# E-commerce Platform - User Guide

Welcome to your e-commerce platform! This guide will help you manage your online store efficiently.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Admin Panel Overview](#admin-panel-overview)
3. [Managing Products](#managing-products)
4. [Managing Orders](#managing-orders)
5. [Dashboard & Analytics](#dashboard--analytics)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Panel

1. Navigate to your store's admin URL: `https://yourstore.com/admin`
2. Enter your admin credentials
3. You'll be redirected to the dashboard

### First Steps

After logging in, you should:
1. Review the dashboard to see your store's current status
2. Add your first products
3. Configure your store settings
4. Test the checkout process

---

## Admin Panel Overview

The admin panel consists of three main sections:

### 1. Dashboard
- **Total Sales**: View your all-time revenue from completed orders
- **Pending Orders**: See orders that need attention (paid or processing status)
- **Total Products**: Your current inventory count
- **Low Stock Alerts**: Products with less than 5 units remaining
- **Recent Orders**: Quick view of your last 5 orders

### 2. Products
Manage your product catalog, including adding, editing, and removing products.

### 3. Orders
View and manage customer orders, update order statuses, and send automated notifications.

---

## Managing Products

### Adding a New Product

1. Click **"Products"** in the sidebar navigation
2. Click the **"Add Product"** button (top right)
3. Fill in the product details:
   - **Title**: Product name (required)
   - **Description**: Detailed product information (optional)
   - **Price**: Product price in USD (required)
   - **Category**: Product category (required)
   - **Stock**: Available inventory quantity (required)
   - **Image**: Upload a product photo (optional but recommended)
4. Click **"Create Product"** to save

**Tips:**
- Use high-quality images (recommended: 600x600px)
- Write clear, descriptive titles
- Include detailed descriptions to help customers make informed decisions
- Keep stock quantities accurate to avoid overselling

### Editing a Product

1. Go to **"Products"** page
2. Find the product you want to edit
3. Click **"Edit"** button next to the product
4. Update the desired fields
5. Click **"Update Product"** to save changes

**Note:** Changing the price doesn't affect existing orders, only new purchases.

### Uploading Product Images

1. When creating or editing a product, click **"Choose File"** in the image section
2. Select an image from your computer (JPG, PNG, or WebP)
3. The image will be automatically uploaded to secure cloud storage
4. The product card will display your image in the store

**Image Guidelines:**
- Maximum file size: 5MB
- Recommended dimensions: 600x600px (square format)
- Supported formats: JPG, PNG, WebP
- Use clear, well-lit photos with neutral backgrounds

### Deleting a Product

1. Go to **"Products"** page
2. Find the product you want to remove
3. Click **"Delete"** button
4. Confirm the deletion

**Warning:** Deleting a product is permanent. However, past orders containing this product will remain intact.

### Managing Stock

Stock is automatically decremented when:
- A customer completes a purchase (payment confirmed)
- PayPal captures the payment

Stock is NOT decremented when:
- A customer adds items to cart
- A customer views the checkout page
- Payment fails or is cancelled

**Low Stock Alerts:**
- Products with less than 5 units show a warning in the dashboard
- Consider restocking when you see these alerts
- Update stock quantities manually when receiving new inventory

---

## Managing Orders

### Viewing Orders

1. Click **"Orders"** in the sidebar navigation
2. You'll see a list of all orders with:
   - Order ID (short format)
   - Order date and time
   - Customer name and email
   - Total amount
   - Current status
   - Action buttons

### Filtering Orders

Use the filter options to find specific orders:

**Search by Email:**
- Type a customer's email in the search box
- Results update automatically as you type

**Filter by Status:**
- Select a status from the dropdown menu
- Options: All Status, Pending, Paid, Processing, Shipped, Ready for Pickup, Completed, Cancelled

### Order Status Guide

| Status | Meaning | When to Use |
|--------|---------|-------------|
| **Pending** | Order created but payment not confirmed | Automatic - system sets this |
| **Paid** | Payment confirmed, ready for processing | Automatic - system sets this |
| **Processing** | Order is being prepared/packaged | Update manually when you start preparing the order |
| **Shipped** | Order has been shipped to customer | Update when you hand off to shipping carrier |
| **Ready for Pickup** | Order is ready for customer pickup | For local pickup orders |
| **Completed** | Order fulfilled and delivered | Update when delivery is confirmed |
| **Cancelled** | Order was cancelled | For cancelled or refunded orders |

### Updating Order Status

1. Find the order in the orders list
2. Click the **"Update Status"** dropdown next to the order
3. Select the new status from the list
4. The status updates immediately

**Important:** When you update an order status, the customer automatically receives an email notification with the new status. No need to manually notify them!

### Viewing Order Details

1. Find the order you want to view
2. Click **"View Details"** button
3. A modal will open showing:

**Customer Information:**
- Full name
- Email address

**Shipping Address:**
- Complete delivery address
- City, postal code, and country

**Order Items:**
- Product names and images
- Quantities and prices
- Subtotals for each item

**Payment Information:**
- Order total
- Payment method (PayPal)
- Payment ID (with link to PayPal dashboard)

4. Click **"Close"** to return to the orders list

### Order Email Notifications

Customers automatically receive emails when:
- Order is confirmed (after payment)
- Order status changes (e.g., from Paid to Processing)

**Email Types:**
- **Order Confirmed**: Sent immediately after payment
- **Processing**: Sent when you mark order as processing
- **Shipped**: Includes tracking information (if provided)
- **Ready for Pickup**: Notifies customer to collect order
- **Completed**: Order fulfillment confirmation

You don't need to manually send emails - the system handles this automatically!

---

## Dashboard & Analytics

### Understanding Dashboard Metrics

**Total Sales Card:**
- Shows cumulative revenue from all completed orders
- Includes: Paid, Processing, Shipped, and Completed orders
- Updated in real-time

**Pending Orders Card:**
- Shows orders that need your attention
- Includes: Paid and Processing statuses
- These orders require action from you

**Total Products Card:**
- Current number of active products
- Includes all products regardless of stock level

**Low Stock Alerts Card:**
- Products with less than 5 units in stock
- Click to view which products need restocking
- Helps prevent stockouts

### Recent Orders Section

- Displays your last 5 orders
- Quick overview of customer name, email, total, and status
- Click **"View all"** to go to full orders page
- Helpful for monitoring recent activity

---

## Troubleshooting

### Common Issues and Solutions

#### "Can't log into admin panel"
- Verify your admin credentials are correct
- Check if cookies are enabled in your browser
- Try clearing your browser cache
- Contact your site administrator if issues persist

#### "Product image won't upload"
- Check file size (must be under 5MB)
- Ensure file format is JPG, PNG, or WebP
- Try a different browser
- Check your internet connection

#### "Stock isn't updating after order"
- Stock updates automatically when payment is confirmed
- Check the order status - it should be "Paid" or higher
- Pending orders don't affect stock
- Contact support if stock is still incorrect

#### "Customer didn't receive order email"
- Check the spam/junk folder
- Verify the email address in order details is correct
- Email notifications are sent automatically when status changes
- If issue persists, contact technical support

#### "Order status won't update"
- Refresh the page and try again
- Check your internet connection
- Ensure you're logged in as admin
- Contact support if problem continues

### Best Practices

1. **Check Orders Daily**: Review new orders at least once per day
2. **Update Status Promptly**: Keep customers informed by updating order status as soon as possible
3. **Monitor Stock Levels**: Review low stock alerts weekly
4. **Use Clear Product Descriptions**: Help customers make informed decisions
5. **Respond to Issues Quickly**: Address any customer concerns promptly

### Getting Help

If you encounter issues not covered in this guide:
1. Check the error message carefully
2. Try logging out and back in
3. Test in a different browser
4. Contact your technical support team

---

## Tips for Success

### Product Management
- Keep product information up-to-date
- Use high-quality images
- Write compelling descriptions
- Update prices seasonally or for promotions
- Remove discontinued products

### Order Fulfillment
- Process orders within 24 hours
- Update status immediately when shipping
- Double-check shipping addresses
- Keep customers informed
- Handle issues professionally

### Inventory Management
- Monitor low stock alerts
- Plan ahead for popular items
- Update stock counts after restocking
- Consider safety stock levels
- Track best-selling products

---

**Need more help?** Contact your site administrator or technical support team.

**Version:** 1.0
**Last Updated:** December 2024
