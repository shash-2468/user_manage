const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Sentry = require("@sentry/node");

const transaction = Sentry.startTransaction({
    op: "test",
    name: "Transaction 1",
  });

// Routes
try{
    router.get('/', userController.view);
}
catch (err){
    Sentry.captureException(err);
}

try{
    router.post('/', userController.find);}
catch (err){
    Sentry.captureException(err);
}


try{
    router.get('/adduser', userController.form);
}
catch (err){
    Sentry.captureException(err);
}


try{
    router.post('/adduser', userController.create);
}
catch (err){
    Sentry.captureException(err);
}


try{
    router.get('/edituser/:id', userController.edit);
}
catch (err){
    Sentry.captureException(err);
}


try{
    router.post('/edituser/:id', userController.edit);
}
catch (err){
    Sentry.captureException(err);
}


try{
    router.get('/viewuser/:id', userController.viewall);
}
catch (err){
    Sentry.captureException(err);
}


try{
    router.get('/:id',userController.delete);
}
catch (err){
    Sentry.captureException(err);
}
finally{
    transaction.finish();
}


module.exports = router;