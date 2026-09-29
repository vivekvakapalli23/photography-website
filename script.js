/**
 * VIVEK PHOTOGRAPHY - Luxury Cinematic Script
 * Interactivity • Animations • Lightbox • Slider • FAQ Accordion • Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // 1. PAGE LOADER
    // ============================================
    const pageLoader = document.getElementById('pageLoader');
    
    window.addEventListener('load', () => {
        if (pageLoader) {
            pageLoader.classList.add('fade-out');
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 800);
        }
    });

    // Fallback if load event doesn't trigger quickly
    setTimeout(() => {
        if (pageLoader && !pageLoader.classList.contains('fade-out')) {
            pageLoader.classList.add('fade-out');
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 800);
        }
    }, 3500);

    // ============================================
    // 2. STICKY NAVBAR
    // ============================================
    const navbar = document.getElementById('navbar');
    
    const handleNavbarScroll = () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check

    // ============================================
    // 3. MOBILE MENU
    // ============================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        const toggleMobileMenu = () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
        };

        hamburgerBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    // ============================================
    // 4. ACTIVE NAVIGATION LINK ON MULTI-PAGE
    // ============================================
    // Highlight nav link based on current URL path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        // Match path or if on homepage index.html/root
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ============================================
    // 5. ANIMATED STATS COUNTERS
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const increment = target / 50; // speed mapping
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    setTimeout(updateCount, 25);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.hero-stats-wrapper');
    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        statsObserver.observe(statsSection);
    }

    // ============================================
    // 6. GALLERY CATEGORY FILTER
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    item.style.transform = 'scale(0.8)';
                    item.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || itemCategory === filterValue) {
                            item.classList.remove('hidden');
                            setTimeout(() => {
                                item.style.transform = 'scale(1)';
                                item.style.opacity = '1';
                            }, 50);
                        } else {
                            item.classList.add('hidden');
                        }
                    }, 300);
                });
            });
        });
    }

    // ============================================
    // 7. GALLERY LIGHTBOX MODAL (DEFENSIVE)
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    const closeLightboxBtn = document.getElementById('closeLightbox');
    const prevLightboxBtn = document.getElementById('prevLightbox');
    const nextLightboxBtn = document.getElementById('nextLightbox');

    let currentGalleryIndex = 0;
    let visibleGalleryItems = [];

    const updateVisibleItemsList = () => {
        visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    };

    const showLightboxImage = (index) => {
        if (!lightboxImg || visibleGalleryItems.length === 0) return;
        
        if (index < 0) index = visibleGalleryItems.length - 1;
        if (index >= visibleGalleryItems.length) index = 0;
        
        currentGalleryIndex = index;
        const currentItem = visibleGalleryItems[currentGalleryIndex];
        
        const img = currentItem.querySelector('img');
        const titleEl = currentItem.querySelector('.gallery-card-title');
        const catEl = currentItem.querySelector('.gallery-card-cat');

        const title = titleEl ? titleEl.innerText : '';
        const category = catEl ? catEl.innerText : '';

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (lightboxCategory) lightboxCategory.innerText = category;
        if (lightboxTitle) lightboxTitle.innerText = title;
        if (lightboxCounter) lightboxCounter.innerText = `${currentGalleryIndex + 1} / ${visibleGalleryItems.length}`;
    };

    // Only configure lightbox events if lightbox element exists
    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                updateVisibleItemsList();
                const index = visibleGalleryItems.indexOf(item);
                
                showLightboxImage(index);
                lightbox.classList.add('active');
                document.body.classList.add('no-scroll');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
            setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
        };

        if (closeLightboxBtn) {
            closeLightboxBtn.addEventListener('click', closeLightbox);
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-img-container')) {
                closeLightbox();
            }
        });

        const prevImage = () => showLightboxImage(currentGalleryIndex - 1);
        const nextImage = () => showLightboxImage(currentGalleryIndex + 1);

        if (prevLightboxBtn) prevLightboxBtn.addEventListener('click', prevImage);
        if (nextLightboxBtn) nextLightboxBtn.addEventListener('click', nextImage);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }

    // ============================================
    // 8. TESTIMONIALS SLIDER
    // ============================================
    const slider = document.getElementById('testimonialSlider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    let currentSlide = 0;
    let autoSlideInterval;

    const updateSlider = (index) => {
        if (!slider) return;
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlide);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    };

    const nextSlide = () => updateSlider(currentSlide + 1);
    const prevSlide = () => updateSlider(currentSlide - 1);

    if (slider) {
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlider(index);
                resetAutoPlay();
            });
        });

        const startAutoPlay = () => {
            autoSlideInterval = setInterval(nextSlide, 6500);
        };

        const resetAutoPlay = () => {
            clearInterval(autoSlideInterval);
            startAutoPlay();
        };

        startAutoPlay();
    }

    // ============================================
    // 9. FAQ ACCORDION
    // ============================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items first
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = '0px';
            });

            // Toggle selected item
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });

    // ============================================
    // 10. CONTACT FORM VALIDATION & TOAST
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const toastSuccess = document.getElementById('toastSuccess');
    const closeToast = document.getElementById('closeToast');

    const validateField = (input, condition) => {
        if (!input) return true;
        const group = input.closest('.form-group');
        if (!group) return true;
        
        if (condition) {
            group.classList.remove('error');
            return true;
        } else {
            group.classList.add('error');
            return false;
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const sessionType = document.getElementById('sessionType');
            const date = document.getElementById('date');

            const isNameValid = validateField(name, name.value.trim().length > 1);
            const isEmailValid = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
            const isPhoneValid = validateField(phone, phone.value.trim().length >= 8);
            const isTypeValid = validateField(sessionType, sessionType.value !== '');
            const isDateValid = validateField(date, date.value !== '');

            if (isNameValid && isEmailValid && isPhoneValid && isTypeValid && isDateValid) {
                const submitBtn = contactForm.querySelector('.form-submit-btn');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }

                // Gather form data into an object
                const formObj = {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    sessionType: sessionType.value,
                    date: date.value,
                    message: document.getElementById('message').value.trim(),
                    _subject: "New Booking Request - Vivek Photography"
                };

                fetch("https://formsubmit.co/ajax/vivekvakapalli23@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formObj)
                })
                .then(response => response.json())
                .then(data => {
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                    if (toastSuccess) toastSuccess.classList.add('active');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error("Error sending email:", error);
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                    alert("There was an error sending your request. Please try again or contact us directly.");
                });
            }
        });

        // Event listeners for real-time check on blur/change
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.addEventListener('blur', () => validateField(nameInput, nameInput.value.trim().length > 1));

        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.addEventListener('blur', () => validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())));

        const phoneInput = document.getElementById('phone');
        if (phoneInput) phoneInput.addEventListener('blur', () => validateField(phoneInput, phoneInput.value.trim().length >= 8));
        
        const typeInput = document.getElementById('sessionType');
        if (typeInput) typeInput.addEventListener('change', () => validateField(typeInput, typeInput.value !== ''));

        const dateInput = document.getElementById('date');
        if (dateInput) dateInput.addEventListener('change', () => validateField(dateInput, dateInput.value !== ''));
    }

    if (closeToast && toastSuccess) {
        closeToast.addEventListener('click', () => {
            toastSuccess.classList.remove('active');
        });
    }

    // ============================================
    // 11. SCROLL REVEAL OBSERVER
    // ============================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (revealElements.length > 0) {
        const revealOnScrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealOnScrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealOnScrollObserver.observe(el);
        });
    }

});
