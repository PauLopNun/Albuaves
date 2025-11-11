// Variables globales
let allBirds = [];

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    loadBirds();
    setupSearch();
});

// Cargar aves desde la API
async function loadBirds() {
    const birdsGrid = document.getElementById('birdsGrid');

    try {
        const response = await fetch('api.php');

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        allBirds = await response.json();

        if (Array.isArray(allBirds) && allBirds.length > 0) {
            displayBirds(allBirds);
            updateResultCount(allBirds.length);
        } else {
            birdsGrid.innerHTML = '<div class="no-results"><h2>No se encontraron aves</h2></div>';
        }
    } catch (error) {
        console.error('Error al cargar las aves:', error);
        birdsGrid.innerHTML = `<div class="no-results"><h2>Error al cargar las aves</h2><p>${error.message}</p></div>`;
    }
}

// Mostrar las aves en el grid
function displayBirds(birds) {
    const birdsGrid = document.getElementById('birdsGrid');

    if (birds.length === 0) {
        birdsGrid.innerHTML = '<div class="no-results"><h2>🔍 No se encontraron resultados</h2><p>Intenta con otro término de búsqueda</p></div>';
        return;
    }

    birdsGrid.innerHTML = birds.map(bird => createBirdCard(bird)).join('');
}

// Crear tarjeta de ave
function createBirdCard(bird) {
    // Construir URL de la imagen con manejo de rutas
    let imageUrl = bird.imagen_url;
    // Limpiar dobles barras
    imageUrl = imageUrl.replace(/\/+/g, '/');
    // Si comienza con ./, convertirlo a una ruta relativa válida
    if (imageUrl.startsWith('./')) {
        imageUrl = imageUrl.substring(2);
    }

    // Añadir parámetro de versión para forzar recarga y evitar caché
    const cacheBreaker = '?v=' + new Date().getTime();
    imageUrl = imageUrl + cacheBreaker;

    return `
        <div class="bird-card">
            <img src="${escapeHtml(imageUrl)}"
                 alt="${escapeHtml(bird.nombre_comun)}"
                 class="bird-image"
                 loading="lazy"
                 onerror="this.parentElement.style.background='#f0f0f0'; this.style.display='none';">
            <div class="bird-card-content">
                <h3>${escapeHtml(bird.nombre_comun)}</h3>
                <p class="bird-scientific-name">${escapeHtml(bird.nombre_cientifico)}</p>
                <p class="bird-description">${escapeHtml(bird.descripcion)}</p>
                <span class="bird-id">ID: ${bird.id_ave}</span>
            </div>
        </div>
    `;
}

// Configurar búsqueda
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            displayBirds(allBirds);
            updateResultCount(allBirds.length);
        } else {
            const filteredBirds = allBirds.filter(bird => {
                const nombre = bird.nombre_comun.toLowerCase();
                const cientifico = bird.nombre_cientifico.toLowerCase();
                const descripcion = bird.descripcion.toLowerCase();

                return nombre.includes(searchTerm) ||
                       cientifico.includes(searchTerm) ||
                       descripcion.includes(searchTerm);
            });

            displayBirds(filteredBirds);
            updateResultCount(filteredBirds.length);
        }
    });
}

// Actualizar contador de resultados
function updateResultCount(count) {
    const resultCount = document.getElementById('resultCount');
    if (count === 0) {
        resultCount.textContent = 'Sin resultados';
    } else {
        resultCount.textContent = `${count} ave${count !== 1 ? 's' : ''}`;
    }
}

// Escapar HTML para prevenir XSS
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
