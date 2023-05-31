const router = require('express').Router();
const { Blogpost } = require('../../models');

router.get('/', async (req, res) => {
  const blogpostData = await Blogpost.findAll({
    include: ['user', 'comments'],
  });

  if (!blogpostData) {
    return res.status(404).json({ data: null });
  }

  const blogposts = blogpostData.map((blog) => blog.get({ plain: true }));
  console.log(blogposts);

  res.status(200).json(blogposts);

  // alternative to not send user password
  // const newData = blogposts.map((blog) => {
  //   return { ...blog, user: blog.user.username };
  // });

  // res.status(200).json(newData);
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
