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
  .command('capture', 'Capture screenshot from specified URL with given resolution/device', {
    siteurl: {
      describe: 'URL of page to capture.',
      demand: true,
    },
    viewport: {
      describe: 'Resolution to simulate in capture',
      demand: true,
    }
  })
  .help()
  .argv;

// List DeviceDescriptors
if (argv.devices) {
  devices.forEach((device) => console.log(`${device.name}`));
}

if (argv._[0] === 'capture') {
  if ((devices.filter((device) => device.name === argv.viewport)).length === 0) {
    capture(argv.siteurl, argv.viewport.split('x'));
  } else {
    capture(argv.siteurl, argv.viewport);
  }
}
