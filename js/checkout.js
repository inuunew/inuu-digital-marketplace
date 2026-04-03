// checkout.js
// Fungsi-fungsi utilitas (showLoading, showWarning, closeWarning, dll)
function showLoading() {
  document.getElementById("loadingPopup").style.display = "flex";
}
function showWarning(text) {
  document.getElementById("warningText").innerText = text;
  document.getElementById("warningPopup").style.display = "flex";
}
function closeWarning() {
  document.getElementById("warningPopup").style.display = "none";
}
function closeInfo() {
  document.getElementById("infoModal").style.display = "none";
}

// Kembali ke beranda menggunakan loadPage (tanpa reload)
function goHome() {
  if (typeof loadPage === 'function') {
    loadPage('home');
  } else {
    window.location.href = "index.html";
  }
}

// Ambil parameter dari URL (karena loadPage menyimpan params di window.currentPageParams)
let params = window.currentPageParams || {};
if (!params.game) {
  // fallback jika tidak ada, coba dari URL query string
  const urlParams = new URLSearchParams(window.location.search);
  params = {
    key: urlParams.get('key'),
    game: urlParams.get('game'),
    item: urlParams.get('item'),
    price: urlParams.get('price'),
    image: urlParams.get('image'),
    type: urlParams.get('type'),
    userId: urlParams.get('userId'),
    username: urlParams.get('username'),
    phone: urlParams.get('phone'),
    server: urlParams.get('server'),
    payment: urlParams.get('payment')
  };
}

const key = params.key;
let produk = (typeof database !== 'undefined' && database[key]) || 
             (typeof databaseOther !== 'undefined' && databaseOther[key]) || 
             (typeof databasePanel !== 'undefined' && databasePanel[key]) || {};
let required = produk.require || [];

const game = params.game || "";
const item = params.item || "";
const price = Number(params.price) || 0;
const image = params.image || "default.png";
const type = params.type || "";

// Isi data ke elemen
document.getElementById("itemName").innerText = game + " " + item;
document.getElementById("price").innerText = "Rp " + price.toLocaleString("id-ID");
document.getElementById("subtotal").innerText = "Rp " + price.toLocaleString("id-ID");
document.getElementById("total").innerText = "Rp " + price.toLocaleString("id-ID");
document.getElementById("bill").innerText = "Rp " + price.toLocaleString("id-ID");
document.getElementById("gameImage").src = image;

// Tampilkan input sesuai required
const userIdBox = document.getElementById("userIdBox");
const usernameBox = document.getElementById("usernameBox");
const phoneBox = document.getElementById("phoneBox");
const serverBox = document.getElementById("serverBox");
const mlServer = document.getElementById("mlServer");
const genshinServer = document.getElementById("genshinServer");

userIdBox.style.display = required.includes("userId") ? "block" : "none";
usernameBox.style.display = required.includes("username") ? "block" : "none";
phoneBox.style.display = required.includes("phone") ? "block" : "none";
serverBox.style.display = required.includes("server") ? "block" : "none";

if (required.includes("server")) {
  if (produk.serverType === "id") {
    mlServer.style.display = "flex";
    genshinServer.style.display = "none";
  } else if (produk.serverType === "region") {
    mlServer.style.display = "none";
    genshinServer.style.display = "flex";
  }
}

// Payment method
let selectedPayment = "";
let isManualQRIS = false;

function togglePayment() {
  const list = document.getElementById("paymentList");
  list.style.display = list.style.display === "block" ? "none" : "block";
}

function selectPayment(name) {
  const paymentSelected = document.getElementById("paymentSelected");
  if (name === "QRIS Otomatis" && !produk.qris) {
    alert("QRIS otomatis sedang error, silakan pilih metode lain!");
    return;
  }
  selectedPayment = name;
  paymentSelected.innerText = name;
  document.getElementById("paymentList").style.display = "none";
  isManualQRIS = (name === "QRIS Manual");
}

// Event listener untuk item pembayaran
document.querySelectorAll('.payment-item').forEach(el => {
  el.addEventListener('click', (e) => {
    const name = el.innerText.trim();
    selectPayment(name);
  });
});

// Disable QRIS otomatis jika produk.qris false
document.addEventListener("DOMContentLoaded", () => {
  const qrisItem = Array.from(document.querySelectorAll(".payment-item"))
                        .find(el => el.innerText.includes("QRIS Otomatis"));
  if (qrisItem) {
    if (!produk.qris) {
      qrisItem.innerText = "QRIS Otomatis (sedang error)";
      qrisItem.classList.add("disabled");
      qrisItem.removeEventListener('click', selectPayment);
      qrisItem.addEventListener('click', () => alert("QRIS otomatis sedang error, silakan pilih metode lain!"));
    }
  }
});

