/* ============================================================
   ByteNet — Premium Landing & Download Script
   Handles hero screenshot slideshow, fullscreen screenshot lightbox,
   and interactive peer network canvas animation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. HERO SLIDESHOW ───
    const slides = document.querySelectorAll('.slideshow-img');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Increment index
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active class to new slide
            slides[currentSlide].classList.add('active');
        }, 4000); // Swaps screenshots every 4 seconds
    }


    // ─── 2. SCREENSHOT LIGHTBOX VIEW ───
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg) {
        galleryCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add('active');
                }
            });
        });

        // Close when clicking background or close button
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose || e.target.closest('#lightbox-close')) {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightboxImg.src = ''; // Clear image src when closed
                }, 300);
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }


    // ─── 3. FAQ ACCORDION SYSTEM ───
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't open, open it
            if (!isOpen) {
                item.classList.add('open');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });


    // ─── 4. PEER NETWORK PARTICLE SYSTEM (Canvas Backdrop) ───
    const peerCanvas = document.getElementById('peer-canvas');
    if (peerCanvas) {
        const ctx = peerCanvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 100 };

        function initParticles() {
            peerCanvas.width = peerCanvas.parentElement.clientWidth;
            peerCanvas.height = peerCanvas.parentElement.clientHeight;
            particles = [];

            // Node count based on container size
            const count = Math.min(50, Math.floor((peerCanvas.width * peerCanvas.height) / 9000));
            
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * peerCanvas.width,
                    y: Math.random() * peerCanvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 2.5 + 1.5
                });
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, peerCanvas.width, peerCanvas.height);

            // Update & Draw nodes
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Border collision
                if (p.x < 0 || p.x > peerCanvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > peerCanvas.height) p.vy *= -1;

                // Mouse interaction (repel effect)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        p.x += Math.cos(angle) * force * 1.5;
                        p.y += Math.sin(angle) * force * 1.5;
                    }
                }

                // Draw Particle Dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(229, 192, 123, 0.4)';
                ctx.fill();
            });

            // Draw Connection Lines between nodes
            const connectDist = 110;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < connectDist) {
                        const alpha = (1 - (dist / connectDist)) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(229, 192, 123, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateParticles);
        }

        // Mouse listeners
        window.addEventListener('mousemove', (e) => {
            const rect = peerCanvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Initialize particles
        initParticles();
        animateParticles();

        // Handle resize
        window.addEventListener('resize', () => {
            initParticles();
        });
    }

});
