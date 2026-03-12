document.addEventListener('DOMContentLoaded', function() {
    async function loadGitHubReadme() {
        const readmeContainer = document.getElementById('readme-content');
        try {
            const response = await fetch('https://raw.githubusercontent.com/Murilor16/MuriloRodrigues-README-/main/README.md');
            if (!response.ok) throw new Error('Erro ao carregar README');
            
            const markdown = await response.text();
            
            let html = markdown
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
                .replace(/!\[([^\]]+)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" class="readme-img">')
                .replace(/\n\n/gim, '</p><p>')
                .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
                .replace(/`([^`]+)`/gim, '<code>$1</code>')
                .replace(/^\- (.*$)/gim, '<li>$1</li>')
                .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
            
            readmeContainer.innerHTML = '<div class="readme-content">' + html + '</div>';
        } catch (error) {
            readmeContainer.innerHTML = `
                <div class="readme-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Não foi possível carregar as informações do GitHub.</p>
                    <a href="https://github.com/Murilor16/MuriloRodrigues-README-" target="_blank">Ver README no GitHub</a>
                </div>
            `;
        }
    }

    loadGitHubReadme();

    const expandBtn = document.getElementById('expandReadme');
    const readmeContent = document.getElementById('readme-content');
    
    expandBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        readmeContent.classList.toggle('collapsed');
        
        if (readmeContent.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
            text.textContent = 'Expandir README';
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
            text.textContent = 'Recolher README';
        }
    });

    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    Particle.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };

    Particle.prototype.draw = function() {
        const isDark = document.body.classList.contains('dark-mode');
        ctx.fillStyle = isDark ? 'rgba(88, 166, 255, 0.3)' : 'rgba(74, 144, 226, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };

    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const isDark = document.body.classList.contains('dark-mode');
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    ctx.strokeStyle = isDark ? `rgba(88, 166, 255, ${opacity})` : `rgba(74, 144, 226, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', function() {
        resizeCanvas();
        initParticles();
    });

    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    const downloadBtn = document.getElementById('downloadPDF');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const themeToggle = document.getElementById('themeToggle');
            const canvas = document.getElementById('backgroundCanvas');
            const downloadButton = document.getElementById('downloadPDF');

            if (themeToggle) themeToggle.style.display = 'none';
            if (canvas) canvas.style.display = 'none';
            if (downloadButton) downloadButton.style.display = 'none';

            window.print();

            setTimeout(() => {
                if (themeToggle) themeToggle.style.display = 'flex';
                if (canvas) canvas.style.display = 'block';
                if (downloadButton) downloadButton.style.display = 'inline-flex';
            }, 1000);
        });
    }
});
