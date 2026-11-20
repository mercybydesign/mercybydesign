import React, { useState, useEffect } from 'react';

const INITIAL_IDEAS = [
  {
    id: 'mirath',
    title: 'Islamic Inheritance (Mirath) Wealth-Dispersion Model',
    category: 'Society & Economy',
    desc: 'Simulate how mandatory multi-heir distribution prevents dynastic wealth concentration over 5 generations.',
    votes: 42,
  },
  {
    id: 'alcohol',
    title: 'Prohibition of Alcohol & Gambling Impact',
    category: 'Public Health',
    desc: 'Estimate lives saved, healthcare costs avoided, and household savings gained per country.',
    votes: 36,
  },
  {
    id: 'world-map',
    title: 'Interactive World Map Picker for Zakat',
    category: 'Zakat',
    desc: 'Click any country on a world map to see its Gold Nisab Zakat pool and poverty-elimination timeline.',
    votes: 29,
  },
  {
    id: 'sadaqah-micro',
    title: 'Qard Hasan Micro-Lending Village Sandbox',
    category: 'Finance & Justice',
    desc: 'Watch 100 small-business owners grow with 0% benevolent loans vs. predatory micro-interest.',
    votes: 21,
  },
];

export function IdeasPage() {
  const [ideas, setIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem('almizan_ideas');
      return saved ? JSON.parse(saved) : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  });
  const [votedIds, setVotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('almizan_voted');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('Society & Economy');
  const [ideaDesc, setIdeaDesc] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('almizan_ideas', JSON.stringify(ideas));
      localStorage.setItem('almizan_voted', JSON.stringify(votedIds));
    } catch {
      // ignore storage errors
    }
  }, [ideas, votedIds]);

  const toggleVote = (id) => {
    const alreadyVoted = votedIds.includes(id);
    setVotedIds((prev) =>
      alreadyVoted ? prev.filter((v) => v !== id) : [...prev, id]
    );
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, votes: item.votes + (alreadyVoted ? -1 : 1) }
          : item
      )
    );
  };

  const handleIdeaSubmit = (e) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;
    const newIdea = {
      id: `idea-${Date.now()}`,
      title: ideaTitle.trim(),
      category: ideaCategory,
      desc: ideaDesc.trim() || 'Community-submitted simulator idea.',
      votes: 1,
    };
    setIdeas((prev) => [newIdea, ...prev]);
    setVotedIds((prev) => [...prev, newIdea.id]);
    setIdeaTitle('');
    setIdeaDesc('');
  };

  const sortedIdeas = [...ideas].sort((a, b) => b.votes - a.votes);

  return (
    <div className="about-wrap">
      <section className="about-hero">
        <span className="wisdom-eyebrow">COMMUNITY ROADMAP</span>
        <h2>Ideas &amp; Voting</h2>
        <p className="about-lead">
          Help shape what we build next on MercyByDesign. Upvote the studies you want to see most, or propose a new Islamic wisdom simulator.
        </p>
      </section>

      <div className="ideas-grid">
        <div className="ideas-list">
          {sortedIdeas.map((idea) => {
            const hasVoted = votedIds.includes(idea.id);
            return (
              <div className="idea-card" key={idea.id}>
                <button
                  className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                  onClick={() => toggleVote(idea.id)}
                  aria-label={`Vote for ${idea.title}`}
                >
                  <span className="vote-arrow">▲</span>
                  <strong>{idea.votes}</strong>
                </button>
                <div className="idea-body">
                  <span className="idea-cat">{idea.category}</span>
                  <h4>{idea.title}</h4>
                  <p>{idea.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="about-card">
          <h3>Propose a Simulator Idea</h3>
          <form className="contact-form" onSubmit={handleIdeaSubmit}>
            <div className="field">
              <label htmlFor="i-title">Idea Title</label>
              <input
                id="i-title"
                type="text"
                placeholder="e.g. Hajj Global Unity Visualizer"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="i-cat">Category</label>
              <select id="i-cat" value={ideaCategory} onChange={(e) => setIdeaCategory(e.target.value)}>
                <option>Society &amp; Economy</option>
                <option>Individual Mind &amp; Body</option>
                <option>Family &amp; Community</option>
                <option>Finance &amp; Justice</option>
                <option>Public Health</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="i-desc">How would it help people?</label>
              <textarea
                id="i-desc"
                rows="3"
                placeholder="Briefly describe what the simulation should show..."
                value={ideaDesc}
                onChange={(e) => setIdeaDesc(e.target.value)}
              />
            </div>
            <button type="submit" className="primary-btn">
              Submit Idea
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
