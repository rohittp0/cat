import { access, cp, mkdir, rm } from 'node:fs/promises';

const source = new URL('../public/', import.meta.url);
const output = new URL('../dist/', import.meta.url);

for (const file of ['index.html', 'styles.css', 'app.js', 'audio.js', 'room-art.js', 'share-card.js', 'favicon.svg', 'social-preview.png', 'fonts/dm-sans.ttf', 'fonts/fraunces.ttf']) {
  await access(new URL(file, source));
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log('Built static site in dist/');
