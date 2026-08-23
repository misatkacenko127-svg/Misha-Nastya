/**
 * 2D STORY GAME — Phaser 3 engine for the "До нашого назавжди" chapter.
 * Reuses CONTENT.mapNodes / app.js game state so the rest of the website stays reachable.
 */

const GAME_SAVE_KEY = 'misha_nastya_game_state';

function loadGameSave() {
  const stored = localStorage.getItem(GAME_SAVE_KEY);
  const base = stored
    ? JSON.parse(stored)
    : {
        completedLevels: [],
        memoriesFound: [],
        stats: { love: 0, trust: 0, understanding: 0 }
      };
  // Ensure October progress fields exist (backwards compatible with older saves).
  if (!base.october) base.october = {};
  if (!base.october.started) base.october.started = false;
  if (!base.october.completed) base.october.completed = false;
  if (!base.october.choice) base.october.choice = null;
  if (!base.october.poolChoice) base.october.poolChoice = null;
  return base;
}

function saveGameSave(save) {
  localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(save));
}

const gameSave = loadGameSave();

// ---- Mobile joystick + interact button (shared across scenes) ----
const gameInput = { joystick: { x: 0, y: 0 }, interactPressed: false };

function setupMobileControls() {
  const base = document.getElementById('gameJoystickBase');
  const knob = document.getElementById('gameJoystickKnob');
  const interactBtn = document.getElementById('gameInteractBtn');
  let dragging = false;
  const maxDist = 36;

  function reset() {
    gameInput.joystick.x = 0;
    gameInput.joystick.y = 0;
    knob.style.transform = 'translate(0, 0)';
  }

  function handleMove(clientX, clientY) {
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.min(Math.hypot(dx, dy), maxDist);
    const angle = Math.atan2(dy, dx);
    dx = Math.cos(angle) * dist;
    dy = Math.sin(angle) * dist;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    gameInput.joystick.x = dx / maxDist;
    gameInput.joystick.y = dy / maxDist;
  }

  base.addEventListener('pointerdown', (e) => {
    dragging = true;
    handleMove(e.clientX, e.clientY);
  });
  window.addEventListener('pointermove', (e) => {
    if (dragging) handleMove(e.clientX, e.clientY);
  });
  window.addEventListener('pointerup', () => {
    dragging = false;
    reset();
  });

  interactBtn.addEventListener('pointerdown', () => {
    gameInput.interactPressed = true;
  });
}

// ---- Quest banner ----
function setQuestBanner(text) {
  const banner = document.getElementById('gameQuestBanner');
  banner.textContent = `❤️ ${text}`;
  banner.classList.add('visible');
}

// ---- Click-to-continue dialogue with a typing effect ----
function showDialogueSequence(lines, onDone) {
  const box = document.getElementById('gameDialogue');
  const speakerEl = document.getElementById('gameDialogueSpeaker');
  const textEl = document.getElementById('gameDialogueText');
  let index = 0;
  let typing = null;
  let lineFinished = false;

  function typeLine(line) {
    speakerEl.textContent = line.speaker || '';
    textEl.textContent = '';
    const hintEl = box.querySelector('.game-dialogue-hint');
    if (hintEl) hintEl.style.visibility = 'visible';
    lineFinished = false;
    let charIndex = 0;
    clearInterval(typing);
    typing = setInterval(() => {
      textEl.textContent += line.text[charIndex];
      charIndex += 1;
      if (charIndex >= line.text.length) {
        clearInterval(typing);
        lineFinished = true;
      }
    }, 22);
  }

  function advance() {
    if (!lineFinished) {
      clearInterval(typing);
      textEl.textContent = lines[index].text;
      lineFinished = true;
      return;
    }
    index += 1;
    if (index < lines.length) {
      typeLine(lines[index]);
    } else {
      box.classList.remove('visible');
      box.removeEventListener('click', advance);
      if (onDone) onDone();
    }
  }

  box.classList.add('visible');
  box.addEventListener('click', advance);
  typeLine(lines[0]);
}

function showDialogueChoices(question, choices, onSelect) {
  // Lightweight choice UI that reuses the existing dialogue box styling.
  const box = document.getElementById('gameDialogue');
  const speakerEl = document.getElementById('gameDialogueSpeaker');
  const textEl = document.getElementById('gameDialogueText');
  const choiceWrap = document.getElementById('gameDialogueChoices');
  const hintEl = box.querySelector('.game-dialogue-hint');
  if (hintEl) hintEl.style.visibility = 'hidden';

  speakerEl.textContent = '';
  textEl.textContent = question;

  choiceWrap.innerHTML = '';
  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'game-choice-btn';
    btn.textContent = choice.label;
    btn.addEventListener('click', () => {
      box.classList.remove('visible');
      choiceWrap.classList.remove('visible');
      choiceWrap.innerHTML = '';
      onSelect(choice);
    });
    choiceWrap.appendChild(btn);
  });

  box.classList.add('visible');
  choiceWrap.classList.add('visible');
}

function showGameToast(text) {
  const toast = document.getElementById('gameToast');
  toast.textContent = text;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2200);
}

function openMemoryModal(memory) {
  const modal = document.getElementById('gameMemoryModal');
  const imgEl = document.getElementById('gameMemoryImg');
  const videoEl = document.getElementById('gameMemoryVideo');
  const caption = document.getElementById('gameMemoryCaption');
  const src = memory.video || memory.photo;
  const isVideo = /\.(mov|mp4|m4v|webm|hevc)$/gi.test(src || '');
  imgEl.style.display = isVideo ? 'none' : 'block';
  if (videoEl) videoEl.style.display = isVideo ? 'block' : 'none';
  if (videoEl) {
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
  }
  if (isVideo) {
    videoEl.src = src;
    caption.textContent = memory.caption || '';
    modal.classList.add('open');
    videoEl.play().catch(() => {});
  } else {
    imgEl.src = src;
    caption.textContent = memory.caption || '';
    modal.classList.add('open');
  }
}

let memoryModalCloseCallback = null;

function closeMemoryModal() {
  const modal = document.getElementById('gameMemoryModal');
  const videoEl = document.getElementById('gameMemoryVideo');
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
  }
  modal.classList.remove('open');
  if (memoryModalCloseCallback) {
    const cb = memoryModalCloseCallback;
    memoryModalCloseCallback = null;
    cb();
  }
}

function updateStatsHud() {
  document.getElementById('statLove').textContent = gameSave.stats.love;
  document.getElementById('statTrust').textContent = gameSave.stats.trust;
  document.getElementById('statUnderstanding').textContent = gameSave.stats.understanding;
  const totalMemories = GAME_DATA.levels.reduce(
    (sum, lvl) => sum + (lvl.memories ? lvl.memories.length : lvl.memory ? 1 : 0),
    0
  );
  document.getElementById('memoryCount').textContent = `${gameSave.memoriesFound.length} / ${totalMemories}`;
}

function applyStatGain(gain) {
  gameSave.stats.love += gain.love || 0;
  gameSave.stats.trust += gain.trust || 0;
  gameSave.stats.understanding += gain.understanding || 0;
  saveGameSave(gameSave);
  updateStatsHud();
}

function collectMemory(memory) {
  if (gameSave.memoriesFound.includes(memory.id)) return;
  gameSave.memoriesFound.push(memory.id);
  saveGameSave(gameSave);
  updateStatsHud();
  showGameToast('❤️ Спогад збережено');
  openMemoryModal(memory);
}

function completeLevel(levelId) {
  if (!gameSave.completedLevels.includes(levelId)) {
    gameSave.completedLevels.push(levelId);
    saveGameSave(gameSave);
  }
}

function isLevelUnlocked(levelId) {
  const index = GAME_DATA.levels.findIndex((l) => l.id === levelId);
  if (index <= 0) return true;
  const previous = GAME_DATA.levels[index - 1];
  return gameSave.completedLevels.includes(previous.id);
}

// ---- World/menu overlay: keeps every existing page reachable ----
function setupWorldMenu() {
  const menu = document.getElementById('gameWorldMenu');
  const openBtn = document.getElementById('gameMenuBtn');
  const closeBtn = document.getElementById('gameWorldMenuClose');
  const oldSections = document.getElementById('gameOldSections');
  const roadmap = document.getElementById('gameRoadmap');

  const routeMap = {
    memories: 'memories.html',
    quests: 'quests.html',
    music: 'music.html',
    letters: 'letters.html',
    secret: 'secret.html',
    future: 'future.html'
  };

  function renderMenu() {
    oldSections.innerHTML = '';
    roadmap.innerHTML = '';

    // Reuse the existing progress/unlock system from app.js + content.js.
    CONTENT.mapNodes
      .filter((node) => node.id !== 'beginning')
      .forEach((node) => {
        const unlocked = game.isSectionUnlocked(node.id);
        const card = document.createElement('div');
        card.className = `game-world-card ${unlocked ? '' : 'locked'}`;
        card.innerHTML = `<strong>${node.icon} ${node.title}</strong><span>${unlocked ? node.description : 'Заблоковано'}</span>`;
        if (unlocked) {
          card.addEventListener('click', () => {
            window.location.href = routeMap[node.id];
          });
        }
        oldSections.appendChild(card);
      });

    GAME_DATA.monthRoadmap.forEach((entry) => {
      const unlocked = entry.status === 'playable' && isLevelUnlocked(entry.id);
      const done = gameSave.completedLevels.includes(entry.id);
      const card = document.createElement('div');
      card.className = `game-world-card ${unlocked ? '' : entry.status === 'building' ? 'building' : 'locked'}`;
      const statusText = entry.status === 'building' ? 'У розробці' : done ? 'Пройдено' : unlocked ? 'Доступно' : 'Заблоковано';
      card.innerHTML = `<strong>${entry.title}</strong><span>${entry.subtitle} · ${statusText}</span>`;
      if (unlocked) {
        card.addEventListener('click', () => {
          menu.classList.remove('open');
          const active = window.storyGame.scene.getScenes(true)[0];
          if (active) window.storyGame.scene.stop(active.scene.key);
          const sceneKey = (GAME_DATA.monthScenes || {})[entry.id] || 'August2025Scene';
          window.storyGame.scene.start(sceneKey);
        });
      }
      roadmap.appendChild(card);
    });
  }

  renderMenu();
  openBtn.addEventListener('click', () => {
    renderMenu();
    menu.classList.add('open');
  });
  closeBtn.addEventListener('click', () => menu.classList.remove('open'));
}

/** Convert a scene's world coordinates into on-screen pixels relative to #gameStageWrap. */
function worldToScreen(scene, x, y) {
  const canvasRect = scene.sys.game.canvas.getBoundingClientRect();
  const hostRect = document.getElementById('gameStageWrap').getBoundingClientRect();
  const cam = scene.cameras.main;
  const scaleX = canvasRect.width / scene.sys.game.config.width;
  const scaleY = canvasRect.height / scene.sys.game.config.height;
  return {
    x: (canvasRect.left - hostRect.left) + (x - cam.scrollX) * scaleX,
    y: (canvasRect.top - hostRect.top) + (y - cam.scrollY) * scaleY
  };
}

// ---- Interact hint bound to a world position ----
function createWorldHint(scene, getX, getY, label) {
  const el = document.createElement('div');
  el.className = 'game-interact-hint';
  el.textContent = label;
  // Clickable so mouse/touch users can trigger the interaction, not only the E key.
  el.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    gameInput.interactPressed = true;
  });
  document.getElementById('gameStageWrap').appendChild(el);
  return {
    el,
    update() {
      const pos = worldToScreen(scene, getX(), getY());
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
    },
    remove() { el.remove(); }
  };
}

function readMoveVector(scene) {
  const vx = (scene.cursors.right.isDown || scene.wasd.right.isDown ? 1 : 0) -
    (scene.cursors.left.isDown || scene.wasd.left.isDown ? 1 : 0) +
    gameInput.joystick.x;
  const vy = (scene.cursors.down.isDown || scene.wasd.down.isDown ? 1 : 0) -
    (scene.cursors.up.isDown || scene.wasd.up.isDown ? 1 : 0) +
    gameInput.joystick.y;
  const len = Math.hypot(vx, vy);
  if (len < 0.15) return { x: 0, y: 0 };
  return { x: vx / (len || 1), y: vy / (len || 1) };
}

// ---- Generated human-like character textures (no external art needed) ----
function drawPerson(g, { skin, hair, shirt, pants, hairStyle }, legOffset) {
  // legs
  g.fillStyle(pants, 1);
  g.fillRect(16 - legOffset, 42, 7, 18);
  g.fillRect(25 + legOffset, 42, 7, 18);
  // shoes
  g.fillStyle(0x3a2c26, 1);
  g.fillRect(15 - legOffset, 58, 9, 4);
  g.fillRect(24 + legOffset, 58, 9, 4);
  // body / shirt
  g.fillStyle(shirt, 1);
  g.fillRoundedRect(12, 22, 24, 22, 6);
  // arms
  g.fillStyle(skin, 1);
  g.fillRoundedRect(6, 24, 7, 18, 3);
  g.fillRoundedRect(35, 24, 7, 18, 3);
  // head
  g.fillStyle(skin, 1);
  g.fillCircle(24, 15, 11);
  // hair
  g.fillStyle(hair, 1);
  if (hairStyle === 'short') {
    g.fillRoundedRect(12, 4, 24, 12, { tl: 10, tr: 10, bl: 2, br: 2 });
  } else {
    g.fillRoundedRect(10, 3, 28, 14, { tl: 12, tr: 12, bl: 4, br: 4 });
    g.fillRoundedRect(9, 10, 6, 20, 3);
    g.fillRoundedRect(33, 10, 6, 20, 3);
  }
  // face
  g.fillStyle(0x2f2423, 1);
  g.fillCircle(20, 16, 1.4);
  g.fillCircle(28, 16, 1.4);
  g.lineStyle(1.4, 0x2f2423, 0.8);
  g.beginPath();
  g.arc(24, 19, 4, 0.15 * Math.PI, 0.85 * Math.PI, false);
  g.strokePath();
}

function generatePersonTextures(scene, key, palette) {
  const idle = scene.make.graphics({ x: 0, y: 0, add: false });
  drawPerson(idle, palette, 0);
  idle.generateTexture(`${key}_idle`, 48, 64);
  idle.destroy();

  const walk = scene.make.graphics({ x: 0, y: 0, add: false });
  drawPerson(walk, palette, 5);
  walk.generateTexture(`${key}_walk`, 48, 64);
  walk.destroy();
}

function generateGlowTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xffe9a8, 0.7);
  g.fillCircle(16, 16, 16);
  g.generateTexture('glow', 32, 32);
  g.destroy();
}

function generateTreeTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x5b3a26, 1);
  g.fillRect(28, 60, 14, 40);
  g.fillStyle(0x2e5a34, 1);
  g.fillCircle(35, 40, 30);
  g.fillStyle(0x376b40, 1);
  g.fillCircle(20, 55, 22);
  g.fillCircle(50, 55, 22);
  g.generateTexture('tree', 70, 100);
  g.destroy();
}

function generateBushTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x3d7a44, 1);
  g.fillCircle(18, 18, 18);
  g.fillCircle(34, 20, 16);
  g.fillCircle(8, 22, 14);
  g.generateTexture('bush', 48, 36);
  g.destroy();
}

function generateBenchTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x2a1c14, 1);
  g.fillRect(6, 6, 8, 46);
  g.fillRect(106, 6, 8, 46);
  g.fillStyle(0x7a5236, 1);
  g.fillRoundedRect(0, 40, 120, 12, 4);
  g.fillRoundedRect(4, 0, 112, 34, 4);
  g.fillStyle(0x8f6541, 1);
  for (let i = 0; i < 4; i += 1) {
    g.fillRect(6 + i * 28, 2, 22, 30);
  }
  g.generateTexture('bench', 120, 58);
  g.destroy();
}

function generateGrassTileTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x4f8a4f, 1);
  g.fillRect(0, 0, 64, 64);
  g.fillStyle(0x5a9755, 0.6);
  for (let i = 0; i < 10; i += 1) {
    g.fillRect(Phaser.Math.Between(0, 60), Phaser.Math.Between(0, 60), 3, 8);
  }
  g.generateTexture('grass', 64, 64);
  g.destroy();
}

function generatePathTileTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xd8bd8f, 1);
  g.fillRect(0, 0, 64, 64);
  g.fillStyle(0xc7a976, 0.5);
  for (let i = 0; i < 6; i += 1) {
    g.fillCircle(Phaser.Math.Between(4, 60), Phaser.Math.Between(4, 60), 3);
  }
  g.generateTexture('path', 64, 64);
  g.destroy();
}

function generateHouseTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xd8a07a, 1);
  g.fillRect(40, 90, 200, 130);
  g.fillStyle(0x8a3b2a, 1);
  g.fillTriangle(20, 95, 140, 20, 260, 95);
  g.fillStyle(0x5b3a26, 1);
  g.fillRect(120, 150, 40, 70);
  g.fillStyle(0xf3d16b, 1);
  g.fillCircle(152, 188, 3);
  g.fillStyle(0xffe9a8, 1);
  g.fillRect(60, 115, 36, 36);
  g.fillRect(184, 115, 36, 36);
  g.lineStyle(2, 0x8a3b2a, 0.8);
  g.strokeRect(60, 115, 36, 36);
  g.strokeRect(184, 115, 36, 36);
  g.generateTexture('house', 280, 220);
  g.destroy();
}

function generateKitchenTableTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  // table top
  g.fillStyle(0x6b3a2a, 1);
  g.fillRoundedRect(0, 8, 260, 34, 6);
  g.fillStyle(0x8a4f36, 1);
  g.fillRoundedRect(4, 4, 252, 30, 6);
  // legs
  g.fillStyle(0x4a2418, 1);
  g.fillRect(16, 38, 10, 40);
  g.fillRect(234, 38, 10, 40);
  // two plates + glasses
  g.fillStyle(0xf5efe6, 1);
  g.fillCircle(50, 14, 11);
  g.fillCircle(210, 14, 11);
  g.fillStyle(0xdfd6c8, 1);
  g.fillCircle(50, 14, 7);
  g.fillCircle(210, 14, 7);
  g.fillStyle(0x8ec9d9, 0.9);
  g.fillCircle(90, 12, 4);
  g.fillCircle(170, 12, 4);
  g.generateTexture('kitchen_table', 260, 80);
  g.destroy();
}

function generateBedTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  // bed frame
  g.fillStyle(0x5b3a26, 1);
  g.fillRoundedRect(0, 20, 260, 100, 8);
  // mattress
  g.fillStyle(0xf2e2cf, 1);
  g.fillRoundedRect(8, 12, 244, 60, 8);
  // blanket
  g.fillStyle(0xd68a8a, 1);
  g.fillRoundedRect(8, 30, 244, 42, 8);
  // pillows
  g.fillStyle(0xfffaf8, 1);
  g.fillRoundedRect(20, 6, 60, 26, 8);
  g.fillRoundedRect(180, 6, 60, 26, 8);
  // headboard
  g.fillStyle(0x4a2418, 1);
  g.fillRoundedRect(0, 0, 260, 24, 8);
  g.generateTexture('bed', 260, 120);
  g.destroy();
}

function generateTVTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  // TV frame
  g.fillStyle(0x2a1c14, 1);
  g.fillRoundedRect(0, 0, 220, 130, 8);
  // screen
  g.fillStyle(0x1a2a3a, 1);
  g.fillRoundedRect(10, 10, 200, 110, 4);
  // screen glow
  g.fillStyle(0x3a5a7a, 0.6);
  g.fillRoundedRect(16, 16, 188, 98, 4);
  // stand
  g.fillStyle(0x2a1c14, 1);
  g.fillRect(100, 130, 20, 20);
  g.fillRect(80, 148, 60, 8);
  g.generateTexture('tv', 220, 156);
  g.destroy();
}

function generatePoolWaterTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x2f7fa8, 1);
  g.fillRect(0, 0, 64, 64);
  g.fillStyle(0x4a9fc8, 0.5);
  for (let i = 0; i < 8; i += 1) {
    g.fillRect(Phaser.Math.Between(0, 56), Phaser.Math.Between(0, 56), 20, 3);
  }
  g.generateTexture('pool_water', 64, 64);
  g.destroy();
}

function generateBilliardTableTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  // legs
  g.fillStyle(0x3a2316, 1);
  g.fillRect(24, 90, 18, 40);
  g.fillRect(258, 90, 18, 40);
  // frame
  g.fillStyle(0x5b3a26, 1);
  g.fillRoundedRect(0, 54, 300, 46, 8);
  // green felt
  g.fillStyle(0x2d6a4f, 1);
  g.fillRoundedRect(12, 44, 276, 44, 6);
  g.fillStyle(0x3b8f6a, 1);
  g.fillRoundedRect(18, 28, 264, 34, 6);
  // pockets
  g.fillStyle(0x1b1410, 1);
  [[22, 26], [150, 22], [278, 26], [22, 64], [150, 62], [278, 64]].forEach(([px, py]) => {
    g.fillCircle(px, py, 6);
  });
  // balls
  g.fillStyle(0xf5efe6, 1);
  g.fillCircle(150, 60, 6);
  g.fillStyle(0xd68a8a, 1);
  g.fillCircle(176, 48, 6);
  g.fillStyle(0xf3d16b, 1);
  g.fillCircle(124, 40, 6);
  g.fillStyle(0x3f7fa0, 1);
  g.fillCircle(100, 52, 6);
  g.generateTexture('billiard_table', 300, 130);
  g.destroy();
}

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  create() {
    generatePersonTextures(this, 'misha', { skin: 0xe8b48c, hair: 0x3a2a20, shirt: 0x5c7fb0, pants: 0x2e3a4d, hairStyle: 'short' });
    generatePersonTextures(this, 'nastya', { skin: 0xf0c6a4, hair: 0x6b3b2a, shirt: 0xd68a8a, pants: 0x8a5a6a, hairStyle: 'long' });
    generateGlowTexture(this);
    generateTreeTexture(this);
    generateBushTexture(this);
    generateBenchTexture(this);
    generateGrassTileTexture(this);
    generatePathTileTexture(this);
    generateHouseTexture(this);
    generateKitchenTableTexture(this);
    generateBilliardTableTexture(this);
    generateBedTexture(this);
    generateTVTexture(this);
    generatePoolWaterTexture(this);
    this.scene.start('August2025Scene');
  }
}

const WORLD_WIDTH = 1800;
const WORLD_HEIGHT = 620;
const PLAYER_SPEED = 190;

/** A stylized walking character with idle bob + 2-frame walk cycle. */
class Character {
  constructor(scene, x, y, key) {
    this.scene = scene;
    this.key = key;
    this.sprite = scene.add.image(x, y, `${key}_idle`).setOrigin(0.5, 0.9);
    this.moving = false;
    this.frameTimer = 0;
    this.frameOn = false;
  }

  get x() { return this.sprite.x; }
  set x(v) { this.sprite.x = v; }
  get y() { return this.sprite.y; }
  set y(v) { this.sprite.y = v; }

  setMoving(moving, facingLeft) {
    this.moving = moving;
    if (facingLeft !== undefined) this.sprite.setFlipX(facingLeft);
    if (!moving) this.sprite.setTexture(`${this.key}_idle`);
  }

  update(delta) {
    if (!this.moving) return;
    this.frameTimer += delta;
    if (this.frameTimer > 160) {
      this.frameTimer = 0;
      this.frameOn = !this.frameOn;
      this.sprite.setTexture(this.frameOn ? `${this.key}_walk` : `${this.key}_idle`);
    }
  }
}

class August2025Scene extends Phaser.Scene {
  constructor() { super('August2025Scene'); }

  create() {
    this.levelData = GAME_DATA.levels[0];
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · ${this.levelData.subtitle}`;

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 90, WORLD_HEIGHT - 140, 'misha');
    this.nastya = new Character(this, WORLD_WIDTH - 260, WORLD_HEIGHT - 160, 'nastya');
    this.nastyaFollowing = false;

    this.cameras.main.startFollow(this.player.sprite, true, 0.09, 0.09);
    this.cameras.main.setDeadzone(120, 90);

    this.questState = 'find-nastya';
    setQuestBanner('Знайди Настю');

    this.talkHint = null;
    this.benchHint = null;
    this.memoryHelper = null;
    this.sat = false;
  }

  buildEnvironment() {
    const skyTop = 0xf6d9b8;
    const skyBottom = 0xe9915f;
    const sky = this.add.graphics();
    sky.fillGradientStyle(skyTop, skyTop, skyBottom, skyBottom, 1);
    sky.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    sky.setScrollFactor(0.2);

    // Distant hills (parallax)
    const hills = this.add.graphics();
    hills.fillStyle(0xb97a5a, 0.5);
    for (let i = 0; i < 6; i += 1) {
      hills.fillEllipse(i * 340, WORLD_HEIGHT - 160, 320, 140);
    }
    hills.setScrollFactor(0.4);

    // Ground
    this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT - 70, WORLD_WIDTH, 160, 'grass').setOrigin(0.5, 0.5);

    // Path leading toward the bench
    this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT - 46, WORLD_WIDTH - 200, 46, 'path').setOrigin(0.5, 0.5).setAlpha(0.85);

    // Lake crossing on the way to the bench
    const lakeX = WORLD_WIDTH * 0.62;
    const lake = this.add.ellipse(lakeX, WORLD_HEIGHT - 105, 260, 90, 0x3f7fa0, 0.75);
    lake.setStrokeStyle(3, 0x2c5f7a, 0.6);
    this.tweens.add({ targets: lake, scaleX: 1.03, scaleY: 0.97, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    for (let i = 0; i < 3; i += 1) {
      const shimmer = this.add.ellipse(lakeX - 60 + i * 60, WORLD_HEIGHT - 108, 40, 8, 0xffffff, 0.25);
      this.tweens.add({ targets: shimmer, alpha: 0.05, duration: 1800 + i * 300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    // Clouds
    for (let i = 0; i < 5; i += 1) {
      const cloud = this.add.ellipse(120 + i * 380, 70 + (i % 2) * 30, 110, 36, 0xffffff, 0.55);
      cloud.setScrollFactor(0.6);
      this.tweens.add({ targets: cloud, x: cloud.x + 70, duration: 9000 + i * 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    // Fireflies / floating particles
    this.add.particles(0, 0, 'glow', {
      x: { min: 0, max: WORLD_WIDTH },
      y: { min: WORLD_HEIGHT - 180, max: WORLD_HEIGHT - 40 },
      lifespan: 4000,
      speedY: { min: -12, max: -4 },
      speedX: { min: -6, max: 6 },
      scale: { start: 0.25, end: 0 },
      alpha: { start: 0.8, end: 0 },
      frequency: 250
    });

    // Obstacles: trees + bushes + bench, collected for simple AABB collision.
    this.obstacles = [];

    const treePositions = [220, 420, 700, 980, 1260, 1520];
    treePositions.forEach((tx) => {
      const ty = WORLD_HEIGHT - 150;
      const tree = this.add.image(tx, ty, 'tree').setOrigin(0.5, 1);
      this.tweens.add({ targets: tree, angle: { from: -1.2, to: 1.2 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.obstacles.push({ x: tx - 10, y: ty - 40, width: 20, height: 40 });
    });

    [340, 560, 860, 1140, 1400].forEach((bx) => {
      const by = WORLD_HEIGHT - 95;
      this.add.image(bx, by, 'bush').setOrigin(0.5, 1);
      this.obstacles.push({ x: bx - 22, y: by - 20, width: 44, height: 20 });
    });

    // Decorative flowers (non-blocking)
    for (let i = 0; i < 26; i += 1) {
      const fx = Phaser.Math.Between(40, WORLD_WIDTH - 40);
      const fy = WORLD_HEIGHT - Phaser.Math.Between(30, 90);
      const color = Phaser.Utils.Array.GetRandom([0xd68a8a, 0xf3d16b, 0xffffff, 0xb98adf]);
      this.add.circle(fx, fy, 3, color, 0.9);
    }

    this.benchX = WORLD_WIDTH - 300;
    this.benchY = WORLD_HEIGHT - 130;
    this.add.image(this.benchX, this.benchY, 'bench').setOrigin(0.5, 1);
    this.benchObstacle = { x: this.benchX - 55, y: this.benchY - 50, width: 110, height: 50 };
    this.obstacles.push(this.benchObstacle);

    // Warm overlay used later for the romantic bench moment.
    this.overlay = this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x3a1a1a, 0);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(50);
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;

    const feetW = 18;
    const feetH = 12;

    const tryMove = (nx, ny) => {
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    let ny = character.y;
    if (tryMove(nx, ny) && nx > 20 && nx < WORLD_WIDTH - 20) character.x = nx;

    nx = character.x;
    ny = character.y + stepY;
    if (tryMove(nx, ny) && ny > 60 && ny < WORLD_HEIGHT - 20) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);

    if (this.nastyaFollowing && !this.sat) {
      const targetX = this.player.x - 46;
      const targetY = this.player.y;
      const dx = targetX - this.nastya.x;
      const dy = targetY - this.nastya.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        this.nastya.x += dx * Math.min(1, dt * 3);
        this.nastya.y += dy * Math.min(1, dt * 3);
        this.nastya.setMoving(true, dx < 0);
      } else {
        this.nastya.setMoving(false);
      }
    }
    this.nastya.update(delta);

    this.handleQuestLogic();
    gameInput.interactPressed = false;
  }

  handleQuestLogic() {
    if (this.questState === 'find-nastya') {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nastya.x, this.nastya.y);
      const near = dist < 70;
      if (near && !this.talkHint) {
        this.talkHint = createWorldHint(this, () => this.nastya.x, () => this.nastya.y - 60, 'Поговорити');
      }
      if (!near && this.talkHint) {
        this.talkHint.remove();
        this.talkHint = null;
      }
      if (this.talkHint) this.talkHint.update();

      if (near && (gameInput.interactPressed || Phaser.Input.Keyboard.JustDown(this.eKey))) {
        if (this.talkHint) { this.talkHint.remove(); this.talkHint = null; }
        this.questState = 'talking';
        showDialogueSequence(this.levelData.meetingDialogue, () => {
          this.questState = 'go-to-bench';
          this.nastyaFollowing = true;
          setQuestBanner('Дійди до лавочки через озеро');
        });
      }
    } else if (this.questState === 'go-to-bench') {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.benchX, this.benchY);
      const near = dist < 90;
      if (near && !this.benchHint) {
        this.benchHint = createWorldHint(this, () => this.benchX, () => this.benchY - 55, 'Сісти разом');
      }
      if (!near && this.benchHint) {
        this.benchHint.remove();
        this.benchHint = null;
      }
      if (this.benchHint) this.benchHint.update();

      if (near && (gameInput.interactPressed || Phaser.Input.Keyboard.JustDown(this.eKey))) {
        if (this.benchHint) { this.benchHint.remove(); this.benchHint = null; }
        this.sitOnBench();
      }
    } else if (this.questState === 'find-memory') {
      if (this.memoryHelper && !this.memoryHelper.collected) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.memoryHelper.x, this.memoryHelper.y);
        const near = dist < 60;
        if (near) {
          this.memoryHelper.hint.update();
          if (gameInput.interactPressed || Phaser.Input.Keyboard.JustDown(this.eKey)) {
            this.memoryHelper.collected = true;
            this.memoryHelper.hint.remove();
            this.memoryHelper.heart.destroy();
            collectMemory(this.levelData.memory);
            this.finishLevel();
          }
        }
      }
    }
  }

  sitOnBench() {
    this.questState = 'sitting';
    this.sat = true;
    // Drop the bench collider so the characters aren't trapped inside it while seated.
    this.obstacles = this.obstacles.filter((o) => o !== this.benchObstacle);
    this.player.setMoving(false);
    this.nastya.setMoving(false);
    this.player.x = this.benchX - 26;
    this.player.y = this.benchY - 6;
    this.nastya.x = this.benchX + 26;
    this.nastya.y = this.benchY - 6;
    this.player.sprite.setFlipX(false);
    this.nastya.sprite.setFlipX(true);

    this.tweens.add({ targets: this.overlay, fillAlpha: 0.28, duration: 1200 });

    const lines = [{ speaker: '', text: this.levelData.benchDate }, ...this.levelData.benchDialogue];
    showDialogueSequence(lines, () => {
      this.questState = 'find-memory';
      setQuestBanner('Знайди наш перший спогад');
      this.spawnMemory();
    });
  }

  spawnMemory() {
    const memory = this.levelData.memory;
    const mx = this.benchX;
    const my = this.benchY - 80;
    const heart = this.add.text(mx, my, '♡', { fontSize: '30px', color: '#ffb3b3' }).setOrigin(0.5);
    this.tweens.add({ targets: heart, y: my - 8, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.memoryHelper = {
      x: mx,
      y: my,
      heart,
      collected: false,
      hint: createWorldHint(this, () => mx, () => my - 30, memory.label)
    };
  }

  finishLevel() {
    this.questState = 'complete';
    applyStatGain(this.levelData.statGain);
    completeLevel(this.levelData.id);
    setQuestBanner('Серпень 2025 завершено ❤️');
    setTimeout(() => {
      showDialogueSequence([
        { speaker: '', text: 'Серпень 2025 завершено ❤️' },
        { speaker: '', text: 'Відкрито: Вересень 2025 🎨' }
      ]);
    }, 1000);
  }
}

const SEPTEMBER_WORLD_WIDTH = 1500;
const SEPTEMBER_WORLD_HEIGHT = 620;

/** Вересень 2025 — Міша приходить до Насті додому. */
class September2025Scene extends Phaser.Scene {
  constructor() { super('September2025Scene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'september-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · ${this.levelData.subtitle}`;

    this.cameras.main.setBounds(0, 0, SEPTEMBER_WORLD_WIDTH, SEPTEMBER_WORLD_HEIGHT);

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 90, SEPTEMBER_WORLD_HEIGHT - 140, 'misha');
    this.nastya = new Character(this, this.nastyaX, SEPTEMBER_WORLD_HEIGHT - 150, 'nastya');
    this.nastya.sprite.setFlipX(true);

