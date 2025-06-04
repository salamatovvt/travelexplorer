document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    setupEventListeners();
    
    loadDestinations();
});

let map;
let markers = [];
let destinations = [];
let currentFilters = {
    types: ['cities', 'landmarks', 'natural', 'beaches'],
    continents: ['europe', 'asia', 'namerica', 'samerica', 'africa', 'oceania']
};

function initMap() {
    const mapDisplay = document.querySelector('.map-display');
    if (!mapDisplay) return;
    
    mapDisplay.innerHTML = '';
    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapDisplay.appendChild(mapDiv);
    
    try {
        map = L.map('map').setView([20, 0], 2); 

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        addMapControls();
    } catch (error) {
        console.error('Error initializing map:', error);
        showMapPlaceholder('Failed to load map. Please check your internet connection.');
    }
}

function showMapPlaceholder(message = 'Explore destinations worldwide') {
    const mapDisplay = document.querySelector('.map-display');
    if (!mapDisplay) return;
    
    mapDisplay.innerHTML = `
        <div class="map-placeholder">
            <i class="fas fa-map-marked-alt" style="font-size: 48px; color: #2c4a63;"></i>
            <h3>Interactive Map</h3>
            <p>${message}</p>
        </div>
    `;
}

function addMapControls() {
    const zoomInBtn = document.querySelector('.map-control-btn:nth-child(1)');
    const zoomOutBtn = document.querySelector('.map-control-btn:nth-child(2)');
    const currentLocationBtn = document.querySelector('.map-control-btn:nth-child(3)');
    const resetViewBtn = document.querySelector('.map-control-btn:nth-child(4)');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            map.zoomIn();
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            map.zoomOut();
        });
    }
    
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    map.setView([lat, lng], 10);
                    
                    L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'current-location-marker',
                            html: '<i class="fas fa-dot-circle" style="color: #4285f4; font-size: 24px;"></i>',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })
                    }).addTo(map)
                    .bindPopup('Your current location')
                    .openPopup();
                    
                }, function() {
                    alert('Could not get your location. Please check your browser settings.');
                });
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    }
    
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', function() {
            map.setView([20, 0], 2); 
        });
    }
}

function setupEventListeners() {
    setupFilterListeners();
    
    setupSearchListener();
    
    setupPopularDestinationListeners();
}

function setupFilterListeners() {
    const typeFilters = document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]');
    typeFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updateTypeFilters();
            applyFilters();
        });
    });
    
    const continentFilters = document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]');
    continentFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updateContinentFilters();
            applyFilters();
        });
    });
}

function updateTypeFilters() {
    currentFilters.types = [];
    const typeFilters = document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]');
    
    typeFilters.forEach(filter => {
        if (filter.checked) {
            currentFilters.types.push(filter.id);
        }
    });
}

function updateContinentFilters() {
    currentFilters.continents = [];
    const continentFilters = document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]');
    
    continentFilters.forEach(filter => {
        if (filter.checked) {
            currentFilters.continents.push(filter.id);
        }
    });
}

function setupSearchListener() {
    const searchBtn = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            searchDestinations(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDestinations(searchInput.value);
            }
        });
    }
}

function searchDestinations(query) {
    if (!query) {
        applyFilters();
        return;
    }
    
    query = query.toLowerCase();
    
    const filteredDestinations = destinations.filter(destination => {
        return destination.name.toLowerCase().includes(query) || 
               destination.country.toLowerCase().includes(query) ||
               destination.continent.toLowerCase().includes(query) ||
               destination.type.toLowerCase().includes(query);
    });
    
    updateMapMarkers(filteredDestinations);
    
    if (filteredDestinations.length > 0) {
        map.setView([filteredDestinations[0].lat, filteredDestinations[0].lng], 5);
    }
}

function setupPopularDestinationListeners() {
    const popularDestinations = document.querySelectorAll('.destination-markers .marker');
    
    popularDestinations.forEach(destination => {
        destination.addEventListener('click', function() {
            const destinationName = this.querySelector('span').textContent;
            searchDestinations(destinationName);
        });
    });
}

