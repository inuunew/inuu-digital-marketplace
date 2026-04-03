const pages = {};
pages["checkout"] = `<!-- checkout.html -->
<div class="header">
  <div class="back" onclick="goHome()">←</div>
  <div class="title">Detail Pesanan</div>
</div>

<div class="card">
  <div class="product">
    <img id="gameImage" onerror="this.src='default.png'">
    <div>
      <div class="badge">GAMES</div>
      <div id="itemName"></div>
      <div class="price" id="price"></div>
    </div>
  </div>
  <div class="action-menu">
    <div class="action-item" onclick="openInfo()">ℹ️ Info</div>
  </div>
</div>

<div id="confirmSheet" class="sheet">
  <div class="sheet-content">
    <div class="sheet-header">
      <span>Detail Pembayaran</span>
      <span onclick="closeSheet()">▼</span>
    </div>
    <div class="sheet-body">
      <div style="display:flex;gap:10px;align-items:center;">
        <img id="sheetImage" style="width:50px;border-radius:8px;">
        <div>
          <div id="sheetItem"></div>
          <div id="sheetPrice" style="color:#555;"></div>
        </div>
      </div>
      <hr style="margin:15px 0;">
      <div class="row">
        <span>Tujuan :</span>
        <span id="sheetUser" style="color:red;"></span>
      </div>
      <div class="row">
        <span>Harga :</span>
        <span id="sheetHarga"></span>
      </div>
      <div style="margin-top:15px;background:#f3f4f6;padding:10px;border-radius:10px;">
        Pastikan data sudah benar agar tidak terjadi kesalahan.<br>Melanjutkan Berarti Membeli! admin akan blacklist orang yang tidak bersungguh-sungguh
      </div>
      <button onclick="lanjutWA()" class="pay" style="width:100%;margin-top:15px;">Lanjutkan Pembelian</button>
      <button onclick="closeSheet()" style="width:100%;margin-top:10px;padding:10px;border:none;border-radius:10px;">Kembali</button>
    </div>
  </div>
</div>

<div class="card" id="userIdBox">
  <label class="label">USER ID</label>
  <div class="input-group">
    <input type="text" placeholder="Masukkan ID Player" id="userId">
  </div>
</div>

<div class="card" id="usernameBox" style="display:none;">
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <label class="label">USERNAME PANEL</label>
  </div>
  <div class="input-group">
    <input type="text" placeholder="Masukkan Username" id="username">
  </div>
</div>

<div class="card" id="phoneBox" style="display:none;">
  <label class="label">NOMOR TELEPON</label>
  <div class="input-group">
    <input type="tel" placeholder="Masukkan Nomor HP" id="phone">
  </div>
</div>

<div class="card" id="serverBox" style="display:none;">
  <label class="label">SERVER</label>
  <div class="input-group" id="mlServer" style="display:none;">
    <input type="number" placeholder="Server ID" id="serverId">
  </div>
  <div class="input-group" id="genshinServer" style="display:none;">
    <select id="serverRegion">
      <option value="">Pilih Server</option>
      <option>Asia</option>
      <option>America</option>
      <option>Europe</option>
      <option>TW / HK / MO</option>
    </select>
  </div>
</div>

<div class="card">
  <h4>METODE PEMBAYARAN</h4>
  <div class="payment-select" onclick="togglePayment()">
    <div id="paymentSelected">Pilih Metode Pembayaran</div>
    <div>▼</div>
  </div>
  <div class="payment-list" id="paymentList">
    <div class="payment-item" data-payment="qris_auto">QRIS Otomatis</div>
    <div class="payment-item" data-payment="qris_manual">QRIS Manual (Order Via WhatsApp)</div>
  </div>
</div>

<div class="card">
  <h4>RINCIAN TRANSAKSI</h4>
  <div class="row"><span>Subtotal</span><span id="subtotal"></span></div>
  <hr>
  <div class="row"><span>Total</span><span class="total" id="total"></span></div>
</div>

<div class="footer">
  <div>
    <div style="font-size:12px;color:#777;">TOTAL</div>
    <div class="bill" id="bill"></div>
  </div>
  <button class="pay" onclick="bayar()">Bayar</button>
</div>

<!-- Loading & Warning popup (tetap di sini karena bersifat dinamis) -->
<div id="loadingPopup" class="loading-popup">
  <div class="loading-box">
    <div class="spinner"></div>
    <p>Generate Qris...</p>
  </div>
</div>
<div id="warningPopup" class="popup-warning">
  <div class="popup-box">
    <div class="icon">❗</div>
    <h3>Peringatan</h3>
    <p id="warningText">Harap isi data terlebih dahulu!</p>
    <button onclick="closeWarning()">Oke</button>
  </div>
</div>
<div id="infoModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <span>Detail Produk</span>
      <span class="close" onclick="closeInfo()">✕</span>
    </div>
    <div id="modalBody" class="modal-body">Loading...</div>
  </div>
</div>`;
pages["home"] = `<!-- home.html -->
<link rel="stylesheet" href="home.css">
<div class="banner-container">
  <div class="slider" id="slider">
    <div class="slide active"><img src="https://files.catbox.moe/b629ct.png"></div>
    <div class="slide"><img src="https://files.catbox.moe/b629ct.png"></div>
  </div>
  <div class="info-box">📢 Selamat datang di InuuMarket • Top Up Game Murah & Cepat</div>
  <div class="search-area"><input type="text" id="searchGame" placeholder="Cari game..."></div>
</div>
<div class="game-title"><div class="title-bar"></div><div><h2>📋 Daftar Layanan</h2></div></div>
<div class="menu-grid" id="menuGrid">
  <div class="menu-card" onclick="openCategory('game')"><i class="fas fa-gamepad"></i><p>Top Up Games</p></div>
  <div class="menu-card" onclick="openCategory('hosting')"><i class="fas fa-server"></i><p>Hosting Product</p></div>
  <div class="menu-card" onclick="openCategory('other')"><i class="fas fa-box"></i><p>Lainnya</p></div>
</div>
<div id="backBtn" style="display:none;" onclick="goBack()">← Kembali</div>
<div id="titleGame" style="display:none;"><h2>Top Up Game</h2></div><div id="gameGrid" class="game-grid" style="display:none;"></div>
<div id="titleHosting" style="display:none;"><h2>Hosting</h2></div><div id="panelGrid" class="game-grid" style="display:none;"></div>
<div id="titleOther" style="display:none;"><h2>Lainnya</h2></div><div id="otherGrid" class="game-grid" style="display:none;"></div>

<script src="home.js"></script>`;
pages["info"] = `<!-- info.html -->
<!-- Konten halaman pengumuman, tanpa navbar/sidebar karena sudah ada di index.html -->
<div class="info-page">
  <div class="header">
    <h2>📢 Pengumuman</h2>
    <p>Update terbaru dari Inuu Market</p>
  </div>
  
  <!-- Kontainer untuk daftar pengumuman -->
  <div class="container" id="infoContainer"></div>
</div>

<!-- Popup (opsional, jika dibutuhkan, tapi biasanya sudah ada di index) -->
<div id="popupOverlayInfo" class="popup" style="display:none;">
  <div class="popup-box">
    <h3 id="popupTitleInfo"></h3>
    <p id="popupMessageInfo"></p>
    <button onclick="closeInfoPopup()">Tutup</button>
  </div>
</div>`;
pages["music"] = `<!-- music.html -->
<!-- HEADER / NAVBAR (sudah disediakan oleh index.html, jadi tidak perlu navbar lagi) -->
<!-- TAPI karena music.html punya navbar sendiri di kode asli, kita sesuaikan: untuk loadPage, kita hanya tampilkan konten player saja, tanpa navbar/sidebar ganda. Berikut adalah konten murni halaman music: -->

<div class="player-container">
  <div class="player">
    <img id="cover" class="cover-img">
    <div class="song-title" id="title"></div>
    <div class="artist" id="artist"></div>
    <div id="lyrics" class="lyrics"></div>
    <div class="progress-container" onclick="setProgress(event)">
      <div class="progress" id="progress"></div>
    </div>
    <div class="controls">
      <button onclick="prevSong()"><i class="fas fa-backward"></i></button>
      <button onclick="togglePlay()"><i id="playPauseIcon" class="fas fa-play"></i></button>
      <button onclick="nextSong()"><i class="fas fa-forward"></i></button>
    </div>
    <audio id="audio" preload="auto"></audio>
  </div>
</div>

<!-- Popup notif/admin (bisa juga sudah ada di index, tapi kita tetap sertakan jika diperlukan) -->
<div id="popupOverlayMusic" class="popup" style="display:none;">
  <div class="popup-box">
    <h3 id="popupTitle"></h3>
    <p id="popupMessage"></p>
    <button onclick="closeMusicPopup()">Tutup</button>
  </div>
</div>`;
