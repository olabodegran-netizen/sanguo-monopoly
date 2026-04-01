const AI = {
  decideBuyCity(player, city, cost) {
    if (player.gold > cost * 2) return true;
    if (player.gold > cost * 1.5) return Math.random() < 0.8;
    if (player.gold > cost) return Math.random() < 0.5;
    return false;
  },

  decideUpgradeCity(player, cost) {
    if (player.gold > cost * 3) return true;
    if (player.gold > cost * 2) return Math.random() < 0.6;
    return false;
  },

  decideCombat(player, defenderGeneral) {
    if (player.generals.length === 0) return { fight: false };
    
    const bestGeneral = player.generals.reduce((a, b) => a.might > b.might ? a : b);
    const diff = bestGeneral.might - defenderGeneral.might;
    
    if (diff > 10) return { fight: true, general: bestGeneral };
    if (diff > 0) return { fight: Math.random() < 0.7, general: bestGeneral };
    return { fight: false };
  },

  decideCasino(player) {
    if (player.gold > 2000) {
      const r = Math.random();
      if (r < 0.5) return "big";
      if (r < 0.8) return "small";
      return "pass";
    }
    if (player.gold > 1000) {
      const r = Math.random();
      if (r < 0.2) return "big";
      if (r < 0.6) return "small";
      return "pass";
    }
    return Math.random() < 0.2 ? "small" : "pass";
  },

  decideRecruit(player, availableGenerals, getCostFunc) {
    const sorted = [...availableGenerals].sort((a, b) => {
      const tierOrder = { high: 0, mid: 1, low: 2 };
      return tierOrder[a.tier] - tierOrder[b.tier];
    });
    
    for (const g of sorted) {
      const cost = getCostFunc(player, g);
      if (player.gold > cost * 2) return g;
    }
    return null;
  },

  useGeneralPoints(player) {
    const talentGeneral = player.generals.find(g => 
      g.talent && (!g.talentLevel || g.talentLevel < 3)
    );
    if (talentGeneral && Math.random() < 0.6) {
      return { type: "talent", target: talentGeneral };
    }
    
    const combatGeneral = player.generals.reduce((a, b) => 
      a.might > b.might ? a : b, player.generals[0]
    );
    
    if (combatGeneral) {
      return { type: "stat", target: combatGeneral, stat: Math.random() < 0.7 ? "might" : "intellect" };
    }
    
    return null;
  },
};
