
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

export type PilihanTema = "terang" | "gelap" | "sistem";

const KUNCI_TEMA = "pilihan_tema";

const warnaTema = {
  terang: {
    background: "#F8FAFC",
    card: "#FFFFFF",
    text: "#111827",
    secondaryText: "#64748B",
    border: "#E2E8F0",
    primary: "#2563EB",
    input: "#F1F5F9",
  },
  gelap: {
    background: "#0F172A",
    card: "#1E293B",
    text: "#F8FAFC",
    secondaryText: "#CBD5E1",
    border: "#334155",
    primary: "#60A5FA",
    input: "#334155",
  },
};

type ThemeContextType = {
  pilihanTema: PilihanTema;
  temaAktif: "terang" | "gelap";
  warna: typeof warnaTema.terang;
  ubahTema: (tema: PilihanTema) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const skemaSistem = useColorScheme();
  const [pilihanTema, setPilihanTema] =
    useState<PilihanTema>("sistem");
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    async function muatTema() {
      try {
        const tersimpan = await AsyncStorage.getItem(KUNCI_TEMA);

        if (
          tersimpan === "terang" ||
          tersimpan === "gelap" ||
          tersimpan === "sistem"
        ) {
          setPilihanTema(tersimpan);
        }
      } catch (error) {
        console.error("Gagal memuat tema:", error);
      } finally {
        setSiap(true);
      }
    }

    muatTema();
  }, []);

  async function ubahTema(tema: PilihanTema) {
    setPilihanTema(tema);

    try {
      await AsyncStorage.setItem(KUNCI_TEMA, tema);
    } catch (error) {
      console.error("Gagal menyimpan tema:", error);
    }
  }

  const temaAktif =
    pilihanTema === "sistem"
      ? skemaSistem === "dark"
        ? "gelap"
        : "terang"
      : pilihanTema;

  const value: ThemeContextType = {
    pilihanTema,
    temaAktif,
    warna: warnaTema[temaAktif],
    ubahTema,
  };

  if (!siap) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTema harus digunakan di dalam ThemeProvider");
  }

  return context;
}
