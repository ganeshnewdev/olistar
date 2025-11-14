/* ======================
   PARTICLES
====================== */
console.log("script.js LOADED SUCCESSFULLY");


function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    particlesContainer.innerHTML = ""; 

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);
setInterval(createParticles, 15000);


/* Smooth scroll */
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}


/* Navbar */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.style.background =
        window.scrollY > 100
            ? 'rgba(0, 0, 0, 0.95)'
            : 'rgba(0, 0, 0, 0.8)';
});


/* Animations */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});


/* ======================
   N8N CONTACT FORM
====================== */

const N8N_WEBHOOK = "http://localhost:5680/webhook/contact-olistar";

const MAX_FILE_SIZE_MB = 300;

let isSubmitting = false;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const statusEl = document.getElementById("contact-status");
    const fileInput = document.getElementById("fileInput");

    if (!form) return;

    function setStatus(message, isError = false) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? "#ff6b6b" : "#C9A16F";
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        setStatus("Validating...");

        const fd = new FormData(form);
        fd.append("token", "olistar_secure_2025");

        const name = fd.get("name")?.toString().trim();
        const phone = fd.get("phone")?.toString().trim();

        if (!name || !phone) {
            setStatus("Name and phone are required.", true);
            isSubmitting = false;
            return;
        }

        const file = fileInput.files?.[0];

        if (file) {
            const allowedTypes = ["video/", "image/", "application/pdf"];
            if (!allowedTypes.some(t => file.type.startsWith(t))) {
                setStatus("Invalid file type. Use video, image, or PDF.", true);
                isSubmitting = false;
                return;
            }

            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setStatus(`File too large. Max is ${MAX_FILE_SIZE_MB} MB.`, true);
                isSubmitting = false;
                return;
            }
        }

        fd.append("submittedAt", new Date().toISOString());

        try {
            setStatus("Sending...");

            const response = await fetch(N8N_WEBHOOK, {
                method: "POST",
                body: fd
            });

            if (!response.ok) throw new Error("Server error " + response.status);

            setStatus("Message sent! I will contact you soon.");
            form.reset();
        } catch (error) {
            setStatus("Failed to send. Try again or DM me on Instagram.", true);
            console.error(error);
        }

        isSubmitting = false;
    });
});
