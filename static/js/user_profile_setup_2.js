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

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const selectedServices = formData.getAll('service');

        sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
        
        console.log('Selected services:', selectedServices);
        window.location.href = '/user-profile-setup-3';
    });
});