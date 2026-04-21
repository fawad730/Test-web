document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* --- STICKY HEADER --- */
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    /* --- ANIMATION 1: FADE UP + BLUR REVEAL --- */
    const fadeUpElements = document.querySelectorAll('.fade-up-blur');
    
    fadeUpElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Starts animation when element is 85% from top of viewport
                toggleActions: "play none none none"
            },
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: el.dataset.delay || 0
        });
    });

    /* --- ANIMATION 2: Removed floating animations (hero uses static blended background now) --- */

    /* --- ACTIVE NAV LINK HIGHLIGHT --- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* --- FORM SUBMISSION PREVENT --- */
    const form = document.querySelector('.appointment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your appointment request has been received. Our team will contact you soon.');
            form.reset();
        });
    }

    /* --- HERO REVEAL SEQUENCE (Immediate on Load) --- */
    const heroElements = document.querySelectorAll('.hero-card .fade-up-blur');
    gsap.set(heroElements, { opacity: 0, y: 30, filter: "blur(10px)" });
    
    gsap.to(heroElements, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out"
    });

    /* --- TEETH IMAGE SUBTLE ENTRANCE --- */
    const teethImg = document.querySelector('.hero-teeth-img');
    if (teethImg) {
        gsap.from(teethImg, {
            opacity: 0,
            scale: 0.9,
            y: 40,
            duration: 1.8,
            ease: "power3.out",
            delay: 0.4
        });
    }
});
