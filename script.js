gsap.registerPlugin(ScrollTrigger);

// Animate the header elements on page load
gsap.from("header h1", {
    y: -100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
});

gsap.from("header p", {
    y: -60,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power4.out"
});

gsap.from(".cta-button", {
    scale: 0.2,
    opacity: 0,
    duration: 0.6,
    delay: 0.6,
    ease: "back.out(1.7)"
});

// Animate each section as the user scrolls
document.querySelectorAll("section").forEach((section) => {
    gsap.fromTo(section, 
        {
            y: 50,
            opacity: 0,
        },
        {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
        }
    );
});

// Animate skill bars on scroll
document.querySelectorAll(".skill-bar div").forEach((bar) => {
    gsap.fromTo(
        bar,
        { width: "0%" },
        {
            scrollTrigger: {
                trigger: bar,
                start: "top 90%",
                toggleActions: "play none none none",
            },
            width: bar.style.width,
            duration: 1.2,
            ease: "power2.out",
        }
    );
});

// === Starfield Animation ===
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5, // slightly bigger stars
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    alpha: Math.random(), // twinkle
    twinkle: Math.random() * 0.05,
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    ctx.beginPath();
    ctx.globalAlpha = star.alpha;
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  });
  ctx.globalAlpha = 1.0;
}

function update() {
  stars.forEach((star) => {
    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

    // Twinkle effect
    star.alpha += star.twinkle;
    if (star.alpha <= 0 || star.alpha >= 1) star.twinkle *= -1;
  });
}


function animateStars() {
    draw();
    update();
    requestAnimationFrame(animateStars);
}

animateStars();

const navLinksList = document.querySelectorAll('#main-nav a');

window.addEventListener('scroll', () => {
    const fromTop = window.scrollY + 90;

    navLinksList.forEach(link => {
        const section = document.querySelector(link.hash);
        if (!section) return;

        if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";
    status.style.color = "#00ffd5";

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            status.textContent = "✅ Message sent successfully!";
            form.reset();
        } else {
            status.textContent = "❌ Message failed. Try again later.";
            status.style.color = "#f44336";
        }
    } catch (error) {
        status.textContent = "❌ There was an error. Please try again.";
        status.style.color = "#f44336";
    }
});

document.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// Mobile Nav Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show');
});

document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('show');
    });
});
