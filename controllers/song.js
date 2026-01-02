import { prisma } from '../lib/prisma.js';

function getSpaceIgnoreRegex(str) {
  return str === '%'
    ? '.*'
    : str
        .split('')
        .filter((e) => e !== ' ')
        .join('[[:space:]]?');
}

export async function getSongs(req, res, next) {
  const title = req.query.title || '';
  const lyrics = req.query.lyrics || '';
  const page = Number(req.query.page) || 1;
  const itemsPerPage = Number(req.query.limit) || 10;

  try {
    // const songs = await prisma.song.findMany({
    //   select: { id: true, title: true, lyrics: true, type: true },
    //   where: {
    //     title: { contains: `${title}`, mode: 'insensitive'}
    //   },
    //   skip: (Number(page) - 1) * itemsPerPage,
    //   take: itemsPerPage,
    //   orderBy: [{ id: 'desc' }],
    // });

    // 공백포함 검색을 위한 raw query 사용
    // const songs = await prisma.$queryRaw`
    //   SELECT id, title, type
    //   FROM jeil."Song"
    //   WHERE title ~* ${titleRegex}
    //     OR lyrics  ${lyricsRegex}
    //   ORDER BY "createdAt" DESC
    //   LIMIT ${itemsPerPage}
    //   OFFSET ${(page - 1) * itemsPerPage}
    // `;

    let songs;
    let totalCount;

    if (title !== '') {
      // search by title
      const titleRegex = getSpaceIgnoreRegex(title);

      songs = await prisma.$queryRaw`
        SELECT id, title, type
        FROM jeil."Song"
        WHERE title ~* ${titleRegex}
        ORDER BY "createdAt" DESC
        LIMIT ${itemsPerPage}
        OFFSET ${(page - 1) * itemsPerPage}
      `;

      totalCount = await prisma.$queryRaw`
        SELECT COUNT(*)::integer as count 
        FROM jeil."Song"
        WHERE title ~* ${titleRegex}
      `;
    } else {
      // search by lyrics
      const lyricsRegex = getSpaceIgnoreRegex(lyrics);

      songs = await prisma.$queryRaw`
        SELECT id, title, type
        FROM jeil."Song"
        WHERE lyrics ~* ${lyricsRegex}
        ORDER BY "createdAt" DESC
        LIMIT ${itemsPerPage}
        OFFSET ${(page - 1) * itemsPerPage}
      `;

      totalCount = await prisma.$queryRaw`
        SELECT COUNT(*)::integer as count 
        FROM jeil."Song"
        WHERE lyrics ~* ${lyricsRegex}
      `;
    }

    res.json({ songs, totalCount: totalCount[0].count });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getSongById(req, res, next) {
  try {
    const song = await prisma.song.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        author: { select: { username: true } },
        editor: { select: { username: true } },
      },
    });
    res.json(song);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function createSong(req, res, next) {
  try {
    const { title, lyrics, type, memo } = req.body;
    await prisma.song.create({
      data: {
        title,
        lyrics,
        type: 'CCM',
        memo,
        authorId: Number(req.user.id),
        editorId: Number(req.user.id),
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function updateSong(req, res, next) {
  const { title, lyrics, memo } = req.body;

  try {
    await prisma.song.update({
      data: {
        title,
        lyrics,
        memo,
        editor: {
          connect: {
            id: req.user.id,
          },
        },
      },
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteSong(req, res, next) {
  try {
    await prisma.song.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
