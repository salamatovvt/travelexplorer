$(document).ready(function() {
    console.log("jQuery is loaded and ready!");
    
    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            var hash = this.hash;
            
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('header').addClass('sticky');
        } else {
            $('header').removeClass('sticky');
        }
    });
    
    $('.logo').click(function() {
        $('.nav-links').slideToggle(300);
    });
    
    $(document).click(function(event) {
        var target = $(event.target);
        if (!target.closest('.logo').length && !target.closest('.nav-links').length) {
            $('.nav-links').slideUp(300);
        }
    });
    
    $('.destination-card').hover(
        function() {
            $(this).find('.destination-content').slideDown(300);
            $(this).addClass('active');
        },
        function() {
            if (!$(this).hasClass('keep-open')) {
                $(this).find('.destination-content').slideUp(300);
                $(this).removeClass('active');
            }
        }
    );
    
    $('.destination-card').click(function() {
        $(this).toggleClass('keep-open');
    });
    
    $('.attraction-img img').click(function() {
        var imgSrc = $(this).attr('src');
        var imgAlt = $(this).attr('alt');
        
        var lightbox = $('<div class="lightbox"></div>');
        var lightboxContent = $('<div class="lightbox-content"></div>');
        var img = $('<img src="' + imgSrc + '" alt="' + imgAlt + '">');
        var closeBtn = $('<span class="close-lightbox">&times;</span>');
        
        lightboxContent.append(closeBtn);
        lightboxContent.append(img);
        lightbox.append(lightboxContent);
        $('body').append(lightbox);
        
        lightbox.fadeIn(300);
        
        $('.close-lightbox, .lightbox').click(function() {
            $('.lightbox').fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        $('.lightbox-content img').click(function(e) {
            e.stopPropagation();
        });
    });
    
    
    function showNotification(message, type) {
        $('.notification').remove();
        
        var notification = $('<div class="notification ' + type + '">' + message + '</div>');
        
        $('body').append(notification);
        
        notification.fadeIn(300);
        
        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }
    
    var slideIndex = 0;
    var slides = $('.destination-card');
    
    function showSlides() {
        slides.hide();
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        slides.eq(slideIndex - 1).fadeIn(1000);
        setTimeout(showSlides, 5000); 
    }
    
    if (slides.length > 1) {
        slides.hide();
        slides.first().show();
        setTimeout(showSlides, 5000);
    }
    
    if ($('#back-to-top').length === 0) {
        $('body').append('<button id="back-to-top" title="Back to Top"><i class="fas fa-arrow-up"></i></button>');
    }
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    
    $('#back-to-top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });
    
    
    $('head').append(`
        <style>
            header.sticky {
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                }
            
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                display: none;
            }
            
            .notification.success {
                background-color: #4CAF50;
                color: white;
            }
            
            
            .notification.info {
                background-color: #2196F3;
                color: white;
            }
            
            
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: none;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 80%;
                max-height: 80%;
                margin: 10% auto;
                text-align: center;
            }
            
            .lightbox-content img {
                max-width: 100%;
                max-height: 80vh;
                border: 5px solid white;
                border-radius: 5px;
            }
            
            .close-lightbox {
                position: absolute;
                top: -20px;
                right: -20px;
                font-size: 30px;
                color: white;
                cursor: pointer;
            }
            
            #back-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: none;
                background-color: #2c4a63;
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                text-align: center;
                line-height: 50px;
                font-size: 20px;
                cursor: pointer;
                z-index: 999;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            
            #back-to-top:hover {
                background-color: #1c3144;
            }
            
            
        </style>
    `);
});