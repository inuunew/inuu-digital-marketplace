// info.js
// Data pengumuman (dari info.js asli, atau bisa di-fetch dari file eksternal)
// Di sini kita gunakan variabel global infoData yang didefinisikan di file terpisah (info-data.js)
// Atau kita bisa mendefinisikan langsung. Untuk contoh, kita gunakan data dari kode asli Anda.

// Jika data sudah ada di window.infoData, kita bisa langsung pakai.
// Jika tidak, kita definisikan ulang (ambil dari info.js asli yang Anda berikan sebelumnya)
// Saya akan menggunakan data yang ada di info.js asli (array infoData)

// Pastikan infoData sudah didefinisikan sebelumnya. Jika belum, kita buat.
if (typeof infoData === 'undefined') {
  // Fallback data (salin dari info.js yang Anda berikan)
  var infoData = [
    {
      title: "InuuMarket Admin",
      date: "18 MARET 2026",
      type: "INFO",
      image: "https://files.catbox.moe/tv1rv6.jpeg",
      banner: "",
      desc: "Liburan dimulai dengan membuat web ini karna gabut.",
      tags: "#InuuTyzDev"
    }, 
    {
      title: "InuuMarket Admin",
      date: "31 MARET 2026",
      type: "INFO",
      image: "https://files.catbox.moe/tv1rv6.jpeg",
      banner: "https://files.catbox.moe/b629ct.png",
      desc: "Liburan selesai...Moga aja masih ada niat lanjutin soalnya banyak kegiatan juga apalagi mau ujian akhir,yaa.... upgrade dikit-dikit la.",
      tags: "#InuuTyzDev"
    }
  ];
}

// Fungsi untuk badge
function getBadge(type) {
  if (type === "INFO") {
    return `<span class="badge-info"><i class="fas fa-info"></i></span>`;
  }
  if (type === "PROMO") {
    return `<span class="badge-promo"><i class="fas fa-tag"></i></span>`;
  }
  if (type === "EVENT") {
    return `<span class="badge-event"><i class="fas fa-calendar"></i></span>`;
  }
  return "";
}

// Render pengumuman ke container
function renderAnnouncements() {
  const container = document.getElementById("infoContainer");
  if (!container) return;
  
  // Balik urutan (terbaru di atas) sesuai kode asli
  infoData.slice().reverse().forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <img src="${item.image}" onerror="this.src='https://via.placeholder.com/45'">
        <div class="info">
          <div class="title">${escapeHtml(item.title)}</div>
          <div class="meta">
            ${getBadge(item.type)}
            ${item.type}
            <span class="dot">•</span>
            ${item.date}
          </div>
        </div>
      </div>
      ${item.banner ? `<img class="banner" src="${item.banner}" onerror="this.style.display='none'">` : ""}
      <div class="desc-box">
        <div class="desc">${escapeHtml(item.desc)}</div>
        ${item.tags ? `<div class="tags">${escapeHtml(item.tags)}</div>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

// Fungsi sederhana untuk menghindari XSS
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
    return c;
  });
}

// Popup (jika diperlukan)
function showInfoPopup(title, message) {
  let popup = document.getElementById("popupOverlayInfo");
  if (!popup) return;
  document.getElementById("popupTitleInfo").innerText = title;
  document.getElementById("popupMessageInfo").innerText = message;
  popup.style.display = "flex";
}
function closeInfoPopup() {
  let popup = document.getElementById("popupOverlayInfo");
  if (popup) popup.style.display = "none";
}

// Jalankan render saat halaman dimuat
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderAnnouncements);
} else {
  renderAnnouncements();
}