const http = require('http');

const BACKEND_URL = 'http://localhost:9050';
const ORDER_COUNT = 20;

// Mock data arrays
const firstNames = ['Ahmed', 'Sarah', 'Mohammed', 'Fatima', 'Karim', 'Amina', 'Omar', 'Leila', 'Youssef', 'Nour', 'Hassan', 'Zahra', 'Ali', 'Khadija', 'Said', 'Imane', 'Hamza', 'Salma', 'Brahim', 'Yasmine'];
const lastNames = ['Benali', 'Mansouri', 'Cherif', 'Boudiaf', 'Taleb', 'Haddad', 'Bouazza', 'Kaci', 'Slimani', 'Messaoud', 'Benzaid', 'Amrani', 'Djelloul', 'Mekki', 'Berrah', 'Hamadi', 'Khaled', 'Boumediene', 'Sadi', 'Zerhouni'];
const companies = ['TechStart Algeria', 'Digital Solutions DZ', 'WebAgency Algiers', 'Innovate North', 'Cloud Services SA', 'E-Commerce DZ', 'Startup Hub', 'Digital Marketing Pro', 'Software House Algeria', 'Tech Ventures'];
const services = ['Basic Package', 'Full Package', 'Advanced Package', 'SaaS Platform', 'Custom Development', 'E-commerce Solution', 'Mobile App Development', 'Enterprise Portal', 'API Integration', '3D Services'];
const budgets = ['15,000 DZD', '25,000 DZD', '40,000 DZD', '110,000 DZD', '50,000 DZD', '75,000 DZD', '200,000 DZD', '30,000 DZD'];
const mediaTypes = ['web', 'mobile', 'both', 'desktop', 'api'];
const languages = ['en', 'fr', 'ar'];
const messages = [
  'We need a modern website for our startup with e-commerce capabilities.',
  'Looking for a full-stack web application with user authentication and dashboard.',
  'Need a custom SaaS platform for our business operations.',
  'Require a mobile-responsive website with payment integration.',
  'Looking for enterprise-grade web solution with advanced features.',
  'Need a simple but professional website for our company.',
  'Require API development and integration with existing systems.',
  'Looking for 3D web experience for our product showcase.',
  'Need a complete digital transformation solution.',
  'Require web application with real-time features and notifications.'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company-dz.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(domains)}`;
}

function generateMockOrder(index) {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  
  return {
    name: `${firstName} ${lastName}`,
    email: generateRandomEmail(firstName, lastName),
    company: getRandomItem(companies),
    service: getRandomItem(services),
    budget: getRandomItem(budgets),
    message: getRandomItem(messages),
    mediaType: getRandomItem(mediaTypes),
    lang: getRandomItem(languages)
  };
}

function sendOrder(orderData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(orderData);
    
    const options = {
      hostname: 'localhost',
      port: 9050,
      path: '/api/order',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, statusCode: res.statusCode, body: body });
        } else {
          reject({ success: false, statusCode: res.statusCode, body: body });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

async function generateMockOrders() {
  console.log(`🚀 Starting mock order generation...`);
  console.log(`📊 Target: ${ORDER_COUNT} orders`);
  console.log(`🌐 Backend: ${BACKEND_URL}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < ORDER_COUNT; i++) {
    const orderData = generateMockOrder(i);
    
    try {
      console.log(`[${i + 1}/${ORDER_COUNT}] Creating order for ${orderData.name}...`);
      const result = await sendOrder(orderData);
      console.log(`✅ Order created successfully (Status: ${result.statusCode})`);
      successCount++;
      
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.log(`❌ Failed to create order: ${error.error || error.body}`);
      failCount++;
    }
  }

  console.log(`\n📈 Generation complete!`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${ORDER_COUNT}`);
}

// Run the script
generateMockOrders().catch(console.error);
