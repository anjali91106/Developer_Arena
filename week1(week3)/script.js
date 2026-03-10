// ===================================
// JAVASCRIPT PORTFOLIO INTERACTIONS
// ===================================

console.log('Portfolio JavaScript loaded successfully!');

// ===================================
// GLOBAL VARIABLES
// ===================================
let todos = [];
let currentSlide = 0;
let slideInterval;

// ===================================
// DOM ELEMENTS
// ===================================
const elements = {
    // Dark mode
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    body: document.body,
    
    // Form
    contactForm: document.getElementById('contact-form'),
    formMessage: document.getElementById('form-message'),
    
    // Todo list
    todoInput: document.getElementById('todo-input'),
    addTodoBtn: document.getElementById('add-todo-btn'),
    todoList: document.getElementById('todo-list'),
    todoCount: document.getElementById('todo-count'),
    clearCompletedBtn: document.getElementById('clear-completed'),
    
    // Image slider
    slider: document.querySelector('.slider'),
    slides: document.querySelectorAll('.slide'),
    prevBtn: document.getElementById('prev-slide'),
    nextBtn: document.getElementById('next-slide'),
    sliderDots: document.getElementById('slider-dots'),
    
    // Navigation
    navLinks: document.querySelectorAll('nav a')
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Show/hide content with animation
function toggleContent(element, show = null) {
    if (show === null) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    } else {
        element.style.display = show ? 'block' : 'none';
    }
}

// Show message with type
function showMessage(message, type = 'info') {
    if (!elements.formMessage) return;
    
    elements.formMessage.textContent = message;
    elements.formMessage.className = `form-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.formMessage.textContent = '';
        elements.formMessage.className = 'form-message';
    }, 5000);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save to localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load from localStorage
function loadFromLocalStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// ===================================
// DARK MODE FUNCTIONALITY
// ===================================

function toggleDarkMode() {
    elements.body.classList.toggle('dark-mode');
    const isDarkMode = elements.body.classList.contains('dark-mode');
    
    // Update button icon
    if (elements.darkModeToggle) {
        elements.darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        elements.darkModeToggle.title = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    }
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
}

function initializeDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (savedDarkMode) {
        elements.body.classList.add('dark-mode');
        if (elements.darkModeToggle) {
            elements.darkModeToggle.textContent = '☀️';
            elements.darkModeToggle.title = 'Toggle Light Mode';
        }
    }
}

// ===================================
// FORM VALIDATION
// ===================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(event) {
    event.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();
    
    // Reset previous messages
    showMessage('', 'info');
    
    // Validation checks
    const errors = [];
    
    if (!name || name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!email || !validateEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!message || message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (message.length > 500) {
        errors.push('Message must be less than 500 characters');
    }
    
    // Show errors or success
    if (errors.length > 0) {
        showMessage(errors.join('. '), 'error');
        return false;
    }
    
    // Success
    showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
    elements.contactForm.reset();
    return true;
}

// ===================================
// TODO LIST FUNCTIONALITY
// ===================================

function createTodoItem(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    li.innerHTML = `
        <div class="todo-content">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text" contenteditable="false">${todo.text}</span>
            <input type="text" class="todo-edit-input" value="${todo.text}" style="display: none;">
        </div>
        <div class="todo-actions">
            <button class="edit-btn" title="Edit task">✏️</button>
            <button class="save-btn" title="Save task" style="display: none;">💾</button>
            <button class="cancel-btn" title="Cancel edit" style="display: none;">❌</button>
            <button class="delete-btn" title="Delete task">🗑️</button>
        </div>
    `;
    
    // Add event listeners
    const checkbox = li.querySelector('.todo-checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const saveBtn = li.querySelector('.save-btn');
    const cancelBtn = li.querySelector('.cancel-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    const todoText = li.querySelector('.todo-text');
    const editInput = li.querySelector('.todo-edit-input');
    
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    editBtn.addEventListener('click', () => startEdit(todo.id));
    saveBtn.addEventListener('click', () => saveEdit(todo.id));
    cancelBtn.addEventListener('click', () => cancelEdit(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    // Enter key to save, Escape to cancel
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEdit(todo.id);
        } else if (e.key === 'Escape') {
            cancelEdit(todo.id);
        }
    });
    
    return li;
}

function renderTodos() {
    if (!elements.todoList) return;
    
    elements.todoList.innerHTML = '';
    
    if (todos.length === 0) {
        elements.todoList.innerHTML = '<li class="todo-empty">No tasks yet. Add your first task above!</li>';
        updateTodoCount();
        return;
    }
    
    todos.forEach(todo => {
        elements.todoList.appendChild(createTodoItem(todo));
    });
    
    updateTodoCount();
}

function addTodo() {
    const text = elements.todoInput?.value?.trim();
    
    if (!text) {
        showMessage('Please enter a task', 'error');
        return;
    }
    
    if (text.length > 100) {
        showMessage('Task must be less than 100 characters', 'error');
        return;
    }
    
    const newTodo = {
        id: generateId(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(newTodo);
    saveTodos();
    renderTodos();
    
    if (elements.todoInput) {
        elements.todoInput.value = '';
        elements.todoInput.focus();
    }
    
    showMessage('Task added successfully!', 'success');
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function startEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    if (!todoItem) return;
    
    const todoText = todoItem.querySelector('.todo-text');
    const editInput = todoItem.querySelector('.todo-edit-input');
    const editBtn = todoItem.querySelector('.edit-btn');
    const saveBtn = todoItem.querySelector('.save-btn');
    const cancelBtn = todoItem.querySelector('.cancel-btn');
    
    // Show edit input, hide text
    todoText.style.display = 'none';
    editInput.style.display = 'block';
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    
    // Focus and select the input
    editInput.focus();
    editInput.select();
    editInput.setSelectionRange(0, editInput.value.length);
}

function saveEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    if (!todoItem) return;
    
    const todoText = todoItem.querySelector('.todo-text');
    const editInput = todoItem.querySelector('.todo-edit-input');
    const editBtn = todoItem.querySelector('.edit-btn');
    const saveBtn = todoItem.querySelector('.save-btn');
    const cancelBtn = todoItem.querySelector('.cancel-btn');
    
    const newText = editInput.value.trim();
    
    if (!newText) {
        showMessage('Task cannot be empty', 'error');
        editInput.focus();
        return;
    }
    
    if (newText.length > 100) {
        showMessage('Task must be less than 100 characters', 'error');
        editInput.focus();
        return;
    }
    
    // Update todo in array
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.text = newText;
        saveTodos();
        renderTodos();
        showMessage('Task updated successfully!', 'success');
    }
}

function cancelEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    if (!todoItem) return;
    
    const todoText = todoItem.querySelector('.todo-text');
    const editInput = todoItem.querySelector('.todo-edit-input');
    const editBtn = todoItem.querySelector('.edit-btn');
    const saveBtn = todoItem.querySelector('.save-btn');
    const cancelBtn = todoItem.querySelector('.cancel-btn');
    
    // Restore original text and hide edit input
    todoText.style.display = 'inline';
    editInput.style.display = 'none';
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    
    // Reset input value to original
    const todo = todos.find(t => t.id === id);
    if (todo) {
        editInput.value = todo.text;
    }
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
        showMessage('Task deleted', 'info');
    }
}

function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        showMessage('No completed tasks to clear', 'info');
        return;
    }
    
    if (confirm(`Clear ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
        showMessage(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`, 'success');
    }
}

function updateTodoCount() {
    if (!elements.todoCount) return;
    
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    
    elements.todoCount.textContent = `${active} active${total !== active ? `, ${completed} completed` : ''}`;
}

function saveTodos() {
    saveToLocalStorage('todos', todos);
}

function loadTodos() {
    todos = loadFromLocalStorage('todos', []);
    renderTodos();
}

// ===================================
// IMAGE SLIDER FUNCTIONALITY
// ===================================

function showSlide(index) {
    if (!elements.slides.length) return;
    
    // Wrap around
    if (index >= elements.slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = elements.slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Hide all slides
    elements.slides.forEach(slide => slide.classList.remove('active'));
    
    // Show current slide
    elements.slides[currentSlide].classList.add('active');
    
    // Update dots
    updateSliderDots();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function createSliderDots() {
    if (!elements.sliderDots || !elements.slides.length) return;
    
    elements.sliderDots.innerHTML = '';
    
    elements.slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${index === currentSlide ? 'active' : ''}`;
        dot.textContent = '•';
        dot.addEventListener('click', () => showSlide(index));
        elements.sliderDots.appendChild(dot);
    });
}

