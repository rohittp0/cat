import { catArt } from './room-art.js';

const palette = { paper: '#faf7f0', ink: '#414535', peach: '#efbca5', blush: '#f6ded1', muted: '#777b64', gold: '#dfb866' };
const safeScore = (value) => Math.min(999999, Math.max(0, Math.floor(Number(value) || 0)));

function rounded(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function star(ctx, x, y, size, color = palette.gold) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x + size * .2, y - size * .2, x + size, y);
  ctx.quadraticCurveTo(x + size * .2, y + size * .2, x, y + size);
  ctx.quadraticCurveTo(x - size * .2, y + size * .2, x - size, y);
  ctx.quadraticCurveTo(x - size * .2, y - size * .2, x, y - size);
  ctx.fill();
}

function heart(ctx, x, y, size, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = palette.peach;
  ctx.beginPath();
  ctx.moveTo(0, size * .8);
  ctx.bezierCurveTo(-size * 1.8, -size * .3, -size * .6, -size * 1.6, 0, -size * .6);
  ctx.bezierCurveTo(size * .6, -size * 1.6, size * 1.8, -size * .3, 0, size * .8);
  ctx.fill();
  ctx.restore();
}

function happyCatImage() {
  const svg = catArt.replace(/(<svg\b[^>]*>)/, '$1<style>.cat-eyes-open{display:none}.cat-eyes-happy{display:inline}*{animation:none!important}</style>');
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not prepare Varsha’s share card.'));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export async function makeShareCard(score, bestScore) {
  score = safeScore(score);
  bestScore = safeScore(bestScore);
  if (document.fonts) await document.fonts.ready;
  const cat = await happyCatImage();
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not create a share card.');
  const { paper, ink, peach, blush, muted } = palette;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = '#dedbcf';
  for (let x = 31; x < 1080; x += 36) for (let y = 31; y < 1350; y += 36) {
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
  }
  rounded(ctx, 38, 38, 1004, 1274, 42);
  ctx.fillStyle = paper; ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.stroke();
  rounded(ctx, 54, 54, 972, 1242, 31);
  ctx.strokeStyle = '#e5e1d5'; ctx.lineWidth = 2; ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = ink;
  ctx.font = '700 29px "DM Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('VARSHA’S', 540, 123);
  ctx.letterSpacing = '0px';
  ctx.font = '600 76px Fraunces, Georgia, serif';
  ctx.fillText('Snack Dash', 540, 210);
  star(ctx, 217, 164, 17); star(ctx, 863, 164, 17);
  const badge = score >= bestScore && score > 0 ? 'A NEW PURR-SONAL BEST!' : score >= 200 ? 'SNACK-CATCHING SUPERSTAR' : score >= 75 ? 'CERTIFIED SNACK CATCHER' : 'SMALL PAWS, BIG POTENTIAL';
  rounded(ctx, 250, 248, 580, 55, 27);
  ctx.fillStyle = blush; ctx.fill();
  ctx.font = '700 21px "DM Sans", sans-serif';
  ctx.fillStyle = '#9b5945'; ctx.fillText(badge, 540, 283);

  ctx.fillStyle = ink;
  const scoreLabel = String(score);
  let scoreSize = 180;
  ctx.font = `600 ${scoreSize}px Fraunces, Georgia, serif`;
  while (ctx.measureText(scoreLabel).width > 740) {
    scoreSize -= 4; ctx.font = `600 ${scoreSize}px Fraunces, Georgia, serif`;
  }
  ctx.fillText(scoreLabel, 540, 495);
  ctx.font = '500 30px "DM Sans", sans-serif';
  ctx.fillStyle = muted; ctx.fillText(`I caught ${score} happy little points!`, 540, 553);

  ctx.fillStyle = blush;
  ctx.beginPath(); ctx.ellipse(540, 1030, 309, 65, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = peach; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(540, 1030, 279, 47, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.drawImage(cat, 315, 568, 450, 450 * 350 / 310);
  heart(ctx, 259, 729, 27, -.25); heart(ctx, 817, 866, 23, .3);
  star(ctx, 799, 668, 27); star(ctx, 250, 926, 19); star(ctx, 836, 1009, 13);
  ctx.fillStyle = '#d2d8bd';
  for (const [x, y, r] of [[283, 647, 7], [820, 765, 6], [191, 838, 5], [887, 939, 5]]) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = ink; ctx.font = '600 39px Fraunces, Georgia, serif';
  ctx.fillText('Think you can beat my score?', 540, 1158);
  ctx.font = '500 24px "DM Sans", sans-serif'; ctx.fillStyle = muted;
  ctx.fillText('A little chaos. A lot of snacks.', 540, 1206);
  rounded(ctx, 329, 1240, 422, 61, 30);
  ctx.fillStyle = ink; ctx.fill();
  ctx.font = '700 29px "DM Sans", sans-serif'; ctx.fillStyle = paper;
  ctx.fillText('varsha.cat', 540, 1281);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not save Varsha’s share card.');
  return {
    blob, dataUrl: canvas.toDataURL('image/png'),
    text: `I scored ${score} points with Varsha! 🐾 Can you beat my snack-catching skills? Play at https://varsha.cat`,
    title: 'Varsha’s Snack Dash', url: 'https://varsha.cat/',
  };
}
