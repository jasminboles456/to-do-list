class User {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.id = new Date().getTime();
    }

    save() {
        var users = User.getAllUsers();
        users.push(this);
        localStorage.setItem('users', JSON.stringify(users));
    }

    static getAllUsers() {
        var users = localStorage.getItem('users');
        if (users) {
            return JSON.parse(users);
        } else {
            return [];
        }
    }

    static findByEmail(email) {
        var users = User.getAllUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                return users[i];
            }
        }
        return null;
    }

    static emailExists(email) {
        var user = User.findByEmail(email);
        return user !== null;
    }

    static validateCredentials(email, password) {
        var user = User.findByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }
}