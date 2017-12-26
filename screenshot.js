const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const yargs = require('yargs');

// Puppeteer standard example for grabbing screenshots
// https://github.com/GoogleChrome/puppeteer/blob/master/examples/screenshot-fullpage.js
const capture = async (site, resolution) => {

  const savePath = `./Screenshots/${site.replace(/http:\/\/|https:\/\//, '').replace(/\.|\//g, '_')}_${resolution.toString().replace(/\s/g, '_').replace(/\,/g, 'x')}.png`
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

const argv = yargs
  .help()
  .argv;

// Parse arguments from terminal
if (argv._[0] === 'devices') {
  for (let device of devices)
  console.log(`${device.name}`)
} else {
  const site = argv._[0];

  if (argv._[1].substr(0, 3) === 'res') {
    const resolution = argv._[1].substr(3).split('x');
    capture(site, resolution);
  } else {
    const device = argv._[1];
    capture(site, device);
  }
}
