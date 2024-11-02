const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function () {
    const screenHeight = window.innerHeight;

    if (window.scrollY >= 100) {
        navbar.classList.add('bg-[#ffffff86]', 'backdrop-blur-lg', 'backdrop-saturate-200');
        navbar.classList.remove('bg-[#ffffff]');
    } else {
        navbar.classList.remove('bg-[#ffffff86]', 'backdrop-blur-lg', 'backdrop-saturate-200');
        navbar.classList.add('bg-[#ffffff]');
    }
});

window.addEventListener('scroll', function () {
    localStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', function () {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo({
            top: parseInt(scrollPosition),
            behavior: 'smooth'
        });
    }
});

window.addEventListener('beforeunload', function () {
    localStorage.removeItem('scrollPosition');
});

const urlParams = new URLSearchParams(window.location.search)
const serviceParam = urlParams.get('service')
const currentPath = window.location.pathname;

const navLinks = document.querySelectorAll('.nav-link')

navLinks.forEach(link => {
    const linkService = link.getAttribute('data-page')
    
    if (window.location.pathname.includes('user-products-listing') && serviceParam === linkService) {
        link.classList.add('active-nav-link')
    } else {
        if (currentPath.includes(linkService)) {
            link.classList.add('active-nav-link');
        } else {
            link.classList.remove('active-nav-link');
        }
    }
})
