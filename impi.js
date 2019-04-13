/**
 * @name Twitter
 *
 * @desc Logs into Twitter. Provide your username and password as environment variables when running the script, i.e:
 * `TWITTER_USER=myuser TWITTER_PWD=mypassword node twitter.js`
 *
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const docx = require("docx");
const { Document, Paragraph, Packer, Numbering, Indent } = docx;
const doc = new Document();

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1080 })
  await page.goto('https://clasniza.impi.gob.mx/Lists/ClasNiza2019/Alfabetica.aspx?FilterField1=Clase&FilterValue1=42&IsDlg=1')
  const selector = '#scriptWPQ2';

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time)
    });
  }

  var str = "";
  for (let i = 0; i < 95; i++) {
    const row = await page.$$eval(selector, trs => trs.map(tr => {
      const tds = [...tr.getElementsByTagName('td')];
      return tds.map(td => td.textContent);
    }));
    for (const servicio of row[0]) {
      if (servicio.length > 7) {
        const paragraph = new Paragraph(servicio);
        doc.addParagraph(paragraph);
        str += servicio + "\n";
      }
    }
    await page.evaluate(() => {
      const obj = document.querySelector('[title~=Siguiente]');
      if (obj != null) {
        obj.click();
      }
    });
    await delay(350);
    console.log(i);
  }
  var packer = new docx.Packer();
  packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync("My First Document.docx", buffer);
  });
  console.log(str);

})()