import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';

import { DiseaseType, HealthStats } from '@/types/index';
import { diseaseData } from '@/constants/diseases';

// ラベルキー配列
const labelKeys: DiseaseType[] = ['obesity', 'diabetes', 'hypertension', 'dyslipidemia', 'gout'];

// disease.tsから表示ラベルを取得
const displayLabels: string[] = labelKeys.map((key) => diseaseData[key].name);

// カスタムレーダーチャートコンポーネント
interface CustomRadarChartProps {
  data: number[];
  labels: string[];
  labelKeys: DiseaseType[];
  maxValue: number;
  size?: number;
  onLabelPress?: (labelKey: DiseaseType, index: number) => void;
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

interface RadarChartViewProps {
  stats: HealthStats;
}

export default function RadarChartView({ stats }: RadarChartViewProps) {
  // HealthStatsからデータを取得
  const data = labelKeys.map((key) => stats[key]);

  return (
    <View style={styles.container}>
      <CustomRadarChart
        data={data}
        labels={displayLabels}
        labelKeys={labelKeys}
        maxValue={100}
        onLabelPress={(key) => {
          // 選択された病気の情報をコンソールに出力
          const diseaseInfo = diseaseData[key];
          console.log('Selected disease:', key, diseaseInfo);
        }}
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
