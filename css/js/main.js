// Initialize Swiper slider
document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        speed: 600,
    });

    // Welcome toast
    setTimeout(() => showToast('👋 Raj Marketing, Mysore · 10 offers'), 400);
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

// Status Card Items
document.getElementById('ongoingJobs').addEventListener('click', () => showToast('Ongoing installations'));
document.getElementById('pendingVisits').addEventListener('click', () => showToast('Pending visits'));
document.getElementById('totalSqft').addEventListener('click', () => showToast('Total sqft this month'));

// Services
document.getElementById('viewAllServices').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('All services');
});
document.getElementById('velcroService').addEventListener('click', () => showToast('Velcro system · ₹60/sqft'));
document.getElementById('frameService').addEventListener('click', () => showToast('Frame system · ₹180/sqft'));
document.getElementById('pleatedService').addEventListener('click', () => showToast('Pleated nets · ₹350/sqft'));
document.getElementById('meshDoorService').addEventListener('click', () => showToast('Mesh door · ₹380/sqft'));

// Quick Actions
document.getElementById('callAction').addEventListener('click', () => showToast('Call now · 9483037385'));
document.getElementById('whatsappAction').addEventListener('click', () => showToast('WhatsApp business'));
document.getElementById('directionAction').addEventListener('click', () => showToast('Direction to Hootghalli, Mysore'));
document.getElementById('shareAction').addEventListener('click', () => showToast('Share business card'));

// Info Banner
document.getElementById('infoBanner').addEventListener('click', () => showToast('Free measurement · No commitment'));

// Explore Services
document.getElementById('exploreServices').addEventListener('click', () => showToast('Explore all mosquito net types'));

// Special Offers
document.getElementById('offer1').addEventListener('click', () => showToast('Buy 2 windows get 1 free mesh'));
document.getElementById('offer2').addEventListener('click', () => showToast('5% off on frame system'));

// Bazaar Card
document.getElementById('bazaarCard').addEventListener('click', () => showToast('Raj Marketing · 9483037385'));

// Promo Banner
document.getElementById('promoBanner').addEventListener('click', () => showToast('Combo offer: door + window @ ₹720/sqft'));

// Safety & Utility
document.getElementById('safetyAwareness').addEventListener('click', () => showToast('Safety tips: child lock on nets'));
document.getElementById('utilityTools').addEventListener('click', () => showToast('EMI calculator, sqft converter'));

// Floating Action Button
document.getElementById('fabButton').addEventListener('click', () => showToast('📋 Quick estimate'));

// Bottom Navigation
document.getElementById('navHome').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('🏠 Home');
});
document.getElementById('navExplore').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('🔍 Explore services');
});
document.getElementById('navSaved').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('❤️ Saved offers');
});
document.getElementById('navCall').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('📞 Call 9483037385');
});
document.getElementById('navAccount').addEventListener('click', function() {
    updateActiveNav(this);
    showToast('👤 My account');
});

// Function to update active navigation item
function updateActiveNav(clickedItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    clickedItem.classList.add('active');
}

// Add click listeners to all elements with 'clickable' class (for any we might have missed)
document.querySelectorAll('.clickable').forEach(element => {
    // Only add if it doesn't already have an onclick (to avoid duplicates)
    if (!element.hasAttribute('data-listener')) {
        element.setAttribute('data-listener', 'true');
        // Skip elements that already have specific handlers
        if (!element.id) {
            element.addEventListener('click', () => showToast('Raj Marketing · ' + (element.innerText.trim() || 'menu')));
        }
    }
});
