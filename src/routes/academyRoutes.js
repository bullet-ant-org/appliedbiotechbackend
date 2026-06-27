const express = require('express');
const router = express.Router();
const { registerAcademyStudent, loginAcademyStudent, createCourse, getCourses, getCourseById, updateCourse, deleteCourse, getAcademyStudentsMetrics, renderSecurePdfStream, getMyProfile } = require('../controllers/academyController');
const { protect, authorize, protectAcademy } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/auth/register', registerAcademyStudent);
router.post('/auth/login', loginAcademyStudent);

// Specific static routes BEFORE /:id wildcard
router.get('/auth/me', protectAcademy, getMyProfile);
router.get('/administration/metrics', protect, authorize('admin', 'editor'), getAcademyStudentsMetrics);
router.get('/course/:courseId/secure-read-stream', protectAcademy, renderSecurePdfStream);

router.get('/', getCourses);
router.post('/', protect, authorize('admin', 'editor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), createCourse);

router.get('/:id', getCourseById);
router.put('/:id', protect, authorize('admin', 'editor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), updateCourse);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteCourse);

module.exports = router;
