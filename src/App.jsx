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
      if (event.origin === 'https://www.youtube.com') {
        try {
          const data = JSON.parse(event.data)
          if (data.event === 'infoDelivery' && data.info && data.info.playerState !== undefined) {
            // PlayerState: 1 = playing, 2 = paused
            if (data.info.playerState === 1) {
              // YouTube is playing, pause background music
              if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause()
              }
            }
          }
        } catch (e) {
          // Not JSON or not relevant
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

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
    setTimeout(() => setActiveEffect(null), 2000)
  }

  // Handle first user interaction to start audio if autoplay failed
  const handleFirstInteraction = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.log('Play failed:', err))
    }
  }

  return (
    <div
      className={`app-container ${glitchActive ? 'glitch-active' : ''} ${lightning ? 'lightning-flash' : ''}`}
      onClick={handleFirstInteraction}
      onScroll={handleFirstInteraction}
    >
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/The Gate (feat. Lil Coop).mp3" type="audio/mpeg" />
      </audio>

      {/* Stars effect */}
      <div className="stars" style={{
        transform: `scale(${1 + scrollY * 0.0003})`,
        filter: `blur(${Math.min(scrollY * 0.002, 2)}px)`
      }}>
        {[...Array(100)].map((_, i) => (
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
        {[...Array(150)].map((_, i) => (
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

        {/* Distorted Images */}
        <div className="hero-images">
          <div className="hero-image-wrapper left">
            <img src="/sun god.png" alt="Sun God" className="hero-img" />
          </div>
          <div className="hero-image-wrapper right">
            <img src="/egyptian graffiti.png" alt="Egyptian Graffiti" className="hero-img" />
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
