const router = require('express').Router();
const { Blogpost, User, Comment } = require('../../models');

router.get('/', async (req, res) => {
  const blogpostData = await Blogpost.findAll({
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  });

  if (!blogpostData) {
    return res.status(404).json({ data: null });
  }

  const blogposts = blogpostData.map((blog) => blog.get({ plain: true }));

  res.status(200).json(blogposts);
});

router.get('/:id', async (req, res) => {
  const blogpostData = await Blogpost.findByPk(req.params.id, {
    include: ['user', 'comments'],
  });

  const blogpost = blogpostData.get({ plain: true });

  res.status(200).json(blogpost);
});

router.post('/', async (req, res) => {
  try {
    const newBlogpost = await Blogpost.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlogpost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blogpostData = await Blogpost.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogpostData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(blogpostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
