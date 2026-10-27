
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import {
  Alert,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ambilRiwayat } from "../../services/riwayatstorage";
import { hapusCacheCuaca } from "../../services/weatherCache";

export default function TabRiwayat() {
  const [daftarRiwayat, setDaftarRiwayat] = useState<string[]>([]);
  const [memuat, setMemuat] = useState(true);

  const muatRiwayat = useCallback(async () => {
    try {
      const data = await ambilRiwayat();
      setDaftarRiwayat(data);
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);

      if (Platform.OS === "web") {
        window.alert("Gagal memuat riwayat pencarian.");
      } else {
        Alert.alert("Error", "Gagal memuat riwayat pencarian.");
      }
    } finally {
      setMemuat(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      muatRiwayat();
    }, [muatRiwayat])
  );

  function bukaKota(namaKota: string) {
    router.push({
      pathname: "/",
      params: { kota: namaKota },
    });
  }

  async function konfirmasiHapusCache(namaKota: string) {
    // Khusus aplikasi yang dibuka melalui browser
    if (Platform.OS === "web") {
      const yakin = window.confirm(
        `Apakah kamu yakin ingin menghapus cache cuaca ${namaKota}?`
      );

      if (!yakin) return;

      try {
        await hapusCacheCuaca(namaKota);
        window.alert(`Cache cuaca ${namaKota} berhasil dihapus.`);
      } catch (error) {
        console.error("Gagal menghapus cache:", error);
        window.alert("Cache cuaca gagal dihapus.");
      }

      return;
    }

    // Untuk aplikasi Android atau iOS
    Alert.alert(
      "Hapus Cache Kota",
      `Apakah kamu yakin ingin menghapus cache cuaca ${namaKota}?`,
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await hapusCacheCuaca(namaKota);
              Alert.alert(
                "Berhasil",
                `Cache cuaca ${namaKota} berhasil dihapus.`
              );
            } catch (error) {
              console.error("Gagal menghapus cache:", error);
              Alert.alert("Gagal", "Cache cuaca gagal dihapus.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Riwayat Pencarian
      </Text>

      <Text style={{ marginTop: 6, marginBottom: 16, color: "#666" }}>
        Maksimal 10 pencarian kota terakhir
      </Text>

      {memuat ? (
        <ActivityIndicator size="large" />
      ) : daftarRiwayat.length === 0 ? (
        <Text>Belum ada riwayat pencarian kota.</Text>
      ) : (
        daftarRiwayat.map((kota, index) => (
          <View
            key={`${kota}-${index}`}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 10,
              backgroundColor: "#F1F5F9",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#222",
              }}
            >
              {kota}
            </Text>

            <Pressable
              onPress={() => bukaKota(kota)}
              style={{
                backgroundColor: "#DBEAFE",
                padding: 12,
                borderRadius: 8,
                marginTop: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#1D4ED8", fontWeight: "bold" }}>
                Cari Lagi
              </Text>
            </Pressable>

            <Pressable
              onPress={() => konfirmasiHapusCache(kota)}
              style={{
                backgroundColor: "#FEE2E2",
                padding: 12,
                borderRadius: 8,
                marginTop: 8,
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Text style={{ color: "#B91C1C", fontWeight: "bold" }}>
                Hapus Cache
              </Text>
            </Pressable>
          </View>
        ))
      )}
    </SafeAreaView>
  );
}
