const express = require('express');
const utilRouter = express.Router();
const {ui_info,protectRoute} = require('../Controllers/authController')


utilRouter.use(protectRoute);

utilRouter.route('/getUi/:id')
    .get(ui_info)

module.exports = utilRouter;