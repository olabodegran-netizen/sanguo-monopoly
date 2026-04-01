function formatTalentDesc(talent, level) {
  if (!talent) return '';
  const lvl = (level || 1) - 1;
  let desc = talent.desc;
  if (talent.values) {
    desc = desc.replace(/\{val\}/g, talent.values[Math.min(lvl, talent.values.length - 1)]);
  }
  if (talent.values2) {
    desc = desc.replace(/\{val2\}/g, talent.values2[Math.min(lvl, talent.values2.length - 1)]);
  }
  return desc;
}

const CONFIG = {
  maps: {
    guandu:  { startGold: 3000, salary: 1000, players: 2 },
    chibi:   { startGold: 2500, salary: 800, players: 3 },
    hanzhong:{ startGold: 2000, salary: 700, players: 4 },
  },

  cityTiers: {
    low:  { buy: 300, toll: [200, 300, 500], upgradeCost: [200, 300], maxGenerals: 1 },
    mid:  { buy: 600, toll: [400, 600, 900], upgradeCost: [400, 500], maxGenerals: 1 },
    high: { buy: 1000, toll: [600, 1000, 1500], upgradeCost: [600, 800], maxGenerals: 2 },
  },

  intellectTollBonus: 5,

  intellectBonus: {
    threshold1: 80,
    threshold2: 90,
    bonus1: 100,
    bonus2: 150,
  },

  combat: {
    winRate: 0.8,
    loseRate: 1.2,
    toll免除: 200,
    toll加收: 200,
    encounterBounty: 200,
  },

  casino: {
    smallBet: 200,
    bigBet: 500,
    winMultiplier: 2,
  },

  generalPoints: {
    perLap: 1,
    statPerPoint: 2,
    talentUpgradeCost: 3,
  },

  animation: {
    diceRoll: 1500,
    pieceMove: 300,
    dialogAutoClose: 1500,
    combatPhase1: 1200,
    combatPhase2: 1500,
    combatPhase3: 1200,
  },
};
