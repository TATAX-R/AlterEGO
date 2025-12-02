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