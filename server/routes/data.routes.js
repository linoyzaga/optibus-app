const { Router } = require('express');
const DataController = require('../controllers/data.controller');
const router = new Router();

router.route('/drivers').get(DataController.getDrivers);
router.route('/times').get(DataController.getTimes);

module.exports = router;
