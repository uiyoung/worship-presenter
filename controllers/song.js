const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllSongs = async (req, res, next) => {
  try {
    const songs = await prisma.song.findMany();
    res.json(songs);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.addSong = async (req, res, next) => {
  try {
    // const newSong =
  } catch (err) {}
};

exports.renderSongList = (req, res) => {
  res.render('song-list');
};
exports.renderSongFom = (req, res) => {
  res.render('song-form');
};
