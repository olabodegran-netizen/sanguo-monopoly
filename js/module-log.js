const GameLog = {
  logs: [],

  add(message, type = 'info') {
    this.logs.push({
      message,
      type,
      timestamp: Date.now()
    });

    if (this.logs.length > 100) {
      this.logs.shift();
    }

    this.render();
  },

  render() {
    const container = document.getElementById('game-log');
    if (!container) return;

    container.innerHTML = '';

    const typeColors = {
      gold: '#E8B84A',
      combat: '#C97060',
      info: '#7D6E57',
      recruit: '#6AAF50',
      city: '#5B8DEE'
    };

    this.logs.slice(-15).reverse().forEach(log => {
      const logEntry = document.createElement('div');
      logEntry.style.cssText = `
        padding:6px 10px;
        margin-bottom:4px;
        font-size:11px;
        border-left:3px solid ${typeColors[log.type] || '#333'};
        background:rgba(255,255,255,0.4);
        border-radius:0 4px 4px 0;
        color:#5D4E37;
        line-height:1.4;
      `;
      logEntry.textContent = log.message;
      container.appendChild(logEntry);
    });
  },

  clear() {
    this.logs = [];
    this.render();
  },
};
