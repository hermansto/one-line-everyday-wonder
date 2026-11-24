import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One sentence, at most 200 characters, one line, no trailing newline in the file.
const sentence =
  "My reflection in the elevator mirror blinked a half-second late, then smiled like it had been waiting all day for me to notice.";

if (sentence.length === 0) {
  throw new Error("entry must not be empty");
}
if (sentence.includes("\n") || sentence.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (sentence.length > 200) {
  throw new Error(`entry is ${sentence.length} characters, over the 200 limit`);
}
if (sentence !== sentence.trim()) {
  throw new Error("entry must not start or end with whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
writeFileSync(target, sentence, "utf8");

const back = readFileSync(target, "utf8");
if (back !== sentence) {
  throw new Error("entry.txt does not match the sentence byte-for-byte");
}
// Byte-level check: no trailing newline, exact byte count.
const bytes = readFileSync(target);
if (bytes.length !== Buffer.byteLength(sentence, "utf8")) {
  throw new Error("entry.txt byte count does not match the sentence");
}
if (bytes[bytes.length - 1] === 0x0a) {
  throw new Error("entry.txt must not end with a newline");
}
