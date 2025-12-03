// Global variables
let allBirds = [];
let allSightings = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Albuaves App v3.1 loaded - Checking features...');
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
        <div class="bird-card" data-bird-id="${bird.bird_id}">
            <button class="btn-delete-bird" onclick="deleteBird(${bird.bird_id})" title="Delete this bird">✕</button>
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

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server error: Expected JSON but received HTML. Check server logs.');
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
        <div class="sighting-card" data-sighting-id="${sighting.sighting_id}">
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
                <button class="btn-delete" onclick="deleteSighting(${sighting.sighting_id})">
                    🗑️ Delete
                </button>
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
    const newSpeciesToggle = document.getElementById('newSpeciesToggle');
    const existingSpeciesFields = document.getElementById('existingSpeciesFields');
    const newSpeciesFields = document.getElementById('newSpeciesFields');
    const newBirdImageInput = document.getElementById('newBirdImage');
    const birdImagePreview = document.getElementById('birdImagePreview');

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

    // Toggle between existing and new species
    newSpeciesToggle.addEventListener('change', function() {
        if (this.checked) {
            existingSpeciesFields.style.display = 'none';
            newSpeciesFields.style.display = 'block';
            birdSelect.removeAttribute('required');
            document.getElementById('newCommonName').setAttribute('required', 'required');
            document.getElementById('newScientificName').setAttribute('required', 'required');
        } else {
            existingSpeciesFields.style.display = 'block';
            newSpeciesFields.style.display = 'none';
            birdSelect.setAttribute('required', 'required');
            document.getElementById('newCommonName').removeAttribute('required');
            document.getElementById('newScientificName').removeAttribute('required');
        }
    });

    // Image preview for sighting
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

    // Image preview for new bird species
    newBirdImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                birdImagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-preview" onclick="clearBirdImagePreview()">✕</button>
                `;
                birdImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formMessage = document.getElementById('formMessage');
        const submitButton = form.querySelector('button[type="submit"]');

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        try {
            let birdId;

            // Check if we need to create a new species first
            if (newSpeciesToggle.checked) {
                // Create new bird species
                formMessage.className = 'form-message info';
                formMessage.textContent = 'Creating new species...';

                const birdFormData = new FormData();
                birdFormData.append('common_name', document.getElementById('newCommonName').value);
                birdFormData.append('scientific_name', document.getElementById('newScientificName').value);
                birdFormData.append('description', document.getElementById('newDescription').value);

                const birdImageFile = document.getElementById('newBirdImage').files[0];
                if (birdImageFile) {
                    birdFormData.append('image', birdImageFile);
                }

                const birdResponse = await fetch('api.php', {
                    method: 'POST',
                    body: birdFormData
                });

                // Check if response is JSON
                const birdContentType = birdResponse.headers.get('content-type');
                if (!birdContentType || !birdContentType.includes('application/json')) {
                    const text = await birdResponse.text();
                    console.error('Non-JSON response:', text);
                    throw new Error('Server error: Expected JSON but received HTML. Check server logs.');
                }

                const birdData = await birdResponse.json();

                if (!birdResponse.ok) {
                    throw new Error(birdData.error || 'Error creating new species');
                }

                birdId = birdData.bird_id;

                // Reload birds list
                await loadBirds();
            } else {
                // Use selected bird
                birdId = document.getElementById('birdSelect').value;
                if (!birdId) {
                    throw new Error('Please select a bird species');
                }
            }

            // Now create the sighting
            formMessage.textContent = 'Registering sighting...';

            const sightingFormData = new FormData();
            sightingFormData.append('bird_id', birdId);
            sightingFormData.append('date', document.getElementById('sightingDate').value);
            sightingFormData.append('time', document.getElementById('sightingTime').value);
            sightingFormData.append('location', document.getElementById('location').value);
            sightingFormData.append('observations', document.getElementById('observations').value);

            const sightingImageFile = document.getElementById('sightingImage').files[0];
            if (sightingImageFile) {
                sightingFormData.append('image', sightingImageFile);
            }

            const response = await fetch('sightings-api.php', {
                method: 'POST',
                body: sightingFormData
            });

            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server error: Expected JSON but received HTML. Check server logs.');
            }

            const data = await response.json();

            if (response.ok) {
                formMessage.className = 'form-message success';
                formMessage.textContent = '✓ Sighting registered successfully!';
                form.reset();
                imagePreview.innerHTML = '';
                imagePreview.style.display = 'none';
                birdImagePreview.innerHTML = '';
                birdImagePreview.style.display = 'none';

                // Reset toggle
                newSpeciesToggle.checked = false;
                existingSpeciesFields.style.display = 'block';
                newSpeciesFields.style.display = 'none';
                birdSelect.setAttribute('required', 'required');

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

// Clear bird image preview
function clearBirdImagePreview() {
    const birdImageInput = document.getElementById('newBirdImage');
    const birdImagePreview = document.getElementById('birdImagePreview');

    birdImageInput.value = '';
    birdImagePreview.innerHTML = '';
    birdImagePreview.style.display = 'none';
}

// Delete sighting
async function deleteSighting(sightingId) {
    if (!confirm('Are you sure you want to delete this sighting? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`sightings-api.php?id=${sightingId}`, {
            method: 'DELETE'
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server error: Expected JSON but received HTML. Check server logs.');
        }

        const data = await response.json();

        if (response.ok) {
            // Remove the card from the DOM with animation
            const card = document.querySelector(`[data-sighting-id="${sightingId}"]`);
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.remove();

                    // Check if there are no more sightings
                    const sightingsGrid = document.getElementById('sightingsGrid');
                    if (sightingsGrid.children.length === 0) {
                        sightingsGrid.innerHTML = '<div class="no-results"><h2>No sightings recorded yet</h2><p>Be the first to register a sighting!</p></div>';
                    }
                }, 300);
            }

            // Update the allSightings array
            allSightings = allSightings.filter(s => s.sighting_id !== sightingId);

            // Show success message temporarily
            showSuccessMessage('✓ Sighting deleted successfully!');
        } else {
            throw new Error(data.error || 'Error deleting sighting');
        }
    } catch (error) {
        alert('Error deleting sighting: ' + error.message);
        console.error('Delete error:', error);
    }
}

// Delete bird
async function deleteBird(birdId) {
    if (!confirm('⚠️ Are you sure you want to delete this bird?\n\nThis will also delete ALL associated sightings!\n\nThis action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`api.php?id=${birdId}`, {
            method: 'DELETE'
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server error: Expected JSON but received HTML. Check server logs.');
        }

        const data = await response.json();

        if (response.ok) {
            // Remove the card from the DOM with animation
            const card = document.querySelector(`[data-bird-id="${birdId}"]`);
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.remove();

                    // Check if there are no more birds
                    const birdsGrid = document.getElementById('birdsGrid');
                    if (birdsGrid.children.length === 0) {
                        birdsGrid.innerHTML = '<div class="no-results"><h2>No birds found</h2></div>';
                    }
                }, 300);
            }

            // Update the allBirds array
            allBirds = allBirds.filter(b => b.bird_id !== birdId);

            // Update result count
            updateResultCount(allBirds.length);

            // Show success message
            showSuccessMessage('✓ Bird and all associated sightings deleted successfully!');
        } else {
            throw new Error(data.error || 'Error deleting bird');
        }
    } catch (error) {
        alert('Error deleting bird: ' + error.message);
        console.error('Delete error:', error);
    }
}

// Show success message helper
function showSuccessMessage(message) {
    const tempMessage = document.createElement('div');
    tempMessage.className = 'form-message success';
    tempMessage.textContent = message;
    tempMessage.style.position = 'fixed';
    tempMessage.style.top = '20px';
    tempMessage.style.right = '20px';
    tempMessage.style.zIndex = '9999';
    document.body.appendChild(tempMessage);

    setTimeout(() => {
        tempMessage.remove();
    }, 3000);
}