    this.cameras.main.startFollow(this.player.sprite, true, 0.09, 0.09);
    this.cameras.main.setDeadzone(120, 90);

    this.questState = 'find-nastya';
    setQuestBanner('Прийди до Насті додому');

    this.talkHint = null;
    this.choice = null;

    // Warm cinematic entrance fade.
    this.cameras.main.setBackgroundColor('#1b1410');
    this.cameras.main.fadeIn(900);
  }

  buildEnvironment() {
    const skyTop = 0xf7d9b8;
    const skyBottom = 0xc96a4f;
    const sky = this.add.graphics();
    sky.fillGradientStyle(skyTop, skyTop, skyBottom, skyBottom, 1);
    sky.fillRect(0, 0, SEPTEMBER_WORLD_WIDTH, SEPTEMBER_WORLD_HEIGHT);
    sky.setScrollFactor(0.2);

    const hills = this.add.graphics();
    hills.fillStyle(0xa85e4b, 0.42);
    for (let i = 0; i < 5; i += 1) {
      hills.fillEllipse(i * 360, SEPTEMBER_WORLD_HEIGHT - 165, 340, 130);
    }
    hills.setScrollFactor(0.4);

    this.add.tileSprite(SEPTEMBER_WORLD_WIDTH / 2, SEPTEMBER_WORLD_HEIGHT - 70, SEPTEMBER_WORLD_WIDTH, 160, 'grass').setOrigin(0.5, 0.5);
    this.add.tileSprite(SEPTEMBER_WORLD_WIDTH / 2, SEPTEMBER_WORLD_HEIGHT - 46, SEPTEMBER_WORLD_WIDTH - 160, 46, 'path').setOrigin(0.5, 0.5).setAlpha(0.85);

    for (let i = 0; i < 4; i += 1) {
      const cloud = this.add.ellipse(140 + i * 390, 76 + (i % 2) * 34, 120, 34, 0xffffff, 0.5);
      cloud.setScrollFactor(0.6);
      this.tweens.add({ targets: cloud, x: cloud.x + 80, duration: 8500 + i * 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    this.add.particles(0, 0, 'glow', {
      x: { min: 0, max: SEPTEMBER_WORLD_WIDTH },
      y: { min: SEPTEMBER_WORLD_HEIGHT - 180, max: SEPTEMBER_WORLD_HEIGHT - 40 },
      lifespan: 4200,
      speedY: { min: -12, max: -4 },
      speedX: { min: -6, max: 6 },
      scale: { start: 0.25, end: 0 },
      alpha: { start: 0.8, end: 0 },
      frequency: 260
    });

    this.obstacles = [];

    [210, 420, 680, 980].forEach((tx) => {
      const ty = SEPTEMBER_WORLD_HEIGHT - 150;
      const tree = this.add.image(tx, ty, 'tree').setOrigin(0.5, 1);
      this.tweens.add({ targets: tree, angle: { from: -1.2, to: 1.2 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.obstacles.push({ x: tx - 10, y: ty - 40, width: 20, height: 40 });
    });

    [330, 560, 860].forEach((bx) => {
      const by = SEPTEMBER_WORLD_HEIGHT - 95;
      this.add.image(bx, by, 'bush').setOrigin(0.5, 1);
      this.obstacles.push({ x: bx - 22, y: by - 20, width: 44, height: 20 });
    });

    // Nastya's house on the right side of the world.
    this.houseX = SEPTEMBER_WORLD_WIDTH - 260;
    this.houseY = SEPTEMBER_WORLD_HEIGHT - 62;
    this.add.image(this.houseX, this.houseY, 'house').setOrigin(0.5, 1);
    this.obstacles.push({ x: this.houseX - 130, y: this.houseY - 210, width: 260, height: 210 });

    this.nastyaX = this.houseX - 90;

    // Small decorative flowers.
    for (let i = 0; i < 22; i += 1) {
      const fx = Phaser.Math.Between(40, SEPTEMBER_WORLD_WIDTH - 40);
      const fy = SEPTEMBER_WORLD_HEIGHT - Phaser.Math.Between(30, 90);
      const color = Phaser.Utils.Array.GetRandom([0xd68a8a, 0xf3d16b, 0xffffff, 0xb98adf]);
      this.add.circle(fx, fy, 3, color, 0.9);
    }

    const warm = this.add.rectangle(SEPTEMBER_WORLD_WIDTH / 2, SEPTEMBER_WORLD_HEIGHT / 2, SEPTEMBER_WORLD_WIDTH, SEPTEMBER_WORLD_HEIGHT, 0x7a2a1a, 0.12);
    warm.setDepth(30);
    warm.setScrollFactor(0);
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;

    const feetW = 18;
    const feetH = 12;

    const tryMove = (nx, ny) => {
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    let ny = character.y;
    if (tryMove(nx, ny) && nx > 20 && nx < SEPTEMBER_WORLD_WIDTH - 20) character.x = nx;

    nx = character.x;
    ny = character.y + stepY;
    if (tryMove(nx, ny) && ny > 60 && ny < SEPTEMBER_WORLD_HEIGHT - 20) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete' || this.questState === 'choosing' || this.questState === 'talking') return;
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);
    this.handleQuestLogic();
    gameInput.interactPressed = false;
  }

  handleQuestLogic() {
    if (this.questState !== 'find-nastya') return;

    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nastya.x, this.nastya.y);
    const near = dist < 80;
    if (near && !this.talkHint) {
      this.talkHint = createWorldHint(this, () => this.nastya.x, () => this.nastya.y - 62, 'Привітатись');
    }
    if (!near && this.talkHint) {
      this.talkHint.remove();
      this.talkHint = null;
    }
    if (this.talkHint) this.talkHint.update();

    if (near && (gameInput.interactPressed || Phaser.Input.Keyboard.JustDown(this.eKey))) {
      if (this.talkHint) { this.talkHint.remove(); this.talkHint = null; }
      this.questState = 'talking';
      showDialogueSequence(this.levelData.greetingDialogue, () => {
        this.questState = 'choosing';
        const choices = this.levelData.choices.map((c) => ({ id: c.id, label: c.label }));
        showDialogueChoices(this.levelData.questionText, choices, (chosen) => this.handleChoice(chosen));
      });
    }
  }

  handleChoice(chosen) {
    const full = this.levelData.choices.find((c) => c.id === chosen.id);
    this.choice = full;
    this.questState = 'talking';
    showDialogueSequence(full.dialogue, () => {
      if (full.id === 'tiktok-dinner') {
        this.cameras.main.flash(320, 255, 233, 168);
        this.goToKitchen();
      } else {
        this.playTimeSkip(full.timeSkipLabel, () => {
          showDialogueSequence(full.afterDialogue, () => {
            this.goToKitchen();
          });
        });
      }
    });
  }

  playTimeSkip(label, onDone) {
    const cam = this.cameras.main;
    cam.fadeOut(700);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(480, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(480, 250, label, {
        fontSize: '46px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const clock = this.add.text(480, 330, '⏰ 19:10  →  20:00', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const heart = this.add.text(480, 382, '♡', { fontSize: '34px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);

      this.tweens.add({ targets: [title, clock, heart], alpha: 1, duration: 500, delay: 150 });
      this.tweens.add({ targets: heart, y: 372, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(2200, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          clock.destroy();
          heart.destroy();
          onDone();
        });
      });
    });
  }

  goToKitchen() {
    this.questState = 'complete';
    this.scene.start('KitchenScene');
  }
}

/** Кухня — спільна сцена для обох варіантів вересня. */
class KitchenScene extends Phaser.Scene {
  constructor() { super('KitchenScene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'september-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · Кухня`;

    this.cameras.main.setBounds(0, 0, 1200, 620);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 420, 500, 'misha');
    this.nastya = new Character(this, 780, 500, 'nastya');
    this.player.sprite.setFlipX(true);
    this.nastya.sprite.setFlipX(true);

    this.questState = 'kitchen-dialogue';
    setQuestBanner('Тепла вечеря вдвох');
    this.cameras.main.fadeIn(900);

    // After a short pause, run the shared kitchen dialogue.
    this.time.delayedCall(1100, () => {
      const lines = [{ speaker: '', text: 'Кухня · Вересень 2025' }, ...this.levelData.kitchenDialogue];
      showDialogueSequence(lines, () => this.finishSeptember());
    });
  }

  buildEnvironment() {
    // Warm kitchen: wooden floor + cream walls.
    const wall = this.add.rectangle(600, 220, 1200, 440, 0xf2e2cf, 1);
    wall.setOrigin(0.5);
    const floor = this.add.rectangle(600, 480, 1200, 220, 0x9a6a4a, 1);
    floor.setOrigin(0.5);
    const baseboard = this.add.rectangle(600, 372, 1200, 12, 0x7a4f34, 1);
    baseboard.setOrigin(0.5);

    // Warm window light.
    const windowGlow = this.add.rectangle(600, 150, 260, 140, 0xffe9b8, 0.35);
    windowGlow.setOrigin(0.5);
    this.tweens.add({ targets: windowGlow, alpha: 0.2, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Cupboard decorations.
    const cupboard = this.add.rectangle(180, 230, 180, 220, 0x8a5a3a, 1);
    cupboard.setOrigin(0.5);
    this.add.rectangle(150, 180, 40, 60, 0x6b4128, 1);
    this.add.rectangle(210, 180, 40, 60, 0x6b4128, 1);
    this.add.rectangle(150, 275, 40, 80, 0x6b4128, 1);
    this.add.rectangle(210, 275, 40, 80, 0x6b4128, 1);

    // Small hanging plant and hearts for dreamy atmosphere.
    this.add.circle(1020, 130, 20, 0x4f8a4f, 0.9);
    this.add.circle(1040, 148, 16, 0x5a9755, 0.9);
    const pot = this.add.ellipse(1030, 118, 26, 14, 0x8a4f36, 1);
    pot.setOrigin(0.5, 0.5);

    this.add.text(960, 70, '♡', { fontSize: '28px', color: '#d68a8a' }).setOrigin(0.5);
    this.add.text(240, 70, '♡', { fontSize: '28px', color: '#d68a8a' }).setOrigin(0.5);

    // Kitchen table in the center.
    this.table = this.add.image(600, 470, 'kitchen_table').setOrigin(0.5, 1);
    this.obstacles = [{ x: 470, y: 400, width: 260, height: 40 }];

    // Warm romantic border glow.
    this.add.rectangle(0, 0, 1200, 12, 0x3a1a1a, 0.35).setOrigin(0);
    this.add.rectangle(0, 608, 1200, 12, 0x3a1a1a, 0.35).setOrigin(0);

    this.add.particles(0, 0, 'glow', {
      x: { min: 100, max: 1100 },
      y: { min: 80, max: 180 },
      lifespan: 5000,
      speedY: { min: -10, max: -2 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.18, end: 0 },
      alpha: { start: 0.7, end: 0 },
      frequency: 380
    });
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const tryMove = (nx, ny) => {
      const feetW = 18;
      const feetH = 12;
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < 1180) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < 600) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete') return;
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);

    gameInput.interactPressed = false;
  }

  finishSeptember() {
    this.questState = 'complete';
    setQuestBanner('🎱 Вечір продовжується...');

    this.cameras.main.fadeOut(1400, 30, 16, 14);
    this.time.delayedCall(700, () => {
      // Billiard table + ending text.
      const billiard = this.add.image(600, 460, 'billiard_table').setOrigin(0.5, 1).setAlpha(0);
      const title = this.add.text(600, 200, '🎱 Вечір продовжується...', {
        fontSize: '42px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setAlpha(0);
      const sub = this.add.text(600, 258, 'Схоже, вечір тільки починається... ♡', {
        fontSize: '22px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({ targets: billiard, alpha: 1, duration: 1200 });
      this.tweens.add({ targets: [title, sub], alpha: 1, duration: 900, delay: 500 });
      this.tweens.add({ targets: billiard, scaleX: 1.02, scaleY: 0.98, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

      this.time.delayedCall(2600, () => {
        applyStatGain(this.levelData.statGain);
        completeLevel(this.levelData.id);
        const alreadyFound = gameSave.memoriesFound.includes(this.levelData.memory.id);
        collectMemory(this.levelData.memory);
        setQuestBanner('Вересень 2025 завершено ❤️');
        const showCompletion = () => {
          showDialogueSequence([
            { speaker: '', text: 'Вересень 2025 завершено ❤️' },
            { speaker: '', text: 'Відкрито: Жовтень 2025 ✈️' }
          ]);
        };
        if (alreadyFound) {
          showCompletion();
        } else {
          memoryModalCloseCallback = showCompletion;
        }
      });
    });
  }
}

const OCTOBER_WORLD_WIDTH = 1200;
const OCTOBER_WORLD_HEIGHT = 620;

/** Жовтень 2025 — Міша та Настя вдома на кроваті. */
class October2025Scene extends Phaser.Scene {
  constructor() { super('October2025Scene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'october-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · ${this.levelData.subtitle}`;

    this.cameras.main.setBounds(0, 0, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 420, 500, 'misha');
    this.nastya = new Character(this, 700, 500, 'nastya');
    this.player.sprite.setFlipX(true);
    this.nastya.sprite.setFlipX(true);

    this.questState = 'bedroom-dialogue';
    setQuestBanner('Теплий вечір вдома');
    this.cameras.main.fadeIn(900);

    gameSave.october.started = true;
    saveGameSave(gameSave);

    // After a short pause, run the bedroom intro dialogue.
    this.time.delayedCall(1100, () => {
      showDialogueSequence(this.levelData.bedroomIntro, () => {
        this.questState = 'choosing';
        const choices = this.levelData.choices.map((c) => ({ id: c.id, label: c.label }));
        showDialogueChoices(this.levelData.questionText, choices, (chosen) => this.handleChoice(chosen));
      });
    });
  }

  buildEnvironment() {
    // Cozy bedroom: warm walls + wooden floor.
    const wall = this.add.rectangle(600, 220, OCTOBER_WORLD_WIDTH, 440, 0xf2d9c4, 1);
    wall.setOrigin(0.5);
    const floor = this.add.rectangle(600, 480, OCTOBER_WORLD_WIDTH, 220, 0x9a6a4a, 1);
    floor.setOrigin(0.5);
    const baseboard = this.add.rectangle(600, 372, OCTOBER_WORLD_WIDTH, 12, 0x7a4f34, 1);
    baseboard.setOrigin(0.5);

    // Warm evening window light.
    const windowGlow = this.add.rectangle(600, 150, 300, 160, 0xffe9b8, 0.3);
    windowGlow.setOrigin(0.5);
    this.tweens.add({ targets: windowGlow, alpha: 0.18, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Window frame.
    this.add.rectangle(600, 150, 300, 160, 0x8a5a3a, 0.4).setOrigin(0.5);
    this.add.rectangle(600, 150, 2, 160, 0x8a5a3a, 1).setOrigin(0.5);
    this.add.rectangle(600, 150, 300, 2, 0x8a5a3a, 1).setOrigin(0.5);

    // Bed in the center.
    this.bedX = 600;
    this.bedY = 470;
    this.add.image(this.bedX, this.bedY, 'bed').setOrigin(0.5, 1);
    this.obstacles = [{ x: this.bedX - 130, y: this.bedY - 100, width: 260, height: 100 }];

    // Nightstand with lamp.
    this.add.rectangle(180, 400, 60, 80, 0x6b4128, 1).setOrigin(0.5);
    this.add.circle(180, 360, 14, 0xf3d16b, 0.9);
    const lampGlow = this.add.circle(180, 360, 40, 0xffe9a8, 0.15);
    this.tweens.add({ targets: lampGlow, alpha: 0.05, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Small rug.
    this.add.ellipse(600, 560, 300, 60, 0xd68a8a, 0.25);

    // Hearts on the wall for dreamy atmosphere.
    this.add.text(960, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.add.text(240, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);

    // Soft floating particles.
    this.add.particles(0, 0, 'glow', {
      x: { min: 100, max: 1100 },
      y: { min: 80, max: 200 },
      lifespan: 5000,
      speedY: { min: -10, max: -2 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.18, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 400
    });

    // Warm romantic border glow.
    this.add.rectangle(0, 0, OCTOBER_WORLD_WIDTH, 12, 0x3a1a1a, 0.35).setOrigin(0);
    this.add.rectangle(0, 608, OCTOBER_WORLD_WIDTH, 12, 0x3a1a1a, 0.35).setOrigin(0);
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const tryMove = (nx, ny) => {
      const feetW = 18;
      const feetH = 12;
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < OCTOBER_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < 600) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete' || this.questState === 'choosing' || this.questState === 'talking' || this.questState === 'bedroom-dialogue') return;
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);
    gameInput.interactPressed = false;
  }

  handleChoice(chosen) {
    const full = this.levelData.choices.find((c) => c.id === chosen.id);
    this.choice = full;
    this.questState = 'talking';
    gameSave.october.choice = full.id;
    saveGameSave(gameSave);

    showDialogueSequence(full.dialogue, () => {
      if (full.id === 'walk') {
        this.goToWalk();
      } else if (full.id === 'pool') {
        this.goToPool();
      } else if (full.id === 'movie') {
        this.goToMovie();
      }
    });
  }

  goToWalk() {
    this.questState = 'complete';
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      this.scene.start('OctoberWalkScene');
    });
  }

  goToPool() {
    this.questState = 'complete';
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      this.scene.start('OctoberPoolScene');
    });
  }

  goToMovie() {
    this.questState = 'complete';
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      this.scene.start('OctoberMovieScene');
    });
  }
}

/** Варіант 1 — прогулянка по місту. */
class OctoberWalkScene extends Phaser.Scene {
  constructor() { super('OctoberWalkScene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'october-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · Прогулянка`;

    this.cameras.main.setBounds(0, 0, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 200, 500, 'misha');
    this.nastya = new Character(this, 300, 500, 'nastya');
    this.nastyaFollowing = true;

    this.cameras.main.startFollow(this.player.sprite, true, 0.09, 0.09);
    this.cameras.main.setDeadzone(120, 90);

    this.questState = 'walking';
    setQuestBanner('Прогулянка по місту');
    this.cameras.main.fadeIn(900);

    // After a short walk, show the ending.
    this.time.delayedCall(4000, () => this.finishWalk());
  }

  buildEnvironment() {
    // City street: grey-blue sky + asphalt.
    const skyTop = 0x8fa8c8;
    const skyBottom = 0x5a7a9a;
    const sky = this.add.graphics();
    sky.fillGradientStyle(skyTop, skyTop, skyBottom, skyBottom, 1);
    sky.fillRect(0, 0, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT);
    sky.setScrollFactor(0.2);

    // Buildings in the background.
    const buildings = this.add.graphics();
    buildings.fillStyle(0x6a7a8a, 0.7);
    for (let i = 0; i < 6; i += 1) {
      const bw = 120 + (i % 3) * 30;
      const bh = 120 + (i % 4) * 40;
      buildings.fillRect(i * 200, OCTOBER_WORLD_HEIGHT - 200 - bh, bw, bh);
      // Windows
      buildings.fillStyle(0xffe9a8, 0.5);
      for (let wy = 0; wy < 3; wy += 1) {
        for (let wx = 0; wx < 2; wx += 1) {
          buildings.fillRect(i * 200 + 20 + wx * 40, OCTOBER_WORLD_HEIGHT - 190 - bh + wy * 40, 20, 20);
        }
      }
      buildings.fillStyle(0x6a7a8a, 0.7);
    }
    buildings.setScrollFactor(0.5);

    // Sidewalk.
    this.add.tileSprite(OCTOBER_WORLD_WIDTH / 2, OCTOBER_WORLD_HEIGHT - 70, OCTOBER_WORLD_WIDTH, 160, 'path').setOrigin(0.5, 0.5);

    // Road.
    this.add.rectangle(OCTOBER_WORLD_WIDTH / 2, OCTOBER_WORLD_HEIGHT - 30, OCTOBER_WORLD_WIDTH, 60, 0x3a3a3a, 1).setOrigin(0.5);
    // Road markings.
    for (let i = 0; i < 8; i += 1) {
      this.add.rectangle(60 + i * 160, OCTOBER_WORLD_HEIGHT - 30, 60, 4, 0xfffaf8, 0.6).setOrigin(0.5);
    }

    // Trees along the street.
    this.obstacles = [];
    [150, 450, 750, 1050].forEach((tx) => {
      const tree = this.add.image(tx, OCTOBER_WORLD_HEIGHT - 150, 'tree').setOrigin(0.5, 1);
      this.tweens.add({ targets: tree, angle: { from: -1.2, to: 1.2 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.obstacles.push({ x: tx - 10, y: OCTOBER_WORLD_HEIGHT - 190, width: 20, height: 40 });
    });

    // Cinnabon / Starbucks signs.
    this.add.text(900, 300, '☕', { fontSize: '40px' }).setOrigin(0.5);
    this.add.text(900, 340, 'Starbucks', { fontSize: '16px', color: '#fffaf8', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(250, 300, '🍩', { fontSize: '40px' }).setOrigin(0.5);
    this.add.text(250, 340, 'Cinnabon', { fontSize: '16px', color: '#fffaf8', fontStyle: 'bold' }).setOrigin(0.5);

    // Clouds.
    for (let i = 0; i < 4; i += 1) {
      const cloud = this.add.ellipse(140 + i * 320, 80 + (i % 2) * 30, 110, 34, 0xffffff, 0.5);
      cloud.setScrollFactor(0.6);
      this.tweens.add({ targets: cloud, x: cloud.x + 70, duration: 9000 + i * 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    // Soft particles.
    this.add.particles(0, 0, 'glow', {
      x: { min: 0, max: OCTOBER_WORLD_WIDTH },
      y: { min: OCTOBER_WORLD_HEIGHT - 180, max: OCTOBER_WORLD_HEIGHT - 40 },
      lifespan: 4000,
      speedY: { min: -12, max: -4 },
      speedX: { min: -6, max: 6 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 300
    });
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const tryMove = (nx, ny) => {
      const feetW = 18;
      const feetH = 12;
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < OCTOBER_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < 600) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete') return;
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);

    if (this.nastyaFollowing) {
      const targetX = this.player.x - 46;
      const targetY = this.player.y;
      const dx = targetX - this.nastya.x;
      const dy = targetY - this.nastya.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        this.nastya.x += dx * Math.min(1, dt * 3);
        this.nastya.y += dy * Math.min(1, dt * 3);
        this.nastya.setMoving(true, dx < 0);
      } else {
        this.nastya.setMoving(false);
      }
    }
    this.nastya.update(delta);
    gameInput.interactPressed = false;
  }

  finishWalk() {
    this.questState = 'complete';
    this.player.setMoving(false);
    this.nastya.setMoving(false);

    this.cameras.main.fadeOut(1400, 30, 16, 14);
    this.time.delayedCall(700, () => {
      const title = this.add.text(600, 250, '🚶 Прогулянка по місту', {
        fontSize: '42px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setAlpha(0);
      const sub = this.add.text(600, 310, this.levelData.choices[0].endingText, {
        fontSize: '22px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({ targets: [title, sub], alpha: 1, duration: 900, delay: 500 });

      this.time.delayedCall(2600, () => this.completeOctober());
    });
  }

  completeOctober() {
    applyStatGain(this.levelData.statGain);
    completeLevel(this.levelData.id);
    gameSave.october.completed = true;
    saveGameSave(gameSave);
    setQuestBanner('Жовтень 2025 завершено ❤️');
    this.showNovemberUnlock();
  }

  showNovemberUnlock() {
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(600, 240, 'Жовтень 2025', {
        fontSize: '52px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const sub = this.add.text(600, 310, 'Ще один місяць нашої історії ❤️', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const next = this.add.text(600, 380, 'Далі — Листопад.', {
        fontSize: '28px',
        color: '#d68a8a',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);
      const heart = this.add.text(600, 440, '♡', { fontSize: '40px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(204).setAlpha(0);

      this.tweens.add({ targets: [title, sub, next, heart], alpha: 1, duration: 600, delay: 200 });
      this.tweens.add({ targets: heart, y: 430, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(3000, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          sub.destroy();
          next.destroy();
          heart.destroy();
        });
      });
    });
  }
}

/** Варіант 2 — басейн. */
class OctoberPoolScene extends Phaser.Scene {
  constructor() { super('OctoberPoolScene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'october-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · Басейн`;

    this.cameras.main.setBounds(0, 0, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 400, 500, 'misha');
    this.nastya = new Character(this, 600, 500, 'nastya');
    this.player.sprite.setFlipX(true);
    this.nastya.sprite.setFlipX(true);

    this.questState = 'pool-dialogue';
    setQuestBanner('Басейн · Разом');
    this.cameras.main.fadeIn(900);

    // After a short pause, run the pool dialogue.
    this.time.delayedCall(1100, () => {
      showDialogueSequence(this.levelData.poolDialogue, () => {
        this.questState = 'choosing';
        const choices = this.levelData.poolChoices.map((c) => ({ id: c.id, label: c.label }));
        showDialogueChoices(this.levelData.poolQuestionText, choices, (chosen) => this.handlePoolChoice(chosen));
      });
    });
  }

  buildEnvironment() {
    // Pool hall: light blue walls + tiled floor.
    const wall = this.add.rectangle(600, 220, OCTOBER_WORLD_WIDTH, 440, 0xc8e8f0, 1);
    wall.setOrigin(0.5);
    const floor = this.add.rectangle(600, 480, OCTOBER_WORLD_WIDTH, 220, 0x8ab8c8, 1);
    floor.setOrigin(0.5);
    const baseboard = this.add.rectangle(600, 372, OCTOBER_WORLD_WIDTH, 12, 0x5a8a9a, 1);
    baseboard.setOrigin(0.5);

    // Pool water in the center.
    this.poolX = 600;
    this.poolY = 420;
    const pool = this.add.rectangle(this.poolX, this.poolY, 700, 200, 0x2f7fa8, 0.8);
    pool.setOrigin(0.5);
    pool.setStrokeStyle(4, 0x1a5a7a, 1);

    // Water shimmer.
    this.add.tileSprite(this.poolX, this.poolY, 700, 200, 'pool_water').setOrigin(0.5).setAlpha(0.5);

    // Lane dividers.
    for (let i = 0; i < 4; i += 1) {
      const lane = this.add.rectangle(this.poolX - 300 + i * 200, this.poolY, 4, 200, 0xffffff, 0.4);
      lane.setOrigin(0.5);
    }

    // Light reflections on water.
    for (let i = 0; i < 5; i += 1) {
      const shimmer = this.add.ellipse(this.poolX - 250 + i * 120, this.poolY - 40 + (i % 2) * 40, 50, 10, 0xffffff, 0.2);
      this.tweens.add({ targets: shimmer, alpha: 0.05, duration: 1800 + i * 300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    // Pool edge.
    this.add.rectangle(this.poolX, this.poolY - 100, 720, 12, 0x4a7a8a, 1).setOrigin(0.5);
    this.add.rectangle(this.poolX, this.poolY + 100, 720, 12, 0x4a7a8a, 1).setOrigin(0.5);

    // Obstacles: pool edges.
    this.obstacles = [
      { x: this.poolX - 360, y: this.poolY - 100, width: 720, height: 12 },
      { x: this.poolX - 360, y: this.poolY + 100, width: 720, height: 12 }
    ];

    // Warm light glow.
    const glow = this.add.circle(this.poolX, 120, 200, 0xffe9a8, 0.12);
    this.tweens.add({ targets: glow, alpha: 0.05, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Soft particles.
    this.add.particles(0, 0, 'glow', {
      x: { min: 100, max: 1100 },
      y: { min: 80, max: 200 },
      lifespan: 5000,
      speedY: { min: -10, max: -2 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.18, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 400
    });

    // Hearts.
    this.add.text(960, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.add.text(240, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const tryMove = (nx, ny) => {
      const feetW = 18;
      const feetH = 12;
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < OCTOBER_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < 600) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete' || this.questState === 'choosing' || this.questState === 'talking' || this.questState === 'pool-dialogue') return;
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);
    gameInput.interactPressed = false;
  }

  handlePoolChoice(chosen) {
    this.questState = 'talking';
    gameSave.october.poolChoice = chosen.id;
    saveGameSave(gameSave);

    if (chosen.id === 'separate') {
      // Short transition, then complete October.
      this.cameras.main.fadeOut(700);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
        const title = this.add.text(600, 250, 'Після басейну...', {
          fontSize: '42px',
          color: '#fffaf8',
          fontFamily: 'Cormorant Garamond',
          fontStyle: '600'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
        const sub = this.add.text(600, 320, this.levelData.poolSeparateEnding, {
          fontSize: '24px',
          color: 'rgba(255,250,248,0.85)'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);

        this.tweens.add({ targets: [title, sub], alpha: 1, duration: 600, delay: 200 });

        this.time.delayedCall(2600, () => {
          this.completeOctober();
        });
      });
    } else {
      // Together: cinematic fade to black, time skip, then rain street scene.
      this.cameras.main.fadeOut(1200, 10, 7, 6);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
        const title = this.add.text(600, 250, 'Після басейну...', {
          fontSize: '42px',
          color: '#fffaf8',
          fontFamily: 'Cormorant Garamond',
          fontStyle: '600'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
        const sub = this.add.text(600, 320, 'Теплий вечір продовжується... ♡', {
          fontSize: '24px',
          color: 'rgba(255,250,248,0.85)'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);

        this.tweens.add({ targets: [title, sub], alpha: 1, duration: 600, delay: 200 });

        this.time.delayedCall(2200, () => {
          this.scene.start('OctoberRainScene');
        });
      });
    }
  }

  completeOctober() {
    applyStatGain(this.levelData.statGain);
    completeLevel(this.levelData.id);
    gameSave.october.completed = true;
    saveGameSave(gameSave);
    setQuestBanner('Жовтень 2025 завершено ❤️');
    this.showNovemberUnlock();
  }

  showNovemberUnlock() {
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(600, 240, 'Жовтень 2025', {
        fontSize: '52px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const sub = this.add.text(600, 310, 'Ще один місяць нашої історії ❤️', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const next = this.add.text(600, 380, 'Далі — Листопад.', {
        fontSize: '28px',
        color: '#d68a8a',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);
      const heart = this.add.text(600, 440, '♡', { fontSize: '40px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(204).setAlpha(0);

      this.tweens.add({ targets: [title, sub, next, heart], alpha: 1, duration: 600, delay: 200 });
      this.tweens.add({ targets: heart, y: 430, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(3000, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          sub.destroy();
          next.destroy();
          heart.destroy();
        });
      });
    });
  }
}

/** Варіант 2.2 — дощова вулиця після басейну. */
class OctoberRainScene extends Phaser.Scene {
  constructor() { super('OctoberRainScene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'october-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · Після басейну`;

    this.cameras.main.setBounds(0, 0, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 200, 500, 'misha');
    this.nastya = new Character(this, 300, 500, 'nastya');
    this.nastyaFollowing = true;

    this.cameras.main.startFollow(this.player.sprite, true, 0.09, 0.09);
    this.cameras.main.setDeadzone(120, 90);

    this.questState = 'walking';
    setQuestBanner('Прогулянка під дощем');
    this.cameras.main.fadeIn(900);

    // After a short walk, show the dialogue.
    this.time.delayedCall(3500, () => this.startRainDialogue());
  }

  buildEnvironment() {
    // Rainy street: dark grey sky + wet asphalt.
    const skyTop = 0x4a5a6a;
    const skyBottom = 0x2a3a4a;
    const sky = this.add.graphics();
    sky.fillGradientStyle(skyTop, skyTop, skyBottom, skyBottom, 1);
    sky.fillRect(0, 0, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT);
    sky.setScrollFactor(0.2);

    // Buildings in the background.
    const buildings = this.add.graphics();
    buildings.fillStyle(0x3a4a5a, 0.8);
    for (let i = 0; i < 6; i += 1) {
      const bw = 120 + (i % 3) * 30;
      const bh = 120 + (i % 4) * 40;
      buildings.fillRect(i * 200, OCTOBER_WORLD_HEIGHT - 200 - bh, bw, bh);
      // Dim windows.
      buildings.fillStyle(0xffe9a8, 0.2);
      for (let wy = 0; wy < 3; wy += 1) {
        for (let wx = 0; wx < 2; wx += 1) {
          buildings.fillRect(i * 200 + 20 + wx * 40, OCTOBER_WORLD_HEIGHT - 190 - bh + wy * 40, 20, 20);
        }
      }
      buildings.fillStyle(0x3a4a5a, 0.8);
    }
    buildings.setScrollFactor(0.5);

    // Wet sidewalk.
    this.add.tileSprite(OCTOBER_WORLD_WIDTH / 2, OCTOBER_WORLD_HEIGHT - 70, OCTOBER_WORLD_WIDTH, 160, 'path').setOrigin(0.5, 0.5).setTint(0x8a8a9a);

    // Road.
    this.add.rectangle(OCTOBER_WORLD_WIDTH / 2, OCTOBER_WORLD_HEIGHT - 30, OCTOBER_WORLD_WIDTH, 60, 0x2a2a2a, 1).setOrigin(0.5);
    // Road markings.
    for (let i = 0; i < 8; i += 1) {
      this.add.rectangle(60 + i * 160, OCTOBER_WORLD_HEIGHT - 30, 60, 4, 0xfffaf8, 0.3).setOrigin(0.5);
    }

    // Rain particles.
    this.add.particles(0, 0, 'glow', {
      x: { min: 0, max: OCTOBER_WORLD_WIDTH },
      y: { min: 0, max: OCTOBER_WORLD_HEIGHT },
      lifespan: 1200,
      speedY: { min: 300, max: 500 },
      speedX: { min: -20, max: 20 },
      scale: { start: 0.12, end: 0 },
      alpha: { start: 0.5, end: 0 },
      frequency: 60
    });

    // Rain streaks (lines).
    for (let i = 0; i < 30; i += 1) {
      const rx = Phaser.Math.Between(0, OCTOBER_WORLD_WIDTH);
      const ry = Phaser.Math.Between(0, OCTOBER_WORLD_HEIGHT);
      const streak = this.add.rectangle(rx, ry, 2, 20, 0x8ab8d8, 0.3);
      this.tweens.add({
        targets: streak,
        y: ry + 400,
        duration: 1200 + Phaser.Math.Between(0, 400),
        repeat: -1,
        ease: 'Linear'
      });
    }

    // Trees.
    this.obstacles = [];
    [150, 450, 750, 1050].forEach((tx) => {
      const tree = this.add.image(tx, OCTOBER_WORLD_HEIGHT - 150, 'tree').setOrigin(0.5, 1).setTint(0x4a5a4a);
      this.obstacles.push({ x: tx - 10, y: OCTOBER_WORLD_HEIGHT - 190, width: 20, height: 40 });
    });

    // Clouds.
    for (let i = 0; i < 4; i += 1) {
      const cloud = this.add.ellipse(140 + i * 320, 80 + (i % 2) * 30, 120, 36, 0x5a6a7a, 0.6);
      cloud.setScrollFactor(0.6);
      this.tweens.add({ targets: cloud, x: cloud.x + 60, duration: 9000 + i * 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const tryMove = (nx, ny) => {
      const feetW = 18;
      const feetH = 12;
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < OCTOBER_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < 600) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete' || this.questState === 'talking') return;
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);

    if (this.nastyaFollowing) {
      const targetX = this.player.x - 46;
      const targetY = this.player.y;
      const dx = targetX - this.nastya.x;
      const dy = targetY - this.nastya.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        this.nastya.x += dx * Math.min(1, dt * 3);
        this.nastya.y += dy * Math.min(1, dt * 3);
        this.nastya.setMoving(true, dx < 0);
      } else {
        this.nastya.setMoving(false);
      }
    }
    this.nastya.update(delta);
    gameInput.interactPressed = false;
  }

  startRainDialogue() {
    this.questState = 'talking';
    this.player.setMoving(false);
    this.nastya.setMoving(false);
    showDialogueSequence(this.levelData.poolTogetherDialogue, () => {
      this.questState = 'complete';
      setQuestBanner('Жовтень завершено ♡');
      this.cameras.main.fadeOut(1400, 30, 16, 14);
      this.time.delayedCall(700, () => {
        const title = this.add.text(600, 250, 'Жовтень завершено ♡', {
          fontSize: '42px',
          color: '#fffaf8',
          fontFamily: 'Cormorant Garamond',
          fontStyle: '600'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, duration: 900, delay: 500 });

        this.time.delayedCall(2600, () => {
          applyStatGain(this.levelData.statGain);
          completeLevel(this.levelData.id);
          gameSave.october.completed = true;
          saveGameSave(gameSave);
          this.showNovemberUnlock();
        });
      });
    });
  }

  showNovemberUnlock() {
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(600, 240, 'Жовтень 2025', {
        fontSize: '52px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const sub = this.add.text(600, 310, 'Ще один місяць нашої історії ❤️', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const next = this.add.text(600, 380, 'Далі — Листопад.', {
        fontSize: '28px',
        color: '#d68a8a',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);
      const heart = this.add.text(600, 440, '♡', { fontSize: '40px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(204).setAlpha(0);

      this.tweens.add({ targets: [title, sub, next, heart], alpha: 1, duration: 600, delay: 200 });
      this.tweens.add({ targets: heart, y: 430, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(3000, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          sub.destroy();
          next.destroy();
          heart.destroy();
        });
      });
    });
  }
}

/** Варіант 3 — фільм вдома. */
class OctoberMovieScene extends Phaser.Scene {
  constructor() { super('OctoberMovieScene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'october-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · Фільм`;

    this.cameras.main.setBounds(0, 0, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.buildEnvironment();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 420, 500, 'misha');
    this.nastya = new Character(this, 700, 500, 'nastya');
    this.player.sprite.setFlipX(true);
    this.nastya.sprite.setFlipX(true);

    this.questState = 'movie';
    setQuestBanner('Фільм разом');
    this.cameras.main.fadeIn(900);

    // Cinematic: 3 minutes time skip.
    this.time.delayedCall(1500, () => this.playThreeMinuteSkip());
  }

  buildEnvironment() {
    // Dark cozy room.
    const wall = this.add.rectangle(600, 220, OCTOBER_WORLD_WIDTH, 440, 0x2a1c14, 1);
    wall.setOrigin(0.5);
    const floor = this.add.rectangle(600, 480, OCTOBER_WORLD_WIDTH, 220, 0x3a2a1a, 1);
    floor.setOrigin(0.5);

    // TV on the left.
    this.tvX = 250;
    this.tvY = 300;
    this.add.image(this.tvX, this.tvY, 'tv').setOrigin(0.5);

    // TV screen glow.
    const tvGlow = this.add.rectangle(this.tvX, this.tvY, 200, 110, 0x4a8ab8, 0.3);
    tvGlow.setOrigin(0.5);
    this.tweens.add({ targets: tvGlow, alpha: 0.15, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // TV flicker.
    const flicker = this.add.rectangle(this.tvX, this.tvY, 200, 110, 0xffffff, 0.05);
    flicker.setOrigin(0.5);
    this.tweens.add({ targets: flicker, alpha: 0.12, duration: 300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Couch.
    this.add.rectangle(600, 480, 400, 80, 0x5a3a2a, 1).setOrigin(0.5);
    this.add.rectangle(600, 440, 400, 40, 0x6b4a3a, 1).setOrigin(0.5);
    this.add.rectangle(420, 440, 30, 80, 0x5a3a2a, 1).setOrigin(0.5);
    this.add.rectangle(780, 440, 30, 80, 0x5a3a2a, 1).setOrigin(0.5);

    // Coffee table.
    this.add.rectangle(600, 540, 200, 20, 0x4a2a1a, 1).setOrigin(0.5);
    this.add.rectangle(520, 550, 10, 20, 0x3a1a0a, 1).setOrigin(0.5);
    this.add.rectangle(680, 550, 10, 20, 0x3a1a0a, 1).setOrigin(0.5);

    // Popcorn.
    this.add.circle(560, 530, 12, 0xf3d16b, 0.9);
    this.add.circle(575, 525, 10, 0xf3d16b, 0.9);
    this.add.circle(590, 530, 12, 0xf3d16b, 0.9);

    // Obstacles.
    this.obstacles = [
      { x: 400, y: 400, width: 400, height: 80 },
      { x: 500, y: 500, width: 200, height: 20 }
    ];

    // Dim ambient light.
    const ambient = this.add.rectangle(600, 300, OCTOBER_WORLD_WIDTH, OCTOBER_WORLD_HEIGHT, 0x1a0a0a, 0.3);
    ambient.setOrigin(0.5);
    ambient.setScrollFactor(0);

    // Soft particles.
    this.add.particles(0, 0, 'glow', {
      x: { min: 100, max: 1100 },
      y: { min: 80, max: 200 },
      lifespan: 5000,
      speedY: { min: -10, max: -2 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.15, end: 0 },
      alpha: { start: 0.5, end: 0 },
      frequency: 450
    });
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const tryMove = (nx, ny) => {
      const feetW = 18;
      const feetH = 12;
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < OCTOBER_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < 600) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete' || this.questState === 'talking' || this.questState === 'movie') return;
    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);
    gameInput.interactPressed = false;
  }

  playThreeMinuteSkip() {
    this.questState = 'talking';
    this.player.setMoving(false);
    this.nastya.setMoving(false);

    const cam = this.cameras.main;
    cam.fadeOut(700);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(600, 250, this.levelData.movieAfter3Min, {
        fontSize: '46px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const clock = this.add.text(600, 330, '⏰ 21:00  →  21:03', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const heart = this.add.text(600, 382, '♡', { fontSize: '34px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);

      this.tweens.add({ targets: [title, clock, heart], alpha: 1, duration: 500, delay: 150 });
      this.tweens.add({ targets: heart, y: 372, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(2200, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          clock.destroy();
          heart.destroy();
          this.playClothingDrop();
        });
      });
    });
  }

  playClothingDrop() {
    // Comedy: a piece of clothing falls to the floor.
    const cloth = this.add.rectangle(600, 200, 30, 20, 0xd68a8a, 0.9);
    cloth.setOrigin(0.5);
    this.tweens.add({
      targets: cloth,
      y: 560,
      angle: 90,
      duration: 800,
      ease: 'Bounce.easeOut',
      onComplete: () => {
        this.add.text(600, 200, '*шурх*', {
          fontSize: '20px',
          color: 'rgba(255,250,248,0.7)',
          fontStyle: 'italic'
        }).setOrigin(0.5);
        this.time.delayedCall(1200, () => this.playThirtyMinuteSkip());
      }
    });
  }

  playThirtyMinuteSkip() {
    const cam = this.cameras.main;
    cam.fadeOut(700);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(600, 250, this.levelData.movieAfter30Min, {
        fontSize: '46px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const clock = this.add.text(600, 330, '⏰ 21:03  →  21:33', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const heart = this.add.text(600, 382, '♡', { fontSize: '34px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);

      this.tweens.add({ targets: [title, clock, heart], alpha: 1, duration: 500, delay: 150 });
      this.tweens.add({ targets: heart, y: 372, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(2200, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          clock.destroy();
          heart.destroy();
          this.startMovieDialogue();
        });
      });
    });
  }

  startMovieDialogue() {
    this.questState = 'talking';
    showDialogueSequence(this.levelData.movieDialogue, () => {
      this.questState = 'complete';
      setQuestBanner('Жовтень завершено ♡');
      this.cameras.main.fadeOut(1400, 30, 16, 14);
      this.time.delayedCall(700, () => {
        const title = this.add.text(600, 250, 'Жовтень завершено ♡', {
          fontSize: '42px',
          color: '#fffaf8',
          fontFamily: 'Cormorant Garamond',
          fontStyle: '600'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, duration: 900, delay: 500 });

        this.time.delayedCall(2600, () => {
          applyStatGain(this.levelData.statGain);
          completeLevel(this.levelData.id);
          gameSave.october.completed = true;
          saveGameSave(gameSave);
          this.showNovemberUnlock();
        });
      });
    });
  }

  showNovemberUnlock() {
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(600, 300, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(600, 240, 'Жовтень 2025', {
        fontSize: '52px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const sub = this.add.text(600, 310, 'Ще один місяць нашої історії ❤️', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const next = this.add.text(600, 380, 'Далі — Листопад.', {
        fontSize: '28px',
        color: '#d68a8a',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);
      const heart = this.add.text(600, 440, '♡', { fontSize: '40px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(204).setAlpha(0);

      this.tweens.add({ targets: [title, sub, next, heart], alpha: 1, duration: 600, delay: 200 });
      this.tweens.add({ targets: heart, y: 430, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(3000, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          sub.destroy();
          next.destroy();
          heart.destroy();
        });
      });
    });
  }
}

const NOVEMBER_WORLD_WIDTH = 1200;
const NOVEMBER_WORLD_HEIGHT = 620;

class November2025Scene extends Phaser.Scene {
  constructor() { super('November2025Scene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'november-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · ${this.levelData.subtitle}`;

    this.cameras.main.setBounds(0, 0, NOVEMBER_WORLD_WIDTH, NOVEMBER_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 420, 500, 'misha');
    this.nastya = new Character(this, 700, 500, 'nastya');
    this.player.sprite.setFlipX(true);
    this.nastya.sprite.setFlipX(true);

    this.questState = 'bedroom-intro';
    this.envObjects = [];
    this.memoryHelper = null;
    this.nastyaFollowing = false;

    setQuestBanner('Коли надворі холодно, а з тобою тепло');
    this.cameras.main.fadeIn(900);

    gameSave.november = gameSave.november || { started: false, completed: false };
    gameSave.november.started = true;
    saveGameSave(gameSave);

    this.buildBedroom();

    this.time.delayedCall(1100, () => {
      showDialogueSequence(this.levelData.bedroomIntro, () => {
        this.questState = 'bedroom-choosing';
        const choices = this.levelData.firstChoices.map((c) => ({ id: c.id, label: c.label }));
        showDialogueChoices(this.levelData.firstQuestionText, choices, (chosen) => this.handleFirstChoice(chosen));
      });
    });
  }

  clearEnv() {
    this.envObjects.forEach((obj) => {
      if (obj && obj.destroy) obj.destroy();
    });
    this.envObjects = [];
    this.obstacles = [];
  }

  buildBedroom() {
    this.clearEnv();
    const wall = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, 220, NOVEMBER_WORLD_WIDTH, 440, 0xf2d9c4, 1);
    wall.setOrigin(0.5);
    this.envObjects.push(wall);

    const floor = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, 480, NOVEMBER_WORLD_WIDTH, 220, 0x9a6a4a, 1);
    floor.setOrigin(0.5);
    this.envObjects.push(floor);

    const baseboard = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, 372, NOVEMBER_WORLD_WIDTH, 12, 0x7a4f34, 1);
    baseboard.setOrigin(0.5);
    this.envObjects.push(baseboard);

    const windowFrame = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, 150, 320, 170, 0x8a5a3a, 0.5).setOrigin(0.5);
    this.envObjects.push(windowFrame);

    const windowGlass = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, 150, 300, 150, 0x4a5a6a, 0.7).setOrigin(0.5);
    this.envObjects.push(windowGlass);

    for (let i = 0; i < 12; i++) {
      const rx = NOVEMBER_WORLD_WIDTH / 2 - 140 + Math.random() * 280;
      const ry = 80 + Math.random() * 140;
      const drop = this.add.rectangle(rx, ry, 2, 12 + Math.random() * 8, 0x8ab8d8, 0.4);
      this.tweens.add({
        targets: drop,
        y: ry + 60,
        duration: 800 + Math.random() * 400,
        repeat: -1,
        ease: 'Linear'
      });
      this.envObjects.push(drop);
    }

    this.bedX = NOVEMBER_WORLD_WIDTH / 2;
    this.bedY = 470;
    const bed = this.add.image(this.bedX, this.bedY, 'bed').setOrigin(0.5, 1);
    this.envObjects.push(bed);
    this.obstacles = [{ x: this.bedX - 130, y: this.bedY - 100, width: 260, height: 100 }];

    const nightstand = this.add.rectangle(180, 400, 60, 80, 0x6b4128, 1).setOrigin(0.5);
    this.envObjects.push(nightstand);
    const lamp = this.add.circle(180, 360, 14, 0xf3d16b, 0.9);
    this.envObjects.push(lamp);
    const lampGlow = this.add.circle(180, 360, 50, 0xffe9a8, 0.12);
    this.tweens.add({ targets: lampGlow, alpha: 0.04, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.envObjects.push(lampGlow);

    const warm = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2, NOVEMBER_WORLD_WIDTH, NOVEMBER_WORLD_HEIGHT, 0x7a2a1a, 0.08);
    warm.setDepth(30);
    warm.setScrollFactor(0);
    this.envObjects.push(warm);

    const emitter = this.add.particles(0, 0, 'glow', {
      x: { min: 100, max: NOVEMBER_WORLD_WIDTH - 100 },
      y: { min: 80, max: 200 },
      lifespan: 5000,
      speedY: { min: -10, max: -2 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.18, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 400
    });
    this.envObjects.push(emitter);

    const heartLeft = this.add.text(80, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.envObjects.push(heartLeft);
    const heartRight = this.add.text(NOVEMBER_WORLD_WIDTH - 80, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.envObjects.push(heartRight);
  }

  buildRainyStreet() {
    this.clearEnv();
    const skyTop = 0x4a5a6a;
    const skyBottom = 0x2a3a4a;
    const sky = this.add.graphics();
    sky.fillGradientStyle(skyTop, skyTop, skyBottom, skyBottom, 1);
    sky.fillRect(0, 0, NOVEMBER_WORLD_WIDTH, NOVEMBER_WORLD_HEIGHT);
    sky.setScrollFactor(0.2);
    this.envObjects.push(sky);

    const buildings = this.add.graphics();
    buildings.fillStyle(0x3a4a5a, 0.8);
    for (let i = 0; i < 6; i += 1) {
      const bw = 120 + (i % 3) * 30;
      const bh = 120 + (i % 4) * 40;
      buildings.fillRect(i * 200, NOVEMBER_WORLD_HEIGHT - 200 - bh, bw, bh);
      buildings.fillStyle(0xffe9a8, 0.15);
      for (let wy = 0; wy < 3; wy += 1) {
        for (let wx = 0; wx < 2; wx += 1) {
          buildings.fillRect(i * 200 + 20 + wx * 40, NOVEMBER_WORLD_HEIGHT - 190 - bh + wy * 40, 20, 20);
        }
      }
      buildings.fillStyle(0x3a4a5a, 0.8);
    }
    buildings.setScrollFactor(0.5);
    this.envObjects.push(buildings);

    const sidewalk = this.add.tileSprite(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT - 70, NOVEMBER_WORLD_WIDTH, 160, 'path').setOrigin(0.5, 0.5).setTint(0x8a8a9a);
    this.envObjects.push(sidewalk);

    const road = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT - 30, NOVEMBER_WORLD_WIDTH, 60, 0x2a2a2a, 1).setOrigin(0.5);
    this.envObjects.push(road);
    for (let i = 0; i < 8; i++) {
      const mark = this.add.rectangle(60 + i * 160, NOVEMBER_WORLD_HEIGHT - 30, 60, 4, 0xfffaf8, 0.3).setOrigin(0.5);
      this.envObjects.push(mark);
    }

    const rainEmitter = this.add.particles(0, 0, 'glow', {
      x: { min: 0, max: NOVEMBER_WORLD_WIDTH },
      y: { min: 0, max: NOVEMBER_WORLD_HEIGHT },
      lifespan: 1200,
      speedY: { min: 300, max: 500 },
      speedX: { min: -20, max: 20 },
      scale: { start: 0.12, end: 0 },
      alpha: { start: 0.5, end: 0 },
      frequency: 60
    });
    this.envObjects.push(rainEmitter);

    for (let i = 0; i < 30; i++) {
      const rx = Phaser.Math.Between(0, NOVEMBER_WORLD_WIDTH);
      const ry = Phaser.Math.Between(0, NOVEMBER_WORLD_HEIGHT);
      const streak = this.add.rectangle(rx, ry, 2, 20, 0x8ab8d8, 0.3);
      this.tweens.add({
        targets: streak,
        y: ry + 400,
        duration: 1200 + Phaser.Math.Between(0, 400),
        repeat: -1,
        ease: 'Linear'
      });
      this.envObjects.push(streak);
    }

    this.obstacles = [];
    [150, 450, 750, 1050].forEach((tx) => {
      const tree = this.add.image(tx, NOVEMBER_WORLD_HEIGHT - 150, 'tree').setOrigin(0.5, 1).setTint(0x4a5a4a);
      this.envObjects.push(tree);
      this.obstacles.push({ x: tx - 10, y: NOVEMBER_WORLD_HEIGHT - 190, width: 20, height: 40 });
    });

    for (let i = 0; i < 4; i++) {
      const cloud = this.add.ellipse(140 + i * 320, 80 + (i % 2) * 30, 120, 36, 0x5a6a7a, 0.6);
      cloud.setScrollFactor(0.6);
      this.tweens.add({ targets: cloud, x: cloud.x + 60, duration: 9000 + i * 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.envObjects.push(cloud);
    }
  }

  showTransitionOverlay(title, duration, onDone) {
    const cam = this.cameras.main;
    cam.fadeOut(700);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const text = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2, title, {
        fontSize: '42px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);

      this.tweens.add({ targets: text, alpha: 1, duration: 600, delay: 200 });

      this.time.delayedCall(duration, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          text.destroy();
          if (onDone) onDone();
        });
      });
    });
  }

  spawnMemory() {
    if (gameSave.memoriesFound.includes(this.levelData.memory.id)) return;
    const mx = NOVEMBER_WORLD_WIDTH / 2;
    const my = 320;
    const heart = this.add.text(mx, my, '♡', { fontSize: '30px', color: '#ffb3b3' }).setOrigin(0.5);
    this.tweens.add({ targets: heart, y: my - 8, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.memoryHelper = {
      x: mx,
      y: my,
      heart,
      collected: false,
      hint: createWorldHint(this, () => mx, () => my - 30, this.levelData.memory.label)
    };
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const feetW = 18;
    const feetH = 12;
    const tryMove = (nx, ny) => {
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < NOVEMBER_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < NOVEMBER_WORLD_HEIGHT - 20) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete') return;

    if (this.memoryHelper && !this.memoryHelper.collected) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.memoryHelper.x, this.memoryHelper.y);
      const near = dist < 60;
      if (near && this.memoryHelper.hint) {
        this.memoryHelper.hint.update();
      }
      if (near && (gameInput.interactPressed || Phaser.Input.Keyboard.JustDown(this.eKey))) {
        this.memoryHelper.collected = true;
        if (this.memoryHelper.hint) this.memoryHelper.hint.remove();
        this.memoryHelper.heart.destroy();
        collectMemory(this.levelData.memory);
        this.memoryHelper = null;
      } else if (!near && this.memoryHelper.hint) {
        this.memoryHelper.hint.remove();
        this.memoryHelper.hint = null;
      }
    }

    const movementStates = ['walking', 'walk-street', 'cozy-walking'];
    if (!movementStates.includes(this.questState)) {
      gameInput.interactPressed = false;
      return;
    }

    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);

    if (this.nastyaFollowing) {
      const targetX = this.player.x - 46;
      const targetY = this.player.y;
      const dx = targetX - this.nastya.x;
      const dy = targetY - this.nastya.y;
      const dist = Phaser.Math.Distance.Between(this.nastya.x, this.nastya.y, targetX, targetY);
      if (dist > 6) {
        this.nastya.x += dx * Math.min(1, dt * 3);
        this.nastya.y += dy * Math.min(1, dt * 3);
        this.nastya.setMoving(true, dx < 0);
      } else {
        this.nastya.setMoving(false);
      }
    }
    this.nastya.update(delta);
    gameInput.interactPressed = false;

    const charDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nastya.x, this.nastya.y);
    if (charDist < 80 && Math.random() < 0.015) {
      const hx = (this.player.x + this.nastya.x) / 2;
      const hy = (this.player.y + this.nastya.y) / 2 - 20;
      const heart = this.add.text(hx, hy, '♡', { fontSize: '14px', color: '#d68a8a' }).setOrigin(0.5).setAlpha(0.6);
      this.tweens.add({
        targets: heart,
        y: hy - 30,
        alpha: 0,
        duration: 1500,
        ease: 'Sine.inOut',
        onComplete: () => heart.destroy()
      });
    }
  }

  handleFirstChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.firstChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      if (full.id === 'stay') {
        this.questState = 'stay-food-choosing';
        const choices = this.levelData.stayFoodChoices.map((c) => ({ id: c.id, label: c.label }));
        showDialogueChoices(this.levelData.stayFoodQuestionText, choices, (ch) => this.handleStayFoodChoice(ch));
      } else if (full.id === 'walk') {
        this.startWalk();
      } else if (full.id === 'evening') {
        this.startOurEvening();
      }
    });
  }

  handleStayFoodChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.stayFoodChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      if (full.id === 'pancakes') {
        this.questState = 'banana-choosing';
        const choices = full.bananaChoices.map((c) => ({ id: c.id, label: c.label }));
        showDialogueChoices(full.bananaQuestionText, choices, (ch) => this.handleBananaChoice(ch, full));
      } else {
        this.continueAfterFood(full);
      }
    });
  }

  handleBananaChoice(chosen, foodItem) {
    this.questState = 'talking';
    const full = foodItem.bananaChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      this.continueAfterFood(foodItem);
    });
  }

  continueAfterFood(foodItem) {
    showDialogueSequence(foodItem.afterDialogue, () => {
      this.startCozyEvening();
    });
  }

  startOurEvening() {
    this.questState = 'talking';
    showDialogueSequence(this.levelData.ourEveningDialogue, () => {
      this.startCozyEvening();
    });
  }

  startCozyEvening() {
    this.questState = 'cozy-evening';
    this.player.setMoving(false);
    this.nastya.setMoving(false);
    showDialogueSequence(this.levelData.cozyEveningDialogue, () => {
      this.spawnMemory();
      this.questState = 'evening-choosing';
      const choices = this.levelData.eveningChoices.map((c) => ({ id: c.id, label: c.label }));
      showDialogueChoices(this.levelData.eveningQuestionText, choices, (chosen) => this.handleEveningChoice(chosen));
    });
  }

  handleEveningChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.eveningChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      this.startHealthScene();
    });
  }

  startWalk() {
    this.questState = 'talking';
    this.showTransitionOverlay('На вулиці...', 1500, () => {
      this.buildRainyStreet();
      this.player.x = 200;
      this.player.y = 500;
      this.nastya.x = 300;
      this.nastya.y = 500;
      this.nastyaFollowing = true;
      this.player.setMoving(false);
      this.nastya.setMoving(false);
      this.cameras.main.fadeIn(900);

      this.time.delayedCall(1100, () => {
        showDialogueSequence(this.levelData.walkIntroDialogue, () => {
          this.questState = 'walk-choosing';
          const choices = this.levelData.walkChoices.map((c) => ({ id: c.id, label: c.label }));
          showDialogueChoices(this.levelData.walkQuestionText, choices, (chosen) => this.handleWalkChoice(chosen));
        });
      });
    });
  }

  handleWalkChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.walkChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      this.walkEnd();
    });
  }

  walkEnd() {
    this.questState = 'talking';
    this.nastyaFollowing = false;
    this.showTransitionOverlay('Повертаємось додому...', 1500, () => {
      this.buildBedroom();
      this.player.x = 420;
      this.player.y = 500;
      this.nastya.x = 700;
      this.nastya.y = 500;
      this.nastyaFollowing = false;
      this.cameras.main.fadeIn(900);
      this.startHealthScene();
    });
  }

  startHealthScene() {
    this.questState = 'talking';
    this.showTransitionOverlay('Наступного дня...', 1500, () => {
      this.buildBedroom();
      this.player.x = 420;
      this.player.y = 500;
      this.nastya.x = 700;
      this.nastya.y = 500;
      this.nastyaFollowing = false;
      this.player.setMoving(false);
      this.nastya.setMoving(false);
      this.cameras.main.fadeIn(900);

      this.time.delayedCall(1100, () => {
        showDialogueSequence(this.levelData.healthIntroDialogue, () => {
          this.questState = 'health-choosing';
          const choices = this.levelData.healthChoices.map((c) => ({ id: c.id, label: c.label }));
          showDialogueChoices(this.levelData.healthQuestionText, choices, (chosen) => this.handleHealthChoice(chosen));
        });
      });
    });
  }

  handleHealthChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.healthChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      this.startFutureScene();
    });
  }

  startFutureScene() {
    this.questState = 'talking';
    this.showTransitionOverlay('Вечір...', 1500, () => {
      this.buildBedroom();
      this.player.x = 420;
      this.player.y = 500;
      this.nastya.x = 700;
      this.nastya.y = 500;
      this.player.setMoving(false);
      this.nastya.setMoving(false);
      this.cameras.main.fadeIn(900);

      this.time.delayedCall(1100, () => {
        showDialogueSequence(this.levelData.futureIntroDialogue, () => {
          this.questState = 'future-choosing';
          const choices = this.levelData.futureChoices.map((c) => ({ id: c.id, label: c.label }));
          showDialogueChoices(this.levelData.futureQuestionText, choices, (chosen) => this.handleFutureChoice(chosen));
        });
      });
    });
  }

  handleFutureChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.futureChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      this.startFinalScene();
    });
  }

  startFinalScene() {
    this.questState = 'final-scene';
    this.player.setMoving(false);
    this.nastya.setMoving(false);
    showDialogueSequence(this.levelData.finalDialogue, () => {
      this.questState = 'complete';
      this.cameras.main.fadeOut(1400, 30, 16, 14);
      this.time.delayedCall(700, () => {
        const lines = this.levelData.finalLines;
        const title = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2 - 80, lines[0], {
          fontSize: '48px',
          color: '#fffaf8',
          fontFamily: 'Cormorant Garamond',
          fontStyle: '600'
        }).setOrigin(0.5).setAlpha(0);
        const sub1 = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2 - 10, lines[1], {
          fontSize: '24px',
          color: 'rgba(255,250,248,0.85)'
        }).setOrigin(0.5).setAlpha(0);
        const sub2 = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2 + 40, lines[2], {
          fontSize: '24px',
          color: 'rgba(255,250,248,0.85)'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: [title, sub1, sub2], alpha: 1, duration: 900, delay: 500 });

        this.time.delayedCall(3000, () => {
          applyStatGain(this.levelData.statGain);
          completeLevel(this.levelData.id);
          gameSave.november.completed = true;
          saveGameSave(gameSave);
          setQuestBanner('Листопад 2025 завершено ❤️');
          this.showDecemberUnlock();
        });
      });
    });
  }

  showDecemberUnlock() {
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2 - 80, 'Листопад 2025', {
        fontSize: '52px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const sub = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2 - 10, 'Ще один місяць нашої історії ❤️', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const next = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2 + 50, '🔓 Грудень 2025 відкрито', {
        fontSize: '28px',
        color: '#d68a8a',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);
      const heart = this.add.text(NOVEMBER_WORLD_WIDTH / 2, NOVEMBER_WORLD_HEIGHT / 2 + 110, '♡', { fontSize: '40px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(204).setAlpha(0);

      this.tweens.add({ targets: [title, sub, next, heart], alpha: 1, duration: 600, delay: 200 });
      this.tweens.add({ targets: heart, y: NOVEMBER_WORLD_HEIGHT / 2 + 100, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(4000, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          sub.destroy();
          next.destroy();
          heart.destroy();
        });
      });
    });
  }
}

const DECEMBER_WORLD_WIDTH = 1200;
const DECEMBER_WORLD_HEIGHT = 620;

class December2025Scene extends Phaser.Scene {
  constructor() { super('December2025Scene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'december-2025');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · ${this.levelData.subtitle}`;

    this.cameras.main.setBounds(0, 0, DECEMBER_WORLD_WIDTH, DECEMBER_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 420, 500, 'misha');
    this.nastya = new Character(this, 700, 500, 'nastya');
    this.player.sprite.setFlipX(true);
    this.nastya.sprite.setFlipX(true);

    this.questState = 'intro';
    this.envObjects = [];
    this.memoryHelper = null;
    this.nastyaFollowing = false;

    setQuestBanner('Новий прекрасний досвід');
    this.cameras.main.fadeIn(900);

    gameSave.december = gameSave.december || { started: false, completed: false };
    gameSave.december.started = true;
    saveGameSave(gameSave);

    this.buildCozyRoom();

    this.time.delayedCall(1100, () => {
      showDialogueSequence(this.levelData.introDialogue, () => {
        showDialogueSequence(this.levelData.suggestionDialogue, () => {
          this.questState = 'choosing';
          const choices = this.levelData.choices.map((c) => ({ id: c.id, label: c.label }));
          showDialogueChoices(this.levelData.questionText, choices, (chosen) => this.handleChoice(chosen));
        });
      });
    });
  }

  clearEnv() {
    this.envObjects.forEach((obj) => {
      if (obj && obj.destroy) obj.destroy();
    });
    this.envObjects = [];
    this.obstacles = [];
  }

  buildCozyRoom() {
    this.clearEnv();
    const wall = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, 220, DECEMBER_WORLD_WIDTH, 440, 0xf2d9c4, 1);
    wall.setOrigin(0.5);
    this.envObjects.push(wall);

    const floor = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, 480, DECEMBER_WORLD_WIDTH, 220, 0x9a6a4a, 1);
    floor.setOrigin(0.5);
    this.envObjects.push(floor);

    const baseboard = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, 372, DECEMBER_WORLD_WIDTH, 12, 0x7a4f34, 1);
    baseboard.setOrigin(0.5);
    this.envObjects.push(baseboard);

    const windowFrame = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, 150, 320, 170, 0x8a5a3a, 0.5).setOrigin(0.5);
    this.envObjects.push(windowFrame);

    const windowGlass = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, 150, 300, 150, 0x3a4a5a, 0.7).setOrigin(0.5);
    this.envObjects.push(windowGlass);

    for (let i = 0; i < 8; i++) {
      const sx = DECEMBER_WORLD_WIDTH / 2 - 120 + Math.random() * 240;
      const sy = 90 + Math.random() * 100;
      const flake = this.add.circle(sx, sy, 2 + Math.random() * 2, 0xffffff, 0.6);
      this.tweens.add({
        targets: flake,
        y: sy + 60 + Math.random() * 40,
        x: sx + (Math.random() - 0.5) * 40,
        alpha: 0,
        duration: 3000 + Math.random() * 2000,
        repeat: -1,
        ease: 'Sine.inOut',
        onRepeat: () => {
          flake.x = DECEMBER_WORLD_WIDTH / 2 - 120 + Math.random() * 240;
          flake.y = 90 + Math.random() * 40;
          flake.setAlpha(0.6);
        }
      });
      this.envObjects.push(flake);
    }

    this.bedX = DECEMBER_WORLD_WIDTH / 2;
    this.bedY = 470;
    const bed = this.add.image(this.bedX, this.bedY, 'bed').setOrigin(0.5, 1);
    this.envObjects.push(bed);
    this.obstacles = [{ x: this.bedX - 130, y: this.bedY - 100, width: 260, height: 100 }];

    const nightstand = this.add.rectangle(180, 400, 60, 80, 0x6b4128, 1).setOrigin(0.5);
    this.envObjects.push(nightstand);
    const lamp = this.add.circle(180, 360, 14, 0xf3d16b, 0.9);
    this.envObjects.push(lamp);
    const lampGlow = this.add.circle(180, 360, 50, 0xffe9a8, 0.12);
    this.tweens.add({ targets: lampGlow, alpha: 0.04, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.envObjects.push(lampGlow);

    const warm = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2, DECEMBER_WORLD_WIDTH, DECEMBER_WORLD_HEIGHT, 0x7a2a1a, 0.08);
    warm.setDepth(30);
    warm.setScrollFactor(0);
    this.envObjects.push(warm);

    const emitter = this.add.particles(0, 0, 'glow', {
      x: { min: 100, max: DECEMBER_WORLD_WIDTH - 100 },
      y: { min: 80, max: 200 },
      lifespan: 5000,
      speedY: { min: -10, max: -2 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.18, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 400
    });
    this.envObjects.push(emitter);

    const heartLeft = this.add.text(80, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.envObjects.push(heartLeft);
    const heartRight = this.add.text(DECEMBER_WORLD_WIDTH - 80, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.envObjects.push(heartRight);
  }

  showTransitionOverlay(title, duration, onDone) {
    const cam = this.cameras.main;
    cam.fadeOut(700);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const text = this.add.text(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2, title, {
        fontSize: '42px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);

      this.tweens.add({ targets: text, alpha: 1, duration: 600, delay: 200 });

      this.time.delayedCall(duration, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          text.destroy();
          if (onDone) onDone();
        });
      });
    });
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const feetW = 18;
    const feetH = 12;
    const tryMove = (nx, ny) => {
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < DECEMBER_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < DECEMBER_WORLD_HEIGHT - 20) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete') return;

    const movementStates = ['walking', 'cozy-walking'];
    if (!movementStates.includes(this.questState)) {
      gameInput.interactPressed = false;
      return;
    }

    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);

    if (this.nastyaFollowing) {
      const targetX = this.player.x - 46;
      const targetY = this.player.y;
      const dx = targetX - this.nastya.x;
      const dy = targetY - this.nastya.y;
      const dist = Phaser.Math.Distance.Between(this.nastya.x, this.nastya.y, targetX, targetY);
      if (dist > 6) {
        this.nastya.x += dx * Math.min(1, dt * 3);
        this.nastya.y += dy * Math.min(1, dt * 3);
        this.nastya.setMoving(true, dx < 0);
      } else {
        this.nastya.setMoving(false);
      }
    }
    this.nastya.update(delta);
    gameInput.interactPressed = false;

    const charDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nastya.x, this.nastya.y);
    if (charDist < 80 && Math.random() < 0.015) {
      const hx = (this.player.x + this.nastya.x) / 2;
      const hy = (this.player.y + this.nastya.y) / 2 - 20;
      const heart = this.add.text(hx, hy, '♡', { fontSize: '14px', color: '#d68a8a' }).setOrigin(0.5).setAlpha(0.6);
      this.tweens.add({
        targets: heart,
        y: hy - 30,
        alpha: 0,
        duration: 1500,
        ease: 'Sine.inOut',
        onComplete: () => heart.destroy()
      });
    }
  }

  handleChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.choices.find((c) => c.id === chosen.id);
    showDialogueSequence(full.dialogue, () => {
      if (full.id === 'tree') {
        showDialogueSequence(full.afterDialogue, () => {
          this.startFinalScene();
        });
      } else if (full.id === 'icecream') {
        showDialogueSequence(full.afterDialogue, () => {
          this.startFinalScene();
        });
      } else if (full.id === 'letters') {
        this.questState = 'letter-choosing';
        const choices = full.letterChoices.map((c) => ({ id: c.id, label: c.label }));
        showDialogueChoices(full.letterQuestionText, choices, (ch) => this.handleLetterChoice(ch, full));
      }
    });
  }

  handleLetterChoice(chosen, full) {
    this.questState = 'talking';
    const letterFull = full.letterChoices.find((c) => c.id === chosen.id);
    showDialogueSequence(letterFull.dialogue, () => {
      collectMemory(full.memory);
      this.time.delayedCall(1500, () => {
        showDialogueSequence(full.afterDialogue, () => {
          this.startFinalScene();
        });
      });
    });
  }

  startFinalScene() {
    this.questState = 'final';
    this.player.setMoving(false);
    this.nastya.setMoving(false);
    showDialogueSequence(this.levelData.finalDialogue, () => {
      this.questState = 'complete';
      this.cameras.main.fadeOut(1400, 30, 16, 14);
      this.time.delayedCall(700, () => {
        const lines = this.levelData.finalLines;
        const title = this.add.text(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2 - 80, lines[0], {
          fontSize: '48px',
          color: '#fffaf8',
          fontFamily: 'Cormorant Garamond',
          fontStyle: '600'
        }).setOrigin(0.5).setAlpha(0);
        const sub1 = this.add.text(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2 - 10, lines[1], {
          fontSize: '24px',
          color: 'rgba(255,250,248,0.85)'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: [title, sub1], alpha: 1, duration: 900, delay: 500 });

        this.time.delayedCall(3000, () => {
          applyStatGain(this.levelData.statGain);
          completeLevel(this.levelData.id);
          gameSave.december.completed = true;
          saveGameSave(gameSave);
          setQuestBanner('Грудень 2025 завершено ❤️');
          this.showJanuaryUnlock();
        });
      });
    });
  }

  showJanuaryUnlock() {
    const cam = this.cameras.main;
    cam.fadeOut(900);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2 - 80, 'Грудень 2025', {
        fontSize: '52px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const sub = this.add.text(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2 - 10, 'Ще один місяць нашої історії ❤️', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const next = this.add.text(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2 + 50, '🔓 Січень 2026 відкрито', {
        fontSize: '28px',
        color: '#d68a8a',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);
      const heart = this.add.text(DECEMBER_WORLD_WIDTH / 2, DECEMBER_WORLD_HEIGHT / 2 + 110, '♡', { fontSize: '40px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(204).setAlpha(0);

      this.tweens.add({ targets: [title, sub, next, heart], alpha: 1, duration: 600, delay: 200 });
      this.tweens.add({ targets: heart, y: DECEMBER_WORLD_HEIGHT / 2 + 100, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(4000, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          sub.destroy();
          next.destroy();
          heart.destroy();
        });
      });
    });
  }
}

const JANUARY_WORLD_WIDTH = 1200;
const JANUARY_WORLD_HEIGHT = 620;

class January2025Scene extends Phaser.Scene {
  constructor() { super('January2025Scene'); }

  create() {
    this.levelData = GAME_DATA.levels.find((l) => l.id === 'january-2026');
    document.getElementById('gameChapterLabel').textContent = `${this.levelData.title} · ${this.levelData.subtitle}`;

    this.cameras.main.setBounds(0, 0, JANUARY_WORLD_WIDTH, JANUARY_WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor('#1b1410');

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
    this.eKey = this.input.keyboard.addKey('E');

    this.player = new Character(this, 420, 500, 'misha');
    this.nastya = new Character(this, 700, 500, 'nastya');
    this.player.sprite.setFlipX(true);
    this.nastya.sprite.setFlipX(true);

    this.questState = 'intro';
    this.envObjects = [];
    this.memoryHelper = null;
    this.nastyaFollowing = false;

    setQuestBanner('Новий рік — нові стосунки');
    this.cameras.main.fadeIn(900);

    gameSave.january = gameSave.january || { started: false, completed: false };
    gameSave.january.started = true;
    saveGameSave(gameSave);

    this.buildCozyRoom();

    this.time.delayedCall(1100, () => {
      showDialogueSequence(this.levelData.introDialogue, () => {
        this.questState = 'talking';
        this.showTimeSkip(() => {
          showDialogueSequence(this.levelData.afterSkipDialogue, () => {
            this.questState = 'choosing';
            const choices = this.levelData.choices.map((c) => ({ id: c.id, label: c.label }));
            showDialogueChoices(this.levelData.questionText, choices, (chosen) => this.handleChoice(chosen));
          });
        });
      });
    });
  }

  clearEnv() {
    this.envObjects.forEach((obj) => {
      if (obj && obj.destroy) obj.destroy();
    });
    this.envObjects = [];
    this.obstacles = [];
  }

  buildCozyRoom() {
    this.clearEnv();
    const wall = this.add.rectangle(JANUARY_WORLD_WIDTH / 2, 220, JANUARY_WORLD_WIDTH, 440, 0xf2d9c4, 1);
    wall.setOrigin(0.5);
    this.envObjects.push(wall);

    const floor = this.add.rectangle(JANUARY_WORLD_WIDTH / 2, 480, JANUARY_WORLD_WIDTH, 220, 0x9a6a4a, 1);
    floor.setOrigin(0.5);
    this.envObjects.push(floor);

    const baseboard = this.add.rectangle(JANUARY_WORLD_WIDTH / 2, 372, JANUARY_WORLD_WIDTH, 12, 0x7a4f34, 1);
    baseboard.setOrigin(0.5);
    this.envObjects.push(baseboard);

    const windowFrame = this.add.rectangle(JANUARY_WORLD_WIDTH / 2, 150, 320, 170, 0x8a5a3a, 0.5).setOrigin(0.5);
    this.envObjects.push(windowFrame);

    const windowGlass = this.add.rectangle(JANUARY_WORLD_WIDTH / 2, 150, 300, 150, 0x4a5a6a, 0.7).setOrigin(0.5);
    this.envObjects.push(windowGlass);

    for (let i = 0; i < 8; i++) {
      const sx = JANUARY_WORLD_WIDTH / 2 - 140 + Math.random() * 280;
      const sy = 80 + Math.random() * 100;
      const flake = this.add.circle(sx, sy, 2 + Math.random() * 2, 0xffffff, 0.6);
      this.tweens.add({
        targets: flake,
        y: sy + 60 + Math.random() * 40,
        x: sx + (Math.random() - 0.5) * 40,
        alpha: 0,
        duration: 3000 + Math.random() * 2000,
        repeat: -1,
        ease: 'Sine.inOut',
        onRepeat: () => {
          flake.x = JANUARY_WORLD_WIDTH / 2 - 140 + Math.random() * 280;
          flake.y = 80 + Math.random() * 40;
          flake.setAlpha(0.6);
        }
      });
      this.envObjects.push(flake);
    }

    this.bedX = JANUARY_WORLD_WIDTH / 2;
    this.bedY = 470;
    const bed = this.add.image(this.bedX, this.bedY, 'bed').setOrigin(0.5, 1);
    this.envObjects.push(bed);
    this.obstacles = [{ x: this.bedX - 130, y: this.bedY - 100, width: 260, height: 100 }];

    const nightstand = this.add.rectangle(180, 400, 60, 80, 0x6b4128, 1).setOrigin(0.5);
    this.envObjects.push(nightstand);
    const lamp = this.add.circle(180, 360, 14, 0xf3d16b, 0.9);
    this.envObjects.push(lamp);
    const lampGlow = this.add.circle(180, 360, 50, 0xffe9a8, 0.12);
    this.tweens.add({ targets: lampGlow, alpha: 0.04, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.envObjects.push(lampGlow);

    const warm = this.add.rectangle(JANUARY_WORLD_WIDTH / 2, JANUARY_WORLD_HEIGHT / 2, JANUARY_WORLD_WIDTH, JANUARY_WORLD_HEIGHT, 0x7a2a1a, 0.08);
    warm.setDepth(30);
    warm.setScrollFactor(0);
    this.envObjects.push(warm);

    const emitter = this.add.particles(0, 0, 'glow', {
      x: { min: 100, max: JANUARY_WORLD_WIDTH - 100 },
      y: { min: 80, max: 200 },
      lifespan: 5000,
      speedY: { min: -10, max: -2 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.18, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 400
    });
    this.envObjects.push(emitter);

    const heartLeft = this.add.text(80, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.envObjects.push(heartLeft);
    const heartRight = this.add.text(JANUARY_WORLD_WIDTH - 80, 90, '♡', { fontSize: '30px', color: '#d68a8a' }).setOrigin(0.5);
    this.envObjects.push(heartRight);
  }

  showTimeSkip(onDone) {
    const cam = this.cameras.main;
    cam.fadeOut(700);
    cam.once('camerafadeoutcomplete', () => {
      const overlay = this.add.rectangle(JANUARY_WORLD_WIDTH / 2, JANUARY_WORLD_HEIGHT / 2, 2000, 1200, 0x1b1410, 1).setScrollFactor(0).setDepth(200);
      const title = this.add.text(JANUARY_WORLD_WIDTH / 2, JANUARY_WORLD_HEIGHT / 2 - 40, this.levelData.timeSkipText, {
        fontSize: '46px',
        color: '#fffaf8',
        fontFamily: 'Cormorant Garamond',
        fontStyle: '600'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
      const clock = this.add.text(JANUARY_WORLD_WIDTH / 2, JANUARY_WORLD_HEIGHT / 2 + 20, '⏰ 23:30  →  00:20', {
        fontSize: '24px',
        color: 'rgba(255,250,248,0.85)'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setAlpha(0);
      const heart = this.add.text(JANUARY_WORLD_WIDTH / 2, JANUARY_WORLD_HEIGHT / 2 + 70, '♡', { fontSize: '34px', color: '#d68a8a' }).setOrigin(0.5).setScrollFactor(0).setDepth(203).setAlpha(0);

      this.tweens.add({ targets: [title, clock, heart], alpha: 1, duration: 500, delay: 150 });
      this.tweens.add({ targets: heart, y: JANUARY_WORLD_HEIGHT / 2 + 60, duration: 900, yoyo: true, repeat: 1, ease: 'Sine.inOut' });

      this.time.delayedCall(2200, () => {
        cam.fadeIn(700);
        cam.once('camerafadeincomplete', () => {
          overlay.destroy();
          title.destroy();
          clock.destroy();
          heart.destroy();
          if (onDone) onDone();
        });
      });
    });
  }

  moveCharacterWithCollision(character, vx, vy, dt) {
    if (vx === 0 && vy === 0) {
      character.setMoving(false);
      return;
    }
    const stepX = vx * PLAYER_SPEED * dt;
    const stepY = vy * PLAYER_SPEED * dt;
    const feetW = 18;
    const feetH = 12;
    const tryMove = (nx, ny) => {
      const box = { x: nx - feetW / 2, y: ny - feetH, width: feetW, height: feetH };
      return !this.obstacles.some((o) =>
        box.x < o.x + o.width && box.x + box.width > o.x && box.y < o.y + o.height && box.y + box.height > o.y
      );
    };

    let nx = character.x + stepX;
    if (tryMove(nx, character.y) && nx > 20 && nx < JANUARY_WORLD_WIDTH - 20) character.x = nx;

    let ny = character.y + stepY;
    if (tryMove(character.x, ny) && ny > 120 && ny < JANUARY_WORLD_HEIGHT - 20) character.y = ny;

    character.setMoving(true, vx < 0 ? true : vx > 0 ? false : undefined);
  }

  update(time, delta) {
    if (this.questState === 'complete') return;

    const movementStates = ['walking', 'cozy-walking'];
    if (!movementStates.includes(this.questState)) {
      gameInput.interactPressed = false;
      return;
    }

    const dt = delta / 1000;
    const move = readMoveVector(this);
    this.moveCharacterWithCollision(this.player, move.x, move.y, dt);
    this.player.update(delta);

    if (this.nastyaFollowing) {
      const targetX = this.player.x - 46;
      const targetY = this.player.y;
      const dx = targetX - this.nastya.x;
      const dy = targetY - this.nastya.y;
      const dist = Phaser.Math.Distance.Between(this.nastya.x, this.nastya.y, targetX, targetY);
      if (dist > 6) {
        this.nastya.x += dx * Math.min(1, dt * 3);
        this.nastya.y += dy * Math.min(1, dt * 3);
        this.nastya.setMoving(true, dx < 0);
      } else {
        this.nastya.setMoving(false);
      }
    }
    this.nastya.update(delta);
    gameInput.interactPressed = false;

    const charDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nastya.x, this.nastya.y);
    if (charDist < 80 && Math.random() < 0.015) {
      const hx = (this.player.x + this.nastya.x) / 2;
      const hy = (this.player.y + this.nastya.y) / 2 - 20;
      const heart = this.add.text(hx, hy, '♡', { fontSize: '14px', color: '#d68a8a' }).setOrigin(0.5).setAlpha(0.6);
      this.tweens.add({
        targets: heart,
        y: hy - 30,
        alpha: 0,
        duration: 1500,
        ease: 'Sine.inOut',
        onComplete: () => heart.destroy()
      });
    }
  }

  handleChoice(chosen) {
    this.questState = 'talking';
    const full = this.levelData.choices.find((c) => c.id === chosen.id);
    if (full.id === 'game') {
      this.startRockPaperScissors(full);
    } else if (full.id === 'photos') {
      this.startPhotoGallery(full);
    } else if (full.id === 'talk') {
      this.startFutureTalk(full);
    }
  }

  startRockPaperScissors(choiceData) {
    showDialogueSequence(choiceData.dialogue, () => {
      this.questState = 'rps-playing';
      const options = [
        { id: 'rock', label: '🪨 Камінь' },
        { id: 'scissors', label: '✂️ Ножиці' },
        { id: 'paper', label: '📄 Папір' }
      ];
      showDialogueChoices('Обирай:', options, (chosen) => {
        const mishaPick = chosen.id;
        const picks = ['rock', 'scissors', 'paper'];
        const nastyaPick = picks[Phaser.Math.Between(0, 2)];
        const result = this.resolveRPS(mishaPick, nastyaPick);
        const resultDialogue = result === 'misha' ? choiceData.winMisha : choiceData.winNastya;
        showDialogueSequence(resultDialogue, () => {
          this.startFinalScene();
        });
      });
    });
  }

  resolveRPS(misha, nastya) {
    if (misha === nastya) return 'misha';
    if (
      (misha === 'rock' && nastya === 'scissors') ||
      (misha === 'scissors' && nastya === 'paper') ||
      (misha === 'paper' && nastya === 'rock')
    ) {
      return 'misha';
    }
    return 'nastya';
  }

  startPhotoGallery(choiceData) {
    window.location.href = 'memories.html';
  }

  startFutureTalk(choiceData) {
    this.questState = 'talking';
    showDialogueSequence(choiceData.dialogue, () => {
      this.questState = 'future-choosing';
      const choices = choiceData.futureChoices.map((c) => ({ id: c.id, label: c.label }));
      showDialogueChoices(choiceData.futureQuestionText, choices, (chosen) => {
        const full = choiceData.futureChoices.find((c) => c.id === chosen.id);
        showDialogueSequence(full.dialogue, () => {
          this.startFinalScene();
        });
      });
    });
  }

  startFinalScene() {
    this.questState = 'final';
    this.player.setMoving(false);
    this.nastya.setMoving(false);
    showDialogueSequence(this.levelData.finalDialogue, () => {
      this.questState = 'complete';
      this.cameras.main.fadeOut(1400, 30, 16, 14);
      this.time.delayedCall(700, () => {
        const lines = this.levelData.finalLines;
        const title = this.add.text(JANUARY_WORLD_WIDTH / 2, JANUARY_WORLD_HEIGHT / 2 - 60, lines[0], {
          fontSize: '48px',
          color: '#fffaf8',
          fontFamily: 'Cormorant Garamond',
          fontStyle: '600'
        }).setOrigin(0.5).setAlpha(0);
        const sub = this.add.text(JANUARY_WORLD_WIDTH / 2, JANUARY_WORLD_HEIGHT / 2 + 20, lines[1], {
          fontSize: '24px',
          color: 'rgba(255,250,248,0.85)'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: [title, sub], alpha: 1, duration: 900, delay: 500 });

        this.time.delayedCall(3000, () => {
          applyStatGain(this.levelData.statGain);
          completeLevel(this.levelData.id);
          gameSave.january.completed = true;
          saveGameSave(gameSave);
          setQuestBanner('Січень 2026 завершено ❤️');
        });
      });
    });
  }

  showGameToast(text) {
    const toast = document.getElementById('gameToast');
    if (toast) {
      toast.textContent = text;
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 2200);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileControls();

  document.getElementById('gameMemoryClose').addEventListener('click', closeMemoryModal);
  document.getElementById('gameMemoryModal').addEventListener('click', (e) => {
    if (e.target.id === 'gameMemoryModal') closeMemoryModal();
  });

  updateStatsHud();
  setupWorldMenu();

  const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvasHost',
    width: 960,
    height: 600,
    backgroundColor: '#1b1410',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [
      BootScene,
      August2025Scene,
      September2025Scene,
      KitchenScene,
      October2025Scene,
      OctoberWalkScene,
      OctoberPoolScene,
      OctoberRainScene,
      OctoberMovieScene,
      November2025Scene,
      December2025Scene,
      January2025Scene
    ]
  };

  window.storyGame = new Phaser.Game(config);
});
