const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/isAuth')

const { getHome, getCreate, postCreate, getDetails, getEdit, postEdit, getDelete, postDelete, getEnroll}= require('../controllers/tutorialCtrl.js')

router.get('/', getHome)
router.get('/create',isAuth, getCreate)
router.post('/create',isAuth, postCreate)
router.get('/details/:tutorialId', getDetails)
router.get('/edit/:tutorialId',isAuth, getEdit)
router.post('/edit/:tutorialId',isAuth, postEdit)
router.get('/delete/:tutorialId',isAuth, getDelete)
router.post('/delete/:tutorialId',isAuth, postDelete)
router.get('/enroll/:tutorialId', isAuth, getEnroll)


module.exports = router;
