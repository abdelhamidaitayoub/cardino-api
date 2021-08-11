const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/usernameAvailable', authController.usernameAvailable);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/updateMe',
  authController.protect,
  userController.updateUserPhoto,
  userController.resizeUserPhoto,
  userController.updateCurrentUser
);

router.delete(
  '/deleteMe',
  authController.protect,
  userController.deleteCurrentUser
);

router.get(
  '/me',
  authController.protect,
  userController.getCurrentUser,
  userController.getOne
);

router.get('/username/:username', userController.getUserByUsername);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAll
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.create
  );

router
  .route('/:userId')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getOne
  )

  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.delate
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.update
  );

module.exports = router;
