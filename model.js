const store = {};
const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    name: String,
    description: String,
    done: Boolean,
    deadline: Date,
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
    Todo,
    store
};