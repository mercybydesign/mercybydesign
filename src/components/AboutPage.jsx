import React from 'react';

const GITHUB_REPO = 'https://github.com/mercybydesign/mercybydesign';

export function AboutPage() {
  return (
    <div className="about-wrap">
      <section className="about-hero">
        <span className="wisdom-eyebrow">ABOUT THE CREATOR &amp; MISSION</span>
        <h2>Why I Built MercyByDesign</h2>
        <p className="about-lead">
          MercyByDesign started from a simple question:{' '}
          <em>
            what would actually happen if humanity practiced the principles Allah
            prescribed—not just in theory, but measured across real households,
            neighborhoods, and nations?
          </em>
        </p>
        <p className="about-body">
          Too often, conversations about Islam stay abstract. My goal with this
          project is to let anyone—Muslim or non-Muslim, curious student or
          economist—explore the wisdom (<em>hikmah</em>) behind Salah, Zakat,
          Sawm, interest-free finance, Waqf, and neighbor rights through honest,
          transparent, interactive models.
        </p>
        <p className="about-body">
          MercyByDesign is open source so anyone—scholars, doctors, economists,
          writers, or developers—can audit the math, contribute country
          datasets, publish scientific study summaries and research articles, or
          build new interactive simulations.
        </p>
      </section>

      <div className="about-grid">
        <section className="about-card">
          <h3>About the Project</h3>
          <p className="about-meta">Open-Source Educational Initiative</p>
          <p className="about-body">
            Built with the intention of creating beneficial, accessible tools (
            <em>Sadaqah Jariyah</em>) that highlight how Islamic guidance
            nurtures balance, dignity, and well-being for all people.
          </p>

          <hr className="divider" />

          <div className="contact-links">
            <div className="contact-row">
              <span>Direct Email</span>
              <a href="mailto:hello@mercybydesign.org">hello@mercybydesign.org</a>
            </div>
            <div className="contact-row">
              <span>Collaborations</span>
              <span>Scholars, economists &amp; developers welcome</span>
            </div>
            <div className="contact-row">
              <span>License</span>
              <span>MIT Open Source</span>
            </div>
          </div>
        </section>

        <section className="about-card">
          <h3>Get Involved &amp; Contribute</h3>
          <p className="about-body">
            The fastest way to suggest a new study, add a country dataset, or
            flag a Fiqh or methodology correction is through GitHub or direct
            email.
          </p>

          <div className="contact-links" style={{ marginTop: '16px' }}>
            <div className="contact-row">
              <span>Publish a Study or Article</span>
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
            <div className="contact-row">
              <span>General Inquiries</span>
              <a href="mailto:hello@mercybydesign.org?subject=MercyByDesign%20Inquiry">
                Email hello@mercybydesign.org →
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
