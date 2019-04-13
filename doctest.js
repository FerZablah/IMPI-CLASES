
const docx = require("docx");
var fs = require("fs");

const { Document, Paragraph, Packer, Numbering, Indent } = docx;
const doc = new Document();

const paragraph = new Paragraph("Hello World");

doc.addParagraph(paragraph);
doc.addParagraph(paragraph);
var packer = new docx.Packer();
packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("My First Document.docx", buffer);
});