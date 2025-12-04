import { z } from 'zod';
/**
 * 生活習慣病の種類
 * レーダーチャートやパラメータ管理のキーとして使用
 */
export type DiseaseType =
  | 'obesity' // 肥満
  | 'diabetes' // 糖尿病
  | 'hypertension' // 高血圧
  | 'dyslipidemia' // 脂質異常症
  | 'gout'; // 痛風

/**
 * 生命の危機レベル（UIの演出やBGM変化に使用）
 * - safe: 健康 (パラメータが低い)
 * - warning: 発症中 (閾値を超えている)
 * - danger: 危険域 (死亡判定ラインに近い)
 */
export type DeathRiskLevel = 'safe' | 'warning' | 'danger';

/**
 * 健康パラメータの実数値
 * 基本的に 0(健康) 〜 100(死亡) の範囲で管理することを想定
 */
export type HealthStats = {
  [key in DiseaseType]: number;
};

/**
 * ペットの動的ステータス (AsyncStorage保存対象)
 * ※注意: Date型は保存時にISO文字列変換、読み込み時にDate復元が必要
 */
export type PetState = {
  isAlive: boolean; // 生存フラグ (falseで墓を表示)
  deathRiskLevel: DeathRiskLevel; // 現在の危険度レベル
  birthDate: Date; // 誕生日（生存日数の計算に使用）
  lastFedDate: Date; // 最後に食べた時間（空腹計算や放置ペナルティに使用）
  stats: HealthStats; // 現在の各病気パラメータ
  mood: 'happy' | 'normal' | 'sad' | 'sick'; // ペットの機嫌・見た目ステート
  activeSymptom: Symptom | null; // 現在吹き出しに出ている症状 (nullなら健康なセリフ)
};

/**
 * 生活習慣病のマスタデータ定義
 * (定数ファイルで定義し、変更しないデータ)
 */
export type LifestyleDiseaseInfo = {
  id: DiseaseType;
  name: string; // 表示名 (例: "糖尿病")
  threshold: number; // 発症する閾値 (例: 70)
  symptoms: Symptom[]; // この病気に関連する症状リスト
  tips: string; // 病気自体の一般的な解説 (ステータス画面等で使用)
};

/**
 * 症状のマスタデータ定義
 * (吹き出しとモーダルの中身)
 */
export type Symptom = {
  id: string; // 特定用ID
  text: string; // 吹き出しに表示するセリフ (例: "目がかすむ...")
  tipsTitle: string; // モーダル表示時のタイトル (例: "視力低下")
  tipsContent: string; // モーダル表示時の詳細解説 (例: "高血糖により網膜が...")
};

/**
 * Gemini APIによる食事画像解析結果
 */
export type FoodAnalysisResult = {
  isFood: boolean; // 食べ物として認識されたか
  foodName: string; // 料理名
  impact: {
    // 各パラメータへの増減値 (例: obesity: +5, diabetes: +2)
    [key in DiseaseType]: number;
  };
  message?: string; // AIからのコメント
};

/**
 * 歩数データ
 */
export type StepData = {
  todaySteps: number; // 今日の歩数
  targetSteps: number; // 目標歩数 (ゲージの分母に使用)
};

/*
  AIがjsonを出力するためのapi専用型定義
*/
// =========================================================
// ★ ここから追記: AI連携用のZodスキーマ定義
// 型定義とは別に「AIへの指示書」として用意します
// =========================================================

/**
 * AI用: 病気IDのリスト
 * ※注意: 上の DiseaseType と中身を合わせる必要があります
 */
export const diseaseTypeSchema = z.enum([
  'obesity',
  'diabetes',
  'hypertension',
  'dyslipidemia',
  'gout',
]);

/**
 * AI用: 解析結果の構造定義
 * アプリ側の型 `FoodAnalysisResult` と互換性のある形で作ります
 */
export const foodAnalysisResultSchema = z.object({
  isFood: z.boolean().describe('画像が食べ物かどうか。bool値で返してください。'),
  foodName: z.string().describe('料理名。不明なら「不明」とする。'),

  // ★修正1: z.array() を取り除き、単一の z.object() に変更
  impact: z
    .object({
      obesity: z
        .number()
        .min(-10)
        .max(10) // ★Zodで制限値を強制
        .describe('肥満への影響度 (+/-)。範囲は-10から10。食べ物でない場合は0。'),

      diabetes: z
        .number()
        .min(-10)
        .max(10)
        .describe('血糖値への影響度 (+/-)。範囲は-10から10。食べ物でない場合は0。'),

      hypertension: z
        .number()
        .min(-10)
        .max(10)
        .describe('血圧への影響度 (+/-)。範囲は-10から10。食べ物でない場合は0。'),

      dyslipidemia: z
        .number()
        .min(-10)
        .max(10)
        .describe('脂質への影響度 (+/-)。範囲は-10から10。食べ物でない場合は0。'),

      gout: z
        .number()
        .min(-10)
        .max(10)
        .describe('尿酸値への影響度 (+/-)。範囲は-10から10。食べ物でない場合は0。'),
    })
    // describeは object 全体への説明として配置
    .describe(
      'この食事を摂取した時の各パラメータへの増減値。必ず全ての項目を埋めること。絶対にオブジェクト形式で返答すること'
    ),

  message: z
    .string()
    .optional()
    .describe(
      'AIからのコメントです。最大50文字程度で収めるように調整してください。nullは絶対に入れないで。その場合は「コメントはありません」と出力すること'
    ),
});
