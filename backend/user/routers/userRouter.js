const UserRouter = require('express');
const validateRequest = require("../middleware/validateRequest");
const {editProfileValidationChain} = require("../validators/users");
const router = new UserRouter;
const user = require('../controllers/UserController')
const project = require('../controllers/ProjectController');
const fileUploadMiddleware = require("../middleware/fileUpload");

router.get('/:user_id', user.getUser);
router.patch('/update', editProfileValidationChain, validateRequest, user.updateUser);
router.patch('/avatarUpload', fileUploadMiddleware, user.userAvatarUpload);
router.post('/create',project.createProject);
module.exports = router;