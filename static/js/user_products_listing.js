const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

priceRange.addEventListener('input', function () {
    priceValue.textContent = this.value;
});

function setSpacerHeight() {
    const navbar = document.getElementById('navbar');
    const spacer = document.getElementById('spacer');
    if (navbar && spacer) {
        if (window.innerWidth < 768) { 
            spacer.style.height = navbar.offsetHeight + 'px';
        } else {
            spacer.style.height = '0px';
        }
    }
}
setSpacerHeight();
window.addEventListener('resize', setSpacerHeight);