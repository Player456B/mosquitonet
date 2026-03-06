// Initialize all sliders
document.addEventListener('DOMContentLoaded', function() {
    // Main promotional slider
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

    // Status cards slider
    const statusSlider = new Swiper('.status-slider', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
        pagination: {
            el: '.status-pagination',
            clickable: true,
        },
    });

    // Services slider
    const servicesSlider = new Swiper('.services-slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        freeMode: true,
        pagination: {
            el: '.services-pagination',
            clickable: true,
        },
    });

    // Bazaar slider
    const bazaarSlider = new Swiper('.bazaar-slider', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
        pagination: {
            el: '.bazaar-pagination',
            clickable: true,
        },
    });

    // Welcome toast
    setTimeout(() => showToast('👋 Welcome to Raj Marketing'), 400);
});

// Toast function
function showToast(text) {
    const toast = document.getElementById('toastMessage');
    toast.style.opacity = '1';
    toast.innerText = '📱 ' + text;
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 1400);
}

// Share function
function shareBusiness() {
    if (navigator.share) {
        navigator.share({
            title: 'Raj Marketing - Mosquito Nets',
            text: 'Best mosquito nets in Mysore. Velcro: ₹60/sqft, Frame: ₹180/sqft',
            url: window.location.href
        });
    } else {
        showToast('Share link copied to clipboard');
    }
}

// Open calculator
function openCalculator() {
    const sqft = prompt('Enter area in sqft:');
    if (sqft) {
        const velcro = sqft * 60;
        const frame = sqft * 180;
        showToast(`Velcro: ₹${velcro}, Frame: ₹${frame}`);
    }
}

// Status card click handlers
document.getElementById('ongoingJobs').addEventListener('click', () => showToast('3 ongoing installations'));
document.getElementById('pendingVisits').addEventListener('click', () => showToast('5 site visits scheduled'));
document.getElementById('totalSqft').addEventListener('click', () => showToast('1,240 sqft this month'));
document.getElementById('revenueCard').addEventListener('click', () => showToast('Revenue: ₹1,85,000'));
document.getElementById('ratingCard').addEventListener('click', () => showToast('Rating: 4.9/5 from 248 reviews'));
document.getElementById('completedCard').addEventListener('click', () => showToast('156 completed projects'));

// Menu button
document.getElementById('menuBtn').addEventListener('click', () => showToast('Menu opened'));

// Notification button
document.getElementById('notificationBtn').addEventListener('click', () => showToast('No new notifications'));
