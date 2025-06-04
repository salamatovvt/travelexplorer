document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.querySelector('button[type="submit"]');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    // Check if there's saved login data in local storage
    const checkSavedCredentials = () => {
        const savedEmail = localStorage.getItem('travelExplorer_email');
        const savedRememberMe = localStorage.getItem('travelExplorer_rememberMe');
        
        if (savedEmail && savedRememberMe === 'true') {
            emailInput.value = savedEmail;
            if (rememberMeCheckbox) {
                rememberMeCheckbox.checked = true;
            }
        }
    };
    
    // Call this function when page loads
    checkSavedCredentials();
    
    const createPasswordToggle = () => {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.right = '15px';
        toggleBtn.style.top = '58px';
        toggleBtn.style.transform = 'translateY(-50%)';
        toggleBtn.style.border = 'none';
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.color = '#2c4a63';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-eye';
        toggleBtn.appendChild(icon);
        
        passwordInput.parentNode.style.position = 'relative';
        passwordInput.parentNode.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    };
    
    createPasswordToggle();
    
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateField = (field, condition, errorMessage) => {
        const formGroup = field.closest('.form-group');
        const existingFeedback = formGroup.querySelector('.error-feedback');
        
        if (!condition) {
            field.style.borderColor = '#dc3545';
            
            if (!existingFeedback) {
                const feedbackDiv = document.createElement('div');
                feedbackDiv.className = 'error-feedback';
                feedbackDiv.style.color = '#dc3545';
                feedbackDiv.style.fontSize = '0.85rem';
                feedbackDiv.style.marginTop = '5px';
                feedbackDiv.textContent = errorMessage;
                field.parentNode.appendChild(feedbackDiv);
            }
            return false;
        } else {
            field.style.borderColor = '#ddd';
            
            if (existingFeedback) {
                existingFeedback.remove();
            }
            return true;
        }
    };
    
    emailInput.addEventListener('blur', function() {
        validateField(this, validateEmail(this.value), 'Please enter a valid email address');
    });
    
    passwordInput.addEventListener('blur', function() {
        validateField(this, this.value.trim() !== '', 'Password is required');
    });
    
    const showNotification = (message, type = 'info') => {
        
        const existingNotification = document.querySelector('.notification-overlay');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        
        const notification = document.createElement('div');
        notification.className = `notification-overlay notification-${type}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1050';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        
        
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
            notification.style.color = 'white';
        } else {
            notification.style.backgroundColor = '#17a2b8';
            notification.style.color = 'white';
        }
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 10px;">
                    ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                      type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                      '<i class="fas fa-info-circle"></i>'}
                </div>
                <div>${message}</div>
                <button style="margin-left: 15px; background: none; border: none; color: white; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        TravelUtils.playAudio('sounds/submit.wav');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        let isValid = true;
        
        isValid = validateField(emailInput, validateEmail(email), 'Please enter a valid email address') && isValid;
        
        isValid = validateField(passwordInput, password !== '', 'Password is required') && isValid;
        
        if (isValid) {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            submitButton.disabled = true;
            
            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                localStorage.setItem('travelExplorer_email', email);
                localStorage.setItem('travelExplorer_rememberMe', 'true');
            } else {
                localStorage.removeItem('travelExplorer_email');
                localStorage.removeItem('travelExplorer_rememberMe');
            }
            
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('travelExplorer_users') || '[]');
                const user = users.find(u => u.email === email);
                
                if (user && user.password === password) {
                    localStorage.setItem('travelExplorer_currentUser', JSON.stringify({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isLoggedIn: true
                    }));
                    
                    showNotification('Successfully logged in!', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 1500);
                } else {
                    showNotification('Invalid email or password. Please try again.', 'error');
                    submitButton.innerHTML = 'Sign In';
                    submitButton.disabled = false;
                }
            }, 1500);
        }
    });
    
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    const loginContainer = document.querySelector('.login-form');
    loginContainer.style.opacity = '0';
    loginContainer.style.transform = 'translateY(20px)';
    loginContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
        loginContainer.style.opacity = '1';
        loginContainer.style.transform = 'translateY(0)';
    }, 200);
    
    const addRememberMe = () => {
        const forgotPasswordDiv = document.querySelector('.forgot-password');
        
        if (forgotPasswordDiv && !document.getElementById('rememberMe')) {
            const rememberMeDiv = document.createElement('div');
            rememberMeDiv.className = 'remember-me';
            rememberMeDiv.style.display = 'flex';
            rememberMeDiv.style.alignItems = 'center';
            rememberMeDiv.style.marginBottom = '1.5rem';
            
            rememberMeDiv.innerHTML = `
                <input type="checkbox" id="rememberMe" style="margin-right: 8px; width: auto;">
                <label for="rememberMe">Remember me</label>
            `;
            
            forgotPasswordDiv.parentNode.insertBefore(rememberMeDiv, forgotPasswordDiv);
            
            forgotPasswordDiv.style.textAlign = 'right';
            forgotPasswordDiv.style.flexGrow = '1';
            
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.justifyContent = 'space-between';
            container.style.alignItems = 'center';
            container.style.marginBottom = '1.5rem';
            
            rememberMeDiv.parentNode.replaceChild(container, rememberMeDiv);
            container.appendChild(rememberMeDiv);
            container.appendChild(forgotPasswordDiv);
            
            rememberMeDiv.style.marginBottom = '0';
            forgotPasswordDiv.style.marginBottom = '0';
            
            checkSavedCredentials();
        }
    };
    
    addRememberMe();

});