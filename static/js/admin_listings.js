document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[placeholder=" "]')
    const tableRows = document.querySelectorAll('tbody tr')
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim()
        
        tableRows.forEach(row => {
            const listingName = row.querySelector('td:nth-child(2) p').textContent.trim().toLowerCase()
            const location = row.querySelector('td:nth-child(3) p').textContent.trim().toLowerCase()
            const recommendations = row.querySelector('td:nth-child(4) p').textContent.trim().toLowerCase()
            const price = row.querySelector('td:nth-child(5) p').textContent.trim().toLowerCase()
            
            const matches = listingName.includes(searchTerm) || 
                          location.includes(searchTerm) || 
                          recommendations.includes(searchTerm) || 
                          price.includes(searchTerm)
            
            row.style.display = matches ? '' : 'none'
        })
    })

    function clearSearch() {
        searchInput.value = ''
        tableRows.forEach(row => {
            row.style.display = ''
        })
    }

    let searchTimeout
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout)
        
        this.classList.add('searching')
        
        searchTimeout = setTimeout(() => {
            this.classList.remove('searching')
        }, 300)
    })
})

