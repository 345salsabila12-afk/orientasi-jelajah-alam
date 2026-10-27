
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../../contexts/themecontexts";

export default function TabLayout() {
  const { warna } = useTema();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: warna.card,
        },
        headerTintColor: warna.text,
        headerTitleStyle: {
          color: warna.text,
        },
        sceneStyle: {
          backgroundColor: warna.background,
        },
        tabBarStyle: {
          backgroundColor: warna.card,
          borderTopColor: warna.border,
        },
        tabBarActiveTintColor: warna.primary,
        tabBarInactiveTintColor: warna.secondaryText,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tambah-favorit"
        options={{
          title: "Favorit",
          tabBarLabel: "Favorit",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarLabel: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarLabel: "Pengaturan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang",
          tabBarLabel: "Tentang",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
