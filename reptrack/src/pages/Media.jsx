import React, { useState, useRef, useEffect } from 'react';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import './Media.css';

const TRACKS = [
  {
    id: 1,
    title: 'Workout Mix 1',
    artist: 'RepTrack',
    duration: 180,
    genre: 'Workout',
    bpm: 140,
    emoji: '🔥',
    src: process.env.PUBLIC_URL + '/music/workout1.mp3'
  },
  {
    id: 2,
    title: 'Workout Mix 2',
    artist: 'RepTrack',
    duration: 180,
    genre: 'Workout',
    bpm: 150,
    emoji: '💪',
    src: process.env.PUBLIC_URL + '/music/workout2.mp3'
  },
  {
    id: 3,
    title: 'Workout Mix 3',
    artist: 'RepTrack',
    duration: 180,
    genre: 'Cardio',
    bpm: 160,
    emoji: '⚡',
    src: process.env.PUBLIC_URL + '/music/workout3.mp3' 
  }
];

const PODCASTS = [
  {
    id: 1,
    title: 'RepTrack Podcast',
    host: 'RepTrack',
    ep: 'Ep 1',
    duration: '30 min',
    emoji: '🎙️',
    audio: process.env.PUBLIC_URL + '/podcasts/podcast.mp3'
  }
];

