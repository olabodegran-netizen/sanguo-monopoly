const Dice = {
  getDiceFace(num) {
    const faces = {
      1: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100px;height:100px;padding:15px;">
          <div></div><div></div><div></div>
          <div></div><div class="dot"></div><div></div>
          <div></div><div></div><div></div>
        </div>
      `,
      2: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100px;height:100px;padding:15px;">
          <div class="dot"></div><div></div><div></div>
          <div></div><div></div><div></div>
          <div></div><div></div><div class="dot"></div>
        </div>
      `,
      3: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100px;height:100px;padding:15px;">
          <div class="dot"></div><div></div><div></div>
          <div></div><div class="dot"></div><div></div>
          <div></div><div></div><div class="dot"></div>
        </div>
      `,
      4: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100px;height:100px;padding:15px;">
          <div class="dot"></div><div></div><div class="dot"></div>
          <div></div><div></div><div></div>
          <div class="dot"></div><div></div><div class="dot"></div>
        </div>
      `,
      5: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100px;height:100px;padding:15px;">
          <div class="dot"></div><div></div><div class="dot"></div>
          <div></div><div class="dot"></div><div></div>
          <div class="dot"></div><div></div><div class="dot"></div>
        </div>
      `,
      6: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100px;height:100px;padding:15px;">
          <div class="dot"></div><div></div><div class="dot"></div>
          <div class="dot"></div><div></div><div class="dot"></div>
          <div class="dot"></div><div></div><div class="dot"></div>
        </div>
      `
    };
    return faces[num];
  },

  async roll(container) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const diceBox = document.createElement('div');
      diceBox.className = 'pixel-panel';
      diceBox.style.cssText = `
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        z-index:1000;
        width:300px;
        height:350px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
        border-radius:20px;
        box-shadow:0 8px 24px rgba(0,0,0,0.2);
      `;

      const diceDisplay = document.createElement('div');
      diceDisplay.style.cssText = `
        width:120px;
        height:120px;
        background:#fff;
        border:4px solid #8B7355;
        display:flex;
        align-items:center;
        justify-content:center;
        margin-bottom:20px;
        box-shadow:0 4px 8px rgba(0,0,0,0.15);
        border-radius:16px;
      `;

      const resultText = document.createElement('div');
      resultText.style.cssText = `
        font-size:24px;
        font-weight:bold;
        color:#5D4E37;
      `;
      resultText.textContent = '掷骰中...';

      diceBox.appendChild(diceDisplay);
      diceBox.appendChild(resultText);
      document.body.appendChild(overlay);
      document.body.appendChild(diceBox);

      const style = document.createElement('style');
      style.textContent = `
        .dot {
          width:14px;
          height:14px;
          background:#5D4E37;
          border-radius:50%;
          box-shadow:inset 0 -2px 0 rgba(0,0,0,0.2);
        }
      `;
      document.head.appendChild(style);

      const totalDuration = 1500;
      const frameInterval = 80;
      const frames = Math.floor(totalDuration / frameInterval);
      let currentFrame = 0;

      const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 6) + 1;
        diceDisplay.innerHTML = this.getDiceFace(randomNum);
        diceDisplay.style.transform = `rotate(${currentFrame * 45}deg) scale(${1 + Math.sin(currentFrame * 0.5) * 0.1})`;
        currentFrame++;
      }, frameInterval);

      setTimeout(() => {
        clearInterval(interval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        diceDisplay.innerHTML = this.getDiceFace(finalResult);
        diceDisplay.style.transform = 'rotate(0deg) scale(1)';
        resultText.textContent = `前进 ${finalResult} 步！`;

        setTimeout(() => {
          overlay.classList.add('fade-out');
          diceBox.classList.add('fade-out');
          setTimeout(() => {
            overlay.remove();
            diceBox.remove();
            style.remove();
            resolve(finalResult);
          }, 300);
        }, 400);
      }, totalDuration);
    });
  },
};
