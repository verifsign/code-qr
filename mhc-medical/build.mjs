/* Générateur statique — assemble les pages HTML dans public/.
   Aucune dépendance externe : Node >= 18. Lancer avec `npm run build`. */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { renderPage } from "./src/layout.mjs";
import { site } from "./src/site.mjs";

import { home } from "./src/pages/home.mjs";
import { patient, comment, prisEnCharge } from "./src/pages/patient.mjs";
import {
  aidant,
  aidantEquiper,
  aidantRetour,
  aidantChutes,
} from "./src/pages/aidant.mjs";
import { equipements, categoryPages } from "./src/pages/equipements.mjs";
import { professionnels } from "./src/pages/professionnels.mjs";
import { magasin, contact } from "./src/pages/magasin-contact.mjs";
import {
  mentions,
  confidentialite,
  cookies,
  materiovigilance,
} from "./src/pages/legal.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "public");

const pages = [
  home,
  patient,
  comment,
  prisEnCharge,
  aidant,
  aidantEquiper,
  aidantRetour,
  aidantChutes,
  equipements,
  ...categoryPages,
  professionnels,
  magasin,
  contact,
  mentions,
  confidentialite,
  cookies,
  materiovigilance,
];

function buildSitemap() {
  const urls = pages
    .map((p) => {
      const loc = `${site.baseUrl}/${p.slug === "index.html" ? "" : p.slug}`;
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.baseUrl}/sitemap.xml
`;
}

async function main() {
  let count = 0;
  for (const page of pages) {
    const html = renderPage(page);
    await writeFile(join(OUT, page.slug), html, "utf8");
    count++;
  }
  await writeFile(join(OUT, "sitemap.xml"), buildSitemap(), "utf8");
  await writeFile(join(OUT, "robots.txt"), buildRobots(), "utf8");
  console.log(`✓ ${count} pages générées dans public/ (+ sitemap.xml, robots.txt)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
