// Ekko Sync — mirrors Phase 4.5 + Phase 6 work from the React repo into Figma.
// Idempotent: re-running replaces the previous scaffold on the target page.

const PALETTE = {
  page:          { r: 0.953, g: 0.945, b: 0.925 }, // #F3F1EC
  surface:       { r: 1.000, g: 1.000, b: 1.000 }, // #FFFFFF
  surfaceMuted:  { r: 0.925, g: 0.910, b: 0.882 }, // #ECE8E1
  textPrimary:   { r: 0.067, g: 0.067, b: 0.067 }, // #111111
  textSecondary: { r: 0.361, g: 0.353, b: 0.341 }, // #5C5A57
  textMuted:     { r: 0.478, g: 0.459, b: 0.431 }, // #7A756E
  borderDefault: { r: 0.149, g: 0.149, b: 0.149 }, // #262626
  borderSubtle:  { r: 0.839, g: 0.816, b: 0.780 }, // #D6D0C7
  accent:        { r: 0.957, g: 0.745, b: 0.000 }, // #F4BE00
  accentSoft:    { r: 0.969, g: 0.898, b: 0.620 }, // #F7E59E
  success:       { r: 0.055, g: 0.486, b: 0.400 }, // #0E7C66
  warning:       { r: 0.690, g: 0.443, b: 0.000 }, // #B07100
  danger:        { r: 0.631, g: 0.290, b: 0.231 }, // #A14A3B
  info:          { r: 0.282, g: 0.384, b: 0.478 }, // #48627A
};

const INTER_REGULAR  = { family: "Inter", style: "Regular" };
const INTER_MEDIUM   = { family: "Inter", style: "Medium" };
const INTER_SEMIBOLD = { family: "Inter", style: "Semi Bold" };

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync(INTER_REGULAR),
    figma.loadFontAsync(INTER_MEDIUM),
    figma.loadFontAsync(INTER_SEMIBOLD),
  ]);
}

function solid(color) {
  return [{ type: "SOLID", color }];
}

function createText(characters, opts) {
  const o = opts || {};
  const node = figma.createText();
  node.fontName = o.font || INTER_REGULAR;
  node.characters = characters;
  node.fontSize = o.size || 14;
  node.fills = solid(o.color || PALETTE.textPrimary);
  if (o.lineHeight) node.lineHeight = { value: o.lineHeight, unit: "PIXELS" };
  if (o.letterSpacing) node.letterSpacing = { value: o.letterSpacing, unit: "PERCENT" };
  return node;
}

function styleFrameAsCard(frame, opts) {
  const o = opts || {};
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.paddingTop    = o.padding != null ? o.padding : 16;
  frame.paddingBottom = o.padding != null ? o.padding : 16;
  frame.paddingLeft   = o.padding != null ? o.padding : 16;
  frame.paddingRight  = o.padding != null ? o.padding : 16;
  frame.itemSpacing   = o.gap != null ? o.gap : 8;
  frame.fills         = solid(o.fill || PALETTE.surface);
  frame.strokes       = solid(o.stroke || PALETTE.borderSubtle);
  frame.strokeWeight  = 1;
  frame.strokeAlign   = "INSIDE";
  frame.cornerRadius  = o.radius != null ? o.radius : 4;
}

const COMPONENTS = [
  { name: "SetupProgressCard",       phase: "4.5", description: "Setup checklist with progress bar. Day 0 glance." },
  { name: "ValuePreviewCard",        phase: "4.5", description: "Preview of a feature unlocked once data is connected." },
  { name: "ConnectionPromptCard",    phase: "4.5", description: "Prompts the user to connect a specific data source." },
  { name: "EducationalEmptyState",   phase: "4.5", description: "Empty state with educational tone + next action." },
  { name: "DataMissingCallout",      phase: "4.5", description: "Inline callout on detail screens when data is sparse." },
  { name: "BenchmarkPreviewCard",    phase: "4.5", description: "Preview of peer benchmark unlocked at Day X." },
  { name: "TrackedTopicsSetupCard",  phase: "4.5", description: "Day 0 policy setup — pick topics to track." },
  { name: "MaturityComparisonStrip", phase: "4.5", description: "Side-by-side teaser: Day 0 vs Day X for a surface." },
  { name: "UnlockCTA",               phase: "4.5", description: "Inline 'unlock when connected' call to action." },
  { name: "MatureInsightsPanel",     phase: "4.5", description: "Day X rich insights rail for detail surfaces." },
  { name: "LinkedInsightCard",       phase: "6",   description: "'Connected across Ekko' cross-surface link card." },
  { name: "DemoPathCard",            phase: "6",   description: "Launch card for one of the five demo walkthroughs." },
  { name: "MaturityStateSwitcher",   phase: "4.5", description: "TopNav toggle between Day 0 and Day X." },
  { name: "WalkthroughLauncher",     phase: "6",   description: "TopNav button to start a guided walkthrough." },
  { name: "WalkthroughStrip",        phase: "6",   description: "Persistent bottom strip with step rail + controls." },
  { name: "CardHeader",              phase: "4.5", description: "Shared header primitive for card modules." },
  { name: "SectionHeader",           phase: "4.5", description: "Shared page-section header: eyebrow + title + action." },
];

