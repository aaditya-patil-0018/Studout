'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const elements = {
        navbar: document.getElementById('navbar'),
        spacer: document.getElementById('spacer'),
        displayPictureInput: document.getElementById('displayPicture'),
        displayPicturePreview: document.getElementById('displayPicturePreview'),
        galleryImagesInput: document.getElementById('galleryImages'),
        galleryPreview: document.getElementById('galleryPreview'),
        galleryImagesError: document.getElementById('galleryImagesError'),
        form: document.getElementById('addListingForm')
    };

    // Constants
    const MAX_GALLERY_IMAGES = 10;

    // Utility functions
    const setSpacerHeight = () => {
        if (elements.navbar && elements.spacer) {
            elements.spacer.style.height = `${elements.navbar.offsetHeight}px`;
        }
    };

    const handleFilePreview = (file, previewElement) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.src = e.target.result;
            previewElement.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };

    const createGalleryImage = (src) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('gallery-image');
        return img;
    };

    // Event handlers
    const handleDisplayPictureChange = (e) => {
        const [file] = e.target.files;
        if (file) {
            handleFilePreview(file, elements.displayPicturePreview);
        }
    };

    const handleGalleryImagesChange = (e) => {
        elements.galleryPreview.innerHTML = '';
        elements.galleryImagesError.classList.add('hidden');
        
        const files = Array.from(e.target.files);
        
        if (files.length > MAX_GALLERY_IMAGES) {
            elements.galleryImagesError.classList.remove('hidden');
            elements.galleryImagesInput.value = '';
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.galleryPreview.appendChild(createGalleryImage(e.target.result));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(elements.form);

        try {
            const response = await fetch('/seller/add-listing', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                alert('Listing added successfully!');
                window.location.href = '/seller/listings';
            } else {
                alert(`Error adding listing: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the listing.');
        }
    };

    setSpacerHeight();
    window.addEventListener('resize', setSpacerHeight);
    elements.displayPictureInput.addEventListener('change', handleDisplayPictureChange);
    elements.galleryImagesInput.addEventListener('change', handleGalleryImagesChange);
    elements.form.addEventListener('submit', handleFormSubmit);
});
