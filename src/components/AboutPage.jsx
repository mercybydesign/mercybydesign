import React from 'react';

const GITHUB_REPO = 'https://github.com/mercybydesign/mercybydesign';

export function AboutPage() {
  return (
    <div className="about-wrap">
      <section className="about-hero">
        <span className="wisdom-eyebrow">ABOUT MERCYBYDESIGN</span>
        <h2>Exploring Islamic Wisdom Through Data &amp; Research</h2>
        <p className="about-lead">
          MercyByDesign starts from a simple question:{' '}
          <em>
            what happens when humanity practices the principles Allah
            prescribed—not just in theory, but measured across real households,
            neighborhoods, and nations?
          </em>
        </p>
        <p className="about-body">
          Our goal is to let anyone—Muslim or non-Muslim, curious student or
          researcher—explore the wisdom (<em>hikmah</em>) behind Tawhid, Salah,
          Zakat, Sawm, Hajj, interest-free finance, Waqf, and neighbor rights
          through transparent interactive simulations and peer-reviewed research
          briefs.
        </p>
      </section>

      <div className="about-grid">
        <section className="about-card">
          <h3>Open &amp; Auditable</h3>
          <p className="about-meta">Open-Source Educational Initiative</p>
          <p className="about-body">
            Every simulation and research brief is open source so scholars,
            economists, researchers, and developers can inspect the math, verify
            sources, and improve the models together.
          </p>

          <hr className="divider" />

          <div className="contact-links">
            <div className="contact-row">
              <span>Source Code</span>
              <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
                github.com/mercybydesign →
              </a>
            </div>
            <div className="contact-row">
              <span>Contributor Guide</span>
              <a
                href={`${GITHUB_REPO}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noreferrer"
              >
                Read CONTRIBUTING.md →
              </a>
            </div>
            <div className="contact-row">
              <span>License</span>
              <span>MIT Open Source</span>
            </div>
          </div>
        </section>

        <section className="about-card">
          <h3>Contribute a Study or Fix</h3>
          <p className="about-body">
            Whether you want to publish a research brief, add a country dataset,
            or build a new simulation, jump in on GitHub:
          </p>

          <div className="contact-links" style={{ marginTop: '16px' }}>
            <div className="contact-row">
              <span>Publish a Study or Brief</span>
              <a
                href={`${GITHUB_REPO}/issues/new?template=new-study.md`}
                target="_blank"
                rel="noreferrer"
              >
                Submit Study / Research Brief →
              </a>
            </div>
            <div className="contact-row">
              <span>Add a Country Dataset</span>
              <a
                href={`${GITHUB_REPO}/issues/new?template=country-dataset.md`}
                target="_blank"
                rel="noreferrer"
              >
                Submit Dataset →
              </a>
            </div>
            <div className="contact-row">
              <span>Fiqh / Math Correction</span>
              <a
                href={`${GITHUB_REPO}/issues/new?template=methodology-correction.md`}
                target="_blank"
                rel="noreferrer"
              >
                Report Correction →
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
