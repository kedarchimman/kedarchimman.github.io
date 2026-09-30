const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const cursorGlow = document.querySelector('.cursor-glow');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

window.addEventListener('pointermove', (e) => {
  if (cursorGlow) {
    cursorGlow.animate({left: `${e.clientX}px`, top: `${e.clientY}px`}, {duration: 550, fill: 'forwards'});
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold: 0.13});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('.magnetic').forEach(button => {
  button.addEventListener('pointermove', e => {
    const r = button.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.15;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.15;
    button.style.transform = `translate(${x}px,${y}px)`;
  });
  button.addEventListener('pointerleave', () => button.style.transform = '');
});

const roleEl = document.querySelector('.role-line span:first-child');
const roles = ['Cloud & DevOps Engineer','AWS • Linux • Docker • Kubernetes','CI/CD • Automation • Software'];
let roleIndex = 0;
setInterval(() => {
  roleIndex = (roleIndex + 1) % roles.length;
  roleEl.style.opacity = '0';
  setTimeout(() => { roleEl.textContent = roles[roleIndex]; roleEl.style.opacity = '1'; }, 220);
}, 2800);

const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');

let particles = [];

let mouse = {
  x: -1000,
  y: -1000
};

function resizeCanvas() {
  if (!canvas || !ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const particleCount = Math.min(
    70,
    Math.floor(width / 18)
  );

  particles = Array.from(
    { length: particleCount },
    () => ({
      x: Math.random() * width,
      y: Math.random() * height,

      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.22,

      r: Math.random() * 1.5 + 0.35
    })
  );
}

function draw() {
  if (!canvas || !ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) {
      p.vx *= -1;
    }

    if (p.y < 0 || p.y > height) {
      p.vy *= -1;
    }

    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const d = Math.hypot(dx, dy);

    if (d > 0 && d < 120) {
      p.x += (dx / d) * 0.18;
      p.y += (dy / d) * 0.18;
    }

    /* Star */
    ctx.fillStyle = 'rgba(190, 180, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    /* Connections */
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];

      const dd = Math.hypot(
        p.x - q.x,
        p.y - q.y
      );

      if (dd < 105) {
        ctx.strokeStyle =
          `rgba(155, 124, 255, ${(1 - dd / 105) * 0.08})`;

        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resizeCanvas);

window.addEventListener('pointermove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

resizeCanvas();
draw();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('pointermove', e => { mouse.x=e.clientX; mouse.y=e.clientY; });
resizeCanvas(); draw();

document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const subject = encodeURIComponent(`Portfolio contact from ${form.get('name')}`);
  const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`);
  window.location.href = `mailto:chimmankedarnath1805@gmail.com?subject=${subject}&body=${body}`;
});
