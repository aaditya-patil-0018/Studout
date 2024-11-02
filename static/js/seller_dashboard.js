function loadSellerInfo() {
    const sellerFullName = sessionStorage.getItem('seller_full_name') || 'Jack Willington'
    const sellerProfession = sessionStorage.getItem('seller_business_name') || 'Property Manager'
    const sellerProfilePicture = sessionStorage.getItem('seller_profile_picture')

    document.getElementById('welcome-text').textContent = `Welcome, ${sellerFullName}!`
    document.getElementById('seller-profession').textContent = sellerProfession

    if (sellerProfilePicture) {
        document.getElementById('seller-profile-image').src = `data:image/jpeg;base64,${sellerProfilePicture}`
    }
}

function createViewsChart() {
    const viewsCtx = document.getElementById('viewsChart').getContext('2d')
    new Chart(viewsCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Views',
                data: [5, 8, 6, 9, 4, 7],
                borderColor: '#1f1f1f',
                backgroundColor: 'rgba(31, 31, 31, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(31, 31, 31, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(31, 31, 31, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })
}

function createRecommendationsChart() {
    const recommendationsCtx = document.getElementById('recommendationsChart').getContext('2d')
    new Chart(recommendationsCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Recommendations',
                data: [30, 25, 28, 22, 35, 27],
                backgroundColor: '#F0F2F5',
                borderColor: '#1f1f1f',
                borderWidth: 1,
                borderRadius: 10,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(31, 31, 31, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })
}

function setSpacerHeight() {
    const navbar = document.getElementById('navbar')
    const spacer = document.getElementById('spacer')
    if (navbar && spacer) {
        spacer.style.height = navbar.offsetHeight + 'px'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSellerInfo()
    createViewsChart()
    createRecommendationsChart()
    setSpacerHeight()
    window.addEventListener('resize', setSpacerHeight)
})
