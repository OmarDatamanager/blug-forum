const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  next();
};

const validateThreadCreation = (req, res, next) => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Thread title is required' });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: 'Thread title too long' });
  }

  next();
};

module.exports = { validateUserRegistration, validateThreadCreation };