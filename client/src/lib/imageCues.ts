import { cuesFromRgba, type ImageCue } from "@shared/questInstruments";

const MAX_EDGE = 64;

export function cuesFromDataUrl(url: string): Promise<ImageCue> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const longest = Math.max(image.naturalWidth, image.naturalHeight, 1);
      const scale = Math.min(1, MAX_EDGE / longest);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        reject(new Error("This browser could not read the photograph."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      resolve(cuesFromRgba(pixels.data, canvas.width, canvas.height));
    };
    image.onerror = () => reject(new Error("Could not read that photograph. Try another file."));
    image.src = url;
  });
}

function isPhotograph(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);
}

export async function readPhotograph(file: File): Promise<{ url: string; cues: ImageCue | null }> {
  if (!isPhotograph(file)) {
    throw new Error("Choose a photograph. JPEG, PNG, WebP, and HEIC are accepted.");
  }
  if (file.size > 6 * 1024 * 1024) {
    throw new Error("That photograph is over 6 MB. Use a smaller one.");
  }
  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that photograph."));
    reader.readAsDataURL(file);
  });
  try {
    const cues = await cuesFromDataUrl(url);
    return { url, cues };
  } catch {
    return { url, cues: null };
  }
}
