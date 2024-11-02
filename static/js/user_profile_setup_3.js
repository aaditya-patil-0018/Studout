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

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        if (jsonData.budgetPreference === 'custom') {
            jsonData.budgetValue = budgetSlider.value;
        }

        sessionStorage.setItem('budgetPreferences', JSON.stringify(jsonData));

        document.cookie = `budgetPreferences=${JSON.stringify(jsonData)}; path=/; max-age=31536000`;

        console.log('Budget Preferences:', jsonData);
        window.location.href = '/home';
    });
});