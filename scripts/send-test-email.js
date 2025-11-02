#!/usr/bin/env node
/**
 * Usage: set EMAIL_USER=...; set EMAIL_PASS=...; node scripts/send-test-email.js recipient@example.com
 * This script helps verify SMTP configuration.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { sendEmail } = require('../dist/utils/sendEmail') || require('../src/utils/sendEmail');

const to = process.argv[2];
if (!to) {
  console.error('Usage: node scripts/send-test-email.js recipient@example.com');
  process.exit(1);
}

(async () => {
  try {
    const info = await sendEmail(to, 'StreamFlix test email', '<p>This is a test email from StreamFlix backend.</p>');
    console.log('Sent:', info?.messageId || info);
  } catch (e) {
    console.error('Failed to send test email:', e);
  }
})();
