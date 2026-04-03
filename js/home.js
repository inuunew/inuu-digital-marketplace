// home.js
// Pastikan database sudah tersedia global dari database.js
let currentGame = null, currentType = 'regular', selectedItem = null, isPanel = false, isOther = false;

function openCategory(type) {
  document.getElementById('menuGrid').style.display = 'none';
  document.getElementById('gameGrid').style.display = 'none';
  document.getElementById('panelGrid').style.display = 'none';
  document.getElementById('otherGrid').style.display = 'none';
  document.getElementById('titleGame').style.display = 'none';
  document.getElementById('titleHosting').style.display = 'none';
  document.getElementById('titleOther').style.display = 'none';
  document.getElementById('backBtn').style.display = 'block';
  if(type === 'game') { document.getElementById('gameGrid').style.display = 'grid'; document.getElementById('titleGame').style.display = 'flex'; }
  else if(type === 'hosting') { document.getElementById('panelGrid').style.display = 'grid'; document.getElementById('titleHosting').style.display = 'flex'; }
  else { document.getElementById('otherGrid').style.display = 'grid'; document.getElementById('titleOther').style.display = 'flex'; }
}

function goBack() {
  document.getElementById('menuGrid').style.display = 'grid';
  document.getElementById('gameGrid').style.display = 'none';
  document.getElementById('panelGrid').style.display = 'none';
  document.getElementById('otherGrid').style.display = 'none';
  document.getElementById('titleGame').style.display = 'none';
  document.getElementById('titleHosting').style.display = 'none';
  document.getElementById('titleOther').style.display = 'none';
  document.getElementById('backBtn').style.display = 'none';
  document.getElementById('searchGame').value = '';
}

// Load data ke grid
const gameGrid = document.getElementById('gameGrid');
Object.keys(database).forEach(key => {
  const game = database[key];
  gameGrid.innerHTML += `<div class="game-card" onclick="openTopup('${key}')"><div class="game-img"><img src="${game.image || 'https://via.placeholder.com/100'}"></div><div class="game-name">${game.name}</div><div class="game-service">${game.regular.length} Layanan</div></div>`;
});
if(typeof databaseOther !== 'undefined') {
  const otherGrid = document.getElementById('otherGrid');
  Object.keys(databaseOther).forEach(key => {
    const item = databaseOther[key];
    otherGrid.innerHTML += `<div class="game-card" onclick="openOther('${key}')"><div class="game-img"><img src="${item.image}"></div><div class="game-name">${item.name}</div><div class="game-service">${item.items.length} Produk</div></div>`;
  });
}
if(typeof databasePanel !== 'undefined') {
  const panelGrid = document.getElementById('panelGrid');
  Object.keys(databasePanel).forEach(key => {
    const panel = databasePanel[key];
    panelGrid.innerHTML += `<div class="game-card" onclick="openPanel('${key}')"><div class="game-img"><img src="${panel.image}"></div><div class="game-name">${panel.name}</div><div class="game-service">${panel.items.length} Paket</div></div>`;
  });
}

// Fungsi openTopup, openPanel, openOther, renderItems, dll
window.openTopup = function(key) {
  const data = database[key];
  currentGame = data; isPanel = false; isOther = false;
  document.getElementById('gameName').innerText = data.name;
  const membershipTab = document.getElementById('membershipTab');
  membershipTab.style.display = (data.membership && data.membership.length) ? 'block' : 'none';
  currentType = 'regular';
  renderItems();
  document.getElementById('topupModal').classList.add('show');
};

window.openPanel = function(key) {
  const data = databasePanel[key];
  currentGame = data; isPanel = true; isOther = false;
  document.getElementById('gameName').innerText = data.name;
  document.getElementById('membershipTab').style.display = 'none';
  const container = document.getElementById('topupItems');
  container.innerHTML = '';
  data.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `${item.name}<div class="price">${item.price}</div>`;
    div.onclick = () => { selectedItem = item; document.getElementById('confirmBtn').disabled = false; document.getElementById('confirmBtn').classList.add('active'); };
    container.appendChild(div);
  });
  document.getElementById('topupModal').classList.add('show');
};

window.openOther = function(key) {
  const data = databaseOther[key];
  currentGame = data; isOther = true; isPanel = false;
  document.getElementById('gameName').innerText = data.name;
  document.getElementById('membershipTab').style.display = 'none';
  const container = document.getElementById('topupItems');
  container.innerHTML = '';
  data.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `${item.name}<div class="price">${item.price}</div>`;
    div.onclick = () => { selectedItem = item; document.getElementById('confirmBtn').disabled = false; document.getElementById('confirmBtn').classList.add('active'); };
    container.appendChild(div);
  });
  document.getElementById('topupModal').classList.add('show');
};

function renderItems() {
  const container = document.getElementById('topupItems');
  container.innerHTML = '';
  const items = currentGame[currentType];
  if(!items) return;
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `${item.name}<div class="price">${item.price}</div>`;
    div.onclick = () => { selectedItem = item; document.getElementById('confirmBtn').disabled = false; document.getElementById('confirmBtn').classList.add('active'); };
    container.appendChild(div);
  });
}

window.switchTabCallback = function(type) {
  currentType = type;
  renderItems();
};

window.goCheckoutCallback = function() {
  if(!selectedItem) return;
  let gameName = currentGame.name, image = currentGame.image, typeVal = isPanel ? 'panel' : (isOther ? 'other' : currentType);
  const priceVal = selectedItem.price.replace(/[^\d]/g, '');
  loadPage('checkout', { game: gameName, item: selectedItem.name, price: priceVal, image: image, type: typeVal });
  closeTopup();
};

// Slider otomatis
let slides = document.querySelectorAll('.slide');
let slideIndex = 0;
setInterval(() => {
  slides.forEach(s => s.classList.remove('active'));
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add('active');
}, 4000);

// Search
document.getElementById('searchGame').addEventListener('keyup', function(e) {
  let keyword = e.target.value.toLowerCase();
  let activeGrid = document.querySelector('#gameGrid[style*="grid"], #panelGrid[style*="grid"], #otherGrid[style*="grid"]');
  if(activeGrid) {
    Array.from(activeGrid.children).forEach(card => {
      let name = card.innerText.toLowerCase();
      card.style.display = name.includes(keyword) ? '' : 'none';
    });
  }
});