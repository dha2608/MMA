import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
};

export function GlassCard({ style, intensity = 22, tint = 'dark', children, ...rest }: Props) {
  // BlurView on Android can be heavier; keep intensity modest.
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webFallback, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} tint={tint} style={[styles.card, style]} {...rest}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  webFallback: {
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
});

