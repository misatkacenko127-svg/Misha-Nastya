const musicTracks = [
  {
    title: 'Shape of My Heart',
    artist: 'Sting',
    src: 'music/Sting - Shape of My Heart (Lyrics).mp3'
  },
  {
    title: 'Щастя',
    artist: 'Нерви',
    src: 'music/Нервы - Счастье.mp3'
  },
  {
    title: 'Зайка (2 місяці)',
    artist: 'Миша & Настя',
    src: 'music/Зайка( 2місяці).m4a'
  }
];

const playerState = {
  currentIndex: 0,
  isPlaying: false
};

function initMusicPlayer() {
  const musicPlayer = document.getElementById('musicPlayer');
  if (!musicPlayer) return;

  const audio = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const trackTitle = document.getElementById('trackTitle');
  const trackList = document.getElementById('trackList');
  const progress = document.getElementById('progress');
  const timeLabel = document.getElementById('timeLabel');

  if (!audio || !playPauseBtn || !prevBtn || !nextBtn || !trackTitle || !trackList || !progress || !timeLabel) return;

  function renderTrackList() {
    trackList.innerHTML = musicTracks
      .map((track, index) => `
        <button class="track-item ${index === playerState.currentIndex ? 'active' : ''}" data-index="${index}" type="button">
          <span>${index + 1}. ${track.title}</span>
          <small>${track.artist}</small>
        </button>
      `)
      .join('');

    trackList.querySelectorAll('.track-item').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        playerState.currentIndex = index;
        loadTrack();
      });
    });
  }

  function updateTitle() {
    const currentTrack = musicTracks[playerState.currentIndex];
    trackTitle.textContent = currentTrack.title;
    renderTrackList();
  }

  function loadTrack() {
    const currentTrack = musicTracks[playerState.currentIndex];
    audio.src = currentTrack.src;
    audio.load();
    updateTitle();
    if (playerState.isPlaying) audio.play();
    else audio.pause();
  }

  function togglePlay() {
    if (!playerState.isPlaying) {
      audio.play();
      playerState.isPlaying = true;
      playPauseBtn.textContent = '❚❚';
      playPauseBtn.setAttribute('aria-label', 'Пауза');
    } else {
      audio.pause();
      playerState.isPlaying = false;
      playPauseBtn.textContent = '▶';
      playPauseBtn.setAttribute('aria-label', 'Відтворити');
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);

  prevBtn.addEventListener('click', () => {
    playerState.currentIndex = (playerState.currentIndex - 1 + musicTracks.length) % musicTracks.length;
    loadTrack();
  });

  nextBtn.addEventListener('click', () => {
    playerState.currentIndex = (playerState.currentIndex + 1) % musicTracks.length;
    loadTrack();
  });

  audio.addEventListener('timeupdate', () => {
    const duration = audio.duration || 0;
    const currentTime = audio.currentTime || 0;
    const value = duration ? (currentTime / duration) * 100 : 0;
    progress.style.width = `${value}%`;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    timeLabel.textContent = `${minutes}:${seconds}`;
  });

  audio.addEventListener('ended', () => {
    playerState.currentIndex = (playerState.currentIndex + 1) % musicTracks.length;
    loadTrack();
  });

  renderTrackList();
  updateTitle();
  loadTrack();
  audio.pause();
  playerState.isPlaying = false;
  playPauseBtn.textContent = '▶';
  playPauseBtn.setAttribute('aria-label', 'Відтворити');
}

document.addEventListener('DOMContentLoaded', initMusicPlayer);
