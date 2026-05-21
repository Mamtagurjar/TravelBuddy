const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required to fetch bookings',
    });
  }

  try {
    const query = `
      SELECT
        b.id AS "bookingId",
        b.check_in_date AS "checkIn",
        b.check_out_date AS "checkOut",
        b.adults,
        b.children,
        (b.adults + COALESCE(b.children, 0)) AS guests,
        INITCAP(b.status) AS "bookingStatus",
        h.name AS "hotelName",
        CONCAT_WS(', ', h.address, h.city) AS "hotelLocation",
        h.image_url AS "hotelImage",
        r.room_type AS "roomType",
        COALESCE(p.amount, b.total_price) AS "totalAmount",
        INITCAP(COALESCE(p.status, 'pending')) AS "paymentStatus",
        COALESCE(p.razorpay_payment_id, p.razorpay_order_id, 'Pending') AS "transactionId"
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      JOIN rooms r ON b.room_id = r.id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE LOWER(b.guest_email) = $1
      ORDER BY b.created_at DESC, p.created_at DESC NULLS LAST;
    `;

    const results = await db.query(query, [email]);

    res.json({
      success: true,
      data: results.rows,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
});

module.exports = router;
