import { toPng } from 'html-to-image';

/**
 * 預載單張圖片，確保在快取中
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = reject;
  });
}

/**
 * 批次預載圖片
 */
export async function preloadImages(urls: string[]): Promise<void[]> {
  const promises = urls.map(url => preloadImage(url));
  return Promise.all(promises);
}

/**
 * 等待 DOM 容器內的所有 <img> 標籤載入完成
 */
export async function waitForImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images, (img) => {
    if (img.complete) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  await Promise.all(promises);
}

/**
 * 將指定的 DOM 元素轉換為 PNG Data URL
 */
export async function generateResultImage(
  element: HTMLElement,
  options: {
    backgroundColor: string;
    width?: number;
    height?: number;
    pixelRatio?: number;
  },
): Promise<string> {
  const finalOptions = {
    width: options.width || element.offsetWidth,
    height: options.height || element.offsetHeight,
    quality: 1,
    backgroundColor: options.backgroundColor,
    pixelRatio: options.pixelRatio || 2,
    cacheBust: true,
  };

  // Safari 修正：有時需要兩次才能正確渲染圖片實體內容
  await toPng(element, finalOptions);
  return await toPng(element, finalOptions);
}
