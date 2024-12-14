require('dotenv').config({ path: '.env.local' });

console.log('Checking environment variables...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (first 20 chars: ' + process.env.MONGODB_URI.substring(0, 20) + '...)' : 'Not set');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? 'Set' : 'Not set');
