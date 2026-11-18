import fs from "node:fs";

const source = fs.readFileSync(
    "dist/khanvision.bundle.js",
    "utf8"
).trim();

if (!source) {
    throw new Error("Bundle is empty");
}

const bookmarklet = "javascript:" + encodeURIComponent(source);

fs.writeFileSync(
    "dist/bookmarklet.txt",
    bookmarklet,
    "utf8"
);

console.log("KhanVision build successful!");
console.log("Bundle:", source.length);
console.log("Bookmarklet:", bookmarklet.length);
