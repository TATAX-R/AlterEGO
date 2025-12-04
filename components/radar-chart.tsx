import React, { useState, useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';
import { useFocusEffect } from 'expo-router';

import { DiseaseType, HealthStats } from '@/types/index';
import { diseaseData, DISEASE_KEYS } from '@/constants/diseases';

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

  const animatedValue = useRef(new Animated.Value(0)).current;
  const [animProgress, setAnimProgress] = useState(0);

  useFocusEffect(
    useCallback(() => {
      animatedValue.setValue(0);

      const listenerId = animatedValue.addListener(({ value }) => {
        setAnimProgress(value);
      });

      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: false,
      }).start();

      return () => {
        animatedValue.removeListener(listenerId);
      };
    }, [animatedValue])
  );

  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPosition = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = radius + 25;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = data.map((value, index) => getPoint(value * animProgress, index));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const gridLevels = [1, 0.75, 0.5, 0.25];

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
        {gridLevels.map((level, i) => (
          <Polygon
            key={i}
            points={getPolygonPoints(level)}
            stroke={level === 1 ? '#919191ff' : '#e1e1e1ff'}
            strokeWidth={1}
            fill={level === 1 ? '#fcc7c7ff' : '#ffffffff'}
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
              stroke="#e1e1e1ff"
              strokeWidth={1}
            />
          );
        })}

        <Polygon points={polygonPoints} fill="#00a2ff52" stroke="#0097eeff" strokeWidth={2.5} />
      </Svg>

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
            onPress={() => onLabelPress?.(labelKeys[index], index)}>
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
  const data = DISEASE_KEYS.map((key) => stats[key]);
  const displayLabels = DISEASE_KEYS.map((key) => diseaseData[key].name);

  return (
    <View style={styles.container}>
      <CustomRadarChart
        data={data}
        labels={displayLabels}
        labelKeys={DISEASE_KEYS}
        maxValue={100}
        onLabelPress={(key) => {
          const diseaseInfo = diseaseData[key];
          console.log('ID:', diseaseInfo.id);
          console.log('名前:', diseaseInfo.name);
          console.log('Tips:', diseaseInfo.tips);
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
