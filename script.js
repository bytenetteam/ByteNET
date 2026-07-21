/* ============================================================
   ByteNet v5.6 — Landing Page Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. HERO SLIDESHOW ───
    const slides = document.querySelectorAll('.slideshow-img');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
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

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose || e.target.closest('#lightbox-close')) {
                lightbox.classList.remove('active');
                setTimeout(() => { lightboxImg.src = ''; }, 300);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }

    // ─── 3. FAQ ACCORDION ───
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isOpen = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });

            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    // ─── 4. PEER NETWORK PARTICLE BACKDROP ───
    const peerCanvas = document.getElementById('peer-canvas');
    if (peerCanvas) {
        const ctx = peerCanvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            if (!peerCanvas.parentElement) return;
            peerCanvas.width = peerCanvas.parentElement.clientWidth;
            peerCanvas.height = peerCanvas.parentElement.clientHeight;
        }

        function createParticles() {
            particles = [];
            const count = Math.floor(peerCanvas.width / 25);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * peerCanvas.width,
                    y: Math.random() * peerCanvas.height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        function drawNetwork() {
            ctx.clearRect(0, 0, peerCanvas.width, peerCanvas.height);
            ctx.fillStyle = 'rgba(252, 226, 5, 0.6)';
            ctx.strokeStyle = 'rgba(252, 226, 5, 0.1)';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > peerCanvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > peerCanvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawNetwork);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        resizeCanvas();
        createParticles();
        drawNetwork();
    }
});
