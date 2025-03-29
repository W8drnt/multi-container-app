const express = require('express');
const router = express.Router();

// Import Todo model with error handling
let Todo;
try {
    Todo = require('./../models/Todo');
} catch (err) {
    console.log(`Error loading Todo model: ${err.message}`);
}

// Home page route
router.get('/', async (req, res) => {
    try {
        let todos = [];
        if (Todo) {
            todos = await Todo.find();
        }
        res.render("todos", {
            tasks: (Object.keys(todos).length > 0 ? todos : {})
        });
    } catch (err) {
        console.log(`Error fetching todos: ${err.message}`);
        res.render("todos", {
            tasks: {}
        });
    }
});

// POST - Submit Task
router.post('/', (req, res) => {
    try {
        if (Todo) {
            const newTask = new Todo({
                task: req.body.task
            });

            newTask.save()
                .then(task => res.redirect('/'))
                .catch(err => {
                    console.log(`Error saving todo: ${err.message}`);
                    res.redirect('/');
                });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(`Error creating todo: ${err.message}`);
        res.redirect('/');
    }
});

// POST - Destroy todo item
router.post('/todo/destroy', async (req, res) => {
    try {
        if (Todo) {
            const taskKey = req.body._key;
            await Todo.findOneAndRemove({_id: taskKey});
        }
        res.redirect('/');
    } catch (err) {
        console.log(`Error deleting todo: ${err.message}`);
        res.redirect('/');
    }
});

module.exports = router;