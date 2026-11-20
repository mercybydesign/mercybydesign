import React, { useState } from 'react';

export function AboutPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feedback & Ideas');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="about-wrap">
      <section className="about-hero">
        <span className="wisdom-eyebrow">ABOUT THE CREATOR &amp; MISSION</span>
        <h2>Why I Built MercyByDesign</h2>
        <p className="about-lead">
          MercyByDesign started from a simple question: <em>what would actually happen if humanity practiced the principles Allah prescribed—not just in theory, but measured across real households, neighborhoods, and nations?</em>
        </p>
        <p className="about-body">
          Too often, conversations about Islam stay abstract. My goal with this project is to let anyone—Muslim or non-Muslim, curious student or economist—explore the wisdom (<em>hikmah</em>) behind Salah, Zakat, Sawm, interest-free finance, Waqf, and neighbor rights through honest, transparent, interactive models.
        </p>
        <p className="about-body">
          Every simulator here is a living work in progress. If you are a scholar of Fiqh, an economist, a designer, a developer, or simply someone with a thoughtful question or suggestion, I would genuinely love to hear from you.
        </p>
      </section>

      <div className="about-grid">
        <section className="about-card">
          <h3>About the Creator</h3>
          <p className="about-meta">Independent Builder &amp; Researcher</p>
          <p className="about-body">
            Built with the intention of creating beneficial, accessible tools (<em>Sadaqah Jariyah</em>) that highlight how Islamic guidance nurtures balance, dignity, and well-being for all people.
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
              <span>Open Corrections</span>
              <span>Spot a Fiqh or data improvement? Let me know.</span>
            </div>
          </div>
        </section>

        <section className="about-card">
          <h3>Contact the Creator</h3>
          {submitted ? (
            <div className="form-success">
              <strong>Thank you, {name}.</strong>
              <p>
                Your message has been recorded locally for this preview. Once deployed with a backend or form service (like Formspree or Resend), messages will go straight to your inbox.
              </p>
              <button
                className="secondary-btn"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setMessage('');
                  setSubmitted(false);
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="c-name">Your Name</label>
                <input
                  id="c-name"
                  type="text"
                  placeholder="e.g. Amina / David"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="c-email">Email Address</label>
                <input
                  id="c-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="c-topic">Topic</label>
                <select id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option>Feedback &amp; Ideas</option>
                  <option>Fiqh / Scholarly Review</option>
                  <option>Economic Data &amp; Modeling</option>
                  <option>Collaboration / Contribution</option>
                  <option>General Question</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="c-msg">Message</label>
                <textarea
                  id="c-msg"
                  rows="4"
                  placeholder="Share your thoughts, questions, or ideas..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="primary-btn">
                Send Message
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
