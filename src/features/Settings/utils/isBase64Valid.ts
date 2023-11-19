export function isBase64Valid(str: string): boolean {
  try {
    const buffer = Buffer.from(str, "base64");
    const decodedString = buffer.toString("base64");
    return decodedString === str;
  } catch (error) {
    return false;
  }
}
