/* ============================================
   VitaCure — Script
   Hero entrance, scroll reveals, counter animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --- STICKY HEADER --- */
    const header = document.getElementById('main-header');
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();


    /* --- ACTIVE NAV LINK HIGHLIGHT --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const highlightNav = () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });


    /* --- SCROLL-TRIGGERED REVEAL ANIMATIONS --- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
        revealObserver.observe(el);
    });


    /* --- ANIMATED STAT COUNTERS --- */
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const isDecimal = counter.dataset.decimal === 'true';
            const duration = 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else if (target >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else {
                    counter.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            requestAnimationFrame(update);
        });
    };

    // Trigger counters when trust section is in view
    const trustSection = document.getElementById('trust');
    if (trustSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        counterObserver.observe(trustSection);
    }


    /* --- SMOOTH SCROLL FOR ANCHOR LINKS --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* --- MOBILE MENU TOGGLE --- */
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });
    }


    /* --- FORM SUBMISSION --- */
    const form = document.getElementById('booking-form');
    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzASF-uLbC-_q15koY1jiGxJAeVes5agOp6e3oUzhx6rOdbUJBtTUYX5Pb2ttTjgHRU/exec';

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"] span');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';

            // Collect data from inputs
            const data = new FormData();
            data.append('Name', document.getElementById('patient-name').value);
            data.append('Phone', document.getElementById('patient-phone').value);
            data.append('Service', document.getElementById('patient-service').value);
            data.append('Date', document.getElementById('patient-date').value);
            data.append('Message', document.getElementById('patient-message').value);

            // Send to Google Sheets (using no-cors to avoid Google redirect blocks)
            fetch(scriptURL, { method: 'POST', body: data, mode: 'no-cors' })
                .then(response => {
                    // With no-cors, the response is opaque, but if it reaches here, it succeeded
                    btn.textContent = 'Appointment Confirmed ✓';
                    form.reset();
                    setTimeout(() => { btn.textContent = originalText; }, 3000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    btn.textContent = 'Error! Try again.';
                    setTimeout(() => { btn.textContent = originalText; }, 3000);
                });
        });
    }


    /* --- PARALLAX HERO BACKGROUND --- */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(${1.05 + scrolled * 0.0001}) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }
});
