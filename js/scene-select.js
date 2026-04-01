const SceneSelect = {
  selectedLord: null,
  selectedMap: null,
  
  init(container, data) {
    container.innerHTML = `
      <div style="min-height:100vh;background:#F5F0E1;padding:40px;">
        <h1 style="text-align:center;margin-bottom:40px;font-size:36px;">选择主公与战场</h1>
        
        <div class="pixel-panel" style="max-width:1000px;margin:0 auto 40px;padding:30px;">
          <h2 style="margin-bottom:20px;">一、选择主公</h2>
          <div id="lord-selection" style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;"></div>
        </div>
        
        <div class="pixel-panel" style="max-width:1000px;margin:0 auto 40px;padding:30px;">
          <h2 style="margin-bottom:20px;">二、选择战场</h2>
          <div id="map-selection" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;"></div>
        </div>
        
        <div style="text-align:center;">
          <button class="pixel-btn" id="confirm-btn" style="font-size:20px;padding:15px 40px;" disabled>
            确认开始
          </button>
        </div>
      </div>
    `;
    
    this.renderLords();
    this.renderMaps();
    
    document.getElementById('confirm-btn').addEventListener('click', () => {
      this.startGame();
    });
  },
  
  renderLords() {
    const container = document.getElementById('lord-selection');
    const lords = GENERALS.filter(g => g.isLord);
    
    lords.forEach(lord => {
      const card = document.createElement('div');
      card.className = 'pixel-panel';
      card.style.cssText = `
        cursor:pointer;
        padding:20px;
        text-align:center;
        transition:all 0.2s;
        border:3px solid #333;
      `;
      
      card.innerHTML = `
        <div class="bg-${lord.faction}" style="width:100px;height:100px;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;font-size:50px;border:4px solid #333;">
          ${lord.name[0]}
        </div>
        <div style="font-weight:bold;font-size:18px;margin-bottom:10px;">${lord.name}</div>
        <div style="font-size:14px;margin-bottom:5px;">武力:${lord.might} 智力:${lord.intellect}</div>
        <div style="font-size:12px;color:#666;margin-top:10px;line-height:1.6;">
          【${lord.talent.name}】<br>
          ${formatTalentDesc(lord.talent, 1)}
        </div>
        <div style="margin-top:10px;font-size:12px;font-style:italic;color:#8B4513;">
          "${LORD_SELECT_LINES[lord.faction]}"
        </div>
      `;
      
      card.addEventListener('click', () => {
        this.selectLord(lord, card);
      });
      
      container.appendChild(card);
    });
  },
  
  renderMaps() {
    const container = document.getElementById('map-selection');
    const maps = ['guandu', 'chibi', 'hanzhong'];
    
    maps.forEach(mapKey => {
      const mapData = MAP_DESCRIPTIONS[mapKey];
      const card = document.createElement('div');
      card.className = 'pixel-panel';
      card.style.cssText = `
        cursor:pointer;
        padding:20px;
        text-align:center;
        transition:all 0.2s;
        border:3px solid #333;
      `;
      
      card.innerHTML = `
        <h3 style="font-size:20px;margin-bottom:10px;">${mapData.title}</h3>
        <div style="font-size:14px;color:#666;margin-bottom:15px;">${mapData.subtitle}</div>
        <div style="font-size:16px;font-weight:bold;color:#DC143C;margin-bottom:10px;">${mapData.players}</div>
        <div style="font-size:12px;line-height:1.6;margin-bottom:10px;">${mapData.desc}</div>
        <div style="font-size:11px;font-style:italic;color:#8B4513;">"${mapData.quote}"</div>
      `;
      
      card.addEventListener('click', () => {
        this.selectMap(mapKey, card);
      });
      
      container.appendChild(card);
    });
  },
  
  selectLord(lord, cardElement) {
    document.querySelectorAll('#lord-selection .pixel-panel').forEach(c => {
      c.style.borderColor = '#333';
      c.style.transform = 'scale(1)';
    });
    
    cardElement.style.borderColor = `var(--${lord.faction}-color)`;
    cardElement.style.transform = 'scale(1.05)';
    
    this.selectedLord = lord;
    this.checkCanStart();
  },
  
  selectMap(mapKey, cardElement) {
    document.querySelectorAll('#map-selection .pixel-panel').forEach(c => {
      c.style.borderColor = '#333';
      c.style.transform = 'scale(1)';
    });
    
    cardElement.style.borderColor = '#DC143C';
    cardElement.style.transform = 'scale(1.05)';
    
    this.selectedMap = mapKey;
    this.checkCanStart();
  },
  
  checkCanStart() {
    const btn = document.getElementById('confirm-btn');
    if (this.selectedLord && this.selectedMap) {
      btn.disabled = false;
    }
  },
  
  startGame() {
    const mapConfig = CONFIG.maps[this.selectedMap];
    const playerCount = mapConfig.players;
    
    const otherLords = GENERALS.filter(g => g.isLord && g.id !== this.selectedLord.id)
      .slice(0, playerCount - 1);
    
    const gameData = {
      humanLord: this.selectedLord,
      aiLords: otherLords,
      mapKey: this.selectedMap,
      mapData: MAPS[this.selectedMap],
      mapConfig: mapConfig
    };
    
    switchScene('game', gameData);
  },
};
