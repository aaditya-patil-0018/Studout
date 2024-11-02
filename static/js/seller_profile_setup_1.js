document.addEventListener('DOMContentLoaded', function () {
    const fileUpload = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');
    const form = document.getElementById('sellerProfileSetupForm1');
    let selectedFile = null;

    fileUpload.addEventListener('change', function (event) {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            fileName.textContent = selectedFile.name;
            
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgData = e.target.result.split(',')[1];
                sessionStorage.setItem('seller_profile_picture', imgData);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            fileName.textContent = 'Upload Image';
        }
    });

    window.onload = function () {
        if (sessionStorage.getItem('seller_full_name')) {
            document.getElementById('full-name').value = sessionStorage.getItem('seller_full_name');
        }

        if (sessionStorage.getItem('seller_gender')) {
            document.querySelector(`input[name="gender"][value="${sessionStorage.getItem('seller_gender')}"]`).checked = true;
        }

        if (sessionStorage.getItem('seller_dob')) {
            document.getElementById('dob').value = sessionStorage.getItem('seller_dob');
        }

        if (sessionStorage.getItem('seller_business_name')) {
            document.getElementById('business_name').value = sessionStorage.getItem('seller_business_name');
        }

        if (sessionStorage.getItem('seller_business_description')) {
            document.getElementById('business_description').value = sessionStorage.getItem('seller_business_description');
        }

        if (sessionStorage.getItem('seller_area_of_residence')) {
            document.getElementById('area_of_residence').value = sessionStorage.getItem('seller_area_of_residence');
        }

        if (sessionStorage.getItem('seller_email')) {
            document.getElementById('email').value = sessionStorage.getItem('seller_email');
        }

        if (sessionStorage.getItem('seller_mobile_number')) {
            document.getElementById('mobile_number').value = sessionStorage.getItem('seller_mobile_number');
        }

        if (sessionStorage.getItem('seller_profile_picture_name')) {
            fileName.textContent = sessionStorage.getItem('seller_profile_picture_name');
        }
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const fullName = formData.get('full-name');
        const gender = formData.get('gender');
        const dob = formData.get('dob');
        const businessName = formData.get('business_name');
        const businessDescription = formData.get('business_description');
        const areaOfResidence = formData.get('area_of_residence');
        const email = formData.get('email');
        const mobileNumber = formData.get('mobile_number');
        const profilePicture = sessionStorage.getItem('seller_profile_picture');

        sessionStorage.setItem('seller_full_name', fullName);
        sessionStorage.setItem('seller_gender', gender);
        sessionStorage.setItem('seller_dob', dob);
        sessionStorage.setItem('seller_business_name', businessName);
        sessionStorage.setItem('seller_business_description', businessDescription);
        sessionStorage.setItem('seller_area_of_residence', areaOfResidence);
        sessionStorage.setItem('seller_email', email);
        sessionStorage.setItem('seller_mobile_number', mobileNumber);
        sessionStorage.setItem('seller_profile_picture', profilePicture);
        sessionStorage.setItem('seller_profile_picture_name', selectedFile.name);
        
        const maxAge = 60 * 60 * 24 * 30;
        document.cookie = `seller_full_name=${fullName}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_gender=${gender}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_dob=${dob}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_business_name=${businessName}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_business_description=${businessDescription}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_area_of_residence=${areaOfResidence}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_email=${email}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_mobile_number=${mobileNumber}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_profile_picture=${profilePicture}; path=/; max-age=${maxAge}`;

        alert('Profile data updated');
        window.location.href = '/seller-profile-setup-2';
    });
});