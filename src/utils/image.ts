import { toPng } from 'html-to-image';

/**
 * 等待容器內的所有圖片載入完成
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
 * 包含針對 Safari 的修正與基本配置
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

  // Safari 修正：有時需要呼叫兩次才能正確渲染圖片實體內容
  await toPng(element, finalOptions);
  return await toPng(element, finalOptions);
}
