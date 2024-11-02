function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function toggleResetButton() {
    const email = document.getElementById('forgetEmail').value
    const resetButton = document.getElementById('resetPasswordBtn')

    if (validateEmail(email)) {
        resetButton.disabled = false
        resetButton.style.opacity = 1
    } else {
        resetButton.disabled = true
        resetButton.style.opacity = 0.5
    }
}

function handleFormSubmit(event) {
    if (!validateEmail(document.getElementById('forgetEmail').value)) {
        event.preventDefault()
    } else {
        // Send reset instructions >>
        alert('Reset instructions have been sent to your email.')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const forgetEmail = document.getElementById('forgetEmail')
    const forgetPasswordForm = document.getElementById('forgetPasswordForm')

    if (forgetEmail && forgetPasswordForm) {
        forgetEmail.addEventListener('input', toggleResetButton)
        forgetPasswordForm.addEventListener('submit', handleFormSubmit)
    }
})
