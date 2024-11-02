document.addEventListener('DOMContentLoaded', function () {
    const idFileUpload = document.getElementById('id-file-upload');
    const idFileName = document.getElementById('id-file-name');
    const form = document.getElementById('sellerProfileSetupForm2');
    let selectedIdFile = null;

    idFileUpload.addEventListener('change', function (event) {
        selectedIdFile = event.target.files[0];
        if (selectedIdFile) {
            idFileName.textContent = selectedIdFile.name;
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgData = e.target.result.split(',')[1];
                sessionStorage.setItem('seller_id_proof', imgData);
            };
            reader.readAsDataURL(selectedIdFile);
        } else {
            idFileName.textContent = 'Upload Image';
        }
    });

    window.onload = function () {
        if (sessionStorage.getItem('seller_government_id')) {
            document.getElementById('government-id').value = sessionStorage.getItem('seller_government_id');
        }

        if (sessionStorage.getItem('seller_id_proof_name')) {
            idFileName.textContent = sessionStorage.getItem('seller_id_proof_name');
        }
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const governmentId = formData.get('government-id');
        const termsAccepted = formData.get('terms-conditions') === 'on';
        const idProof = sessionStorage.getItem('seller_id_proof');

        sessionStorage.setItem('seller_government_id', governmentId);
        sessionStorage.setItem('seller_terms_accepted', termsAccepted);
        sessionStorage.setItem('seller_id_proof', idProof);
        if (selectedIdFile) {
            sessionStorage.setItem('seller_id_proof_name', selectedIdFile.name);
        }
        
        const maxAge = 60 * 60 * 24 * 30;
        document.cookie = `seller_government_id=${governmentId}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_terms_accepted=${termsAccepted}; path=/; max-age=${maxAge}`;
        document.cookie = `seller_id_proof=${idProof}; path=/; max-age=${maxAge}`;

        alert('Verification details updated');
        window.location.href = '/seller-dashboard';
    });
});