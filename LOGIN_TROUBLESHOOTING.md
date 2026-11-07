# Login Server Error - Troubleshooting Guide
**Date:** April 4, 2026

## Issue Summary
Login attempts are returning server errors. The backend authentication endpoint has hardcoded test credentials.

---

## Root Cause Analysis

### Backend Authentication (main.go, lines 59-87)
The backend currently uses **hardcoded credentials** for testing:
```go
if loginReq.Email == "<admin-email>" && loginReq.Password == "<strong-admin-password>" {
    // Login successful
    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "token": "demo-jwt-token-" + loginReq.Email,
        "user": gin.H{
            "id": "1",
            "email": loginReq.Email,
            "name": "Admin User",
            "role": "admin",
        },
    })
    return
}

// Any other credentials return 401 Unauthorized
c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password"})
```

### Issues Identified
1. ❌ Only one hardcoded user account exists
2. ❌ No database integration for user authentication
3. ❌ No password hashing or encryption
4. ❌ No user registration system
5. ❌ No password reset functionality
6. ❌ No JWT token validation on protected routes

---

## Quick Fix - Test Login

### To Login Successfully Now:
**Email:** `<admin-email>`
**Password:** `<strong-admin-password>`

### Steps:
1. Go to http://localhost:3000/login
2. Enter email: `<admin-email>`
3. Enter password: `<strong-admin-password>`
4. Click "Sign In"
5. You should be redirected to `/admin` dashboard

---

## Error Messages You May See

### 1. "Invalid email or password"
- **Cause:** Email/password doesn't match hardcoded credentials
- **Solution:** Use the configured admin email and password

### 2. "Backend connection issue. Please try again later."
- **Cause:** Backend server is not running on port 8080
- **Solution:** Start backend with `go run main.go` in `d:/WIPPEL02/backend`

### 3. "Internal server error"
- **Cause:** Unexpected error in authentication process
- **Solution:** Check backend logs for detailed error message

### 4. "Email and password are required"
- **Cause:** Empty email or password field
- **Solution:** Fill in both fields before submitting

---

## Backend Status Check

### Verify Backend is Running:
```bash
# Test health endpoint
curl http://localhost:8080/api/health

# Expected response:
# {"status":"ok"}
```

### Check Backend Port:
The backend is configured to run on **port 8080** by default.

If you need to change the port, edit `d:/WIPPEL02/backend/main.go` and look for the port configuration.

---

## Frontend Configuration

### Environment Variables:
The frontend expects the backend URL to be:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

If this is not set, it defaults to `http://localhost:8080`.

### To Set Custom Backend URL:
Create `.env.local` in `d:/WIPPEL02/frontend/`:
```
NEXT_PUBLIC_BACKEND_URL=http://your-backend-url:8080
```

---

## API Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                                │
└─────────────────────────────────────────────────────────────┘

1. USER ENTERS CREDENTIALS
   ├─ Email: <admin-email>
   └─ Password: <strong-admin-password>

2. FRONTEND VALIDATION
   ├─ Check email format (must contain @)
   ├─ Check password length (min 8 chars)
   └─ Show error if validation fails

3. SUBMIT TO /api/auth/login
   └─ POST with JSON body

4. FRONTEND API ROUTE (app/api/auth/login/route.ts)
   ├─ Validate input
   ├─ Call backend: POST http://localhost:8080/api/auth/login
   └─ Handle response/errors

5. BACKEND AUTHENTICATION (main.go)
   ├─ Check if email matches the configured admin email
   ├─ Check if password matches the configured admin password
   ├─ If match: Return token + user data
   └─ If no match: Return 401 Unauthorized

6. FRONTEND HANDLES RESPONSE
   ├─ If success: Store token in localStorage
   ├─ Redirect to /admin dashboard
   └─ If error: Display error message

7. ADMIN DASHBOARD
   └─ User is logged in and can access admin features
