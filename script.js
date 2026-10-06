
let relapseMode = false;


// Playlist and Player logic
const audio = document.getElementById('audio');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const bar = document.getElementById('bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');
const coverEl = document.getElementById('cover');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const volumeSlider = document.getElementById('volume');
const paginationEl = document.getElementById('pagination');
const searchInput = document.getElementById('search');
const relapseBtn = document.getElementById('relapseBtn');

relapseBtn.onclick = () => {
  relapseMode = !relapseMode;

  relapseBtn.style.backgroundColor = relapseMode
    ? 'rgba(255, 77, 109, 0.35)'
    : 'var(--glass)';

  currentPage = 1;
  renderPlaylist();
};


let playlist = [
  
  {title:"Payphone", artist:"Wiz Khalifa",file: "music/Maroon 5, Wiz Khalifa – Payphone (Lyrics).mp3",cover:"cover/images (24).jpeg"},
    {title:"Futari no Kimochi", artist:"ふたりの気持ち",file: "music/Futari.mp3",cover:"cover/futari.png"},
    {title:"Yume to Hazakura", artist:"wotamin ",file: "music/Yume.mp3",cover:"cover/yume.PNG"},
      {title:"Rokudenashi ", artist:"The Flame Of Love",file: "music/Roku.mp3",cover:"cover/roku.png"},

  {title:"Tada koe hitotsu", artist:"Rokudenashi",file: "music/Tada.mp3",cover:"cover/tada.jpg"},
  {title:"Suzume", artist:"RADWIMPS ",file: "music/Suzume.mp3",cover:"cover/suzume.jpg"},
  {title:" Harehare Ya", artist:"Clear and Sunny ",file: "music/Hare.mp3",cover:"cover/hare.jpg"},
  {title:"Tabun",artist:"Yoasobi",file:"music/Tabun.mp3",cover:"cover/tabun.jpeg"},
  {title:"Orange",artist:"7!!",file:"music/Orange.mp3",cover:"cover/orange.jpeg"},
  {title:"Ren Swan",artist:"進撃の巨人",file:"music/Redswan.mp3",cover:"cover/redswan.jpeg"},
  {title:"Kamado Tanjiro no Uta",artist:"Risa Oribe",file:"music/Kamado.mp3",cover:"cover/kamado.jpeg"},
  {title:"Memories",artist:"Maki Otsuki",file:"music/Memories.mp3",cover:"cover/memories.jpeg"},
  {title:"Sparkle", artist:"Your Name",file: "music/Sparkle.mp3",cover:"cover/sparkle.jpeg"},
  {title:"Racing Into The Night", artist:"Yoasobi",file: "music/racing_into_the_night.mp3",cover:"cover/racing.png"},
  {title:"Akuma no Ko", artist:"Ai Higuchi",file: "music/Akumanoko.mp3",cover:"cover/akuma.jpg"},
  {title:"Night Dancer", artist:"Imase",file: "music/Nightdancer.mp3",cover:"cover/nightdancer.jpg"},
  {title:"Kamado Nezuko no Uta", artist:"Nami Nakagawa",file: "music/Kamadonezuko.mp3",cover:"cover/kamadonezuko.png"},
  {title:"Toumei Datta Sekai", artist:"Motohiro Hata",file: "music/Toumei.mp3",cover:"cover/toumei.jpg"},
  {title:"Multo", artist:"Cup of Joe",file: "music/Multo.mp3",cover:"cover/multo.jpg", relapse:true},





];
let current=0, isShuffle=false, isRepeat=false;
let currentPage=1, songsPerPage=9;

function formatTime(s){ if(!isFinite(s)) return '0:00'; s=Math.floor(s); const m=Math.floor(s/60); const sec=s%60; return m+':' + (sec<10?'0':'')+sec; }

function renderPlaylist(){
  playlistEl.innerHTML='';

  const keyword = searchInput.value.toLowerCase();

 const filteredPlaylist = playlist.filter(song => {
  const matchesSearch =
    song.title.toLowerCase().includes(keyword) ||
    song.artist.toLowerCase().includes(keyword);

  const matchesRelapse =
    !relapseMode || song.relapse === true;

  return matchesSearch && matchesRelapse;
});


  let start = (currentPage - 1) * songsPerPage;
  let end = Math.min(start + songsPerPage, filteredPlaylist.length);

  for(let i = start; i < end; i++){
    const song = filteredPlaylist[i];

    const realIndex = playlist.indexOf(song);

    const div = document.createElement('div');
    div.className = 'track' + (realIndex === current ? ' playing' : '');

    div.innerHTML = `
      <span style="width:20px">${realIndex + 1}</span>
      <img src="${song.cover}">
      <span>${song.title} - ${song.artist}</span>
    `;

    div.onclick = () => loadSong(realIndex);
    playlistEl.appendChild(div);
  }

  renderPagination(filteredPlaylist.length);
}

searchInput.oninput = () => {
  currentPage = 1;
  renderPlaylist();
};
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    searchInput.value = '';
    renderPlaylist();
  }
});




function renderPagination(totalItems = playlist.length){
  paginationEl.innerHTML='';
  const totalPages = Math.ceil(totalItems / songsPerPage);

  for(let i = 1; i <= totalPages; i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.style.background =
      i === currentPage ? 'rgba(124,58,237,0.25)' : 'var(--glass)';

    btn.onclick = () => {
      currentPage = i;
      renderPlaylist();
    };

    paginationEl.appendChild(btn);
  }
}


