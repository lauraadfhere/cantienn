#!/usr/bin/env node

/**
 * Parse Backend Connection Test Script
 * Tests connection to Parse Server and displays configuration status
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const PARSE_SERVER_URL = process.env.PARSE_SERVER_URL;
const PARSE_APP_ID = process.env.PARSE_APP_ID;
const PARSE_REST_KEY = process.env.PARSE_REST_KEY;
const PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

console.log('\n' + '='.repeat(60));
console.log('  WIPPEL Parse Backend Connection Test');
console.log('='.repeat(60) + '\n');

// Check environment variables
console.log('📋 Configuration Check:');
console.log(`  ✓ PARSE_SERVER_URL: ${PARSE_SERVER_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`  ✓ PARSE_APP_ID: ${PARSE_APP_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`  ✓ PARSE_REST_KEY: ${PARSE_REST_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`  ✓ PARSE_MASTER_KEY: ${PARSE_MASTER_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`  ✓ ADMIN_EMAIL: ${ADMIN_EMAIL}\n`);

// Validate configuration
if (!PARSE_SERVER_URL || !PARSE_APP_ID || !PARSE_REST_KEY) {
  console.error('❌ ERROR: Missing required Parse configuration!');
  console.error('   Please set PARSE_SERVER_URL, PARSE_APP_ID, and PARSE_REST_KEY in backend/.env\n');
  process.exit(1);
}

// Test connection
async function testConnection() {
  try {
    console.log('🔌 Testing Parse Server Connection...\n');

    const url = new URL('/parse/health', PARSE_SERVER_URL);
    
    return new Promise((resolve, reject) => {
      const request = https.get(url, {
        headers: {
          'X-Parse-Application-Id': PARSE_APP_ID,
          'X-Parse-REST-API-Key': PARSE_REST_KEY,
          'Content-Type': 'application/json'
        }
      }, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          if (response.statusCode === 200) {
            console.log('✅ Connection Successful!\n');
            console.log('📊 Server Response:');
            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Server: ${response.headers['server'] || 'Parse Server'}\n`);
            resolve(true);
          } else {
            console.log(`⚠️  Server Response: ${response.statusCode}\n`);
            resolve(false);
          }
        });
      });

      request.on('error', (error) => {
        console.error('❌ Connection Failed!');
        console.error(`   Error: ${error.message}\n`);
        reject(error);
      });

      request.setTimeout(5000, () => {
        request.destroy();
        console.error('❌ Connection Timeout (5s)\n');
        reject(new Error('Connection timeout'));
      });
    });
  } catch (error) {
    console.error('❌ Test Failed:', error.message, '\n');
    return false;
  }
}

// Fetch schema
async function fetchSchema() {
  try {
    console.log('📋 Fetching Parse Schema...\n');

    const url = new URL('/parse/schemas', PARSE_SERVER_URL);
    
    return new Promise((resolve, reject) => {
      const request = https.get(url, {
        headers: {
          'X-Parse-Application-Id': PARSE_APP_ID,
          'X-Parse-Master-Key': PARSE_MASTER_KEY,
          'Content-Type': 'application/json'
        }
      }, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          if (response.statusCode === 200) {
            const schema = JSON.parse(data);
            console.log('✅ Schema Retrieved!\n');
            console.log('📊 Database Classes:');
            
            if (schema.results && schema.results.length > 0) {
              schema.results.forEach((cls, idx) => {
                console.log(`   ${idx + 1}. ${cls.className}`);
                if (cls.fields) {
                  Object.keys(cls.fields).forEach(field => {
                    console.log(`      - ${field}: ${cls.fields[field].type}`);
                  });
                }
              });
            } else {
              console.log('   (No custom classes found)');
            }
            console.log('');
            resolve(schema);
          } else {
            console.log(`⚠️  Status: ${response.statusCode}\n`);
            resolve(null);
          }
        });
      });

      request.on('error', (error) => {
        console.error('❌ Schema Fetch Failed:', error.message, '\n');
        reject(error);
      });

      request.setTimeout(5000, () => {
        request.destroy();
        reject(new Error('Schema fetch timeout'));
      });
    });
  } catch (error) {
    console.error('❌ Schema Fetch Failed:', error.message, '\n');
    return null;
  }
}

// Main execution
(async () => {
  try {
    const connected = await testConnection();
    
    if (connected) {
      await fetchSchema();
      console.log('✅ All tests passed!\n');
      console.log('Admin Credentials:');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: (from ADMIN_PASSWORD env variable)\n`);
      process.exit(0);
    } else {
      console.log('⚠️  Connection test inconclusive. Check your Parse Server configuration.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal Error:', error.message);
    process.exit(1);
  }
})();
