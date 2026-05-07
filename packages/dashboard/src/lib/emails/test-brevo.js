
import 'dotenv/config';
import { sendTransactionalEmail } from './brevo.js';

async function runTest() {
  console.log('--- SupraWall Email Client Test (Brevo) ---');
  console.log('Mode:', process.env.EMAIL_DRY_RUN === 'true' ? 'DRY RUN' : 'LIVE');
  
  const result = await sendTransactionalEmail({
    to: { 
      email: 'peghin@gmail.com', 
      name: 'Alejandro Peghin' 
    },
    from: { 
      email: 'security@supra-wall.com', 
      name: 'SupraWall Security' 
    },
    subject: 'SupraWall Brevo Test',
    html: '<h1>Integration Successful</h1><p>The new Brevo client is correctly configured and resolving variables.</p>'
  });

  if (result.success) {
    console.log('✅ Test Passed');
    console.log('Response:', JSON.stringify(result.data, null, 2));
  } else {
    console.error('❌ Test Failed');
    console.error('Error:', result.error);
  }
}

runTest();
