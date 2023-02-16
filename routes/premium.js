const express = require('express');
const router=express.Router();

const premiumController=require('../controllers/premium');
const authenticateMiddleware=require('../middleware/auth');

router.get('/showLeaderboard',authenticateMiddleware.authenticate,premiumController.getLeaderboard);

module.exports=router;