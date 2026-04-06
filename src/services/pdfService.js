const PDFParser = require("pdf2json");

async function extractText(buffer) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1); // '1' flag extracts raw text

        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve(pdfParser.getRawTextContent());
        });

        pdfParser.parseBuffer(buffer);
    });
}

module.exports = { extractText };