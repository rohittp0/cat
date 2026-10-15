import { roomArt, catArt } from './room-art.js';
import { createAudio } from './audio.js';
import { makeShareCard } from './share-card.js';

const $ = (id) => document.getElementById(id);
const board = $('game-board');
const player = $('player');
const result = $('result-dialog');
const storageKey = 'varsha-cat-game-v1';
const prefs = { bestScore: 0, sound: true };
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    if (Number.isSafeInteger(saved.bestScore) && saved.bestScore >= 0) prefs.bestScore = Math.min(saved.bestScore, 999999);
    if (typeof saved.sound === 'boolean') prefs.sound = saved.sound;
  }
} catch { /* Play still works without storage. */ }
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(prefs)); } catch { /* Session-only is fine. */ }
}
function renderPrefs() {
  $('best-score').textContent = prefs.bestScore;
  $('sound-toggle').setAttribute('aria-pressed', String(prefs.sound));
  $('sound-toggle').setAttribute('aria-label', prefs.sound ? 'Mute music and sounds' : 'Enable music and sounds');
  $('sound-toggle').title = prefs.sound ? 'Mute music and sounds' : 'Enable music and sounds';
}
$('room-art').innerHTML = roomArt;
$('room-art').querySelector('svg').setAttribute('preserveAspectRatio', 'xMidYMid slice');
$('player-art').innerHTML = catArt;
renderPrefs();

const keys = new Set();
const held = new Set();
const roundLength = 45;
const help = 'Tap or drag to catch treats. ← → work too.';
let width = 400, height = 600, playerWidth = 140, playerHeight = 180, playerBottom = 74;
let x = 200, targetX = 200, pointerId = null;
let score = 0, remaining = roundLength, spawnClock = 0, displayedTime = roundLength;
let running = false, paused = false, raf = 0, lastFrame = null, movement = '';
let drops = [], happyTimer;
let cardGeneration = 0, shareCard = null, shareFile = null, shareBusy = false;
const audio = createAudio({ enabled: prefs.sound, onUnavailable() {
  prefs.sound = false;
  renderPrefs();
  save();
} });
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clampX = (value) => clamp(value, playerWidth * 0.36, width - playerWidth * 0.36);
const announce = (message) => { if ($('live-announcement')) $('live-announcement').textContent = message; };

function measure() {
  const oldWidth = width;
  width = board.clientWidth || width;
  height = board.clientHeight || height;
  playerWidth = player.offsetWidth || 140;
  playerHeight = player.offsetHeight || 180;
  playerBottom = parseFloat(getComputedStyle(player).bottom) || 0;
  x = clampX(x * width / oldWidth);
  targetX = clampX(targetX * width / oldWidth);
  player.style.left = `${x}px`;
  drops.forEach((drop) => { drop.x = clamp(drop.x * width / oldWidth, 20, width - 20); });
}
function setMovement(next) {
  if (movement === next) return;
  movement = next;
  player.classList.toggle('is-walking', next === 'walk');
  player.classList.toggle('is-running', next === 'run');
}
function schedule() {
  if (running && !paused && !document.hidden && !raf) raf = requestAnimationFrame(frame);
}
function stopFrame() {
  cancelAnimationFrame(raf);
  raf = 0;
  lastFrame = null;
}
function pause(next) {
  if (!running) return;
  paused = next;
  keys.clear();
  held.clear();
  pointerId = null;
  board.classList.toggle('is-paused', paused);
  $('pause-button').setAttribute('aria-pressed', String(paused));
  $('pause-button').setAttribute('aria-label', paused ? 'Resume game' : 'Pause game');
  $('pause-button').title = paused ? 'Resume game' : 'Pause game';
  $('pause-button').textContent = paused ? '▶' : '⏸';
  $('hint').textContent = paused ? 'A tiny breather. Tap ▶ to keep playing.' : help;
  $('hint').hidden = !paused && remaining < roundLength - 6;
  if (paused) { stopFrame(); setMovement(''); audio.pause(); }
  else { lastFrame = null; schedule(); if (!document.hidden) audio.resume(); }
}

const unlockAudio = () => audio.unlock();

async function prepareCard(finalScore, bestScore) {
  const generation = ++cardGeneration;
  shareCard = null;
  shareFile = null;
  shareBusy = false;
  $('share-score').disabled = true;
  $('save-card').disabled = true;
  $('share-preview').hidden = true;
  $('share-status').textContent = 'Making your little victory card…';
  try {
    const card = await makeShareCard(finalScore, bestScore);
    if (generation !== cardGeneration || running || !result.open) return;
    shareCard = card;
    if (typeof File === 'function') shareFile = new File([card.blob], 'varsha-score.png', { type: 'image/png' });
    $('share-preview').src = card.dataUrl;
    $('share-preview').alt = `Varsha’s playtime scorecard: ${finalScore} points, best ${bestScore}.`;
    $('share-preview').hidden = false;
    $('share-score').disabled = false;
    $('save-card').disabled = false;
    $('share-status').textContent = 'A little card for your very good score.';
  } catch {
    if (generation === cardGeneration && result.open) {
      $('share-status').textContent = 'The card couldn’t load this time. Your score is safe — play again for another go!';
    }
  }
}

