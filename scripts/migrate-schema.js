/**
 * Back4App Schema Migration Script
 * This script creates all necessary classes/tables in Back4App for the WIPPEL application
 * 
 * Usage: node scripts/migrate-schema.js
 */

const https = require('https');

// Back4App Configuration
const CONFIG = {
  serverURL: 'https://parseapi.back4app.com',
  appId: 'IyTGn3EuiQhg5aiCfYYIP8AnDAhRLGxpS7wmhicX',
  restKey: 'JIb3JlAyIDmXTwoFTnVOfQReMbHOmLuZY1rk1u3N',
  masterKey: 'gmcixonksAn1kHn2YLxAxPNn3oQLqNBDMVFfs8Kr'
};

// Schema Definitions
const SCHEMAS = [
  {
    className: 'Article',
    fields: [
      { name: 'title', type: 'String' },
      { name: 'url', type: 'String' },
      { name: 'summary', type: 'String' },
      { name: 'category', type: 'String' },
      { name: 'publishedAt', type: 'Date' },
      { name: 'content', type: 'String' },
      { name: 'featuredImage', type: 'File' },
      { name: 'author', type: 'Pointer', targetClass: '_User' },
      { name: 'status', type: 'String', defaultValue: 'draft' }
    ],
    classLevelPermissions: {
      find: { '*': true },
      get: { '*': true },
      create: [],
      update: [],
      delete: []
    }
  },
  {
    className: 'CV',
    fields: [
      { name: 'name', type: 'String' },
      { name: 'title', type: 'String' },
      { name: 'location', type: 'String' },
      { name: 'age', type: 'String' },
      { name: 'birthDate', type: 'Date' },
      { name: 'nationality', type: 'String' },
      { name: 'address', type: 'String' },
      { name: 'phone', type: 'String' },
      { name: 'email', type: 'String' },
      { name: 'profile', type: 'Array' },
      { name: 'skills', type: 'Array' },
      { name: 'languages', type: 'Array' },
      { name: 'hobbies', type: 'Array' },
      { name: 'contact', type: 'Object' },
      { name: 'links', type: 'Array' }
    ],
    classLevelPermissions: {
      find: { '*': true },
      get: { '*': true },
      create: [],
      update: [],
      delete: []
    }
  },
  {
    className: 'Order',
    fields: [
      { name: 'name', type: 'String' },
      { name: 'email', type: 'String' },
      { name: 'company', type: 'String' },
      { name: 'service', type: 'String' },
      { name: 'budget', type: 'String' },
      { name: 'message', type: 'String' },
      { name: 'attachments', type: 'Array' },
      { name: 'mediaType', type: 'String' },
      { name: 'lang', type: 'String', defaultValue: 'en' },
      { name: 'status', type: 'String', defaultValue: 'new' },
      { name: 'notes', type: 'String' }
    ],
    classLevelPermissions: {
      find: [],
      get: [],
      create: { '*': true },
      update: [],
      delete: []
    }
  },
  {
    className: 'Contact',
    fields: [
      { name: 'name', type: 'String' },
      { name: 'email', type: 'String' },
      { name: 'phone', type: 'String' },
      { name: 'subject', type: 'String' },
      { name: 'message', type: 'String' },
      { name: 'status', type: 'String', defaultValue: 'new' }
    ],
    classLevelPermissions: {
      find: [],
      get: [],
      create: { '*': true },
      update: [],
      delete: []
    }
  },
  {
    className: 'Project',
    fields: [
      { name: 'title', type: 'String' },
      { name: 'description', type: 'String' },
      { name: 'imageUrl', type: 'String' },
      { name: 'projectUrl', type: 'String' },
      { name: 'githubUrl', type: 'String' },
      { name: 'technologies', type: 'Array' },
      { name: 'category', type: 'String' },
      { name: 'featured', type: 'Boolean', defaultValue: false },
      { name: 'order', type: 'Number', defaultValue: 0 },
      { name: 'status', type: 'String', defaultValue: 'draft' }
    ],
    classLevelPermissions: {
      find: { '*': true },
      get: { '*': true },
      create: [],
      update: [],
      delete: []
    }
  }
];

