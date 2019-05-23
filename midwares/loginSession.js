
module.exports = (req, res, next) => {

	if(['/login'].indexOf(req.url) == -1 && !req.session.user) {

		res.redirect('/admin/login');

	} else {

		next();

	}
}