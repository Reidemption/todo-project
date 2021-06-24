var url = "https://code-school-todo-app.herokuapp.com";

var app = new Vue({
  el: "#app",
  data: {
    todos: [
      // {
      //     name: 'eat food',
      //     description: 'Now',
      //     done:false,
      //     editing: false,
      //     deadline: new Date().toLocaleDateString()
      // }
    ],
    new_todo_name: "",
    new_todo_description: "",
    new_todo_deadline: "",
  },

  created: function () {
    this.getTodos();
  },
  methods: {
    getTodos: function () {
      fetch(`${url}/todo`).then(function (response) {
        response.json().then(function (data) {
          console.log(data);
          app.todos = data;
        });
      });
    },

    addNewTodo: function () {
      var request_body = {
        name: this.new_todo_name,
        description: this.new_todo_description,
        done: false,
        deadline: this.new_todo_deadline,
      };
      fetch(`${url}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_body),
      }).then(function (response) {
        console.log(request_body);
        if (response.status == 400) {
          response.json().then(function (data) {
            alert(data.message);
          });
        } else if (response.status == 201) {
          app.new_todo_deadline = "";
          app.new_todo_description = "";
          app.new_todo_name = "";
          app.getTodos();
        }
      });
    },
    deleteTodo: function (todo) {
      fetch(`${url}/todo/` + todo, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        app.getTodos();
      });
    },
    saveTodo: function (todo) {
      var changes = {
        name: todo.name,
        description: todo.description,
        deadline: todo.deadline,
        done: todo.done,
      };
      fetch(`${url}/todo/` + todo._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });
      // todo.editing = false;
      this.$set(todo, "editing", false);
    },
    editTodo: function (todo) {
      // todo.editing = true;
      this.$set(todo, "editing", true);
    },
    saveTodoDone: function (todo) {
      fetch(`${url}/todo/` + todo._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          done: todo.done,
        }),
      });
      console.log(todo.done);
    },
  },
});
