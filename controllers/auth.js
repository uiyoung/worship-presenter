const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.renderLogin = (req, res, next) => {
  res.render('login', { title: 'login - Worship Presneter' });
};
