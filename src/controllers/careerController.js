const Career = require('../models/Career');
const Application = require('../models/Application');

exports.createJobPosting = async (req, res, next) => {
  try { res.status(201).json(await Career.create(req.body)); } catch (err) { next(err); }
};

exports.getJobPostings = async (req, res, next) => {
  try { res.status(200).json(await Career.find()); } catch (err) { next(err); }
};

exports.getJobPostingById = async (req, res, next) => {
  try {
    const spec = await Career.findById(req.params.id);
    if (!spec) return res.status(404).json({ message: 'Position profile vector mapping dropped.' });
    res.status(200).json(spec);
  } catch (err) { next(err); }
};

exports.updateJobPosting = async (req, res, next) => {
  try { res.status(200).json(await Career.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { next(err); }
};

exports.deleteJobPosting = async (req, res, next) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job matrix criteria deleted successfully.' });
  } catch (err) { next(err); }
};

exports.submitCandidateApplication = async (req, res, next) => {
  try {
    const structuralManifest = req.body;
    if (!req.files || !req.files.resume || !req.files.cv || !req.files.passport) {
      return res.status(400).json({ message: 'Human Resources compliance payload criteria failure. Missing standard verification files.' });
    }
    structuralManifest.resumeUrl = req.files.resume[0].path;
    structuralManifest.cvUrl = req.files.cv[0].path;
    structuralManifest.passportUrl = req.files.passport[0].path;

    res.status(201).json(await Application.create(structuralManifest));
  } catch (err) { next(err); }
};

exports.retrieveTalentPipelineApplications = async (req, res, next) => {
  try {
    res.status(200).json(await Application.find().populate('career'));
  } catch (err) { next(err); }
};
