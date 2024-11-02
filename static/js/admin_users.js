document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[placeholder=" "]');
    
    const tableRows = document.querySelectorAll('tbody tr');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        tableRows.forEach(row => {
            const name = row.querySelector('td:first-child .flex.flex-col p:first-child').textContent.trim().toLowerCase();
            const email = row.querySelector('td:first-child .flex.flex-col p:last-child').textContent.trim().toLowerCase();
            const role = row.querySelector('td:nth-child(2) p').textContent.trim().toLowerCase();
            const status = row.querySelector('td:nth-child(3) span').textContent.trim().toLowerCase();
            
            const matches = name.includes(searchTerm) || 
                          email.includes(searchTerm) || 
                          role.includes(searchTerm) || 
                          status.includes(searchTerm);
            
            row.style.display = matches ? '' : 'none';
        });
    });

    function clearSearch() {
        searchInput.value = '';
        tableRows.forEach(row => {
            row.style.display = '';
        });
    }

    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        this.classList.add('searching');
        
        searchTimeout = setTimeout(() => {
            this.classList.remove('searching');
        }, 300);
    });
});