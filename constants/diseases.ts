import { DiseaseType, LifestyleDiseaseInfo, Symptom } from '@/types/index';

/**
 * 仮の症状データを生成
 */
const createPlaceholderSymptom = (id: string, text: string): Symptom => ({
  id,
  text,
  tipsTitle: '準備中',
  tipsContent: 'この症状の詳細情報は準備中です。',
});

/**
 * 生活習慣病のマスタデータ
 */
export const diseaseData: Record<DiseaseType, LifestyleDiseaseInfo> = {
  obesity: {
    id: 'obesity',
    name: '肥満',
    threshold: 90,
    symptoms: [
      createPlaceholderSymptom('obesity_1', '体が重い...'),
      createPlaceholderSymptom('obesity_2', '息切れがする...'),
    ],
    tips: '肥満は様々な生活習慣病のリスクを高めます。',
  },
  diabetes: {
    id: 'diabetes',
    name: '糖尿病',
    threshold: 90,
    symptoms: [
      createPlaceholderSymptom('diabetes_1', '喉が渇く...'),
      createPlaceholderSymptom('diabetes_2', '目がかすむ...'),
    ],
    tips: '糖尿病は血糖値が高い状態が続く病気です。',
  },
  hypertension: {
    id: 'hypertension',
    name: '高血圧',
    threshold: 90,
    symptoms: [
      createPlaceholderSymptom('hypertension_1', '頭が痛い...'),
      createPlaceholderSymptom('hypertension_2', 'めまいがする...'),
    ],
    tips: '高血圧は心臓や血管に負担をかけます。',
  },
  dyslipidemia: {
    id: 'dyslipidemia',
    name: '脂質異常症',
    threshold: 90,
    symptoms: [
      createPlaceholderSymptom('dyslipidemia_1', '胸が苦しい...'),
      createPlaceholderSymptom('dyslipidemia_2', '疲れやすい...'),
    ],
    tips: '脂質異常症は動脈硬化の原因になります。',
  },
  gout: {
    id: 'gout',
    name: '痛風',
    threshold: 90,
    symptoms: [
      createPlaceholderSymptom('gout_1', '足が痛い...'),
      createPlaceholderSymptom('gout_2', '関節が腫れてる...'),
    ],
    tips: '痛風は尿酸値が高くなることで起こります。',
  },
};
