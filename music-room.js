/**
 * MUSIC ROOM - DEDICATED MUSIC PLAYER
 */

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audioPlayerMusic');
  const playPauseBtn = document.getElementById('playPauseBtnMusic');
  const prevBtn = document.getElementById('prevBtnMusic');
  const nextBtn = document.getElementById('nextBtnMusic');
  const currentTitle = document.getElementById('currentTitle');
  const currentArtist = document.getElementById('currentArtist');
  const currentDescription = document.getElementById('currentDescription');
  const currentTime = document.getElementById('currentTime');
  const duration = document.getElementById('duration');
  const progressFillLarge = document.getElementById('progressFillLarge');
  const progressRangeLarge = document.getElementById('progressRangeLarge');
  const playlistMusic = document.getElementById('playlistMusic');

  let currentTrackIndex = 0;
  let isPlaying = false;

  /**
   * Format time to MM:SS
   */
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Load and play a track
   */
  function loadTrack(index) {
    if (index < 0 || index >= CONTENT.music.length) return;

    currentTrackIndex = index;
    const track = CONTENT.music[index];

    audio.src = track.src;
    audio.load();

    currentTitle.textContent = track.title;
    currentArtist.textContent = track.artist;
    currentDescription.textContent = track.description || '';

    updatePlaylist();

    if (isPlaying) {
      audio.play();
    }
  }

  /**
   * Play or pause
   */
  function togglePlay() {
    if (!isPlaying) {
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = '❚❚';
    } else {
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶';
    }
  }

  /**
   * Next track
   */
  function nextTrack() {
    loadTrack((currentTrackIndex + 1) % CONTENT.music.length);
  }

  /**
   * Previous track
   */
  function prevTrack() {
    loadTrack(
      (currentTrackIndex - 1 + CONTENT.music.length) % CONTENT.music.length
    );
  }

  /**
   * Update playlist display
   */
  function updatePlaylist() {
    playlistMusic.innerHTML = '';

    CONTENT.music.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;

      const trackNumber = document.createElement('span');
      trackNumber.className = 'track-number';
      trackNumber.textContent = `${index + 1}.`;

      const trackTitle = document.createElement('span');
      trackTitle.className = 'track-title';
      trackTitle.textContent = track.title;

      const trackArtist = document.createElement('span');
      trackArtist.className = 'track-artist';
      trackArtist.textContent = track.artist;

      item.appendChild(trackNumber);
      item.appendChild(trackTitle);
      item.appendChild(trackArtist);

      item.addEventListener('click', () => {
        loadTrack(index);
        if (!isPlaying) {
          togglePlay();
        }
      });

      playlistMusic.appendChild(item);
    });
  }

  /**
   * Update progress bar
   */
  function updateProgress() {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    progressFillLarge.style.width = percent + '%';
    progressRangeLarge.value = percent;

    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  }

  /**
   * Seek to time
   */
  function seekTrack(e) {
    if (!audio.duration) return;

    const percent = e.target.value;
    audio.currentTime = (percent / 100) * audio.duration;
  }

  // Event listeners
  playPauseBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prevTrack);
  nextBtn.addEventListener('click', nextTrack);
  progressRangeLarge.addEventListener('input', seekTrack);

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', nextTrack);
  audio.addEventListener('durationchange', updateProgress);

  /**
   * Add hidden heart to music page
   */
  function addHiddenHeartToMusic() {
    if (game.isHeartFound('heart-music')) return;

    const heart = document.createElement('div');
    heart.className = 'hidden-heart-music';
    heart.textContent = '♡';
    heart.style.position = 'fixed';
    heart.style.right = '10%';
    heart.style.bottom = '30%';
    heart.style.cursor = 'pointer';
    heart.style.fontSize = '1.5rem';
    heart.style.opacity = '0.08';
    heart.style.transition = 'all 0.3s ease';
    heart.style.zIndex = '100';

    heart.addEventListener('mouseenter', () => {
      heart.style.opacity = '0.4';
      heart.style.transform = 'scale(1.2)';
    });

    heart.addEventListener('mouseleave', () => {
      heart.style.opacity = '0.08';
      heart.style.transform = 'scale(1)';
    });

    heart.addEventListener('click', () => {
      const found = game.findHeart('heart-music');
      if (found) {
        heart.style.animation = 'heartPop 0.6s ease-out';
        setTimeout(() => heart.remove(), 600);
        document.dispatchEvent(new CustomEvent('heart-found', {detail: {heartId: 'heart-music'}}));
      }
    });

    document.body.appendChild(heart);
  }

  // Initialize
  loadTrack(0);
  addHiddenHeartToMusic();
});
