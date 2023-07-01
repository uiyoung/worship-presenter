const fs = require('fs').promises;
const path = require('path');

exports.getHymnImagesById = async (req, res, next) => {
  const no = Number(req.params.no);
  const imageDirectory = `./public/hymn/images/${no}`;

  try {
    const readIndexPromise = fs.readFile('public/hymn/index.json', 'utf8');
    const readDirPromise = fs.readdir(imageDirectory);

    const [index, files] = await Promise.all([readIndexPromise, readDirPromise]);
    const title = JSON.parse(index).hymn.find((item) => item.no === no).title;
    const imageFiles = [];
    for (const file of files) {
      const filePath = path.join(imageDirectory, file);
      const fileStats = await fs.stat(filePath);

      if (fileStats.isFile() && /\.(jpe?g|png|gif)$/i.test(file)) {
        imageFiles.push(file);
      }
    }
    res.json({ no, title, images: imageFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