async function shareScore() {
  if (!shareCard || shareBusy) return;
  const generation = cardGeneration;
  const card = shareCard;
  const file = shareFile;
  const challenge = `${card.text}\n${card.url}`;
  shareBusy = true;
  $('share-score').disabled = true;
  try {
    if (typeof navigator.share === 'function') {
      const data = { title: card.title, text: card.text, url: card.url };
      if (file && navigator.canShare?.({ files: [file] })) data.files = [file];
      await navigator.share(data);
      if (generation === cardGeneration) $('share-status').textContent = 'A little cat joy, shared. ♡';
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(challenge);
      if (generation === cardGeneration) $('share-status').textContent = 'Challenge copied! Save your card to share it.';
    } else if (generation === cardGeneration) {
      $('share-status').textContent = `Save your card, or copy this challenge: ${challenge}`;
    }
  } catch (error) {
    if (error.name !== 'AbortError' && generation === cardGeneration) {
      $('share-status').textContent = `Sharing didn’t open. Save your card, or copy this challenge: ${challenge}`;
    }
  } finally {
    if (generation === cardGeneration) {
      shareBusy = false;
      $('share-score').disabled = !shareCard;
    }
  }
}

function spawn(first = false) {
  const roll = Math.random();
  const kind = roll < 0.62 ? 'fish' : roll < 0.9 ? 'yarn' : 'heart';
  const value = kind === 'fish' ? 1 : kind === 'yarn' ? 2 : 3;
  const element = document.createElement('div');
  element.className = `drop drop-${kind}`;
  element.setAttribute('aria-hidden', 'true');
  element.innerHTML = `<svg viewBox="0 0 24 24"><use href="#i-${kind}" /></svg>`;
  $('drops').append(element);
  const drop = { element, value, x: first ? x : 24 + Math.random() * Math.max(0, width - 48), y: -36 };
  element.style.transform = `translate(${drop.x - 18}px, ${drop.y}px)`;
  drops.push(drop);
}
function catchDrop(drop) {
  score += drop.value;
  $('score').textContent = score;
  if (score > prefs.bestScore) {
    prefs.bestScore = score;
    $('best-score').textContent = score;
    save();
  }
  player.classList.add('is-happy');
  clearTimeout(happyTimer);
  happyTimer = setTimeout(() => player.classList.remove('is-happy'), 650);
  const heart = document.createElement('span');
  heart.className = 'catch-heart';
  heart.textContent = `+${drop.value} ♥`;
  heart.setAttribute('aria-hidden', 'true');
  heart.style.left = `${x}px`;
  heart.style.top = `${height - playerBottom - playerHeight * 0.65}px`;
  $('catch-effects').append(heart);
  setTimeout(() => heart.remove(), 850);
  audio.catch(drop.value);
  if (Math.floor(score / 10) > Math.floor((score - drop.value) / 10)) announce(`${score} points! Keep catching.`);
}
function endRound() {
  running = false;
  stopFrame();
  setMovement('');
  keys.clear();
  held.clear();
  pointerId = null;
  $('pause-button').disabled = true;
  $('hint').hidden = true;
  $('final-score').textContent = score;
  $('result-message').textContent = score >= 30
    ? 'So many treats! Varsha thinks you’re the cat’s pajamas.'
    : score >= 10 ? 'A happy cat, a happy heart. Varsha loved that.'
      : 'A little playtime goes a long way. Varsha says thank you.';
  announce(`Playtime finished. You caught ${score} points. Best score ${prefs.bestScore}.`);
  save();
  audio.finish();
  result.showModal();
  $('play-again').focus();
  prepareCard(score, prefs.bestScore);
}
function frame(timestamp) {
  raf = 0;
  if (!running || paused || document.hidden) { lastFrame = null; return; }
  const elapsed = lastFrame === null ? 0 : (timestamp - lastFrame) / 1000;
  lastFrame = timestamp;
  const dt = Math.min(elapsed, 0.05);
  remaining = Math.max(0, remaining - elapsed);
  const seconds = Math.ceil(remaining);
  if (seconds !== displayedTime) { displayedTime = seconds; $('time-left').textContent = seconds; }
  if (remaining === 0) { endRound(); return; }
  if (remaining < roundLength - 6) $('hint').hidden = true;

  const direction = Number(keys.has('ArrowRight') || keys.has('d') || held.has(1))
    - Number(keys.has('ArrowLeft') || keys.has('a') || held.has(-1));
  const previousX = x;
  if (direction) {
    x = clampX(x + direction * 330 * dt);
    targetX = x;
    setMovement(x === previousX ? '' : 'run');
  } else {
    const distance = targetX - x;
    const speed = Math.abs(distance) > 80 ? 330 : 150;
    x = clampX(x + Math.sign(distance) * Math.min(Math.abs(distance), speed * dt));
    setMovement(Math.abs(distance) < 2 ? '' : speed === 330 ? 'run' : 'walk');
  }
  if (x !== previousX) {
    player.dataset.facing = x > previousX ? 'right' : 'left';
    player.style.left = `${x}px`;
  }
  const catchY = height - playerBottom - playerHeight * 0.55;
  const fallSpeed = clamp(height * 0.205, 95, 165);
  for (let i = drops.length - 1; i >= 0; i--) {
    const drop = drops[i];
    drop.y += fallSpeed * dt;
    const caught = drop.y + 36 >= catchY && drop.y < catchY + 45
      && Math.abs(drop.x - x) < playerWidth * 0.34 + 12;
    if (caught || drop.y > height + 36) {
      if (caught) catchDrop(drop);
      drop.element.remove();
      drops.splice(i, 1);
    } else drop.element.style.transform = `translate(${drop.x - 18}px, ${drop.y}px)`;
  }
  spawnClock += dt;
  const interval = 0.9 - (roundLength - remaining) / roundLength * 0.25;
  if (spawnClock >= interval) { spawnClock = 0; spawn(); }
  schedule();
}
function start() {
  stopFrame();
  cardGeneration++;
  shareCard = null;
  shareFile = null;
  shareBusy = false;
  $('share-score').disabled = true;
  $('save-card').disabled = true;
  $('share-preview').hidden = true;
  $('share-status').textContent = '';
  if (result.open) result.close();
  drops = [];
  $('drops').replaceChildren();
  $('catch-effects').replaceChildren();
  clearTimeout(happyTimer);
  player.classList.remove('is-happy');
  keys.clear();
  held.clear();
  pointerId = null;
  score = 0;
  remaining = roundLength;
  displayedTime = roundLength;
  spawnClock = 0;
  running = true;
  paused = false;
  x = targetX = width / 2;
  player.style.left = `${x}px`;
  player.dataset.facing = 'right';
  $('score').textContent = '0';
  $('time-left').textContent = roundLength;
  $('pause-button').disabled = false;
  pause(false);
  $('hint').hidden = false;
  spawn(true);
  announce('Playtime! Guide Varsha to catch falling treats.');
}

