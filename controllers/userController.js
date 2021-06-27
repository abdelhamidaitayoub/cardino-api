const User = require('../models/userModel');

exports.getAll = async (req, res) => {
  const users = await User.find();
  res.json({
    status: 'success',
    result: users.count,
    data: {
      users
    }
  })
}