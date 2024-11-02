function setSpacerHeight() {
    const navbar = document.getElementById('navbar')
    const spacer = document.getElementById('spacer')
    if (navbar && spacer) {
        spacer.style.height = navbar.offsetHeight + 'px'
    }
}

setSpacerHeight()

document.addEventListener('DOMContentLoaded', function() {
    const addAdminForm = document.getElementById('addAdminForm');
    const submitButton = document.getElementById('submitAdminForm');

    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('adminName').value;
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const confirmPassword = document.getElementById('adminConfirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        console.log('Creating new admin:', { name, email });
        
        addAdminForm.reset();
        document.getElementById('add_admin_modal').checked = false;
    });
});
