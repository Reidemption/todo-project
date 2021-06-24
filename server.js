//import express
const express = require("express");
const { model } = require("mongoose");
const { store, Todo } = require("./model.js");
const fileManager = require("./file-manager.js");
const app = express();

// tell the app to use json
app.use(express.json({}));

// perform the middleware action here
app.use((req, res, next) => {
  console.log(
    "Time",
    Date.now(),
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});

// Get - get all
app.get("/todo/", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  console.log(`return all`);
  Todo.find({}, function (err, todos) {
    if (err) {
      console.log(`there was an error fetching the todos.`);
      res.status(500).json({ message: `unable to get todos`, error: err });
      return;
    }

    res.status(200).json(todos);
  });
});

// Get - get one
app.get("/todo/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`Getting id:${req.params.id}`);
  Todo.findById(req.params.id, (err, todo) => {
    // check if there was an error
    if (err) {
      console.log(`unable to find todo with id ${req.params.id}`, err);
      res.status(500).send(
        JSON.stringify({
          message: `unable to find todo with id ${req.params.id}`,
          error: err,
        })
      );
      return;
    } else if (todo === null) {
      res.status(404).json({ message: `unable to find todo`, error: err });
      return;
    }

    // res.status(200).send(JSON.stringify(todo))
    res.status(200).json(todo); //both lines of res.status work the same
  });
});

// Post - post one
app.post("/todo/", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a todo with a body ${req.body}`);
  if (!req.body.name || !req.body.description) {
    console.log(`unable to create todo because no name or description`);
    res.status(400).json({
      message: "unable to create todo",
      error: "missing a name or description",
    });
    return;
  }

  Todo.create(
    {
      name: req.body.name,
      description: req.body.description,
      done: req.body.done || false,
      deadline: req.body.deadline || new Date(),
    },
    (err, todo) => {
      if (err) {
        console.log(`unable to create todo`);
        res.status(400).json({
          message: "unable to create todo",
          error: err,
        });
        return;
      }
      fileManager.logTodoCreate(todo._id);
      res.status(201).json(todo);
    }
  );
});

// Delete - delete one
app.delete("/todo/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`Deleting id: ${req.params.id}`, req.body);
  Todo.findByIdAndDelete(req.params.id, (err, todo) => {
    // check if there was an error
    if (err) {
      console.log(`unable to delete todo with id ${req.params.id}`, err);
      res.status(404).send(
        JSON.stringify({
          message: `unable to delete todo with id ${req.params.id}`,
          error: err,
        })
      );
      return;
    }
    // res.status(200).send(JSON.stringify(todo))
    fileManager.logTodoDelete(todo._id);
    res.status(200).json(todo); //both lines of res.status work the same
  });
});

// Patch - update
app.patch("/todo/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`Patching id: ${req.params.id}`, req.body);
  let updateTodo = {};
  if (req.body.name) {
    updateTodo.name = req.body.name;
  }
  if (req.body.deadline) {
    updateTodo.deadline = req.body.deadline;
  }
  if (req.body.description) {
    updateTodo.description = req.body.description;
  }
  if (
    req.body.done !== null &&
    req.body.done !== undefined &&
    req.body.done !== ""
  ) {
    updateTodo.done = req.body.done;
  }

  Todo.updateOne(
    { _id: req.params.id },
    {
      $set: updateTodo,
    },
    function (err, updateOneResponse) {
      if (err) {
        console.log(`unable to PATCH with id: ${req.params.id}`);
        res.status(404).json({
          message: `unable to update todo with id ${req.params.id}`,
          error: err,
        });
      } else if (updateOneResponse.n) {
        res.status(200).json(updateTodo);
      }
      return;
    }
  );
});

// Put - replace
app.put("/todo/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`Putting id: ${req.params.id}`, req.body);
  if (!req.body.name || !req.body.description) {
    console.log(`unable to replace todo because no name or description`);
    res.status(400).json({
      message: "unable to replace todo",
      error: "missing a name or description",
    });
    return;
  }

  let todoUpdate = {
    name: req.body.name,
    description: req.body.description,
    done: req.body.done || false,
    deadline: req.body.deadline || new Date(),
  };

  Todo.updateOne(
    { _id: req.params.id },
    todoUpdate,
    function (err, updateOneResponse) {
      if (err) {
        console.log(`unable to PUT with id: ${req.params.id}`);
        res.status(404).json({
          message: `unable to replace todo with id ${req.params.id}`,
          error: err,
        });
      } else if (updateOneResponse.n) {
        res.status(200).json(todoUpdate);
      }
      return;
    }
  );
});

module.exports = app;
