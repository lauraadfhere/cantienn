# Back4App Schema for WIPPEL Application

This document defines the complete database schema required for the WIPPEL web application on Back4App.

## Application Configuration

- **App ID**: `<your-parse-app-id>`
- **Server URL**: https://parseapi.back4app.com
- **Client Key**: `<your-parse-client-key>`
- **Master Key**: `<your-parse-master-key>`
- **JavaScript Key**: `<your-parse-javascript-key>`

## Classes/Tables

### 1. _User (Built-in Parse User Class)
Extend the built-in Parse User class with custom fields:

**Custom Fields:**
- `role` (String): User role - "admin", "user", "client"
- `fullName` (String): User's full name

**Default Parse Fields:**
- `username` (String): Unique username (will use email)
- `email` (String): User email address
- `password` (String): Encrypted password
- `sessionToken` (String): Active session token
- `createdAt` (DateTime): Account creation date
- `updatedAt` (DateTime): Last update date

**Permissions:**
- Public: Read (none), Write (none)
- Authenticated: Read (own), Write (own)
- Admin: Read (all), Write (all)

### 2. Article
Stores blog articles and content.

**Fields:**
- `title` (String, Required): Article title
- `url` (String): URL slug for the article
- `summary` (String): Article summary/excerpt
- `category` (String): Article category (e.g., "Tech", "Business", "Design")
- `publishedAt` (DateTime): Publication date
- `content` (String): Full article content (HTML/Markdown)
- `featuredImage` (File): Featured image for article
- `author` (Pointer to _User): Article author
- `status` (String): "draft", "published", "archived"
- `createdAt` (DateTime): Auto-generated
- `updatedAt` (DateTime): Auto-generated

**Permissions:**
- Public: Read (published only), Write (none)
- Authenticated: Read (published), Write (none)
- Admin: Read (all), Write (all)

**Indexes:**
- `category` (ascending)
- `publishedAt` (descending)
- `status` (ascending)

### 3. CV
Stores CV/resume data.

**Fields:**
- `name` (String, Required): Full name
- `title` (String): Professional title
- `location` (String): Location
- `age` (String): Age
- `birthDate` (Date): Birth date
- `nationality` (String): Nationality
- `address` (String): Physical address
- `phone` (String): Phone number
- `email` (String): Email address
- `profile` (Array): Array of profile summary strings
- `skills` (Array): Array of skill strings
- `languages` (Array): Array of language strings
- `hobbies` (Array): Array of hobby strings
- `contact` (Object): Contact information object
- `links` (Array): Array of link strings
- `createdAt` (DateTime): Auto-generated
- `updatedAt` (DateTime): Auto-generated

**Permissions:**
- Public: Read, Write (none)
- Admin: Read, Write

**Note:** Only one CV record should exist.

### 4. Order
Stores project/service orders.

**Fields:**
- `name` (String, Required): Client name
- `email` (String, Required): Client email
- `company` (String): Company name
- `service` (String, Required): Service package selected
- `budget` (String): Budget range
- `message` (String): Project details/message
- `attachments` (Array): Array of file URLs
- `mediaType` (String): Type of media/files
- `lang` (String): Language preference (en, fr, ar)
- `status` (String): "new", "contacted", "in_progress", "completed", "cancelled"
- `notes` (String): Admin notes
- `createdAt` (DateTime): Auto-generated
- `updatedAt` (DateTime): Auto-generated

**Permissions:**
- Public: Write (create only), Read (none)
- Authenticated: Write (own), Read (own)
- Admin: Read (all), Write (all)

**Indexes:**
- `status` (ascending)
- `createdAt` (descending)
- `email` (ascending)

### 5. Contact
Stores contact form submissions.

**Fields:**
- `name` (String, Required): Contact name
- `email` (String, Required): Contact email
- `phone` (String): Phone number
- `subject` (String, Required): Subject line
- `message` (String, Required): Message content
- `status` (String): "new", "read", "replied", "archived"
- `createdAt` (DateTime): Auto-generated
- `updatedAt` (DateTime): Auto-generated

