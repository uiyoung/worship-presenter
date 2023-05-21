const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTotalCount = async (req, res, next) => {
  const { title } = req.query;
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*)::integer as count 
      FROM jeil."Song"
      WHERE LOWER(REPLACE(title, ' ', '')) like '%' || LOWER(REPLACE(${title}, ' ', '')) || '%'
    `;

    res.json(result[0]);
  } catch (error) {
    console.error(error);
  }
};

exports.getSongs = async (req, res, next) => {
  const SONGS_PER_PAGE = 10;
  const { title, page } = req.query;
  try {
    // const songs = await prisma.song.findMany({
    //   select: { id: true, title: true, lyrics: true, type: true },
    //   skip: 0 * Number(page),
    //   take: 10,
    //   orderBy: [{ id: 'asc' }],
    // });

    const songs = await prisma.$queryRaw`
      SELECT id, title, type
      FROM jeil."Song"
      WHERE LOWER(REPLACE(title, ' ', '')) like '%' || LOWER(REPLACE(${title}, ' ', '')) || '%'
      ORDER BY id DESC
      LIMIT ${SONGS_PER_PAGE} 
      OFFSET ${(page - 1) * SONGS_PER_PAGE}
    `;
    res.json(songs);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getSongById = async (req, res, next) => {
  try {
    const song = await prisma.song.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json(song);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.addSong = async (req, res, next) => {
  try {
    const { title, lyrics, type, memo, authorId } = req.body;
    const newSong = await prisma.song.create({
      data: {
        title,
        lyrics,
        type,
        memo,
        authorId,
      },
    });
    res.json(newSong);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderSongList = (req, res) => {
  res.render('song-list', { title: 'song list - Worship Presenter' });
};

exports.renderSongForm = (req, res) => {
  res.render('song-form', { title: 'song form - Worship Presenter' });
};