function fmt(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function WaveIcon({ playing }) {
  return (
    <div className={`wave-icon ${playing ? 'playing' : ''}`}>
      {[1, 2, 3, 4].map(i => <span key={i} style={{ animationDelay: `${i * 0.12}s` }} />)}
    </div>
  );
}

export default function Media({ onNavigate }) {
  const [tab, setTab] = useState('music');
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [currentPodcast, setCurrentPodcast] = useState(null);

  // Correctly initialized State for Playlists with LocalStorage fallback
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('reptrack_playlists');
    return saved ? JSON.parse(saved) : [];
  });

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState(new Set());

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Dynamic Active Duration calculation helper (Handles both Podcasts and Songs safely)
  const getActiveDuration = () => {
    if (currentPodcast) {
      return parseInt(currentPodcast.duration) * 60 || 1800;
    }
    return currentTrack.duration;
  };

  // Sync Progress Interval
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          const activeDuration = getActiveDuration();
          if (p >= activeDuration) {
            if (repeat) {
              if (audioRef.current) audioRef.current.currentTime = 0;
              return 0;
            }
            handleNext();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, currentTrack, currentPodcast, repeat]);

  // Sync Native Volume Node with React State
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Auto save playlist updates to Storage
  useEffect(() => {
    localStorage.setItem('reptrack_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = () => {
    const name = prompt('Enter Playlist Name');
    if (!name) return;

    setPlaylists(prev => [
      ...prev,
      {
        id: Date.now(),
        name,
        songs: []
      }
    ]);
  };

  const addSongToPlaylist = (track) => {
    if (playlists.length === 0) {
      alert('Create a playlist first');
      return;
    }

    const playlistName = prompt(
      'Enter playlist name:\n\n' +
      playlists.map(p => p.name).join('\n')
    );

    if (!playlistName) return;

    setPlaylists(prev =>
      prev.map(p =>
        p.name === playlistName
          ? { ...p, songs: [...p.songs, track] }
          : p
      )
    );
  };

  const handlePlay = (track) => {
    setCurrentPodcast(null);
    setCurrentTrack(track);
    setProgress(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.src;
      audioRef.current.load();

      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(err => console.error("Music Playback Error:", err));
    }
  };

  const playPodcast = (podcast) => {
    setCurrentPodcast(podcast);
    setProgress(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = podcast.audio;
      audioRef.current.load();

      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(err => console.error("Podcast Playback Error:", err));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(err => console.error(err));
    }
  };

  const handleNext = () => {
    if (currentPodcast) return; // Do nothing if skipping on a standalone podcast
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    let next;
    if (shuffle) {
      next = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    } else {
      next = TRACKS[(idx + 1) % TRACKS.length];
    }
    setCurrentTrack(next);
    setProgress(0);
  };

  const handlePrev = () => {
    if (progress > 3) {
      setProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    if (currentPodcast) {
      setProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prev = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
    setCurrentTrack(prev);
    setProgress(0);
  };

  const toggleLike = (id) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeDuration = getActiveDuration();
  const pct = Math.min((progress / activeDuration) * 100, 100);

  return (
    <div className="media-page">
      <StatusBar />
      <div className="page media-inner">
        {/* Header */}
        <div className="media-header">
          <h2 className="media-title">Media</h2>
          <button className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* Now Playing Card */}
        <div className="now-playing-card card">
          <div className="np-top">
            <div className="np-art" style={{ background: playing ? 'rgba(61,220,92,0.12)' : 'rgba(255,255,255,0.04)' }}>
              <span className="np-emoji">{currentPodcast ? currentPodcast.emoji : currentTrack.emoji}</span>
              <WaveIcon playing={playing} />
            </div>
            <div className="np-info">
              <div className="now-title">
                {currentPodcast ? currentPodcast.title : currentTrack.title}
              </div>
              <div className="now-artist">
                {currentPodcast ? currentPodcast.host : currentTrack.artist}
              </div>
              <div className="np-meta">
                <span className="np-genre">{currentPodcast ? "Podcast" : currentTrack.genre}</span>
                <span className="np-bpm">{currentPodcast ? `${currentPodcast.ep}` : `♩ ${currentTrack.bpm} BPM`}</span>
              </div>
            </div>
            <button 
              className={`like-btn ${!currentPodcast && liked.has(currentTrack.id) ? 'liked' : ''}`} 
              onClick={() => !currentPodcast && toggleLike(currentTrack.id)}
              disabled={!!currentPodcast}
            >
              <svg viewBox="0 0 24 24" fill={!currentPodcast && liked.has(currentTrack.id) ? '#ff4d4d' : 'none'} stroke="#ff4d4d" strokeWidth="2" width="18" height="18">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          <div className="np-progress-wrap">
            <div className="np-progress-bar" onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              const targetTime = Math.floor(ratio * activeDuration);
              setProgress(targetTime);
              if (audioRef.current) audioRef.current.currentTime = targetTime;
            }}>
              <div className="np-progress-fill" style={{ width: `${pct}%` }} />
              <div className="np-progress-thumb" style={{ left: `${pct}%` }} />
            </div>
            <div className="np-time-row">
              <span>{fmt(progress)}</span>
              <span>{fmt(activeDuration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="np-controls">
            <button className={`ctrl-btn sm ${shuffle ? 'active' : ''}`} onClick={() => setShuffle(s => !s)} disabled={!!currentPodcast}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
              </svg>
            </button>
            <button className="ctrl-btn" onClick={handlePrev}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button className={`play-btn ${playing ? 'pause' : ''}`} onClick={togglePlay}>
              {playing
                ? <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              }
            </button>
            <button className="ctrl-btn" onClick={handleNext} disabled={!!currentPodcast}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button className={`ctrl-btn sm ${repeat ? 'active' : ''}`} onClick={() => setRepeat(r => !r)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
          </div>

          {/* Volume */}
          <div className="np-volume-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            </svg>
            <input type="range" min="0" max="100" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="volume-slider" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="media-tabs">
          {['music', 'podcasts', 'playlists'].map(t => (
            <button key={t} className={`media-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Music list */}
        {tab === 'music' && (
          <div className="track-list">
            {TRACKS.map(track => (
              <div key={track.id} className={`track-item ${!currentPodcast && currentTrack.id === track.id ? 'active' : ''}`}
                onClick={() => handlePlay(track)}>
                <div className="track-art">
                  <span>{track.emoji}</span>
                </div>
                <div className="track-info">
                  <p className="track-name">{track.title}</p>
                  <p className="track-artist">{track.artist} · {track.bpm} BPM</p>
                </div>
                <button
                  className="add-track-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addSongToPlaylist(track);
                  }}
                >
                  +
                </button>
                <span className="track-duration">
                  {fmt(track.duration)}
                </span>
                {!currentPodcast && currentTrack.id === track.id && playing && <WaveIcon playing={true} />}
              </div>
            ))}
          </div>
        )}

        {/* Podcasts */}
        {tab === 'podcasts' && (
          <div className="podcast-list">
            {PODCASTS.map(pod => (
              <div key={pod.id} className="podcast-item card">
                <div className="pod-art">{pod.emoji}</div>
                <div className="pod-info">
                  <p className="pod-title">{pod.title}</p>
                  <p className="pod-host">{pod.host} · {pod.ep}</p>
                  <p className="pod-dur">{pod.duration}</p>
                </div>
                <button className="pod-play-btn" onClick={() => playPodcast(pod)}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Playlists */}
        {tab === 'playlists' && (
          <div className="playlist-grid">
            {playlists.map(pl => (
              <div key={pl.id} className="playlist-card card">
                <p className="pl-name">{pl.name}</p>
                <p className="pl-count">{pl.songs.length} songs</p>
                <div className="playlist-songs">
                  {pl.songs.map(song => (
                    <div key={song.id} className="playlist-song" onClick={() => handlePlay(song)}>
                      🎵 {song.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="playlist-card card playlist-add" onClick={createPlaylist}>
              <div className="pl-emoji">+</div>
              <p className="pl-name">New Playlist</p>
            </div>
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>

      <audio ref={audioRef} preload="metadata" onEnded={handleNext} />
      <BottomNav activePage="media" onNavigate={onNavigate} />
    </div>
  );
}