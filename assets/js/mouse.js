// mouse.js - Interactive Dynamic Theme Trail + Click Explosion Effect
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none'; 
    canvas.style.zIndex = '1'; 

    let particles = [];
    const mouse = { x: null, y: null };

    // Function to look up the current active theme primary color dynamically
    function getCurrentThemeColor() {
        const color = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
        return color || '#a855f7'; // Fallback to purple if empty
    }

    // Helper to convert hexadecimal colors to RGBA format smoothly
    function hexToRgb(hex) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) { c = [c[0], c[0], c[1], c[1], c[2], c[2]]; }
            c = '0x' + c.join('');
            return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
        }
        return [168, 85, 247]; // fallback values
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 1. Regular Move Trail
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(mouse.x, mouse.y, false));
        }
    });

    // 2. Click Explosion Effect
    window.addEventListener('click', (e) => {
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle(e.clientX, e.clientY, true));
        }
    });

    // Particle Object Definition
    class Particle {
        constructor(x, y, isClickParticle) {
            this.x = x;
            this.y = y;
            this.isClick = isClickParticle;

            if (this.isClick) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2; 
                this.speedX = Math.cos(angle) * speed;
                this.speedY = Math.sin(angle) * speed;
                this.size = Math.random() * 5 + 3; 
                this.decay = Math.random() * 0.03 + 0.02; 
            } else {
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = Math.random() * 1.5 - 0.75;
                this.size = Math.random() * 4 + 2;
                this.decay = Math.random() * 0.02 + 0.015;
            }

            // Capture the current theme active color string at the exact moment of creation
            this.themeHex = getCurrentThemeColor();
            this.rgbValues = hexToRgb(this.themeHex);
            this.alpha = 1;
            this.initialOpacity = Math.random() * 0.4 + 0.6;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.isClick) {
                this.speedX *= 0.96;
                this.speedY *= 0.96;
            }

            this.alpha -= this.decay;
            if (this.size > 0.1) this.size -= 0.05;
        }

        draw() {
            if (this.alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            // Render active RGB values matching the matrix switchboard selection
            ctx.shadowBlur = this.isClick ? 15 : 10; 
            ctx.shadowColor = this.themeHex;
            ctx.fillStyle = `rgba(${this.rgbValues[0]}, ${this.rgbValues[1]}, ${this.rgbValues[2]}, ${this.initialOpacity})`;
            ctx.fill();
            ctx.restore();
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
});