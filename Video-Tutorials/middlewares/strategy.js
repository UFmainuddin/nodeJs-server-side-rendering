const User = require('../models/User')
const strategy = async (req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	const user = await User.findById(req.session.user._id);
	req.user = user;
	next();
};

module.exports = strategy