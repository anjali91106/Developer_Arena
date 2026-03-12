// ===================================
// TECHHUB BLOG/NEWS WEBSITE JAVASCRIPT
// ===================================

console.log('TechHub Website JavaScript loaded successfully!');

// ===================================
// GLOBAL VARIABLES
// ===================================
const elements = {
    // Navigation
    header: document.querySelector('.header'),
    navLinks: document.querySelectorAll('.nav-link'),
    searchToggle: document.getElementById('search-toggle'),
    searchBar: document.getElementById('search-bar'),
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    menuToggle: document.getElementById('menu-toggle'),
    
    // Newsletter
    newsletterForm: document.getElementById('newsletter-form'),
    newsletterEmail: document.getElementById('newsletter-email'),
    newsletterMessage: document.getElementById('newsletter-message'),
    
    // Contact Form
    contactForm: document.getElementById('contact-form'),
    formMessage: document.getElementById('form-message'),
    
    // Category Filter
    filterBtns: document.querySelectorAll('.filter-btn'),
    articlesGrid: document.getElementById('articles-grid'),
    articleCards: document.querySelectorAll('.article-card'),
    loadMoreBtn: document.getElementById('load-more'),
    
    // FAQ
    faqItems: document.querySelectorAll('.faq-item'),
    
    // Back to Top
    backToTop: document.getElementById('back-to-top'),
    
    // Stats
    statNumbers: document.querySelectorAll('.stat-number')
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Show/hide elements
function toggleElement(element, show = null) {
    if (show === null) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    } else {
        element.style.display = show ? 'block' : 'none';
    }
}

// Show message with type
function showMessage(element, message, type = 'info') {
    if (!element) return;
    
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
        element.textContent = '';
    }, 5000);
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone
function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return !phone || phoneRegex.test(phone);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

// Toggle search bar
function toggleSearch() {
    if (elements.searchBar) {
        elements.searchBar.classList.toggle('active');
        if (elements.searchBar.classList.contains('active')) {
            elements.searchInput?.focus();
        }
    }
}

// Mobile Menu Elements
let mobileMenu = null;
let mobileMenuOverlay = null;
let mobileMenuClose = null;
let mobileNavLinks = null;

// Initialize mobile menu elements
function initMobileMenu() {
    mobileMenu = document.querySelector('.mobile-menu');
    mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    mobileMenuClose = document.querySelector('.mobile-menu-close');
    mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (!mobileMenu) {
        initMobileMenu();
    }
    
    const isOpen = mobileMenu.classList.contains('active');
    
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Open mobile menu
function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Setup mobile menu event listeners
function setupMobileMenuListeners() {
    // Close menu when clicking overlay
    mobileMenuOverlay?.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking close button
    mobileMenuClose?.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking navigation links
    mobileNavLinks?.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Smooth scroll to anchor
function smoothScrollToAnchor(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Highlight active navigation
function highlightActiveNav() {
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
// SEARCH FUNCTIONALITY
// ===================================

function handleSearch(event) {
    event.preventDefault();
    
    const searchTerm = elements.searchInput?.value?.trim();
    if (!searchTerm) {
        showMessage(elements.searchForm?.parentElement?.querySelector('.form-message') || elements.formMessage, 'Please enter a search term', 'error');
        return;
    }
    
    // Simulate search functionality
    console.log('Searching for:', searchTerm);
    showMessage(elements.searchForm?.parentElement?.querySelector('.form-message') || elements.formMessage, `Searching for "${searchTerm}"...`, 'info');
    
    // In a real application, this would make an API call
    setTimeout(() => {
        showMessage(elements.searchForm?.parentElement?.querySelector('.form-message') || elements.formMessage, `Found 0 results for "${searchTerm}"`, 'info');
    }, 1000);
}

// ===================================
// NEWSLETTER FUNCTIONALITY
// ===================================

function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const email = elements.newsletterEmail?.value?.trim();
    
    if (!email) {
        showMessage(elements.newsletterMessage, 'Please enter your email address', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage(elements.newsletterMessage, 'Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate newsletter subscription
    console.log('Newsletter subscription:', email);
    showMessage(elements.newsletterMessage, 'Successfully subscribed! Check your email for confirmation.', 'success');
    
    if (elements.newsletterForm) {
        elements.newsletterForm.reset();
    }
}

// ===================================
// CONTACT FORM FUNCTIONALITY
// ===================================

function validateContactForm() {
    let isValid = true;
    const formData = {};
    
    // Get all form inputs
    const inputs = elements.contactForm?.querySelectorAll('input, select, textarea');
    if (!inputs) return false;
    
    inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup?.querySelector('.error-message');
        
        // Remove previous error state
        formGroup?.classList.remove('error');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        
        // Validate based on input type and requirements
        const value = input.value?.trim();
        const isRequired = input.hasAttribute('required');
        const inputType = input.type;
        const inputName = input.name;
        
        formData[inputName] = value;
        
        if (isRequired && !value) {
            formGroup?.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'This field is required';
                errorMessage.style.display = 'block';
            }
            isValid = false;
        } else if (value) {
            // Specific validations
            if (inputType === 'email' && !validateEmail(value)) {
                formGroup?.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Please enter a valid email address';
                    errorMessage.style.display = 'block';
                }
                isValid = false;
            } else if (inputType === 'tel' && !validatePhone(value)) {
                formGroup?.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Please enter a valid phone number';
                    errorMessage.style.display = 'block';
                }
                isValid = false;
            } else if (inputName === 'message' && value.length < 10) {
                formGroup?.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Message must be at least 10 characters long';
                    errorMessage.style.display = 'block';
                }
                isValid = false;
            } else if (inputName === 'firstName' && value.length < 2) {
                formGroup?.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'First name must be at least 2 characters long';
                    errorMessage.style.display = 'block';
                }
                isValid = false;
            } else if (inputName === 'lastName' && value.length < 2) {
                formGroup?.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Last name must be at least 2 characters long';
                    errorMessage.style.display = 'block';
                }
                isValid = false;
            }
        }
    });
    
    // Check privacy checkbox
    const privacyCheckbox = elements.contactForm?.querySelector('#privacy');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        const privacyGroup = privacyCheckbox.closest('.form-group');
        privacyGroup?.classList.add('error');
        const errorMessage = privacyGroup?.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = 'You must agree to the privacy policy and terms of service';
            errorMessage.style.display = 'block';
        }
        isValid = false;
    }
    
    return { isValid, formData };
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    const validation = validateContactForm();
    
    if (!validation.isValid) {
        showMessage(elements.formMessage, 'Please correct the errors below', 'error');
        return;
    }
    
    // Simulate form submission
    console.log('Contact form submitted:', validation.formData);
    showMessage(elements.formMessage, 'Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
    
    if (elements.contactForm) {
        elements.contactForm.reset();
    }
}

