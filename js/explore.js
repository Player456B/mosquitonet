document.addEventListener('DOMContentLoaded', function() {
    // Get service parameter
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    
    if (service) {
        // Scroll to specific service
        const element = document.getElementById(`${service}Detail`);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
                element.style.background = '#fff9e6';
                setTimeout(() => {
                    element.style.background = 'white';
                }, 1000);
            }, 300);
        }
    }
    
    // Category chips
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterServices(this.textContent);
        });
    });
});

function filterServices(category) {
    const services = document.querySelectorAll('.service-detail-card');
    services.forEach(service => {
        if (category === 'All') {
            service.style.display = 'block';
        } else {
            // Simple filter logic
            const title = service.querySelector('h4').textContent;
            if (title.toLowerCase().includes(category.toLowerCase())) {
                service.style.display = 'block';
            } else {
                service.style.display = 'none';
            }
        }
    });
}