**Permissions:**
- Public: Write (create only), Read (none)
- Admin: Read (all), Write (all)

**Indexes:**
- `status` (ascending)
- `createdAt` (descending)
- `email` (ascending)

### 6. Project
Stores portfolio projects.

**Fields:**
- `title` (String, Required): Project title
- `description` (String): Project description
- `imageUrl` (String): Project image URL
- `projectUrl` (String): Live project URL
- `githubUrl` (String): GitHub repository URL
- `technologies` (Array): Array of technology strings
- `category` (String): Project category
- `featured` (Boolean): Featured project flag
- `order` (Number): Display order
- `status` (String): "draft", "published"
- `createdAt` (DateTime): Auto-generated
- `updatedAt` (DateTime): Auto-generated

**Permissions:**
- Public: Read (published only), Write (none)
- Admin: Read (all), Write (all)

**Indexes:**
- `featured` (descending)
- `order` (ascending)
- `status` (ascending)

## Setup Instructions

### 1. Create the App in Back4App
1. Log in to Back4App (https://back4app.com)
2. Create a new app named "WIPPEL"
3. Note down the App ID, Client Key, Master Key, and JavaScript Key

### 2. Configure Classes
For each class listed above:
1. Go to Dashboard > Data > Browser
2. Create a new class with the specified name
3. Add each field with the correct data type
4. Set the permissions as specified
5. Create indexes where specified

### 3. Set Up Cloud Code (Optional)
If you need server-side validation or triggers:
1. Go to Dashboard > Cloud Code
2. Create functions for:
   - `beforeSave` for Order and Contact (validation)
   - `afterSave` for Order (send email notifications)

### 4. Configure Security
1. Go to Dashboard > Security
2. Set up IP restrictions if needed
3. Configure rate limiting
4. Enable email verification for users (optional)

### 5. Test the Connection
Use the provided test script to verify the connection:
```bash
node scripts/test-parse-connection.js
```

## Data Seeding

### Initial Admin User
Create an admin user with:
- Email: `<admin-email>`
- Password: `<strong-admin-password>`
- Role: admin

### Initial CV Data
Create one CV record with the profile information.

### Sample Articles
Create 2-3 sample articles for testing.

## Maintenance

### Regular Tasks
- Monitor data usage in Back4App dashboard
- Backup data regularly
- Review and optimize indexes
- Update permissions as needed
- Monitor API usage and limits

### Scaling Considerations
- Back4App free tier has limits on requests and storage
- Monitor usage and upgrade plans as needed
- Implement caching for frequently accessed data
- Consider CDN for static assets

## API Endpoints Reference

The backend Go service will interact with these classes using the Parse REST API:
- GET/POST /parse/classes/{ClassName}
- GET/PUT/DELETE /parse/classes/{ClassName}/{ObjectId}
- POST /parse/login (authentication)
- POST /parse/classes/_User (user registration)

## Security Notes

1. **Never expose Master Key** in frontend code
2. Use Client Key for frontend operations
3. Implement proper row-level security (RLS)
4. Validate all data on both client and server
5. Use HTTPS for all API calls
6. Implement rate limiting to prevent abuse
7. Regular security audits of permissions

## Troubleshooting

### Common Issues
- **Connection errors**: Verify API keys and server URL
- **Permission errors**: Check class-level and row-level permissions
- **Query performance**: Add indexes for frequently queried fields
- **Storage limits**: Monitor file uploads and data size

### Debug Mode
Enable Parse logging in development:
```go
log.Printf("[Parse] Request: %s %s", method, path)
log.Printf("[Parse] Response: %s", string(data))
```

## Support
For Back4App specific issues:
- Documentation: https://www.back4app.com/docs
- Community: https://community.back4app.com
- Status: https://status.back4app.com
