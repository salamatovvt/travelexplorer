document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.querySelector('form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailInput = document.getElementById('email');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const termsCheck = document.getElementById('termsCheck');
    const createAccountBtn = document.querySelector('button[type="submit"]');
    const dobInput = document.getElementById('dob');
    
    const createPasswordStrengthIndicator = () => {
        const passwordField = document.getElementById('password');
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'password-strength mt-2';
        indicatorContainer.innerHTML = `
            <div class="progress" style="height: 5px;">
                <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <small class="form-text text-muted strength-text">Password strength: Too weak</small>
        `;
        
        passwordField.parentNode.appendChild(indicatorContainer);
        return {
            progressBar: indicatorContainer.querySelector('.progress-bar'),
            strengthText: indicatorContainer.querySelector('.strength-text')
        };
    };
    
    const passwordIndicator = createPasswordStrengthIndicator();
    
    const checkPasswordStrength = (password) => {
        let strength = 0;
        
        if (password.length >= 8) strength += 20;
        if (password.match(/[a-z]+/)) strength += 20;
        if (password.match(/[A-Z]+/)) strength += 20;
        if (password.match(/[0-9]+/)) strength += 20;
        if (password.match(/[^a-zA-Z0-9]+/)) strength += 20;
        
        return strength;
    };
    
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        passwordIndicator.progressBar.style.width = strength + '%';
        
        if (strength < 40) {
            passwordIndicator.progressBar.className = 'progress-bar bg-danger';
            passwordIndicator.strengthText.textContent = 'Password strength: Too weak';
        } else if (strength < 60) {
            passwordIndicator.progressBar.className = 'progress-bar bg-warning';
            passwordIndicator.strengthText.textContent = 'Password strength: Medium';
        } else if (strength < 80) {
            passwordIndicator.progressBar.className = 'progress-bar bg-info';
            passwordIndicator.strengthText.textContent = 'Password strength: Strong';
        } else {
            passwordIndicator.progressBar.className = 'progress-bar bg-success';
            passwordIndicator.strengthText.textContent = 'Password strength: Very strong';
        }
    });
    
    const createPasswordToggle = () => {
        const passwordFields = [passwordInput, confirmPasswordInput];
        
        passwordFields.forEach(field => {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'btn btn-sm text-secondary position-absolute';
            toggleBtn.style.right = '5px';
            toggleBtn.style.top = '5px';
            toggleBtn.style.width = '40px';
            toggleBtn.style.height = '30px';
            toggleBtn.style.color = 'white';
            toggleBtn.style.padding = '0';
            toggleBtn.style.justifyContent = 'center';
            
            const icon = document.createElement('i');
            icon.className = 'fa fa-eye';
            icon.style.top = '7px';
            icon.style.left = '11px'; 
            toggleBtn.appendChild(icon);
            
            field.parentNode.style.position = 'relative';
            field.parentNode.appendChild(toggleBtn);
            
            toggleBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (field.type === 'password') {
                    field.type = 'text';
                    icon.className = 'fa fa-eye-slash';
                } else {
                    field.type = 'password';
                    icon.className = 'fa fa-eye';
                }
            });
        });
    };
    
    createPasswordToggle();
    
    firstNameInput.addEventListener('blur', function() {
        validateField(this, this.value.trim() !== '', 'First name is required');
    });
    
    lastNameInput.addEventListener('blur', function() {
        validateField(this, this.value.trim() !== '', 'Last name is required');
    });
    
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(this, emailRegex.test(this.value), 'Please enter a valid email address');
        
        if (emailRegex.test(this.value)) {
            const users = JSON.parse(localStorage.getItem('travelExplorer_users') || '[]');
            const emailExists = users.some(user => user.email === this.value.trim());
            
            if (emailExists) {
                validateField(this, false, 'This email is already registered');
            }
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        validateField(this, this.value.length >= 8, 'Password must be at least 8 characters');
    });
    
    confirmPasswordInput.addEventListener('blur', function() {
        validateField(this, this.value === passwordInput.value, 'Passwords do not match');
    });
    
    termsCheck.addEventListener('change', function() {
        validateCheckbox(this, this.checked, 'You must agree to the Terms of Service');
    });
    
    function validateField(field, condition, errorMessage) {
        const formGroup = field.closest('.mb-3');
        const existingFeedback = formGroup.querySelector('.invalid-feedback');
        
        if (!condition) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            
            if (!existingFeedback) {
                const feedbackDiv = document.createElement('div');
                feedbackDiv.className = 'invalid-feedback';
                feedbackDiv.textContent = errorMessage;
                field.parentNode.appendChild(feedbackDiv);
            } else {
                existingFeedback.textContent = errorMessage;
            }
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            
            if (existingFeedback) {
                existingFeedback.remove();
            }
            return true;
        }
    }
    
    function validateCheckbox(checkbox, condition, errorMessage) {
        const formGroup = checkbox.closest('.mb-3');
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
    }
    
    function getSelectedPreferences() {
        const preferences = [];
        const checkboxes = document.querySelectorAll('.form-check-input:not(#termsCheck):not(#newsletterCheck)');
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                preferences.push(checkbox.id);
            }
        });
        
        return preferences;
    }
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const dob = dobInput ? dobInput.value : '';
        const newsletterSubscription = document.getElementById('newsletterCheck') ? 
            document.getElementById('newsletterCheck').checked : false;
        const travelPreferences = getSelectedPreferences();
        
        let isValid = true;
        
        if (firstName === '') {
            validateField(firstNameInput, false, 'First name is required');
            isValid = false;
        }
        
        if (lastName === '') {
            validateField(lastNameInput, false, 'Last name is required');
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            validateField(emailInput, false, 'Please enter a valid email address');
            isValid = false;
        } else {
            const users = JSON.parse(localStorage.getItem('travelExplorer_users') || '[]');
            const emailExists = users.some(user => user.email === email);
            
            if (emailExists) {
                validateField(emailInput, false, 'This email is already registered');
                isValid = false;
            }
        }
        
        if (password.length < 8) {
            validateField(passwordInput, false, 'Password must be at least 8 characters');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            validateField(confirmPasswordInput, false, 'Passwords do not match');
            isValid = false;
        }
        
        if (!termsCheck.checked) {
            validateCheckbox(termsCheck, false, 'You must agree to the Terms of Service');
            isValid = false;
        }
        
        if (isValid) {
            const newUser = {
                firstName,
                lastName,
                email,
                password,
                dob,
                newsletterSubscription,
                travelPreferences,
                registrationDate: new Date().toISOString(),
                profileImage: '' 
            };
            
            const users = JSON.parse(localStorage.getItem('travelExplorer_users') || '[]');
            users.push(newUser);
            localStorage.setItem('travelExplorer_users', JSON.stringify(users));
            
            localStorage.setItem('travelExplorer_currentUser', JSON.stringify({
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                isLoggedIn: true
            }));
            
            showNotification('Account created successfully! Redirecting to login page...', 'success');
            
            setTimeout(() => {
                  createAccountBtn.disabled = true;
                createAccountBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Creating Account...';
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }, 1000);
        }
    });
    
    function showNotification(message, type = 'info') {
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
    
    const animateCheckboxes = () => {
        const checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling;
            
            if (label) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        label.style.fontWeight = 'bold';
                        label.style.color = '#2c4a63';
                        label.style.transition = 'all 0.3s ease';
                    } else {
                        label.style.fontWeight = 'normal';
                        label.style.color = '';
                    }
                });
            }
        });
    };
    
    animateCheckboxes();
    
    const profilePicInput = document.getElementById('profilePic');
    
    if (profilePicInput) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'mt-2 text-center';
        previewContainer.innerHTML = '<div class="profile-preview" style="width: 100px; height: 100px; border-radius: 50%; background-color: #eee; margin: 0 auto; overflow: hidden; display: none;"><img style="width: 100%; height: 100%; object-fit: cover;"></div>';
        
        profilePicInput.parentNode.appendChild(previewContainer);
        
        const previewImg = previewContainer.querySelector('img');
        const previewDiv = previewContainer.querySelector('.profile-preview');
        
        profilePicInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewDiv.style.display = 'block';
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
});