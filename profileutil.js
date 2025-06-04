document.addEventListener('DOMContentLoaded', function() {
    console.log("Profile integration script loaded!");
    
    checkUserLoginStatus();
});
function setupLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            TravelUtils.storage.logout();
            if (typeof TravelUtils.ui.showNotification === 'function') {
                TravelUtils.ui.showNotification('You have been logged out successfully', 'info');
            }
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }
}
function checkUserLoginStatus() {
    const currentUser = TravelUtils.storage.getCurrentUser();
    const currentPath = window.location.pathname;
    
    if ((currentPath.includes('profile.html')) && (!currentUser || !currentUser.isLoggedIn)) {
        window.location.href = 'login.html?redirect=profile';
        return;
    }
    
    if (currentPath.includes('login.html') && currentUser && currentUser.isLoggedIn) {
        window.location.href = 'profile.html';
        return;
    }
    
    if (currentUser && currentUser.isLoggedIn && currentPath.includes('profile.html')) {
        loadUserProfileData(currentUser);
    }
}

function loadUserProfileData(user) {
    const users = TravelUtils.storage.getUsers();
    const fullUserData = users.find(u => u.email === user.email);
    
    if (!fullUserData) {
        console.error("Could not find user data for:", user.email);
        return;
    }
    
    if (typeof userProfile !== 'undefined') {
        userProfile.username = `${fullUserData.firstName} ${fullUserData.lastName}`;
        userProfile.email = fullUserData.email;
        
        userProfile.location = fullUserData.location || "Update your location";
        userProfile.memberSince = fullUserData.memberSince || new Date().getFullYear().toString();
        
        if (!fullUserData.stats) {
            fullUserData.stats = {
                countries: 0,
                cities: 0,
                trips: 0,
                reviews: 0
            };
            
            updateUserInStorage(fullUserData);
        }
        
        if (fullUserData.stats) {
            userProfile.stats = { ...fullUserData.stats };
        }
        
        updateProfileUI();
    }
    
    setupLogoutButton();
}

function updateProfileUI() {
    const profileName = document.querySelector('.profile-header h2');
    if (profileName) {
        profileName.textContent = userProfile.username;
    }
    
    const profileLocation = document.querySelector('.profile-header p:first-of-type');
    if (profileLocation) {
        profileLocation.innerHTML = `<i class="fas fa-map-marker-alt me-2"></i>${userProfile.location}`;
    }
    
    const memberSinceElement = document.querySelector('.member-since');
    if (memberSinceElement) {
        memberSinceElement.textContent = `Member since ${userProfile.memberSince}`;
    }
    
    if (typeof loadUserStats === 'function') {
        loadUserStats();
    }
}



function updateUserInStorage(userData) {
    const users = TravelUtils.storage.getUsers();
    const userIndex = users.findIndex(u => u.email === userData.email);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...userData };
        localStorage.setItem('travelExplorer_users', JSON.stringify(users));
    }
}


function saveProfileChangestoStorage() {
    const currentUser = TravelUtils.storage.getCurrentUser();
    
    if (!currentUser || !currentUser.isLoggedIn) {
        console.error("No user is logged in");
        return;
    }
    
    const users = TravelUtils.storage.getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) {
        console.error("User not found in storage");
        return;
    }
    
    const newUsername = document.getElementById('profileUsername').value;
    const newLocation = document.getElementById('profileLocation').value;
    const newBio = document.getElementById('profileBio').value;
    
    const nameParts = newUsername.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    users[userIndex].firstName = firstName;
    users[userIndex].lastName = lastName;
    users[userIndex].location = newLocation;
    users[userIndex].bio = newBio;
    
    const interests = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        interests.push(checkbox.value);
    });
    users[userIndex].interests = interests;
    
    localStorage.setItem('travelExplorer_users', JSON.stringify(users));
    
    const sessionUser = {
        email: currentUser.email,
        firstName: firstName,
        lastName: lastName,
        isLoggedIn: true
    };
    localStorage.setItem('travelExplorer_currentUser', JSON.stringify(sessionUser));
    
    if (typeof userProfile !== 'undefined') {
        userProfile.username = newUsername;
        userProfile.location = newLocation;
        userProfile.interests = interests;
    }
    
    return true;
}

if (typeof saveProfileChanges === 'function') {
    const originalSaveProfileChanges = saveProfileChanges;
    
    saveProfileChanges = function() {
        originalSaveProfileChanges();
        
        saveProfileChangestoStorage();
    };
}

function registerNewUser(userData) {
    const newUser = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        memberSince: new Date().getFullYear().toString(),
        location: userData.location || "",
        bio: "",
        interests: ["Travel", "Adventure"],
        stats: {
            countries: 0,
            cities: 0,
            trips: 0,
            reviews: 0
        },
        savedPlaces: [],
        achievements: []
    };
    
    TravelUtils.storage.addUser(newUser);
    
    TravelUtils.storage.saveUserSession({
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
    });
    
    return true;
}

window.ProfileIntegration = {
    registerNewUser,
    saveProfileChangestoStorage,
    loadUserProfileData,
    updateUserInStorage
};