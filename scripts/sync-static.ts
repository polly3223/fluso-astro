import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await mkdir('public', {recursive: true});
for (const entry of ['assets', 'llms.txt', 'briefs', 'docs', 'design-system.html', 'fluso-building-blocks-video.html', 'fluso-visual-identity-system.html', 'fluso-website-structure-proposal.md']) {
  await rm(`public/${entry}`, {recursive: true, force: true});
  if (!existsSync(entry)) continue;
  await cp(entry, `public/${entry}`, {recursive: true, force: true, filter: path => !path.endsWith('.DS_Store')});
}
