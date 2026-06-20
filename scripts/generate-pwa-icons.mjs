import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync('static/icon-source.svg');

for (const size of [192, 512]) {
	await sharp(svg).resize(size, size).png().toFile(`static/pwa-${size}x${size}.png`);
	console.log(`Generated static/pwa-${size}x${size}.png`);
}
