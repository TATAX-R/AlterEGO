import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, Modal, View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Polygon, Circle, Line } from 'react-native-svg';

export type DiseaseType =
  | 'obesity' // 肥満
  | 'diabetes' // 糖尿病
  | 'hypertension' // 高血圧
  | 'dyslipidemia' // 脂質異常症
  | 'gout' // 痛風
  | 'other';

export type HealthStats = {
  [key in DiseaseType]: number;
};

// サンプルデータ
const patientHealth: HealthStats = {
  obesity: 75,
  diabetes: 60,
  hypertension: 80,
  dyslipidemia: 55,
  gout: 40,
  other: 0,
};

// ラベル詳細コンポーネント
interface LabelDetailProps {
  labelKey: DiseaseType;
  displayLabel: string;
  value: number;
  onClose: () => void;
}

// カスタムレーダーチャートコンポーネント
interface CustomRadarChartProps {
  data: number[];
  labels: string[];
  labelKeys: string[];
  maxValue: number;
  size?: number;
  onLabelPress?: (labelKey: string, index: number) => void;
}

function CustomRadarChart({
  data,
  labels,
  labelKeys,
  maxValue,
  size = 300,
  onLabelPress,
}: CustomRadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / labels.length;

  // アニメーション用
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    // アニメーションをリッスン
    const listenerId = animatedValue.addListener(({ value }) => {
      setAnimProgress(value);
    });

    // 登場アニメーション
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listenerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 座標を計算
  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // ラベルの位置を計算
  const getLabelPosition = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = radius + 25;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // データポイントを生成（アニメーション適用）
  const dataPoints = data.map((value, index) => getPoint(value * animProgress, index));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // グリッドの五角形を生成
  const gridLevels = [1, 0.75, 0.5, 0.25];

  // 五角形のポイントを生成
  const getPolygonPoints = (level: number) => {
    return labels
      .map((_, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const r = radius * level;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
      })
      .join(' ');
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* グリッドの五角形 */}
        {gridLevels.map((level, i) =>
          level === 1 ? (
            <Polygon
              key={i}
              points={getPolygonPoints(level)}
              stroke="#919191ff"
              strokeWidth={1}
              fill="#fcc7c7ff"
            />
          ) : level === 0.75 ? (
            <Polygon
              key={i}
              points={getPolygonPoints(level)}
              stroke="#e1e1e1ff"
              strokeWidth={1}
              fill="#ffffffff"
            />
          ) : (
            <Polygon
              key={i}
              points={getPolygonPoints(level)}
              stroke="#e1e1e1ff"
              strokeWidth={1}
              fill="#ffffffff"
            />
          )
        )}

        {/* 軸の線 */}
        {labels.map((_, index) => {
          const point = getPoint(maxValue, index);
          return (
            <Line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#e1e1e1ff"
              strokeWidth={1}
            />
          );
        })}

        {/* データのポリゴン */}
        <Polygon points={polygonPoints} fill="#00a2ff52" stroke="#0097eeff" strokeWidth={2.5} />
      </Svg>

      {/* クリック可能なラベル */}
      {labels.map((label, index) => {
        const pos = getLabelPosition(index);
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.labelTouchable,
              {
                position: 'absolute',
                left: pos.x - 40,
                top: pos.y - 12,
              },
            ]}
            onPress={() => {
              console.log('Label pressed:', labelKeys[index]);
            }}>
            <Text style={styles.labelText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function RadarChartView() {
  const [selectedKey, setSelectedKey] = useState<DiseaseType | null>(null);

  const displayLabels: string[] = ['肥満', '糖尿病', '高血圧', '脂質異常症', '痛風'];
  const labelKeys: DiseaseType[] = ['obesity', 'diabetes', 'hypertension', 'dyslipidemia', 'gout'];
  const data = [
    patientHealth.obesity,
    patientHealth.diabetes,
    patientHealth.hypertension,
    patientHealth.dyslipidemia,
    patientHealth.gout,
  ];

  // 英語キーから日本語ラベルを取得
  const getDisplayLabel = (key: DiseaseType): string => {
    const index = labelKeys.indexOf(key);
    return index >= 0 ? displayLabels[index] : key;
  };

  // 選択されたキーの値を取得
  const getValueForKey = (key: DiseaseType): number => {
    return patientHealth[key] ?? 0;
  };

  return (
    <View style={styles.container}>
      <CustomRadarChart
        data={data}
        labels={displayLabels}
        labelKeys={labelKeys}
        maxValue={100}
        onLabelPress={(key) => setSelectedKey(key as DiseaseType)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelTouchable: {
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  labelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
});