function loadDestinations() {
    destinations = [
        {
            name: 'Paris',
            country: 'France',
            continent: 'europe',
            type: 'cities',
            lat: 48.8566,
            lng: 2.3522,
            description: 'The City of Light, famous for the Eiffel Tower, Louvre, and cuisine.'
        },
        {
            name: 'London',
            country: 'United Kingdom',
            continent: 'europe',
            type: 'cities',
            lat: 51.5074,
            lng: -0.1278,
            description: 'Historic capital with iconic landmarks like Big Ben and Buckingham Palace.'
        },
        {
            name: 'Tokyo',
            country: 'Japan',
            continent: 'asia',
            type: 'cities',
            lat: 35.6762,
            lng: 139.6503,
            description: 'Ultra-modern metropolis with ancient temples and cutting-edge tech.'
        },
        {
            name: 'New York',
            country: 'United States',
            continent: 'namerica',
            type: 'cities',
            lat: 40.7128,
            lng: -74.0060,
            description: 'The Big Apple, home to Times Square, Central Park, and Statue of Liberty.'
        },
        {
            name: 'Barcelona',
            country: 'Spain',
            continent: 'europe',
            type: 'cities',
            lat: 41.3851,
            lng: 2.1734,
            description: 'Vibrant city known for Gaudí architecture and Mediterranean beaches.'
        },
        {
            name: 'Sydney',
            country: 'Australia',
            continent: 'oceania',
            type: 'cities',
            lat: -33.8688,
            lng: 151.2093,
            description: 'Harbour city famous for the Opera House and Harbour Bridge.'
        },
        {
            name: 'Machu Picchu',
            country: 'Peru',
            continent: 'samerica',
            type: 'landmarks',
            lat: -13.1631,
            lng: -72.5450,
            description: 'Ancient Inca citadel set high in the Andes Mountains.'
        },
        {
            name: 'Great Barrier Reef',
            country: 'Australia',
            continent: 'oceania',
            type: 'natural',
            lat: -18.2871,
            lng: 147.6992,
            description: 'The world\'s largest coral reef system.'
        },
        {
            name: 'Sahara Desert',
            country: 'Multiple',
            continent: 'africa',
            type: 'natural',
            lat: 23.4162,
            lng: 25.6628,
            description: 'The largest hot desert in the world.'
        },
        {
            name: 'Bora Bora',
            country: 'French Polynesia',
            continent: 'oceania',
            type: 'beaches',
            lat: -16.5004,
            lng: -151.7415,
            description: 'Luxury resort destination with crystal-clear waters.'
        },
        {
            name: 'Santorini',
            country: 'Greece',
            continent: 'europe',
            type: 'beaches',
            lat: 36.3932,
            lng: 25.4615,
            description: 'Stunning island with white-washed buildings and blue domes.'
        },
        {
            name: 'Grand Canyon',
            country: 'United States',
            continent: 'namerica',
            type: 'natural',
            lat: 36.1069,
            lng: -112.1129,
            description: 'Steep-sided canyon carved by the Colorado River.'
        },
        {
            name: 'Taj Mahal',
            country: 'India',
            continent: 'asia',
            type: 'landmarks',
            lat: 27.1751,
            lng: 78.0421,
            description: 'Iconic marble mausoleum and UNESCO World Heritage site.'
        },
        {
            name: 'Serengeti',
            country: 'Tanzania',
            continent: 'africa',
            type: 'natural',
            lat: -2.3333,
            lng: 34.8333,
            description: 'Famous for its annual migration of wildebeest and safari opportunities.'
        },
        {
            name: 'Great Wall of China',
            country: 'China',
            continent: 'asia',
            type: 'landmarks',
            lat: 40.4319,
            lng: 116.5704,
            description: 'Ancient defensive wall spanning thousands of miles across China.'
        },
        {
            name: 'Rio de Janeiro',
            country: 'Brazil',
            continent: 'samerica',
            type: 'cities',
            lat: -22.9068,
            lng: -43.1729,
            description: 'Vibrant city known for Carnival, Christ the Redeemer, and beautiful beaches.'
        }
    ];
    
    applyFilters();
}

function applyFilters() {
    const filteredDestinations = destinations.filter(destination => {
        return currentFilters.types.includes(destination.type) && 
               currentFilters.continents.includes(destination.continent);
    });
    
    updateMapMarkers(filteredDestinations);
}

function updateMapMarkers(filteredDestinations) {
    if (markers.length) {
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
        markers = [];
    }
    
    filteredDestinations.forEach(destination => {
        let iconClass = 'fas fa-map-marker-alt';
        let iconColor = '#f44336'; 
        
        switch(destination.type) {
            case 'cities':
                iconClass = 'fas fa-city';
                iconColor = '#2196F3'; 
                break;
            case 'landmarks':
                iconClass = 'fas fa-landmark';
                iconColor = '#9C27B0'; 
                break;
            case 'natural':
                iconClass = 'fas fa-mountain';
                iconColor = '#4CAF50'; 
                break;
            case 'beaches':
                iconClass = 'fas fa-umbrella-beach';
                iconColor = '#FF9800'; 
                break;
        }
        
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<i class="${iconClass}" style="color: ${iconColor}; font-size: 24px;"></i>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
        
        const marker = L.marker([destination.lat, destination.lng], {
            icon: customIcon,
            title: destination.name
        }).addTo(map);
        
        marker.bindPopup(`
            <div class="destination-popup">
                <h3>${destination.name}, ${destination.country}</h3>
                <p>${destination.description}</p>
                <button class="popup-btn" onclick="viewDestinationDetails('${destination.name}')">View Details</button>
            </div>
        `);
        
        markers.push(marker);
    });
}

function viewDestinationDetails(destinationName) {
    alert(`Viewing details for ${destinationName}. In a complete app, this would take you to a detailed page about this destination.`);
    
    }

function handleMapError() {
    showMapPlaceholder('Could not load map. Please try again later.');
}