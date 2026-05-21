const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { pool } = require('../config/db');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing Razorpay credentials. Check backend/.env for RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

function buildMockOrder(bookingId, amount) {
  return {
    id: `order_mock_${bookingId}_${Date.now()}`,
    entity: 'order',
    amount: Math.round(Number(amount) * 100),
    amount_paid: 0,
    amount_due: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt: `receipt_booking_${bookingId}`,
    status: 'created',
    notes: {
      mode: 'mock',
    },
  };
}

// Create Order Endpoint
router.post('/create-order', async (req, res) => {
  const client = await pool.connect();

  try {
    const { amount, hotel_id, room_id, guest_name, guest_email, check_in_date, check_out_date, adults, children } = req.body;
    const numericAmount = Number(amount);
    const numericHotelId = Number(hotel_id);
    const numericRoomId = room_id ? Number(room_id) : null;
    const numericAdults = Number(adults);
    const numericChildren = Number(children || 0);

    if (!numericHotelId || !guest_name || !guest_email || !check_in_date || !check_out_date || !numericAdults || !numericAmount) {
      return res.status(400).json({ success: false, message: 'Missing required booking details' });
    }

    await client.query('BEGIN');

    let roomResult;
    if (numericRoomId) {
      roomResult = await client.query(
        `SELECT id, hotel_id, price_per_night
         FROM rooms
         WHERE id = $1 AND hotel_id = $2 AND is_available = TRUE
         LIMIT 1`,
        [numericRoomId, numericHotelId]
      );
    }

    if (!roomResult || roomResult.rows.length === 0) {
      roomResult = await client.query(
        `SELECT id, hotel_id, price_per_night
         FROM rooms
         WHERE hotel_id = $1 AND is_available = TRUE AND capacity_adults >= $2
         ORDER BY price_per_night ASC
         LIMIT 1`,
        [numericHotelId, numericAdults]
      );
    }

    if (roomResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'No available room found for this booking' });
    }

    const selectedRoom = roomResult.rows[0];

    // Create the booking record first with status 'confirmed' (schema currently does not allow 'pending')
    const bookingResult = await client.query(
      `INSERT INTO bookings 
      (hotel_id, room_id, guest_name, guest_email, check_in_date, check_out_date, adults, children, total_price, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'confirmed') RETURNING id`,
      [numericHotelId, selectedRoom.id, guest_name, guest_email, check_in_date, check_out_date, numericAdults, numericChildren, numericAmount]
    );
    const booking_id = bookingResult.rows[0].id;

    let order;
    let paymentStatus = 'pending';
    let isMock = false;

    try {
      order = await razorpay.orders.create({
        amount: Math.round(numericAmount * 100),
        currency: 'INR',
        receipt: `receipt_booking_${booking_id}`,
      });
    } catch (gatewayError) {
      const allowMockPayments = process.env.NODE_ENV !== 'production';

      if (!allowMockPayments) {
        throw gatewayError;
      }

      isMock = true;
      paymentStatus = 'successful';
      order = buildMockOrder(booking_id, numericAmount);
      console.warn('Razorpay order creation failed, using mock payment flow for local development.');
      console.warn(gatewayError);
    }

    await client.query(
      `INSERT INTO payments (booking_id, razorpay_order_id, amount, currency, status) 
        VALUES ($1, $2, $3, $4, $5)`,
      [booking_id, order.id, numericAmount, 'INR', paymentStatus]
    );

    await client.query('COMMIT');

    res.json({ success: true, order, booking_id, mock: isMock, room_id: selectedRoom.id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message || String(error) }),
    });
  } finally {
    client.release();
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



// rzp_test_SrAzGjUm9tquXy
// ••••••••••••••••••••••••