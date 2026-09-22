import { View, Text } from "react-native";
import { typeScale, spacing } from "../../constants/style";

export default function Tentang() {
  return (
    <View style={{ padding: spacing.sedang }}>
      <Text
        accessible
        accessibilityLabel="Halaman Tentang Jelajah Aman"
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          marginBottom: spacing.sedang,
        }}
      >
        Jelajah Aman
      </Text>

      <Text style={{ fontSize: typeScale.isi }}>
        Versi 1.0.0
      </Text>

      <Text
        style={{
          fontSize: typeScale.isi,
          marginTop: spacing.kecil,
        }}
      >
        Dibuat oleh Nilna Salsabila
      </Text>
    </View>
  );
}