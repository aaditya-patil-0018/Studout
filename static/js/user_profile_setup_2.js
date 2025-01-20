document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('profileSetupForm');

    function updateCheckboxIcon(checkbox) {
        const icon = checkbox.closest('label').querySelector('i');
        if (checkbox.checked) {
            icon.className = 'fa-solid fa-circle-check';
        } else {
            icon.className = 'fa-regular fa-circle';
        }
    }

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCheckboxIcon(this);
        });
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const formData = new FormData(form);
    
        let ss = [];
        for (const [key, value] of formData.entries()) {
            ss.push(value);
            console.log(`${key}: ${value}`);
        }
    
        const selectedServices = ss;
        sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    
        console.log('Selected services:', selectedServices);
    
        const data = {
            "selectedServices": selectedServices
        };
    
        try {
            // Send the POST request
            const response = await fetch('/user-profile-setup-2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Check if the response is JSON and successful
            const contentType = response.headers.get('content-type');
            if (response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();
                    // alert('Data submitted successfully!');
                    console.log('Response:', result);
                } else {
                    const text = await response.text();
                    // alert('Data submitted successfully!');
                    console.log('Response (non-JSON):', text);
                }

                // Redirect to the next page
                window.location.href = '/user-profile-setup-3'; // Modify this URL as per your needs
            } else {
                const error = await response.text();
                // alert('Error submitting data: ' + error);
                console.error('Error:', error);
            }
        } catch (error) {
            // alert('Failed to send data. Please try again later.');
            console.error('Error:', error);
        }
    });
});