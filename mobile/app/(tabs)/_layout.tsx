import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS } from '../../constants/theme';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#120025',
          borderTopColor: '#2D1A55',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textDim,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Ana Sayfa" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: 'Okuma',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔮" label="Okuma" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tarot"
        options={{
          title: 'Tarot',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🃏" label="Tarot" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profil" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
