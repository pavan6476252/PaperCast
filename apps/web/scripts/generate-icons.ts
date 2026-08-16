import fs from "fs";
import path from "path";
import * as LucideIcons from "lucide-react";

const iconNames = Object.keys(LucideIcons).filter(
  (k) => k !== "createLucideIcon" && k !== "default" && !k.startsWith("Lucide")
);

const outputPath = path.resolve(
  __dirname,
  "../../../packages/core/src/schema/icons.json"
);

fs.writeFileSync(outputPath, JSON.stringify(iconNames, null, 2));

console.log(
  `Successfully generated ${iconNames.length} icons to ${outputPath}`
);
