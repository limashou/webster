const mongoose = require('mongoose');

const ProjectsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.Number,
    data: mongoose.Schema.Types.Mixed
});

const Project = mongoose.model('project', ProjectsSchema);

module.exports = Project;