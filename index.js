const puppeteer = require('puppeteer-core');
const download = require('image-downloader');


(async () => {
    let launchOptions = {
        headless: false,
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        userDataDir: "C:\\Users\\nguye\\AppData\\Local\\Google\\Chrome\\User Data"
    };
    const browser = await puppeteer.launch(launchOptions);
    console.log('Browser opened');
    const [page] = await browser.pages();
    const url = "https://www.instagram.com/explore/tags/cat/";
    await page.goto(url);
    console.log('Page loaded');
    await autoScroll(page);
    //window.scrollTo(0,document.body.scrollHeight);
    const imgLinks = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('img.FFVAD');
        imgElements = [...imgElements];
        let imgLinks = imgElements.map(i => i.getAttribute('src'));
        return imgLinks;
    });
    console.log(imgLinks);

    //Tải các ảnh này về thư mục hiện tại
    await Promise.all(imgLinks.map(imgUrl => download.image({
        url: imgUrl,
        dest: "D:\\ThucHanh\\Web\\InstagramCrawler\\Pic"
    })));

    //await browser.close();
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 200;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight || totalHeight == 1000){
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}