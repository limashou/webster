const Router = require('express');
const project = require('../controller/ProjectController');
const router = new Router();

//project
router.get('/v1/api/projects/:project_id',project.getByProjectId);
router.post('/v1/api/projects/:project_id/save', project.saveProject);

module.exports = router;