const SCREENS = [
  { name: "01 — Day 0 · Dashboard",     blocks: ["Setup progress", "Value previews", "Connection prompts", "Maturity comparison"] },
  { name: "02 — Day 0 · Donors list",   blocks: ["Educational empty state", "Sample donors (3)", "Unlock CTA"] },
  { name: "03 — Day 0 · Donor detail",  blocks: ["Header", "Data missing callout", "Sparse timeline", "Value preview"] },
  { name: "04 — Day 0 · Policy",        blocks: ["Tracked topics setup", "Educational empty state", "Unlock CTA"] },
  { name: "05 — Day 0 · Policy detail", blocks: ["Policy header", "Data missing callout", "Value preview"] },
  { name: "06 — Day 0 · Peers",         blocks: ["Benchmark preview", "Educational empty state", "Connection prompt"] },
  { name: "07 — Day 0 · Peer detail",   blocks: ["Header", "Benchmark preview", "Data missing callout"] },
  { name: "08 — Day 0 · Settings",      blocks: ["Setup progress", "Integrations list", "Maturity comparison"] },
];

function buildBadge(label, fill, text) {
  const badge = figma.createFrame();
  badge.name = "Badge";
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";
  badge.paddingLeft = 8;  badge.paddingRight = 8;
  badge.paddingTop = 2;   badge.paddingBottom = 2;
  badge.cornerRadius = 2;
  badge.fills = solid(fill || PALETTE.accentSoft);
  badge.strokes = [];
  const t = createText(label, { size: 11, font: INTER_MEDIUM, color: text || PALETTE.textPrimary });
  badge.appendChild(t);
  return badge;
}

function buildComponentCard(spec) {
  const card = figma.createFrame();
  card.name = spec.name;
  card.resize(280, 180);
  styleFrameAsCard(card, { padding: 16, gap: 8, radius: 4 });

  card.appendChild(buildBadge("Phase " + spec.phase));

  const title = createText(spec.name, { size: 16, font: INTER_SEMIBOLD });
  card.appendChild(title);
  title.layoutSizingHorizontal = "FILL";

  const desc = createText(spec.description, { size: 12, color: PALETTE.textSecondary, lineHeight: 18 });
  card.appendChild(desc);
  desc.layoutSizingHorizontal = "FILL";

  const schematic = figma.createFrame();
  schematic.name = "Preview";
  schematic.layoutMode = "VERTICAL";
  schematic.primaryAxisSizingMode = "AUTO";
  schematic.counterAxisSizingMode = "FIXED";
  schematic.itemSpacing = 4;
  schematic.paddingTop = 8; schematic.paddingBottom = 8;
  schematic.paddingLeft = 8; schematic.paddingRight = 8;
  schematic.fills = solid(PALETTE.page);
  schematic.strokes = [];
  schematic.cornerRadius = 2;

  for (let i = 0; i < 3; i++) {
    const line = figma.createRectangle();
    line.resize(i === 2 ? 120 : 200, 6);
    line.fills = solid(PALETTE.borderSubtle);
    line.cornerRadius = 2;
    schematic.appendChild(line);
  }
  card.appendChild(schematic);
  schematic.layoutSizingHorizontal = "FILL";

  return card;
}

