const SceneStory = {
  init(container, data) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#2C1810;color:#F5F0E1;padding:40px;">
        <div class="pixel-panel" style="max-width:800px;padding:40px;background:rgba(245,240,225,0.95);color:#333;">
          <h2 style="text-align:center;margin-bottom:30px;font-size:28px;">金令传说</h2>
          <div id="story-text" style="font-size:16px;line-height:2.2;min-height:300px;"></div>
          <div style="text-align:center;margin-top:30px;">
            <button class="pixel-btn" id="skip-btn" style="margin-right:10px;">跳过</button>
            <button class="pixel-btn" id="next-btn" style="display:none;">继续</button>
          </div>
        </div>
      </div>
    `;
    
    const storyText = document.getElementById('story-text');
    const skipBtn = document.getElementById('skip-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentLine = 0;
    
    const showNextLine = async () => {
      if (currentLine >= STORY_PROLOGUE.length) {
        nextBtn.textContent = '开始选择主公';
        nextBtn.onclick = () => switchScene('select');
        return;
      }
      
      const line = STORY_PROLOGUE[currentLine];
      const p = document.createElement('p');
      p.style.marginBottom = '15px';
      storyText.appendChild(p);
      
      await Anim.typeWriter(p, line, 60);
      currentLine++;
      
      if (currentLine < STORY_PROLOGUE.length) {
        setTimeout(showNextLine, 500);
      } else {
        nextBtn.style.display = 'inline-block';
        nextBtn.textContent = '开始选择主公';
        skipBtn.style.display = 'none';
      }
    };
    
    showNextLine();
    
    skipBtn.addEventListener('click', () => {
      switchScene('select');
    });
    
    nextBtn.addEventListener('click', () => {
      switchScene('select');
    });
  },
};
