
import { useState, useEffect, useRef } from "react";
import {
  mintaIzinLokasi,
  ambilKoordinatSaatIni,
} from "../../services/locationServices";
import {
  simpanCacheCuaca,
  ambilCacheCuaca,
} from "../../services/weatherCache";

import {
  View,
  Text,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import SearchBox from "../../../components/SearchBox";
import WeatherCard from "../../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../../src/services/geocodingservices";
import { ambilCuaca } from "../../services/weatherServices";
import { ambilKualitasUdara } from "../../services/airQualityService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../../types/geocoding";
import {
  DataCuacaLengkap,
  DataKualitasUdara,
} from "../../../types/weather";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
import { router, useLocalSearchParams } from "expo-router";
import { simpanRiwayat } from "../../services/riwayatstorage";

export default function HalamanUtama() {
  const { kota: kotaDariRiwayat } = useLocalSearchParams<{
    kota?: string;
  }>();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] =
    useState<HasilGeocoding | null>(null);
  const [cuaca, setCuaca] = useState<DataCuacaLengkap | null>(null);
  const [kualitasUdara, setKualitasUdara] =
    useState<DataKualitasUdara | null>(null);

  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [sudahFavorit, setSudahFavorit] = useState(false);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0);
  const riwayatDiprosesRef = useRef<string | null>(null);

  // Mencari kota berdasarkan teks yang dimasukkan pengguna
  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }

    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  // Memproses kota yang dipilih dari tab Riwayat
  
  useEffect(() => {
    const namaKota = Array.isArray(kotaDariRiwayat)
      ? kotaDariRiwayat[0]
      : kotaDariRiwayat;

    if (
      !namaKota ||
      riwayatDiprosesRef.current === namaKota
    ) {
      return;
    }

    riwayatDiprosesRef.current = namaKota;
    setTeksCari(namaKota);
    setPesanError(null);

    async function cariDariRiwayat() {
      try {
        const hasil = await cariKota(namaKota);

        const kota = hasil.find(
          (item) =>
            item.name.toLowerCase() ===
            namaKota.toLowerCase()
        ) ?? hasil[0];

        if (kota) {
          await pilihKota(kota);
        } else {
          setPesanError("Kota tidak ditemukan.");
        }
      } catch {
        setPesanError(
          "Gagal mencari kota. Periksa koneksi internet Anda."
        );
      }
    }

    cariDariRiwayat();
  }, [kotaDariRiwayat]);

  async function pilihKota(kota: HasilGeocoding) {
    // Simpan kota ke riwayat, kecuali lokasi GPS saat ini
    if (kota.id !== -1) {
      try {
        await simpanRiwayat(kota.name);
      } catch (error) {
        console.error("Gagal menyimpan riwayat:", error);
      }
    }

    setKotaTerpilih(kota);
    setPesanError(null);

    // Periksa apakah kota sudah menjadi favorit
    const daftarFavorit = await ambilSemuaFavorit();

    const sudahAda = daftarFavorit.some(
      (item) => item.id === kota.id
    );

    setSudahFavorit(sudahAda);

    const idSaatIni = ++requestIdRef.current;

    setSedangMemuat(true);

    try {
      const [dataCuaca, dataAQI] = await Promise.all([
        ambilCuaca(kota.latitude, kota.longitude),
        ambilKualitasUdara(kota.latitude, kota.longitude),
      ]);

      if (idSaatIni !== requestIdRef.current) return;

      setCuaca(dataCuaca);
      setKualitasUdara(dataAQI);
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;

      setPesanError(
        "Gagal memuat data cuaca. Periksa koneksi internet Anda."
      );
    } finally {
      if (idSaatIni === requestIdRef.current) {
        setSedangMemuat(false);
      }
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();

    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas."
      );
      return;
    }

    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual."
      );
      return;
    }

    setPesanLokasi(null);

    try {
      const koordinat = await ambilKoordinatSaatIni();

      await pilihKota({
        id: -1,
        name: "Lokasi Saat Ini",
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        country: "",
      });
    } catch {
      setPesanLokasi("Gagal mendapatkan lokasi perangkat.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
      <SearchBox onCari={setTeksCari} />

      <Button
        title="Gunakan Lokasi Saat Ini"
        onPress={gunakanLokasiSaatIni}
      />

      {pesanLokasi && <Text>{pesanLokasi}</Text>}

      {hasilPencarian.map((kota) => (
        <TouchableOpacity
          key={kota.id}
          onPress={() => pilihKota(kota)}
        >
          <Text>{kota.name}</Text>
        </TouchableOpacity>
      ))}

      {sedangMemuat && <ActivityIndicator />}

      {pesanError && (
        <View>
          <Text>{pesanError}</Text>

          <Button
            title="Coba Lagi"
            onPress={() => {
              if (kotaTerpilih) {
                pilihKota(kotaTerpilih);
              } else if (teksCari.trim()) {
                setPesanError(null);
                cariKota(teksCari)
                  .then((hasil) => {
                    if (hasil.length > 0) {
                      pilihKota(hasil[0]);
                    } else {
                      setPesanError("Kota tidak ditemukan.");
                    }
                  })
                  .catch(() =>
                    setPesanError("Gagal mencari kota.")
                  );
              }
            }}
          />
        </View>
      )}

      {cuaca &&
        kualitasUdara &&
        kotaTerpilih &&
        !sedangMemuat && (
          <>
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(
                kualitasUdara.indeksAQI
              )}
              suhuMaksimal={cuaca.harian.suhuMaksimal[0]}
              suhuMinimal={cuaca.harian.suhuMinimal[0]}
            />

            {!sudahFavorit && (
              <Button
                title="Tambahkan ke Favorit"
                onPress={() =>
                  router.push({
                    pathname: "/tambah-favorit" as any,
                    params: {
                      id: String(kotaTerpilih.id),
                      nama: kotaTerpilih.name,
                      lat: String(kotaTerpilih.latitude),
                      lon: String(kotaTerpilih.longitude),
                    },
                  })
                }
              />
            )}

            {sudahFavorit && (
              <Text>Kota ini sudah ada di favorit</Text>
            )}
          </>
        )}

      {cuaca && (
        <Text>
          Suhu hari ini: {cuaca.harian.suhuMinimal[0]}°C -{" "}
          {cuaca.harian.suhuMaksimal[0]}°C
        </Text>
      )}

      {cuaca && (
        <Text style={{ fontSize: 12, color: "#888" }}>
          Kondisi: {labelKodeCuaca(cuaca.saatIni.kodeCuaca)} • Angin{" "}
          {cuaca.saatIni.kecepatanAngin} km/j
        </Text>
      )}

      {kualitasUdara && (
        <Text style={{ fontSize: 12, color: "#888" }}>
          PM2.5: {kualitasUdara.pm25} µg/m³ • PM10:{" "}
          {kualitasUdara.pm10} µg/m³
        </Text>
      )}

      <AtribusiCuaca />
    </SafeAreaView>
  );
}
