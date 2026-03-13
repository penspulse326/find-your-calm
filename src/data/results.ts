import type { ResultInfo } from '../types/result';

export const results: ResultInfo[] = [
  {
    scoreRange: [0, 4],
    title: '靜謐之森',
    message:
      '目前的心理負荷較輕，內心如平靜湖泊。建議維持規律步調，透過短時間練習保持覺知。',
    breathingName: '💡 建議放鬆：腹式呼吸',
    breathingDesc:
      '將手輕放腹部，感受吸氣時的隆起與吐氣時的自然凹陷。此練習有助於維持穩定的副交感神經節奏。',
    image: '/images/end_1.png',
    bgColor: '#0d1a0d',
    gradientClass: 'from-[#0d1a0d] to-black',
    disclaimer: '本測驗僅供自我觀察參考，非專業診斷依據',
  },
  {
    scoreRange: [5, 9],
    title: '起風的海面',
    message:
      '當前感受到些微壓力起伏，這屬於正常的心理反應。建議適度減少咖啡因，並嘗試調節呼吸節奏。',
    breathingName: '💡 建議放鬆：4-7-8 規律呼吸',
    breathingDesc:
      '透過吸氣 4 秒、憋氣 7 秒、吐氣 8 秒的循環，引導身體進入休息模式，適合在睡前或感到匆忙時練習。',

    image: '/images/end_2.png',
    bgColor: '#0d141f',
    gradientClass: 'from-[#0d141f] to-black',
    disclaimer: '本測驗僅供自我觀察參考，非專業診斷依據',
  },
  {
    scoreRange: [10, 14],
    title: '迷霧荒原',
    message:
      '心理負荷較明顯，可能感到注意力較難集中。建議減少電子產品使用，並透過結構化練習找回主控權。',
    breathingName: '💡 建議放鬆：箱式呼吸',
    breathingDesc:
      '吸氣、憋氣、吐氣、憋氣各維持 4 秒。想像氣流在畫一個正方形，有助於平穩心跳並轉移過度運轉的思緒。',

    image: '/images/end_3.png',
    bgColor: '#1a1a2e',
    gradientClass: 'from-[#1a1a2e] to-black',
    disclaimer: '本測驗僅供自我觀察參考，非專業診斷依據',
  },
  {
    scoreRange: [15, 100],
    title: '雷鳴深淵',
    message:
      '您正處於高度壓力狀態。建議暫停手邊繁重任務，優先處理生理需求，並尋求專業諮詢資源的支持。',
    breathingName: '💡 應急放鬆：清涼呼吸練習',
    breathingDesc:
      '從嘴巴深吸氣感受涼意，再由鼻子緩慢吐氣。若情緒波動劇烈，建議透過衛福部安心專線 1925 取得專業的即時心理支持。',
    supportLink: '衛福部安心專線：1925',
    image: '/images/end_4.png',
    bgColor: '#1f0d0d',
    gradientClass: 'from-[#1f0d0d] to-black',
    disclaimer: '本測驗僅供自我觀察參考，非專業診斷依據',
  },
];

export function getResultByScore(score: number): ResultInfo {
  const result = results.find(
    r => score >= r.scoreRange[0] && score <= r.scoreRange[1],
  );
  return result || results.at(-1)!;
}
