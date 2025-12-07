import { DiseaseType, LifestyleDiseaseInfo } from '@/types/index';

export const DISEASE_KEYS: DiseaseType[] = [
  'obesity',
  'diabetes',
  'hypertension',
  'dyslipidemia',
  'gout',
];

export const diseaseData: Record<DiseaseType, LifestyleDiseaseInfo> = {
  obesity: {
    id: 'obesity',
    name: '肥満',
    threshold: 50,
    symptoms: [
      {
        id: 'palpitation',
        text: '心臓がバクバクする',
        tipsTitle: '動悸',
        tipsContent: '体重が増えると心臓に負担がかかり、動悸が起こりやすくなります。',
      },
      {
        id: 'shortness_of_breath',
        text: '息切れがする',
        tipsTitle: '息切れ',
        tipsContent: '肥満により肺や心臓の機能が低下し、息切れを感じやすくなります。',
      },
      {
        id: 'joint_pain',
        text: '関節が痛い',
        tipsTitle: '関節痛',
        tipsContent: '体重増加により関節に負担がかかり、痛みを引き起こしやすくなります。',
      },
    ],
    tips: '肥満は様々な生活習慣病のリスクを高めます。',
  },
  diabetes: {
    id: 'diabetes',
    name: '糖尿病',
    threshold: 50,
    symptoms: [
      {
        id: 'thirst',
        text: '喉が渇きやすいなあ...',
        tipsTitle: '喉の渇き',
        tipsContent: '高血糖により体内の水分が失われ、喉の渇きを感じやすくなります。',
      },
      {
        id: 'blurred_vision',
        text: '目がかすむなあ...',
        tipsTitle: '視力低下',
        tipsContent: '高血糖により網膜が損傷し、視力が低下することがあります。',
      },
    ],
    tips: '糖尿病は血糖値が高い状態が続く病気です。',
  },
  hypertension: {
    id: 'hypertension',
    name: '高血圧',
    threshold: 50,
    symptoms: [
      {
        id: 'headache',
        text: '頭が痛い...',
        tipsTitle: '頭痛',
        tipsContent: '高血圧により血管に負担がかかり、頭痛が起こることがあります。',
      },
      {
        id: 'dizziness',
        text: 'めまいがする...',
        tipsTitle: 'めまい',
        tipsContent: '高血圧が原因でめまいを感じることがあります。',
      },
      {
        id: 'shoulder_stiffness',
        text: '肩がこるなあ...',
        tipsTitle: '肩こり',
        tipsContent: '高血圧により血管に負担がかかり、肩こりが起こることがあります。',
      },
    ],
    tips: '高血圧は心臓や血管に負担をかけます。',
  },
  dyslipidemia: {
    id: 'dyslipidemia',
    name: '脂質異常症',
    threshold: 50,
    symptoms: [
      {
        id: 'chest_pain',
        text: '胸が苦しい...',
        tipsTitle: '胸の痛み',
        tipsContent: '脂質異常症により動脈硬化が進行し、胸の痛みを感じることがあります。',
      },
      {
        id: 'fatigue',
        text: '疲れやすい...',
        tipsTitle: '疲労感',
        tipsContent: '脂質異常症が原因で血流が悪くなり、疲れやすくなることがあります。',
      },
      {
        id: 'numbness',
        text: '手足がしびれる...',
        tipsTitle: '手足のしびれ',
        tipsContent: '脂質異常症により血流が悪くなり、手足のしびれを感じることがあります。',
      },
    ],
    tips: '脂質異常症は動脈硬化の原因になります。',
  },
  gout: {
    id: 'gout',
    name: '痛風',
    threshold: 50,
    symptoms: [
      {
        id: 'foot_pain',
        text: '足が痛い...',
        tipsTitle: '足の痛み',
        tipsContent: '痛風は尿酸が結晶化して関節に炎症を引き起こし、激しい痛みを伴います。',
      },
      {
        id: 'joint_swelling',
        text: '関節が腫れてる...',
        tipsTitle: '関節の腫れ',
        tipsContent: '尿酸の結晶が関節にたまり、腫れや炎症が起こります。',
      },
      {
        id: 'tophi',
        text: 'こぶができた...',
        tipsTitle: '痛風結節',
        tipsContent: '痛風結節は尿酸の結晶が皮膚の下にたまり、しこりや腫れを引き起こします。',
      },
    ],
    tips: '痛風は尿酸値が高くなることで起こります。',
  },
};
