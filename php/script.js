// Global variables
let allBirds = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadBirds();
    setupSearch();
});

// Load birds from the API
async function loadBirds() {
    const birdsGrid = document.getElementById('birdsGrid');

    try {
        const response = await fetch('api.php');

        if (!response.ok) {
            throw new Error('Error in API response');
        }

        allBirds = await response.json();

        if (Array.isArray(allBirds) && allBirds.length > 0) {
            displayBirds(allBirds);
            updateResultCount(allBirds.length);
        } else {
            birdsGrid.innerHTML = '<div class="no-results"><h2>No birds found</h2></div>';
        }
    } catch (error) {
        console.error('Error loading birds:', error);
        birdsGrid.innerHTML = `<div class="no-results"><h2>Error loading birds</h2><p>${error.message}</p></div>`;
    }
}

// Display birds in the grid
function displayBirds(birds) {
    const birdsGrid = document.getElementById('birdsGrid');

    if (birds.length === 0) {
        birdsGrid.innerHTML = '<div class="no-results"><h2>🔍 No results found</h2><p>Try another search term</p></div>';
        return;
    }

    birdsGrid.innerHTML = birds.map(bird => createBirdCard(bird)).join('');
}

// Create bird card
function createBirdCard(bird) {
    // Build image URL with path handling
    let imageUrl = bird.image_url;
    // Clean double slashes
    imageUrl = imageUrl.replace(/\/+/g, '/');
    // If it starts with ./, convert it to a valid relative path
    if (imageUrl.startsWith('./')) {
        imageUrl = imageUrl.substring(2);
    }

    // Add version parameter to force reload and avoid cache
    const cacheBreaker = '?v=' + new Date().getTime();
    imageUrl = imageUrl + cacheBreaker;

    return `
        <div class="bird-card">
            <img src="${escapeHtml(imageUrl)}"
                 alt="${escapeHtml(bird.common_name)}"
                 class="bird-image"
                 loading="lazy"
                 onerror="this.parentElement.style.background='#f0f0f0'; this.style.display='none';">
            <div class="bird-card-content">
                <h3>${escapeHtml(bird.common_name)}</h3>
                <p class="bird-scientific-name">${escapeHtml(bird.scientific_name)}</p>
                <p class="bird-description">${escapeHtml(bird.description)}</p>
                <span class="bird-id">ID: ${bird.bird_id}</span>
            </div>
        </div>
    `;
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            displayBirds(allBirds);
            updateResultCount(allBirds.length);
        } else {
            const filteredBirds = allBirds.filter(bird => {
                const commonName = bird.common_name.toLowerCase();
                const scientificName = bird.scientific_name.toLowerCase();
                const description = bird.description.toLowerCase();

                return commonName.includes(searchTerm) ||
                       scientificName.includes(searchTerm) ||
                       description.includes(searchTerm);
            });

            displayBirds(filteredBirds);
            updateResultCount(filteredBirds.length);
        }
    });
}

// Update result counter
function updateResultCount(count) {
    const resultCount = document.getElementById('resultCount');
    if (count === 0) {
        resultCount.textContent = 'No results';
    } else {
        resultCount.textContent = `${count} bird${count !== 1 ? 's' : ''}`;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
