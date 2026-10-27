
import AsyncStorage from "@react-native-async-storage/async-storage";

const KUNCI_CACHE_CUACA = "cache_cuaca_kota";

export async function simpanCacheCuaca(
  idKota: string,
  dataCuaca: unknown
) {
  try {
    const cacheLama = await AsyncStorage.getItem(
      KUNCI_CACHE_CUACA
    );

    const semuaCache = cacheLama
      ? JSON.parse(cacheLama)
      : {};

    semuaCache[idKota.toLowerCase()] = {
      data: dataCuaca,
      waktuSimpan: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      KUNCI_CACHE_CUACA,
      JSON.stringify(semuaCache)
    );
  } catch (error) {
    console.error("Gagal menyimpan cache cuaca:", error);
  }
}

export async function ambilCacheCuaca(idKota: string) {
  try {
    const cache = await AsyncStorage.getItem(
      KUNCI_CACHE_CUACA
    );

    if (!cache) return null;

    const semuaCache = JSON.parse(cache);

    return semuaCache[idKota.toLowerCase()] ?? null;
  } catch (error) {
    console.error("Gagal membaca cache cuaca:", error);
    return null;
  }
}

// Fungsi baru untuk menghapus cache satu kota
export async function hapusCacheCuaca(idKota: string) {
  try {
    const cacheLama = await AsyncStorage.getItem(
      KUNCI_CACHE_CUACA
    );

    if (!cacheLama) return;

    const semuaCache = JSON.parse(cacheLama);
    delete semuaCache[idKota.toLowerCase()];

    await AsyncStorage.setItem(
      KUNCI_CACHE_CUACA,
      JSON.stringify(semuaCache)
    );
  } catch (error) {
    console.error("Gagal menghapus cache cuaca:", error);
    throw error;
  }
}