function buildScreenFrame(spec) {
  const screen = figma.createFrame();
  screen.name = spec.name;
  screen.resize(1440, 900);
  screen.fills = solid(PALETTE.page);
  screen.strokes = solid(PALETTE.borderSubtle);
  screen.strokeWeight = 1;
  screen.strokeAlign = "INSIDE";
  screen.clipsContent = true;

  // Top nav
  const nav = figma.createFrame();
  nav.name = "TopNav";
  nav.resize(1440, 64);
  nav.x = 0; nav.y = 0;
  nav.fills = solid(PALETTE.surface);
  nav.strokes = solid(PALETTE.borderSubtle);
  nav.strokeWeight = 1;
  nav.strokeAlign = "INSIDE";
  nav.layoutMode = "HORIZONTAL";
  nav.primaryAxisSizingMode = "FIXED";
  nav.counterAxisSizingMode = "FIXED";
  nav.primaryAxisAlignItems = "SPACE_BETWEEN";
  nav.counterAxisAlignItems = "CENTER";
  nav.paddingLeft = 32; nav.paddingRight = 32;
  nav.itemSpacing = 24;

  const logo = createText("EKKO", { size: 16, font: INTER_SEMIBOLD, letterSpacing: 4 });
  nav.appendChild(logo);

  const navRight = figma.createFrame();
  navRight.name = "Nav right";
  navRight.layoutMode = "HORIZONTAL";
  navRight.primaryAxisSizingMode = "AUTO";
  navRight.counterAxisSizingMode = "AUTO";
  navRight.counterAxisAlignItems = "CENTER";
  navRight.itemSpacing = 12;
  navRight.fills = [];
  navRight.appendChild(buildBadge("Walkthrough", PALETTE.surfaceMuted, PALETTE.textSecondary));
  navRight.appendChild(buildBadge("Day 0 · Day X", PALETTE.accentSoft));
  navRight.appendChild(buildBadge("Role: Exec", PALETTE.surfaceMuted, PALETTE.textSecondary));
  nav.appendChild(navRight);
  screen.appendChild(nav);

  // Body: eyebrow + title + lede + block grid + walkthrough strip
  const body = figma.createFrame();
  body.name = "Body";
  body.x = 48; body.y = 96;
  body.resize(1344, 760);
  body.fills = [];
  body.layoutMode = "VERTICAL";
  body.primaryAxisSizingMode = "AUTO";
  body.counterAxisSizingMode = "FIXED";
  body.itemSpacing = 24;

  const eyebrow = createText("DAY 0 · GUIDED ACTIVATION", { size: 11, font: INTER_MEDIUM, color: PALETTE.textMuted, letterSpacing: 8 });
  body.appendChild(eyebrow);

  const titleCopy = spec.name.replace(/^\d+ — Day 0 · /, "");
  const title = createText(titleCopy, { size: 28, font: INTER_SEMIBOLD, lineHeight: 36 });
  body.appendChild(title);
  title.layoutSizingHorizontal = "FILL";

  const lede = createText("Day 0 layout scaffold — mirrors the React implementation of this surface (src/pages/day0/). Educational tone, lighter density, value previews of what unlocks at Day X.", { size: 14, color: PALETTE.textSecondary, lineHeight: 22 });
  body.appendChild(lede);
  lede.layoutSizingHorizontal = "FILL";

  const grid = figma.createFrame();
  grid.name = "Blocks";
  grid.layoutMode = "HORIZONTAL";
  grid.layoutWrap = "WRAP";
  grid.primaryAxisSizingMode = "FIXED";
  grid.counterAxisSizingMode = "AUTO";
  grid.itemSpacing = 16;
  grid.counterAxisSpacing = 16;
  grid.fills = [];
  grid.resize(1344, 10);

  for (const blockName of spec.blocks) {
    const block = figma.createFrame();
    block.name = blockName;
    block.resize(436, 200);
    styleFrameAsCard(block, { padding: 20, gap: 8 });
    const blockEyebrow = createText("MODULE", { size: 11, font: INTER_MEDIUM, color: PALETTE.textMuted, letterSpacing: 8 });
    block.appendChild(blockEyebrow);
    const blockTitle = createText(blockName, { size: 18, font: INTER_SEMIBOLD });
    block.appendChild(blockTitle);
    blockTitle.layoutSizingHorizontal = "FILL";
    const blockBody = createText("Scaffold placeholder. Populated by the React surface in production.", { size: 12, color: PALETTE.textSecondary, lineHeight: 18 });
    block.appendChild(blockBody);
    blockBody.layoutSizingHorizontal = "FILL";

    // Little progress bar accent
    const bar = figma.createRectangle();
    bar.resize(120, 4);
    bar.fills = solid(PALETTE.accent);
    bar.cornerRadius = 2;
    block.appendChild(bar);

    grid.appendChild(block);
  }
  body.appendChild(grid);
  grid.layoutSizingHorizontal = "FILL";

  // Walkthrough strip mockup (Phase 6)
  const strip = figma.createFrame();
  strip.name = "WalkthroughStrip";
  strip.resize(1440, 72);
  strip.x = 0; strip.y = 828;
  strip.fills = solid(PALETTE.surface);
  strip.strokes = solid(PALETTE.borderDefault);
  strip.strokeWeight = 1;
  strip.strokeAlign = "INSIDE";
  strip.layoutMode = "HORIZONTAL";
  strip.primaryAxisSizingMode = "FIXED";
  strip.counterAxisSizingMode = "FIXED";
  strip.counterAxisAlignItems = "CENTER";
  strip.primaryAxisAlignItems = "SPACE_BETWEEN";
  strip.paddingLeft = 32; strip.paddingRight = 32;
  strip.itemSpacing = 24;

  const stripLeft = figma.createFrame();
  stripLeft.layoutMode = "HORIZONTAL";
  stripLeft.primaryAxisSizingMode = "AUTO";
  stripLeft.counterAxisSizingMode = "AUTO";
  stripLeft.counterAxisAlignItems = "CENTER";
  stripLeft.itemSpacing = 12;
  stripLeft.fills = [];
  stripLeft.appendChild(buildBadge("WALKTHROUGH · STEP 2 OF 5", PALETTE.accent, PALETTE.textPrimary));
  const stepTitle = createText("Connect Salesforce to unlock donor insights", { size: 13, font: INTER_SEMIBOLD });
  stripLeft.appendChild(stepTitle);
  strip.appendChild(stripLeft);

  const stripRight = figma.createFrame();
  stripRight.layoutMode = "HORIZONTAL";
  stripRight.primaryAxisSizingMode = "AUTO";
  stripRight.counterAxisSizingMode = "AUTO";
  stripRight.counterAxisAlignItems = "CENTER";
  stripRight.itemSpacing = 8;
  stripRight.fills = [];
  stripRight.appendChild(buildBadge("Prev", PALETTE.surfaceMuted, PALETTE.textSecondary));
  stripRight.appendChild(buildBadge("Next", PALETTE.textPrimary, PALETTE.surface));
  stripRight.appendChild(buildBadge("Exit", PALETTE.surfaceMuted, PALETTE.textSecondary));
  strip.appendChild(stripRight);

  screen.appendChild(body);
  screen.appendChild(strip);

  return screen;
}

