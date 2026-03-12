/**
 * 預載圖片工具
 * 確保在切換場景或角色時，圖片已經在快取中，避免閃爍
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = reject;
  });
}

export async function preloadImages(urls: string[]): Promise<void[]> {
  const promises = urls.map(url => preloadImage(url));
  return Promise.all(promises);
}
