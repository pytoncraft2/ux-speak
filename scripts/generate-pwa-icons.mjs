import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync('static/icon-source.svg');
const bg = '#0d6efd';

for (const size of [192, 512]) {
	await sharp(svg).resize(size, size).png().toFile(`static/pwa-${size}x${size}.png`);
	console.log(`Generated static/pwa-${size}x${size}.png`);
}

const maskableSize = 512;
const iconSize = Math.round(maskableSize * 0.62);
const iconBuffer = await sharp(svg).resize(iconSize, iconSize).png().toBuffer();

await sharp({
	create: {
		width: maskableSize,
		height: maskableSize,
		channels: 4,
		background: bg
	}
})
	.composite([{ input: iconBuffer, gravity: 'centre' }])
	.png()
	.toFile('static/pwa-512x512-maskable.png');

console.log('Generated static/pwa-512x512-maskable.png');
