const puppeteer = require('puppeteer');

const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: false,
            'ignoreHTTPSErrors': true
        });
        
    } catch (error) {
        console.log('Create failed browser:' +error)
    }
    return browser
}
module.exports = startBrowser