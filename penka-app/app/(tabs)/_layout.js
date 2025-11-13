import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#101922', borderTopColor: '#364352' },
        tabBarActiveTintColor: '#1173d4',
        tabBarInactiveTintColor: '#92adc9',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="mis-penkas" options={{ title: 'Mis Penkas' }} />
      <Tabs.Screen name="partidos" options={{ title: 'Partidos' }} />
      <Tabs.Screen name="clasificacion" options={{ title: 'Clasificación' }} />
    </Tabs>
  );
}
