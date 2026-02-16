import { BlurView } from 'expo-blur';
import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}>;

export function GlassCard({ children, style, intensity = 35 }: Props) {
  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(20,20,20,0.35)',
  },
});

