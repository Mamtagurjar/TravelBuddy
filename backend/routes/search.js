const express = require('express');
const router = express.Router();
const { searchHotels, getFilterOptions } = require('../services/searchService');
const { searchValidationRules, handleValidationErrors } = require('../middleware/validateSearch');


router.get(
  '/',
  searchValidationRules,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Prevent browser from caching search results (avoids 304 stale data)
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Execute search and filter options in parallel
      const [searchResults, filterOptions] = await Promise.all([
        searchHotels(req.query),
        getFilterOptions(req.query.city),
      ]);

      res.json({
        success: true,
        data: {
          hotels: searchResults.hotels,
          pagination: {
            page: searchResults.page,
            limit: searchResults.limit,
            total: searchResults.total,
            totalPages: searchResults.totalPages,
          },
          filters: filterOptions,
        },
      });

      if (searchResults.hotels.length === 0) {
        console.warn(`⚠️ Search returned 0 results for query:`, req.query);
      }
    } catch (error) {
      console.error('🔴 Search error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while searching hotels',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      });
    }
  }
);


router.get('/filters', async (req, res) => {
  try {
    const filterOptions = await getFilterOptions(req.query.city);
    res.json({
      success: true,
      data: { filters: filterOptions },
    });
  } catch (error) {
    console.error('🔴 Filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching filters',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
});

module.exports = router;
