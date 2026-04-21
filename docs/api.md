Backend API Guide
Base path: /api

Protected routes use: Authorization: Bearer <access_token>

After login, use data.user.role for frontend routing. For customer-owned routes, use data.customer.id.

Use POST /api/auth/refresh to rotate sessions and POST /api/auth/logout to revoke them.

Examples
POST /api/auth/register
Content-Type: application/json

{
"email": "customer@example.com",
"password": "strong-password",
"role": "customer",
"customer_type": "customer",
"contact_name": "Jane Doe"
}

{
"email": "contractor@example.com",
"password": "strong-password",
"role": "customer",
"customer_type": "contractor",
"company_name": "ABC Trading",
"contact_name": "Jane Doe",
"phone": "+63 900 000 0000",
"billing_address": "Billing address",
"shipping_address": "Shipping address"
}
POST /api/auth/login
Content-Type: application/json

{
"email": "user@example.com",
"password": "your-password"
}
POST /api/auth/refresh
Content-Type: application/json

{
"refresh_token": "<refresh_token>"
}
{
"status": "ok",
"statusCode": 200,
"statusMessage": "ok",
"data": {},
"total": 1,
"meta": {
"total": 10,
"page": 1,
"limit": 10,
"totalPages": 1
}
}
{
"status": "error",
"statusCode": 401,
"statusMessage": "unauthorized",
"data": null,
"message": "Invalid email or password",
"error": {
"code": "unauthorized",
"message": "Invalid email or password"
}
}
System
GET /api
access: public
note: This guide.
GET /api/health
access: public
note: Health check.
Auth
POST /api/auth/register
access: public
input: json or multipart/form-data: email, password, role(customer|driver), customer_type?(customer only), company_name?(customer only), contact_name, phone?, image_url? or profile image file, billing_address?, shipping_address?
note: Public signup is available for customer and driver only. Supplier accounts are admin-managed.
POST /api/auth/login
access: public
input: json: email, password
note: Use data.user.role for frontend routing. Customer logins include data.customer and supplier logins include data.supplier when linked records exist.
POST /api/auth/refresh
access: public
input: json: refresh_token
note: Returns a fresh session and refreshed user payload.
POST /api/auth/logout
access: bearer access token + json refresh_token
input: json: refresh_token, scope?
note: Revokes the current session by default. Use scope=global to revoke all sessions.
POST /api/auth/forgot-password
access: public
input: json: email, redirect_to?
note: Sends a password reset email through Supabase.
Account
GET /api/account
access: bearer: any authenticated active user
note: Returns the logged-in user's account plus related customer, driver, or supplier profile when available.
PATCH /api/account
access: bearer: any authenticated active user
input: json or multipart/form-data: email?, phone?, image_url? or profile image file, full_name?/name?/contact_name?, company_name?, billing_address?, shipping_address?, license_number?, vehicle_number?
note: Updates the logged-in user's own account. Allowed fields depend on the user's role.
POST /api/account/change-password
access: bearer: any authenticated active user
input: json: current_password, new_password
note: Changes the logged-in user's password after verifying the current password.
Users
GET /api/users
access: bearer: admin
input: query: q?, page?, limit?
note: Lists internal accounts only. Customers and drivers are excluded.
POST /api/users
access: bearer: admin
input: json or multipart/form-data: email, password, full_name, phone?, image_url? or profile image file, role
note: Creates internal accounts for the admin role. Use /api/suppliers for admin-managed supplier accounts, /api/drivers for admin-managed driver accounts, and /api/auth/register for customer or self-service driver signup.
GET /api/users/:id
access: bearer: admin
PATCH /api/users/:id
access: bearer: admin
input: json or multipart/form-data: email?, password?, full_name?, phone?, image_url? or profile image file, role?, is_active?
DELETE /api/users/:id
access: bearer: admin
Suppliers
GET /api/suppliers
access: bearer: admin
input: query: q?, page?, limit?
POST /api/suppliers
access: bearer: admin
input: json: email, password, business_name, contact_person, phone?, address?
note: Creates a supplier profile plus a linked auth/user account with the supplier role.
GET /api/suppliers/:id
access: bearer: admin
PATCH /api/suppliers/:id
access: bearer: admin
input: json: email?, password?, business_name?, contact_person?, phone?, address?, is_active?
DELETE /api/suppliers/:id
access: bearer: admin
Drivers
GET /api/drivers
access: bearer: admin
input: query: q?, page?, limit?
POST /api/drivers
access: bearer: admin
input: json or multipart/form-data: email, password, name, phone?, image_url? or profile image file, license_number?, vehicle_number?
note: Creates a driver profile plus a linked auth/user account with the driver role.
GET /api/drivers/:id
access: bearer: admin
PATCH /api/drivers/:id
access: bearer: admin
input: json or multipart/form-data: email?, password?, name?, phone?, image_url? or profile image file, license_number?, vehicle_number?, is_active?
DELETE /api/drivers/:id
access: bearer: admin
GET /api/drivers/:id/orders
access: bearer: driver owner or admin
input: query: q?, status?, from?, to?, page?, limit?
note: Drivers can only use their own driver id. Lists that driver's assigned orders together with their delivery records.
GET /api/drivers/:id/orders/:orderId
access: bearer: driver owner or admin
note: Drivers can only access order ids that are assigned to them. Returns a single assigned order plus its delivery details.
POST /api/drivers/:id/orders/:orderId/delivered
access: bearer: driver owner or admin
input: json: delivered_at?
note: Drivers can only mark their own assigned orders as delivered. Completes the delivery record and the related order workflow.
Categories
GET /api/categories
access: public
input: query: q?, page?, limit?
GET /api/categories/:id
access: public
POST /api/categories
access: bearer: admin
input: multipart/form-data: name, description, overview?, typical_uses[], buying_considerations[], featured_specs(json array)
PATCH /api/categories/:id
access: bearer: admin
input: json partial category fields
DELETE /api/categories/:id
access: bearer: admin
Products
GET /api/products
access: public
input: query: q?, category_id?, page?, limit?
GET /api/products/:id
access: public
POST /api/products
access: bearer: admin or supplier
input: multipart/form-data: category_id, sku, name, description?, image_url? or image file, unit, price, stock_quantity?, minimum_stock_quantity?, handbook(json), is_active?
PATCH /api/products/:id
access: bearer: admin or supplier
input: multipart/form-data partial product fields, optional image file
DELETE /api/products/:id
access: bearer: admin or supplier
GET /api/products/insights
access: bearer: admin or supplier
input: query: limit?
Customers
GET /api/customers
access: bearer: admin
input: query: q?, page?, limit?
POST /api/customers
access: bearer: admin
input: json or multipart/form-data: user_id?, customer_type, company_name, contact_name, phone?, email, image_url? or profile image file, billing_address?, shipping_address?
note: For public signup, use POST /api/auth/register.
GET /api/customers/:id
access: bearer: owner or customers:read
PATCH /api/customers/:id
access: bearer: owner or customers:write
input: json or multipart/form-data partial customer fields, optional profile image file
DELETE /api/customers/:id
access: bearer: admin
GET /api/customers/:id/addresses
access: bearer: owner or customers:read
input: query: q?, page?, limit?
note: Lists delivery addresses for a customer.
POST /api/customers/:id/addresses
access: bearer: owner or customers:write
input: json: street, city, province, postal_code?, country?, address_line?
note: Creates a delivery address for a customer.
GET /api/customers/:id/addresses/:addressId
access: bearer: owner or customers:read
PATCH /api/customers/:id/addresses/:addressId
access: bearer: owner or customers:write
input: json partial address fields: street?, city?, province?, postal_code?, country?, address_line?
DELETE /api/customers/:id/addresses/:addressId
access: bearer: owner or customers:write
Projects
GET /api/projects
access: bearer: contractor customer
note: Lists the authenticated contractor's own projects.
POST /api/projects
access: bearer: contractor customer
input: json: name, location?, description?, start_date?, end_date?, status?, progress?, budget?
GET /api/projects/:id
access: bearer: contractor customer
PATCH /api/projects/:id
access: bearer: contractor customer
input: json partial project fields
DELETE /api/projects/:id
access: bearer: contractor customer
GET /api/projects/:id/items
access: bearer: contractor customer
POST /api/projects/:id/items
access: bearer: contractor customer
input: json: product_id, quantity, unit_price?
PATCH /api/projects/:id/items/:itemId
access: bearer: contractor customer
input: json: quantity
DELETE /api/projects/:id/items/:itemId
access: bearer: contractor customer
POST /api/projects/:id/checkout
access: bearer: contractor customer
note: Creates a pending order from the project's stored items and updates project totals.
Cart
GET /api/cart
access: bearer: owner or cart:read
input: query: customer_id
POST /api/cart/items
access: bearer: owner or cart:write
input: json: customer_id, product_id, quantity
DELETE /api/cart/items/:id
access: bearer: owner or cart:write
input: query: customer_id
DELETE /api/cart
access: bearer: owner or cart:write
input: query: customer_id
POST /api/cart/checkout
access: bearer: owner or cart:write
input: json: customer_id, notes?
Orders
GET /api/orders
access: bearer: report roles, or owner when filtering by customer_id
input: query: q?, customer_id?, status?, from?, to?, page?, limit?
GET /api/orders/summary
access: bearer: report roles, or owner when filtering by customer_id
input: query: q?, customer_id?, status?, from?, to?
GET /api/orders/:id
access: bearer: owner or orders:read
POST /api/orders
access: bearer: owner or orders:write
input: json: customer_id, project_id?(contractors only), notes?, items[{ product_id, quantity }]
POST /api/orders/:id/approve
access: bearer: admin
input: json: approved_by?
POST /api/orders/:id/reject
access: bearer: admin
input: json: rejection_reason
Deliveries
GET /api/deliveries
access: bearer: report roles, order owner by order_id, or driver owner by driver_id
input: query: q?, order_id?, driver_id?, status?, from?, to?, page?, limit?
GET /api/deliveries/summary
access: bearer: report roles, order owner by order_id, or driver owner by driver_id
input: query: q?, order_id?, driver_id?, status?, from?, to?
POST /api/deliveries
access: bearer: admin
input: json: order_id, driver_id?, vehicle_number?, status?, scheduled_at?, delivered_at?
note: driver_id must be a driver record id from /api/drivers.
PATCH /api/deliveries/:id
access: bearer: admin or assigned driver
input: json: status, delivered_at?
note: Drivers can only update deliveries assigned to them.
Inventory
GET /api/inventory
access: bearer: admin or supplier
input: query: q?, product_id?, stock_status?, page?, limit?
GET /api/inventory/summary
access: bearer: admin or supplier
input: query: q?, product_id?
GET /api/inventory/movements
access: bearer: admin or supplier
input: query: q?, product_id?, movement_type?, from?, to?, page?, limit?
GET /api/inventory/movements/summary
access: bearer: admin or supplier
input: query: q?, product_id?, movement_type?, from?, to?
POST /api/inventory
access: bearer: admin or supplier
input: json: product_id, movement_type, quantity_change, reference_type?, reference_id?, note?, created_by?
note: reference_type and reference_id must be paired.
Payments
GET /api/payments
access: bearer: admin or order owner by order_id
input: query: q?, order_id?, status?, method?, from?, to?, page?, limit?
GET /api/payments/summary
access: bearer: admin or order owner by order_id
input: query: q?, order_id?, status?, method?, from?, to?
POST /api/payments
access: bearer: admin or order owner
input: json: order_id, amount, method, status?, transaction_ref?, paid_at?
PATCH /api/payments/:id
access: bearer: admin
input: json: status, transaction_ref?, paid_at?
Dashboard
GET /api/dashboard/summary
access: bearer: admin
GET /api/dashboard/recent-activity
access: bearer: admin
input: query: limit?
