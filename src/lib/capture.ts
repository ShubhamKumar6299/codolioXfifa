import { toPng } from 'html-to-image';

export async function captureCard(element: HTMLElement, filename = 'codoliofun-card.png') {
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: 'transparent',
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return dataUrl;
  } catch (err) {
    console.error('Failed to capture card:', err);
    throw err;
  }
}

export async function captureCardAsDataUrl(element: HTMLElement): Promise<string> {
  return toPng(element, {
    cacheBust: true,
    pixelRatio: 3,
    backgroundColor: 'transparent',
  });
}
