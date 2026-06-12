const express = require('express');
const router = express.Router();
const { registerAcademyStudent, loginAcademyStudent, createCourse, getCourses, getCourseById, updateCourse, deleteCourse, getAcademyStudentsMetrics, renderSecurePdfStream } = require('../controllers/academyController');
const { protect, authorize, protectAcademy } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/auth/register', registerAcademyStudent);
router.post('/auth/login', loginAcademyStudent);

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.get('/course/:courseId/secure-read-stream', protectAcademy, renderSecurePdfStream);

router.post('/', protect, authorize('admin', 'editor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), createCourse);
router.put('/:id', protect, authorize('admin', 'editor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), updateCourse);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteCourse);

router.get('/administration/metrics', protect, authorize('admin', 'editor'), getAcademyStudentsMetrics);

module.exports = router;
