const Academy = require('../models/Academy');
const AcademyUser = require('../models/AcademyUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');

exports.registerAcademyStudent = async (req, res, next) => {
  try {
    const { email, fullName, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: 'Password confirmation verification failed.' });
    if (await AcademyUser.findOne({ email })) return res.status(400).json({ message: 'Student email is already mapped to an active enrollment.' });

    const protectiveSalt = await bcrypt.genSalt(10);
    const keyTransform = await bcrypt.hash(password, protectiveSalt);

    const studentRecord = await AcademyUser.create({ email, fullName, password: keyTransform });

    const htmlLayout = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #004B87; padding: 35px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Applied Biotech International</h1>
          <p style="color: #93c5fd; margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Research & Training Academy</p>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 22px; font-weight: 600;">Welcome On Board!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Dear <strong>${fullName}</strong>,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Congratulations on completing your professional credential profiles. Your global authentication portal account inside our specialized training track ecosystem is now fully active.</p>
         
          <div style="background-color: #f8fafc; border-left: 4px solid #004B87; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600; font-size: 15px;">Your Student Access Coordinates:</p>
            <p style="margin: 0; color: #4b5563; font-size: 14px;">Portal Identity Stream: <span style="color: #004B87; font-weight: 500;">${email}</span></p>
            <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 14px;">Security Tier: <span style="color: #10b981; font-weight: 500;">Verified Scholar Node</span></p>
          </div>

          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">You can now log into your web console terminal to review global syllabus indices, stream continuous integration code components, and configure your structural laboratory practical session maps.</p>
         
          <div style="text-align: center; margin-bottom: 35px;">
            <a href="${process.env.FRONTEND_URL || 'https://appliedbiotechfrontend.vercel.app'}/auth/login" style="background-color: #004B87; color: #ffffff; padding: 14px 32px; font-weight: 600; font-size: 15px; text-decoration: none; border-radius: 6px; display: inline-block; box-shadow: 0 2px 4px rgba(0,75,135,0.2);">Initialize Student Console</a>
          </div>
         
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 25px;" />
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">This is an automated operational pipeline transmission. Please do not reply directly to this notification hub.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #6b7280; font-size: 13px; margin: 0; font-weight: 500;">&copy; 2026 Applied Biotech International Nigeria Limited.</p>
          <p style="color: #9ca3af; font-size: 11px; margin: 4px 0 0 0;">Corporate Infrastructure Command Center, Nigeria.</p>
        </div>
      </div>
    `;
    await sendEmail(email, "Account Confirmation - Applied Biotech International Nigeria Limited Academy", htmlLayout);

    res.status(201).json({ message: 'Student profile parameter initialization successful.', studentId: studentRecord._id });
  } catch (err) { next(err); }
};

exports.loginAcademyStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const scholar = await AcademyUser.findOne({ email });
    if (!scholar || !await bcrypt.compare(password, scholar.password)) {
      return res.status(401).json({ message: 'Student clearance parameters match failure.' });
    }
    const executionSignature = jwt.sign({ id: scholar._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token: executionSignature, user: { id: scholar._id, email: scholar.email, fullName: scholar.fullName } });
  } catch (err) { next(err); }
};

exports.createCourse = async (req, res, next) => {
  try {
    const pack = req.body;
    if (req.files) {
      if (req.files.image) pack.image = req.files.image[0].path;
      if (req.files.pdfFile) {
        pack.pdfUrl = req.files.pdfFile[0].path;
        pack.pdfPublicId = req.files.pdfFile[0].filename;
      }
    }
    if (typeof pack.outline === 'string') pack.outline = JSON.parse(pack.outline);
    res.status(201).json(await Academy.create(pack));
  } catch (err) { next(err); }
};

exports.getCourses = async (req, res, next) => {
  try {
    res.status(200).json(await Academy.find().select('-pdfUrl -pdfPublicId'));
  } catch (err) { next(err); }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const resource = await Academy.findById(req.params.id).select('-pdfUrl -pdfPublicId');
    if (!resource) return res.status(404).json({ message: 'Course object mapping untraceable.' });
    res.status(200).json(resource);
  } catch (err) { next(err); }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.files) {
      if (req.files.image) updates.image = req.files.image[0].path;
      if (req.files.pdfFile) {
        updates.pdfUrl = req.files.pdfFile[0].path;
        updates.pdfPublicId = req.files.pdfFile[0].filename;
      }
    }
    if (typeof updates.outline === 'string') updates.outline = JSON.parse(updates.outline);
    res.status(200).json(await Academy.findByIdAndUpdate(req.params.id, updates, { new: true }));
  } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    await Academy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course configuration eliminated.' });
  } catch (err) { next(err); }
};

exports.getAcademyStudentsMetrics = async (req, res, next) => {
  try {
    res.status(200).json(await AcademyUser.find().populate('purchasedCourses.course purchasedBooks').select('-password'));
  } catch (err) { next(err); }
};

exports.renderSecurePdfStream = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const targetsPage = parseInt(req.query.page) || 1;

    const validationProof = req.academyUser.purchasedCourses.some(record => record.course.toString() === courseId);
    if (!validationProof) return res.status(403).json({ message: 'Resource access rejected. Structural purchase log confirmation missing.' });

    const structuralTargetCourse = await Academy.findById(courseId);
    if (!structuralTargetCourse || !structuralTargetCourse.pdfPublicId) {
      return res.status(404).json({ message: 'Target blueprint configurations untraceable.' });
    }

    const sandboxedCloudinaryImageStreamUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/pg_${targetsPage}/${structuralTargetCourse.pdfPublicId}.jpg`;
    res.status(200).json({ course: structuralTargetCourse.courseTitle, page: targetsPage, streamUrl: sandboxedCloudinaryImageStreamUrl });
  } catch (err) { next(err); }
};
