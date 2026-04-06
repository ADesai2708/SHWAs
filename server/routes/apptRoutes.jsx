const express = require('express');
const router = express.Router();
const apptController = require('../controllers/apptController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, apptController.createAppointment);
router.get('/', authMiddleware, apptController.getAppointments);

module.exports = router;
