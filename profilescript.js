document.addEventListener('DOMContentLoaded', function() {
    console.log("Profile page loaded!");
    
    if (typeof initializeTravelExplorer === 'function') {
        initializeTravelExplorer();
    }
    
    initializeProfilePage();
});
function initializeProfilePage() {
    setupProfileEventListeners();
    loadUserStats();
    loadRecentActivity();
    setupTripInteractions();
}

const userProfile = {
    username: "Alex Johnson",
    location: "New York, USA",
    memberSince: "2020",
    profileImage: "",
    stats: {
        countries: 27,
        cities: 84,
        trips: 42,
        reviews: 156
    },
    achievements: [
        {
            title: "Mountain Explorer",
            icon: "fa-mountain",
            description: "Visited 5+ mountain destinations"
        },
        {
            title: "Beach Lover",
            icon: "fa-umbrella-beach",
            description: "Reviewed 10+ beach destinations"
        },
        {
            title: "Global Citizen",
            icon: "fa-passport",
            description: "Visited all 7 continents"
        }
    ],
    interests: ["Adventure", "Cultural Exploration", "Photography", "Local Cuisine"]
};

function loadUserStats() {
    const profileName = document.querySelector('.profile-header h2');
    if (profileName) {
        profileName.textContent = userProfile.username;
    }
    
    updateStatElement('countries', userProfile.stats.countries);
    updateStatElement('cities', userProfile.stats.cities);
    updateStatElement('trips', userProfile.stats.trips);
    updateStatElement('reviews', userProfile.stats.reviews);
    
    }

function updateStatElement(statType, value) {
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach(card => {
        const smallText = card.querySelector('small');
        if (smallText && smallText.textContent.toLowerCase() === statType.toLowerCase()) {
            const statValue = card.querySelector('h3');
            if (statValue) {
                statValue.textContent = value;
                
                card.classList.add('highlight');
                setTimeout(() => {
                    card.classList.remove('highlight');
                }, 1000);
            }
        }
    });
}



function setupProfileEventListeners() {
    const editProfileBtn = document.querySelector('.profile-edit-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfileEditModal();
        });
    }
    
    const followBtn = document.querySelector('.btn-light');
    if (followBtn && followBtn.innerHTML.includes('Follow')) {
        followBtn.addEventListener('click', function() {
            toggleFollowStatus(this);
        });
    }
    
    const messageBtn = document.querySelector('.btn-outline-light');
    if (messageBtn && messageBtn.innerHTML.includes('Message')) {
        messageBtn.addEventListener('click', function() {
            showMessageModal();
        });
    }
    
    
    const heartButtons = document.querySelectorAll('.btn-outline-danger');
    heartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleSavedPlace(this);
        });
    });
}

function toggleFollowStatus(button) {
    if (button.innerHTML.includes('Follow')) {
        button.innerHTML = '<i class="fas fa-user-check me-1"></i> Following';
        button.classList.remove('btn-light');
        button.classList.add('btn-success');
        
        if (typeof getRandomTravelTip === 'function') {
            showNotification(`You're now following ${userProfile.username}! ${getRandomTravelTip()}`);
        } else {
            showNotification(`You're now following ${userProfile.username}!`);
        }
    } else {
        button.innerHTML = '<i class="fas fa-user-plus me-1"></i> Follow';
        button.classList.remove('btn-success');
        button.classList.add('btn-light');
        showNotification(`You've unfollowed ${userProfile.username}.`);
    }
}

