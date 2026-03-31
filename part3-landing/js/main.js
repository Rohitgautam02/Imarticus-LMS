// ============================================
// ISFB Landing Page - Interactions
// ============================================

// Mobile menu toggle
function toggleMobileMenu() {
    var navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('open');
}

// close mobile menu when clicking a link
var navLinkEls = document.querySelectorAll('.nav-links a');
for (var i = 0; i < navLinkEls.length; i++) {
    navLinkEls[i].addEventListener('click', function() {
        document.getElementById('nav-links').classList.remove('open');
    });
}

// ---- Tab switching helpers ----

// Leaders section tabs
function switchLeaderTab(index, btn) {
    var panels = document.querySelectorAll('.leader-panel');
    var tabs = document.querySelectorAll('.leader-tab');

    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('active');
        tabs[i].classList.remove('active');
    }

    document.getElementById('leader-panel-' + index).classList.add('active');
    btn.classList.add('active');
}

// REAL pedagogy tabs
function switchRealTab(index, btn) {
    var panels = document.querySelectorAll('.real-panel');
    var tabs = document.querySelectorAll('.real-tab');

    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('active');
        tabs[i].classList.remove('active');
    }

    document.getElementById('real-panel-' + index).classList.add('active');
    btn.classList.add('active');
}

// Outcome tabs
function switchOutcomeTab(index, btn) {
    var panels = document.querySelectorAll('.outcome-panel');
    var tabs = document.querySelectorAll('.outcome-tab');

    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('active');
        tabs[i].classList.remove('active');
    }

    document.getElementById('outcome-panel-' + index).classList.add('active');
    btn.classList.add('active');
}

// Role tabs inside outcomes
function switchRoleTab(index, btn) {
    var panels = document.querySelectorAll('.role-panel');
    var tabs = document.querySelectorAll('.role-tab');

    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('active');
        tabs[i].classList.remove('active');
    }

    document.getElementById('role-panel-' + index).classList.add('active');
    btn.classList.add('active');
}

// FAQ tabs
function switchFaqTab(index, btn) {
    var panels = document.querySelectorAll('.faq-panel');
    var tabs = document.querySelectorAll('.faq-tab');

    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('active');
        tabs[i].classList.remove('active');
    }

    document.getElementById('faq-panel-' + index).classList.add('active');
    btn.classList.add('active');
}

// FAQ accordion toggle
function toggleFaqItem(el) {
    var item = el.parentElement;
    var span = el.querySelector('span');

    item.classList.toggle('open');

    if (item.classList.contains('open')) {
        span.textContent = '-';
    } else {
        span.textContent = '+';
    }
}

// ---- Testimonials Carousel ----

var currentTestimonial = 0;
var testimonialCards = document.querySelectorAll('.testimonial-card');
var totalTestimonials = testimonialCards.length;

// create dots
function createDots() {
    var dotsContainer = document.getElementById('testimonial-dots');
    if (!dotsContainer) return;

    var dotsHtml = '';
    for (var i = 0; i < totalTestimonials; i++) {
        var activeClass = i === 0 ? ' active' : '';
        dotsHtml += '<span class="dot' + activeClass + '" onclick="goToTestimonial(' + i + ')"></span>';
    }
    dotsContainer.innerHTML = dotsHtml;
}

function goToTestimonial(index) {
    // hide all
    for (var i = 0; i < testimonialCards.length; i++) {
        testimonialCards[i].classList.remove('active');
    }

    // update dots
    var dots = document.querySelectorAll('.testimonial-dots .dot');
    for (var i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    currentTestimonial = index;
    testimonialCards[currentTestimonial].classList.add('active');
    if (dots[currentTestimonial]) {
        dots[currentTestimonial].classList.add('active');
    }
}

function nextTestimonial() {
    var next = (currentTestimonial + 1) % totalTestimonials;
    goToTestimonial(next);
}

// set up carousel
createDots();

// auto-rotate testimonials
var testimonialInterval = setInterval(nextTestimonial, 5000);

// ---- Form handling ----

function handleFormSubmit(e) {
    e.preventDefault();

    var form = e.target;
    var inputs = form.querySelectorAll('input, select');
    var isValid = true;

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].required && !inputs[i].value.trim()) {
            inputs[i].style.borderColor = '#d9534f';
            isValid = false;
        } else {
            inputs[i].style.borderColor = '#ddd';
        }
    }

    if (!isValid) {
        return;
    }

    // show success message
    var submitBtn = form.querySelector('.form-submit');
    submitBtn.textContent = 'Submitted!';
    submitBtn.style.backgroundColor = '#2e7d32';

    // redirect to LMS after a short delay
    // Update this URL to your deployed LMS URL
    setTimeout(function() {
        // beautifully routes directly mapping to the same hosted server
        window.location.href = '/login.html';
    }, 1500);
}

// ---- Sticky nav background on scroll ----

window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
    }
});
