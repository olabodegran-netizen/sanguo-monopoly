const Board = {
  getBoardLayout(total) {
    const halfPerim = (total + 4) / 2;
    const cols = Math.ceil(halfPerim / 2);
    const rows = halfPerim - cols;
    return { cols, rows };
  },

  render(container, cells, players, gameState) {
    const total = cells.length;
    const { cols, rows } = this.getBoardLayout(total);

    const maxBoardPx = 820;
    const cellSize = Math.floor(Math.min(maxBoardPx / cols, maxBoardPx / rows));
    const hexWidth = cellSize;
    const hexHeight = cellSize * 0.85;
    const boardW = (cols + 1.2) * hexWidth + 100;
    const boardH = (rows + 0.9) * hexHeight + 80;

    container.innerHTML = '';

    // 卡通風格地圖背景 - 淺色木質/地圖卷軸
    container.style.cssText = `
      position:relative;
      width:${boardW}px;
      height:${boardH}px;
      margin:0 auto;
      background:
        radial-gradient(ellipse at 50% 50%, rgba(255,248,230,0.95) 0%, rgba(210,180,140,0.9) 100%);
      border-radius: 20px;
      box-shadow:
        0 0 0 6px #5D4E37,
        0 0 0 12px #8B7355,
        0 8px 32px rgba(0,0,0,0.4),
        inset 0 0 100px rgba(139,115,85,0.2);
      padding: 20px 50px 40px;
      border: 12px solid transparent;
      overflow:visible;
    `;

    // 添加卡通雲朵裝飾
    const clouds = [
      { x: 10, y: 5, scale: 1 },
      { x: 60, y: 8, scale: 0.7 },
      { x: 85, y: 3, scale: 0.85 },
      { x: 30, y: 12, scale: 0.6 }
    ];
    clouds.forEach(cloud => {
      const cloudDiv = document.createElement('div');
      cloudDiv.style.cssText = `
        position:absolute;
        left:${cloud.x}%;
        top:${cloud.y}%;
        width:80px;
        height:40px;
        background:radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%);
        border-radius:50%;
        transform:scale(${cloud.scale});
        pointer-events:none;
        z-index:1;
      `;
      container.appendChild(cloudDiv);
    });

    // 添加卡通樹叢裝飾
    const trees = [
      { x: 5, y: 85, scale: 0.8 },
      { x: 92, y: 70, scale: 1 },
      { x: 88, y: 90, scale: 0.7 }
    ];
    trees.forEach(tree => {
      const treeDiv = document.createElement('div');
      treeDiv.style.cssText = `
        position:absolute;
        left:${tree.x}%;
        top:${tree.y}%;
        width:50px;
        height:50px;
        pointer-events:none;
        z-index:1;
      `;
      treeDiv.innerHTML = `<svg width="50" height="50" viewBox="0 0 50 50"><ellipse cx="25" cy="20" rx="20" ry="18" fill="#228B22" opacity="0.8"/><ellipse cx="18" cy="25" rx="12" ry="10" fill="#32CD32" opacity="0.7"/><ellipse cx="32" cy="24" rx="14" ry="11" fill="#2E8B2E" opacity="0.75"/><rect x="22" y="35" width="6" height="12" fill="#8B4513"/></svg>`;
      container.appendChild(treeDiv);
    });

    // 地圖標題框 - 卡通卷軸風格
    const mapLabel = document.getElementById('map-title');
    if (mapLabel) {
      mapLabel.textContent = MAPS[window.gameState?.mapKey]?.name || '';
    }

    cells.forEach((cell, idx) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = `board-cell cell-${cell.type}`;
      if (cell.cityTier) cellDiv.classList.add(`cell-city-${cell.cityTier}`);

      const pos = this.getCellPosition(idx, total, cols, rows, cellSize, hexWidth, hexHeight);
      const boardCell = gameState.board[idx];

      const isOwned = boardCell.owner !== null;
      const owner = isOwned ? players[boardCell.owner] : null;
      const isCurrentPlayer = players.some(p => p.position === idx && p.alive && p.isHuman);

      let bgGradient, glowFilter, borderColor, shadowColor;

      // 卡通風格配色方案
      if (cell.type === 'city' && isOwned) {
        const factionGradients = {
          wei: { main: '#6B8FE0', shadow: '#4A70C0' },
          shu: { main: '#E88A6B', shadow: '#C06A4A' },
          wu: { main: '#7AC060', shadow: '#5AA040' },
          other: { main: '#E0B84A', shadow: '#C09830' }
        };
        const colors = factionGradients[owner.faction] || factionGradients.other;
        bgGradient = `radial-gradient(ellipse at 30% 30%, ${colors.main} 0%, ${colors.shadow} 100%)`;
        borderColor = `var(--${owner.faction}-color)`;
        glowFilter = `drop-shadow(0 0 15px ${borderColor})`;
        shadowColor = `rgba(${owner.faction === 'wei' ? '107,143,224' : owner.faction === 'shu' ? '232,138,107' : '122,192,96'}, 0.8)`;
      } else if (cell.type === 'start') {
        bgGradient = `radial-gradient(ellipse at 30% 30%, #FFF8DC 0%, #F5E6B8 50%, #E8D4A0 100%)`;
        borderColor = '#FFD700';
        glowFilter = `drop-shadow(0 0 12px rgba(255,215,0,0.9))`;
        shadowColor = 'rgba(255,215,0,0.5)';
      } else if (cell.type === 'city') {
        const tierGradients = {
          low: { main: '#FFE4B5', shadow: '#DEB887', border: '#D2691E' },
          mid: { main: '#FFB347', shadow: '#FF8C00', border: '#FF4500' },
          high: { main: '#FFD700', shadow: '#FFA500', border: '#FF6347' }
        };
        const colors = tierGradients[cell.cityTier] || tierGradients.low;
        bgGradient = `radial-gradient(ellipse at 30% 30%, ${colors.main} 0%, ${colors.shadow} 100%)`;
        borderColor = colors.border;
        glowFilter = `drop-shadow(0 0 8px ${colors.border}80)`;
        shadowColor = colors.border + '60';
      } else if (cell.type === 'casino') {
        bgGradient = `radial-gradient(ellipse at 30% 30%, #FF69B4 0%, #FF1493 50%, #C71585 100%)`;
        borderColor = '#FFD700';
        glowFilter = `drop-shadow(0 0 15px rgba(255,105,180,0.9))`;
        shadowColor = 'rgba(255,105,180,0.6)';
      } else if (cell.type === 'event') {
        bgGradient = `radial-gradient(ellipse at 30% 30%, #87CEEB 0%, #4169E1 50%, #1E90FF 100%)`;
        borderColor = '#00BFFF';
        glowFilter = `drop-shadow(0 0 12px rgba(65,105,225,0.8))`;
        shadowColor = 'rgba(65,105,225,0.5)';
      } else if (cell.type === 'recruit') {
        bgGradient = `radial-gradient(ellipse at 30% 30%, #FFA07A 0%, #FF6347 50%, #DC143C 100%)`;
        borderColor = '#FF4500';
        glowFilter = `drop-shadow(0 0 12px rgba(255,99,71,0.8))`;
        shadowColor = 'rgba(255,99,71,0.5)';
      } else {
        bgGradient = `radial-gradient(ellipse at 30% 30%, #90EE90 0%, #32CD32 50%, #228B22 100%)`;
        borderColor = '#228B22';
        glowFilter = `drop-shadow(0 0 8px rgba(50,205,50,0.6))`;
        shadowColor = 'rgba(50,205,50,0.4)';
      }

      // 卡通六邊形格子
      cellDiv.style.cssText = `
        position:absolute;
        left:${pos.x}px;
        top:${pos.y}px;
        width:${hexWidth * 0.9}px;
        height:${hexHeight * 0.95}px;
        background:${bgGradient};
        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        font-size:11px;
        text-align:center;
        padding:4px;
        overflow:hidden;
        transition: all 0.2s ease;
        cursor:pointer;
        box-shadow:
          0 4px 12px ${shadowColor},
          inset 0 2px 4px rgba(255,255,255,0.5),
          inset 0 -2px 4px rgba(0,0,0,0.2);
        filter:${glowFilter};
        border:3px solid ${borderColor};
        z-index:2;
      `;

      // 當前玩家高亮效果
      if (isCurrentPlayer) {
        cellDiv.style.boxShadow = `
          0 0 0 5px #FFD700,
          0 0 25px rgba(255,215,0,1),
          0 4px 12px ${shadowColor};
        `;
        cellDiv.style.zIndex = '20';
        cellDiv.style.transform = 'scale(1.1)';
      }

      const icon = this.getCellIcon(cell.type);
      const iconSize = cellSize < 70 ? '14px' : '22px';
      const nameSize = cellSize < 70 ? '7px' : '10px';
      let content = `<div style="font-size:${iconSize};margin-bottom:1px;filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.3));">${icon}</div>`;
      content += `<div style="font-size:${nameSize};color:#FFF;font-weight:bold;text-shadow:1px 1px 2px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5);line-height:1.2;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cell.name}</div>`;

      if (cell.type === 'city' && isOwned) {
        content += `<div style="font-size:${cellSize < 70 ? '6px' : '9px'};margin-top:2px;color:#FFD700;font-weight:bold;text-shadow:1px 1px 2px rgba(0,0,0,0.8);">★Lv${boardCell.level}★</div>`;
      }

      cellDiv.innerHTML = content;

      // 武將/玩家棋子容器
      const piecesContainer = document.createElement('div');
      piecesContainer.className = 'pieces-container';
      piecesContainer.style.cssText = `
        position:absolute;
        bottom:${hexHeight * 0.12}px;
        left:50%;
        transform:translateX(-50%);
        display:flex;
        gap:3px;
        z-index:15;
      `;

      const pieceSize = cellSize < 70 ? 16 : 22;
      players.forEach((p) => {
        if (p.position === idx && p.alive) {
          const piece = document.createElement('div');
          piece.className = `player-piece bg-${p.faction}`;
          const isLord = p.generals?.some(g => g.isLord);
          piece.style.cssText = `
            width:${pieceSize}px;
            height:${pieceSize}px;
            background: radial-gradient(circle at 30% 30%, var(--${p.faction}-color), color-mix(in srgb, var(--${p.faction}-color) 40%, black));
            border:3px solid ${isLord ? '#FFD700' : '#FFF'};
            border-radius:50%;
            box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4);
            ${isLord ? `box-shadow: 0 0 12px #FFD700, 0 3px 8px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4);` : ''}
          `;
          if (isLord) {
            piece.style.animation = 'lordPulse 1.5s ease-in-out infinite';
          }
          piecesContainer.appendChild(piece);
        }
      });

      cellDiv.appendChild(piecesContainer);

      cellDiv.addEventListener('mouseenter', (e) => {
        Board.showCellTooltip(e, cell, boardCell);
      });

      cellDiv.addEventListener('mouseleave', () => {
        Board.hideCellTooltip();
      });

      container.appendChild(cellDiv);
    });

    // 動畫樣式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes lordPulse {
        0%, 100% {
          box-shadow: 0 0 12px #FFD700, 0 3px 8px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 20px #FFD700, 0 0 30px rgba(255,215,0,0.6), 0 3px 8px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4);
          transform: scale(1.1);
        }
      }
      @keyframes floatCloud {
        0%, 100% { transform: translateX(0) scale(1); }
        50% { transform: translateX(20px) scale(1.05); }
      }
      @keyframes waveEffect {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  },

  showCellTooltip(event, cell, boardCell) {
    let tooltip = document.getElementById('cell-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'cell-tooltip';
      tooltip.style.cssText = `
        position:fixed;
        z-index:2000;
        background: linear-gradient(180deg, #FFF8DC 0%, #FFE4B5 50%, #DEB887 100%);
        border:4px solid #8B4513;
        border-radius:16px;
        padding:14px 18px;
        max-width:300px;
        box-shadow:0 8px 24px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.5);
        pointer-events:none;
        font-size:14px;
        color:#3D3425;
        line-height:1.6;
      `;
      document.body.appendChild(tooltip);
    }

    // 卡通卷軸風格標題
    let content = `<div style="font-weight:bold;font-size:18px;margin-bottom:8px;border-bottom:3px solid #8B4513;padding-bottom:8px;color:#8B4513;text-shadow:1px 1px 0 rgba(255,255,255,0.5);">📜 ${cell.name}</div>`;
    content += `<div style="font-size:13px;color:#5D4E37;margin-bottom:10px;font-style:italic;">"${cell.desc}"</div>`;

    if (cell.type === 'city') {
      const tierNames = { low: '🏘️ 初级城', mid: '🏯 中级城', high: '🏰 高级城' };
      const tierName = tierNames[cell.cityTier] || '';
      const toll = CONFIG.cityTiers[cell.cityTier].toll[boardCell.level - 1];
      const buyCost = CONFIG.cityTiers[cell.cityTier].buy;

      if (boardCell.owner !== null) {
        const owner = window.gameState.players[boardCell.owner];
        content += `<div style="font-size:12px;color:#5D4E37;margin-top:8px;padding:10px;background:rgba(139,115,85,0.15);border-radius:10px;border:2px dashed #8B4513;">`;
        content += `<div>👑 统治者：<span style="color:var(--${owner.faction}-color);font-weight:bold;font-size:15px;">${owner.name}</span></div>`;
        content += `<div>⭐ 等级：<strong>Lv${boardCell.level}</strong>（${tierName}）</div>`;
        content += `<div>💰 过路费：<strong>${toll}G</strong></div>`;
        if (boardCell.garrison && boardCell.garrison.length > 0) {
          const garr = boardCell.garrison[0];
          const bonus = garr.intellect >= 90 ? '+150G 🎯' : garr.intellect >= 80 ? '+100G ✨' : '无';
          content += `<div>⚔️ 守将：${garr.name}（智力${garr.intellect}，加成${bonus}）</div>`;
        }
        content += `</div>`;
      } else {
        content += `<div style="font-size:12px;color:#5D4E37;margin-top:8px;padding:10px;background:rgba(139,115,85,0.15);border-radius:10px;border:2px dashed #8B4513;">`;
        content += `<div>📍 状态：<span style="color:#DC143C;font-weight:bold;">无人占领</span></div>`;
        content += `<div>⭐ 等级：<strong>Lv1</strong>（${tierName}）</div>`;
        content += `<div>💵 购买费用：<strong style="color:#228B22;">${buyCost}G</strong></div>`;
        content += `<div>💰 过路费：<strong>${toll}G</strong></div>`;
        content += `</div>`;
      }
    }

    tooltip.innerHTML = content;
    tooltip.style.display = 'block';

    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 20}px`;
    tooltip.style.top = `${rect.top}px`;

    if (rect.right + 320 > window.innerWidth) {
      tooltip.style.left = `${rect.left - 310}px`;
    }
    if (rect.top + 220 > window.innerHeight) {
      tooltip.style.top = `${window.innerHeight - 230}px`;
    }
  },

  hideCellTooltip() {
    const tooltip = document.getElementById('cell-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  },

  getCellPosition(idx, total, cols, rows, cellSize, hexWidth, hexHeight) {
    const side1 = cols;
    const side2 = cols + rows - 1;
    const side3 = cols + rows - 1 + cols - 1;

    let gridX, gridY;

    if (idx < side1) {
      gridX = idx;
      gridY = rows - 1;
    } else if (idx < side2) {
      gridX = cols - 1;
      gridY = rows - 1 - (idx - side1 + 1);
    } else if (idx < side3) {
      gridX = cols - 1 - (idx - side2 + 1);
      gridY = 0;
    } else {
      gridX = 0;
      gridY = idx - side3 + 1;
    }

    const offsetX = (gridY % 2) * (hexWidth * 0.42);
    return {
      x: 50 + gridX * hexWidth * 0.88 + offsetX,
      y: 20 + gridY * hexHeight * 0.85
    };
  },

  getCellIcon(type) {
    // 卡通風格圖標
    const icons = {
      start: `<svg width="26" height="26" viewBox="0 0 50 50">
        <polygon points="25,3 32,18 48,20 37,32 40,48 25,40 10,48 13,32 2,20 18,18" fill="#FFD700" stroke="#FF8C00" stroke-width="2"/>
        <polygon points="25,10 29,20 40,21 33,28 35,39 25,34 15,39 17,28 10,21 21,20" fill="#FFF8DC"/>
      </svg>`,
      city: `<svg width="26" height="26" viewBox="0 0 50 50">
        <rect x="8" y="20" width="34" height="28" rx="2" fill="#DEB887" stroke="#8B4513" stroke-width="2"/>
        <polygon points="5,22 25,5 45,22" fill="#CD853F" stroke="#8B4513" stroke-width="2"/>
        <rect x="14" y="28" width="8" height="10" fill="#8B4513"/>
        <rect x="28" y="28" width="8" height="10" fill="#8B4513"/>
        <rect x="20" y="36" width="10" height="12" fill="#8B4513"/>
        <circle cx="25" cy="15" r="3" fill="#FFD700"/>
      </svg>`,
      empty: `<svg width="26" height="26" viewBox="0 0 50 50">
        <ellipse cx="25" cy="30" rx="18" ry="14" fill="#90EE90" stroke="#228B22" stroke-width="2"/>
        <ellipse cx="18" cy="26" rx="8" ry="6" fill="#98FB98"/>
        <ellipse cx="32" cy="28" rx="7" ry="5" fill="#32CD32"/>
        <path d="M25 16 Q28 20 25 24 Q22 20 25 16" fill="#228B22"/>
        <circle cx="35" cy="18" r="4" fill="#FF69B4"/>
        <circle cx="15" cy="20" r="3" fill="#FFA500"/>
      </svg>`,
      casino: `<svg width="26" height="26" viewBox="0 0 50 50">
        <rect x="5" y="10" width="40" height="35" rx="5" fill="#FF69B4" stroke="#C71585" stroke-width="2"/>
        <rect x="10" y="5" width="30" height="10" rx="3" fill="#FF1493"/>
        <circle cx="16" cy="22" r="5" fill="#FFD700"/>
        <circle cx="34" cy="22" r="5" fill="#00BFFF"/>
        <circle cx="16" cy="36" r="5" fill="#00BFFF"/>
        <circle cx="34" cy="36" r="5" fill="#FFD700"/>
        <circle cx="25" cy="29" r="5" fill="#FF6347"/>
      </svg>`,
      event: `<svg width="26" height="26" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="#4169E1" stroke="#1E90FF" stroke-width="3"/>
        <circle cx="25" cy="25" r="15" fill="#87CEEB"/>
        <text x="25" y="32" text-anchor="middle" fill="#FFF" font-size="22" font-weight="bold" stroke="#1E90FF" stroke-width="1">?</text>
      </svg>`,
      recruit: `<svg width="26" height="26" viewBox="0 0 50 50">
        <path d="M10 45 L10 20 L25 5 L40 20 L40 45 Z" fill="#FF6347" stroke="#DC143C" stroke-width="2"/>
        <rect x="20" y="28" width="10" height="12" fill="#8B0000"/>
        <circle cx="25" cy="20" r="5" fill="#FFE4B5" stroke="#DEB887" stroke-width="1"/>
        <path d="M18 15 L25 8 L32 15" fill="none" stroke="#FFD700" stroke-width="2"/>
      </svg>`
    };
    return icons[type] || '❓';
  },

  async animateMove(container, player, fromPos, toPos, cells) {
    const positions = [];
    let current = fromPos;

    while (current !== toPos) {
      current = (current + 1) % cells.length;
      positions.push(current);
    }

    for (const pos of positions) {
      player.position = pos;
      this.render(container, cells, window.gameState.players, window.gameState);
      await new Promise(resolve => setTimeout(resolve, CONFIG.animation.pieceMove));
    }
  },
};
