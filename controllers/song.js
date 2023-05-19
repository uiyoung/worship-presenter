const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllSongs = async (req, res, next) => {
  try {
    const songs = await prisma.song.findMany({
      select: { id: true, title: true, lyrics: true, type: true },
      orderBy: [{ id: 'asc' }],
    });
    res.json(songs);
  } catch (err) {
    console.error(err);
    next(err);
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
