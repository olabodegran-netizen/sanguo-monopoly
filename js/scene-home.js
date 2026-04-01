const SceneHome = {
  init(container, data) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:linear-gradient(180deg, #F5F0E1 0%, #D2B48C 100%);">
        <div style="text-align:center;margin-bottom:50px;">
          <h1 style="font-size:42px;margin-bottom:20px;text-shadow:4px 4px 0 rgba(0,0,0,0.3);">三国大富翁：金令传说</h1>
          <div style="font-size:20px;color:#8B4513;">金令争夺战</div>
        </div>
        
        <div class="pixel-panel" style="padding:40px;text-align:center;max-width:500px;">
          <div style="font-size:16px;line-height:2;margin-bottom:30px;">
            东汉末年，天下大乱。<br>
            然而在这个平行世界中，<br>
            决定天下归属的并非刀兵铁马，<br>
            而是一枚枚闪耀着金光的铜钱。
          </div>
          
          <div style="display:flex;gap:15px;justify-content:center;">
            <button class="pixel-btn" id="start-btn" style="font-size:20px;padding:15px 40px;">
              开始游戏
            </button>
            <button class="pixel-btn" id="encyclopedia-btn" style="font-size:20px;padding:15px 40px;">
              📖 图鉴
            </button>
          </div>
        </div>
        
        <div style="margin-top:30px;font-size:12px;color:#666;">
          三国大富翁：金令传说 v2.0
        </div>
      </div>
    `;
    
    document.getElementById('start-btn').addEventListener('click', () => {
      switchScene('story');
    });
    
    document.getElementById('encyclopedia-btn').addEventListener('click', () => {
      this.showEncyclopedia();
    });
  },

  showEncyclopedia() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    
    const panel = document.createElement('div');
    panel.className = 'pixel-panel bounce-in';
    panel.style.cssText = `
      z-index:1000;
      width:900px;
      max-height:85vh;
      overflow-y:auto;
      padding:25px;
    `;
    
    let html = `<h2 style="text-align:center;margin-bottom:15px;">📖 图鉴</h2>`;
    html += `<div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;">
      <button class="pixel-btn tab-btn" data-tab="generals" style="padding:8px 20px;font-size:14px;background:#FFD700;">⚔️ 武将图鉴</button>
      <button class="pixel-btn tab-btn" data-tab="cities" style="padding:8px 20px;font-size:14px;">🏰 城池图鉴</button>
    </div>`;
    html += `<div id="encyclopedia-content"></div>`;
    html += `<div style="text-align:center;margin-top:20px;"><button class="pixel-btn" id="close-encyclopedia">关闭</button></div>`;
    
    panel.innerHTML = html;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    
    const renderGenerals = () => {
      const content = document.getElementById('encyclopedia-content');
      const factions = [
        { key: 'wei', name: '魏', color: '#4169E1' },
        { key: 'shu', name: '蜀', color: '#DC143C' },
        { key: 'wu', name: '吴', color: '#228B22' },
        { key: 'qun', name: '群雄', color: '#DAA520' }
      ];
      
      let h = '';
      factions.forEach(f => {
        const generals = GENERALS.filter(g => g.faction === f.key);
        h += `<h3 style="color:${f.color};margin:15px 0 10px;border-bottom:3px solid ${f.color};padding-bottom:5px;">${f.name}势力（${generals.length}名）</h3>`;
        h += `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:15px;">`;
        generals.forEach(g => {
          const tierLabel = g.tier === 'high' ? '★★★' : g.tier === 'mid' ? '★★' : '★';
          const tierColor = g.tier === 'high' ? '#FFD700' : g.tier === 'mid' ? '#C0C0C0' : '#CD7F32';
          const talentHtml = g.talent 
            ? `<div style="font-size:9px;color:#B8860B;margin-top:3px;line-height:1.3;">【${g.talent.name}】<br>${formatTalentDesc(g.talent, 1)}</div>`
            : `<div style="font-size:9px;color:#999;margin-top:3px;">无天赋</div>`;
          h += `
            <div class="pixel-panel" style="width:130px;padding:8px;text-align:center;border:2px solid ${f.color};">
              <div class="bg-${g.faction}" style="width:45px;height:45px;margin:0 auto 5px;display:flex;align-items:center;justify-content:center;font-size:22px;border:2px solid #333;color:#fff;">
                ${g.name[0]}
              </div>
              <div style="font-weight:bold;font-size:13px;">${g.name}</div>
              <div style="font-size:10px;color:${tierColor};">${tierLabel} ${g.isLord ? '主公' : ''}</div>
              <div style="font-size:10px;margin-top:2px;">武:${g.might} 智:${g.intellect}</div>
              <div style="font-size:10px;color:#666;">费用:${g.recruitCost}G</div>
              ${talentHtml}
            </div>
          `;
        });
        h += `</div>`;
      });
      content.innerHTML = h;
    };
    
    const renderCities = () => {
      const content = document.getElementById('encyclopedia-content');
      const mapKeys = Object.keys(MAPS);
      
      let h = '';
      mapKeys.forEach(key => {
        const map = MAPS[key];
        const cities = map.cells.filter(c => c.type === 'city');
        const cfg = CONFIG.maps[key];
        
        h += `<h3 style="margin:15px 0 10px;border-bottom:3px solid #8B4513;padding-bottom:5px;">🗺️ ${map.name}（${map.cells.length}格，${cities.length}座城池）</h3>`;
        h += `<div style="font-size:12px;color:#666;margin-bottom:10px;">初始金币:${cfg.startGold}G | 俸禄:${cfg.salary}G | 玩家数:${cfg.players}</div>`;
        h += `<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:15px;">`;
        h += `<tr style="background:#D2B48C;font-weight:bold;">
          <th style="padding:6px;border:2px solid #333;">城池</th>
          <th style="padding:6px;border:2px solid #333;">级别</th>
          <th style="padding:6px;border:2px solid #333;">购买价</th>
          <th style="padding:6px;border:2px solid #333;">Lv1过路费</th>
          <th style="padding:6px;border:2px solid #333;">Lv2过路费</th>
          <th style="padding:6px;border:2px solid #333;">Lv3过路费</th>
          <th style="padding:6px;border:2px solid #333;">升级费(1→2)</th>
          <th style="padding:6px;border:2px solid #333;">升级费(2→3)</th>
        </tr>`;
        cities.forEach(c => {
          const tier = CONFIG.cityTiers[c.cityTier];
          const tierName = c.cityTier === 'low' ? '初级' : c.cityTier === 'mid' ? '中级' : '高级';
          const tierColor = c.cityTier === 'low' ? '#CD7F32' : c.cityTier === 'mid' ? '#C0C0C0' : '#FFD700';
          h += `<tr>
            <td style="padding:5px;border:2px solid #333;font-weight:bold;">${c.name}</td>
            <td style="padding:5px;border:2px solid #333;text-align:center;color:${tierColor};font-weight:bold;">${tierName}</td>
            <td style="padding:5px;border:2px solid #333;text-align:center;">${tier.buy}G</td>
            <td style="padding:5px;border:2px solid #333;text-align:center;">${tier.toll[0]}G</td>
            <td style="padding:5px;border:2px solid #333;text-align:center;">${tier.toll[1]}G</td>
            <td style="padding:5px;border:2px solid #333;text-align:center;">${tier.toll[2]}G</td>
            <td style="padding:5px;border:2px solid #333;text-align:center;">${tier.upgradeCost[0]}G</td>
            <td style="padding:5px;border:2px solid #333;text-align:center;">${tier.upgradeCost[1]}G</td>
          </tr>`;
        });
        h += `</table>`;
      });
      content.innerHTML = h;
    };
    
    renderGenerals();
    
    panel.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        panel.querySelectorAll('.tab-btn').forEach(b => b.style.background = '#fff');
        btn.style.background = '#FFD700';
        if (btn.dataset.tab === 'generals') renderGenerals();
        else renderCities();
      });
    });
    
    const close = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => { overlay.remove(); }, 300);
    };
    
    document.getElementById('close-encyclopedia').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },
};
