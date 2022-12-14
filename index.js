// This project was built following the tutorial at https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-2-3780a1c5b039

// Create the express dependencies we installed. Express is a node.js web application framework.
const express = require("express");
const app = express();
// requiring the dotenv file which contains our connection string
const dotenv = require("dotenv");
// requiring mongoose to make connection with the database
const mongoose = require("mongoose");
// requiring our model from TodoTask.js
const TodoTask = require("./models/TodoTask");

dotenv.config();

// Accessing the CSS file
app.use("/static", express.static("public"));

// urlencoded used to add form to body of request in order to extract data from the form
app.use(express.urlencoded({ extended: true }));

// deprecated, but included in tutorial
// mongoose.set("useFindAndModify", false);

// ensures that the server will only run after the connection is made
// linking to the connection string DB_CONNECT here
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    // Setting port number to the dynamic PORT variable set by Heroku
    // If not set, then dedicating the port number and telling app to listen to that port
    // Also logging that the server is up and running
    app.listen(process.env.PORT || 3000, () => console.log("Server up and running"));
});

// setting up to link to the ejs files
app.set("view engine", "ejs");

// get method, using to pass non confidential information that can be seen in browser URL and can be cached.
// In this case, it is used to render the original todo page
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// post method to send content to mongoDB, inserting data into the database
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});


// update method for editing
app
    .route("/edit/:id")
    // showing the todoEdit.ejs page when prompted by the edit button, 
    // passing in the id of the list item
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    // sending the edited list item to the database
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });


// delete method, using findByIdAndRemove to identify the id that needs to be removed and taking it out of the database
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});
