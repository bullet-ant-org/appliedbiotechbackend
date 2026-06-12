const express = require('express');
const router = express.Router();
const { createJobPosting, getJobPostings, getJobPostingById, updateJobPosting, deleteJobPosting, submitCandidateApplication, retrieveTalentPipelineApplications } = require('../controllers/careerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getJobPostings);
router.get('/:id', getJobPostingById);
router.post('/', protect, authorize('admin', 'editor'), createJobPosting);
router.put('/:id', protect, authorize('admin', 'editor'), updateJobPosting);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteJobPosting);

router.post('/apply', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'cv', maxCount: 1 }, { name: 'passport', maxCount: 1 }]), submitCandidateApplication);
router.get('/administration/submissions', protect, authorize('admin', 'editor'), retrieveTalentPipelineApplications);

module.exports = router;
