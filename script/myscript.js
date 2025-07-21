// GANTI DENGAN URL WEB APP APPS SCRIPT ANDA YANG SUDAH DIDEPLOY!
const GOOGLE_SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycby815ZEnKGFZ74ASp-P6EDa8bd49k85XyIm6q4rBNgV-I9cm6gitlIc3upWGnBCGqIH6g/exec";

// --- Fungsi untuk Memuat Testimoni (doGet) ---
async function loadTestimonials() {
  const carouselContainer = document.getElementById(
    "testimoni-carousel-container"
  );

  // Awalnya, kita punya inner div di dalam outer div
  // Hapus semua konten dari inner div untuk loading state
  const carouselInner = carouselContainer.querySelector(
    ".continuous-carousel-inner"
  );
  carouselInner.innerHTML = `
          <div class="continuous-carousel-item w-full flex flex-col items-center p-4 sm:p-8">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="mt-4 text-center">Memuat testimoni...</p>
          </div>
        `;
  carouselInner.style.animationPlayState = "paused"; // Pause animation during loading

  try {
    const response = await fetch(GOOGLE_SHEET_API_URL); // GET request
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const testimonials = await response.json();
    console.log("Testimoni dari Google Sheet:", testimonials);

    if (testimonials.length === 0) {
      carouselInner.innerHTML =
        '<p class="text-center text-lg p-8">Belum ada testimoni yang disetujui untuk ditampilkan.</p>';
      carouselInner.style.animation = "none"; // Stop animation if no testimonials
      return;
    }

    // Bersihkan kontainer carousel inner
    carouselInner.innerHTML = "";

    // Duplicate testimonials to create a seamless loop
    // We duplicate the items enough times to ensure continuous scrolling
    // without a noticeable jump. A simple duplication (x2) works for basic marquees.
    const loopCount = 2; // Duplicate twice to make the loop seamless
    for (let i = 0; i < loopCount; i++) {
      testimonials.forEach((item) => {
        // Gunakan AvatarURL dari sheet, jika kosong atau tidak valid pakai default placeholder
        const avatarSrc =
          item.AvatarURL &&
          item.AvatarURL.trim() !== "" &&
          (item.AvatarURL.startsWith("http://") ||
            item.AvatarURL.startsWith("https://"))
            ? item.AvatarURL
            : "https://placehold.co/150x150/CCCCCC/000000/png?text=No+Avatar"; // <-- UBAH DI SINI

        const carouselItemHtml = `
                <div class="continuous-carousel-item">
                    <div class="card bg-base-100 shadow-xl mx-auto h-full flex flex-col justify-between">
                        <div class="card-body text-center">
                            <p class="text-lg italic mb-4">"${item.Testimoni}"</p>
                            <div class="flex flex-col items-center">
                                <div class="avatar mb-2">
                                    <div class="w-16 rounded-full">
                                        <img src="${avatarSrc}" alt="Avatar ${item.Nama}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/150x150/CCCCCC/000000/png?text=No+Avatar';" /> </div>
                                </div>
                                <p class="font-semibold text-lg">${item.Nama}</p>
                            </div>
                        </div>
                    </div>
                </div>
              `;
        carouselInner.insertAdjacentHTML("beforeend", carouselItemHtml);
      });
    }

    // Calculate animation duration dynamically based on content width
    // This makes the speed consistent regardless of the number of items
    // Ensure there's at least one item before calculating offsetWidth
    const firstItem = carouselInner.querySelector(".continuous-carousel-item");
    if (firstItem) {
      const itemWidth = firstItem.offsetWidth;
      const totalContentWidth = carouselInner.scrollWidth / loopCount; // Get the original content width
      const duration = totalContentWidth / 50; // Adjust 50 for desired speed (lower value = faster)
      carouselInner.style.animationDuration = `${duration}s`;
      carouselInner.style.animationPlayState = "running"; // Start animation
    } else {
      console.warn(
        "No testimonial items found to calculate animation duration."
      );
      carouselInner.style.animation = "none"; // Stop animation if no items after load
    }
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    carouselInner.innerHTML =
      '<p class="text-center text-error p-8">Gagal memuat testimoni. Silakan coba lagi nanti.</p>';
    carouselInner.style.animation = "none"; // Stop animation if error
  }
}

// --- Fungsi untuk Mengirim Testimoni (doPost) ---
document.addEventListener("DOMContentLoaded", () => {
  const testimonialForm = document.getElementById("testimonial-form");
  const formMessage = document.getElementById("form-message");

  if (testimonialForm) {
    testimonialForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Mencegah form submit default (refresh halaman)

      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true; // Nonaktifkan tombol saat mengirim
      submitButton.classList.add("loading"); // Tampilkan loading spinner DaisyUI
      formMessage.classList.add("hidden"); // Sembunyikan pesan sebelumnya

      const formData = new FormData(this);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }

      try {
        const response = await fetch(GOOGLE_SHEET_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Penting: Apps Script mengharapkan JSON
          },
          body: JSON.stringify(data), // Kirim data sebagai JSON
        });

        const result = await response.json();

        if (result.success) {
          formMessage.textContent = result.message;
          formMessage.className =
            "text-center mt-4 p-3 rounded bg-success text-success-content";
          testimonialForm.reset(); // Bersihkan form
          loadTestimonials(); // Reload testimonials to show the new one
        } else {
          formMessage.textContent = "Error: " + result.message;
          formMessage.className =
            "text-center mt-4 p-3 rounded bg-error text-error-content";
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        formMessage.textContent =
          "Terjadi kesalahan saat mengirim testimoni. Silakan coba lagi.";
        formMessage.className =
          "text-center mt-4 p-3 rounded bg-error text-error-content";
      } finally {
        submitButton.disabled = false; // Aktifkan kembali tombol
        submitButton.classList.remove("loading"); // Sembunyikan loading spinner
        formMessage.classList.remove("hidden"); // Tampilkan pesan
      }
    });
  }

  // Panggil fungsi loadTestimonials saat halaman selesai dimuat
  loadTestimonials();
});
