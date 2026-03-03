const fs = require('fs');
const PDFParser = require("pdf2json");

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync("pdf_output.txt", pdfParser.getRawTextContent());
    console.log("Successfully wrote to pdf_output.txt");
});

pdfParser.loadPDF("../DRAFT_RULEBOOK_VIHANG2025_v2.0.pdf");
