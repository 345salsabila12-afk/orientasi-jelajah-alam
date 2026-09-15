// app/index.tsx
import { View } from "react-native";
import { useState, useEffect } from "react";
// Catatan: gunakan ../components/ jika file berada di dalam folder app/
// yang sejajar dengan folder components/
import WeatherCard from "../../../components/WeatherCard";
import SearchBox from "../../../components/SearchBox";
import RiwayatList from "../../../components/RiwayatList";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HalamanUtama() {
const [kotaAktif, setKotaAktif] = useState("Pekalongan");
const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);
// Tambahkan useEffect untuk mencatat perubahan kota aktif
useEffect(() => {
console.log("Kota aktif berubah menjadi:", kotaAktif);
}, [kotaAktif]);
function handleCari(kota: string) {
setKotaAktif(kota);
if (!riwayat.includes(kota)) {
setRiwayat([...riwayat, kota]);
}
}
return (
  //3. View diganti menjadi SafeAreaView dengan style responsif
  <SafeAreaView style={{ flex: 1, padding: 32, paddingTop:50, gap: 16 }}>
    <SearchBox onCari={handleCari} />
    <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" />
    <RiwayatList daftarKota={riwayat} />
    </SafeAreaView>
    );
  }
