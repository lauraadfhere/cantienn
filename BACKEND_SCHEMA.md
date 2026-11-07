# Backend Schema Documentation
**Last Updated:** April 4, 2026

## Overview
This document defines the data schema for the WAPPIL backend using Parse Server. All frontend forms must match these schemas for proper data submission.

---

## 1. Contact Model

### Schema Definition
```json
{
  "className": "Contact",
  "fields": {
    "name": {
      "type": "String",
      "required": true,
      "description": "Full name of the contact"
    },
    "email": {
      "type": "String",
      "required": true,
      "description": "Email address (must be valid format)"
    },
    "phone": {
      "type": "String",
      "required": false,
      "description": "Phone number (optional)"
    },
    "subject": {
      "type": "String",
      "required": true,
      "description": "Contact subject/category",
      "enum": ["General Inquiry", "Project Quote", "Technical Support", "Partnership", "Other"]
    },
    "message": {
      "type": "String",
      "required": true,
      "description": "Contact message (max 2000 characters)"
    },
    "privacy_agreement": {
      "type": "Boolean",
      "required": true,
      "description": "User agreement to privacy policy"
    },
    "status": {
      "type": "String",
      "required": true,
      "default": "new",
      "enum": ["new", "read", "responded", "closed"],
      "description": "Contact status"
    },
    "created_at": {
      "type": "Date",
      "required": true,
      "description": "Timestamp when contact was created"
    },
    "ip_address": {
      "type": "String",
      "required": false,
      "description": "IP address of submitter"
    },
    "user_agent": {
      "type": "String",
      "required": false,
      "description": "User agent of submitter"
    }
  }
}
```

### API Endpoint
- **POST** `/api/contacts` - Create new contact
- **GET** `/api/contacts` - Get all contacts (admin only)
- **GET** `/api/contacts/{id}` - Get specific contact (admin only)
- **PUT** `/api/contacts/{id}` - Update contact (admin only)
- **DELETE** `/api/contacts/{id}` - Delete contact (admin only)

### Example Request
```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -H "X-Parse-Application-Id: YOUR_APP_ID" \
  -H "X-Parse-REST-API-Key: YOUR_API_KEY" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+213 783 217 817",
    "subject": "Project Quote",
    "message": "I would like a quote for a web development project...",
    "privacy_agreement": true,
    "status": "new",
    "created_at": "2026-04-04T10:30:00Z",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
  }'
```

### Example Response
```json
{
  "objectId": "abc123def456",
  "createdAt": "2026-04-04T10:30:00.000Z",
  "updatedAt": "2026-04-04T10:30:00.000Z"
}
```

---

## 2. Order Model

### Schema Definition
```json
{
  "className": "Order",
  "fields": {
    "name": {
      "type": "String",
      "required": true,
      "description": "Customer name"
    },
    "email": {
      "type": "String",
      "required": true,
      "description": "Customer email"
    },
    "company": {
      "type": "String",
      "required": false,
      "description": "Company name"
    },
    "service": {
      "type": "String",
      "required": true,
      "description": "Service type"
    },
    "budget": {
      "type": "String",
      "required": false,
      "description": "Budget range"
    },
    "message": {
      "type": "String",
      "required": true,
      "description": "Order details/message"
    },
    "attachments": {
      "type": "Array",
      "required": false,
      "description": "Array of file URLs"
    },
    "media_type": {
      "type": "String",
      "required": false,
      "enum": ["picture", "pdf", "document"],
      "description": "Type of media attached"
    },
    "lang": {
      "type": "String",
      "required": false,
      "enum": ["en", "fr", "ar"],
      "description": "Language preference"
    },
    "status": {
      "type": "String",
      "required": true,
      "default": "pending",
      "enum": ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      "description": "Order status"
    },
    "created_at": {
      "type": "Date",
      "required": true,
      "description": "Order creation timestamp"
    }
  }
}
```

### API Endpoint
- **POST** `/api/orders` - Create new order
- **GET** `/api/orders` - Get all orders (admin only)
- **GET** `/api/orders/{id}` - Get specific order
- **PUT** `/api/orders/{id}` - Update order status

---

## 3. User Model (Authentication)

### Schema Definition
```json
{
  "className": "_User",
  "fields": {
    "username": {
      "type": "String",
      "required": true,
      "unique": true,
      "description": "Username for login"
    },
    "email": {
      "type": "String",
      "required": true,
      "unique": true,
      "description": "Email address"
    },
    "password": {
      "type": "String",
      "required": true,
      "description": "Hashed password"
    },
    "fullName": {
      "type": "String",
      "required": false,
      "description": "User's full name"
    },
    "role": {
      "type": "String",
      "required": false,
      "enum": ["user", "admin", "moderator"],
      "default": "user",
      "description": "User role"
    },
    "isEmailVerified": {
      "type": "Boolean",
      "required": false,
      "default": false,
      "description": "Email verification status"
    },
    "lastLogin": {
      "type": "Date",
      "required": false,
      "description": "Last login timestamp"
    }
  }
}
```

