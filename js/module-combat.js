const Combat = {
  async execute(attacker, defender, attackerGeneral, defenderGeneral, toll) {
    return new Promise(async (resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const panel = document.createElement('div');
      panel.className = 'pixel-panel';
      panel.style.cssText = `
        z-index:1000;
        width:750px;
        padding:35px;
        background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
        border:4px solid #8B6914;
        border-radius:24px;
        box-shadow:0 12px 40px rgba(0,0,0,0.25);
      `;

      panel.innerHTML = `
        <div style="text-align:center;margin-bottom:25px;">
          <h2 style="font-size:26px;color:#3D3425;text-shadow:2px 2px 4px rgba(255,255,255,0.8);">
            <svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:8px;"><path d="M6 2L2 8l8 4-8 4 4 6 8-10M18 2l-4 6 8 4-8 4 4 6 8-10" stroke="#8B6914" stroke-width="2" fill="none"/></svg>
            沙场对决
            <svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;margin-left:8px;"><path d="M6 2L2 8l8 4-8 4 4 6 8-10M18 2l-4 6 8 4-8 4 4 6 8-10" stroke="#8B6914" stroke-width="2" fill="none"/></svg>
          </h2>
        </div>
        <div class="combat-arena" style="display:flex;justify-content:space-between;align-items:center;margin:35px 0;">
          <div class="combat-left" style="text-align:center;flex:1;">
            <div style="position:relative;width:130px;height:130px;margin:0 auto;">
              <div style="position:absolute;inset:-8px;background:linear-gradient(135deg, #FFD700, #B8860B);border-radius:50%;opacity:0.3;filter:blur(8px);"></div>
              <div class="general-portrait-painterly bg-${attackerGeneral.faction}" style="position:relative;width:130px;height:130px;background:linear-gradient(145deg, var(--${attackerGeneral.faction}-color), color-mix(in srgb, var(--${attackerGeneral.faction}-color) 60%, #333));">
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                  ${attackerGeneral.name[0]}
                </div>
              </div>
            </div>
            <div style="font-weight:bold;margin-top:15px;font-size:20px;color:#3D3425;">${attackerGeneral.name}</div>
            <div style="margin-top:8px;font-size:15px;color:#7D6E57;">⚔️ 武力 <span style="font-weight:bold;color:#3D3425;">${attackerGeneral.might}</span></div>
            <div style="margin-top:4px;font-size:13px;color:#9D8E77;">${attacker.name}</div>
          </div>
          <div class="combat-center" style="flex:0 0 120px;text-align:center;">
            <div style="position:relative;width:80px;height:80px;margin:0 auto;">
              <div style="position:absolute;inset:0;background:linear-gradient(135deg, #FFD700, #E74C3C);border-radius:50%;opacity:0.4;filter:blur(10px);"></div>
              <div style="position:relative;width:80px;height:80px;background:linear-gradient(145deg, #3D3425, #5D4E37);border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid #8B6914;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                <span style="font-size:32px;font-weight:bold;color:#FFD700;text-shadow:0 0 10px rgba(255,215,0,0.5);">VS</span>
              </div>
            </div>
            <div class="combat-effects" style="margin-top:15px;min-height:50px;"></div>
          </div>
          <div class="combat-right" style="text-align:center;flex:1;">
            <div style="position:relative;width:130px;height:130px;margin:0 auto;">
              <div style="position:absolute;inset:-8px;background:linear-gradient(135deg, #FFD700, #B8860B);border-radius:50%;opacity:0.3;filter:blur(8px);"></div>
              <div class="general-portrait-painterly bg-${defenderGeneral.faction}" style="position:relative;width:130px;height:130px;background:linear-gradient(145deg, var(--${defenderGeneral.faction}-color), color-mix(in srgb, var(--${defenderGeneral.faction}-color) 60%, #333));">
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                  ${defenderGeneral.name[0]}
                </div>
              </div>
            </div>
            <div style="font-weight:bold;margin-top:15px;font-size:20px;color:#3D3425;">${defenderGeneral.name}</div>
            <div style="margin-top:8px;font-size:15px;color:#7D6E57;">⚔️ 武力 <span style="font-weight:bold;color:#3D3425;">${defenderGeneral.might}</span></div>
            <div style="margin-top:4px;font-size:13px;color:#9D8E77;">${defender.name}</div>
          </div>
        </div>
        <div class="combat-dialogue" style="min-height:60px;text-align:center;font-size:15px;line-height:1.8;margin:25px 0;color:#5D4E37;font-style:italic;"></div>
        <div class="combat-result" style="min-height:45px;text-align:center;font-size:18px;font-weight:bold;color:#3D3425;padding:12px;background:rgba(139,115,85,0.1);border-radius:12px;"></div>
        <div style="text-align:center;margin-top:20px;"><button class="pixel-btn combat-confirm" style="display:none;padding:12px 40px;font-size:16px;">确认</button></div>
      `;

      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      const leftPortrait = panel.querySelector('.combat-left .general-portrait-painterly');
      const rightPortrait = panel.querySelector('.combat-right .general-portrait-painterly');
      const dialogue = panel.querySelector('.combat-dialogue');
      const result = panel.querySelector('.combat-result');
      const confirmBtn = panel.querySelector('.combat-confirm');

      leftPortrait.parentElement.classList.add('combat-enter-left');
      rightPortrait.parentElement.classList.add('combat-enter-right');

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase1));

      const attackerLine = COMBAT_LINES[attackerGeneral.name] ||
                          GENERIC_COMBAT_LINES[Math.floor(Math.random() * GENERIC_COMBAT_LINES.length)];
      await Anim.typeWriter(dialogue, `${attackerGeneral.name}：${attackerLine}`, 35);

      await new Promise(r => setTimeout(r, 500));

      leftPortrait.classList.add('combat-clash-left');
      rightPortrait.classList.add('combat-clash-right');

      const effects = panel.querySelector('.combat-effects');
      effects.innerHTML = '<div class="combat-explosion" style="font-size:50px;"><svg width="50" height="50" viewBox="0 0 24 24"><path d="M12 2L9 9H2l6 5-2 7 6-4 6 4-2-7 6-5h-7z" fill="#FFD700" stroke="#E74C3C" stroke-width="1"/></svg></div>';
      Anim.shakeScreen();

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase2));

      const attackerMight = attackerGeneral.might;
      const defenderMight = defenderGeneral.might;

      let winner, loser, winnerPortrait, loserPortrait;
      if (attackerMight > defenderMight) {
        winner = attacker;
        loser = defender;
        winnerPortrait = leftPortrait;
        loserPortrait = rightPortrait;
      } else if (defenderMight > attackerMight) {
        winner = defender;
        loser = attacker;
        winnerPortrait = rightPortrait;
        loserPortrait = leftPortrait;
      } else {
        winner = null;
      }

      if (winner) {
        winnerPortrait.classList.add('combat-winner');
        loserPortrait.classList.add('combat-loser');

        const finalToll = winner === attacker ?
          Math.floor(toll * CONFIG.combat.winRate) :
          Math.floor(toll * CONFIG.combat.loseRate);

        const winnerName = winner === attacker ? attackerGeneral.name : defenderGeneral.name;
        result.innerHTML = `<span style="color:#6AAF50;">${winnerName}</span>获胜！${attacker.name}支付${finalToll}G过路费！`;

        attacker.gold -= finalToll;
        defender.gold += finalToll;

        resolve({ winner, loser, toll: finalToll });
      } else {
        result.innerHTML = `平局！双方不分胜负，${attacker.name}支付${toll}G过路费！`;
        attacker.gold -= toll;
        defender.gold += toll;
        resolve({ winner: null, loser: null, toll });
      }

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase3));

      confirmBtn.style.display = 'inline-block';
      confirmBtn.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
        }, 300);
      });

      if (!attacker.isHuman) {
        setTimeout(() => {
          confirmBtn.click();
        }, CONFIG.animation.dialogAutoClose);
      }
    });
  },

  async executeCityCombat(attacker, defender, attackerGeneral, defenderGeneral, toll) {
    return new Promise(async (resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const panel = document.createElement('div');
      panel.className = 'pixel-panel';
      panel.style.cssText = `
        z-index:1000;
        width:750px;
        padding:35px;
        background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
        border:4px solid #8B6914;
        border-radius:24px;
        box-shadow:0 12px 40px rgba(0,0,0,0.25);
      `;

      panel.innerHTML = `
        <div style="text-align:center;margin-bottom:25px;">
          <h2 style="font-size:26px;color:#3D3425;text-shadow:2px 2px 4px rgba(255,255,255,0.8);">
            <svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:8px;"><path d="M3 21V8l9-5 9 5v13H3z" fill="#C9A66B" stroke="#5D4E37" stroke-width="1.5"/></svg>
            攻城之战
            <svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;margin-left:8px;"><path d="M3 21V8l9-5 9 5v13H3z" fill="#C9A66B" stroke="#5D4E37" stroke-width="1.5"/></svg>
          </h2>
        </div>
        <div class="combat-arena" style="display:flex;justify-content:space-between;align-items:center;margin:35px 0;">
          <div class="combat-left" style="text-align:center;flex:1;">
            <div style="position:relative;width:130px;height:130px;margin:0 auto;">
              <div style="position:absolute;inset:-8px;background:linear-gradient(135deg, #FFD700, #B8860B);border-radius:50%;opacity:0.3;filter:blur(8px);"></div>
              <div class="general-portrait-painterly bg-${attackerGeneral.faction}" style="position:relative;width:130px;height:130px;background:linear-gradient(145deg, var(--${attackerGeneral.faction}-color), color-mix(in srgb, var(--${attackerGeneral.faction}-color) 60%, #333));">
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                  ${attackerGeneral.name[0]}
                </div>
              </div>
            </div>
            <div style="font-weight:bold;margin-top:15px;font-size:20px;color:#3D3425;">${attackerGeneral.name}</div>
            <div style="margin-top:8px;font-size:15px;color:#7D6E57;">⚔️ 武力 <span style="font-weight:bold;color:#3D3425;">${attackerGeneral.might}</span></div>
          </div>
          <div class="combat-center" style="flex:0 0 120px;text-align:center;">
            <div style="position:relative;width:80px;height:80px;margin:0 auto;">
              <div style="position:absolute;inset:0;background:linear-gradient(135deg, #FFD700, #E74C3C);border-radius:50%;opacity:0.4;filter:blur(10px);"></div>
              <div style="position:relative;width:80px;height:80px;background:linear-gradient(145deg, #3D3425, #5D4E37);border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid #8B6914;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                <span style="font-size:32px;font-weight:bold;color:#FFD700;text-shadow:0 0 10px rgba(255,215,0,0.5);">VS</span>
              </div>
            </div>
            <div class="combat-effects" style="margin-top:15px;min-height:50px;"></div>
          </div>
          <div class="combat-right" style="text-align:center;flex:1;">
            <div style="position:relative;width:130px;height:130px;margin:0 auto;">
              <div style="position:absolute;inset:-8px;background:linear-gradient(135deg, #FFD700, #B8860B);border-radius:50%;opacity:0.3;filter:blur(8px);"></div>
              <div class="general-portrait-painterly bg-${defenderGeneral.faction}" style="position:relative;width:130px;height:130px;background:linear-gradient(145deg, var(--${defenderGeneral.faction}-color), color-mix(in srgb, var(--${defenderGeneral.faction}-color) 60%, #333));">
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                  ${defenderGeneral.name[0]}
                </div>
              </div>
            </div>
            <div style="font-weight:bold;margin-top:15px;font-size:20px;color:#3D3425;">${defenderGeneral.name}</div>
            <div style="margin-top:8px;font-size:15px;color:#7D6E57;">⚔️ 武力 <span style="font-weight:bold;color:#3D3425;">${defenderGeneral.might}</span></div>
          </div>
        </div>
        <div class="combat-dialogue" style="min-height:60px;text-align:center;font-size:15px;line-height:1.8;margin:25px 0;color:#5D4E37;font-style:italic;"></div>
        <div class="combat-result" style="min-height:45px;text-align:center;font-size:18px;font-weight:bold;color:#3D3425;padding:12px;background:rgba(139,115,85,0.1);border-radius:12px;"></div>
        <div style="text-align:center;margin-top:20px;"><button class="pixel-btn combat-confirm" style="display:none;padding:12px 40px;font-size:16px;">确认</button></div>
      `;

      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      const leftPortrait = panel.querySelector('.combat-left .general-portrait-painterly');
      const rightPortrait = panel.querySelector('.combat-right .general-portrait-painterly');
      const dialogue = panel.querySelector('.combat-dialogue');
      const result = panel.querySelector('.combat-result');
      const confirmBtn = panel.querySelector('.combat-confirm');

      leftPortrait.parentElement.classList.add('combat-enter-left');
      rightPortrait.parentElement.classList.add('combat-enter-right');

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase1));

      const attackerLine = COMBAT_LINES[attackerGeneral.name] ||
                          GENERIC_COMBAT_LINES[Math.floor(Math.random() * GENERIC_COMBAT_LINES.length)];
      await Anim.typeWriter(dialogue, `${attackerGeneral.name}：${attackerLine}`, 35);

      await new Promise(r => setTimeout(r, 500));

      leftPortrait.classList.add('combat-clash-left');
      rightPortrait.classList.add('combat-clash-right');

      const effects = panel.querySelector('.combat-effects');
      effects.innerHTML = '<div class="combat-explosion" style="font-size:50px;"><svg width="50" height="50" viewBox="0 0 24 24"><path d="M12 2L9 9H2l6 5-2 7 6-4 6 4-2-7 6-5h-7z" fill="#FFD700" stroke="#E74C3C" stroke-width="1"/></svg></div>';
      Anim.shakeScreen();

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase2));

      const attackerMight = attackerGeneral.might;
      const defenderMight = defenderGeneral.might;

      let winner, loser, winnerPortrait, loserPortrait;
      if (attackerMight > defenderMight) {
        winner = attacker;
        loser = defender;
        winnerPortrait = leftPortrait;
        loserPortrait = rightPortrait;
      } else if (defenderMight > attackerMight) {
        winner = defender;
        loser = attacker;
        winnerPortrait = rightPortrait;
        loserPortrait = leftPortrait;
      } else {
        winner = null;
      }

      if (winner) {
        winnerPortrait.classList.add('combat-winner');
        loserPortrait.classList.add('combat-loser');

        const toll免除 = CONFIG.combat.toll免除;
        const toll加收 = CONFIG.combat.toll加收;

        let finalToll;
        let resultText;
        if (winner === attacker) {
          finalToll = toll - toll免除;
          resultText = `<span style="color:#6AAF50;">${attackerGeneral.name}</span>获胜！免交${toll免除}G，仅支付${finalToll}G过路费！`;
          attacker.gold -= finalToll;
          defender.gold += finalToll;
        } else {
          finalToll = toll + toll加收;
          resultText = `<span style="color:#E74C3C;">${defenderGeneral.name}</span>获胜！${attacker.name}额外支付${toll加收}G，需支付${finalToll}G过路费！`;
          attacker.gold -= finalToll;
          defender.gold += finalToll;
        }

        result.innerHTML = resultText;
        resolve({ winner, loser, toll: finalToll });
      } else {
        result.innerHTML = `平局！双方不分胜负，${attacker.name}支付${toll}G过路费！`;
        attacker.gold -= toll;
        defender.gold += toll;
        resolve({ winner: null, loser: null, toll });
      }

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase3));

      confirmBtn.style.display = 'inline-block';
      confirmBtn.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
        }, 300);
      });

      if (!attacker.isHuman) {
        setTimeout(() => {
          confirmBtn.click();
        }, CONFIG.animation.dialogAutoClose);
      }
    });
  },

  async executeEncounter(attacker, defender, attackerGeneral, defenderGeneral) {
    const bounty = CONFIG.combat.encounterBounty;
    return new Promise(async (resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const panel = document.createElement('div');
      panel.className = 'pixel-panel';
      panel.style.cssText = `
        z-index:1000;
        width:750px;
        padding:35px;
        background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
        border:4px solid #8B6914;
        border-radius:24px;
        box-shadow:0 12px 40px rgba(0,0,0,0.25);
      `;

      panel.innerHTML = `
        <div style="text-align:center;margin-bottom:25px;">
          <h2 style="font-size:26px;color:#3D3425;text-shadow:2px 2px 4px rgba(255,255,255,0.8);">
            <svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:8px;"><path d="M12 2L4 6v12l8-4 8 4V6l-8 4z" fill="#E8907A" stroke="#8B4513" stroke-width="1.5"/></svg>
            狭路相逢
            <svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;margin-left:8px;"><path d="M12 2L4 6v12l8-4 8 4V6l-8 4z" fill="#E8907A" stroke="#8B4513" stroke-width="1.5"/></svg>
          </h2>
        </div>
        <div class="combat-arena" style="display:flex;justify-content:space-between;align-items:center;margin:35px 0;">
          <div class="combat-left" style="text-align:center;flex:1;">
            <div style="position:relative;width:130px;height:130px;margin:0 auto;">
              <div style="position:absolute;inset:-8px;background:linear-gradient(135deg, #FFD700, #B8860B);border-radius:50%;opacity:0.3;filter:blur(8px);"></div>
              <div class="general-portrait-painterly bg-${attackerGeneral.faction}" style="position:relative;width:130px;height:130px;background:linear-gradient(145deg, var(--${attackerGeneral.faction}-color), color-mix(in srgb, var(--${attackerGeneral.faction}-color) 60%, #333));">
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                  ${attackerGeneral.name[0]}
                </div>
              </div>
            </div>
            <div style="font-weight:bold;margin-top:15px;font-size:20px;color:#3D3425;">${attackerGeneral.name}</div>
            <div style="margin-top:8px;font-size:15px;color:#7D6E57;">⚔️ 武力 <span style="font-weight:bold;color:#3D3425;">${attackerGeneral.might}</span></div>
          </div>
          <div class="combat-center" style="flex:0 0 120px;text-align:center;">
            <div style="position:relative;width:80px;height:80px;margin:0 auto;">
              <div style="position:absolute;inset:0;background:linear-gradient(135deg, #FFD700, #E74C3C);border-radius:50%;opacity:0.4;filter:blur(10px);"></div>
              <div style="position:relative;width:80px;height:80px;background:linear-gradient(145deg, #3D3425, #5D4E37);border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid #8B6914;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                <span style="font-size:32px;font-weight:bold;color:#FFD700;text-shadow:0 0 10px rgba(255,215,0,0.5);">VS</span>
              </div>
            </div>
            <div class="combat-effects" style="margin-top:15px;min-height:50px;"></div>
          </div>
          <div class="combat-right" style="text-align:center;flex:1;">
            <div style="position:relative;width:130px;height:130px;margin:0 auto;">
              <div style="position:absolute;inset:-8px;background:linear-gradient(135deg, #FFD700, #B8860B);border-radius:50%;opacity:0.3;filter:blur(8px);"></div>
              <div class="general-portrait-painterly bg-${defenderGeneral.faction}" style="position:relative;width:130px;height:130px;background:linear-gradient(145deg, var(--${defenderGeneral.faction}-color), color-mix(in srgb, var(--${defenderGeneral.faction}-color) 60%, #333));">
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                  ${defenderGeneral.name[0]}
                </div>
              </div>
            </div>
            <div style="font-weight:bold;margin-top:15px;font-size:20px;color:#3D3425;">${defenderGeneral.name}</div>
            <div style="margin-top:8px;font-size:15px;color:#7D6E57;">⚔️ 武力 <span style="font-weight:bold;color:#3D3425;">${defenderGeneral.might}</span></div>
          </div>
        </div>
        <div class="combat-dialogue" style="min-height:60px;text-align:center;font-size:15px;line-height:1.8;margin:25px 0;color:#5D4E37;font-style:italic;"></div>
        <div class="combat-result" style="min-height:45px;text-align:center;font-size:18px;font-weight:bold;color:#3D3425;padding:12px;background:rgba(139,115,85,0.1);border-radius:12px;"></div>
        <div style="text-align:center;margin-top:20px;"><button class="pixel-btn combat-confirm" style="display:none;padding:12px 40px;font-size:16px;">确认</button></div>
      `;

      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      const leftPortrait = panel.querySelector('.combat-left .general-portrait-painterly');
      const rightPortrait = panel.querySelector('.combat-right .general-portrait-painterly');
      const dialogue = panel.querySelector('.combat-dialogue');
      const result = panel.querySelector('.combat-result');
      const confirmBtn = panel.querySelector('.combat-confirm');

      leftPortrait.parentElement.classList.add('combat-enter-left');
      rightPortrait.parentElement.classList.add('combat-enter-right');

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase1));

      const attackerLine = COMBAT_LINES[attackerGeneral.name] ||
                          GENERIC_COMBAT_LINES[Math.floor(Math.random() * GENERIC_COMBAT_LINES.length)];
      await Anim.typeWriter(dialogue, `${attackerGeneral.name}：${attackerLine}`, 35);

      await new Promise(r => setTimeout(r, 500));

      leftPortrait.classList.add('combat-clash-left');
      rightPortrait.classList.add('combat-clash-right');

      const effects = panel.querySelector('.combat-effects');
      effects.innerHTML = '<div class="combat-explosion" style="font-size:50px;"><svg width="50" height="50" viewBox="0 0 24 24"><path d="M12 2L9 9H2l6 5-2 7 6-4 6 4-2-7 6-5h-7z" fill="#FFD700" stroke="#E74C3C" stroke-width="1"/></svg></div>';
      Anim.shakeScreen();

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase2));

      const attackerMight = attackerGeneral.might;
      const defenderMight = defenderGeneral.might;

      let winner, loser, winnerPortrait, loserPortrait;
      if (attackerMight > defenderMight) {
        winner = attacker;
        loser = defender;
        winnerPortrait = leftPortrait;
        loserPortrait = rightPortrait;
      } else if (defenderMight > attackerMight) {
        winner = defender;
        loser = attacker;
        winnerPortrait = rightPortrait;
        loserPortrait = leftPortrait;
      } else {
        winner = null;
      }

      if (winner) {
        winnerPortrait.classList.add('combat-winner');
        loserPortrait.classList.add('combat-loser');

        const winnerName = winner === attacker ? attackerGeneral.name : defenderGeneral.name;
        result.innerHTML = `<span style="color:#6AAF50;">${winnerName}</span>获胜！${loser.name}支付${bounty}G赔偿金！`;

        loser.gold -= bounty;
        winner.gold += bounty;

        resolve({ winner, loser });
      } else {
        result.innerHTML = `平局！双方不分胜负，各自散去。`;
        resolve({ winner: null, loser: null });
      }

      await new Promise(r => setTimeout(r, CONFIG.animation.combatPhase3));

      confirmBtn.style.display = 'inline-block';
      confirmBtn.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
        }, 300);
      });

      if (!attacker.isHuman && !defender.isHuman) {
        setTimeout(() => {
          confirmBtn.click();
        }, CONFIG.animation.dialogAutoClose);
      }
    });
  },

  async selectGeneral(player, availableGenerals) {
    if (!player.isHuman || availableGenerals.length === 0) {
      return availableGenerals.reduce((best, g) =>
        g.might > best.might ? g : best, availableGenerals[0]);
    }

    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const dialog = document.createElement('div');
      dialog.className = 'pixel-dialog pixel-panel bounce-in';
      dialog.style.cssText = `
        background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
        border:4px solid #8B6914;
        border-radius:20px;
        min-width:500px;
      `;

      let html = `
        <div style="text-align:center;margin-bottom:20px;">
          <h2 style="font-size:22px;color:#3D3425;text-shadow:1px 1px 2px rgba(255,255,255,0.8);">选择出战武将</h2>
        </div>
      `;
      html += `<div style="display:flex;gap:20px;margin:25px 0;justify-content:center;flex-wrap:wrap;">`;

      availableGenerals.forEach(g => {
        const cardBg = g.faction === 'wei' ? 'var(--card-bg-wei)' :
                       g.faction === 'shu' ? 'var(--card-bg-shu)' :
                       g.faction === 'wu' ? 'var(--card-bg-wu)' : 'var(--card-bg-qun)';
        html += `
          <div class="general-card-painterly" style="width:130px;text-align:center;cursor:pointer;padding:15px;background:${cardBg};" data-id="${g.id}">
            <div class="general-portrait-painterly bg-${g.faction}" style="background:linear-gradient(145deg, var(--${g.faction}-color), color-mix(in srgb, var(--${g.faction}-color) 60%, #333));width:70px;height:70px;margin:0 auto 10px;">
              <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                ${g.name[0]}
              </div>
            </div>
            <div style="font-weight:bold;font-size:14px;color:#3D3425;">${g.name}</div>
            <div style="font-size:12px;color:#7D6E57;margin-top:4px;">⚔️ ${g.might}</div>
          </div>
        `;
      });

      html += `</div>`;
      dialog.innerHTML = html;

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      dialog.querySelectorAll('.general-card-painterly').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          const general = availableGenerals.find(g => g.id === id);

          dialog.classList.add('fade-out');
          overlay.classList.add('fade-out');
          setTimeout(() => {
            overlay.remove();
            resolve(general);
          }, 300);
        });
      });
    });
  },
};
