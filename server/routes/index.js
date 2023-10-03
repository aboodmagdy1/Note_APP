const express = require('express');


const router = express.Router();
const {getHomePage,getAboutPage} = require('../controller/mainController')




router.get('/', getHomePage)
router.get('/about', getAboutPage)



module.exports = router;



