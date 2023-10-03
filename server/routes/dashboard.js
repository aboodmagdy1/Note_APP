const express = require('express');

const router = express.Router();

const {dashboard,getNote,updateNote,deleteNote,getAddNote,postAddNote,searchForNoteSubmit,searchForNote}= require('../controller/dashboardController')
const {isLoggedIn}= require('../middlewares/checkAuth')


//gget dashboard page and all notes
router.get('/dashboard',isLoggedIn,dashboard)

// //add notes 
router.use(isLoggedIn)
router.route('/dashboard/item/:id').get(getNote)
router.route('/dashboard/item/:id').put(updateNote)
router.delete('/dashboard/item-delete/:id',deleteNote)
router.route('/dashboard/add').get(getAddNote).post(postAddNote)
router.route('/dashboard/search').get(searchForNote)
router.route('/dashboard/search').post(searchForNoteSubmit)




module.exports = router;


