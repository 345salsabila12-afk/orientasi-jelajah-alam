
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_RIWAYAT = "@riwayat_pencarian_kota";
const MAKSIMAL_RIWAYAT = 10;

export async function ambilRiwayat(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(KEY_RIWAYAT);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal mengambil riwayat:", error);
    return [];
  }
}

export async function simpanRiwayat(namaKota: string): Promise<void> {
  const nama = namaKota.trim();
  if (!nama) return;

  const dataLama = await ambilRiwayat();

  const dataBaru = [
    nama,
    ...dataLama.filter(
      (kota) => kota.toLowerCase() !== nama.toLowerCase()
    ),
  ].slice(0, MAKSIMAL_RIWAYAT);

  await AsyncStorage.setItem(
    KEY_RIWAYAT,
    JSON.stringify(dataBaru)
  );
}
