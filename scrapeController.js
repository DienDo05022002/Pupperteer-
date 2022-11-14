const fs = require('fs')
const scrape = require('./scrapePage')
const scrapeController = async (browserIn) => {
    const url = "https://phongtro123.com/"
    const indexCategory = [1,2,3,4]
    try {
        let browser = await browserIn
        //call scrapePage
        let categories = await scrape.scrapePage(browser,url)
        const selectCategories = categories.filter((category , index) => indexCategory.some(i => i ===index))
        // console.log(selectCategories)

        let api = await scrape.scrape(browser,selectCategories[0].link)
        fs.writeFile('total.json', JSON.stringify(api) , (err) => {
            if (err) console.log('Saving data in file failure : '+ err)
            console.log('Saving data successfully!!!')
        })
    } catch (error) {
        console.log('error in scrapeController '+error)
    }
}
module.exports = scrapeController