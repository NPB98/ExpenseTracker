const express = require('express');

const purchaseController=require('../controllers/purchase');

const authenticateMiddleware=require('../middleware/auth');

const router=express.Router();

router.get('/premiumMembership',authenticateMiddleware.authenticate,purchaseController.purchasePremium);
router.post('/updateTransactionStatus',authenticateMiddleware.authenticate,purchaseController.updateTransactionStatus)
router.post('./updateFailedTransactionStatus',authenticateMiddleware.authenticate,purchaseController.updateFailedTransactionStatus);

module.exports=router;