const scrapePage = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      const page = await browser.newPage();
      await page.goto(url);
      console.log('Access to::' + url);
      const number = await browser.pages();
      console.log('Number pages::', number.length);
      await page.waitForSelector('#webpage');
      console.log('Loading successfully!!!');

      const dataCategory = await page.$$eval(
        '#navbar-menu > ul > li',
        (els) => {
          dataCategory = els.map((el) => {
            return {
              Category: el.querySelector('a').innerText,
              link: el.querySelector('a').href,
            };
          });
          return dataCategory;
        }
      );
      // console.log(dataCategory);

      // await page.close();
      console.log('Accessfully::>> Close tab');
      resolve(dataCategory);
    } catch (error) {
      reject(error);
    }
  });

const scrape = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      const newPage = await browser.newPage();
      await newPage.goto(url);
      console.log('Access new tab::' + url);
      await newPage.waitForSelector('#main');
      console.log('Loading successfully new tab!!!');

      //data
      const scrapeData = {}
      //header
      const headerData = await newPage.$eval('header', (el) => {
          return {
            titleHeader: el.querySelector('h1').innerText,
            description: el.querySelector('p').innerText,
          };
      });
      scrapeData.header = headerData
      // console.log(scrapeData)

      //Link detail item
      const linkDetail = await newPage.$$eval('#left-col > .section.section-post-listing ul > li', (els) => {
        linkDetail = els.map(el => {
          return  el.querySelector('.post-meta > h3 > a').href
        })
        return linkDetail
      });
      // console.log(linkDetail)

      const scrapeDetail = async (link) => new Promise(async(resolve, reject)=> {
        try {
          const pageDetail = await browser.newPage();
          await pageDetail.goto(link);
          console.log('Accessfully link detail :::' + link);
          await pageDetail.waitForSelector('#main');

          //start scrape
          const detailData = {}
          const img = await pageDetail.$$eval('#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide', (els) => {
            img = els.map((el) => {
              return  el.querySelector('img')?.src
            });
            return img.filter(i => !i === false)
          });
          detailData.images = img

          //header
          const header = await pageDetail.$eval('header.page-header', (el) => {
              return {
                titleHeader: el.querySelector('h1 > a').innerText,
                star: el.querySelector('h1 > span').className.replace( /^\D+/g, ''),
                class: {
                  content: el.querySelector('p').innerText,
                  contentType: el.querySelector('p > a > strong').innerText,
                },
                address: el.querySelector('address').innerText,
              }
          });
          detailData.header = header

          //----------description information----------
          const mainDescription = await pageDetail.$eval('#left-col > article > section.section.post-main-content > div.section-header',(el) => 
            el.querySelector('h2').innerText,
          )
          const mainContentDescription = await pageDetail.$$eval('#left-col > article > section.section.post-main-content > div.section-content > p',(els) => 
            mainContentDescription = els.map(el => el.innerText)
          )
          detailData.mainContainerDescription = {
            mainDescription: mainDescription,
            mainContentDescription: mainContentDescription
          }
          console.log(detailData)

          //----------Posting characteristics----------
        const overviewDescription = await pageDetail
        .$eval('#left-col > article > section.section.post-overview > div.section-header',(el) => 
          el.querySelector('h3').innerText,
        )
        const overviewContentDescription = await pageDetail
        .$$eval('#left-col > article > section.section.post-overview > div.section-content > table > tbody > tr',(els) => els.map(el => ({
          name: el.querySelector('td:first-child').innerText,
          content: el.querySelector('td:last-child').innerText,
        })))
        detailData.overview = {
          overviewDescription: overviewDescription,
          overviewContentDescription: overviewContentDescription
        }
        console.log(detailData.overview)

        //Information system

          await pageDetail.close()
          console.log('close pageDetail:'+link)
          resolve(detailData)
        } catch (error) {
          console.log('Data linkDetail err:'+error)
          reject(error)
        }
      })
      const result = []
      for (let link in linkDetail) {
        const signle = await scrapeDetail(linkDetail[link]);
        result.push(signle)
      }
      scrapeData.body = result

      await newPage.close();
      console.log('::>> Close tab');
      resolve(scrapeData);
    } catch (error) {
      reject(error);
    }
  });

module.exports = { scrapePage,scrape };
