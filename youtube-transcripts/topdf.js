
const PDFDocument = require('pdfkit');
const fs  = require('fs');

const filePath='./two.txt';
let filedata='';
const fd=fs.readFileSync(filePath, 'utf8');

// create a document the same way as above
const doc = new PDFDocument;
// add your content to the document here, as usual
doc.text(fd);
// get a blob when you're done
doc.pipe(fs.createWriteStream('Demo4.pdf'));
doc.end();


