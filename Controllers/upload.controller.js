const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const datasetPaths = {
  Chest: 'D:/MedTalk Final Year Project/MedTalk Frontend/public/datasets/chest_xray',
  Kidney: 'D:/MedTalk Final Year Project/MedTalk Frontend/public/datasets/kidney_scan',
};

const uploadDataset = async (req, res) => {
  const { datasetType } = req.body;
  const uploadPath = datasetPaths[datasetType];

  if (!uploadPath) {
    return res.status(400).json({ message: 'Invalid dataset type.' });
  }

  const zipPath = req.file.path;

  try {
    const zip = new JSZip();
    const data = fs.readFileSync(zipPath);
    const content = await zip.loadAsync(data);

    for (const fileName in content.files) {
      const file = content.files[fileName];
      if (!file.dir && /\.(png|jpe?g|gif)$/i.test(file.name)) {
        const fileData = await file.async('nodebuffer');
        const outputFilePath = path.join(uploadPath, file.name);
        fs.writeFileSync(outputFilePath, fileData);
      }
    }

    fs.unlinkSync(zipPath);
    res.json({ message: 'File uploaded and extracted successfully!' });
  } catch (error) {
    console.error('Error processing zip file:', error);
    res.status(500).json({ message: 'Failed to process the file.' });
  }
};

module.exports = { uploadDataset };
