const Message = require('../models/Message');

exports.submitMessage = async (req, res, next) => {
  try {
    const { fullName, email, subject, message } = req.body;
    if (!fullName || !email || !message) return res.status(400).json({ message: 'fullName, email and message are required.' });
    const doc = await Message.create({ fullName, email, subject: subject || 'Inquiry', message });
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

exports.getMessages = async (req, res, next) => {
  try {
    res.status(200).json(await Message.find().sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};

exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Message not found.' });
    res.status(200).json(updated);
  } catch (err) { next(err); }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted.' });
  } catch (err) { next(err); }
};
