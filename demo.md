# WIPPEL - Demo Test Users

## Test User Accounts for Prototype Testing

This document contains demo user credentials for testing the WIPPEL application prototype.

---

## Admin User

### Credentials
- **Email:** `admin@wippel.com`
- **Password:** `Admin@123456`
- **Role:** Administrator
- **Name:** Demo Admin
- **Status:** Active

### Access
- **Frontend URL:** http://localhost:3000/login
- **Admin Dashboard:** http://localhost:3000/admin
- **API Endpoint:** POST http://localhost:9050/api/auth/login

### Permissions
- Full system access
- User management
- Content management
- System configuration
- Analytics access

---

## Regular User

### Credentials
- **Email:** `user@wippel.com`
- **Password:** `User@123456`
- **Role:** User
- **Name:** Demo User
- **Status:** Active

### Access
- **Frontend URL:** http://localhost:3000/login
- **User Dashboard:** http://localhost:3000/dashboard
- **API Endpoint:** POST http://localhost:9050/api/auth/login

### Permissions
- View content
- Create orders
- Access personal dashboard
- Profile management

---

## Test User (Limited Access)

### Credentials
- **Email:** `test@wippel.com`
- **Password:** `Test@123456`
- **Role:** User
- **Name:** Test User
- **Status:** Active

### Access
- **Frontend URL:** http://localhost:3000/login
- **User Dashboard:** http://localhost:3000/dashboard
- **API Endpoint:** POST http://localhost:9050/api/auth/login

### Permissions
- Limited content access
- Basic functionality testing

---

## API Testing Examples

### Login Request (Admin)
```bash
curl -X POST http://localhost:9050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wippel.com",
    "password": "Admin@123456",
    "rememberMe": false
  }'
```

### Login Request (Regular User)
```bash
curl -X POST http://localhost:9050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@wippel.com",
    "password": "User@123456",
    "rememberMe": false
  }'
```

---

## Testing Checklist

### Frontend Testing
- [ ] Login with admin credentials
- [ ] Access admin dashboard
- [ ] Test user management
- [ ] Test content creation
- [ ] Login with regular user credentials
- [ ] Access user dashboard
- [ ] Test order creation
- [ ] Test profile management

### Backend API Testing
- [ ] Test authentication endpoints
- [ ] Test protected routes
- [ ] Test user CRUD operations
- [ ] Test order management
- [ ] Test AI chat functionality
- [ ] Test file uploads
- [ ] Test email notifications

---

## Notes for Testers

1. **Password Security:** These are demo credentials only. Never use these passwords in production.
2. **Data Persistence:** Test data may be reset during development.
3. **Session Management:** Sessions expire after 24 hours by default.
4. **Rate Limiting:** API endpoints may have rate limiting enabled.
5. **Error Handling:** Report any unexpected errors or bugs.

---

## Production Deployment

Before deploying to production:
1. Change all default passwords
2. Enable two-factor authentication
3. Implement proper password policies
4. Set up SSL/TLS certificates
5. Configure proper CORS settings
6. Enable security headers
7. Set up monitoring and logging
8. Configure backup systems

---

## Support

For issues or questions during testing:
- Check the application logs
- Review API documentation
- Contact the development team

---

**Last Updated:** August 3, 2026
**Version:** 1.0.0
