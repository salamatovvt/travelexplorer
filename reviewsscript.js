document.addEventListener('DOMContentLoaded', function() {
    const reviewsList = document.querySelector('.reviews-list');
    const destinationFilter = document.getElementById('destination-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.getElementById('search-reviews');
    const starCheckboxes = document.querySelectorAll('.star-filter input[type="checkbox"]');
    const reviewItems = document.querySelectorAll('.review-item');
    
    const originalReviews = Array.from(reviewItems);
    
    initializeHelpfulButtons();
    
    animateReviewsOnScroll();
    
    initializeFilters();
    
    createBackToTopButton();
    
    document.querySelector('.add-review-btn .btn').addEventListener('click', function(e) {
        e.preventDefault();
        showReviewForm();
    });
    
    function initializeHelpfulButtons() {
        document.querySelectorAll('.action-button:first-child').forEach(button => {
            button.addEventListener('click', function() {
                const helpfulText = this.textContent.trim();
                const currentCount = parseInt(helpfulText.match(/\((\d+)\)/)[1]);
                const newCount = currentCount + 1;
                
                this.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${newCount})`;
                
                showNotification('Thanks for marking this review as helpful!');
            });
        });
    }
    
    function animateReviewsOnScroll() {
        reviewItems.forEach(review => {
            review.classList.add('fade-in-element');
        });
        
        window.addEventListener('scroll', function() {
            reviewItems.forEach(review => {
                const reviewPosition = review.getBoundingClientRect().top;
                const screenHeight = window.innerHeight;
                
                if (reviewPosition < screenHeight - 100) {
                    review.classList.add('visible');
                }
            });
        });
        
        window.dispatchEvent(new Event('scroll'));
    }
    
    function initializeFilters() {
        destinationFilter.addEventListener('change', applyFilters);
        dateFilter.addEventListener('change', applyFilters);
        searchInput.addEventListener('input', applyFilters);
        
        starCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
    }
    
    function applyFilters() {
        const destinationValue = destinationFilter.value.toLowerCase();
        const dateValue = dateFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        const starValues = Array.from(starCheckboxes)
            .map((checkbox, index) => checkbox.checked ? 5 - index : null)
            .filter(value => value !== null);
        
        reviewsList.innerHTML = '';
        
        const filteredReviews = originalReviews.filter(review => {
            const reviewDestination = review.querySelector('.review-destination').textContent.toLowerCase();
            const matchesDestination = destinationValue === '' || reviewDestination.includes(destinationValue);
            
            const reviewDate = review.querySelector('.review-date').textContent;
            let matchesDate = true;
            
            if (dateValue === 'month') {
                matchesDate = reviewDate.includes('April 2025') || reviewDate.includes('May 2025');
            } else if (dateValue === '6months') {
                matchesDate = true; 
            } else if (dateValue === 'year') {
                matchesDate = true; 
            }
            
            const reviewText = review.querySelector('.review-text').textContent.toLowerCase();
            const reviewerName = review.querySelector('.reviewer-name').textContent.toLowerCase();
            const matchesSearch = searchValue === '' || 
                                  reviewText.includes(searchValue) || 
                                  reviewerName.includes(searchValue) ||
                                  reviewDestination.includes(searchValue);
            
            const reviewStars = countStars(review.querySelector('.review-rating'));
            const matchesStars = starValues.length === 0 || starValues.includes(reviewStars);
            
            return matchesDestination && matchesDate && matchesSearch && matchesStars;
        });
        
        if (filteredReviews.length > 0) {
            filteredReviews.forEach(review => {
                reviewsList.appendChild(review.cloneNode(true));
            });
            
            initializeHelpfulButtons();
        } else {
            reviewsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No reviews match your filters</h3>
                    <p>Try adjusting your filter criteria or search terms</p>
                </div>
            `;
        }
        
        showFilterResults(filteredReviews.length);
    }
    
    function countStars(ratingElement) {
        const fullStars = ratingElement.querySelectorAll('.fas.fa-star').length;
        const halfStars = ratingElement.querySelectorAll('.fas.fa-star-half-alt').length;
        return fullStars + (halfStars * 0.5);
    }
    
    function showFilterResults(count) {
        let resultsCounter = document.querySelector('.results-counter');
        
        if (!resultsCounter) {
            resultsCounter = document.createElement('div');
            resultsCounter.className = 'results-counter';
            const filtersContainer = document.querySelector('.review-filters');
            filtersContainer.parentNode.insertBefore(resultsCounter, filtersContainer.nextSibling);
        }
        
        resultsCounter.textContent = `Showing ${count} ${count === 1 ? 'review' : 'reviews'}`;
    }
    
    function showNotification(message) {
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    function createBackToTopButton() {
        let backToTopBtn = document.getElementById('back-to-top');
        
        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'back-to-top';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(backToTopBtn);
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    function showReviewForm() {
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.innerHTML = `
            <div class="review-form-container">
                <button class="close-modal"><i class="fas fa-times"></i></button>
                <h2>Write Your Review</h2>
                <form id="new-review-form">
                    <div class="form-group">
                        <label for="review-destination">Destination</label>
                        <select id="review-destination" required>
                            <option value="">Select a destination</option>
                            <option value="Paris, France">Paris, France</option>
                            <option value="Kyoto, Japan">Kyoto, Japan</option>
                            <option value="Barcelona, Spain">Barcelona, Spain</option>
                            <option value="Grand Canyon, USA">Grand Canyon, USA</option>
                            <option value="New York, USA">New York, USA</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Rating</label>
                        <div class="rating-input">
                            <i class="far fa-star" data-rating="1"></i>
                            <i class="far fa-star" data-rating="2"></i>
                            <i class="far fa-star" data-rating="3"></i>
                            <i class="far fa-star" data-rating="4"></i>
                            <i class="far fa-star" data-rating="5"></i>
                            <input type="hidden" id="review-rating" value="0" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="review-text">Your Review</label>
                        <textarea id="review-text" rows="5" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Upload Photos (optional)</label>
                        <input type="file" multiple accept="image/*">
                    </div>
                    
                    <button type="submit" class="btn">Submit Review</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `
            .review-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .review-form-container {
                background-color: white;
                border-radius: 8px;
                padding: 2rem;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            
            .close-modal {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #777;
            }
            
            .rating-input {
                display: flex;
                gap: 0.5rem;
                font-size: 1.5rem;
                color: #f8b400;
                cursor: pointer;
            }
            
            .rating-input i.fas {
                color: #f8b400;
            }
            
            .rating-input i.far {
                color: #ddd;
            }
        `;
        document.head.appendChild(style);
        
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        const stars = modal.querySelectorAll('.rating-input i');
        const ratingInput = modal.querySelector('#review-rating');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                highlightStars(stars, rating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                ratingInput.value = rating;
                highlightStars(stars, rating);
            });
        });
        
        modal.querySelector('.rating-input').addEventListener('mouseleave', function() {
            highlightStars(stars, ratingInput.value);
        });
        
        const reviewForm = modal.querySelector('#new-review-form');
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('review-destination').value;
            const rating = parseInt(document.getElementById('review-rating').value);
            const text = document.getElementById('review-text').value;
            
            if (!destination || rating === 0 || !text) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            showNotification('Your review has been submitted successfully!');
            document.body.removeChild(modal);
            
            addNewReview(destination, rating, text);
        });
        
        function highlightStars(stars, rating) {
            stars.forEach(star => {
                const starRating = parseInt(star.dataset.rating);
                if (starRating <= rating) {
                    star.className = 'fas fa-star';
                } else {
                    star.className = 'far fa-star';
                }
            });
        }
    }
    
    function addNewReview(destination, rating, text) {
        const newReview = document.createElement('div');
        newReview.className = 'review-item';
        
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }
        
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dateString = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
        
        newReview.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <div class="reviewer-name">You</div>
                        <div class="review-date">${dateString}</div>
                    </div>
                </div>
                <div>
                    <div class="review-rating">
                        ${starsHtml}
                    </div>
                    <div class="review-destination">${destination}</div>
                </div>
            </div>
            
            <div class="review-content">
                <p class="review-text">${text}</p>
                
                <div class="review-actions">
                    <div class="action-buttons">
                        <div class="action-button">
                            <i class="fas fa-thumbs-up"></i> Helpful (0)
                        </div>
                        <div class="action-button">
                            <i class="fas fa-comment"></i> Comment
                        </div>
                        <div class="action-button">
                            <i class="fas fa-share"></i> Share
                        </div>
                    </div>
                    <div class="review-destination-link">
                        <a href="#" class="btn">View Destination</a>
                    </div>
                </div>
            </div>
        `;
        
        reviewsList.insertBefore(newReview, reviewsList.firstChild);
        
        originalReviews.unshift(newReview);
        
        initializeHelpfulButtons();
        
        setTimeout(() => {
            newReview.classList.add('fade-in-element', 'visible');
        }, 10);
    }
});

const style = document.createElement('style');
style.textContent = `
    .fade-in-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-element.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .no-results {
        text-align: center;
        padding: 3rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .results-counter {
        text-align: right;
        margin: 1rem 0;
        color: #777;
        font-style: italic;
    }
    
    .action-button {
        cursor: pointer;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .review-item:hover .review-rating {
        animation: pulse 1s infinite;
    }
`;
document.head.appendChild(style);