'use strict';

const http = require('node:http');
const https = require('node:https');
const path = require('node:path');

if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile(path.join(__dirname, '..', '.env'));
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

const NVAPI_KEY = process.env.NVAPI_KEY;
const NVAPI_BASE_URL = process.env.NVAPI_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVAPI_MODEL = process.env.NVAPI_MODEL || 'qwen/qwen3-coder-480b-a35b-instruct';

function makeRequest(requestPath, data) {
    return new Promise((resolve, reject) => {
        const url = new URL(requestPath, `${NVAPI_BASE_URL.replace(/\/$/, '')}/`);
        const transport = url.protocol === 'http:' ? http : https;
        const request = transport.request(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${NVAPI_KEY}`,
                'Content-Type': 'application/json',
            },
        }, (response) => {
            let body = '';
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                let parsedBody = body;
                try {
                    parsedBody = JSON.parse(body);
                } catch (_) {
                    // Keep non-JSON responses available for local diagnostics.
                }
                resolve({ status: response.statusCode, data: parsedBody });
            });
        });

        request.on('error', reject);
        request.write(JSON.stringify(data));
        request.end();
    });
}

async function main() {
    if (!NVAPI_KEY) {
        console.error('NVAPI_KEY is required');
        process.exitCode = 1;
        return;
    }

    console.log(`Testing configured NVIDIA model: ${NVAPI_MODEL}`);
    console.log(`Base URL: ${NVAPI_BASE_URL}`);

    const startedAt = Date.now();
    const response = await makeRequest('chat/completions', {
        model: NVAPI_MODEL,
        messages: [{
            role: 'user',
            content: 'Respond with just "OK" to confirm the connection.',
        }],
        max_tokens: 10,
        stream: false,
    });

    if (response.status !== 200) {
        console.error(`NVIDIA request failed with status ${response.status}`);
        if (response.data && response.data.error) {
            console.error(response.data.error.message || 'The API returned an error');
        }
        process.exitCode = 1;
        return;
    }

    console.log(`Connection successful in ${Date.now() - startedAt}ms`);
    console.log(`Model: ${response.data.model || NVAPI_MODEL}`);
    console.log(`Response: ${response.data.choices?.[0]?.message?.content || '<empty>'}`);
}

main().catch((error) => {
    console.error(`Connection error: ${error.message}`);
    process.exitCode = 1;
});
