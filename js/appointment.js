document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const typeParam = urlParams.get('type');
    
    // Pre-fill service if provided
    if (serviceParam) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            for (let option of serviceSelect.options) {
                if (option.value === serviceParam) {
                    option.selected = true;
                    break;
                }
            }
        }
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const date = document.getElementById('date').value;
        
        if (!name || !phone || !address || !date) {
            showToast('Please fill all required fields');
            return;
        }
        
        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            showToast('Enter valid 10-digit phone number');
            return;
        }
        
        // Collect form data
        const formData = {
            name: name,
            phone: phone,
            address: address,
            city: document.getElementById('city').value,
            date: date,
            time: document.getElementById('time').value,
            service: document.getElementById('service').value,
            sqft: document.getElementById('sqft').value || 'Not specified',
            notes: document.getElementById('notes').value || 'None',
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (simulate database)
        saveAppointment(formData);
        
        // Show success message
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Booking Confirmed!';
        submitBtn.style.background = '#25a36b';
        
        showToast('✓ Appointment booked! We\'ll call you soon.');
        
        // Reset after 3 seconds
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Book Free Site Visit';
            submitBtn.style.background = '#e6b422';
        }, 3000);
        
        // Send to Python backend (if available)
        sendToBackend(formData);
    });
});

// Save to localStorage
function saveAppointment(data) {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(data);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Send to Python backend
async function sendToBackend(data) {
    try {
        const response = await fetch('http://localhost:5000/api/appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Backend response:', result);
    } catch (error) {
        console.log('Backend not available, data saved locally');
    }
}

// Toast function
function showToast(text) {
    const toast = document.getElementById('toastMessage');
    toast.style.opacity = '1';
    toast.innerText = '📱 ' + text;
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}
