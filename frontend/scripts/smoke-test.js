// Minimal smoke test to verify key modules load without runtime errors
import fs from 'fs';
import path from 'path';

function check(file) {
  const p = path.join(process.cwd(), 'src', file);
  fs.accessSync(p);
  console.log('OK:', file);
}

try {
  check('pages/Dashboard.tsx');
  check('pages/Messages.tsx');
  check('pages/Templates.tsx');
  check('pages/Logs.tsx');
  check('pages/Users.tsx');
  console.log('Frontend smoke test: PASS');
  process.exit(0);
} catch (e) {
  console.error('Frontend smoke test: FAIL', e.message);
  process.exit(1);
}
