const SceneGame = {
  gameState: null,
  
  init(container, data) {
    const { humanLord, aiLords, mapKey, mapData, mapConfig } = data;
    
    this.gameState = {
      currentMap: mapData,
      mapKey: mapKey,
      players: [],
      currentPlayerIndex: 0,
      round: 1,
      board: [],
      generalPool: [],
      log: [],
      phase: 'roll',
    };
    
    window.gameState = this.gameState;
    
    this.initializePlayers(humanLord, aiLords, mapConfig);
    this.initializeBoard(mapData);
    this.initializeGeneralPool();
    
    this.render(container);
    this.startTurn();
  },
  
  initializePlayers(humanLord, aiLords, mapConfig) {
    const humanGeneral = JSON.parse(JSON.stringify(humanLord));
    humanGeneral.talentLevel = 1;
    
    let humanStartGold = mapConfig.startGold;
    if (humanLord.name === '袁绍' && humanGeneral.talent) {
      humanStartGold += humanGeneral.talent.values[0];
    }
    
    this.gameState.players.push({
      id: 0,
      name: humanLord.name,
      faction: humanLord.faction,
      isHuman: true,
      gold: humanStartGold,
      position: 0,
      generals: [humanGeneral],
      cities: [],
      generalPoints: 0,
      buffs: [],
      tollShield: 0,
      alive: true,
    });
    
    aiLords.forEach((lord, idx) => {
      const aiGeneral = JSON.parse(JSON.stringify(lord));
      aiGeneral.talentLevel = 1;
      
      let aiStartGold = mapConfig.startGold;
      if (lord.name === '袁绍' && aiGeneral.talent) {
        aiStartGold += aiGeneral.talent.values[0];
      }
      
      this.gameState.players.push({
        id: idx + 1,
        name: lord.name,
        faction: lord.faction,
        isHuman: false,
        gold: aiStartGold,
        position: 0,
        generals: [aiGeneral],
        cities: [],
        generalPoints: 0,
        buffs: [],
        tollShield: 0,
        alive: true,
      });
    });
  },
  
  initializeBoard(mapData) {
    mapData.cells.forEach(cell => {
      this.gameState.board.push({
        ...cell,
        owner: null,
        level: 1,
        garrison: []
      });
    });
  },
  
  initializeGeneralPool() {
    this.gameState.generalPool = GENERALS.filter(g => !g.isLord).map(g => {
      const copy = JSON.parse(JSON.stringify(g));
      copy.talentLevel = 1;
      return copy;
    });
  },
  
  render(container) {
    container.innerHTML = `
      <div style="display:flex;height:100vh;">
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:15px;background:linear-gradient(180deg, #87CEEB 0%, #98D8C8 30%, #7EC8A0 50%, #6BBF6B 100%);">
          <div id="map-title" style="font-size:24px;font-weight:bold;color:#FFF;text-shadow:2px 2px 0 #8B4513, -1px -1px 0 #8B4513, 1px -1px 0 #8B4513, -1px 1px 0 #8B4513;background:linear-gradient(180deg,#CD853F,#8B4513,#CD853F);padding:6px 28px;border-radius:10px;border:3px solid #FFD700;box-shadow:0 3px 10px rgba(0,0,0,0.3);margin-bottom:10px;z-index:10;flex-shrink:0;"></div>
          <div id="board-container" style="flex:1;display:flex;justify-content:center;align-items:flex-start;overflow:auto;"></div>
        </div>

        <div style="width:300px;background:linear-gradient(180deg, #E8DCC8 0%, #DDD0B8 100%);padding:20px;overflow-y:auto;border-left:3px solid #8B7355;box-shadow:-4px 0 12px rgba(0,0,0,0.1);">
          <div class="pixel-panel" style="margin-bottom:20px;padding:15px;background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);">
            <h3 style="margin-bottom:10px;color:#5D4E37;">回合 ${this.gameState.round}</h3>
            <div id="current-player-info"></div>
          </div>

          <div class="pixel-panel" style="margin-bottom:20px;padding:15px;background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);">
            <h3 style="margin-bottom:10px;color:#5D4E37;">玩家状态</h3>
            <div id="players-status"></div>
          </div>

          <div class="pixel-panel" style="padding:15px;background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);">
            <h3 style="margin-bottom:10px;color:#5D4E37;">战况日志</h3>
            <div id="game-log" style="max-height:200px;overflow-y:auto;font-size:11px;color:#5D4E37;"></div>
          </div>

          <div style="margin-top:20px;text-align:center;">
            <button class="pixel-btn" id="roll-dice-btn" style="width:100%;padding:15px;font-size:16px;background:linear-gradient(180deg, #F5D76E 0%, #E8B84A 100%);border-color:#8B6914;">
              🎲 掷骰子
            </button>
          </div>

          <div style="margin-top:10px;display:flex;gap:10px;">
            <button class="pixel-btn" id="general-system-btn" style="flex:1;padding:10px;font-size:13px;">
              ⚔️ 武将
            </button>
            <button class="pixel-btn" id="city-view-btn" style="flex:1;padding:10px;font-size:13px;">
              🏰 城池
            </button>
            <button class="pixel-btn" id="settings-btn" style="flex:1;padding:10px;font-size:13px;">
              ⚙️ 设置
            </button>
          </div>
        </div>
      </div>
    `;
    
    this.updateUI();
    
    document.getElementById('roll-dice-btn').addEventListener('click', () => {
      this.handleRollDice();
    });
    
    document.getElementById('general-system-btn').addEventListener('click', () => {
      this.showGeneralSystem();
    });
    
    document.getElementById('city-view-btn').addEventListener('click', () => {
      this.showCityView();
    });
    
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.showSettings();
    });
  },
  
  updateUI() {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];

    document.getElementById('current-player-info').innerHTML = `
      <div style="font-weight:bold;font-size:16px;margin-bottom:10px;color:#5D4E37;" class="faction-${currentPlayer.faction}">
        ${currentPlayer.name}的回合
      </div>
      <div style="font-size:14px;color:#7D6E57;">💰 金币：<b style="color:#E8B84A;">${currentPlayer.gold}G</b></div>
      <div style="font-size:14px;color:#7D6E57;">🏰 城池：${currentPlayer.cities.length}座</div>
      <div style="font-size:14px;color:#7D6E57;">⚔️ 武将：${currentPlayer.generals.length}名</div>
      <div style="font-size:14px;color:#7D6E57;">⭐ 武将点：<b style="color:#D4A853;">${currentPlayer.generalPoints}</b></div>
    `;

    let statusHtml = '';
    this.gameState.players.forEach(p => {
      if (!p.alive) return;
      const cityBreakdown = this.getPlayerCityBreakdown(p);
      statusHtml += `
        <div style="padding:10px;margin-bottom:8px;background:${p.id === this.gameState.currentPlayerIndex ? 'rgba(232,184,74,0.25)' : 'rgba(255,255,255,0.4)'};border-left:4px solid var(--${p.faction}-color);border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.08);">
          <div style="font-weight:bold;font-size:13px;color:#5D4E37;">${p.name}</div>
          <div style="font-size:11px;color:#7D6E57;margin-top:3px;">💰 ${p.gold}G | 🏰 ${p.cities.length}座</div>
          <div style="font-size:10px;color:#9D8E77;margin-top:2px;">初级${cityBreakdown.low}座 | 中级${cityBreakdown.mid}座 | 高级${cityBreakdown.high}座</div>
        </div>
      `;
    });
    document.getElementById('players-status').innerHTML = statusHtml;

    Board.render(
      document.getElementById('board-container'),
      this.gameState.currentMap.cells,
      this.gameState.players,
      this.gameState
    );
  },

  getPlayerCityBreakdown(player) {
    let low = 0, mid = 0, high = 0;
    player.cities.forEach(pos => {
      const cellData = this.gameState.currentMap.cells[pos];
      if (cellData.cityTier === 'low') low++;
      else if (cellData.cityTier === 'mid') mid++;
      else if (cellData.cityTier === 'high') high++;
    });
    return { low, mid, high };
  },

  getCitySalaryBonus(player) {
    let bonus = 0;
    player.cities.forEach(pos => {
      const cellData = this.gameState.currentMap.cells[pos];
      if (cellData.cityTier === 'low') bonus += 100;
      else if (cellData.cityTier === 'mid') bonus += 150;
      else if (cellData.cityTier === 'high') bonus += 200;
    });
    return bonus;
  },

  async startTurn() {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    
    GameLog.add(`${currentPlayer.name}的回合开始`, 'info');
    this.updateUI();
    
    if (!currentPlayer.isHuman) {
      await new Promise(r => setTimeout(r, 1000));
      this.handleRollDice();
    }
  },
  
  async handleRollDice() {
    const btn = document.getElementById('roll-dice-btn');
    btn.disabled = true;
    
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    const diceResult = await Dice.roll(document.getElementById('board-container'));
    
    GameLog.add(`${currentPlayer.name}掷出了${diceResult}点`, 'info');
    
    const oldPos = currentPlayer.position;
    const newPos = (oldPos + diceResult) % this.gameState.currentMap.cells.length;
    
    const passedStart = newPos < oldPos || (oldPos + diceResult >= this.gameState.currentMap.cells.length);
    
    await Board.animateMove(
      document.getElementById('board-container'),
      currentPlayer,
      oldPos,
      newPos,
      this.gameState.currentMap.cells
    );
    
    if (passedStart) {
      await this.handlePassStart(currentPlayer);
    }
    
    await this.handleLandOn(currentPlayer, newPos);
    
    await this.handleEncounter(currentPlayer, newPos);
    
    this.endTurn();
  },
  
  async handlePassStart(player) {
    let salary = CONFIG.maps[this.gameState.mapKey].salary;
    let bonusDetails = [];

    const cityBonus = this.getCitySalaryBonus(player);
    if (cityBonus > 0) {
      salary += cityBonus;
      bonusDetails.push(`城池加成+${cityBonus}G`);
    }

    const lordGeneral = player.generals.find(g => g.isLord);
    if (lordGeneral && lordGeneral.name === '袁绍' && lordGeneral.talent && lordGeneral.talent.values2) {
      const bonusGold = lordGeneral.talent.values2[lordGeneral.talentLevel - 1];
      salary += bonusGold;
      bonusDetails.push(`天赋【富甲天下】+${bonusGold}G`);
    }

    player.gold += salary;

    let bonusText = bonusDetails.length > 0 ? ` (${bonusDetails.join(', ')})` : '';
    GameLog.add(`${player.name}经过起点，获得俸禄${salary}G${bonusText}`, 'gold');

    if (player.isHuman) {
      const bonusInfo = bonusDetails.length > 0 ? `\n\n${bonusDetails.join('\n')}` : '';
      await Dialog.show({
        title: '经过起点',
        icon: '⭐',
        text: `你经过起点，获得俸禄${salary}G！${bonusInfo}`,
        buttons: [{ text: '确认', value: 'ok' }]
      });
    }
    
    await this.useGeneralPoint(player);
    
    this.updateUI();
  },
  
  async handleLandOn(player, position) {
    const cell = this.gameState.board[position];
    const cellData = this.gameState.currentMap.cells[position];
    
    GameLog.add(`${player.name}停在了${cellData.name}`, 'info');
    
    switch (cellData.type) {
      case 'start':
        await this.handleStart(player, position);
        break;
      case 'city':
        await this.handleCity(player, position);
        break;
      case 'empty':
        await this.handleEmpty(player, position);
        break;
      case 'casino':
        await this.handleCasino(player);
        break;
      case 'event':
        await this.handleEvent(player, position);
        break;
      case 'recruit':
        await this.handleRecruit(player);
        break;
    }
    
    this.updateUI();
  },
  
  async handleStart(player, position) {
    const cellData = this.gameState.currentMap.cells[position];
    const mapInfo = MAPS[this.gameState.mapKey];
    const desc = `${mapInfo.desc}\n\n${cellData.desc}`;

    if (player.isHuman) {
      await Dialog.show({
        title: `${cellData.name}`,
        icon: '⭐',
        text: desc,
        buttons: [{ text: '确认', value: 'ok' }]
      });
    }
  },
  
  async handleCity(player, position) {
    const cell = this.gameState.board[position];
    const cellData = this.gameState.currentMap.cells[position];

    if (cell.owner === null) {
      const cost = CONFIG.cityTiers[cellData.cityTier].buy;

      let shouldBuy = false;
      if (player.isHuman) {
        if (player.gold >= cost) {
          const result = await Dialog.show({
            title: `购买${cellData.name}`,
            icon: '🏰',
            text: `这是一座无主的${cellData.cityTier === 'low' ? '初级' : cellData.cityTier === 'mid' ? '中级' : '高级'}城池。购买费用：${cost}G。是否购买？`,
            buttons: [
              { text: `购买(${cost}G)`, value: 'buy', color: '#90EE90' },
              { text: '放弃', value: 'skip' }
            ]
          });
          shouldBuy = result === 'buy';
        } else {
          await Dialog.show({
            title: `${cellData.name}`,
            icon: '🏰',
            text: `这是一座无主城池，但你的金币不足以购买（需要${cost}G）。`,
            buttons: [{ text: '确认', value: 'ok' }]
          });
        }
      } else {
        shouldBuy = AI.decideBuyCity(player, cellData, cost);
      }

      if (shouldBuy && player.gold >= cost) {
        player.gold -= cost;
        cell.owner = player.id;
        cell.garrison = [];
        player.cities.push(position);
        GameLog.add(`${player.name}购买了${cellData.name}`, 'gold');

        await this.handleAssignGarrison(player, cell, cellData);
      }
    } else if (cell.owner === player.id) {
      if (cell.level < 3) {
        const upgradeCost = CONFIG.cityTiers[cellData.cityTier].upgradeCost[cell.level - 1];

        let shouldUpgrade = false;
        if (player.isHuman) {
          if (player.gold >= upgradeCost) {
            const result = await Dialog.show({
              title: `升级${cellData.name}`,
              icon: '🏰',
              text: `你的城池${cellData.name}当前等级Lv${cell.level}。升级到Lv${cell.level + 1}需要${upgradeCost}G。是否升级？`,
              buttons: [
                { text: `升级(${upgradeCost}G)`, value: 'upgrade', color: '#90EE90' },
                { text: '放弃', value: 'skip' }
              ]
            });
            shouldUpgrade = result === 'upgrade';
          } else {
            await Dialog.show({
              title: `${cellData.name}`,
              icon: '🏰',
              text: `这是你的城池，但金币不足以升级（需要${upgradeCost}G）。`,
              buttons: [{ text: '确认', value: 'ok' }]
            });
          }
        } else {
          shouldUpgrade = AI.decideUpgradeCity(player, upgradeCost);
        }

        if (shouldUpgrade && player.gold >= upgradeCost) {
          player.gold -= upgradeCost;
          cell.level++;
          GameLog.add(`${player.name}将${cellData.name}升级到Lv${cell.level}`, 'gold');
        }
      } else {
        if (player.isHuman) {
          await Dialog.show({
            title: `${cellData.name}`,
            icon: '🏰',
            text: `这是你的城池，已达到最高等级Lv3。`,
            buttons: [{ text: '确认', value: 'ok' }]
          });
        }
      }

      await this.handleAssignGarrison(player, cell, cellData);
    } else {
      const owner = this.gameState.players[cell.owner];
      const baseToll = CONFIG.cityTiers[cellData.cityTier].toll[cell.level - 1];

      let intellectBonus = 0;
      if (cell.garrison && cell.garrison.length > 0) {
        const garrisonGeneral = cell.garrison[0];
        if (garrisonGeneral.intellect >= 90) {
          intellectBonus = CONFIG.intellectBonus.bonus2;
        } else if (garrisonGeneral.intellect >= 80) {
          intellectBonus = CONFIG.intellectBonus.bonus1;
        }
      }
      const toll = baseToll + intellectBonus;

      let shouldFight = false;
      let selectedGeneral = null;

      if (player.generals.length > 0) {
        if (player.isHuman) {
          const garrisonInfo = cell.garrison && cell.garrison.length > 0
            ? `\n守将：${cell.garrison[0].name}（智力${cell.garrison[0].intellect}）${intellectBonus > 0 ? `，过路费+${intellectBonus}G` : '（智力不足80，无加成）'}`
            : '';
          const result = await Dialog.show({
            title: `${cellData.name}`,
            icon: '🏰',
            text: `这是${owner.name}的城池（Lv${cell.level}）。过路费：${toll}G${garrisonInfo}\n\n单挑胜利可免200G，失败额外交200G！`,
            buttons: [
              { text: '单挑', value: 'fight', color: '#FFB6C1' },
              { text: `支付${toll}G`, value: 'pay' }
            ]
          });
          shouldFight = result === 'fight';
        } else {
          const decision = AI.decideCombat(player, owner.generals[0]);
          shouldFight = decision.fight;
          selectedGeneral = decision.general;
        }
      }

      if (shouldFight) {
        if (!selectedGeneral) {
          selectedGeneral = await Combat.selectGeneral(player, player.generals);
        }
        const defenderGeneral = cell.garrison && cell.garrison.length > 0
          ? cell.garrison[0]
          : owner.generals[0];

        const combatResult = await Combat.executeCityCombat(player, owner, selectedGeneral, defenderGeneral, toll);

        if (combatResult.winner === player) {
          GameLog.add(`${player.name}单挑击败${owner.name}守将${defenderGeneral.name}，免交200G过路费`, 'combat');
        } else if (combatResult.winner === owner) {
          GameLog.add(`${player.name}单挑败给${owner.name}守将${defenderGeneral.name}，额外支付200G`, 'combat');
        } else {
          player.gold -= toll;
          owner.gold += toll;
          GameLog.add(`${player.name}单挑平局，支付${toll}G过路费给${owner.name}`, 'gold');
        }
      } else {
        player.gold -= toll;
        owner.gold += toll;
        const bonusText = intellectBonus > 0 ? `（含智力加成${intellectBonus}G）` : '';
        GameLog.add(`${player.name}支付${toll}G过路费给${owner.name}${bonusText}`, 'gold');
      }
    }
  },

  async handleAssignGarrison(player, cell, cellData) {
    const maxGenerals = CONFIG.cityTiers[cellData.cityTier].maxGenerals;
    if (maxGenerals === 0) return;

    const availableGenerals = player.generals.filter(g => {
      return !player.cities.some(pos => {
        const boardCell = this.gameState.board[pos];
        return boardCell.garrison && boardCell.garrison.some(garr => garr.id === g.id);
      });
    });

    if (availableGenerals.length === 0) return;

    const currentGarrison = cell.garrison || [];
    if (currentGarrison.length >= maxGenerals) return;

    if (player.isHuman) {
      const canAssign = maxGenerals - currentGarrison.length;
      if (canAssign <= 0) return;

      const generalsHtml = availableGenerals.slice(0, 3).map(g => `
        <div class="general-garrison-card pixel-panel" style="width:120px;text-align:center;cursor:pointer;padding:10px;" data-id="${g.id}">
          <div class="bg-${g.faction}" style="width:60px;height:60px;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:28px;border:3px solid #333;">
            ${g.name[0]}
          </div>
          <div style="font-weight:bold;font-size:13px;">${g.name}</div>
          <div style="font-size:11px;">武力:${g.might} 智力:${g.intellect}</div>
        </div>
      `).join('');

      const result = await Dialog.show({
        title: `派驻武将到${cellData.name}`,
        icon: '⚔️',
        text: `城池可派驻${maxGenerals}名武将。当前驻守：${currentGarrison.length}/${maxGenerals}\n选择武将派驻（智力≥80可提升过路费）：`,
        buttons: availableGenerals.length > 0
          ? [{ text: '选择武将', value: 'assign' }, { text: '暂不派驻', value: 'skip' }]
          : [{ text: '确认', value: 'ok' }]
      });

      if (result === 'assign') {
        const selectedId = await this.selectGarrisonGeneral(availableGenerals.slice(0, 3));
        if (selectedId) {
          const general = availableGenerals.find(g => g.id === selectedId);
          cell.garrison = cell.garrison || [];
          cell.garrison.push(general);
          GameLog.add(`${player.name}派驻${general.name}守城${cellData.name}（智力${general.intellect}）`, 'info');
        }
      }
    }
  },

  async selectGarrisonGeneral(availableGenerals) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';

      const dialog = document.createElement('div');
      dialog.className = 'pixel-dialog pixel-panel bounce-in';
      dialog.style.minWidth = '450px';

      let html = `<h2 style="text-align:center;">选择派驻武将</h2>`;
      html += `<div style="display:flex;gap:15px;margin:20px 0;justify-content:center;flex-wrap:wrap;">`;

      availableGenerals.forEach(g => {
        const intellectBonus = g.intellect >= 90 ? '（智力加成+150G）' : g.intellect >= 80 ? '（智力加成+100G）' : '（智力不足80）';
        html += `
          <div class="general-garrison-card pixel-panel" style="width:130px;text-align:center;cursor:pointer;padding:12px;" data-id="${g.id}">
            <div class="bg-${g.faction}" style="width:60px;height:60px;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:28px;border:3px solid #333;">
              ${g.name[0]}
            </div>
            <div style="font-weight:bold;font-size:13px;">${g.name}</div>
            <div style="font-size:11px;">武力:${g.might} 智力:${g.intellect}</div>
            <div style="font-size:10px;color:#B8860B;margin-top:3px;">${intellectBonus}</div>
          </div>
        `;
      });

      html += `</div>`;
      dialog.innerHTML = html;
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      const cleanup = () => {
        dialog.classList.add('fade-out');
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
        }, 300);
      };

      dialog.querySelectorAll('.general-garrison-card').forEach(card => {
        card.addEventListener('click', () => {
          cleanup();
          resolve(card.dataset.id);
        });
      });
    });
  },
  
  async handleEmpty(player, position) {
    const cellData = this.gameState.currentMap.cells[position];

    if (player.isHuman) {
      await Dialog.show({
        title: `${cellData.name}`,
        icon: '🌿',
        text: cellData.desc,
        buttons: [{ text: '确认', value: 'ok' }]
      });
    }
  },
  
  async handleCasino(player) {
    let choice = 'pass';
    
    if (player.isHuman) {
      const result = await Dialog.show({
        title: '赌场',
        icon: '🎲',
        text: `欢迎来到赌场！猜大小，猜对翻倍！小注${CONFIG.casino.smallBet}G，大注${CONFIG.casino.bigBet}G。`,
        buttons: [
          { text: `小注(${CONFIG.casino.smallBet}G)`, value: 'small' },
          { text: `大注(${CONFIG.casino.bigBet}G)`, value: 'big' },
          { text: '不赌了', value: 'pass' }
        ]
      });
      choice = result;
    } else {
      choice = AI.decideCasino(player);
    }
    
    if (choice !== 'pass') {
      const bet = choice === 'small' ? CONFIG.casino.smallBet : CONFIG.casino.bigBet;
      
      if (player.gold < bet) {
        if (player.isHuman) {
          await Dialog.show({
            title: '赌场',
            icon: '🎲',
            text: '金币不足，无法下注。',
            buttons: [{ text: '确认', value: 'ok' }]
          });
        }
        return;
      }
      
      const guess = player.isHuman ? await Dialog.show({
        title: '猜大小',
        icon: '🎲',
        text: '请选择大（4-6）或小（1-3）：',
        buttons: [
          { text: '大', value: 'big' },
          { text: '小', value: 'small' }
        ]
      }) : (Math.random() < 0.5 ? 'big' : 'small');
      
      const dice = Math.floor(Math.random() * 6) + 1;
      const actual = dice >= 4 ? 'big' : 'small';
      const won = guess === actual;
      
      if (won) {
        const winAmount = bet * CONFIG.casino.winMultiplier;
        player.gold += winAmount;
        GameLog.add(`${player.name}在赌场赢得${winAmount}G`, 'gold');
        
        let bonusText = '';
        if (dice % 2 === 0) {
          bonusText = '\n额外奖励：掷出双数，获得1点武将点数！';
        }
        
        if (player.isHuman) {
          await Dialog.show({
            title: '赌场结果',
            icon: '🎲',
            text: `骰子点数：${dice}（${actual === 'big' ? '大' : '小'}）\n恭喜！你赢了${winAmount}G！${bonusText}`,
            buttons: [{ text: '确认', value: 'ok' }]
          });
        }
        
        if (dice % 2 === 0) {
          GameLog.add(`${player.name}掷出双数，获得1点武将点数`, 'info');
          await this.useGeneralPoint(player);
        }
      } else {
        player.gold -= bet;
        GameLog.add(`${player.name}在赌场输掉${bet}G`, 'gold');
        
        if (player.isHuman) {
          await Dialog.show({
            title: '赌场结果',
            icon: '🎲',
            text: `骰子点数：${dice}（${actual === 'big' ? '大' : '小'}）\n很遗憾，你输了${bet}G。`,
            buttons: [{ text: '确认', value: 'ok' }]
          });
        }
      }
    }
  },
  
  async handleEvent(player, position) {
    const cellData = this.gameState.currentMap.cells[position];
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const eventData = { ...event, name: cellData.name, desc: cellData.desc };

    if (player.isHuman) {
      await Dialog.showEventCard(eventData);
    }

    GameLog.add(`${player.name}来到${cellData.name}：${eventData.desc.substring(0, 15)}...`, 'info');

    switch (event.effect.type) {
      case 'gold':
        player.gold += event.effect.value;
        break;
      case 'generalPoints':
        const points = event.effect.value;
        for (let i = 0; i < points; i++) {
          await this.useGeneralPoint(player);
        }
        break;
      case 'none':
        break;
    }
  },
  
  async handleRecruit(player) {
    const available = this.gameState.generalPool
      .filter(g => g.faction === player.faction || Math.random() < 0.3)
      .slice(0, 3);
    
    if (available.length === 0) {
      if (player.isHuman) {
        await Dialog.show({
          title: '招募屋',
          icon: '🏠',
          text: '招募屋空无一人，没有武将可招募。',
          buttons: [{ text: '确认', value: 'ok' }]
        });
      }
      return;
    }
    
    let selectedId = null;
    
    if (player.isHuman) {
      selectedId = await Dialog.showRecruitDialog(available);
    } else {
      const selected = AI.decideRecruit(player, available, (p, g) => g.recruitCost);
      selectedId = selected ? selected.id : null;
    }
    
    if (selectedId) {
      const general = available.find(g => g.id === selectedId);
      const cost = general.recruitCost;
      
      if (player.gold >= cost) {
        player.gold -= cost;
        player.generals.push(general);
        
        const poolIndex = this.gameState.generalPool.findIndex(g => g.id === selectedId);
        if (poolIndex !== -1) {
          this.gameState.generalPool.splice(poolIndex, 1);
        }
        
        GameLog.add(`${player.name}招募了${general.name}`, 'info');
        
      } else {
        if (player.isHuman) {
          await Dialog.show({
            title: '招募失败',
            icon: '🏠',
            text: `金币不足，无法招募${general.name}（需要${cost}G）。`,
            buttons: [{ text: '确认', value: 'ok' }]
          });
        }
      }
    }
  },
  
  async useGeneralPoint(player) {
    if (player.isHuman) {
      const result = await Dialog.show({
        title: '武将点数',
        icon: '⭐',
        text: '你获得了1点武将点数！请选择如何使用：',
        buttons: [
          { text: '提升武将属性', value: 'stat' },
          { text: '升级武将天赋', value: 'talent' }
        ]
      });
      
      if (result === 'stat') {
        const generalId = await this.selectGeneralForUpgrade(player, 'stat');
        if (generalId) {
          const general = player.generals.find(g => g.id === generalId);
          const statChoice = await Dialog.show({
            title: `提升${general.name}的属性`,
            icon: '⚔️',
            text: `当前武力：${general.might}，智力：${general.intellect}\n选择要提升的属性（+${CONFIG.generalPoints.statPerPoint}）：`,
            buttons: [
              { text: '武力', value: 'might' },
              { text: '智力', value: 'intellect' }
            ]
          });
          
          if (statChoice === 'might') {
            general.might += CONFIG.generalPoints.statPerPoint;
            GameLog.add(`${general.name}的武力提升至${general.might}`, 'info');
          } else {
            general.intellect += CONFIG.generalPoints.statPerPoint;
            GameLog.add(`${general.name}的智力提升至${general.intellect}`, 'info');
          }
        }
      } else if (result === 'talent') {
        const eligibleGenerals = player.generals.filter(g => g.talent && (!g.talentLevel || g.talentLevel < 3));
        
        if (eligibleGenerals.length === 0) {
          await Dialog.show({
            title: '无法升级天赋',
            icon: '⭐',
            text: '没有可升级天赋的武将（需要高级或中级武将，且天赋未满级）。自动转为属性提升。',
            buttons: [{ text: '确认', value: 'ok' }]
          });
          
          const generalId = await this.selectGeneralForUpgrade(player, 'stat');
          if (generalId) {
            const general = player.generals.find(g => g.id === generalId);
            const statChoice = await Dialog.show({
              title: `提升${general.name}的属性`,
              icon: '⚔️',
              text: `选择要提升的属性（+${CONFIG.generalPoints.statPerPoint}）：`,
              buttons: [
                { text: '武力', value: 'might' },
                { text: '智力', value: 'intellect' }
              ]
            });
            
            if (statChoice === 'might') {
              general.might += CONFIG.generalPoints.statPerPoint;
            } else {
              general.intellect += CONFIG.generalPoints.statPerPoint;
            }
          }
        } else {
          const generalId = await this.selectGeneralForUpgrade(player, 'talent', eligibleGenerals);
          if (generalId) {
            const general = player.generals.find(g => g.id === generalId);
            if (!general.talentLevel) general.talentLevel = 1;
            general.talentLevel++;
            GameLog.add(`${general.name}的天赋【${general.talent.name}】升级至Lv${general.talentLevel}`, 'info');
            
            await Dialog.show({
              title: '天赋升级',
              icon: '✨',
              text: `${general.name}的天赋【${general.talent.name}】升级至Lv${general.talentLevel}！\n效果：${formatTalentDesc(general.talent, general.talentLevel)}`,
              buttons: [{ text: '确认', value: 'ok' }]
            });
          }
        }
      }
    } else {
      const decision = AI.useGeneralPoints(player);
      if (decision) {
        if (decision.type === 'stat') {
          decision.target[decision.stat] += CONFIG.generalPoints.statPerPoint;
          GameLog.add(`${player.name}提升了${decision.target.name}的${decision.stat === 'might' ? '武力' : '智力'}`, 'info');
        } else if (decision.type === 'talent') {
          if (!decision.target.talentLevel) decision.target.talentLevel = 1;
          decision.target.talentLevel++;
          GameLog.add(`${player.name}升级了${decision.target.name}的天赋至Lv${decision.target.talentLevel}`, 'info');
        }
      }
    }
  },
  
  async selectGeneralForUpgrade(player, type, eligibleGenerals = null) {
    const generals = eligibleGenerals || player.generals;

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

      let html = `<h2 style="text-align:center;font-size:20px;color:#3D3425;margin-bottom:15px;">选择武将${type === 'stat' ? '提升属性' : '升级天赋'}</h2>`;
      html += `<div style="display:flex;gap:18px;margin:20px 0;justify-content:center;flex-wrap:wrap;">`;

      generals.forEach(g => {
        const cardBg = g.faction === 'wei' ? 'var(--card-bg-wei)' :
                       g.faction === 'shu' ? 'var(--card-bg-shu)' :
                       g.faction === 'wu' ? 'var(--card-bg-wu)' : 'var(--card-bg-qun)';
        html += `
          <div class="general-card-painterly" style="width:130px;text-align:center;cursor:pointer;padding:15px;background:${cardBg};" data-id="${g.id}">
            <div class="general-portrait-painterly bg-${g.faction}" style="background:linear-gradient(145deg, var(--${g.faction}-color), color-mix(in srgb, var(--${g.faction}-color) 60%, #333));width:65px;height:65px;margin:0 auto 10px;">
              <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:30px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                ${g.name[0]}
              </div>
            </div>
            <div style="font-weight:bold;font-size:14px;color:#3D3425;">${g.name}</div>
            <div style="font-size:12px;color:#7D6E57;margin-top:4px;">⚔️${g.might} 🧠${g.intellect}</div>
            ${g.talent ? `<div style="font-size:10px;margin-top:4px;color:#8B6914;font-weight:bold;">${g.talent.name} Lv${g.talentLevel || 1}</div>` : ''}
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

          dialog.classList.add('fade-out');
          overlay.classList.add('fade-out');
          setTimeout(() => {
            overlay.remove();
            resolve(id);
          }, 300);
        });
      });
    });
  },

  async handleEncounter(player, position) {
    const cellData = this.gameState.currentMap.cells[position];
    if (cellData.type === 'city') return;
    
    const opponents = this.gameState.players.filter(p => 
      p.alive && p.id !== player.id && p.position === position
    );
    if (opponents.length === 0) return;
    if (player.generals.length === 0) return;
    
    let target;
    if (opponents.length === 1) {
      target = opponents[0];
    } else if (player.isHuman) {
      const buttons = opponents.map(p => ({ text: p.name, value: String(p.id) }));
      const chosen = await Dialog.show({
        title: '狭路相逢',
        icon: '⚔️',
        text: `你在${cellData.name}遭遇了多名对手！选择一位进行武将单挑：`,
        buttons: buttons
      });
      target = this.gameState.players.find(p => String(p.id) === chosen);
    } else {
      target = opponents[Math.floor(Math.random() * opponents.length)];
    }
    
    if (!target || target.generals.length === 0) return;
    
    if (player.isHuman) {
      await Dialog.show({
        title: '狭路相逢',
        icon: '⚔️',
        text: `你在${cellData.name}与${target.name}狭路相逢！必须进行武将单挑，胜者获得200G赔偿金！`,
        buttons: [{ text: '应战', value: 'ok' }]
      });
    } else {
      await Dialog.show({
        title: '狭路相逢',
        icon: '⚔️',
        text: `${player.name}在${cellData.name}与${target.name}狭路相逢！武将单挑开始！`,
        buttons: [],
        autoClose: true
      });
    }
    
    const attackerGeneral = await Combat.selectGeneral(player, player.generals);
    const defenderGeneral = await Combat.selectGeneral(target, target.generals);
    
    const result = await Combat.executeEncounter(player, target, attackerGeneral, defenderGeneral);
    
    if (result.winner) {
      GameLog.add(`遭遇战：${result.winner.name}击败${result.loser.name}，获得200G赔偿金！`, 'combat');
    } else {
      GameLog.add(`遭遇战：${player.name}与${target.name}平局，各自散去。`, 'combat');
    }
    
    this.updateUI();
  },

  showCityView() {
    const humanPlayer = this.gameState.players.find(p => p.isHuman);
    if (!humanPlayer) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    
    const panel = document.createElement('div');
    panel.className = 'pixel-panel bounce-in';
    panel.style.cssText = `
      z-index:1000;
      width:600px;
      max-height:80vh;
      overflow-y:auto;
      padding:25px;
    `;
    
    let html = `<h2 style="text-align:center;margin-bottom:20px;">🏰 我的城池</h2>`;
    
    if (humanPlayer.cities.length === 0) {
      html += `<div style="text-align:center;padding:30px;color:#999;font-size:16px;">你还没有城池，快去购买吧！</div>`;
    } else {
      html += `<table style="width:100%;border-collapse:collapse;font-size:14px;">`;
      html += `<tr style="background:#D2B48C;font-weight:bold;">
        <th style="padding:10px;border:2px solid #333;text-align:left;">城池名</th>
        <th style="padding:10px;border:2px solid #333;text-align:center;">等级</th>
        <th style="padding:10px;border:2px solid #333;text-align:center;">级别</th>
        <th style="padding:10px;border:2px solid #333;text-align:center;">当前过路费</th>
        <th style="padding:10px;border:2px solid #333;text-align:center;">升级费用</th>
      </tr>`;
      
      let totalToll = 0;
      humanPlayer.cities.forEach(pos => {
        const boardCell = this.gameState.board[pos];
        const cellData = this.gameState.currentMap.cells[pos];
        const tierName = cellData.cityTier === 'low' ? '初级' : cellData.cityTier === 'mid' ? '中级' : '高级';
        const tierColor = cellData.cityTier === 'low' ? '#CD7F32' : cellData.cityTier === 'mid' ? '#C0C0C0' : '#FFD700';
        const toll = CONFIG.cityTiers[cellData.cityTier].toll[boardCell.level - 1];
        const upgradeCost = boardCell.level < 3 ? CONFIG.cityTiers[cellData.cityTier].upgradeCost[boardCell.level - 1] + 'G' : '已满级';
        totalToll += toll;
        
        html += `<tr>
          <td style="padding:8px;border:2px solid #333;">${cellData.name}</td>
          <td style="padding:8px;border:2px solid #333;text-align:center;">Lv${boardCell.level}</td>
          <td style="padding:8px;border:2px solid #333;text-align:center;color:${tierColor};font-weight:bold;">${tierName}</td>
          <td style="padding:8px;border:2px solid #333;text-align:center;color:#DC143C;font-weight:bold;">${toll}G</td>
          <td style="padding:8px;border:2px solid #333;text-align:center;">${upgradeCost}</td>
        </tr>`;
      });
      
      html += `</table>`;
      html += `<div style="margin-top:15px;text-align:right;font-size:15px;font-weight:bold;">
        城池总数：${humanPlayer.cities.length}座 | 过路费总计：<span style="color:#DC143C;">${totalToll}G</span>
      </div>`;
    }
    
    html += `<div style="text-align:center;margin-top:20px;"><button class="pixel-btn" id="close-city-view">关闭</button></div>`;
    
    panel.innerHTML = html;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    
    const close = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    };
    
    document.getElementById('close-city-view').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },

  showGeneralSystem() {
    const humanPlayer = this.gameState.players.find(p => p.isHuman);
    if (!humanPlayer) return;

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    const panel = document.createElement('div');
    panel.className = 'pixel-panel bounce-in';
    panel.style.cssText = `
      z-index:1000;
      width:800px;
      max-height:85vh;
      overflow-y:auto;
      padding:30px;
      background:linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%);
      border:4px solid #8B6914;
    `;

    let html = `
      <div style="text-align:center;margin-bottom:25px;">
        <h2 style="font-size:28px;color:#3D3425;text-shadow:2px 2px 4px rgba(255,255,255,0.8);">
          <svg width="32" height="32" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:8px;"><path d="M12 2L4 6v12h16V6L12 2z" fill="#8B6914" stroke="#5D4E37" stroke-width="1.5"/><path d="M9 12h6M9 16h6" stroke="#5D4E37" stroke-width="2"/></svg>
          将星录
          <svg width="32" height="32" viewBox="0 0 24 24" style="vertical-align:middle;margin-left:8px;"><path d="M12 2L4 6v12h16V6L12 2z" fill="#8B6914" stroke="#5D4E37" stroke-width="1.5"/><path d="M9 12h6M9 16h6" stroke="#5D4E37" stroke-width="2"/></svg>
        </h2>
        <div style="font-size:14px;color:#7D6E57;margin-top:5px;">麾下武将 · ${humanPlayer.generals.length}员</div>
      </div>
    `;
    html += `<div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;">`;

    humanPlayer.generals.forEach(g => {
      const tierLabel = g.tier === 'high' ? '上将' : g.tier === 'mid' ? '中军' : '校尉';
      const tierColor = g.tier === 'high' ? '#FFD700' : g.tier === 'mid' ? '#C0C0C0' : '#CD7F32';
      const cardBg = g.faction === 'wei' ? 'var(--card-bg-wei)' :
                     g.faction === 'shu' ? 'var(--card-bg-shu)' :
                     g.faction === 'wu' ? 'var(--card-bg-wu)' : 'var(--card-bg-qun)';

      html += `
        <div class="general-card-painterly" style="width:220px;background:${cardBg};border-color:${tierColor};">
          <div class="general-portrait-painterly bg-${g.faction}" style="background:linear-gradient(145deg, var(--${g.faction}-color), color-mix(in srgb, var(--${g.faction}-color) 60%, #333));">
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:42px;color:rgba(255,255,255,0.95);text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
              ${g.name[0]}
            </div>
          </div>
          <div class="general-name-painterly">${g.name}${g.isLord ? '<span style="color:#E74C3C;font-size:12px;margin-left:5px;">主公</span>' : ''}</div>
          <div class="general-tier-painterly">
            <span style="color:${tierColor};font-weight:bold;">${tierLabel}</span>
            <span style="color:#7D6E57;font-size:12px;"> ${g.tier === 'high' ? '★★★' : g.tier === 'mid' ? '★★' : '★'}</span>
          </div>
          <div class="general-stats-painterly">
            <div class="general-stat-row">
              <span>⚔️ 武力</span>
              <span style="font-weight:bold;color:#3D3425;">${g.might}</span>
            </div>
            <div class="general-stat-row">
              <span>🧠 智力</span>
              <span style="font-weight:bold;color:#3D3425;">${g.intellect}</span>
            </div>
          </div>
          ${g.talent ? `
            <div class="general-talent-painterly">
              <div class="talent-name-painterly">【${g.talent.name}】Lv${g.talentLevel || 1}</div>
              <div class="talent-desc-painterly">${formatTalentDesc(g.talent, g.talentLevel || 1)}</div>
            </div>
          ` : `
            <div style="text-align:center;font-size:11px;color:#9D8E77;font-style:italic;padding:8px;">
              平凡之姿，无天赋
            </div>
          `}
        </div>
      `;
    });

    html += `</div>`;
    html += `<div style="text-align:center;margin-top:25px;"><button class="pixel-btn" id="close-general-system" style="padding:12px 40px;font-size:16px;">返回战场</button></div>`;

    panel.innerHTML = html;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const close = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    };

    document.getElementById('close-general-system').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },

  showSettings() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    
    const panel = document.createElement('div');
    panel.className = 'pixel-panel bounce-in';
    panel.style.cssText = `
      z-index:1000;
      width:400px;
      padding:30px;
      text-align:center;
    `;
    
    panel.innerHTML = `
      <h2 style="margin-bottom:25px;">⚙️ 设置</h2>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <button class="pixel-btn" id="settings-continue" style="width:100%;padding:14px;font-size:16px;">
          ▶️ 继续游戏
        </button>
        <button class="pixel-btn" id="settings-restart" style="width:100%;padding:14px;font-size:16px;">
          🔄 重新开始
        </button>
        <button class="pixel-btn" id="settings-exit" style="width:100%;padding:14px;font-size:16px;">
          🚪 退出游戏
        </button>
      </div>
    `;
    
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    
    const close = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    };
    
    document.getElementById('settings-continue').addEventListener('click', close);
    
    document.getElementById('settings-restart').addEventListener('click', () => {
      close();
      setTimeout(() => {
        switchScene('select');
      }, 350);
    });
    
    document.getElementById('settings-exit').addEventListener('click', () => {
      close();
      setTimeout(() => {
        switchScene('home');
      }, 350);
    });
    
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },

  endTurn() {
    this.checkBankruptcy();
    
    const alivePlayers = this.gameState.players.filter(p => p.alive);
    if (alivePlayers.length === 1) {
      const winner = alivePlayers[0];
      switchScene('result', { 
        winner: winner, 
        isVictory: winner.isHuman 
      });
      return;
    }
    
    do {
      this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
      
      if (this.gameState.currentPlayerIndex === 0) {
        this.gameState.round++;
      }
    } while (!this.gameState.players[this.gameState.currentPlayerIndex].alive);
    
    const btn = document.getElementById('roll-dice-btn');
    btn.disabled = false;
    
    this.startTurn();
  },
  
  checkBankruptcy() {
    this.gameState.players.forEach(player => {
      if (player.alive && player.gold < 0) {
        player.alive = false;
        GameLog.add(`${player.name}破产了！`, 'combat');
        
        player.cities.forEach(cityPos => {
          this.gameState.board[cityPos].owner = null;
          this.gameState.board[cityPos].level = 1;
        });
        
        player.generals.forEach(g => {
          if (!g.isLord) {
            this.gameState.generalPool.push(g);
          }
        });
        
        Dialog.show({
          title: '破产',
          icon: '💀',
          text: `${player.name}破产了，退出游戏！`,
          buttons: player.isHuman ? [{ text: '确认', value: 'ok' }] : [],
          autoClose: !player.isHuman
        });
      }
    });
  },
};