// Helper function to make HTTP requests
function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, CONFIG.serverURL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'X-Parse-Application-Id': CONFIG.appId,
        'X-Parse-REST-API-Key': CONFIG.restKey,
        'X-Parse-Master-Key': CONFIG.masterKey,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject({ error: response, statusCode: res.statusCode });
          }
        } catch (e) {
          reject({ error: body, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Create a schema class
async function createSchema(schema) {
  try {
    console.log(`Creating schema for class: ${schema.className}`);
    
    // Convert fields to the format expected by Parse Schema API
    const fields = {};
    schema.fields.forEach(field => {
      const fieldDef = { type: field.type };
      if (field.defaultValue !== undefined) {
        fieldDef.defaultValue = field.defaultValue;
      }
      if (field.targetClass) {
        fieldDef.targetClass = field.targetClass;
      }
      fields[field.name] = fieldDef;
    });

    const data = {
      className: schema.className,
      fields: fields,
      classLevelPermissions: schema.classLevelPermissions
    };

    const result = await makeRequest('/parse/schemas/' + schema.className, 'POST', data);
    console.log(`✓ Successfully created schema for ${schema.className}`);
    return result;
  } catch (error) {
    if (error.statusCode === 400 && error.error.code === 103) {
      console.log(`⚠ Class ${schema.className} already exists, updating...`);
      // Try to update existing schema
      try {
        // Convert fields to the format expected by Parse Schema API
        const fields = {};
        schema.fields.forEach(field => {
          const fieldDef = { type: field.type };
          if (field.defaultValue !== undefined) {
            fieldDef.defaultValue = field.defaultValue;
          }
          if (field.targetClass) {
            fieldDef.targetClass = field.targetClass;
          }
          fields[field.name] = fieldDef;
        });

        const result = await makeRequest('/parse/schemas/' + schema.className, 'PUT', {
          className: schema.className,
          fields: fields,
          classLevelPermissions: schema.classLevelPermissions
        });
        console.log(`✓ Successfully updated schema for ${schema.className}`);
        return result;
      } catch (updateError) {
        console.error(`✗ Failed to update schema for ${schema.className}:`, updateError.error);
        throw updateError;
      }
    } else {
      console.error(`✗ Failed to create schema for ${schema.className}:`, error.error);
      throw error;
    }
  }
}

// Create admin user
async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      console.log('⚠ Skipping admin creation: ADMIN_EMAIL and ADMIN_PASSWORD are required');
      return null;
    }
    const adminData = {
      username: adminEmail,
      email: adminEmail,
      password: adminPassword,
      fullName: 'Admin User',
      role: 'admin'
    };

    // Check if user exists
    try {
      const where = encodeURIComponent(JSON.stringify({ username: adminEmail }));
      const existing = await makeRequest(`/parse/users?where=${where}`, 'GET');
      if (existing.results && existing.results.length > 0) {
        console.log('⚠ Admin user already exists');
        return existing.results[0];
      }
    } catch (e) {
      // User doesn't exist, proceed with creation
    }

    const result = await makeRequest('/parse/users', 'POST', adminData);
    console.log('✓ Successfully created admin user');
    return result;
  } catch (error) {
    if (error.statusCode === 400 && error.error.code === 202) {
      console.log('⚠ Admin user already exists');
    } else {
      console.error('✗ Failed to create admin user:', error.error);
    }
  }
}

// Main migration function
async function migrate() {
  console.log('=== Back4App Schema Migration ===');
  console.log(`Server: ${CONFIG.serverURL}`);
  console.log(`App ID: ${CONFIG.appId}`);
  console.log('');

  try {
    // Test connection
    console.log('Testing connection to Back4App...');
    await makeRequest('/parse/config', 'GET');
    console.log('✓ Connection successful\n');

    // Create all schemas
    for (const schema of SCHEMAS) {
      await createSchema(schema);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }

    // Create admin user
    await createAdminUser();

    console.log('\n=== Migration Complete ===');
    console.log('All schemas have been created/updated in Back4App');
    console.log('Admin user has been set up');
    console.log('\nNext steps:');
    console.log('1. Verify the schemas in Back4App Dashboard');
    console.log('2. Test the login functionality');
    console.log('3. Test the registration functionality');
    console.log('4. Test order and contact form submissions');

  } catch (error) {
    console.error('\n=== Migration Failed ===');
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
