/**
 * 測驗選項介面
 */
export interface Option {
  /** 選項標籤 (如: A, B, C) */
  label: string;
  /** 選項顯示文字 */
  text: string;
  /** 選擇此項獲得的分數 */
  score: number;
}

/**
 * 遊戲步驟/劇本單元介面
 */
export interface GameStep {
  /** 步驟類型：對話或測驗 */
  type: 'dialogue' | 'quiz';
  /** 顯示的文本內容 */
  text: string;
  /** 背景圖檔名 */
  bg: string;
  /** 角色圖檔名 */
  character: string;
  /** 自動等待時間 (毫秒)，若存在則時間到自動進入下一步 */
  wait?: number;
  /** 步驟唯一標識 */
  id?: number;
  /** 進度指示標籤 */
  indicator?: string;
  /** 測驗選項列表 (僅在 type 為 quiz 時使用) */
  options?: Option[];
}
