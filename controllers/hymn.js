import { promises as fs } from 'fs';
import path from 'path';

export async function getHymnImagesById(req, res, next) {
  const no = Number(req.params.no);
  const imageDirectory = `./public/hymn/images/${no}`;

  try {
    const readIndexPromise = fs.readFile('public/hymn/index.json', 'utf8');
    const readDirPromise = fs.readdir(imageDirectory);

    const [index, files] = await Promise.all([
      readIndexPromise,
      readDirPromise,
    ]);
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
}

export async function updateLyrics(req, res, next) {
  try {
    const { no } = req.params;
    const newVerses = req.body;

    const hymn = await fs.readFile(`public/hymn/lyrics/${no}.json`, 'utf8');
    const hymnObj = JSON.parse(hymn);
    const newHymn = { ...hymnObj, verses: newVerses };
    await fs.writeFile(
      `public/hymn/lyrics/${no}.json`,
      JSON.stringify(newHymn)
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
