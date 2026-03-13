/**
 * 打字機效果設定
 */
export const TYPING_CONFIG = {
  /** 一般字元打字延遲 (ms) */
  DEFAULT_DELAY: 50,
  /** 標點符號打字延遲 (ms) */
  PUNCTUATION_DELAY: 500,
  /** 等待動畫的小點更新頻率 (ms) */
  DOTS_FREQUENCY: 400,
  /** 標點符號匹配正則 */
  PUNCTUATION_REGEXP: /[，。！？；：、…—]/,
} as const;

/**
 * 畫面轉場設定
 */
export const TRANSITION_CONFIG = {
  /** 題目切換時的過渡延遲 (ms)，應與 CSS 動畫時間匹配 */
  QUIZ_TRANSITION_DELAY: 400,
  /** 自動進入下一步的對話延遲 (ms) */
  AUTO_NEXT_DELAY: 1500,
  /** 結果頁圖片生成前的準備延遲 (ms) */
  RESULT_GEN_PREPARE_DELAY: 800,
} as const;
