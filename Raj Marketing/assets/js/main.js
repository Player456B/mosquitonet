// Main JavaScript File

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize all components
    initLoader();
    initMobileNav();
    initSliders();
    initSearch();
    initSmoothScroll();
    initDropdowns();
    initToast();
    initLazyLoading();
    initCurrentYear();
});

// ===== LOADER =====
function initLoader() {
    const loader = document.getElementById('loading-page');
    const progressBar = document.querySelector('.loader-progress');
    
    if (loader && progressBar) {
        // Start progress animation
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 200);
        
        // Hide loader after content is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1500);
        });
        
        // Fallback: hide loader after 3 seconds
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 3000);
    }
}

// ===== MOBILE NAVIGATION =====
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu on window resize (if desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// ===== SLIDER FUNCTIONALITY =====
class Slider {
    constructor(sliderId, prevBtnId, nextBtnId) {
        this.slider = document.getElementById(sliderId);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        
        if (!this.slider || !this.prevBtn || !this.nextBtn) return;
        
        this.init();
    }
    
    init() {
        this.updateButtons();
        
        this.prevBtn.addEventListener('click', () => this.scroll('left'));
        this.nextBtn.addEventListener('click', () => this.scroll('right'));
        
        this.slider.addEventListener('scroll', () => this.updateButtons());
        
        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.scroll('right');
                } else {
                    this.scroll('left');
                }
            }
        }, { passive: true });
        
        // Debounced resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.updateButtons(), 250);
        });
    }
    
    getSlideWidth() {
        const firstSlide = this.slider.children[0];
        if (!firstSlide) return 0;
        
        const style = window.getComputedStyle(this.slider);
        const gap = parseInt(style.gap) || 24;
        return firstSlide.offsetWidth + gap;
    }
    
    scroll(direction) {
        const slideWidth = this.getSlideWidth();
        if (!slideWidth) return;
        
        const scrollAmount = direction === 'left' ? -slideWidth : slideWidth;
        
        this.slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    updateButtons() {
        if (!this.slider) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = this.slider;
        
        // Disable prev button if at start (with small threshold)
        this.prevBtn.disabled = scrollLeft <= 5;
        
        // Disable next button if at end (with small threshold)
        this.nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 5;
    }
}

function initSliders() {
    // Initialize all sliders
    new Slider('featuresSlider', 'featuresPrev', 'featuresNext');
    new Slider('productsSlider', 'productsPrev', 'productsNext');
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                showToast(`Searching for: "${query}"`);
                
                // Here you would normally redirect to search results
                // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                
                searchInput.value = '';
            } else {
                showToast('Please enter a search term');
            }
        });
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== DROPDOWNS =====
function initDropdowns() {
    // Handle dropdowns on mobile
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                dropdown.classList.toggle('active');
            });
        });
    }
}

// ===== TOAST NOTIFICATION =====
let toastTimeout;

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    
    if (!toast) return;
    
    // Clear existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after duration
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function initToast() {
    // Make showToast available globally
    window.showToast = showToast;
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
}

// Make validation functions available globally
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;

// ===== API CALLS (Simulated) =====
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'API call successful',
                    data: data
                });
            }, 1000);
        });
    } catch (error) {
        console.error('API Error:', error);
        showToast('An error occurred. Please try again.');
        return null;
    }
}

window.apiCall = apiCall;
