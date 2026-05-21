const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { pool } = require('../config/db');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order Endpoint
router.post('/create-order', async (req, res) => {
  try {
    const { amount, hotel_id, room_id, guest_name, guest_email, check_in_date, check_out_date, adults, children } = req.body;
    
    // Create the booking record first with status 'confirmed' (since DB constraint doesn't allow 'pending')
    const bookingResult = await pool.query(
      `INSERT INTO bookings 
      (hotel_id, room_id, guest_name, guest_email, check_in_date, check_out_date, adults, children, total_price, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'confirmed') RETURNING id`,
      [hotel_id, room_id || 1, guest_name, guest_email, check_in_date, check_out_date, adults, children || 0, amount]
    );
    const booking_id = bookingResult.rows[0].id;

    // Amount in paise (1 INR = 100 paise)
    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: `receipt_booking_${booking_id}`
    };

    const order = await razorpay.orders.create(options);

    // Save the pending payment to DB
    await pool.query(
      `INSERT INTO payments (booking_id, razorpay_order_id, amount, currency, status) 
        VALUES ($1, $2, $3, $4, $5)`,
      [booking_id, order.id, amount, 'INR', 'pending']
    );

    res.json({ success: true, order, booking_id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// Verify Payment Endpoint
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful, update the DB
      await pool.query(
        `UPDATE payments 
         SET razorpay_payment_id = $1, razorpay_signature = $2, status = 'successful', updated_at = NOW() 
         WHERE razorpay_order_id = $3`,
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );
      
      // We should also update booking status, if applicable
      await pool.query(
        `UPDATE bookings SET status = 'confirmed' 
         WHERE id = (SELECT booking_id FROM payments WHERE razorpay_order_id = $1 LIMIT 1)`,
        [razorpay_order_id]
      );

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Signature mismatch
      await pool.query(
        `UPDATE payments SET status = 'failed', updated_at = NOW() WHERE razorpay_order_id = $1`,
        [razorpay_order_id]
      );
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
