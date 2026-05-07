
import fetch from 'node-fetch';

const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZjk0YzY2MTBkZmM3NTFkNDI2MmJmMmEwNWJkYjk5MGFjYjdjODMxNTU1NGZkNzM1N2FlNjFjNzExN2IxM2MwZjM1OWIwNmE5OGZlNDgzMjgiLCJpYXQiOjE3NzYwMTM3NzYuMTI4OTU2LCJuYmYiOjE3NzYwMTM3NzYuMTI4OTU4LCJleHAiOjQ5MzE2ODczNzYuMTIyMzQyLCJzdWIiOiIyMjgxMjI4Iiwic2NvcGVzIjpbXX0.mGiNEXLdXaNF2XnCQTF66HRlKU89oDNkixgllPYIlDyTHTU15YkR7WDFrfU-J-XIj0FXIvan7amLqx8UUESkSLBNAPOxXxcJGLQIOqWq8dexWjrYYG2sJA6RjQ-eaZlH-2BkGRUvDxdGEReqwgCoSdrjFKV9wnjIapZKkT-7MQ7jUFmqOUQsFWG3LjUPQ3IgYmzKDCGnTR8ckoOoCy4yS828O1KvmWrzlzbkC75jArlhmC7vPtjmpEiQ1K3vzA958NQlHtVi_DG7azXcH1lbG5dNBgFWaMhs61I9Z5-w5awL3IF59QVuloCVx4ns8VwQ2sGHYBzwK0I5Is0BcrQEysCb1ZKVnuPUSNwoPA9H-Y5PefrE9RbdSGC2sQ3H2fxv5LvxgGVLQrRrQZZqDEB0VpoZihgZ1H_j4jkZv7VMq9ckOOo52Ms1lrj7Oy4DlZR4M3M7OCv6jJ8_B0R9rpq7xDxWWDLLQGHPL8f8QuAIKKlVK74aP-yidQM8GLBHY9_TWEjbHlYUjeGFlIyaysgr5KnP8xINvE0jqJ7JKlBpb7BH-uoZC631QSCibXsmF1dN9Q3tygNH13xbwIxRAj4DEGwiAJVhrf0T3VtQLaPe4p0lWPw31U6zuJ7lsjukII-xK1iL_9XSeFVlTkPWApPjaxnDJsMRmqOWQ';

async function testEmail() {
  console.log('Testing MailerSend API...');
  
  const payload = {
    from: {
      email: 'MS_yE0M3x@supra-wall.com', // MailerSend usually requires a verified sender
      name: 'SupraWall Security'
    },
    to: [
      {
        email: 'peghin@gmail.com',
        name: 'Alejandro Peghin'
      }
    ],
    subject: 'SupraWall Connection Test',
    html: '<h1>Connection Successful.</h1><p>This is a test email from the SupraWall diagnostic tool.</p>'
  };

  try {
    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testEmail();
