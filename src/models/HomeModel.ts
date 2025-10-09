export interface StatisticData {
  value: string;
  unit?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FeatureData {
  title: string;
  description: string;
}

export class HomeModel {
  private statistics: StatisticData[] = [
    {
      value: "1.923",
      title: "Total Hoaks Ditemukan (2024)",
      description:
        "Sepanjang tahun 2024, Komdigi mengidentifikasi dan mengklarifikasi ribuan konten hoaks.",
      icon: "globe",
    },
    {
      value: "215",
      title: "Puncak Kasus Bulanan",
      description:
        "Jumlah kasus hoaks terbanyak terjadi pada bulan September 2024.",
      icon: "calendar",
    },
    {
      value: "2x",
      unit: "Lebih Cepat",
      title: "Penyebaran Hoaks",
      description:
        "Hoaks dapat viral dalam hitungan menit, jauh lebih cepat daripada klarifikasi.",
    },
    {
      value: "70%+",
      title: "Penyebaran Hoaks",
      description:
        "Hoaks dapat viral dalam hitungan menit, jauh lebih cepat daripada klarifikasi.",
    },
  ];

  private features: FeatureData[] = [
    {
      title: "Akses instan",
      description: "melalui WhatsApp Bot",
    },
    {
      title: "Analisis edukatif",
      description: "Mudah dipahami",
    },
  ];

  private appInfo = {
    title: "NoFake",
    subtitle: "Lindungi Diri Anda dari Misinformasi & Hoaks",
    verificationTitle: "Mulai Verifikasi",
    verificationDescription:
      "Bagikan tautan atau cuplikan berita yang meragukan, dan dapatkan hasil verifikasi yang jelas, akurat, serta mudah dipahami.",
    whyTitle: "Mengapa Harus?",
    ctaText: "Coba Sekarang",
    footerText: "© 2025 NoFake. Semua Hak Dilindungi.",
  };

  getStatistics(): StatisticData[] {
    return this.statistics;
  }

  getFeatures(): FeatureData[] {
    return this.features;
  }

  getAppInfo() {
    return this.appInfo;
  }
}
