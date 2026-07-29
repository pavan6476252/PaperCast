import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import { TEST_DOCUMENT } from "../apps/web/src/store/test.data";

const schemaPath = path.join(
  __dirname,
  "../apps/web/src/schema/docframe.schema.json"
);

if (!fs.existsSync(schemaPath)) {
  console.error(
    `❌ Schema file not found at ${schemaPath}. Please run the generator first.`
  );
  process.exit(1);
}

let docframeSchema;
try {
  docframeSchema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
} catch (error) {
  console.error(`❌ Failed to parse schema JSON from ${schemaPath}:`, error);
  process.exit(1);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(docframeSchema);

console.log("Validating TEST_DOCUMENT against docframe.schema.json...");
const isValid = validate(TEST_DOCUMENT);

if (!isValid) {
  console.error("❌ Validation failed! Schema errors:");
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
}

console.log(
  "✅ Validation successful! The generated schema matches the test document."
);
process.exit(0);
