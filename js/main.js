// Initialize all sliders
document.addEventListener('DOMContentLoaded', function() {
    // Main promotional slider (10 images)
    const mainSlider = new Swiper('.main-slider', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.main-slider .swiper-pagination',
            clickable: true,
        },
        speed: 600,
    });

    // Status cards slider (6 cards)
    const statusSlider = new Swiper('.status-slider', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
        pagination: {
            el: '.status-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1.2,
                spaceBetween: 12
            }
        }
    });

    // Welcome toast
    setTimeout(() => showToast('👋 Raj Marketing, Mysore · Business Overview'), 400);
});

// Toast function for all interactions
function showToast(text) {
    const toast = document.getElementById('toastMessage');
    toast.style.opacity = '1';
    toast.innerText = '📱 ' + text + ' (live in index)';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 1400);
}

// ========== EVENT LISTENERS FOR ALL CLICKABLE ELEMENTS ==========

// Header Icons
document.getElementById('notificationBtn').addEventListener('click', () => showToast('Notifications'));
document.getElementById('profileBtn').addEventListener('click', () => showToast('Profile'));

// Status Cards (6 cards)
document.getElementById('ongoingJobs').addEventListener('click', () => showToast('Ongoing installations: 3 jobs this week'));
document.getElementById('pendingVisits').addEventListener('click', () => showToast('Pending site visits: 5 locations scheduled'));
document.getElementById('totalSqft').addEventListener('click', () => showToast('Total sqft this month: 1,240 sqft'));
document.getElementById('revenueCard').addEventListener('click', () => showToast('Monthly revenue: ₹1,85,000'));
document.getElementById('ratingCard').addEventListener('click', () => showToast('Customer rating: 4.9/5.0 from 248 reviews'));
document.getElementById('completedCard').addEventListener('click', () => showToast('Completed projects: 156 since 2012'));

// Services
document.getElementById('viewAllServices').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('All services');
});
document.getElementById('velcroService').addEventListener('click', () => showToast('Velcro system · ₹60/sqft · easy installation'));
document.getElementById('frameService').addEventListener('click', () => showToast('Frame system · ₹180/sqft · durable aluminum frame'));
document.getElementById('pleatedService').addEventListener('click', () => showToast('Pleated nets · ₹350/sqft · retractable design'));
document.getElementById('meshDoorService').addEventListener('click', () => showToast('Mesh door · ₹380/sqft · magnetic closure'));

// Quick Actions
document.getElementById('callAction').addEventListener('click', () => showToast('Call now · 9483037385'));
document.getElementById('whatsappAction').addEventListener('click', () => showToast('WhatsApp business · 9483037385'));
document.getElementById('directionAction').addEventListener('click', () => showToast('Direction: #65, Hootghalli industries area, Mysore'));
document.getElementById('shareAction').addEventListener('click', () => showToast('Share business card via...'));

// Info Banner
document.getElementById('infoBanner').addEventListener('click', () => showToast('Free measurement · No commitment · Call to schedule'));

// Explore Services
document.getElementById('exploreServices').addEventListener('click', () => showToast('Explore all mosquito net types and prices'));

// Special Offers
document.getElementById('offer1').addEventListener('click', () => showToast('Buy 2 windows get 1 free mesh · Limited time'));
document.getElementById('offer2').addEventListener('click', () => showToast('5% off on frame system · This month only'));

// Bazaar Card
document.getElementById('bazaarCard').addEventListener('click', () => showToast('Raj Marketing · 9483037385 · Since 2012'));

// Promo Banner
document.getElementById('promoBanner').addEventListener('click', () => showToast('Combo offer: door + window @ ₹720/sqft · Save 10%'));

// Safety & Utility
document.getElementById('safetyAwareness').addEventListener('click', () => showToast('Safety tips: child lock on nets, regular cleaning'));
document.getElementById('utilityTools').addEventListener('click', () => showToast('EMI calculator, sqft converter, material estimator'));

// Floating Action Button
document.getElementById('fabButton').addEventListener('click', () => showToast('📋 Quick estimate · Get instant price'));

// Bottom Navigation
document.getElementById('navHome').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('🏠 Home · Business dashboard');
});
document.getElementById('navExplore').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('🔍 Explore services & products');
});
document.getElementById('navSaved').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('❤️ Saved offers and favorites');
});
document.getElementById('navCall').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('📞 Call 9483037385 · 9 AM to 8 PM');
});
document.getElementById('navAccount').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('👤 My account · Business profile');
});

// Function to update active navigation item
function updateActiveNav(clickedItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    clickedItem.classList.add('active');
}

// Add click listeners to all elements with 'clickable' class
document.querySelectorAll('.clickable').forEach(element => {
    if (!element.hasAttribute('data-listener')) {
        element.setAttribute('data-listener', 'true');
        if (!element.id) {
            element.addEventListener('click', () => showToast('Raj Marketing · ' + (element.innerText.trim() || 'menu')));
        }
    }
});