// Fungsi bayar
function bayar() {
  const btn = document.querySelector(".pay");
  let serverValue = "";
  if (required.includes("server")) {
    serverValue = (produk.serverType === "id") 
      ? document.getElementById("serverId").value 
      : document.getElementById("serverRegion").value;
  }

  function resetBtn() {
    btn.innerHTML = "Bayar";
    btn.disabled = false;
    btn.style.opacity = "1";
    document.getElementById("loadingPopup").style.display = "none";
  }

  if (required.includes("username") && !document.getElementById("username").value) {
    showWarning("Masukkan username terlebih dahulu!");
    return;
  }
  if (required.includes("userId") && !document.getElementById("userId").value) {
    showWarning("Masukkan ID terlebih dahulu!");
    return;
  }
  if (required.includes("server") && !serverValue) {
    showWarning("Masukkan server terlebih dahulu!");
    return;
  }
  if (!selectedPayment) {
    showWarning("Pilih metode pembayaran!");
    return;
  }

  if (isManualQRIS) {
    openSheet();
    return;
  }

  btn.innerHTML = "⏳ Memproses...";
  btn.disabled = true;
  btn.style.opacity = "0.7";
  showLoading();

  // Redirect ke invoice menggunakan loadPage (tanpa reload)
  setTimeout(() => {
    if (typeof loadPage === 'function') {
      loadPage('invoice', {
        key: key,
        game: game,
        item: item,
        price: price,
        type: type,
        userId: document.getElementById("userId").value || '',
        username: document.getElementById("username").value || '',
        phone: document.getElementById("phone").value || '',
        server: serverValue || '',
        payment: selectedPayment,
        image: image
      });
    } else {
      // fallback
      const invoiceUrl = "invoice.html?" + new URLSearchParams({
        key: key, game: game, item: item, price: price, type: type,
        userId: document.getElementById("userId").value || '',
        username: document.getElementById("username").value || '',
        phone: document.getElementById("phone").value || '',
        server: serverValue || '',
        payment: selectedPayment,
        image: image
      }).toString();
      window.location.href = invoiceUrl;
    }
  }, 1200);
}

// Modal info
function openInfo() {
  const modal = document.getElementById("infoModal");
  const body = document.getElementById("modalBody");
  let found = (typeof databasePanel !== 'undefined' && databasePanel[key]) ||
              (typeof database !== 'undefined' && database[key]) ||
              (typeof databaseOther !== 'undefined' && databaseOther[key]);

  if (found) {
    body.innerHTML = `
      <img src="${image}" style="width:100%;border-radius:10px;margin-bottom:10px;">
      <h3>${found.name}</h3>
      <p>${found.desc || '-'}</p>
      <hr>
      <p>${found.detail || '-'}</p>
    `;
  } else {
    body.innerHTML = `
      <h3>${game} - ${item}</h3>
      <p style="margin-top:10px;">
        ✅ Proses otomatis 1-30 detik<br>
        ✅ Tanpa login akun<br>
        ✅ Aman & terpercaya<br>
        ✅ Layanan 24 jam
      </p>
      <hr>
      <p style="margin-top:10px;color:#16a34a;">
        Pastikan data yang kamu input sudah benar sebelum checkout.
        Kesalahan input bukan tanggung jawab admin.
      </p>
    `;
  }
  modal.style.display = "flex";
}

function openSheet() {
  document.getElementById("confirmSheet").classList.add("show");
  document.getElementById("sheetImage").src = image;
  document.getElementById("sheetItem").innerText = game + " " + item;
  document.getElementById("sheetPrice").innerText = "Rp " + price.toLocaleString("id-ID");
  document.getElementById("sheetHarga").innerText = "Rp " + price.toLocaleString("id-ID");
  document.getElementById("sheetUser").innerText =
    document.getElementById("userId")?.value ||
    document.getElementById("username")?.value ||
    document.getElementById("phone")?.value || "-";
}

function closeSheet() {
  document.getElementById("confirmSheet").classList.remove("show");
}

function lanjutWA() {
  closeSheet();
  const waNumber = "6283160556330";
  let serverText = "";
  if (required.includes("server")) {
    serverText = (produk.serverType === "id") 
      ? document.getElementById("serverId").value 
      : document.getElementById("serverRegion").value;
  }
  const message = encodeURIComponent(
    `Halo, saya ingin melakukan pembayaran memakai qris manual untuk:\n` +
    `Game: ${game}\nItem: ${item}\nHarga: Rp ${price.toLocaleString("id-ID")}\n` +
    `UserID: ${document.getElementById("userId").value || ''}\n` +
    `Username: ${document.getElementById("username").value || ''}\n` +
    `Phone: ${document.getElementById("phone").value || ''}\n` +
    `Server: ${serverText}`
  );
  window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
}

// Event listener untuk pageshow (jika diperlukan)
window.addEventListener("pageshow", () => {
  const btn = document.querySelector(".pay");
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.innerHTML = "Bayar";
  }
});