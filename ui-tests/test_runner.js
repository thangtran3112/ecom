const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function getLocalBrowser() {
  return await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
    defaultViewport: null,
    executablePath: process.env.CHROME_PATH,
    headless: false, // Set to false to show the browser
    ignoreHTTPSErrors: true,
  });
}

/**
 * This headless browser is optimized for AWS Lambda.
 * In AWS Lambda, we do not have access to a display server.
 * We can only use a chromium headless browser.
 */
async function getHeadlessBrowser() {
  return await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

const warmupFashionify = async (page) => {
  console.log("Warming up Fashionify website");
  await page.goto("https://fashionify.thangtrandev.net", {
    waitUntil: "networkidle2",
    timeout: 10000, //ms
  });

  // Click on the element with class "relative" and href "/portfolio"
  const collectionTabSelector = 'a[href="/collection"]';
  await page.waitForSelector(collectionTabSelector);
  await page.click(collectionTabSelector);

  await delay(3000);

  const homeTabSelector = 'a[href="/"]';
  await page.waitForSelector(homeTabSelector);
  await page.click(homeTabSelector);
};

const warmupAirNext = async (page) => {
  console.log("Warming up AirNext website");
  await page.goto("https://airnext.thangtrandev.net", {
    waitUntil: "networkidle2",
    timeout: 10000, //ms
  });

  const luxeTabSelector = 'a[href="/?filter=luxe"]';
  await page.waitForSelector(luxeTabSelector);
  await page.click(luxeTabSelector);
  await delay(3000);

  const wowTabSelector = 'a[href="/?filter=omg"]';
  await page.waitForSelector(wowTabSelector);
  await page.click(wowTabSelector);
  await delay(3000);
};

const warmupReduxAdmin = async (page) => {
  console.log("Warming up Redux Admin website");
  await page.goto("https://mernadmin.thangtrandev.net", {
    waitUntil: "networkidle2",
    timeout: 10000, //ms
  });

  await delay(2000);

  // Click on the <span> element with the specified classes and text content "Products"
  await page.evaluate(() => {
    const productsElement = Array.from(document.querySelectorAll("span")).find(
      (el) => el.textContent.trim() === "Products"
    );
    if (productsElement) {
      productsElement.click();
    }
  });
};

const runTest = async (isHeadless) => {
  const browser = isHeadless
    ? await getHeadlessBrowser()
    : await getLocalBrowser();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await warmupFashionify(page);
  await delay(2000);
  await warmupAirNext(page);
  await delay(2000);
  await warmupReduxAdmin(page);

  await browser.close();
};

// Export functions using CommonJS syntax
module.exports = {
  getLocalBrowser,
  getHeadlessBrowser,
  runTest,
};
