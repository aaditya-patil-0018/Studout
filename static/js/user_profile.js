document.getElementById('change-picture').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Image = e.target.result;
            document.getElementById('profile-picture').src = base64Image;
            sessionStorage.setItem('profilePicture', base64Image);
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('delete-picture').addEventListener('click', function () {
    document.getElementById('profile-picture').src = "../static/images/default_avatar.webp";
    sessionStorage.removeItem('profilePicture');
});

window.addEventListener('load', function() {
    const savedProfilePicture = sessionStorage.getItem('profilePicture');
    if (savedProfilePicture) {
        document.getElementById('profile-picture').src = savedProfilePicture;
    }
});

const budgetRange = document.getElementById('budgetRange');
const budgetValue = document.getElementById('budgetValue');

budgetRange.addEventListener('input', function() {
    budgetValue.textContent = this.value;
});

const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const inputs = document.querySelectorAll('input, select');

saveButton.style.display = 'none';

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
            if (input.type === 'checkbox' && input.checked) {
                if (!formData['services']) {
                    formData['services'] = [];
                }
                formData['services'].push(input.value);
            } else if (input.type !== 'checkbox') {
                formData[input.name] = input.value;
            }
        }
    });
    formData['budget'] = budgetRange.value;
    sessionStorage.setItem('userProfile', JSON.stringify(formData));
    alert('Profile saved successfully!');
    inputs.forEach(input => {
        input.disabled = true;
    });
    saveButton.style.display = 'none';
});

window.addEventListener('load', function() {
    const savedData = JSON.parse(sessionStorage.getItem('userProfile'));
    if (savedData) {
        Object.keys(savedData).forEach(key => {
            if (key === 'services') {
                savedData[key].forEach(service => {
                    const checkbox = document.querySelector(`input[type="checkbox"][value="${service}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            } else {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = savedData[key];
                }
            }
        });
        if (savedData.budget) {
            budgetRange.value = savedData.budget;
            budgetValue.textContent = savedData.budget;
        }
    }
    inputs.forEach(input => {
        input.disabled = true;
        input.required = true;
    });
});