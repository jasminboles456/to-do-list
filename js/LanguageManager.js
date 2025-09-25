const translations = {
    en: {
        login: 'Login',
        register: 'Register',
        email: 'Email:',
        password: 'Password:',
        firstName: 'First Name:',
        lastName: 'Last Name:',
        noAccount: 'Don\'t have an account?',
        registerHere: 'Register here',
        haveAccount: 'Already have an account?',
        loginHere: 'Login here',
        welcome: 'Welcome,',
        logout: 'Logout',
        todoList: 'My Todo List',
        addTask: 'Add Task',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        deleteConfirm: 'Are you sure you want to delete this task?',
        noTasks: 'No tasks yet. Add one above',
        fillFields: 'Please fill in all fields',
        userNotFound: 'User not found, please register.',
        invalidPassword: 'Invalid password',
        loginSuccess: 'Login successful',
        emailExists: 'Email already exists. Please use a different email.',
        registerSuccess: 'Registration successful Logging you in...',
        placeholderTask: 'Add a new task...'
    },
    ar: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        email: 'البريد الإلكتروني:',
        password: 'كلمة المرور:',
        firstName: 'الاسم الأول:',
        lastName: 'الاسم الأخير:',
        noAccount: 'ليس لديك حساب؟',
        registerHere: 'سجل هنا',
        haveAccount: 'لديك حساب بالفعل؟',
        loginHere: 'سجل دخولك هنا',
        welcome: 'أهلاً بك،',
        logout: 'تسجيل خروج',
        todoList: 'قائمة مهامي',
        addTask: 'إضافة مهمة',
        edit: 'تعديل',
        delete: 'حذف',
        save: 'حفظ',
        cancel: 'إلغاء',
        deleteConfirm: 'هل أنت متأكد من حذف هذه المهمة؟',
        noTasks: 'لا توجد مهام حتى الآن. أضف مهمة من الأعلى',
        fillFields: 'يرجى ملء جميع الحقول',
        userNotFound: 'المستخدم غير موجود، يرجى التسجيل.',
        invalidPassword: 'كلمة مرور خاطئة',
        loginSuccess: 'تم تسجيل الدخول بنجاح',
        emailExists: 'البريد الإلكتروني موجود بالفعل. يرجى استخدام بريد آخر.',
        registerSuccess: 'تم إنشاء الحساب بنجاح جاري تسجيل الدخول...',
        placeholderTask: 'أضف مهمة جديدة...'
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.updateLanguage();
        this.bindEvents();
    }

    bindEvents() {
        var self = this;
        var toggleButtons = document.querySelectorAll('.lang-toggle');
        for (var i = 0; i < toggleButtons.length; i++) {
            toggleButtons[i].addEventListener('click', function() {
                self.toggleLanguage();
            });
        }
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('language', this.currentLang);
        this.updateLanguage();
    }

    updateLanguage() {
        var elements = document.querySelectorAll('[data-lang]');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var key = element.getAttribute('data-lang');
            if (translations[this.currentLang][key]) {
                element.textContent = translations[this.currentLang][key];
            }
        }

        var placeholderInput = document.getElementById('todoInput');
        if (placeholderInput) {
            placeholderInput.placeholder = translations[this.currentLang].placeholderTask;
        }

        var toggleButtons = document.querySelectorAll('.lang-toggle');
        for (var i = 0; i < toggleButtons.length; i++) {
            toggleButtons[i].textContent = this.currentLang === 'en' ? 'عربي' : 'English';
        }

        document.documentElement.setAttribute('lang', this.currentLang);
        document.documentElement.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
        document.body.className = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    }

    getText(key) {
        return translations[this.currentLang][key] || key;
    }
}