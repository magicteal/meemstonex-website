const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const inputArg = process.argv[2] || "Products.xlsx";
const outputArg = process.argv[3] || "products_extracted.json";
const filePath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg);

try {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  if (data.length > 0) {
    console.log("Keys in first row:", Object.keys(data[0]));
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Extracted ALL ${data.length} rows to ${outputPath}`);
  } else {
    console.log("No data found in the Excel file.");
  }
} catch (error) {
  console.error("Error extracting products:", error);
}