function updateSliderDots() {
    if (!elements.sliderDots) return;
    
    const dots = elements.sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

function initializeSlider() {
    if (!elements.slides.length) return;
    
    showSlide(0);
    createSliderDots();
    startSlideshow();
}

// ===================================
// NAVIGATION ENHANCEMENTS
// ===================================

function smoothScrollToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===================================
// INITIALIZATION
// ===================================

function initializeApp() {
    console.log('Initializing portfolio app...');
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Load todos
    loadTodos();
    
    // Initialize slider
    initializeSlider();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Portfolio app initialized successfully!');
}

function setupEventListeners() {
    // Dark mode toggle
    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Form validation
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', validateForm);
    }
    
    // Todo list
    if (elements.addTodoBtn) {
        elements.addTodoBtn.addEventListener('click', addTodo);
    }
    
    if (elements.todoInput) {
        elements.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    }
    
    if (elements.clearCompletedBtn) {
        elements.clearCompletedBtn.addEventListener('click', clearCompleted);
    }
    
    // Image slider
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    // Pause slideshow on hover
    if (elements.slider) {
        elements.slider.addEventListener('mouseenter', stopSlideshow);
        elements.slider.addEventListener('mouseleave', startSlideshow);
    }
    
    // Navigation smooth scrolling
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                smoothScrollToSection(targetId);
            }
        });
    });
    
    // Scroll-based navigation highlighting
    window.addEventListener('scroll', highlightActiveSection);
    
    // Keyboard navigation for slider
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// ===================================
// START THE APP
// ===================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===================================
// PERFORMANCE MONITORING
// ===================================

// Log page load performance
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});
