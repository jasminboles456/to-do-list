class App {
    constructor() {
        this.currentUser = null;
        this.currentTodos = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        var self = this;
        
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            self.handleLogin(e);
        });
        
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            self.handleRegister(e);
        });
        
        document.getElementById('showRegister').addEventListener('click', function(e) {
            self.showPage('register');
        });
        document.getElementById('showLogin').addEventListener('click', function(e) {
            self.showPage('login');
        });
        
        document.getElementById('logoutBtn').addEventListener('click', function() {
            self.logout();
        });
        
        document.getElementById('todoForm').addEventListener('submit', function(e) {
            self.handleAddTodo(e);
        });
    }

    checkAuth() {
        var currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
            this.showPage('home');
            this.loadTodos();
        } else {
            this.showPage('login');
        }
    }

    showPage(pageName) {
        var pages = document.querySelectorAll('.page');
        for (var i = 0; i < pages.length; i++) {
            pages[i].classList.remove('active');
        }
        
        document.getElementById(pageName + 'Page').classList.add('active');
        
        if (pageName === 'home' && this.currentUser) {
            this.loadTodos();
            document.getElementById('userName').textContent = this.currentUser.firstName;
        }
        
        if (window.langManager) {
            langManager.updateLanguage();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        var email = document.getElementById('loginEmail').value.trim();
        var password = document.getElementById('loginPassword').value;
        var messageEl = document.getElementById('loginMessage');
        
        messageEl.textContent = '';
        messageEl.className = 'message';
        
        if (!email || !password) {
            this.showMessage(messageEl, langManager.getText('fillFields'), 'error');
            return;
        }
        
        if (!User.emailExists(email)) {
            this.showMessage(messageEl, langManager.getText('userNotFound'), 'error');
            return;
        }
        
        var user = User.validateCredentials(email, password);
        if (!user) {
            this.showMessage(messageEl, langManager.getText('invalidPassword'), 'error');
            return;
        }
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.showMessage(messageEl, langManager.getText('loginSuccess'), 'success');
        
        var self = this;
        setTimeout(function() {
            self.showPage('home');
            self.loadTodos();
            document.getElementById('userName').textContent = user.firstName;
        }, 1000);
    }

    handleRegister(e) {
        e.preventDefault();
        
        var firstName = document.getElementById('registerFirstName').value.trim();
        var lastName = document.getElementById('registerLastName').value.trim();
        var email = document.getElementById('registerEmail').value.trim();
        var password = document.getElementById('registerPassword').value;
        var messageEl = document.getElementById('registerMessage');
        
        messageEl.textContent = '';
        messageEl.className = 'message';
        
        if (!firstName || !lastName || !email || !password) {
            this.showMessage(messageEl, langManager.getText('fillFields'), 'error');
            return;
        }
        
        if (User.emailExists(email)) {
            this.showMessage(messageEl, langManager.getText('emailExists'), 'error');
            return;
        }
        
        var newUser = new User(firstName, lastName, email, password);
        newUser.save();
        
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.showMessage(messageEl, langManager.getText('registerSuccess'), 'success');
        
        var self = this;
        setTimeout(function() {
            self.showPage('home');
            self.loadTodos();
            document.getElementById('userName').textContent = newUser.firstName;
        }, 1000);
    }

    handleAddTodo(e) {
        e.preventDefault();
        
        var input = document.getElementById('todoInput');
        var text = input.value.trim();
        
        if (!text) return;
        
        var todo = new Todo(text, this.currentUser.id);
        todo.save();
        
        this.currentTodos.push(todo);
        this.renderTodos();
        
        input.value = '';
    }

    loadTodos() {
        if (!this.currentUser) return;
        
        this.currentTodos = Todo.getTodosByUserId(this.currentUser.id);
        this.renderTodos();
    }

    renderTodos() {
        var todoList = document.getElementById('todoList');
        
        if (this.currentTodos.length === 0) {
            todoList.innerHTML = '<div class="empty-state">' + langManager.getText('noTasks') + '</div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < this.currentTodos.length; i++) {
            var todo = this.currentTodos[i];
            var completedClass = todo.completed ? 'completed' : '';
            var checkedAttr = todo.completed ? 'checked' : '';
            
            html += '<div class="todo-item ' + completedClass + '" data-todo-id="' + todo.id + '">';
            html += '<input type="checkbox" class="todo-checkbox" ' + checkedAttr + ' onchange="app.toggleTodo(\'' + todo.id + '\')">';
            html += '<span class="todo-text">' + this.escapeHtml(todo.text) + '</span>';
            html += '<div class="todo-actions">';
            html += '<button class="edit-btn" onclick="app.editTodo(\'' + todo.id + '\')">' + langManager.getText('edit') + '</button>';
            html += '<button class="delete-btn" onclick="app.deleteTodo(\'' + todo.id + '\')">' + langManager.getText('delete') + '</button>';
            html += '</div>';
            html += '</div>';
        }
        
        todoList.innerHTML = html;
    }

    toggleTodo(todoId) {
        for (var i = 0; i < this.currentTodos.length; i++) {
            if (this.currentTodos[i].id == todoId) {
                this.currentTodos[i].toggle();
                Todo.updateTodo(todoId, { completed: this.currentTodos[i].completed });
                this.renderTodos();
                break;
            }
        }
    }

    editTodo(todoId) {
        var todoItem = document.querySelector('[data-todo-id="' + todoId + '"]');
        var todo = null;
        
        for (var i = 0; i < this.currentTodos.length; i++) {
            if (this.currentTodos[i].id == todoId) {
                todo = this.currentTodos[i];
                break;
            }
        }
        
        if (!todo) return;
        
        todoItem.classList.add('editing');
        
        var editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'todo-edit-input';
        editInput.value = todo.text;
        
        var saveBtn = document.createElement('button');
        saveBtn.textContent = langManager.getText('save');
        saveBtn.className = 'todo-save-btn';
        var self = this;
        saveBtn.onclick = function() {
            self.saveTodoEdit(todoId, editInput.value);
        };
        
        var cancelBtn = document.createElement('button');
        cancelBtn.textContent = langManager.getText('cancel');
        cancelBtn.className = 'todo-cancel-btn';
        cancelBtn.onclick = function() {
            self.cancelTodoEdit(todoId);
        };
        
        var todoText = todoItem.querySelector('.todo-text');
        var todoActions = todoItem.querySelector('.todo-actions');
        
        todoText.style.display = 'none';
        todoActions.style.display = 'none';
        
        todoItem.insertBefore(editInput, todoActions);
        todoItem.insertBefore(saveBtn, todoActions);
        todoItem.insertBefore(cancelBtn, todoActions);
        
        editInput.focus();
        editInput.select();
    }

    saveTodoEdit(todoId, newText) {
        var trimmedText = newText.trim();
        
        if (!trimmedText) {
            this.cancelTodoEdit(todoId);
            return;
        }
        
        for (var i = 0; i < this.currentTodos.length; i++) {
            if (this.currentTodos[i].id == todoId) {
                this.currentTodos[i].updateText(trimmedText);
                Todo.updateTodo(todoId, { text: trimmedText });
                this.renderTodos();
                break;
            }
        }
    }

    cancelTodoEdit(todoId) {
        var todoItem = document.querySelector('[data-todo-id="' + todoId + '"]');
        todoItem.classList.remove('editing');
        this.renderTodos();
    }

    deleteTodo(todoId) {
        if (confirm(langManager.getText('deleteConfirm'))) {
            var newTodos = [];
            for (var i = 0; i < this.currentTodos.length; i++) {
                if (this.currentTodos[i].id != todoId) {
                    newTodos.push(this.currentTodos[i]);
                }
            }
            this.currentTodos = newTodos;
            
            Todo.deleteTodo(todoId);
            this.renderTodos();
        }
    }

    logout() {
        this.currentUser = null;
        this.currentTodos = [];
        localStorage.removeItem('currentUser');
        this.showPage('login');
        
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        document.getElementById('loginMessage').textContent = '';
        document.getElementById('registerMessage').textContent = '';
    }

    showMessage(element, message, type) {
        element.textContent = message;
        element.className = 'message ' + type;
    }

    escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}