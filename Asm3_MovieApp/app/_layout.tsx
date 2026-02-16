import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: true,
            headerTransparent: true,
            title: '',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
