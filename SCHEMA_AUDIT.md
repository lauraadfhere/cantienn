# WIPPEL02 Schema & Variables Audit
**Date:** April 5, 2026  
**Source:** Extracted from D:\WIPPEL original app

---

## Environment Variables

### Back4App / Parse Server Configuration
| Variable | WIPPEL Value | WIPPEL02 Status | Notes |
|----------|--------------|-----------------|-------|
| `BACK4APP_SERVER_URL` | `https://parseapi.back4app.com` | ✅ To Use | Parse server endpoint |
| `BACK4APP_APP_ID` | `<your-parse-app-id>` | ✅ To Use | Application ID |
| `BACK4APP_JS_KEY` | `<your-parse-javascript-key>` | ✅ To Use | JavaScript key |
| `BACK4APP_MASTER_KEY` | `<your-parse-master-key>` | ✅ To Use | Master key for write ops |
| `BACK4APP_REST_API_KEY` | `<your-parse-rest-api-key>` | ✅ To Use | REST API key |

### Server Configuration
| Variable | WIPPEL Value | WIPPEL02 Status | Notes |
|----------|--------------|-----------------|-------|
| `PORT` | `9050` | ✅ Configured | Backend server port |
| `HOST` | `0.0.0.0` | ⚠️ Not Set | Production host binding |
| `GIN_MODE` | `release` (prod) | ⚠️ Not Set | Gin framework mode |
| `GO_ENV` | `production` (prod) | ⚠️ Not Set | Go environment |

### Admin Configuration
| Variable | WIPPEL Value | WIPPEL02 Status | Notes |
|----------|--------------|-----------------|-------|
| `ADMIN_EMAIL` | `<admin-email>` | ⚠️ Configure | Do not commit account identifiers |
| `ADMIN_PASSWORD` | `<strong-admin-password>` | ⚠️ Configure | Use a unique strong password |

### Cloudinary Configuration
| Variable | WIPPEL Value | WIPPEL02 Status | Notes |
|----------|--------------|-----------------|-------|
| `CLOUDINARY_CLOUD_NAME` | `<your-cloudinary-cloud-name>` | ⚠️ Not Set | Image hosting |
| `CLOUDINARY_API_KEY` | `<your-cloudinary-api-key>` | ⚠️ Not Set | API key |
| `CLOUDINARY_API_SECRET` | `<your-cloudinary-api-secret>` | ⚠️ Not Set | API secret |

### SMTP Configuration
| Variable | WIPPEL Value | WIPPEL02 Status | Notes |
|----------|--------------|-----------------|-------|
| `SMTP_HOST` | `mail.smtp2go.com` | ⚠️ Not Set | Email server |
| `SMTP_PORT` | `465` | ⚠️ Not Set | SMTP port |
| `SMTP_USERNAME` | `<your-smtp-username>` | ⚠️ Not Set | SMTP user |
| `SMTP_PASSWORD` | `<your-smtp-password>` | ⚠️ Not Set | SMTP password |
| `SMTP_FROM` | `<your-smtp-from-address>` | ⚠️ Not Set | From email |

### Site Configuration
| Variable | WIPPEL Value | WIPPEL02 Status | Notes |
|----------|--------------|-----------------|-------|
| `SITE_URL` | `https://wappil.com` | ⚠️ Not Set | Production URL |
| `SITE_NAME` | Not specified | ✅ Set to `WIPPEL` | Site name |

---

## Parse/Back4App Database Schema

### Class 1: Articles
**Purpose:** Store blog articles, reports, and journal entries

**Fields:**
```json
{
  "category": "String",      // "Articles", "Reports", or "Journals"
  "title": "String",         // Article title
  "url": "String",           // Link to the article
  "summary": "String",       // Brief description
  "publishedAt": "String"    // Publication date (YYYY-MM-DD)
}
```

**Class Level Permissions (CLP):**
- Find: Public Read
- Get: Public Read
- Create: Master Key Only
- Update: Master Key Only
- Delete: Master Key Only

**WIPPEL02 Status:** ✅ Implemented in `ParseService.fetchArticles()` and `UpsertArticle()`

---

### Class 2: CV
**Purpose:** Store CV data as JSON

**Fields:**
```json
{
  "cv_json": "String"        // Complete CV data in JSON format
}
```

**Class Level Permissions (CLP):**
- Find: Public Read
- Get: Public Read
- Create: Master Key Only
- Update: Master Key Only
- Delete: Master Key Only

**WIPPEL02 Status:** ✅ Implemented in `ParseService.fetchCV()`

---

### Class 3: Orders
**Purpose:** Store client project requests from the contact form

**Fields:**
```json
{
  "name": "String",          // Client name
  "email": "String",         // Client email
  "company": "String",       // Company name (optional)
  "service": "String",       // Requested service
  "budget": "String",        // Project budget
  "message": "String",       // Additional details
  "lang": "String"           // Language preference (en/fr/ar)
}
```

