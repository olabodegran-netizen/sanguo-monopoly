const SceneResult = {
  init(container, data) {
    const { winner, isVictory } = data;
    
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:${isVictory ? 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)' : 'linear-gradient(180deg, #696969 0%, #2F4F4F 100%)'};position:relative;overflow:hidden;">
        <div id="fireworks-container" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
        
        <div class="pixel-panel bounce-in" style="padding:60px;text-align:center;max-width:700px;z-index:10;background:rgba(245,240,225,0.95);">
          <h1 style="font-size:48px;margin-bottom:30px;color:${isVictory ? '#FFD700' : '#696969'};">
            ${isVictory ? '🎉 胜利 🎉' : '💀 破产 💀'}
          </h1>
          
          <div style="font-size:24px;font-weight:bold;margin-bottom:20px;">
            ${RESULT_TEXT[isVictory ? 'win' : 'lose'].title.replace('{lord}', winner.name)}
          </div>
          
          <div style="font-size:16px;line-height:2;margin-bottom:30px;color:#333;">
            ${RESULT_TEXT[isVictory ? 'win' : 'lose'].desc.replace('{lord}', winner.name)}
          </div>
          
          <div class="pixel-panel" style="margin:30px 0;padding:20px;background:#fff;">
            <h3 style="margin-bottom:15px;">最终数据</h3>
            <div style="font-size:14px;line-height:1.8;">
              <div>💰 金币：${winner.gold}G</div>
              <div>🏰 城池：${winner.cities.length}座</div>
              <div>⚔️ 武将：${winner.generals.length}名</div>
            </div>
          </div>
          
          <div style="display:flex;gap:15px;justify-content:center;">
            <button class="pixel-btn" id="restart-btn" style="font-size:18px;padding:12px 30px;">
              再来一局
            </button>
            <button class="pixel-btn" id="home-btn" style="font-size:18px;padding:12px 30px;">
              返回首页
            </button>
          </div>
        </div>
      </div>
    `;
    
    if (isVictory) {
      const fireworksContainer = document.getElementById('fireworks-container');
      Anim.pixelFireworks(fireworksContainer, 10000);
    }
    
    document.getElementById('restart-btn').addEventListener('click', () => {
      switchScene('select');
    });
    
    document.getElementById('home-btn').addEventListener('click', () => {
      switchScene('home');
    });
  },
};
