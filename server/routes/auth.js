const express = require('express');

const { signup, login } = require('../controllers/auth.js');

//We need to get a router from that express
const router = express.Router();

//Creating two different routes. Both of these routes are going to be POST as we have to send data from the frontend to the backend
router.post('/signup', signup);
router.post('/login', login);

//exporting our router
module.exports = router;