// When a song is loaded, save it to localStorage
function loadSong(i){
  if(relapseMode && !playlist[i].relapse){
    return; // block non-relapse songs
  }

  current = i;
  const song = playlist[i];
  audio.src = song.file;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist || 'Unknown';
  coverEl.style.backgroundImage = `url('${song.cover}')`;
  audio.play();
  renderPlaylist();

  localStorage.setItem('lastPlayedSong', i);
}
// Load
relapseMode = localStorage.getItem('relapseMode') === 'true';

// Save on toggle
localStorage.setItem('relapseMode', relapseMode);


// On page load, check if there's a song saved
window.addEventListener('load', () => {
  const lastPlayed = localStorage.getItem('lastPlayedSong');
  if(lastPlayed !== null && playlist[lastPlayed]){
    loadSong(Number(lastPlayed));
  } else {
    loadSong(0); // default to first song
  }
});


playBtn.onclick=()=>audio.paused?audio.play():audio.pause();
nextBtn.onclick=()=>{if(isShuffle) loadSong(Math.floor(Math.random()*playlist.length)); else loadSong((current+1)%playlist.length);}
prevBtn.onclick=()=>loadSong((current-1+playlist.length)%playlist.length);
shuffleBtn.onclick=()=>{isShuffle=!isShuffle; shuffleBtn.style.backgroundColor=isShuffle?'rgba(124,58,237,0.25)':'var(--glass)';}
repeatBtn.onclick=()=>{isRepeat=!isRepeat; repeatBtn.style.backgroundColor=isRepeat?'rgba(124,58,237,0.25)':'var(--glass)';}
volumeSlider.oninput=()=>audio.volume=volumeSlider.value;

audio.ontimeupdate=()=>{bar.style.width=(audio.currentTime/audio.duration)*100+'%'; currentTimeEl.textContent=formatTime(audio.currentTime); durationEl.textContent=formatTime(audio.duration);}
progress.onclick=(e)=>{audio.currentTime=(e.offsetX/progress.clientWidth)*audio.duration;}
audio.onended=()=>{if(isRepeat) loadSong(current); else nextBtn.onclick();}

// initialize
renderPlaylist();
loadSong(0);


const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function updateThemeIcon(){
  if(document.body.classList.contains('light')){
    themeIcon.className = 'fas fa-sun';
  }else{
    themeIcon.className = 'fas fa-moon';
  }
}

themeToggle.onclick = () => {
  document.body.classList.toggle('light');
  updateThemeIcon();
};

// init icon
updateThemeIcon();


// ===== SAVE THEME =====
if(localStorage.getItem('theme') === 'light'){
  document.body.classList.add('light');
}

updateThemeIcon();

themeToggle.onclick = () => {
  document.body.classList.toggle('light');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('light') ? 'light' : 'dark'
  );
  updateThemeIcon();
};

const likeBtn = document.getElementById('likeBtn');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

function updateLike(){
  likeBtn.classList.toggle('active', favorites.includes(current));
}

likeBtn.onclick = () => {
  if(favorites.includes(current)){
    favorites = favorites.filter(i => i !== current);
  }else{
    favorites.push(current);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateLike();
};

updateLike();


document.addEventListener('keydown', e => {
  if(e.target.tagName === 'INPUT') return;

  if(e.code === 'Space'){
    e.preventDefault();
    playBtn.onclick();
  }
  if(e.code === 'ArrowRight'){
    audio.currentTime += 5;
  }
  if(e.code === 'ArrowLeft'){
    audio.currentTime -= 5;
  }
  if(e.code === 'ArrowUp'){
    audio.volume = Math.min(1, audio.volume + 0.05);
  }
  if(e.code === 'ArrowDown'){
    audio.volume = Math.max(0, audio.volume - 0.05);
  }
});

const videoToggle = document.getElementById('videoToggle');
const videoModal = document.getElementById('videoModal');
const greenVideo = document.getElementById('greenVideo');
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
const closeVideo = document.getElementById('closeVideo');

videoToggle.onclick = () => {
  videoModal.classList.add('show');
  greenVideo.currentTime = 0;

  // wait until the video is ready
  greenVideo.muted = true;
  greenVideo.play().catch(err => console.log('Video play failed:', err));

  greenVideo.addEventListener('canplay', function startDrawing() {
    drawVideo();
    greenVideo.removeEventListener('canplay', startDrawing);
  });
};



closeVideo.onclick = () => {
  videoModal.classList.remove('show');
  greenVideo.pause();
};

greenVideo.onloadedmetadata = () => {
  canvas.width = greenVideo.videoWidth;
  canvas.height = greenVideo.videoHeight;
};


function drawVideo(){
  if(!videoModal.classList.contains('show')) return;

  if(greenVideo.readyState >= 2){
    canvas.width = greenVideo.videoWidth;
    canvas.height = greenVideo.videoHeight;

    ctx.drawImage(greenVideo, 0, 0, canvas.width, canvas.height);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    for(let i=0;i<data.length;i+=4){
      const r=data[i], g=data[i+1], b=data[i+2];
      if(g>120 && g>r+30 && g>b+30) data[i+3]=0;
    }

    ctx.putImageData(frame,0,0);
  }

  requestAnimationFrame(drawVideo);
  // console.log('Drawing frame...'); // uncomment for debugging
}


const bgToggle = document.getElementById('bgToggle');
const bgColorPicker = document.getElementById('bgColorPicker');

// Show color picker when palette icon is clicked
bgToggle.onclick = () => bgColorPicker.click();

// When user picks a color
bgColorPicker.oninput = (e) => {
  document.body.style.background = e.target.value;
  localStorage.setItem('bgColor', e.target.value);
};

// Load saved background on page load
const savedBg = localStorage.getItem('bgColor');
if(savedBg){
  document.body.style.background = savedBg;
}