// ===================================
// CATEGORY FILTER FUNCTIONALITY
// ===================================

function filterArticles(category) {
    if (!elements.articleCards) return;
    
    elements.articleCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Update active button
    elements.filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

function handleCategoryFilter(event) {
    const category = event.target.dataset.category;
    filterArticles(category);
}

// ===================================
// LOAD MORE FUNCTIONALITY
// ===================================

function loadMoreArticles() {
    // Simulate loading more articles
    console.log('Loading more articles...');
    
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.textContent = 'Loading...';
        elements.loadMoreBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, this would load actual articles
        showMessage(elements.formMessage, 'No more articles to load', 'info');
        
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.textContent = 'No More Articles';
            elements.loadMoreBtn.disabled = true;
        }
    }, 1000);
}

// ===================================
// FAQ FUNCTIONALITY
// ===================================

function toggleFAQ(faqItem) {
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    elements.faqItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function handleFAQClick(event) {
    const faqItem = event.target.closest('.faq-item');
    if (faqItem) {
        toggleFAQ(faqItem);
    }
}

// ===================================
// BACK TO TOP FUNCTIONALITY
// ===================================

function toggleBackToTop() {
    if (elements.backToTop) {
        if (window.pageYOffset > 300) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================================
// STATS ANIMATION
// ===================================

function animateStats() {
    elements.statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// ===================================
// IMAGE LAZY LOADING
// ===================================

function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// FORM INPUT ANIMATIONS
// ===================================

function setupFormAnimations() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('focused');
        });
        
        // Add input validation on blur
        input.addEventListener('blur', () => {
            validateSingleInput(input);
        });
    });
}

function validateSingleInput(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup?.querySelector('.error-message');
    const value = input.value?.trim();
    const isRequired = input.hasAttribute('required');
    const inputType = input.type;
    const inputName = input.name;
    
    // Remove previous error state
    formGroup?.classList.remove('error');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    
    if (isRequired && !value) {
        formGroup?.classList.add('error');
        if (errorMessage) {
            errorMessage.textContent = 'This field is required';
            errorMessage.style.display = 'block';
        }
        return false;
    }
    
    if (value) {
        if (inputType === 'email' && !validateEmail(value)) {
            formGroup?.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'Please enter a valid email address';
                errorMessage.style.display = 'block';
            }
            return false;
        }
        
        if (inputType === 'tel' && !validatePhone(value)) {
            formGroup?.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'Please enter a valid phone number';
                errorMessage.style.display = 'block';
            }
            return false;
        }
    }
    
    return true;
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

function logPerformance() {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
}

// ===================================
// ERROR HANDLING
// ===================================

function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

// ===================================
// INITIALIZATION
// ===================================

function initializeApp() {
    console.log('Initializing TechHub website...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup form animations
    setupFormAnimations();
    
    // Setup mobile menu
    setupMobileMenuListeners();
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Setup error handling
    setupErrorHandling();
    
    // Initial checks
    toggleBackToTop();
    
    console.log('TechHub website initialized successfully!');
}

function setupEventListeners() {
    // Navigation
    elements.searchToggle?.addEventListener('click', toggleSearch);
    elements.menuToggle?.addEventListener('click', toggleMobileMenu);
    elements.searchForm?.addEventListener('submit', handleSearch);
    
    // Newsletter
    elements.newsletterForm?.addEventListener('submit', handleNewsletterSubmit);
    
    // Contact Form
    elements.contactForm?.addEventListener('submit', handleContactSubmit);
    
    // Category Filter
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });
    
    // Load More
    elements.loadMoreBtn?.addEventListener('click', loadMoreArticles);
    
    // FAQ
    elements.faqItems.forEach(item => {
        item.addEventListener('click', handleFAQClick);
    });
    
    // Back to Top
    elements.backToTop?.addEventListener('click', scrollToTop);
    
    // Scroll events
    window.addEventListener('scroll', throttle(highlightActiveNav, 100));
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
    
    // Navigation smooth scroll
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                smoothScrollToAnchor(targetId);
            }
        });
    });
    
    // Stats animation on scroll
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        
        statsObserver.observe(statsSection);
    }
    
    // Performance monitoring
    window.addEventListener('load', logPerformance);
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
// UTILITY EXPORTS (for potential module usage)
// =================================== */

window.TechHub = {
    toggleSearch,
    showMessage,
    validateEmail,
    validatePhone,
    filterArticles,
    toggleFAQ,
    scrollToTop
};