board.addEventListener('pointerdown', (event) => {
  if (!running || paused || event.target.closest('button')) return;
  pointerId = event.pointerId;
  targetX = clampX(event.clientX - board.getBoundingClientRect().left);
  board.setPointerCapture(event.pointerId);
  unlockAudio();
});
board.addEventListener('pointermove', (event) => {
  if (event.pointerId === pointerId) targetX = clampX(event.clientX - board.getBoundingClientRect().left);
});
const releasePointer = (event) => { if (event.pointerId === pointerId) pointerId = null; };
board.addEventListener('pointerup', releasePointer);
board.addEventListener('pointercancel', releasePointer);
board.addEventListener('lostpointercapture', releasePointer);
for (const [id, direction] of [['move-left', -1], ['move-right', 1]]) {
  const button = $(id);
  button.addEventListener('pointerdown', (event) => {
    if (!running || paused) return;
    event.preventDefault();
    held.add(direction);
    button.setPointerCapture(event.pointerId);
    unlockAudio();
  });
  const release = () => held.delete(direction);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
  button.addEventListener('click', (event) => {
    if (event.detail === 0 && running && !paused) { targetX = clampX(targetX + direction * 80); unlockAudio(); }
  });
}
document.addEventListener('keydown', (event) => {
  if (result.open) return;
  if (event.code === 'Space' && !event.target.closest('button')) {
    event.preventDefault();
    if (!event.repeat) { pause(!paused); unlockAudio(); }
    return;
  }
  if (event.key === 'Escape' && running) { pause(!paused); unlockAudio(); return; }
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(key) && running && !paused) {
    event.preventDefault();
    keys.add(key);
    unlockAudio();
  }
});
document.addEventListener('keyup', (event) => keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key));
window.addEventListener('blur', () => { keys.clear(); held.clear(); pointerId = null; });
document.addEventListener('visibilitychange', () => {
  keys.clear(); held.clear(); pointerId = null;
  if (document.hidden) { stopFrame(); setMovement(''); audio.pause(); }
  else { lastFrame = null; schedule(); if (running && !paused) audio.resume(); }
});
$('pause-button').addEventListener('click', () => { pause(!paused); unlockAudio(); });
$('restart-button').addEventListener('click', () => { start(); unlockAudio(); });
$('play-again').addEventListener('click', () => { start(); unlockAudio(); });
$('share-score').addEventListener('click', shareScore);
$('save-card').addEventListener('click', () => {
  if (!shareCard) return;
  const link = document.createElement('a');
  link.href = shareCard.dataUrl;
  link.download = 'varsha-score.png';
  document.body.append(link);
  link.click();
  link.remove();
  $('share-status').textContent = 'Card download started. A little keepsake for you. ♡';
});
result.addEventListener('cancel', (event) => event.preventDefault());
$('sound-toggle').addEventListener('click', () => {
  prefs.sound = !prefs.sound;
  renderPrefs(); save();
  audio.setEnabled(prefs.sound);
  if (prefs.sound) unlockAudio();
});
if ('ResizeObserver' in window) new ResizeObserver(measure).observe(board);
else window.addEventListener('resize', measure);
measure();
start();
