const sequelize = require('../config/connection');
const { User, Blogpost, Comment } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const blogposts = [];
  for (const blogpost of blogData) {
    const newBlogpost = await Blogpost.create({
      ...blogpost,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
    blogposts.push(newBlogpost);
  }

  for (const comment of commentData) {
    await Comment.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      blogpost_id: blogposts[Math.floor(Math.random() * blogposts.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
