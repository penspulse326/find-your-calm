/**
 * 測驗結果資訊介面
 */
export interface ResultInfo {
  /** 分數範圍 [最小值, 最大值] */
  scoreRange: [number, number];
  /** 結果標題 (如: 靜謐之森) */
  title: string;
  /** 結果描述訊息 */
  message: string;
  /** 建議的呼吸法名稱 */
  breathingName: string;
  /** 呼吸法詳細說明 */
  breathingDesc: string;
  /** 外部支援連結說明 (選填) */
  supportLink?: string;
  /** 免責聲明文字 */
  disclaimer: string;
  /** 結果對應的圖片內容 (Base64 或路徑) */
  image: string;
  /** 背景底色 (Hex 格式，用於圖片生成背景) */
  bgColor: string;
  /** Tailwind 漸層類名 */
  gradientClass: string;
}
