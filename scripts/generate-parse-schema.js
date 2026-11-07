#!/usr/bin/env node

'use strict';

/**
 * Idempotently creates or patches the Parse classes used by the application.
 * Credentials are read exclusively from backend/.env or the process environment.
 */

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const serverUrl = process.env.PARSE_SERVER_URL;
const appId = process.env.PARSE_APP_ID;
const masterKey = process.env.PARSE_MASTER_KEY;

const commonContentFields = {
  title: { type: 'String' },
  summary: { type: 'String' },
  url: { type: 'String' },
  category: { type: 'String' },
  publishedAt: { type: 'String' },
  status: { type: 'String' },
};

const schemas = [
  { className: '_User', fields: { fullName: { type: 'String' }, role: { type: 'String' } } },
  { className: 'Articles', fields: commonContentFields },
  { className: 'Publications', fields: commonContentFields },
  { className: 'Books', fields: commonContentFields },
  { className: 'Journals', fields: commonContentFields },
  { className: 'CV', fields: { cv_json: { type: 'String' } } },
  {
    className: 'Orders',
    fields: {
      name: { type: 'String' },
      email: { type: 'String' },
      company: { type: 'String' },
      service: { type: 'String' },
      budget: { type: 'String' },
      message: { type: 'String' },
      attachments: { type: 'Array' },
      mediaType: { type: 'String' },
      lang: { type: 'String' },
      status: { type: 'String' },
    },
  },
  {
    className: 'Contacts',
    fields: {
      name: { type: 'String' },
      email: { type: 'String' },
      phone: { type: 'String' },
      subject: { type: 'String' },
      message: { type: 'String' },
      privacy_agreement: { type: 'Boolean' },
      status: { type: 'String' },
      ip_address: { type: 'String' },
      user_agent: { type: 'String' },
    },
  },
];

if (!serverUrl || !appId || !masterKey) {
  console.error('PARSE_SERVER_URL, PARSE_APP_ID, and PARSE_MASTER_KEY are required.');
  process.exit(1);
}

function request(method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const req = https.request(new URL(pathname, serverUrl), {
      method,
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-Master-Key': masterKey,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
      timeout: 10_000,
    }, response => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        let parsed = {};
        try { parsed = data ? JSON.parse(data) : {}; } catch { parsed = { raw: data }; }
        resolve({ status: response.statusCode, data: parsed });
      });
    });
    req.on('timeout', () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function ensureSchema(schema) {
  const encodedName = encodeURIComponent(schema.className);
  const existing = await request('GET', `/parse/schemas/${encodedName}`);
  const method = existing.status === 200 ? 'PUT' : 'POST';
  const result = await request(method, `/parse/schemas/${encodedName}`, {
    className: schema.className,
    fields: schema.fields,
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`${schema.className}: ${result.data.error || `HTTP ${result.status}`}`);
  }
  console.log(`${method === 'POST' ? 'Created' : 'Patched'} ${schema.className}`);
}

async function exportSchema() {
  const response = await request('GET', '/parse/schemas');
  if (response.status !== 200) throw new Error(`Schema export failed with HTTP ${response.status}`);

  const exportDir = path.join(__dirname, '../exports');
  fs.mkdirSync(exportDir, { recursive: true });
  const filename = `parse-schema-${new Date().toISOString().slice(0, 10)}.json`;
  fs.writeFileSync(path.join(exportDir, filename), JSON.stringify({
    timestamp: new Date().toISOString(),
    server: serverUrl,
    classes: response.data.results || [],
  }, null, 2));
  console.log(`Exported exports/${filename}`);
}

(async () => {
  for (const schema of schemas) await ensureSchema(schema);
  await exportSchema();
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