```

---

## Detailed Error Handling

### Frontend Error Handling (login/page.tsx)
```typescript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe })
  });

  const data = await response.json();

  if (response.ok) {
    // Success - store token and redirect
    localStorage.setItem('auth-token', data.token);
    router.push('/admin');
  } else {
    // Error - display message
    setError(data.message || 'Invalid credentials');
  }
} catch (err) {
  // Network error
  setError('An error occurred. Please try again later.');
}
```

### Backend Error Handling (main.go)
```go
// 400 - Bad request (invalid JSON)
c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})

// 401 - Unauthorized (wrong credentials)
c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password"})

// 200 - Success
c.JSON(http.StatusOK, gin.H{
    "success": true,
    "token": "...",
    "user": {...}
})
```

---

## Next Steps - Production Implementation

### Phase 1: Database Integration
- [ ] Set up Parse Server or database
- [ ] Create users table/collection
- [ ] Implement user registration
- [ ] Hash passwords with bcrypt

### Phase 2: JWT Implementation
- [ ] Generate proper JWT tokens
- [ ] Add token expiration (7 days)
- [ ] Implement token refresh
- [ ] Validate tokens on protected routes

### Phase 3: Security
- [ ] Add rate limiting (5 attempts per 15 min)
- [ ] Implement CSRF protection
- [ ] Add email verification
- [ ] Implement password reset flow

### Phase 4: User Management
- [ ] Create admin user management
- [ ] Add role-based access control
- [ ] Implement user profiles
- [ ] Add activity logging

---

## Testing Checklist

- [ ] Backend is running on port 8080
- [ ] Frontend can reach backend at http://localhost:8080
- [ ] Login with `<admin-email>` / `<strong-admin-password>` works
- [ ] Token is stored in localStorage
- [ ] User is redirected to /admin
- [ ] Admin dashboard loads successfully
- [ ] Logout clears token and redirects to login
- [ ] Invalid credentials show error message
- [ ] Network errors are handled gracefully

---

## Common Issues & Solutions

### Issue: "Backend connection issue"
**Possible Causes:**
1. Backend is not running
2. Backend is on different port
3. Firewall blocking connection
4. CORS configuration issue

**Solutions:**
1. Start backend: `cd d:/WIPPEL02/backend && go run main.go`
2. Check port: `netstat -ano | findstr :8080`
3. Check firewall settings
4. Verify CORS headers in backend

### Issue: "Invalid email or password"
**Possible Causes:**
1. Wrong email address
2. Wrong password
3. Typo in credentials

**Solutions:**
1. Use the configured admin email
2. Use the configured admin password
3. Check for spaces or typos

### Issue: Token not stored
**Possible Causes:**
1. localStorage disabled
2. Token not returned from backend
3. Browser privacy mode

**Solutions:**
1. Check browser settings
2. Verify backend returns token
3. Use normal browsing mode

### Issue: Can't access admin dashboard
**Possible Causes:**
1. Token not stored
2. Token validation not implemented
3. User not authenticated

**Solutions:**
1. Check localStorage for auth-token
2. Implement token validation
3. Verify login was successful

---

## Debug Mode

### Enable Debug Logging:
Add this to frontend login (temporarily):
```typescript
console.log('Login attempt:', { email, password });
console.log('Response status:', response.status);
console.log('Response data:', data);
console.log('Token stored:', localStorage.getItem('auth-token'));
```

### Backend Debug:
Check console output when running:
```bash
go run main.go
```

Look for:
- Request received
- JSON parsing
- Credential check
- Response sent

---

## Support

### For Backend Issues:
- Check `d:/WIPPEL02/backend/main.go` line 59-87
- Verify port 8080 is available
- Check CORS configuration

### For Frontend Issues:
- Check `d:/WIPPEL02/frontend/app/login/page.tsx`
- Check `d:/WIPPEL02/frontend/app/api/auth/login/route.ts`
- Check browser console for errors

### For Database Issues:
- Currently using hardcoded credentials
- Need to implement Parse Server integration
- See BACKEND_SCHEMA.md for schema design

---

**Last Updated:** April 4, 2026
**Status:** Hardcoded test credentials active
**Next Review:** When database integration is implemented