function showProfileEditModal() {
    if (!document.getElementById('profileEditModal')) {
        const modalHTML = `
            <div class="modal fade" id="profileEditModal" tabindex="-1" aria-labelledby="profileEditModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="profileEditModalLabel">Edit Your Profile</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="profileEditForm">
                                <div class="mb-3">
                                    <label for="profileUsername" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="profileUsername" value="${userProfile.username}">
                                </div>
                                <div class="mb-3">
                                    <label for="profileLocation" class="form-label">Location</label>
                                    <input type="text" class="form-control" id="profileLocation" value="${userProfile.location}">
                                </div>
                                <div class="mb-3">
                                    <label for="profileBio" class="form-label">Bio</label>
                                    <textarea class="form-control" id="profileBio" rows="3">Travel enthusiast passionate about exploring new cultures and destinations.</textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Travel Interests</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="Adventure" id="interestAdventure" checked>
                                        <label class="form-check-label" for="interestAdventure">Adventure</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="Culture" id="interestCulture" checked>
                                        <label class="form-check-label" for="interestCulture">Cultural Exploration</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="Food" id="interestFood" checked>
                                        <label class="form-check-label" for="interestFood">Local Cuisine</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="Photography" id="interestPhotography" checked>
                                        <label class="form-check-label" for="interestPhotography">Photography</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveProfileChanges">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.getElementById('saveProfileChanges').addEventListener('click', function() {
            saveProfileChanges();
        });
    }
    
    const profileModal = new bootstrap.Modal(document.getElementById('profileEditModal'));
    profileModal.show();
}

function saveProfileChanges() {
    const newUsername = document.getElementById('profileUsername').value;
    const newLocation = document.getElementById('profileLocation').value;
    const newBio = document.getElementById('profileBio').value;
    
    const profileName = document.querySelector('.profile-header h2');
    if (profileName) {
        profileName.textContent = newUsername;
    }
    
    const profileLocation = document.querySelector('.profile-header p:first-of-type');
    if (profileLocation) {
        profileLocation.innerHTML = `<i class="fas fa-map-marker-alt me-2"></i>${newLocation}`;
    }
    
    userProfile.username = newUsername;
    userProfile.location = newLocation;
    
    const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileEditModal'));
    profileModal.hide();
    
    showNotification('Profile updated successfully!');
    
    
}

function showMessageModal() {
    if (!document.getElementById('messageModal')) {
        const modalHTML = `
            <div class="modal fade" id="messageModal" tabindex="-1" aria-labelledby="messageModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="messageModalLabel">Message ${userProfile.username}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="messageForm">
                                <div class="mb-3">
                                    <label for="messageSubject" class="form-label">Subject</label>
                                    <input type="text" class="form-control" id="messageSubject" placeholder="Enter subject">
                                </div>
                                <div class="mb-3">
                                    <label for="messageContent" class="form-label">Message</label>
                                    <textarea class="form-control" id="messageContent" rows="5" placeholder="Write your message here..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="sendMessage">Send Message</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.getElementById('sendMessage').addEventListener('click', function() {
            sendMessage();
        });
    }
    
    const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    messageModal.show();
}

function sendMessage() {
    const subject = document.getElementById('messageSubject').value;
    const content = document.getElementById('messageContent').value;
    
    if (!subject || !content) {
        alert('Please fill in both subject and message fields.');
        return;
    }
    
    const messageModal = bootstrap.Modal.getInstance(document.getElementById('messageModal'));
    messageModal.hide();
    
    showNotification(`Message sent to ${userProfile.username}!`);
    
    document.getElementById('messageSubject').value = '';
    document.getElementById('messageContent').value = '';
}

function toggleSavedPlace(button) {
    if (button.classList.contains('btn-outline-danger')) {
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-danger');
        showNotification('Destination removed from saved places.');
    } else {
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline-danger');
        showNotification('Destination added back to saved places.');
    }
}

function setupTripInteractions() {
    const tripCards = document.querySelectorAll('.trip-card');
    tripCards.forEach(card => {
        card.addEventListener('click', function() {
            const tripTitle = this.querySelector('.card-title').textContent;
            showTripDetails(tripTitle);
        });
    });
}


function showNotification(message) {
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#2c4a63',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: '1050',
        maxWidth: '300px',
        opacity: '0',
        transition: 'opacity 0.3s'
    });
    
    document.body.appendChild(notification);
    
    notification.offsetHeight;
    
    notification.style.opacity = '1';
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function addCustomStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .highlight {
            animation: highlight-pulse 1s ease;
        }
        
        @keyframes highlight-pulse {
            0% { background-color: #f8f9fa; }
            50% { background-color: #d4edda; }
            100% { background-color: #f8f9fa; }
        }
        
        .custom-notification {
            opacity: 0;
            transition: opacity 0.3s;
        }
    `;
    
    document.head.appendChild(styleElement);
}

addCustomStyles();
