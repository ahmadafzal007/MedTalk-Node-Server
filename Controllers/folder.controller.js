const fs = require('fs');
const path = require('path');

const datasetPaths = {
  Chest: 'D:/MedTalk Final Year Project/MedTalk Frontend/public/datasets/chest_xray',
  Kidney: 'D:/MedTalk Final Year Project/MedTalk Frontend/public/datasets/kidney_scan',
};

const getFolders = (req, res) => {
  const folders = {};

  Object.keys(datasetPaths).forEach((key) => {
    const folderPath = datasetPaths[key];
    const files = fs.readdirSync(folderPath).filter((file) => /\.(png|jpe?g|gif)$/i.test(file));
    folders[key] = files;
  });

  res.json(folders);
};

module.exports = { getFolders };