**Class Level Permissions (CLP):**
- Find: Master Key Only
- Get: Master Key Only
- Create: **Public** (allow anyone to submit orders)
- Update: Master Key Only
- Delete: Master Key Only

**WIPPEL02 Status:** ✅ Implemented in `ParseService.CreateOrder()` and `ListOrders()`

---

### Class 4: Contacts (WIPPEL02 Addition)
**Purpose:** Store contact form submissions

**Fields:**
```json
{
  "name": "String",
  "email": "String",
  "phone": "String",
  "subject": "String",
  "message": "String",
  "privacy_agreement": "Boolean",
  "status": "String",        // "new", "read", "responded", "closed"
  "created_at": "Date",
  "ip_address": "String",
  "user_agent": "String"
}
```

**Class Level Permissions (CLP):**
- Find: Master Key Only
- Get: Master Key Only
- Create: **Public**
- Update: Master Key Only
- Delete: Master Key Only

**WIPPEL02 Status:** ✅ Implemented in `ParseService.CreateContact()` and `ListContacts()`

---

## Backend API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (WIPPEL02 only)
- `POST /api/auth/reset-password/request` - Request password reset
- `POST /api/auth/reset-password/verify` - Verify reset code
- `POST /api/auth/reset-password/confirm` - Confirm new password

### Content Management
- `GET /api/cv` - Fetch CV data
- `GET /api/articles` - List all articles
- `POST /api/articles` - Create article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)

### Orders & Contacts
- `POST /api/order` - Submit project order
- `POST /api/contacts` - Submit contact form
- `GET /api/admin/orders` - List orders (admin)
- `PATCH /api/admin/orders/:id` - Update order status (admin)
- `DELETE /api/admin/orders/:id` - Delete order (admin)
- `GET /api/admin/contacts` - List contacts (admin)
- `PATCH /api/admin/contacts/:id` - Update contact status (admin)
- `DELETE /api/admin/contacts/:id` - Delete contact (admin)

---

## Frontend Configuration

### Environment Variables (WIPPEL02)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9050
```

### Logo & Branding
- **Logo File:** `/images/LOGO9.png`
- **Logo Size (Admin):** 160x42px (displayed as h-10)
- **Logo Size (Header):** 120x32px (displayed as h-8)
- **Logo Size (Footer):** 120x40px

### Color Scheme
- **Accent Color:** `#ffed00` (yellow)
- **Primary Brand:** `#2557a7` (blue)
- **Admin Header:** White with gray border
- **Footer:** Dark gray `#4a4a4a` with bottom bar `#2a2a2a`

### Typography
- **Primary Font:** Open Sans (admin pages)
- **Secondary Font:** Work Sans, Schibsted Grotesk
- **Display Font:** Publica Slab

---

## Recommendations for WIPPEL02

### ✅ Already Implemented
1. Parse/Back4App integration
2. Article, CV, Order, Contact classes
3. API endpoints for all CRUD operations
4. Admin dashboard with management tools
5. Logo updated to LOGO9.png
6. Accent color set to #ffed00

### ⚠️ To Implement
1. **Cloudinary Integration** - For image uploads
   - Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to backend `.env`
   - Implement image upload endpoints

2. **SMTP Email Configuration** - For transactional emails
   - Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM` to backend `.env`
   - Implement email service for order/contact notifications

3. **Production Environment Variables**
   - Set `HOST`, `GIN_MODE`, `GO_ENV` for production deployment
   - Update `SITE_URL` to production domain

4. **Admin Credentials**
   - Set `ADMIN_EMAIL` to `<admin-email>`
   - Update `ADMIN_PASSWORD` from hardcoded to secure value

5. **Back4App Credentials** - Create `.env` files
   - Backend: `d:/WIPPEL02/backend/.env`
   - Frontend: `d:/WIPPEL02/frontend/.env.local`

---

## Files to Create/Update

### Backend `.env` File
**Location:** `d:/WIPPEL02/backend/.env`
```env
# Server
PORT=9050
SITE_NAME=WIPPEL
SITE_URL=http://localhost:9050
ADMIN_EMAIL=<admin-email>

# Parse/Back4App
PARSE_SERVER_URL=https://parseapi.back4app.com
PARSE_APP_ID=<your-parse-app-id>
PARSE_REST_KEY=<your-parse-rest-api-key>
PARSE_MASTER_KEY=<your-parse-master-key>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# SMTP
SMTP_HOST=mail.smtp2go.com
SMTP_PORT=465
SMTP_USER=<your-smtp-username>
SMTP_PASS=<your-smtp-password>
SMTP_FROM=<your-smtp-from-address>
SMTP_ADMIN_TO=<admin-email>
```

### Frontend `.env.local` File
**Location:** `d:/WIPPEL02/frontend/.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9050
```

---

## Summary

**Total Variables Identified:** 25  
**Already Configured:** 8  
**Missing/Needs Update:** 17  

**Priority:** High - Cloudinary and SMTP are critical for production functionality.
