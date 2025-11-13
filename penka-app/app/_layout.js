import { Stack } from 'expo-router';
import { GlobalProvider } from '../src/context/GlobalProvider';

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="crear-liga" options={{ presentation: 'modal' }} />
        <Stack.Screen name="perfil" options={{ presentation: 'modal' }} />
        <Stack.Screen name="partido" options={{ presentation: 'modal' }} />
      </Stack>
    </GlobalProvider>
  );
}
