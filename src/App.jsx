import React, { useState, useEffect, useRef } from 'react';
import { TOPICS } from './studies/registry';
import { TopicShell } from './components/TopicShell';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { Logo } from './components/Logo';

const BASE_PREFIX = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

function parseRoute(pathname) {
  const stripped =
    BASE_PREFIX && pathname.startsWith(BASE_PREFIX)
      ? pathname.slice(BASE_PREFIX.length)
      : pathname;
  const segments = stripped.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments.length === 0) return { module: 'home', studyId: null };
  if (segments[0] === 'about') return { module: 'about', studyId: null };

  const topic = TOPICS.find((t) => t.id === segments[0]);
  if (topic) {
    const requestedStudy = segments[1] || null;
    const validStudy = topic.studies.find((s) => s.id === requestedStudy);
    return {
      module: topic.id,
      studyId: validStudy ? validStudy.id : topic.studies[0]?.id || null,
    };
  }
  return { module: 'home', studyId: null };
}

function buildPath(mod, studyId) {
  const withBase = (p) => `${BASE_PREFIX}${p}` || '/';
  if (mod === 'home') return withBase('/');
  if (mod === 'about') return withBase('/about');
  const topic = TOPICS.find((t) => t.id === mod);
  if (!topic) return withBase('/');
  if (studyId && topic.studies.length > 1) {
    return withBase(`${topic.path}/${studyId}`);
  }
  return withBase(topic.path);
}

function getPageTitle(mod, studyId) {
  if (mod === 'about') return 'About — MercyByDesign';
  const topic = TOPICS.find((t) => t.id === mod);
  if (!topic) return 'MercyByDesign — Interactive Studies in Islamic Wisdom';
  const study = topic.studies.find((s) => s.id === studyId);
  if (study && topic.studies.length > 1) {
    return `${topic.num}. ${topic.title}: ${study.title} — MercyByDesign`;
  }
  return `${topic.num}. ${topic.title} — MercyByDesign`;
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [studiesOpen, setStudiesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = (mod, studyId = null) => {
    const topic = TOPICS.find((t) => t.id === mod);
    const resolvedStudyId = topic
      ? studyId || topic.studies[0]?.id || null
      : null;
    const targetPath = buildPath(mod, resolvedStudyId);

    if (window.location.pathname !== targetPath) {
      window.history.pushState(
        { module: mod, studyId: resolvedStudyId },
        '',
        targetPath
      );
    }
    setRoute({ module: mod, studyId: resolvedStudyId });
    setStudiesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
      setStudiesOpen(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = getPageTitle(route.module, route.studyId);
  }, [route]);

  useEffect(() => {
    if (!studiesOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setStudiesOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setStudiesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [studiesOpen]);

  const activeTopic = TOPICS.find((t) => t.id === route.module);

  return (
    <div className="app-shell">
      <header className="site-header">
        <button
          type="button"
          className="brand-trigger"
          onClick={() => navigate('home')}
        >
          <Logo size={30} />
          <span className="brand-wordmark">MercyByDesign</span>
          <span className="brand-sub-tag">Islamic Wisdom Lab</span>
        </button>

        <nav className="site-nav" aria-label="Main navigation">
          <button
            className={`nav-link ${route.module === 'home' ? 'active' : ''}`}
            onClick={() => navigate('home')}
          >
            Overview
          </button>

          <div className="nav-dropdown-wrap" ref={dropdownRef}>
            <button
              className={`nav-link ${activeTopic ? 'active' : ''}`}
              onClick={() => setStudiesOpen((o) => !o)}
              aria-expanded={studiesOpen}
              aria-haspopup="menu"
            >
              {activeTopic ? `Studies: ${activeTopic.title}` : 'Studies'} ▾
            </button>

            {studiesOpen && (
              <div className="nav-dropdown" role="menu">
                {Array.from(new Set(TOPICS.map((t) => t.category))).map((cat) => (
                  <div key={cat} className="dropdown-group">
                    <div className="dropdown-group-label">{cat}</div>
                    {TOPICS.filter((t) => t.category === cat).map((t) => (
                      <button
                        key={t.id}
                        role="menuitem"
                        className={`dropdown-item ${route.module === t.id ? 'active' : ''}`}
                        onClick={() => navigate(t.id)}
                      >
                        <span className="dd-num">{t.num}</span>
                        <span className="dd-body">
                          <strong>
                            {t.title}
                            {t.studies.length > 1 ? ` (${t.studies.length})` : ''}
                          </strong>
                          <small>{t.subtitle || t.scope}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className={`nav-link ${route.module === 'about' ? 'active' : ''}`}
            onClick={() => navigate('about')}
          >
            About
          </button>

          <a
            className="nav-link nav-github"
            href="https://github.com/mercybydesign/mercybydesign"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </nav>
      </header>

      {route.module === 'home' && <HomePage onSelectModule={navigate} />}
      {route.module === 'about' && <AboutPage />}
      {activeTopic && (
        <TopicShell
          topic={activeTopic}
          activeStudyId={route.studyId}
          onSelectStudy={navigate}
        />
      )}
    </div>
  );
}
