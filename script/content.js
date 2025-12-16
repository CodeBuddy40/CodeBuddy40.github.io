const contentData = {
  layanan: [
    {
      icon: "code-2",
      title: "Tugas Kuliah",
      desc: "Pengerjaan tugas pemrograman (Python, C++, Java, DS, Alpro) dengan laporan lengkap.",
      price: "Mulai Rp 50rb",
      color: "indigo",
    },
    {
      icon: "globe",
      title: "Web & Apps",
      desc: "Membangun Landing Page, E-Commerce, hingga Sistem Informasi Management (SIM).",
      price: "Mulai Rp 500rb",
      color: "cyan",
    },
    {
      icon: "settings",
      title: "Custom Project",
      desc: "Punya kebutuhan khusus? Diskusikan dengan kami, kami cari solusinya.",
      price: "Konsultasi Gratis",
      color: "orange",
    },
    {
      icon: "file-text", // Icon CV
      title: "CV & Lamaran Kerja",
      desc: "Jasa pembuatan CV ATS-Friendly dan surat lamaran kerja profesional untuk meningkatkan peluang interview dan sekaligus compress PDF.",
      price: "Mulai Rp 10rb", // Tambahkan ini
      color: "indigo",
    },
  ],
  portfolio: [
    {
      tag: "Web Development",
      title: "SPK Pemilihan Siswa Berprestasi",
      desc: "Sebuah Sistem untuk mencari siswa berprestasi dengan menggunakan metode SAW",
      img: "img/project-1.PNG",
      color: "indigo",
    },
    {
      tag: "Web Development",
      title: "Sistem Informasi Peramalan Penjualan",
      desc: "Aplikasi ini digunakan untuk melakukan peralaman penjualan tiap bulan dengan metode trend moment",
      img: "img/project-2.PNG",
      color: "cyan",
    },
    {
      tag: "Web Development",
      title: "Smart Jadwal",
      desc: "Aplikasi yang membantu anda untuk melakukan generate jadwal mata pelajaran secara otomatis tanpa takut bentrok",
      img: "img/project-3.PNG",
      color: "purple",
    },
  ],
};

function renderContent() {
  // 1. Render Layanan
  const servicesContainer = document.getElementById("services-container");
  servicesContainer.innerHTML = contentData.layanan
    .map(
      (item) => `
    <div class="glass-card p-8 rounded-3xl hover:translate-y-[-10px] transition-all duration-300 group">
      <div class="w-12 h-12 bg-${item.color}-500/10 rounded-xl flex items-center justify-center text-${item.color}-400 mb-6 group-hover:bg-${item.color}-500 group-hover:text-white transition-all">
        <i data-lucide="${item.icon}"></i>
      </div>
      <h4 class="text-xl font-bold text-white mb-3">${item.title}</h4>
      <p class="text-sm text-slate-400">${item.desc}</p>
      <div class="pt-4 border-t border-slate-700/50 flex justify-between items-center">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Estimasi</span>
        <span class="text-sm font-bold text-${item.color}-400 bg-${item.color}-500/10 px-3 py-1 rounded-full">
          ${item.price}
        </span>
      </div>
    </div>
  `
    )
    .join("");

  // 2. Render Portfolio
  const portfolioContainer = document.getElementById("portfolio-container");
  portfolioContainer.innerHTML = contentData.portfolio
    .map(
      (item) => `
    <div class="glass-card rounded-3xl overflow-hidden group">
     <a href="${item.img}" data-fancybox="gallery" data-caption="${item.title}" class="relative block h-48 overflow-hidden cursor-zoom-in group">
  <img src="${item.img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
  
  <div class="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
    <div class="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
      <i data-lucide="maximize-2"></i>
    </div>
  </div>
</a>
      <div class="p-6">
        <span class="text-xs font-bold text-${item.color}-400 uppercase">${item.tag}</span>
        <h4 class="text-xl font-bold text-white mt-2">${item.title}</h4>
        <p class="text-sm text-slate-400 mt-2">${item.desc}</p>
      </div>
    </div>
  `
    )
    .join("");

  Fancybox.bind("[data-fancybox]", {
    // Opsi tambahan jika ingin kustomisasi
  });

  // PENTING: Refresh icon Lucide agar icon dalam JSON muncul
  lucide.createIcons();
}

// Panggil fungsi ini saat halaman dimuat
document.addEventListener("DOMContentLoaded", renderContent);
