const express = require('express');
const router = express.Router();
const { updateHeroBanner, updateContactInfo, getContentData, addAcademyPracticalDateSetting, removeAcademyPracticalDateSetting, getAcademyPracticalDatesSettingList } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getContentData);
router.post('/hero', protect, authorize('admin'), updateHeroBanner);
router.post('/contact', protect, authorize('admin'), updateContactInfo);

router.get('/settings/practical-dates', getAcademyPracticalDatesSettingList);
router.post('/settings/practical-dates', protect, authorize('admin', 'editor'), addAcademyPracticalDateSetting);
router.post('/settings/practical-dates/delete', protect, authorize('admin', 'editor'), removeAcademyPracticalDateSetting);

module.exports = router;
