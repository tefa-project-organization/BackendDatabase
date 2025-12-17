import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;

console.log('SUPABASE_URL set:', !!url);
console.log('SUPABASE_SERVICE_ROLE set:', !!key);
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE in .env and restart.');
  process.exit(1);
}

const supabase = createClient(url, key);

try {
  const bucketName = `documents_check_${Date.now()}`;
  console.log('Attempting createBucket', bucketName);
  const { data, error } = await supabase.storage.createBucket(bucketName, { public: true });
  if (error) {
    console.error('createBucket error:', error);
    process.exit(1);
  }
  console.log('createBucket success:', data);

  // cleanup
  const { error: delErr } = await supabase.storage.deleteBucket(bucketName);
  if (delErr) console.error('cleanup deleteBucket error:', delErr);
  else console.log('cleanup deleted bucket');
} catch (e) {
  console.error('Unexpected error:', e);
  process.exit(1);
}

process.exit(0);
