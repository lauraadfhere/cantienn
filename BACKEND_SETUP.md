# Backend Setup Guide for WIPPEL02

## Overview
The WIPPEL02 frontend expects a backend API running on `http://localhost:8080`. This guide explains how to set up and run the backend.

## Backend Options

### Option 1: Use the Old WIPPEL Backend (Recommended)
The old WIPPEL project at `D:\WIPPEL` contains a Go-based backend with all necessary configurations.

#### Steps:
1. Navigate to the old project:
   ```bash
   cd D:\WIPPEL
   ```

2. Install dependencies (if not already installed):
   ```bash
   go mod download
   ```

3. Configure environment variables:
   - Copy `.env` file or create one with the following:
   ```
   BACK4APP_SERVER_URL=https://parseapi.back4app.com
   BACK4APP_APP_ID=<your-parse-app-id>
   BACK4APP_JS_KEY=<your-parse-javascript-key>
   BACK4APP_MASTER_KEY=<your-parse-master-key>
   BACK4APP_REST_API_KEY=<your-parse-rest-api-key>
   ADMIN_EMAIL=<admin-email>
   ADMIN_PASSWORD=<strong-admin-password>
   PORT=9050
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   SMTP_HOST=mail.smtp2go.com
   SMTP_PORT=465
   SMTP_USERNAME=<your-smtp-username>
   SMTP_PASSWORD=<your-smtp-password>
   SMTP_FROM=<your-smtp-from-address>
   ```

4. Run the backend:
   ```bash
   go run main.go
   ```
   The backend will start on port 9050.

5. **Important**: Update the frontend environment variable to point to the correct backend port:
   - In `d:/WIPPEL02/frontend/.env.local` or `.env`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:9050
   ```

### Option 2: Use the New WIPPEL02 Backend (Go + Gin)
The new backend is located at `d:/WIPPEL02/backend`.

#### Steps:
1. Navigate to the backend:
   ```bash
   cd d:\WIPPEL02\backend
   ```

2. Install dependencies:
   ```bash
   go mod download
   ```

3. Create `.env` file with necessary configuration:
   ```
   PORT=8080
   BACK4APP_SERVER_URL=https://parseapi.back4app.com
   BACK4APP_APP_ID=<your-parse-app-id>
   BACK4APP_REST_API_KEY=<your-parse-rest-api-key>
   SMTP_HOST=mail.smtp2go.com
   SMTP_PORT=465
   SMTP_USERNAME=<your-smtp-username>
   SMTP_PASSWORD=<your-smtp-password>
   SMTP_FROM=<your-smtp-from-address>
   ```

4. Run the backend:
   ```bash
   go run main.go
   ```
   The backend will start on port 8080.

## Frontend Configuration

### Environment Variables
Create or update `d:/WIPPEL02/frontend/.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

Or if using the old WIPPEL backend on port 9050:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:9050
```

## Troubleshooting

### Error: "Backend server is not running on port 8080"
- **Cause**: The backend service is not running or not accessible
- **Solution**: 
  1. Ensure the backend is running: `go run main.go`
  2. Check the correct port is being used (8080 or 9050)
  3. Update `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local`
  4. Restart the frontend dev server: `npm run dev`

### Error: "Internal server error"
- **Cause**: Backend is running but API endpoint not found or database connection failed
- **Solution**:
  1. Check backend logs for detailed error messages
  2. Verify Back4App credentials in `.env`
  3. Ensure CORS is properly configured in backend

### Port Already in Use
If port 8080 or 9050 is already in use:
1. Find the process using the port:
   ```bash
   netstat -ano | findstr :8080
   ```
2. Kill the process:
   ```bash
   taskkill /PID <PID> /F
   ```
3. Or configure a different port in `.env` and update frontend accordingly

## API Endpoints

The backend should provide the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/reset-password/request` - Request password reset
- `POST /api/auth/reset-password/verify` - Verify reset code
- `POST /api/auth/reset-password/confirm` - Confirm new password
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact

## Development Workflow

1. **Start Backend**:
   ```bash
   cd d:\WIPPEL02\backend
   go run main.go
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd d:\WIPPEL02\frontend
   npm run dev
   ```

3. **Access Application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`

## Production Deployment

For production, ensure:
1. Backend is deployed to a stable server
2. Update `NEXT_PUBLIC_BACKEND_URL` to production backend URL
3. Configure CORS properly for production domain
4. Use HTTPS for all communications
5. Implement proper authentication and authorization
