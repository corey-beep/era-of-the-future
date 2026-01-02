import './App.css'

function Releases() {
  return (
    <div className="app-container releases-page">
      {/* Egyptian Hieroglyphics Matrix Background */}
      <div className="hieroglyphics-matrix">
        {[...Array(30)].map((_, i) => {
          const randomStart = Math.random() * 100;
          return (
            <div
              key={i}
              className="hieroglyph-column"
              style={{
                left: `${(i / 30) * 100}%`,
                top: `-${100 - randomStart}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            >
              {String.fromCharCode(0x13000 + Math.floor(Math.random() * 1000))}
              {String.fromCharCode(0x13000 + Math.floor(Math.random() * 1000))}
              {String.fromCharCode(0x13000 + Math.floor(Math.random() * 1000))}
              {String.fromCharCode(0x13000 + Math.floor(Math.random() * 1000))}
              {String.fromCharCode(0x13000 + Math.floor(Math.random() * 1000))}
            </div>
          );
        })}
      </div>

      {/* Releases Page Content */}
      <div className="releases-page-content">
        {/* Releases Content */}
        <section className="releases-content-section">
          <h2 className="section-title">// RELEASES_</h2>

          {/* 90s Mentality Section */}
          <div className="release-section">
            <h3 className="release-section-title">90s MENTALITY</h3>
            <div className="release-pair-grid">
              <div className="release-card">
                <a
                  href="https://neweranell.bandcamp.com/album/90s-mentality"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  <div className="release-card-wrapper">
                    <img src="/90s vinyl.jpg" alt="90s Mentality" className="release-img" loading="eager" />
                    <div className="release-overlay">
                      <h3 className="release-title">VINYL / DIGITAL</h3>
                      <p className="release-year">2024</p>
                    </div>
                  </div>
                </a>
              </div>

              <div className="release-card merch-card">
                <a
                  href="https://neweranell.bandcamp.com/album/90s-mentality"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  <div className="release-card-wrapper">
                    <img src="/merch/90s-mentality-black-front.png" alt="90s Mentality Merch" className="release-img merch-img" loading="lazy" />
                    <div className="release-overlay">
                      <h3 className="release-title merch-title">MERCH</h3>
                      <p className="release-format">SHIRT</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* The Screw Tape Section */}
          <div className="release-section">
            <h3 className="release-section-title">THE SCREW TAPE</h3>
            <div className="release-pair-grid">
              <div className="release-card">
                <a
                  href="https://neweranell.bandcamp.com/album/the-screw-tape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  <div className="release-card-wrapper">
                    <img src="/screw.png" alt="The Screw Tape" className="release-img" loading="eager" />
                    <div className="release-overlay">
                      <h3 className="release-title">VINYL / DIGITAL</h3>
                      <p className="release-year">2024</p>
                    </div>
                  </div>
                </a>
              </div>

              <div className="release-card merch-card">
                <a
                  href="https://neweranell.bandcamp.com/album/the-screw-tape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  <div className="release-card-wrapper">
                    <img src="/merch/screw-tape-black.png" alt="The Screw Tape Merch" className="release-img merch-img" loading="lazy" />
                    <div className="release-overlay">
                      <h3 className="release-title merch-title">MERCH</h3>
                      <p className="release-format">SHIRT</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Boyz N The Hood Section */}
          <div className="release-section">
            <h3 className="release-section-title">BOYZ N THE HOOD</h3>
            <div className="release-pair-grid">
              <div className="release-card">
                <a
                  href="https://neweranell.bandcamp.com/album/boyz-n-the-hood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  <div className="release-card-wrapper">
                    <img src="/boyz.png" alt="Boyz N The Hood" className="release-img" loading="eager" />
                    <div className="release-overlay">
                      <h3 className="release-title">VINYL / DIGITAL</h3>
                      <p className="release-year">2024</p>
                    </div>
                  </div>
                </a>
              </div>

              <div className="release-card merch-card">
                <a
                  href="https://neweranell.bandcamp.com/album/boyz-n-the-hood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  <div className="release-card-wrapper">
                    <img src="/merch/boyz-in-the-hood-black.png" alt="Boyz N The Hood Merch" className="release-img merch-img" loading="lazy" />
                    <div className="release-overlay">
                      <h3 className="release-title merch-title">MERCH</h3>
                      <p className="release-format">SHIRT</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* The Black Tape Section */}
          <div className="release-section">
            <h3 className="release-section-title">THE BLACK TAPE</h3>
            <div className="release-pair-grid">
              <div className="release-card">
                <a
                  href="https://neweranell.bandcamp.com/album/the-black-tape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  <div className="release-card-wrapper">
                    <img src="/blavk.JPG" alt="The Black Tape" className="release-img" loading="eager" />
                    <div className="release-overlay">
                      <h3 className="release-title">VINYL / DIGITAL</h3>
                      <p className="release-year">2024</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="release-section">
            <h3 className="release-section-title">MORE RELEASES</h3>
            <div className="release-pair-grid">
              <div className="release-card coming-soon">
                <div className="release-card-wrapper">
                  <div className="coming-soon-content">
                    <span className="coming-soon-text">COMING SOON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Releases