function buildSectionHeader(label) {
  const wrap = figma.createFrame();
  wrap.name = "Section header";
  wrap.layoutMode = "VERTICAL";
  wrap.primaryAxisSizingMode = "AUTO";
  wrap.counterAxisSizingMode = "AUTO";
  wrap.itemSpacing = 8;
  wrap.fills = [];
  const eyebrow = createText("EKKO SYNC", { size: 11, font: INTER_MEDIUM, color: PALETTE.textMuted, letterSpacing: 8 });
  wrap.appendChild(eyebrow);
  const title = createText(label, { size: 22, font: INTER_SEMIBOLD });
  wrap.appendChild(title);
  return wrap;
}

async function ensurePage(name) {
  await figma.loadAllPagesAsync();
  const existing = figma.root.children.find(function (p) { return p.name === name; });
  if (existing) return existing;
  const page = figma.createPage();
  page.name = name;
  return page;
}

async function run() {
  await loadFonts();

  const page = await ensurePage("04 — Phase 4.5 & 6");
  await figma.setCurrentPageAsync(page);

  // Idempotent: remove prior scaffold
  const prior = page.children.find(function (c) { return c.name === "Ekko Sync · Phase 4.5 & 6 Scaffold"; });
  if (prior) prior.remove();

  const root = figma.createFrame();
  root.name = "Ekko Sync · Phase 4.5 & 6 Scaffold";
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.paddingTop = 64; root.paddingBottom = 64;
  root.paddingLeft = 64; root.paddingRight = 64;
  root.itemSpacing = 56;
  root.fills = solid(PALETTE.page);
  root.cornerRadius = 0;

  // Heading
  const headerWrap = figma.createFrame();
  headerWrap.layoutMode = "VERTICAL";
  headerWrap.primaryAxisSizingMode = "AUTO";
  headerWrap.counterAxisSizingMode = "AUTO";
  headerWrap.itemSpacing = 12;
  headerWrap.fills = [];
  const eyebrow = createText("EKKO · PHASE 4.5 + 6", { size: 12, font: INTER_MEDIUM, color: PALETTE.textMuted, letterSpacing: 8 });
  headerWrap.appendChild(eyebrow);
  const heading = createText("Day 0 maturity kit + Demo walkthrough", { size: 32, font: INTER_SEMIBOLD, lineHeight: 40 });
  headerWrap.appendChild(heading);
  const today = new Date().toISOString().slice(0, 10);
  const subhead = createText("Generated " + today + " by Ekko Sync. Mirrors React components in src/components/ui/ and Day 0 surfaces in src/pages/day0/. Re-run the plugin to refresh.", { size: 13, color: PALETTE.textSecondary, lineHeight: 20 });
  headerWrap.appendChild(subhead);
  root.appendChild(headerWrap);

  // Components section
  const compsSection = figma.createFrame();
  compsSection.name = "Components";
  compsSection.layoutMode = "VERTICAL";
  compsSection.primaryAxisSizingMode = "AUTO";
  compsSection.counterAxisSizingMode = "AUTO";
  compsSection.itemSpacing = 24;
  compsSection.fills = [];
  compsSection.appendChild(buildSectionHeader("Components — Day 0 kit + Walkthrough (" + COMPONENTS.length + ")"));

  const compsGrid = figma.createFrame();
  compsGrid.name = "Component grid";
  compsGrid.layoutMode = "HORIZONTAL";
  compsGrid.layoutWrap = "WRAP";
  compsGrid.primaryAxisSizingMode = "FIXED";
  compsGrid.counterAxisSizingMode = "AUTO";
  compsGrid.itemSpacing = 16;
  compsGrid.counterAxisSpacing = 16;
  compsGrid.fills = [];
  compsGrid.resize(4 * 280 + 3 * 16, 10);

  for (const c of COMPONENTS) {
    compsGrid.appendChild(buildComponentCard(c));
  }
  compsSection.appendChild(compsGrid);
  root.appendChild(compsSection);

  // Screens section
  const screensSection = figma.createFrame();
  screensSection.name = "Screens";
  screensSection.layoutMode = "VERTICAL";
  screensSection.primaryAxisSizingMode = "AUTO";
  screensSection.counterAxisSizingMode = "AUTO";
  screensSection.itemSpacing = 24;
  screensSection.fills = [];
  screensSection.appendChild(buildSectionHeader("Screens — Day 0 surfaces (" + SCREENS.length + " × 1440)"));

  const screensColumn = figma.createFrame();
  screensColumn.name = "Screen stack";
  screensColumn.layoutMode = "VERTICAL";
  screensColumn.primaryAxisSizingMode = "AUTO";
  screensColumn.counterAxisSizingMode = "AUTO";
  screensColumn.itemSpacing = 48;
  screensColumn.fills = [];

  for (const s of SCREENS) {
    screensColumn.appendChild(buildScreenFrame(s));
  }
  screensSection.appendChild(screensColumn);
  root.appendChild(screensSection);

  page.appendChild(root);

  figma.viewport.scrollAndZoomIntoView([root]);

  figma.closePlugin("Ekko Sync complete — " + COMPONENTS.length + " component scaffolds + " + SCREENS.length + " Day 0 screens on page \"" + page.name + "\".");
}

run().catch(function (err) {
  const msg = (err && err.message) ? err.message : String(err);
  console.error("Ekko Sync failed:", err);
  figma.notify("Ekko Sync failed: " + msg, { error: true });
  figma.closePlugin("Ekko Sync failed: " + msg);
});
