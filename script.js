// Particle canvas
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function Particle() {
  this.reset = function() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.life = Math.random();
    this.color = Math.random() > 0.5 ? '#7C3AED' : '#06B6D4';
  };
  this.reset();
}

for (let i = 0; i < 80; i++) {
  const p = new Particle();
  particles.push(p);
}

let mouseX = W / 2, mouseY = H / 2;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 120) * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    // Subtle mouse repulsion
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.vx += dx / dist * 0.05;
      p.vy += dy / dist * 0.05;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.99;
    p.vy *= 0.99;

    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  requestAnimationFrame(draw);
}
draw();

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
});

function animRing() {
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
});

// Typed code animation
const lines = [
  { html: '<span class="cm">// kadir.tsx — frontend developer</span>' },
  { html: '' },
  { html: '<span class="kw">const</span> <span class="fn">developer</span> = {' },
  { html: '  name: <span class="str">"Kadir"</span>,' },
  { html: '  location: <span class="str">"Nederland 🇳🇱"</span>,' },
  { html: '  role: <span class="str">"Frontend Developer"</span>,' },
  { html: '' },
  { html: '  stack: [' },
  { html: '    <span class="str">"React"</span>, <span class="str">"TypeScript"</span>,' },
  { html: '    <span class="str">"Next.js"</span>, <span class="str">"CSS"</span>' },
  { html: '  ],' },
  { html: '' },
  { html: '  <span class="fn">build</span>: (idea) <span class="kw">=></span> <span class="obj">{' },
  { html: '    <span class="kw">return</span> fast + beautiful + clean;' },
  { html: '  <span class="obj">}' },
  { html: '};' },
];

const out = document.getElementById('code-output');
let lineIdx = 0;

function renderLines() {
  out.innerHTML = lines.slice(0, lineIdx).map((l, i) => 
    `<div><span class="ln">${String(i + 1).padStart(2, '0')}</span>${l.html}</div>`
  ).join('') + '<div><span class="ln">' + String(lineIdx + 1).padStart(2, '0') + '</span><span class="typed-cursor"></span></div>';
}

function typeLine() {
  if (lineIdx < lines.length) {
    lineIdx++;
    renderLines();
    setTimeout(typeLine, lineIdx < 3 ? 120 : 60);
  } else {
    out.innerHTML = lines.map((l, i) => 
      `<div><span class="ln">${String(i + 1).padStart(2, '0')}</span>${l.html}</div>`
    ).join('');
  }
}

setTimeout(typeLine, 1200);

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
 
