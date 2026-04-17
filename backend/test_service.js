const { getHotelById } = require('./services/searchService');

async function test() {
  try {
    const hotel = await getHotelById(1);
    console.log('Hotel 1 result:', hotel ? 'FOUND' : 'NOT FOUND');
    if (hotel) {
      console.log('Name:', hotel.name);
      console.log('Amenities:', hotel.amenities);
    }
  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    process.exit();
  }
}

test();
