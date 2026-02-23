#!/usr/bin/env node
/**
 * Explore Google Flow/ImageFX UI to find the right selectors
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const FLOW_URL = "https://labs.google/fx/es-419/tools/flow/project/0fd7a4c6-0324-4beb-a458-b15ec9147dea";
const SESSION_DIR = path.join(__dirname, "..", ".playwright-flow-session");

async function main() {
  const context = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"],
    locale: "es-419",
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto(FLOW_URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(8000);

  console.log("Current URL:", page.url());

  // Screenshot
  await page.screenshot({ path: "flow-ui-screenshot.png", fullPage: true });
  console.log("Screenshot saved to flow-ui-screenshot.png");

  // Dump all interactive elements
  const elements = await page.evaluate(() => {
    const results = [];
    const els = document.querySelectorAll("input, textarea, button, [contenteditable], [role='textbox'], [role='button']");
    els.forEach(el => {
      results.push({
        tag: el.tagName,
        id: el.id || null,
        class: el.className?.toString().substring(0, 100) || null,
        role: el.getAttribute("role"),
        type: el.getAttribute("type"),
        placeholder: el.getAttribute("placeholder"),
        text: el.textContent?.trim().substring(0, 80) || null,
        ariaLabel: el.getAttribute("aria-label"),
        visible: el.offsetParent !== null,
      });
    });
    return results;
  });

  fs.writeFileSync("flow-dom-dump.json", JSON.stringify(elements, null, 2));
  console.log(`Found ${elements.length} interactive elements — saved to flow-dom-dump.json`);

  // Print the most relevant ones
  console.log("\nKey elements:");
  elements
    .filter(e => e.visible)
    .forEach(e => {
      console.log(`  ${e.tag} id="${e.id}" role="${e.role}" placeholder="${e.placeholder}" text="${e.text?.substring(0, 50)}"`);
    });

  // Keep browser open for manual inspection
  console.log("\nBrowser stays open. Press Ctrl+C to close.");
  await page.waitForTimeout(600000);
  await context.close();
}

main().catch(err => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
