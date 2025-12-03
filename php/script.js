// Global variables
let allBirds = [];
let allSightings = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadBirds();
    setupSearch();
    setupTabs();
    setupSightingForm();
    loadSightings();
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

// Setup tabs navigation
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');

            // Load sightings when sightings tab is opened
            if (targetTab === 'sightings') {
                loadSightings();
            }
        });
    });
}

// Load sightings from API
async function loadSightings() {
    const sightingsGrid = document.getElementById('sightingsGrid');

    try {
        const response = await fetch('sightings-api.php');

        if (!response.ok) {
            throw new Error('Error loading sightings');
        }

        allSightings = await response.json();

        if (Array.isArray(allSightings) && allSightings.length > 0) {
            displaySightings(allSightings);
        } else {
            sightingsGrid.innerHTML = '<div class="no-results"><h2>No sightings recorded yet</h2><p>Be the first to register a sighting!</p></div>';
        }
    } catch (error) {
        console.error('Error loading sightings:', error);
        sightingsGrid.innerHTML = `<div class="no-results"><h2>Error loading sightings</h2><p>${error.message}</p></div>`;
    }
}

// Display sightings
function displaySightings(sightings) {
    const sightingsGrid = document.getElementById('sightingsGrid');

    if (sightings.length === 0) {
        sightingsGrid.innerHTML = '<div class="no-results"><h2>No sightings found</h2></div>';
        return;
    }

    sightingsGrid.innerHTML = sightings.map(sighting => createSightingCard(sighting)).join('');
}

// Create sighting card
function createSightingCard(sighting) {
    const dateObj = new Date(sighting.date + 'T' + sighting.time);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    let imageHtml = '';
    if (sighting.image_url) {
        const imageUrl = sighting.image_url + '?v=' + new Date().getTime();
        imageHtml = `
            <div class="sighting-image-container">
                <img src="${escapeHtml(imageUrl)}"
                     alt="Sighting of ${escapeHtml(sighting.common_name)}"
                     class="sighting-image"
                     loading="lazy"
                     onerror="this.style.display='none';">
            </div>
        `;
    }

    return `
        <div class="sighting-card">
            ${imageHtml}
            <div class="sighting-card-content">
                <h3>${escapeHtml(sighting.common_name)}</h3>
                <p class="sighting-scientific-name">${escapeHtml(sighting.scientific_name)}</p>
                <div class="sighting-details">
                    <p><strong>📍 Location:</strong> ${escapeHtml(sighting.location)}</p>
                    <p><strong>📅 Date:</strong> ${formattedDate}</p>
                    <p><strong>🕐 Time:</strong> ${formattedTime}</p>
                    ${sighting.observations ? `<p><strong>📝 Observations:</strong> ${escapeHtml(sighting.observations)}</p>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Setup sighting form
function setupSightingForm() {
    const form = document.getElementById('sightingForm');
    const imageInput = document.getElementById('sightingImage');
    const imagePreview = document.getElementById('imagePreview');
    const birdSelect = document.getElementById('birdSelect');

    // Populate bird select when birds are loaded
    if (allBirds.length > 0) {
        populateBirdSelect();
    } else {
        // Wait for birds to load
        const checkBirds = setInterval(() => {
            if (allBirds.length > 0) {
                populateBirdSelect();
                clearInterval(checkBirds);
            }
        }, 100);
    }

    // Image preview
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-preview" onclick="clearImagePreview()">✕</button>
                `;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const formMessage = document.getElementById('formMessage');
        const submitButton = form.querySelector('button[type="submit"]');

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        try {
            const response = await fetch('sightings-api.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                formMessage.className = 'form-message success';
                formMessage.textContent = '✓ Sighting registered successfully!';
                form.reset();
                imagePreview.innerHTML = '';
                imagePreview.style.display = 'none';

                // Reload sightings
                loadSightings();

                // Clear message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);
            } else {
                throw new Error(data.error || 'Error registering sighting');
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = '✗ ' + error.message;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Register Sighting';
        }
    });
}

// Populate bird select dropdown
function populateBirdSelect() {
    const birdSelect = document.getElementById('birdSelect');

    allBirds.forEach(bird => {
        const option = document.createElement('option');
        option.value = bird.bird_id;
        option.textContent = `${bird.common_name} (${bird.scientific_name})`;
        birdSelect.appendChild(option);
    });
}

// Clear image preview
function clearImagePreview() {
    const imageInput = document.getElementById('sightingImage');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.value = '';
    imagePreview.innerHTML = '';
    imagePreview.style.display = 'none';
}
