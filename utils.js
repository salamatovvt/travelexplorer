const TravelUtils = {
    playAudio: function(audioPath) {
        const audio = new Audio(audioPath);
        audio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    },
    validation: {
        validateField: function(field, condition, errorMessage, isBootstrap = false) {
            const formGroup = field.closest('.form-group') || field.closest('.mb-3');
            const existingFeedback = isBootstrap ? 
                formGroup.querySelector('.invalid-feedback') : 
                formGroup.querySelector('.error-feedback');
            
            if (!condition) {
                if (isBootstrap) {
                    field.classList.add('is-invalid');
                    field.classList.remove('is-valid');
                } else {
                    field.style.borderColor = '#dc3545';
                }
                
                if (!existingFeedback) {
                    const feedbackDiv = document.createElement('div');
                    feedbackDiv.className = isBootstrap ? 'invalid-feedback' : 'error-feedback';
                    
                    if (!isBootstrap) {
                        feedbackDiv.style.color = '#dc3545';
                        feedbackDiv.style.fontSize = '0.85rem';
                        feedbackDiv.style.marginTop = '5px';
                    }
                    
                    feedbackDiv.textContent = errorMessage;
                    field.parentNode.appendChild(feedbackDiv);
                } else {
                    existingFeedback.textContent = errorMessage;
                }
                return false;
            } else {
                if (isBootstrap) {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                } else {
                    field.style.borderColor = '#ddd';
                }
                
                if (existingFeedback) {
                    existingFeedback.remove();
                }
                return true;
            }
        },
        validateCheckbox: function(checkbox, condition, errorMessage) {
            const formGroup = checkbox.closest('.form-group') || checkbox.closest('.mb-3');
            const existingFeedback = formGroup.querySelector('.invalid-feedback');
            
            if (!condition) {
                checkbox.classList.add('is-invalid');
                
                if (!existingFeedback) {
                    const feedbackDiv = document.createElement('div');
                    feedbackDiv.className = 'invalid-feedback';
                    feedbackDiv.textContent = errorMessage;
                    checkbox.parentNode.appendChild(feedbackDiv);
                }
                return false;
            } else {
                checkbox.classList.remove('is-invalid');
                
                if (existingFeedback) {
                    existingFeedback.remove();
                }
                return true;
            }
        },
        
        emailExists: function(email) {
            const users = JSON.parse(localStorage.getItem('travelExplorer_users') || '[]');
            return users.some(user => user.email === email.trim());
        },
        
        
        checkPasswordStrength: function(password) {
            let strength = 0;
            
            if (password.length >= 8) strength += 20;
            if (password.match(/[a-z]+/)) strength += 20;
            if (password.match(/[A-Z]+/)) strength += 20;
            if (password.match(/[0-9]+/)) strength += 20;
            if (password.match(/[^a-zA-Z0-9]+/)) strength += 20;
            
            return strength;
        }
    },
   
    storage: {
        saveUserSession: function(user) {
            localStorage.setItem('travelExplorer_currentUser', JSON.stringify({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isLoggedIn: true
            }));
        },
        
        saveRememberMe: function(email, remember) {
            if (remember) {
                localStorage.setItem('travelExplorer_email', email);
                localStorage.setItem('travelExplorer_rememberMe', 'true');
            } else {
                localStorage.removeItem('travelExplorer_email');
                localStorage.removeItem('travelExplorer_rememberMe');
            }
        },
       
        loadRememberMe: function() {
            return {
                email: localStorage.getItem('travelExplorer_email') || '',
                remembered: localStorage.getItem('travelExplorer_rememberMe') === 'true'
            };
        },
        
        
        getUsers: function() {
            return JSON.parse(localStorage.getItem('travelExplorer_users') || '[]');
        },
        
        
        addUser: function(user) {
            const users = this.getUsers();
            users.push(user);
            localStorage.setItem('travelExplorer_users', JSON.stringify(users));
        },
        
        
        findUser: function(email, password) {
            const users = this.getUsers();
            return users.find(u => u.email === email && u.password === password) || null;
        },
        
        
        isLoggedIn: function() {
            const currentUser = JSON.parse(localStorage.getItem('travelExplorer_currentUser') || '{}');
            return currentUser.isLoggedIn === true;
        },
        
        getCurrentUser: function() {
            return JSON.parse(localStorage.getItem('travelExplorer_currentUser') || 'null');
        },
        
        logout: function() {
            localStorage.removeItem('travelExplorer_currentUser');
        }
    }
};
window.TravelUtils = TravelUtils;