### API Endpoints
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/logout` - User logout
- **POST** `/api/auth/reset-password/request` - Request password reset
- **POST** `/api/auth/reset-password/verify` - Verify reset code
- **POST** `/api/auth/reset-password/confirm` - Confirm new password

---

## 4. Admin Dashboard Models

### Orders Admin Schema
```json
{
  "className": "Order",
  "adminFields": {
    "status": {
      "type": "String",
      "enum": ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      "description": "Update order status"
    },
    "assignedTo": {
      "type": "Pointer",
      "targetClass": "_User",
      "description": "Assigned admin user"
    },
    "notes": {
      "type": "String",
      "description": "Internal notes"
    },
    "updated_at": {
      "type": "Date",
      "description": "Last update timestamp"
    }
  }
}
```

### Contacts Admin Schema
```json
{
  "className": "Contact",
  "adminFields": {
    "status": {
      "type": "String",
      "enum": ["new", "read", "responded", "closed"],
      "description": "Contact status"
    },
    "response": {
      "type": "String",
      "description": "Admin response to contact"
    },
    "respondedBy": {
      "type": "Pointer",
      "targetClass": "_User",
      "description": "Admin who responded"
    },
    "responded_at": {
      "type": "Date",
      "description": "Response timestamp"
    }
  }
}
```

---

## 5. Validation Rules

### Contact Form Validation
```typescript
// Frontend validation (app/contact/page.tsx)
- name: Required, string, max 100 characters
- email: Required, valid email format
- phone: Optional, valid phone format
- subject: Required, must be from enum list
- message: Required, string, max 2000 characters
- privacy_agreement: Required, must be true
- captcha_answer: Required, must match captcha question

// Backend validation (app/api/contact/route.ts)
- All required fields must be present
- Email must match regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Phone must match regex: /^[\d\s\-\+\(\)]+$/ (if provided)
- Message length must be <= 2000 characters
- Privacy agreement must be true
```

### Order Form Validation
```typescript
- name: Required, string, max 100 characters
- email: Required, valid email format
- company: Optional, string, max 100 characters
- service: Required, string
- budget: Optional, string
- message: Required, string, max 5000 characters
- attachments: Optional, array of URLs
- media_type: Optional, must be from enum
- lang: Optional, must be from enum
```

### User Registration Validation
```typescript
- email: Required, valid email format, unique
- password: Required, min 8 characters, must contain:
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&*)
- fullName: Optional, string, max 100 characters
```

---

## 6. Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descriptive error message",
    "details": {
      "field": "error details"
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - User not authorized
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `SERVER_ERROR` - Internal server error
- `SERVICE_UNAVAILABLE` - Backend service unavailable

---

## 7. Security Requirements

### Authentication
- All protected endpoints require valid JWT token
- Token should be sent in Authorization header: `Authorization: Bearer {token}`
- Token expiration: 7 days
- Refresh token available for extending session

### Data Protection
- All sensitive data (passwords, tokens) must be hashed
- HTTPS required for all API calls
- CORS properly configured
- Rate limiting: 100 requests per minute per IP
- Input sanitization required

### Privacy
- GDPR compliant data handling
- User consent required for data collection
- Data retention policy: 1 year for contacts, 2 years for orders
- Right to deletion implemented

---

## 8. Database Indexes

### Recommended Indexes
```javascript
// Contact indexes
db.Contact.createIndex({ email: 1 });
db.Contact.createIndex({ status: 1 });
db.Contact.createIndex({ created_at: -1 });
db.Contact.createIndex({ email: 1, status: 1 });

// Order indexes
db.Order.createIndex({ email: 1 });
db.Order.createIndex({ status: 1 });
db.Order.createIndex({ created_at: -1 });
db.Order.createIndex({ email: 1, status: 1 });

// User indexes
db._User.createIndex({ email: 1 });
db._User.createIndex({ username: 1 });
db._User.createIndex({ lastLogin: -1 });
```

---

## 9. API Authentication

### Parse Server Headers Required
```
X-Parse-Application-Id: {YOUR_APP_ID}
X-Parse-REST-API-Key: {YOUR_REST_API_KEY}
Content-Type: application/json
```

### Environment Variables
```
PARSE_APP_ID=<your-parse-app-id>
PARSE_REST_API_KEY=<your-parse-rest-api-key>
PARSE_MASTER_KEY=<your-parse-master-key>
PARSE_SERVER_URL=https://parseapi.back4app.com
```

---

## 10. Testing Checklist

- [ ] Contact form submits successfully
- [ ] All validation rules enforced
- [ ] Error messages displayed correctly
- [ ] Data saved to Parse Server
- [ ] Confirmation email sent
- [ ] Admin dashboard displays contacts
- [ ] Admin can update contact status
- [ ] Admin can respond to contacts
- [ ] Data is properly sanitized
- [ ] Rate limiting works
- [ ] CORS headers correct

---

**Last Updated:** April 4, 2026
**Next Review:** April 11, 2026
