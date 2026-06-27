const express = require('express');
const router = express.Router();
const { createJobPosting, getJobPostings, getJobPostingById, updateJobPosting, deleteJobPosting, submitCandidateApplication, retrieveTalentPipelineApplications } = require('../controllers/careerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Specific static routes BEFORE /:id wildcard
router.post('/apply', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'cv', maxCount: 1 }, { name: 'passport', maxCount: 1 }]), submitCandidateApplication);
router.get('/administration/submissions', protect, authorize('admin', 'editor'), retrieveTalentPipelineApplications);

router.get('/', getJobPostings);
router.post('/', protect, authorize('admin', 'editor'), createJobPosting);

router.get('/:id', getJobPostingById);
router.put('/:id', protect, authorize('admin', 'editor'), updateJobPosting);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteJobPosting);

module.exports = router;
