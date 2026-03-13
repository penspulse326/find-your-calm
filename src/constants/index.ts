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

/**
 * 測驗進度背景色調 (從 Q1 到 Q10)
 */
export const BACKGROUND_THEMES = [
  'bg-[#A7C7E7]', // Q1 (淺藍)
  'bg-[#A5D2D8]', // Q2
  'bg-[#A3DDC9]', // Q3
  'bg-[#A1E8BA]', // Q4
  'bg-[#9FF3AB]', // Q5
  'bg-[#9DFE9C]', // Q6
  'bg-[#A6F794]', // Q7
  'bg-[#B0EF8C]', // Q8
  'bg-[#BAE784]', // Q9
  'bg-[#C4DF7C]', // Q10 (清新綠)
] as const;

/**
 * 介面文字常量
 */
export const UI_STRINGS = {
  HOME_TITLE: '平靜小棧',
  HOME_SUBTITLE: '你有多久沒有好好放鬆了呢？\n來做個深呼吸，讓世界慢下來！',
  RESTART_CONFIRM_TITLE: '確認重開？',
  RESTART_CONFIRM_DESC: '返回首頁將不會保留當前的測驗進度，需要重新進行。',
  GEN_IMAGE_TIP: '長按或右鍵以另存圖片',
  RESTART_BTN: '重新測驗',
} as const;
