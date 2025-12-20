import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [glitchActive, setGlitchActive] = useState(false)
  const [chromeShift, setChromeShift] = useState(0)
  const [activeEffect, setActiveEffect] = useState(null)
  const [lightning, setLightning] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const audioRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [showTourMessage, setShowTourMessage] = useState(false)

  const playlist = [
    '/The Gate (feat. Lil Coop).mp3',
    '/DJ Sound - Chokey Choke (Remastered).mp3'
  ]

  const handleTourClick = () => {
    setShowTourMessage(true)
    setTimeout(() => setShowTourMessage(false), 3000)
  }

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setChromeShift(prev => (prev + 1) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Auto-play background music on load
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25
      // Try to play with user interaction fallback
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play was prevented, will play on first user interaction
          console.log('Auto-play prevented, waiting for user interaction')
        })
      }
    }

    // Listen for YouTube player events
    const handleMessage = (event) => {
      // Accept messages from YouTube
      if (event.origin !== 'https://www.youtube.com') return

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        // Check for player state changes
        if (data.event === 'infoDelivery' && data.info) {
          const playerState = data.info.playerState

          if (playerState === 1) {
            // YouTube is playing (state 1), pause background music
            if (audioRef.current && !audioRef.current.paused) {
              console.log('YouTube playing, pausing background music')
              audioRef.current.pause()
            }
          } else if (playerState === 2 || playerState === 0) {
            // YouTube is paused (state 2) or ended (state 0), resume background music
            if (audioRef.current && audioRef.current.paused) {
              console.log('YouTube paused/ended, resuming background music')
              audioRef.current.play().catch(err => console.log('Resume failed:', err))
            }
          }
        }
      } catch (e) {
        // Not JSON or not relevant
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Handle track ending - play next track
  const handleTrackEnded = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
  }

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.volume = 0.25
      audioRef.current.play().catch(err => console.log('Play failed:', err))
    }
  }, [currentTrack])

  useEffect(() => {
    // Lightning strikes at random intervals
    const triggerLightning = () => {
      setLightning(true)
      setTimeout(() => setLightning(false), 200)
    }

    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerLightning()
        // Sometimes double strike
        if (Math.random() > 0.5) {
          setTimeout(triggerLightning, 300)
        }
      }
    }, 3000 + Math.random() * 5000)

    return () => clearInterval(lightningInterval)
  }, [])

  useEffect(() => {
    let lastScrollY = 0
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Trigger lightning on scroll down at random intervals
      if (currentScrollY > lastScrollY && Math.random() > 0.95) {
        setLightning(true)
        setTimeout(() => setLightning(false), 200)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const triggerGlitch = () => {
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), 300)
  }

  const triggerEffect = (effectName) => {
    setActiveEffect(effectName)
    triggerGlitch()
    setTimeout(() => setActiveEffect(null), 3000)
  }

  // Handle first user interaction to start audio if autoplay failed
  const handleFirstInteraction = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.log('Play failed:', err))
    }
  }

  return (
    <div
      className={`app-container ${glitchActive ? 'glitch-active' : ''} ${lightning ? 'lightning-flash' : ''} ${activeEffect ? `effect-${activeEffect}` : ''}`}
      onClick={handleFirstInteraction}
      onScroll={handleFirstInteraction}
    >
      {/* Background Music */}
      <audio ref={audioRef} onEnded={handleTrackEnded}>
        <source src={playlist[currentTrack]} type="audio/mpeg" />
      </audio>

      {/* Stars effect */}
      <div className="stars" style={{
        transform: `scale(${1 + scrollY * 0.0003})`,
        filter: `blur(${Math.min(scrollY * 0.002, 2)}px)`
      }}>
        {[...Array(isMobile ? 40 : 100)].map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1 + Math.random() * 3}s`
          }}></div>
        ))}
      </div>

      {/* Rain effect */}
      <div className="rain">
        {[...Array(isMobile ? 50 : 150)].map((_, i) => (
          <div key={i} className="rain-drop" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${0.8 + Math.random() * 0.7}s`
          }}></div>
        ))}
      </div>

      {/* Lightning flash overlay */}
      {lightning && <div className="lightning-overlay"></div>}

      {/* Grunge texture overlay */}
      <div className="grunge-overlay"></div>
      <div className="scan-lines"></div>

      {/* Hero Section */}
      <section className="hero scroll-section" style={{
        transform: `perspective(1000px) rotateX(${Math.min(scrollY * 0.02, 10)}deg) translateZ(${Math.min(scrollY * -0.2, -50)}px)`,
        opacity: Math.max(0.3, 1 - (scrollY / 1200))
      }}>
        <h1 className="chrome-title" data-text="ERA OF THE FUTURE">
          ERA OF THE FUTURE
        </h1>
        <div className="subtitle-container">
          <span className="glitch-text">NELL</span>
          <span className="chrome-divider">×</span>
          <span className="glitch-text">NEW ERA OF THE FUTURE</span>
          <span className="chrome-divider">×</span>
          <span className="glitch-text">LAND OF THE BLACK</span>
        </div>

        {/* Vinyl Album Section */}
        <div className="vinyl-hero-section">
          <h2 className="vinyl-section-title">// GET_VINYL_</h2>
          <div className="vinyl-album-container">
            <a
              href="https://neweranell.bandcamp.com/album/90s-mentality"
              target="_blank"
              rel="noopener noreferrer"
              className="vinyl-album-link"
            >
              <div className="vinyl-album-wrapper">
                <img src="/90s vinyl.jpg" alt="90s Mentality Vinyl" className="vinyl-album-img" loading="eager" />
                <div className="vinyl-album-overlay">
                  <span className="vinyl-cta">GET 90s MENTALITY VINYL NOW!</span>
                  <span className="vinyl-subcta">CLICK TO BUY ON BANDCAMP</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Abstract Button Grid */}
      <section className="button-section scroll-section" style={{
        transform: `perspective(1000px) translateX(${Math.max(-30, Math.min(30, (scrollY - 600) * 0.03))}px) rotateY(${Math.max(-3, Math.min(3, (scrollY - 600) * -0.005))}deg)`,
        opacity: Math.min(1, Math.max(0.5, (scrollY - 200) / 400))
      }}>
        <h2 className="section-title">// INTERACT_</h2>

        <div className="abstract-buttons">
          <button
            className="abstract-btn shape-1"
            onClick={() => triggerEffect('distortion')}
          >
            <span className="btn-text">DISTORT</span>
            <span className="btn-glitch">D1ST0RT</span>
          </button>

          <button
            className="abstract-btn shape-2"
            onClick={() => triggerEffect('chrome')}
          >
            <span className="btn-text">CHROME</span>
            <span className="btn-glitch">CHR0M3</span>
          </button>

          <button
            className="abstract-btn shape-3"
            onClick={() => triggerEffect('noise')}
          >
            <span className="btn-text">NOISE</span>
            <span className="btn-glitch">N01S3</span>
          </button>

          <button
            className="abstract-btn shape-4"
            onClick={() => triggerEffect('glitch')}
          >
            <span className="btn-text">GLITCH</span>
            <span className="btn-glitch">GL1TCH</span>
          </button>

          <button
            className="abstract-btn shape-5"
            onClick={() => triggerEffect('warp')}
          >
            <span className="btn-text">WARP</span>
            <span className="btn-glitch">W4RP</span>
          </button>

          <button
            className="abstract-btn shape-6"
            onClick={() => triggerEffect('break')}
          >
            <span className="btn-text">BREAK</span>
            <span className="btn-glitch">BR34K</span>
          </button>
        </div>

        {activeEffect && (
          <div className="effect-display">
            <span className="effect-label">[{activeEffect.toUpperCase()}_ACTIVATED]</span>
          </div>
        )}
      </section>

      {/* Hero Images Section */}
      <section className="hero-images-section scroll-section" style={{
        transform: `perspective(1000px) translateY(${Math.max(-10, Math.min(10, (scrollY - 1400) * -0.01))}px) rotateX(${Math.max(-2, Math.min(2, (scrollY - 1400) * 0.002))}deg)`,
        opacity: Math.min(1, Math.max(0.7, (scrollY - 1000) / 400))
      }}>
        <div className="hero-images">
          <div className="hero-image-wrapper left">
            <img src="/sun god.png" alt="Sun God" className="hero-img" loading="lazy" />
          </div>
          <div className="hero-image-wrapper right">
            <img src="/egyptian graffiti.png" alt="Egyptian Graffiti" className="hero-img" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section scroll-section" style={{
        transform: `perspective(1000px) translateZ(${Math.max(-20, Math.min(20, (scrollY - 1800) * 0.05))}px) rotateY(${Math.max(-2, Math.min(2, (scrollY - 1800) * 0.003))}deg)`,
        opacity: Math.min(1, Math.max(0.7, (scrollY - 1200) / 400))
      }}>
        <h2 className="section-title">// VIDEO_</h2>
        <div className="media-player-skin">
          <div className="player-header">
            <div className="player-display">
              <span className="player-title">THE_BLACK_TAPE.mp4</span>
              <span className="player-time">00:00 / 00:00</span>
            </div>
          </div>
          <div className="video-container">
            <div className="youtube-embed">
              <iframe
                width="100%"
                height="500"
                src="https://www.youtube.com/embed/r5-HeQl_T08?enablejsapi=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Music Player Section */}
      <section className="music-section scroll-section" style={{
        transform: `perspective(1000px) translateX(${Math.max(-20, Math.min(20, (scrollY - 2400) * -0.02))}px) skewY(${Math.max(-1, Math.min(1, (scrollY - 2400) * 0.001))}deg)`,
        opacity: Math.min(1, Math.max(0.7, (scrollY - 1800) / 400))
      }}>
        <h2 className="section-title">// AUDIO_PLAYER_</h2>
        <div className="media-player-skin">
          <div className="player-header">
            <div className="player-display">
              <span className="player-title">NELL_DISCOGRAPHY.mp3</span>
              <span className="player-time">∞ TRACKS</span>
            </div>
          </div>
          <div className="audio-visualizer-section">
            <div className="vinyl-disc-small spinning">
              <div className="vinyl-label-small">
                <span>NELL</span>
              </div>
            </div>
            <div className="eq-bars">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="eq-bar" style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${30 + Math.random() * 70}%`
                }}></div>
              ))}
            </div>
          </div>
          <div className="spotify-container">
            <div className="spotify-embed">
              <iframe
                style={{ borderRadius: '0px' }}
                src="https://open.spotify.com/embed/artist/7y2RSfL6zW4IBUc4uPYBfL?utm_source=generator&theme=0"
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="instagram-section scroll-section" style={{
        transform: `perspective(1000px) translateY(${Math.max(-15, Math.min(15, (scrollY - 3000) * -0.01))}px) rotateZ(${Math.max(-1, Math.min(1, (scrollY - 3000) * 0.0005))}deg)`,
        opacity: Math.min(1, Math.max(0.8, (scrollY - 2400) / 400))
      }}>
        <h2 className="section-title">// INSTAGRAM_FEED_</h2>
        <div className="instagram-grid">
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/DLvH6NmJLGP/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/DJSfrnpt6EI/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/DDmiBe6Jd7l/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/DDXqShNJwMK/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/Cxi1mkaprG_/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/CH2MEYhBE_V/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/B3xAmm6pdXU/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/BzLjnMXhior/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/BhMwpk-FR8h/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/BeZhxJbFVUd/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/BYJI8iaFW-z/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
          <div className="ig-embed-wrapper">
            <iframe src="https://www.instagram.com/p/BbXUx1HFzBn/embed" frameBorder="0" scrolling="no"></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="tour-dates-section">
          <button className="tour-dates-btn" onClick={handleTourClick}>
            TOUR DATES
          </button>
          {showTourMessage && (
            <div className="tour-message">
              <span className="tour-message-text">TOUR DATES TO BE ANNOUNCED</span>
            </div>
          )}
        </div>

        <div className="social-links">
          <a
            href="https://discord.com/channels/1438270637700415570/1438270638509785213"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <svg className="social-icon" viewBox="0 0 71 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
            </svg>
            <span className="social-text">DISCORD</span>
          </a>
          <a
            href="https://www.instagram.com/neweranell?igsh=MWUyeTh5bG4zdTV1Yg=="
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="social-text">INSTAGRAM</span>
          </a>
          <a
            href="https://x.com/neweranell"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="social-text">X</span>
          </a>
        </div>
        <div className="footer-text">
          <span className="chrome-text">DESIGNED IN THE FUTURE</span>
          <span className="grunge-divider">//</span>
          <span className="chrome-text">BUILT IN THE PAST</span>
        </div>
      </footer>
    </div>
  )
}

export default App
