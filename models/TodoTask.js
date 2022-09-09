// This project was built following the tutorial at https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-2-3780a1c5b039

const mongoose = require('mongoose');

// making the collection schema of what data is required to be collected
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// exporting it for use in the index.js file
module.exports = mongoose.model('TodoTask',todoTaskSchema);