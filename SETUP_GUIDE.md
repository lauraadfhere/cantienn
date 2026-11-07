# WIPPEL Development Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install
cd ../backend && go mod download
```

### 2. Configure Environment Variables

#### Backend Configuration (backend/.env)
```env
# Server
PORT=9050
SITE_NAME=WIPPEL
SITE_URL=http://localhost:9050

# Admin Credentials
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<strong-admin-password>

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

#### Frontend Configuration (frontend/.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9050
```

### 3. Start Development Servers

#### Option A: Start Both Servers Together
```bash
npm run dev
```
This will start:
- **Backend**: http://localhost:9050
- **Frontend**: http://localhost:3000

#### Option B: Start Servers Separately
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

## Parse Backend Management

### Test Parse Connection
```bash
npm run parse:test
```
This will:
- ✅ Verify Parse Server configuration
- ✅ Test connection to Parse Server
- ✅ Display server status
- ✅ Show admin credentials

### Generate Parse Schema
```bash
npm run parse:schema
```
This will:
- ✅ Create required database classes (Articles, CV, Orders, Contacts)
- ✅ Set up all necessary fields
- ✅ Export schema to `exports/parse-schema-YYYY-MM-DD.json`
- ✅ Display schema summary

### Complete Setup (Test + Schema)
```bash
npm run parse:setup
```

## Admin Login

**Default Credentials** (from .env):
- **Email**: `<admin-email>`
- **Password**: `<strong-admin-password>`

Access admin dashboard at: http://localhost:3000/admin

## Build & Deployment

### Build for Production
```bash
npm run build
```

### Start Production Servers
```bash
npm run start
```

## Project Structure

```
WIPPEL02/
├── backend/                    # Go backend server
│   ├── main.go
│   ├── internal/
│   │   ├── config/            # Configuration management
│   │   ├── models/            # Data models
│   │   ├── service/           # Business logic
│   │   └── handlers/          # HTTP handlers
│   └── .env                   # Backend configuration
│
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── admin/             # Admin dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── ...
│   ├── public/images/         # Static images
│   └── .env.local             # Frontend configuration
│
├── scripts/                    # Utility scripts
│   ├── test-parse-connection.js
│   └── generate-parse-schema.js
│
├── package.json               # Root package configuration
└── SETUP_GUIDE.md            # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Content
- `GET /api/cv` - Fetch CV data
- `GET /api/articles` - List articles
- `POST /api/articles` - Create article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)

### Orders & Contacts
- `POST /api/order` - Submit project order
- `POST /api/contacts` - Submit contact form
- `GET /api/admin/orders` - List orders (admin)
- `PATCH /api/admin/orders/:id` - Update order (admin)
- `DELETE /api/admin/orders/:id` - Delete order (admin)
- `GET /api/admin/contacts` - List contacts (admin)
- `PATCH /api/admin/contacts/:id` - Update contact (admin)
- `DELETE /api/admin/contacts/:id` - Delete contact (admin)

## Troubleshooting

### Backend won't start
1. Check if port 9050 is already in use
2. Verify Go is installed: `go version`
3. Check .env file exists in backend/

### Frontend won't start
1. Check if port 3000 is already in use
2. Verify Node.js is installed: `node --version`
3. Run `npm install` in frontend/

### Parse connection fails
1. Run `npm run parse:test` to diagnose
2. Verify Parse credentials in backend/.env
3. Check internet connection to parseapi.back4app.com
4. Ensure PARSE_SERVER_URL is correct

### Admin login fails
1. Verify ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env
2. Check backend is running on http://localhost:9050
3. Clear browser cookies and try again

## Development Tips

- **Hot Reload**: Both backend and frontend support hot reload during development
- **Logs**: Check terminal output for detailed logs from both servers
- **Database**: Parse Server stores all data in Back4App cloud
- **Admin Panel**: Access at http://localhost:3000/admin after login

## Additional Resources

- [Parse Server Documentation](https://parseplatform.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Go Documentation](https://golang.org/doc/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues or questions, check:
1. Backend logs in terminal
2. Browser console (F12)
3. Network tab in DevTools
4. Parse Server dashboard at https://dashboard.back4app.com
