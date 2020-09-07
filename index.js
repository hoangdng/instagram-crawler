const puppeteer = require('puppeteer-core');
const download = require('image-downloader');


(async () => {
    let launchOptions = {
        headless: false,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        userDataDir: "C:/Users/nguye/AppData/Local/Google/Chrome/User Data/Default"
    };
    const browser = await puppeteer.launch(launchOptions);
    console.log('Browser opened');
    const [page] = await browser.pages();
    const url = "https://www.instagram.com/himnha_/";
    await page.goto(url);
    console.log('Page loaded');
    var imgLinks = await autoScroll(page);

    //Tải các ảnh này về thư mục hiện tại
    await Promise.all(imgLinks.map(imgUrl => download.image({
        url: imgUrl,
        dest: "D:/Workspace/JavaScript/instagram-crawler/images-downloaded"
    })));
    await browser.close();
})();

async function autoScroll(page) {
    var result = await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 200;
            var imgLinks = [];
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                let imgElements = document.querySelectorAll('img.FFVAD');
                imgElements = [...imgElements];
                imgLinks = imgLinks.concat(imgElements.map(i => i.getAttribute('src')));
                if (totalHeight >= scrollHeight) {// || totalHeight == 1000){
                    clearInterval(timer);
                    resolve(imgLinks);
                }
            }, 500);
        });
    });
    return result;
}