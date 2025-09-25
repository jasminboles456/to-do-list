class Todo {
    constructor(text, userId) {
        this.id = new Date().getTime() + Math.random();
        this.text = text;
        this.completed = false;
        this.userId = userId;
    }

    toggle() {
        this.completed = !this.completed;
    }

    updateText(newText) {
        this.text = newText;
    }

    save() {
        var todos = Todo.getAllTodos();
        todos.push(this);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static getAllTodos() {
        var todos = localStorage.getItem('todos');
        if (todos) {
            return JSON.parse(todos);
        } else {
            return [];
        }
    }

    static getTodosByUserId(userId) {
        var allTodos = Todo.getAllTodos();
        var userTodos = [];
        for (var i = 0; i < allTodos.length; i++) {
            if (allTodos[i].userId === userId) {
                userTodos.push(allTodos[i]);
            }
        }
        return userTodos;
    }

    static updateTodo(todoId, updates) {
        var todos = Todo.getAllTodos();
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === todoId) {
                if (updates.completed !== undefined) {
                    todos[i].completed = updates.completed;
                }
                if (updates.text !== undefined) {
                    todos[i].text = updates.text;
                }
                break;
            }
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    static deleteTodo(todoId) {
        var todos = Todo.getAllTodos();
        var newTodos = [];
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id !== todoId) {
                newTodos.push(todos[i]);
            }
        }
        localStorage.setItem('todos', JSON.stringify(newTodos));
    }
}