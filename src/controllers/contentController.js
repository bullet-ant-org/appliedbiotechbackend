const AppConfig = require('../models/AppConfig');

exports.updateHeroBanner = async (req, res, next) => {
  try {
    const { pageKey, title, subtitle } = req.body;
    res.status(200).json(await AppConfig.findOneAndUpdate({ key: pageKey }, { value: { title, subtitle, dateChanged: new Date() } }, { upsert: true, new: true }));
  } catch (err) { next(err); }
};

exports.updateContactInfo = async (req, res, next) => {
  try { res.status(200).json(await AppConfig.findOneAndUpdate({ key: 'contact_info' }, { value: req.body }, { upsert: true, new: true })); } catch (err) { next(err); }
};

exports.getContentData = async (req, res, next) => {
  try { res.status(200).json(await AppConfig.find()); } catch (err) { next(err); }
};

exports.addAcademyPracticalDateSetting = async (req, res, next) => {
  try {
    const { targetDateStringValue } = req.body;
    const currentSetup = await AppConfig.findOne({ key: 'academy_practical_dates' }) || { value: [] };
    const cleanArraySet = new Set(currentSetup.value || []);
    cleanArraySet.add(targetDateStringValue);
    
    const configurationResultNode = await AppConfig.findOneAndUpdate(
      { key: 'academy_practical_dates' },
      { value: Array.from(cleanArraySet) },
      { upsert: true, new: true }
    );
    res.status(200).json(configurationResultNode);
  } catch (err) { next(err); }
};

exports.removeAcademyPracticalDateSetting = async (req, res, next) => {
  try {
    const { lookupDateStringValue } = req.body;
    const stateConfig = await AppConfig.findOne({ key: 'academy_practical_dates' });
    if (!stateConfig) return res.status(200).json({ value: [] });
    
    stateConfig.value = stateConfig.value.filter(date => date !== lookupDateStringValue);
    await stateConfig.save();
    res.status(200).json(stateConfig);
  } catch (err) { next(err); }
};

exports.getAcademyPracticalDatesSettingList = async (req, res, next) => {
  try {
    const collectionDataNode = await AppConfig.findOne({ key: 'academy_practical_dates' });
    res.status(200).json(collectionDataNode ? collectionDataNode.value : []);
  } catch (err) { next(err); }
};
