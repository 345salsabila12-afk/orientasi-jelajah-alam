// src/components/WeatherCard.tsx
import { View, Text } from "react-native";
import { WeatherCardProps, TingkatAQI } from "../types/cuaca";
import { typeScale, spacing } from "../src/constants/style";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "green",
  SEDANG: "goldenrod",
  TIDAK_SEHAT: "orange",
  BERBAHAYA: "crimson",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
  suhuMaksimal,
  suhuMinimal,
}: WeatherCardProps) {
  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;

  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, suhu maksimal ${suhuMaksimal} derajat, suhu minimal ${suhuMinimal} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, suhu maksimal ${suhuMaksimal} derajat, suhu minimal ${suhuMinimal} derajat, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: "#F4F7FA",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: typeScale.judul }}>
        {kota}
      </Text>

      <Text style={{ fontSize: 32 }}>{suhu}°C</Text>

      <Text
        style={{
          color: warnaPerTingkat[tingkatAQI],
          fontSize: typeScale.isi,
        }}
      >
        {teksAQI}
      </Text>

      {/* Suhu maksimal dan minimal hari ini */}
      <Text style={{ fontSize: typeScale.isi, marginTop: spacing.kecil }}>
        Maks: {suhuMaksimal}°C | Min: {suhuMinimal}°C
      </Text>
    </View>
  );
}