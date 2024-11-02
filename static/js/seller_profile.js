document.addEventListener('DOMContentLoaded', function () {
    var fileInput = document.getElementById('seller-document-upload');
    var fileNameDisplay = document.getElementById('seller-document-name');
    var logoInput = document.getElementById('change-logo');
    var logoDisplay = document.getElementById('business-logo');
    var deleteLogoBtn = document.getElementById('delete-logo');
    var editButton = document.getElementById('editButton');
    var saveButton = document.getElementById('saveButton');
    var inputs = document.querySelectorAll('input, select, textarea');

    // File upload handling
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function (e) {
            var fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
            fileNameDisplay.textContent = fileName;
        });
    }

    // Logo handling
    if (logoInput && logoDisplay) {
        logoInput.addEventListener('change', function (e) {
            if (e.target.files && e.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var logoData = e.target.result;
                    logoDisplay.src = logoData;
                    sessionStorage.setItem('businessLogo', logoData);
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    if (deleteLogoBtn) {
        deleteLogoBtn.addEventListener('click', function () {
            logoDisplay.src = "../static/images/default_business_logo.png";
            logoInput.value = '';
            sessionStorage.removeItem('businessLogo');
        });
    }

    var savedLogo = sessionStorage.getItem('businessLogo');
    if (savedLogo) {
        logoDisplay.src = savedLogo;
    }else{
        logoDisplay.src = "../static/images/default_business_logo.png";
    }

    editButton.addEventListener('click', function() {
        const isEditing = inputs[0].disabled;
        inputs.forEach(input => {
            input.disabled = !isEditing;
        });
        if (isEditing) {
            saveButton.style.display = 'inline-block';
        } else {
            saveButton.style.display = 'none';
        }
    });
    saveButton.addEventListener('click', function() {
        const formData = {};
        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value;
            }
        });
        sessionStorage.setItem('sellerProfile', JSON.stringify(formData));
        alert('Profile saved successfully!');
        inputs.forEach(input => {
            input.disabled = true;
        });
        saveButton.style.display = 'none';
    });

    const savedData = JSON.parse(sessionStorage.getItem('sellerProfile'));
    if (savedData) {
        Object.keys(savedData).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = savedData[key];
            }
        });
    }

    inputs.forEach(input => {
        input.disabled = true;
    });
});