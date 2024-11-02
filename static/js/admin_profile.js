document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        editBtn: document.getElementById('editButton'),
        saveBtn: document.getElementById('saveButton'),
        inputs: document.querySelectorAll('input'),
        fileInput: document.getElementById('change-picture'),
        profilePic: document.getElementById('profile-picture'),
        deleteBtn: document.getElementById('delete-picture'),
        passwordToggles: document.querySelectorAll('.toggle-password')
    }

    const config = {
        defaultAvatarUrl: '../static/images/default_avatar.webp',
        defaultAvatarData: '',
        storageKey: 'adminProfile'
    }

    function initializeUI() {
        elements.inputs.forEach(input => input.disabled = true)
        elements.saveBtn.style.display = 'none'
    }

    function handlePasswordToggle(e) {
        e.preventDefault()
        const input = this.parentElement.querySelector('input')
        const icon = this.querySelector('i')
        
        const isPassword = input.type === 'password'
        input.type = isPassword ? 'text' : 'password'
        icon.classList.toggle('fa-eye-slash', !isPassword)
        icon.classList.toggle('fa-eye', isPassword)
    }

    function handleEditToggle() {
        const isEditing = elements.inputs[0].disabled
        elements.inputs.forEach(input => input.disabled = !isEditing)
        elements.saveBtn.style.display = isEditing ? 'block' : 'none'
    }

    async function loadDefaultAvatar() {
        try {
            const response = await fetch(config.defaultAvatarUrl)
            const blob = await response.blob()
            config.defaultAvatarData = await blobToBase64(blob)
        } catch (error) {
            console.error('Error loading default avatar:', error)
        }
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }

    // Load profile from storage
    function loadProfile() {
        const savedProfile = sessionStorage.getItem(config.storageKey)
        if (!savedProfile) return
        
        const profileData = JSON.parse(savedProfile)
        elements.profilePic.src = profileData.profilePicture || config.defaultAvatarData || config.defaultAvatarUrl
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (!file) return

        blobToBase64(file)
            .then(result => elements.profilePic.src = result)
            .catch(error => console.error('Error reading file:', error))
    }

    // Handle profile picture deletion
    function handlePictureDelete() {
        elements.profilePic.src = config.defaultAvatarUrl
        elements.fileInput.value = ''
        
        const currentProfile = JSON.parse(sessionStorage.getItem(config.storageKey) || '{}')
        currentProfile.profilePicture = config.defaultAvatarData
        sessionStorage.setItem(config.storageKey, JSON.stringify(currentProfile))
    }

    // Save profile
    async function handleProfileSave() {
        const formData = new FormData()
        
        elements.inputs.forEach(input => {
            if (input.type !== 'file') {
                formData.append(input.name, input.value)
            }
        })

        const adminProfile = Object.fromEntries(formData)

        if (elements.fileInput.files[0]) {
            try {
                const imageData = await blobToBase64(elements.fileInput.files[0])
                adminProfile.profilePicture = imageData
            } catch (error) {
                console.error('Error processing profile picture:', error)
            }
        }

        sessionStorage.setItem(config.storageKey, JSON.stringify(adminProfile))
        
        elements.inputs.forEach(input => input.disabled = true)
        elements.saveBtn.style.display = 'none'
        alert('Profile saved successfully!')
    }

    function initializeEventListeners() {
        elements.passwordToggles.forEach(btn => btn.addEventListener('click', handlePasswordToggle))
        elements.editBtn.addEventListener('click', handleEditToggle)
        elements.fileInput.addEventListener('change', handleFileChange)
        elements.deleteBtn.addEventListener('click', handlePictureDelete)
        elements.saveBtn.addEventListener('click', handleProfileSave)
        window.addEventListener('load', loadProfile)
    }

    async function init() {
        initializeUI()
        await loadDefaultAvatar()
        initializeEventListeners()
    }

    init()
})
