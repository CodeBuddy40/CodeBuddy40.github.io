// 1. Initialize Lucide (untuk icon standar)
lucide.createIcons();

// 2. Navbar scroll effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  window.scrollY > 50
    ? nav.classList.add("bg-slate-900/90")
    : nav.classList.remove("bg-slate-900/90");
});

const APPSCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwMs6Bk9CfapIdd22NNgtaTBoAacoQ_zes7bsTjJ_hdADwtFloU2SRkzllnVlmdmJDA/exec";

// Variabel swiper global agar bisa diakses antar fungsi
let swiperInstance;

function initSwiper(dataLength) {
  // Jika swiper sudah ada, hancurkan dulu sebelum buat baru
  if (swiperInstance) swiperInstance.destroy(true, true);

  swiperInstance = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    // Aktifkan loop hanya jika data cukup (minimal 3-4 slide)
    loop: dataLength > 3,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    },
  });
}

// 3. Fungsi Load Testimonial dari Spreadsheet
async function loadTestimonials() {
  const swiperWrapper = document.querySelector(".mySwiper .swiper-wrapper");

  // Tampilkan pesan loading sementara
  swiperWrapper.innerHTML =
    '<div class="text-center w-full py-10 text-slate-500 text-sm">Memuat testimoni...</div>';

  try {
    const response = await fetch(APPSCRIPT_URL);
    const data = await response.json();

    if (data && data.length > 0) {
      swiperWrapper.innerHTML = ""; // Bersihkan loading

      data.forEach((item) => {
        const slide = `
            <div class="swiper-slide h-auto">
              <div class="glass-card p-8 rounded-3xl h-full mx-2 flex flex-col">
                <div class="flex gap-1 text-yellow-500 mb-4">
                  <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                </div>
                <p class="text-slate-300 mb-6 italic flex-grow">"${
                  item.pesan
                }"</p>
                <div class="flex items-center gap-4 mt-auto">
                  <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white uppercase">
                    ${item.nama ? item.nama.charAt(0) : "?"}
                  </div>
                  <div class="text-left">
                    <p class="text-white font-bold text-sm">${item.nama}</p>
                    <p class="text-slate-500 text-xs">${item.role}</p>
                  </div>
                </div>
              </div>
            </div>`;
        swiperWrapper.insertAdjacentHTML("beforeend", slide);
      });

      // Re-render icon bintang yang baru dibuat
      lucide.createIcons();

      // Jalankan Swiper setelah data masuk ke DOM
      initSwiper(data.length);
    }
  } catch (error) {
    console.error("Gagal memuat testimoni:", error);
    swiperWrapper.innerHTML =
      '<div class="text-center w-full py-10 text-red-400 text-sm">Gagal memuat data.</div>';
  }
}

// 4. Handle Form Submit
document.getElementById("testiForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const btn = this.querySelector("button");
  const originalText = btn.innerText;

  btn.innerText = "Mengirim...";
  btn.disabled = true;

  const formData = {
    nama: this.nama.value,
    role: this.role.value,
    pesan: this.pesan.value,
  };

  fetch(APPSCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then(() => {
      alert("Terima kasih! Testimoni Anda telah terkirim.");
      this.reset();
      btn.innerText = originalText;
      btn.disabled = false;
      // Refresh data agar testimoni baru langsung muncul
      loadTestimonials();
    })
    .catch((err) => {
      console.error("Error:", err);
      btn.disabled = false;
      btn.innerText = originalText;
    });
});

// Jalankan saat pertama kali buka halaman
loadTestimonials();
