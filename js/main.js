const scenes = {
  home: SceneHome,
  story: SceneStory,
  select: SceneSelect,
  game: SceneGame,
  result: SceneResult,
};

let currentScene = null;

function switchScene(sceneName, data = {}) {
  const app = document.getElementById('app');
  app.style.opacity = '0';
  setTimeout(() => {
    app.innerHTML = '';
    currentScene = scenes[sceneName];
    currentScene.init(app, data);
    app.style.opacity = '1';
  }, 300);
}

window.addEventListener('DOMContentLoaded', () => {
  switchScene('home');
});
