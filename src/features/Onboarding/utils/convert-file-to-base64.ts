export const convertFileToBase64 = async (fileUri: string): Promise<string> => {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject("Failed to read file as base64");
      }
    };
    reader.onerror = () => {
      reject("Failed to read file as base64");
    };
    reader.readAsDataURL(blob);
  });
};
