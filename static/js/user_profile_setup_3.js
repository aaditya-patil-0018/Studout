document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('budgetPreferencesForm');
    const budgetSliderContainer = document.getElementById('budgetSliderContainer');
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');

    document.querySelectorAll('input[name="budgetPreference"]').forEach((radio) => {
        radio.addEventListener('change', function() {
            budgetSliderContainer.style.display = this.value === 'custom' ? 'block' : 'none';
            budgetSlider.required = this.value === 'custom';
        });
    });

    budgetSlider.addEventListener('input', function() {
        budgetValue.textContent = '₹' + parseInt(this.value).toLocaleString('en-IN');
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());  // This is the correct object to use
    
        const data = {
            "budget_preference": jsonData.budgetPreference,  // Use jsonData instead of json
        };
    
        if (jsonData.budgetPreference === 'custom') {
            jsonData.budgetValue = budgetSlider.value;
            data["budgetValue"] = budgetSlider.value;
        }
    
        sessionStorage.setItem('budgetPreferences', JSON.stringify(jsonData));
    
        document.cookie = `budgetPreferences=${JSON.stringify(jsonData)}; path=/; max-age=31536000`;
    
        console.log('Budget Preferences:', jsonData);
    
        try {
            // Send the POST request
            const response = await fetch('/user-profile-setup-3', {
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
                window.location.href = '/user-profile'; // Modify this URL as per your needs
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