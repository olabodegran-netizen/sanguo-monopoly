const Anim = {
  shakeScreen(intensity = 5, duration = 300) {
    document.getElementById('app').classList.add('shake');
    setTimeout(() => document.getElementById('app').classList.remove('shake'), duration);
  },

  goldBurst(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const coin = document.createElement('div');
      coin.textContent = '💰';
      coin.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:20px;pointer-events:none;z-index:9999;`;
      document.body.appendChild(coin);
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 100;
      coin.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist - 80}px) scale(0.3)`, opacity: 0 }
      ], { duration: 800 + Math.random() * 400, easing: 'ease-out' }).onfinish = () => coin.remove();
    }
  },

  animateNumber(element, from, to, duration = 500) {
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(from + (to - from) * progress);
      element.textContent = value + 'G';
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  },

  pixelFireworks(container, duration = 5000) {
    const colors = ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF1493'];
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(interval);
        return;
      }
      
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;
      
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position:absolute;
          left:${x}px;
          top:${y}px;
          width:8px;
          height:8px;
          background:${colors[Math.floor(Math.random()*colors.length)]};
          border:2px solid #333;
          pointer-events:none;
        `;
        container.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 8;
        const dist = 50 + Math.random() * 50;
        particle.animate([
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`, opacity: 0 }
        ], { duration: 1000, easing: 'ease-out' }).onfinish = () => particle.remove();
      }
    }, 200);
  },

  typeWriter(element, text, speed = 50) {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = '';
      const interval = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  },
};
