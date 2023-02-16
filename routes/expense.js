const express = require('express');

const router = express.Router();
const userAuthentication = require('../middleware/auth');

const adminController = require('../controllers/admin');

router.get('/getExpenses', userAuthentication.authenticate,adminController.getExpenses);
router.get('/deleteExpense/:expenseId',adminController.deleteExpense);
router.post('/addExpenses',userAuthentication.authenticate,adminController.addExpense);
router.get('/download',userAuthentication.authenticate,adminController.downloadExpenses);
router.get('/getDownloads',userAuthentication.authenticate,adminController.getDownloads);
module.exports = router;    
