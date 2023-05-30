const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getSpaceIgnoreRegex(str) {
  return str === '%'
    ? '.*'
    : str
        .split('')
        .filter((e) => e !== ' ')
        .join('[[:space:]]?');
}

exports.getTotalCount = async (req, res, next) => {
  const { title } = req.query;
  const titleRegex = getSpaceIgnoreRegex(title);
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*)::integer as count 
      FROM jeil."Song"
      WHERE title ~* ${titleRegex}
    `;

    res.json(result[0]);
  } catch (error) {
    console.error(error);
  }
};

exports.getSongs = async (req, res, next) => {
  const SONGS_PER_PAGE = 10;
  const { title, page } = req.query;
  const titleRegex = getSpaceIgnoreRegex(title);
  try {
    // 공백포함 검색을 위한 raw query 사용
    const songs = await prisma.$queryRaw`
      SELECT id, title, type
      FROM jeil."Song"
      WHERE title ~* ${titleRegex}
      ORDER BY id DESC
      LIMIT ${SONGS_PER_PAGE} 
      OFFSET ${(page - 1) * SONGS_PER_PAGE}
    `;
    // const songs = await prisma.$queryRaw`
    //   SELECT id, title, type
    //   FROM jeil."Song"
    //   WHERE REPLACE(title, ' ', '') ILIKE '%' || REPLACE(${title}, ' ', '') || '%'
    //   ORDER BY id DESC
    //   LIMIT ${SONGS_PER_PAGE}
    //   OFFSET ${(page - 1) * SONGS_PER_PAGE}
    // `;

    // const songs = await prisma.song.findMany({
    //   select: { id: true, title: true, lyrics: true, type: true },
    //   where: {
    //     title: {
    //       contains: `${title}`,
    //       mode: 'insensitive',
    //     },
    //   },
    //   skip: (Number(page) - 1) * SONGS_PER_PAGE,
    //   take: SONGS_PER_PAGE,
    //   orderBy: [{ id: 'desc' }],
    // });

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
    const { title, lyrics, type, memo } = req.body;
    const newSong = await prisma.song.create({
      data: {
        title,
        lyrics,
        type,
        memo,
        authorId: req.user.id,
      },
    });
    res.json(newSong);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.updateSong = async (req, res, next) => {
  try {
    const { title, lyrics, type, memo, authorId } = req.body;
    const updatedSong = await prisma.song.update({
      data: { title, lyrics, type, memo },
      where: { id: Number(req.params.id) },
    });
    res.json(updatedSong);
  } catch (error) {
    console.error(err);
    next(error);
  }
};

exports.renderSongForm = (req, res) => {
  res.render('song-form', { title: 'song form - Worship Presenter' });
};
