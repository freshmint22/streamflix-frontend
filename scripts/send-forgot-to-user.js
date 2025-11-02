#!/usr/bin/env node
/**
 * Usage: node scripts/send-forgot-to-user.js user@example.com
 * This script will:
 *  - connect to MongoDB using .env MONGO_URI
 *  - find the user by email
 *  - create a reset token and save resetPasswordToken and resetPasswordExpires
 *  - send the reset email directly to the user's email (bypassing EMAIL_OVERRIDE_RECIPIENT)
 */
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/send-forgot-to-user.js user@example.com');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { connectTimeoutMS: 5000 });
  } catch (e) {
    console.error('Failed to connect to MongoDB:', e.message || e);
    process.exit(1);
  }

  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    await mongoose.disconnect();
    process.exit(1);
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 3600000);
  await db.collection('users').updateOne({ _id: user._id }, { $set: { resetPasswordToken: token, resetPasswordExpires: expires } });

  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  const message = `<p>Hola!<br/>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetUrl}">Restablecer contraseña</a></p>`;

  // require sendEmail helper (dist if built, otherwise src)
  const sendEmail = require('../dist/utils/sendEmail')?.sendEmail || require('../src/utils/sendEmail').sendEmail;
  try {
    const info = await sendEmail(user.email, 'Recuperación de contraseña - StreamFlix', message);
    console.log('Email sent:', info?.messageId || info);
  } catch (e) {
    console.error('Failed to send email:', e);
  }

  await mongoose.disconnect();
}

run().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
