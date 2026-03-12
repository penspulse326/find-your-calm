import end1 from '../assets/images/end_1.png';
import end2 from '../assets/images/end_2.png';
import end3 from '../assets/images/end_3.png';
import end4 from '../assets/images/end_4.png';

export interface ResultInfo {
  scoreRange: [number, number];
  title: string;
  message: string;
  breathingName: string;
  breathingDesc: string;
  image: string;
  bgColor: string; // For html-to-image background
  gradientClass: string; // For Tailwind UI
}

export const results: ResultInfo[] = [
  {
    scoreRange: [0, 4],
    title: '靜謐之森',
    message: '你的內心是一片平靜的湖泊。繼續保持目前的步調，每天 5 分鐘正念。',
    breathingName: '💡 建議練習：腹式呼吸',
    breathingDesc:
      '將手輕放在腹部，用鼻子深吸氣，感受肚子像氣球般隆起；接著用嘴巴緩慢吐氣，讓腹部自然凹陷。重複數次，能有效放鬆身心。',
    image: end1,
    bgColor: '#0d1a0d',
    gradientClass: 'from-[#0d1a0d] to-zinc-900',
  },
  {
    scoreRange: [5, 9],
    title: '起風的海面',
    message: '有些波浪，但你還能掌舵。建議減少咖啡因，並嘗試 4-7-8 呼吸法。',
    breathingName: '💡 建議練習：4-7-8 呼吸法',
    breathingDesc:
      '用鼻子吸氣 4 秒，憋氣 7 秒，最後用嘴巴緩慢且微噘嘴唇地吐氣 8 秒。這個循環能幫助啟動副交感神經，快速找回平靜。',
    image: end2,
    bgColor: '#0d141f',
    gradientClass: 'from-[#0d141f] to-zinc-900',
  },
  {
    scoreRange: [10, 14],
    title: '迷霧荒原',
    message: '你似乎迷失了方向。請實行數位排毒，嘗試箱式呼吸來找回主控權。',
    breathingName: '💡 建議練習：箱式呼吸',
    breathingDesc:
      '吸氣 4 秒，憋氣停頓 4 秒，吐氣 4 秒，再憋氣停頓 4 秒。想像氣流在畫一個正方形，能幫助穩定心跳，找回專注力。',
    image: end3,
    bgColor: '#1a1a2e',
    gradientClass: 'from-[#1a1a2e] to-zinc-900',
  },
  {
    scoreRange: [15, 100], // 100 as a safe upper bound
    title: '雷鳴深淵',
    message:
      '風暴已經來臨。請優先處理生理需求，並尋求專業諮詢，適時按下暫停鍵。',
    breathingName: '💡 應急練習：清涼呼吸法',
    breathingDesc:
      '將舌頭捲成 U 型（若無法捲舌可微微張開嘴唇），從嘴巴深吸氣，感受涼爽空氣進入。接著閉上嘴巴由鼻子緩慢吐氣。有助於平復極度焦躁的情緒。',
    image: end4,
    bgColor: '#1f0d0d',
    gradientClass: 'from-[#1f0d0d] to-zinc-900',
  },
];

export function getResultByScore(score: number): ResultInfo {
  return (
    results.find(r => score >= r.scoreRange[0] && score <= r.scoreRange[1])
    || results.at(-1)
  );
}
