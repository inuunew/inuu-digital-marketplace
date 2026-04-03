// music.js
// Inisialisasi variabel global untuk player
let audio, progress, playPauseIcon, lyricsContainer, titleEl, artistEl, coverEl;
let songs = [];
let currentLyrics = [];
let currentIndex = 0;
let lastIndex = -1;

// Fungsi untuk memuat data musik dari JSON
function loadMusicData() {
  fetch("listmusic.json")
    .then(res => res.json())
    .then(data => {
      songs = data.songs;
      // Ambil indeks terakhir dari localStorage (jika ada)
      const savedIndex = localStorage.getItem("musicIndex");
      currentIndex = (savedIndex !== null && savedIndex < songs.length) ? parseInt(savedIndex) : 0;
      loadSong(currentIndex);
    })
    .catch(err => console.error("Gagal load musik:", err));
}

// Load lagu berdasarkan indeks
function loadSong(index) {
  if (!songs.length) return;
  currentIndex = index;
  const song = songs[index];
  
  audio.pause();
  audio.currentTime = 0;
  audio.src = song.src;
  titleEl.innerText = song.title;
  artistEl.innerText = song.artist;
  coverEl.src = song.cover;
  
  loadLyrics(song.lyrics);
  
  audio.load();
  audio.play().catch(e => console.log("Autoplay dicegah:", e));
  if (playPauseIcon) playPauseIcon.classList.replace("fa-play", "fa-pause");
  
  localStorage.setItem("musicIndex", currentIndex);
  
  // Update Media Session API
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [{ src: song.cover, sizes: '512x512' }]
    });
    navigator.mediaSession.setActionHandler('play', () => audio.play());
    navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    navigator.mediaSession.setActionHandler('previoustrack', prevSong);
    navigator.mediaSession.setActionHandler('nexttrack', nextSong);
  }
}

// Load lirik ke container
function loadLyrics(lyrics) {
  lyricsContainer.innerHTML = "";
  currentLyrics = lyrics;
  lastIndex = -1;
  lyrics.forEach(line => {
    const p = document.createElement("p");
    p.innerText = line.text;
    lyricsContainer.appendChild(p);
  });
}

// Fungsi kontrol
function togglePlay() {
  if (audio.paused) {
    audio.play();
    playPauseIcon.classList.replace("fa-play", "fa-pause");
  } else {
    audio.pause();
    playPauseIcon.classList.replace("fa-pause", "fa-play");
  }
}

function nextSong() {
  let newIndex = currentIndex + 1;
  if (newIndex >= songs.length) newIndex = 0;
  loadSong(newIndex);
}

function prevSong() {
  let newIndex = currentIndex - 1;
  if (newIndex < 0) newIndex = songs.length - 1;
  loadSong(newIndex);
}

function setProgress(event) {
  const width = event.currentTarget.clientWidth;
  const clickX = event.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
}

// Event listener untuk timeupdate (update progress bar & lirik aktif)
function onTimeUpdate() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  
  const lines = lyricsContainer.getElementsByTagName("p");
  currentLyrics.forEach((line, idx) => {
    if (audio.currentTime >= line.time && idx !== lastIndex) {
      lastIndex = idx;
      for (let i = 0; i < lines.length; i++) {
        lines[i].classList.remove("active");
      }
      if (lines[idx]) {
        lines[idx].classList.add("active");
        lines[idx].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

// Inisialisasi setelah DOM siap
function initMusicPlayer() {
  audio = document.getElementById("audio");
  progress = document.getElementById("progress");
  playPauseIcon = document.getElementById("playPauseIcon");
  lyricsContainer = document.getElementById("lyrics");
  titleEl = document.getElementById("title");
  artistEl = document.getElementById("artist");
  coverEl = document.getElementById("cover");
  
  if (!audio) return;
  
  audio.setAttribute("playsinline", "true");
  audio.setAttribute("webkit-playsinline", "true");
  
  audio.addEventListener("timeupdate", onTimeUpdate);
  audio.addEventListener("ended", nextSong);
  audio.addEventListener("play", () => {
    playPauseIcon.classList.replace("fa-play", "fa-pause");
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "playing";
  });
  audio.addEventListener("pause", () => {
    playPauseIcon.classList.replace("fa-pause", "fa-play");
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "paused";
  });
  
  loadMusicData();
}

// Popup sederhana (jika diperlukan)
function showMusicPopup(title, message) {
  let popup = document.getElementById("popupOverlayMusic");
  if (!popup) return;
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupMessage").innerText = message;
  popup.style.display = "flex";
}
function closeMusicPopup() {
  let popup = document.getElementById("popupOverlayMusic");
  if (popup) popup.style.display = "none";
}

// Jalankan init saat halaman dimuat (karena loadPage akan menjalankan script setelah HTML dimasukkan)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMusicPlayer);
} else {
  initMusicPlayer();
}

// Ekspos fungsi ke global agar bisa dipanggil dari HTML (onclick)
window.togglePlay = togglePlay;
window.nextSong = nextSong;
window.prevSong = prevSong;
window.setProgress = setProgress;
window.closeMusicPopup = closeMusicPopup;