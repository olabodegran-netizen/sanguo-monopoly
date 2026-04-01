const EVENTS = [
  {
    id: "E01", name: "天降横财", type: "positive",
    desc: "路旁发现一箱前朝遗宝，金光闪闪！天助我也！",
    effect: { type: "gold", value: 500 }
  },
  {
    id: "E02", name: "税收加征", type: "negative",
    desc: "朝廷派使者前来收税，不交不行……",
    effect: { type: "gold", value: -300 }
  },
  {
    id: "E03", name: "民心所向", type: "positive",
    desc: "主公仁名远扬，百姓纷纷拥戴！本回合所有己方城池过路费翻倍！",
    effect: { type: "tollDouble", duration: 1 }
  },
  {
    id: "E04", name: "瘟疫爆发", type: "negative",
    desc: "一场突如其来的瘟疫席卷城池……{city}受损严重，降级1级。",
    effect: { type: "cityDowngrade", target: "self" }
  },
  {
    id: "E05", name: "天命所归", type: "positive",
    desc: "夜观天象，紫气东来！武将们深受启发！",
    effect: { type: "generalPoints", value: 2 }
  },
  {
    id: "E06", name: "商路断绝", type: "negative",
    desc: "山贼占据商路，贸易中断！下回合城池暂停收取过路费。",
    effect: { type: "tollDisable", duration: 1 }
  },
  {
    id: "E07", name: "无事发生", type: "neutral",
    desc: "微风拂面，鸟鸣啾啾。风平浪静，一切如常。",
    effect: { type: "none" }
  },
  {
    id: "E08", name: "奇遇名士", type: "positive",
    desc: "在山间偶遇一位隐世高人，愿追随主公！",
    effect: { type: "freeRecruit", tier: "low" }
  },
  {
    id: "E09", name: "刺客来袭", type: "negative",
    desc: "刺客潜入军帐！主公虽幸免于难，但受伤不轻。武力暂时-10，持续2回合。",
    effect: { type: "lordDebuff", stat: "might", value: -10, duration: 2 }
  },
  {
    id: "E10", name: "名匠献宝", type: "positive",
    desc: "一位游方铁匠献上神兵利器！可为一名武将永久提升5点武力或智力。",
    effect: { type: "statBoost", value: 5, choice: true }
  },
  {
    id: "E11", name: "蝗灾降临", type: "negative",
    desc: "遮天蔽日的蝗群席卷而过，庄稼颗粒无收！所有诸侯各失去200金币赈灾。",
    effect: { type: "allPlayersGold", value: -200 }
  },
  {
    id: "E12", name: "丰收之年", type: "positive",
    desc: "风调雨顺，五谷丰登！每座己方城池带来100金币额外收成！",
    effect: { type: "goldPerCity", value: 100 }
  },
  {
    id: "E13", name: "叛将出逃", type: "negative",
    desc: "军心不稳，{general}趁夜色逃离了军营！",
    effect: { type: "loseGeneral", tier: "low" }
  },
  {
    id: "E14", name: "献帝密诏", type: "positive",
    desc: "天子密诏送达：朕封你为大将军，加倍俸禄以彰忠义！持续2回合。",
    effect: { type: "salaryDouble", duration: 2 }
  },
  {
    id: "E15", name: "走私商人", type: "positive",
    desc: "一个神秘商人找到你：'主公，这笔买卖半价就够……' 本回合购买城池享五折！",
    effect: { type: "cityDiscount", value: 0.5, duration: 1 }
  },
  {
    id: "E16", name: "武将顿悟", type: "positive",
    desc: "{general}闭关三日，顿悟精要！属性永久提升8点！",
    effect: { type: "randomGeneralBoost", value: 8 }
  },
  {
    id: "E17", name: "金蝉脱壳", type: "positive",
    desc: "获得妙计「金蝉脱壳」！下次被收过路费时自动免除一次！",
    effect: { type: "tollShield", count: 1 }
  },
  {
    id: "E18", name: "反间之计", type: "positive",
    desc: "派出细作散布谣言！选择一座敌方城池，本回合其过路费归你所有！",
    effect: { type: "stealToll", duration: 1, choice: true }
  },
  {
    id: "E19", name: "天降陨石", type: "negative",
    desc: "夜空中一颗陨石坠落！{city}被夷为平地，变回无主之地！",
    effect: { type: "destroyCity", target: "random" }
  },
  {
    id: "E20", name: "桃园结义", type: "positive",
    desc: "主公与众将歃血为盟，士气大振！所有武将属性暂时+3，持续3回合！",
    effect: { type: "allGeneralsBuff", value: 3, duration: 3 }
  },
];
