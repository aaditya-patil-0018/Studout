document.addEventListener('DOMContentLoaded', function () {
    const fileUpload = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');
    const form = document.getElementById('profileSetupForm');
    let selectedFile = null;

    fileUpload.addEventListener('change', function (event) {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            fileName.textContent = selectedFile.name;

            const reader = new FileReader();
            reader.onload = function (e) {
                const imgData = e.target.result.split(',')[1];
                sessionStorage.setItem('profile_picture', imgData);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            fileName.textContent = 'Upload Image';
        }
    });
    window.onload = function () {
        if (sessionStorage.getItem('full_name')) {
            document.getElementById('full-name').value = sessionStorage.getItem('full_name');
        }

        if (sessionStorage.getItem('gender')) {
            document.querySelector(`input[name="gender"][value="${sessionStorage.getItem('gender')}"]`).checked = true;
        }

        if (sessionStorage.getItem('dob')) {
            document.getElementById('dob').value = sessionStorage.getItem('dob');
        }

        if (sessionStorage.getItem('college')) {
            document.getElementById('college').value = sessionStorage.getItem('college');
        }

        if (sessionStorage.getItem('area_of_residence')) {
            document.getElementById('area_of_residence').value = sessionStorage.getItem('area_of_residence');
        }

        if (sessionStorage.getItem('email')) {
            document.getElementById('email').value = sessionStorage.getItem('email');
        }

        if (sessionStorage.getItem('mobile_number')) {
            document.getElementById('mobile_number').value = sessionStorage.getItem('mobile_number');
        }

        if (sessionStorage.getItem('profile_picture_name')) {
            fileName.textContent = sessionStorage.getItem('profile_picture_name');
        }
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const fullName = formData.get('full-name');
        const gender = formData.get('gender');
        const dob = formData.get('dob');
        const college = formData.get('college');
        const areaOfResidence = formData.get('area_of_residence');
        const email = formData.get('email');
        const mobileNumber = formData.get('mobile_number');
        const profilePicture = sessionStorage.getItem('profilePicture');

        sessionStorage.setItem('full_name', fullName);
        sessionStorage.setItem('gender', gender);
        sessionStorage.setItem('dob', dob);
        sessionStorage.setItem('college', college);
        sessionStorage.setItem('area_of_residence', areaOfResidence);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('mobile_number', mobileNumber);
        sessionStorage.setItem('profile_picture', profilePicture);
        sessionStorage.setItem('profile_picture_name', selectedFile.name);

        const maxAge = 60 * 60 * 24 * 30;
        document.cookie = `full_name=${fullName}; path=/; max-age=${maxAge}`;
        document.cookie = `gender=${gender}; path=/; max-age=${maxAge}`;
        document.cookie = `dob=${dob}; path=/; max-age=${maxAge}`;
        document.cookie = `college=${college}; path=/; max-age=${maxAge}`;
        document.cookie = `area_of_residence=${areaOfResidence}; path=/; max-age=${maxAge}`;
        document.cookie = `email=${email}; path=/; max-age=${maxAge}`;
        document.cookie = `mobile_number=${mobileNumber}; path=/; max-age=${maxAge}`;
        document.cookie = `profile_picture=${profilePicture}; path=/; max-age=${maxAge}`;

        const data = {
            "full-name": formData.get('full-name'),
            "dob": formData.get('dob'),
            "gender": formData.get('gender'),
            "college": formData.get('college'),
            "area_of_residence": formData.get('area_of_residence'),
            "email": formData.get('email'),
            "mobile_number": formData.get('mobile_number'),
            "profilePicture": sessionStorage.getItem('profilePicture')
        }

        try {
            // Send the POST request
            const response = await fetch('/user-profile-setup-1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            // Handle the response
            if (response.ok) {
                const result = await response.json();
                alert('Data submitted successfully!');
                console.log('Response:', result);
            } else {
                const error = await response.json();
                alert('Error submitting data.');
                console.error('Error:', error);
            }
        } catch (error) {
            alert('Failed to send data. Please try again later.');
            console.error('Error:', error);
        }

    //     // alert('Profile data updated');
    //     // window.location.href = '/user-profile-setup-2';
    });
});