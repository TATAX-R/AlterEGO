import React, { useState } from 'react';
import { Text, TouchableOpacity, Modal, View, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle, Line } from 'react-native-svg';

// ラベル詳細コンポーネント
interface LabelDetailProps {
  label: string;
  value: number;
  onClose: () => void;
}

function LabelDetail({ label, value, onClose }: LabelDetailProps) {
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{label}</Text>
          <Text style={styles.modalValue}>スコア: {value}</Text>
          <Text style={styles.modalDescription}>{getDescription(label)}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ラベルごとの説明を取得
function getDescription(label: string): string {
  const descriptions: Record<string, string> = {
    Speed: 'スピードは素早さや反応速度を表します。',
    Power: 'パワーは力強さや攻撃力を表します。',
    Skill: 'スキルは技術力や正確さを表します。',
    Luck: '運は偶然の要素や幸運度を表します。',
    Stamina: 'スタミナは持久力や体力を表します。',
  };
  return descriptions[label] || 'このステータスの説明はありません。';
}

// カスタムレーダーチャートコンポーネント
interface CustomRadarChartProps {
  data: number[];
  labels: string[];
  maxValue: number;
  size?: number;
  onLabelPress?: (label: string, index: number) => void;
}

function CustomRadarChart({
  data,
  labels,
  maxValue,
  size = 250,
  onLabelPress,
}: CustomRadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / labels.length;

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

  // データポイントを生成
  const dataPoints = data.map((value, index) => getPoint(value, index));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // グリッドの円を生成
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* グリッドの円 */}
        {gridLevels.map((level, i) => (
          <Circle
            key={i}
            cx={center}
            cy={center}
            r={radius * level}
            stroke="#ddd"
            strokeWidth={1}
            fill="none"
          />
        ))}

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
              stroke="#ddd"
              strokeWidth={1}
            />
          );
        })}

        {/* データのポリゴン */}
        <Polygon
          points={polygonPoints}
          fill="rgba(0, 122, 255, 0.3)"
          stroke="#007AFF"
          strokeWidth={2}
        />

        {/* データポイント */}
        {dataPoints.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r={4} fill="#007AFF" />
        ))}
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
            onPress={() => onLabelPress?.(label, index)}>
            <Text style={styles.labelText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function RadarChartView() {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const labels = ['Speed', 'Power', 'Skill', 'Luck', 'Stamina'];
  const data = [70, 50, 80, 40, 90];

  // 選択されたラベルの値を取得
  const getValueForLabel = (label: string): number => {
    const index = labels.indexOf(label);
    return index >= 0 ? data[index] : 0;
  };

  return (
    <View style={styles.container}>
      <CustomRadarChart
        data={data}
        labels={labels}
        maxValue={100}
        onLabelPress={(label) => setSelectedLabel(label)}
      />

      {/* ラベル詳細モーダル */}
      {selectedLabel && (
        <LabelDetail
          label={selectedLabel}
          value={getValueForLabel(selectedLabel)}
          onClose={() => setSelectedLabel(null)}
        />
      )}
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
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 280,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
});
