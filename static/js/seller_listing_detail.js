document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        navbar: document.getElementById('navbar'),
        spacer: document.getElementById('spacer'),
        addImageInput: document.getElementById('addImageInput'),
        imageGallery: document.getElementById('imageGallery'),
        recommendationsChart: document.getElementById('recommendationsChart'),
        listingForm: document.getElementById('listingForm'),
        editButton: document.getElementById('editButton'),
        listingStatusForm: document.getElementById('listingStatusForm'),
        listingStatusRadios: document.querySelectorAll('input[name="listingStatus"]'),
        displayImage: document.querySelector('.display-image'),
        changeDisplayPictureBtn: document.getElementById('changeDisplayPictureBtn'),
        deleteDisplayPictureBtn: document.getElementById('deleteDisplayPictureBtn'),
        displayPictureInput: document.getElementById('displayPictureInput')
    };

    const defaultImagePath = '/static/images/default_listing_image.png';

    const setSpacerHeight = () => {
        if (elements.navbar && elements.spacer) {
            elements.spacer.style.height = `${elements.navbar.offsetHeight}px`;
        }
    };

    const loadStoredData = () => {
        const storedData = JSON.parse(sessionStorage.getItem('listingData') || '{}');
        Object.entries(storedData).forEach(([key, value]) => {
            const input = document.getElementById(key);
            if (input) input.value = value;
        });
        return storedData;
    };

    const addGalleryImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newImage = document.createElement('div');
            newImage.className = 'gallery-item';
            newImage.innerHTML = `
                <img src="${e.target.result}" alt="New Image" class="gallery-image">
                <button class="delete-button">Delete</button>
            `;
            elements.imageGallery.insertBefore(newImage, elements.imageGallery.lastElementChild);
            addDeleteFunctionality(newImage.querySelector('.delete-button'));
        };
        reader.readAsDataURL(file);
    };

    const addDeleteFunctionality = (deleteButton) => {
        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this image?')) {
                deleteButton.closest('.gallery-item').remove();
            }
        });
    };

    const createRecommendationsChart = () => {
        if (!elements.recommendationsChart) return;

        new Chart(elements.recommendationsChart.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Recommended', 'Not Recommended'],
                datasets: [{
                    label: 'Recommendations',
                    data: [75, 25], // Replace with actual data
                    backgroundColor: ['#F0F2F5', '#F0F2F5'],
                    borderColor: ['#757575', '#757575'],
                    borderWidth: 1,
                    borderRadius: 10,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Recommendations' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Listing Recommendations' }
                }
            }
        });
    };

    const handleListingFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const listingData = Object.fromEntries(formData.entries());
        const statusRadio = document.querySelector('input[name="listingStatus"]:checked');
        if (statusRadio) listingData.status = statusRadio.value;

        sessionStorage.setItem('listingData', JSON.stringify(listingData));

        e.target.querySelectorAll('input, textarea').forEach(input => input.disabled = true);
        elements.editButton.classList.remove('hidden');
        document.getElementById('saveButton').classList.add('hidden');

        alert('Changes saved successfully!');
        console.log('Saved listing data:', listingData);
    };

    const handleEditButtonClick = () => {
        const form = document.getElementById('listingForm');
        form.querySelectorAll('input, textarea').forEach(input => input.disabled = false);
        elements.editButton.classList.add('hidden');
        document.getElementById('saveButton').classList.remove('hidden');
    };

    const updateListingStatus = (status) => {
        let listingData = JSON.parse(sessionStorage.getItem('listingData') || '{}');
        listingData.status = status;
        sessionStorage.setItem('listingData', JSON.stringify(listingData));

        elements.listingStatusRadios.forEach(radio => {
            const label = radio.closest('label');
            const isActive = radio.value === status;
            label.classList.toggle('border-[#1f1f1f]', isActive);
            label.classList.toggle('bg-[#1f1f1f]', isActive);
            label.classList.toggle('text-white', isActive);
            label.classList.toggle('border-gray-100', !isActive);
            label.classList.toggle('bg-white', !isActive);
            label.classList.toggle('text-gray-900', !isActive);
        });
    };

    const updateDisplayPicture = (base64Data) => {
        elements.displayImage.src = base64Data;
        let listingData = JSON.parse(sessionStorage.getItem('listingData') || '{}');
        listingData.displayPicture = base64Data;
        sessionStorage.setItem('listingData', JSON.stringify(listingData));
    };

    const handleDisplayPictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateDisplayPicture(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteDisplayPicture = () => {
        if (confirm('Are you sure you want to delete the display picture?')) {
            elements.displayImage.src = defaultImagePath;
            let listingData = JSON.parse(sessionStorage.getItem('listingData') || '{}');
            delete listingData.displayPicture;
            sessionStorage.setItem('listingData', JSON.stringify(listingData));
        }
    };

    window.addEventListener('resize', setSpacerHeight);
    elements.addImageInput.addEventListener('change', (event) => {
        if (event.target.files[0]) addGalleryImage(event.target.files[0]);
    });
    elements.listingForm?.addEventListener('submit', handleListingFormSubmit);
    elements.editButton?.addEventListener('click', handleEditButtonClick);
    elements.listingStatusRadios.forEach(radio => {
        radio.addEventListener('change', () => updateListingStatus(radio.value));
    });

    elements.changeDisplayPictureBtn.addEventListener('click', () => elements.displayPictureInput.click());
    elements.displayPictureInput.addEventListener('change', handleDisplayPictureChange);
    elements.deleteDisplayPictureBtn.addEventListener('click', handleDeleteDisplayPicture);

    setSpacerHeight();
    const storedData = loadStoredData();
    document.querySelectorAll('.delete-button').forEach(addDeleteFunctionality);
    createRecommendationsChart();
    updateListingStatus(storedData.status || 'active');

    if (storedData.displayPicture) {
        elements.displayImage.src = storedData.displayPicture;
    }
});
