const admin = require('../database/include/admin');

module.exports = (req, res, next) => {

    req.menus = admin.getMenus(req);

    next();

}