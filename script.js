$(document).ready(function() {
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        let target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });

    function animateDestinations() {
        $('.destination-card').each(function(index) {
            $(this).css({
                opacity: 1,
                transform: 'translateY(0)'
            });
        });
    }

    animateDestinations();
    
    function animateAttractions() {
        $('.attraction-card').each(function(index) {
            $(this).delay(index * 150).animate({
                opacity: 1,
                transform: 'translateY(0)'
            }, 500);
        });
    }

    $(window).on('scroll', function() {
        let windowHeight = $(window).height();
        let scrollTop = $(window).scrollTop();
        
        let attractionsOffset = $('#attractions').offset().top;
        if (scrollTop + windowHeight > attractionsOffset + 100) {
            animateAttractions();
            $(window).off('scroll');
        }
    });

    let mobileBreakpoint = 768;
    
    function setupMobileNav() {
        if ($(window).width() <= mobileBreakpoint && !$('.mobile-nav-toggle').length) {
            $('nav').prepend('<div class="mobile-nav-toggle"><i class="fas fa-bars"></i></div>');
            $('.nav-links').addClass('mobile-hidden');
            
            $('.mobile-nav-toggle').on('click', function() {
                $('.nav-links').toggleClass('mobile-hidden mobile-visible');
                $(this).find('i').toggleClass('fa-bars fa-times');
            });
        } else if ($(window).width() > mobileBreakpoint) {
            $('.mobile-nav-toggle').remove();
            $('.nav-links').removeClass('mobile-hidden mobile-visible');
        }
    }
    
    setupMobileNav();
    
    $(window).resize(function() {
        setupMobileNav();
    });

    $('.destination-img').on('click', function() {
        $(this).toggleClass('expanded');
    });

    $('.destination-card, .attraction-card').append('<button class="favorite-btn"><i class="far fa-heart"></i></button>');
    
    $('.favorite-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).find('i').toggleClass('far fas');
        
        let itemName = $(this).closest('.destination-card, .attraction-card').find('h3').text();
        if ($(this).find('i').hasClass('fas')) {
            showNotification(`Added ${itemName} to favorites!`);
        } else {
            showNotification(`Removed ${itemName} from favorites!`);
        }
    });

    function showNotification(message) {
        if ($('.notification').length) {
            $('.notification').remove();
        }
        
        $('body').append(`<div class="notification">${message}</div>`);
        $('.notification').fadeIn(300).delay(2000).fadeOut(500, function() {
            $(this).remove();
        });
    }

    const cities = {
        'Paris': { temp: '18°C', condition: 'Partly Cloudy' },
        'Kyoto': { temp: '24°C', condition: 'Sunny' },
        'Barcelona': { temp: '22°C', condition: 'Clear' },
        'Arizona': { temp: '35°C', condition: 'Sunny' }
    };

    $('.destination-content h3, .attraction-content h3').each(function() {
        let city = $(this).text().split(',')[0];
        if (cities[city]) {
            $(this).closest('.destination-card, .attraction-card')
                .append(`<div class="weather-widget"><i class="fas fa-sun"></i> ${cities[city].temp} - ${cities[city].condition}</div>`);
        }
    });

    $('body').append('<button id="back-to-top"><i class="fas fa-arrow-up"></i></button>');
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').addClass('visible');
        } else {
            $('#back-to-top').removeClass('visible');
        }
    });
    
    $('#back-to-top').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    setupMobileNav();
    
    $('.hero').css({
        'opacity': '1',
        'visibility': 'visible'
    });
    
    $('.hero h1, .hero p, .hero .btn').css({
        'opacity': '1',
        'visibility': 'visible',
        'transform': 'none'
    });
    
    $('.search-container').remove();
    
    initHomepageMap();
});

function initHomepageMap() {
    const mapContainer = document.querySelector('.interactive-map');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = '';
    
    const mapDiv = document.createElement('div');
    mapDiv.id = 'homepage-map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '400px'; 
    mapContainer.appendChild(mapDiv);
    
    try {
        if (typeof L === 'undefined') {
            loadLeafletResources().then(() => {
                initLeafletMap();
            }).catch(error => {
                console.error('Failed to load Leaflet:', error);
                showMapPlaceholder(mapContainer);
            });
        } else {
            initLeafletMap();
        }
    } catch (error) {
        console.error('Error initializing homepage map:', error);
        showMapPlaceholder(mapContainer);
    }
}

function loadLeafletResources() {
    return new Promise((resolve, reject) => {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
        document.head.appendChild(leafletCSS);
        
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js';
        leafletScript.onload = resolve;
        leafletScript.onerror = reject;
        document.body.appendChild(leafletScript);
    });
}

function initLeafletMap() {
    const mapDiv = document.getElementById('homepage-map');
    if (!mapDiv) return;
    
    const homeMap = L.map('homepage-map').setView([20, 0], 2); // Center on the world
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(homeMap);
    
    addFeaturedDestinations(homeMap);
    
    addViewFullMapButton();
}

function showMapPlaceholder(container) {
    container.innerHTML = `
        <div class="map-placeholder" style="text-align: center; padding: 50px 20px;">
            <i class="fas fa-map-marked-alt" style="font-size: 48px; color: #2c4a63;"></i>
            <h3>Interactive Map</h3>
            <p>Explore destinations worldwide</p>
            <a href="map.html" class="btn" style="margin-top: 20px;">Go to Full Map</a>
        </div>
    `;
}

function addFeaturedDestinations(map) {
    const featuredDestinations = [
        {
            name: 'Paris, France',
            lat: 48.8566,
            lng: 2.3522,
            type: 'cities'
        },
        {
            name: 'Kyoto, Japan',
            lat: 35.0116,
            lng: 135.7681,
            type: 'cities'
        },
        {
            name: 'Barcelona, Spain',
            lat: 41.3851,
            lng: 2.1734,
            type: 'cities'
        },
        {
            name: 'Grand Canyon, USA',
            lat: 36.1069,
            lng: -112.1129,
            type: 'natural'
        },
        {
            name: 'Eiffel Tower',
            lat: 48.8584,
            lng: 2.2945,
            type: 'landmarks'
        },
        {
            name: 'Sagrada Familia',
            lat: 41.4036,
            lng: 2.1744,
            type: 'landmarks'
        },
        {
            name: 'Fushimi Inari Shrine',
            lat: 34.9671,
            lng: 135.7727,
            type: 'landmarks'
        }
    ];
    
    featuredDestinations.forEach(destination => {
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
            <div style="text-align: center;">
                <h3 style="margin: 0; padding: 5px 0;">${destination.name}</h3>
                <a href="map.html" style="display: inline-block; margin-top: 5px; padding: 5px 10px; background-color: #2c4a63; color: white; text-decoration: none; border-radius: 4px;">View on Full Map</a>
            </div>
        `);
    });
}

function addViewFullMapButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '15px';
    
    const fullMapButton = document.createElement('a');
    fullMapButton.href = 'map.html';
    fullMapButton.className = 'btn';
    fullMapButton.innerHTML = '<i class="fas fa-map-marked-alt"></i> Explore Full Interactive Map';
    
    buttonContainer.appendChild(fullMapButton);
    
    const mapContainer = document.querySelector('.interactive-map');
    mapContainer.parentNode.appendChild(buttonContainer);
}