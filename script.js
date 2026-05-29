
/**
 * AJFTPE - Main JavaScript File
 * Association environnementale de Tombouctou
 */

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Sticky Navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    let count = 0;
    const increment = target / speed;
    
    const updateCount = () => {
        if (count < target) {
            count += increment;
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target;
        }
    };
    
    updateCount();
};

// Intersection Observer for counters
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            animateCounter(counter);
            observer.unobserve(counter);
        }
    });
}, observerOptions);

counters.forEach(counter => {
    observer.observe(counter);
});

// Initialize Swiper Slider
const testimonialSwiper = new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        },
    },
});

// EmailJS Configuration
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formMessage = document.getElementById('form-message');
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        submitBtn.disabled = true;
        
        // Prepare template parameters
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            to_name: 'AJFTPE',
        };
        
        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                formMessage.classList.remove('d-none', 'alert-danger');
                formMessage.classList.add('alert-success');
                formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
                contactForm.reset();
                
                setTimeout(() => {
                    formMessage.classList.add('d-none');
                }, 5000);
            })
            .catch(function(error) {
                formMessage.classList.remove('d-none', 'alert-success');
                formMessage.classList.add('alert-danger');
                formMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
                
                setTimeout(() => {
                    formMessage.classList.add('d-none');
                }, 5000);
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Newsletter Forms Handler
const newsletterForms = document.querySelectorAll('[id^="newsletter-form"]');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Simple validation
        if (!email || !email.includes('@')) {
            showToast('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Here you would typically send to your backend or email service
        showToast('Merci pour votre inscription à notre newsletter !', 'success');
        this.reset();
    });
});

// Toast Notification System
function showToast(message, type = 'success') {
    // Create toast container if not exists
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    // Remove toast after hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Donation Handler
function showDonationAlert() {
    // In production, this would integrate with a payment gateway
    showToast('Cette fonctionnalité sera bientôt disponible. Merci de votre soutien !', 'success');
}

// Lazy Loading Images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Form Validation Helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add hover effect to stat cards
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Mobile Navigation Close on Click
const navLinks = document.querySelectorAll('.nav-link');
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });
});

// Preloader (optional)
window.addEventListener('load', () => {
    // Add a small delay for smoother experience
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 500);
});

// Back to Top Button
const createBackToTopButton = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4CAF50, #0B5D2A);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

createBackToTopButton();

// Add animation on hover for cards
const cards = document.querySelectorAll('.activity-card, .project-card, .team-card, .news-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Log successful initialization
console.log('AJFTPE Website initialized successfully');
// ============================================
// GALERIE FILTRES ET ANIMATIONS
// ============================================

// Filtres galerie
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Animation au scroll pour les éléments de la galerie
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            galleryObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Forcer le titre sur 2 lignes
function fixHeroTitle() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = "Action des Jeunes Femmes de Tombouctou pour la Préservation de l'Environnement";
    const firstLine = "Action des Jeunes Femmes de Tombouctou";
    const secondLine = "pour la Préservation de l'Environnement";
    
    // Nettoyer et recréer le contenu
    heroTitle.innerHTML = '';
    
    const span1 = document.createElement('span');
    span1.className = 'line1';
    span1.textContent = firstLine;
    
    const span2 = document.createElement('span');
    span2.className = 'line2';
    span2.textContent = secondLine;
    
    heroTitle.appendChild(span1);
    heroTitle.appendChild(span2);
    
    // Appliquer les styles directement
    heroTitle.style.textAlign = 'center';
    heroTitle.style.margin = '0 auto';
    
    span1.style.display = 'block';
    span1.style.fontSize = 'inherit';
    span1.style.fontWeight = 'inherit';
    
    span2.style.display = 'block';
    span2.style.fontSize = 'inherit';
    span2.style.fontWeight = 'inherit';
    span2.style.color = '#D4AF37';
}

// Exécuter au chargement et au redimensionnement
document.addEventListener('DOMContentLoaded', function() {
    fixHeroTitle();
});

window.addEventListener('resize', function() {
    fixHeroTitle();
});

// Observer les éléments de la galerie s'ils existent
if (document.querySelectorAll('.gallery-item').length > 0) {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.5s ease';
        galleryObserver.observe(item);
    });
}

// ========== CARROUSEL HERO SECTION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Carrousel d'images
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Changement toutes les 5 secondes
    
    function nextSlide() {
        // Retirer la classe active de la slide courante
        slides[currentSlide].classList.remove('active');
        
        // Passer à la slide suivante
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Ajouter la classe active à la nouvelle slide
        slides[currentSlide].classList.add('active');
    }
    
    // Démarrer le carrousel
    if (slides.length > 1) {
        setInterval(nextSlide, slideInterval);
    }
    
    // Animation supplémentaire : apparition progressive des éléments
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    // Ajouter des classes d'animation si nécessaire
    if (heroTitle) {
        heroTitle.style.animation = 'fadeInUp 1s ease-out forwards';
    }
});

// Animation au scroll pour réinitialiser (optionnel)
window.addEventListener('scroll', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const rect = heroTitle.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            heroTitle.style.animation = 'none';
            setTimeout(() => {
                heroTitle.style.animation = 'fadeInUp 1s ease-out forwards';
            }, 10);
        }
    }
});