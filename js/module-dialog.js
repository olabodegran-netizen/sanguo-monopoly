const Dialog = {
  async show({ title, icon = "", text, buttons = [], type = "info", autoClose = false }) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const dialog = document.createElement('div');
      dialog.className = 'pixel-dialog pixel-panel bounce-in';
      dialog.style.cssText = `
        background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
        border:4px solid #8B6914;
        border-radius:20px;
      `;

      let html = `
        <div style="text-align:center;margin-bottom:15px;">
          <h2 style="font-size:22px;color:#3D3425;text-shadow:1px 1px 2px rgba(255,255,255,0.8);">
            ${icon} ${title}
          </h2>
        </div>
      `;
      html += `<div class="dialog-text" style="margin:20px 0;line-height:1.8;min-height:60px;font-size:14px;color:#5D4E37;"></div>`;

      if (buttons.length > 0) {
        html += `<div class="dialog-buttons" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">`;
        buttons.forEach((btn, idx) => {
          html += `<button class="pixel-btn dialog-btn" data-value="${btn.value || idx}" style="${btn.color ? 'background:' + btn.color + ';' : ''}background:linear-gradient(180deg, #FDF6E3 0%, #E8DCC8 100%);">${btn.text}</button>`;
        });
        html += `</div>`;
      }

      dialog.innerHTML = html;
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      const textEl = dialog.querySelector('.dialog-text');
      Anim.typeWriter(textEl, text, 25).then(() => {
        if (autoClose && buttons.length === 0) {
          setTimeout(() => {
            cleanup();
            resolve(null);
          }, CONFIG.animation.dialogAutoClose);
        }
      });

      const cleanup = () => {
        dialog.classList.add('fade-out');
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          dialog.remove();
        }, 300);
      };

      dialog.querySelectorAll('.dialog-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value;
          cleanup();
          resolve(value);
        });
      });
    });
  },

  async showEventCard(event) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const card = document.createElement('div');
      card.className = 'pixel-panel';
      card.style.cssText = `
        width:400px;
        height:300px;
        z-index:1000;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background:linear-gradient(145deg, #7BA3C9 0%, #5B8DB5 100%);
        border:5px solid #3D5A80;
        border-radius:20px;
        box-shadow:0 8px 24px rgba(0,0,0,0.3);
      `;

      card.innerHTML = `
        <div class="card-front" style="font-size:80px;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FFF" stroke="#3D5A80" stroke-width="2"/><text x="12" y="17" text-anchor="middle" fill="#3D5A80" font-size="16" font-weight="bold">?</text></svg>
        </div>
        <div class="card-back" style="display:none;text-align:center;padding:20px;color:#FFF;">
          <h2 style="margin-bottom:15px;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">${event.name}</h2>
          <p style="line-height:1.6;margin-bottom:20px;text-shadow:1px 1px 2px rgba(0,0,0,0.3);">${event.desc}</p>
          <button class="pixel-btn" style="background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);">确认</button>
        </div>
      `;

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      const front = card.querySelector('.card-front');
      const back = card.querySelector('.card-back');

      setTimeout(() => {
        card.classList.add('card-flip');
        setTimeout(() => {
          front.style.display = 'none';
          back.style.display = 'block';

          const bgColor = event.type === 'positive' ? 'linear-gradient(145deg, #6AAF50 0%, #4A8F3A 100%)' :
                          event.type === 'negative' ? 'linear-gradient(145deg, #C97060 0%, #A85050 100%)' :
                          'linear-gradient(145deg, #7BA3C9 0%, #5B8DB5 100%)';
          card.style.background = bgColor;

          back.querySelector('.pixel-btn').addEventListener('click', () => {
            card.classList.add('fade-out');
            overlay.classList.add('fade-out');
            setTimeout(() => {
              card.remove();
              overlay.remove();
              resolve();
            }, 300);
          });
        }, 300);
      }, 500);
    });
  },

  async showRecruitDialog(generals) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const dialog = document.createElement('div');
      dialog.className = 'pixel-dialog pixel-panel bounce-in';
      dialog.style.cssText = `
        min-width:650px;
        background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
        border:4px solid #8B6914;
        border-radius:20px;
      `;

      let html = `
        <div style="text-align:center;margin-bottom:20px;">
          <h2 style="font-size:24px;color:#3D3425;text-shadow:1px 1px 2px rgba(255,255,255,0.8);">
            <svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:8px;"><path d="M12 3L4 8v12h16V8L12 3z" fill="#E8907A" stroke="#8B4513" stroke-width="1.5"/><circle cx="12" cy="10" r="2" fill="#F5E6B8"/></svg>
            招贤馆
          </h2>
          <div style="font-size:13px;color:#7D6E57;margin-top:5px;">选择一名武将加入麾下</div>
        </div>
      `;
      html += `<div style="display:flex;gap:20px;margin:25px 0;justify-content:center;">`;

      generals.forEach(g => {
        const tierLabel = g.tier === 'high' ? '上将' : g.tier === 'mid' ? '中军' : '校尉';
        const tierColor = g.tier === 'high' ? '#FFD700' : g.tier === 'mid' ? '#C0C0C0' : '#CD7F32';
        const cardBg = g.faction === 'wei' ? 'var(--card-bg-wei)' :
                       g.faction === 'shu' ? 'var(--card-bg-shu)' :
                       g.faction === 'wu' ? 'var(--card-bg-wu)' : 'var(--card-bg-qun)';
        const talentHtml = g.talent
          ? `<div class="talent-desc-painterly" style="font-size:10px;color:#8B6914;margin-top:5px;line-height:1.3;">【${g.talent.name}】${formatTalentDesc(g.talent, 1)}</div>`
          : `<div style="font-size:10px;color:#9D8E77;margin-top:5px;">无天赋</div>`;

        html += `
          <div class="general-card-painterly" style="width:160px;background:${cardBg};cursor:pointer;padding:15px;" data-id="${g.id}">
            <div class="general-portrait-painterly bg-${g.faction}" style="background:linear-gradient(145deg, var(--${g.faction}-color), color-mix(in srgb, var(--${g.faction}-color) 60%, #333));">
              <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:36px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                ${g.name[0]}
              </div>
            </div>
            <div class="general-name-painterly" style="font-size:15px;">${g.name}</div>
            <div class="general-tier-painterly">
              <span style="color:${tierColor};font-size:12px;">${tierLabel}</span>
            </div>
            <div class="general-stats-painterly" style="padding:6px;">
              <div class="general-stat-row" style="font-size:12px;">
                <span>⚔️</span>
                <span>${g.might}</span>
              </div>
              <div class="general-stat-row" style="font-size:12px;">
                <span>🧠</span>
                <span>${g.intellect}</span>
              </div>
            </div>
            ${talentHtml}
            <div style="text-align:center;margin-top:8px;">
              <span style="color:#E74C3C;font-weight:bold;font-size:14px;">${g.recruitCost}G</span>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      html += `<div style="text-align:center;"><button class="pixel-btn" data-value="skip" style="padding:10px 30px;">暂且观望</button></div>`;

      dialog.innerHTML = html;
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      const cleanup = () => {
        dialog.classList.add('fade-out');
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          dialog.remove();
        }, 300);
      };

      dialog.querySelectorAll('.general-card-painterly').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          cleanup();
          resolve(id);
        });
      });

      dialog.querySelector('[data-value="skip"]').addEventListener('click', () => {
        cleanup();
        resolve(null);
      });
    });
  },
};
