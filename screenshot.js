const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

// Puppeteer standard example for grabbing screenshots
// https://github.com/GoogleChrome/puppeteer/blob/master/examples/screenshot-fullpage.js
const capture = async (site, resolution) => {
  const savePath = `./Screenshots/${site.replace(/http:\/\/|https:\/\//, '').replace(/\.|\//g, '_')}_${resolution.replace(/\s/g, '_')}.png`

  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  if (typeof resolution === 'string') {
    await page.emulate(devices[resolution])
  } else {
    await page.setViewport({
      width: parseInt(resolution[0]),
      height: parseInt(resolution[1])
    });
    resolution = resolution.join('x')
  }

  await page.goto(site);
  const screenshot = await page.screenshot({ path: savePath, fullPage: true });
  await browser.close();
  console.log(`Screenshot saved to: ${savePath}`);
}

// Parse arguments from terminal
if (process.argv[2] === 'devices') {
  for (let device of devices)
  console.log(`${device.name}`)
} else {
  const site = process.argv[2];

  if (process.argv[3].substr(0, 3) === 'res') {
    const resolution = process.argv[3].substr(3).split('x');
    capture(site, resolution);
  } else {
    const device = process.argv[3];
    capture(site, device);
  }
}
