document.addEventListener('DOMContentLoaded', function () {
    const idFileUpload = document.getElementById('id-file-upload');
    const idFileName = document.getElementById('id-file-name');
    const form = document.getElementById('sellerProfileSetupForm2');
    let selectedIdFile = null;

    idFileUpload.addEventListener('change', function (event) {
        selectedIdFile = event.target.files[0];
        if (selectedIdFile) {
            idFileName.textContent = selectedIdFile.name;
        } else {
            idFileName.textContent = 'Upload Image';
        }
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const governmentId = formData.get('government-id');
        const termsAccepted = formData.get('terms-conditions') === 'on';

        // Add image to FormData
        if (selectedIdFile) {
            formData.append('seller_id_proof', selectedIdFile);
        }

        // Save data in sessionStorage for convenience
        sessionStorage.setItem('seller_government_id', governmentId);
        sessionStorage.setItem('seller_terms_accepted', termsAccepted);

        try {
            const response = await fetch('/seller-profile-setup-2', {
                method: 'POST',
                body: formData, // Send FormData including the file
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Response:', result);
                alert('Verification details updated');
                window.location.href = '/seller/dashboard';
            } else {
                const error = await response.text();
                console.error('Error:', error);
                alert('Error updating verification details. Please try again.');
            }
        } catch (error) {
            console.error('Error during request:', error);
            alert('Failed to submit details. Please try again later.');
        }
    });
});