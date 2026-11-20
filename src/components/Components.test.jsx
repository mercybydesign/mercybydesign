import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from './HomePage.jsx';
import { AboutPage } from './AboutPage.jsx';
import { ArticleView } from './ArticleView.jsx';
import { MethodologyDrawer } from './MethodologyDrawer.jsx';
import { PersonalZakat } from './PersonalZakat.jsx';
import { WisdomBanner } from './WisdomBanner.jsx';
import { TopicShell } from './TopicShell.jsx';
import { Logo } from './Logo.jsx';
import { TOPICS } from '../studies/registry.js';

describe('Shared UI Components', () => {
  it('renders Logo with custom size', () => {
    const { container } = render(<Logo size={40} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('renders AboutPage', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Why I Built MercyByDesign/i })).toBeInTheDocument();
  });

  it('renders MethodologyDrawer and toggles assumptions & sources', () => {
    render(
      <MethodologyDrawer
        modelType="empirical"
        summary="Test summary"
        assumptions={['Assumption A']}
        sources={[{ label: 'Source 1', detail: 'Detail 1' }]}
      />
    );
    expect(screen.getByText('Data-Backed Simulation')).toBeInTheDocument();
    expect(screen.queryByText('Assumption A')).not.toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Methodology & Sources/i });
    fireEvent.click(btn);
    expect(screen.getByText('Assumption A')).toBeInTheDocument();
    expect(screen.getByText(/Detail 1/)).toBeInTheDocument();

    fireEvent.click(btn);
    expect(screen.queryByText('Assumption A')).not.toBeInTheDocument();
  });

  it('renders ArticleView with full content and handles null article', () => {
    const { container } = render(<ArticleView article={null} />);
    expect(container).toBeEmptyDOMElement();

    render(
      <ArticleView
        article={{
          title: 'Test Research Brief',
          author: 'Dr. Researcher',
          date: '2026-11-19',
          lead: 'A short lead paragraph.',
          keyFindings: [{ title: 'Finding 1', detail: 'Key detail.' }],
          sections: [{ heading: 'Section 1', paragraphs: ['Body text.'] }],
        }}
      />
    );
    expect(screen.getByText('Test Research Brief')).toBeInTheDocument();
    expect(screen.getByText('Dr. Researcher')).toBeInTheDocument();
    expect(screen.getByText('Finding 1')).toBeInTheDocument();
    expect(screen.getByText('Body text.')).toBeInTheDocument();
  });

  it('renders PersonalZakat and recalculates below and above Nisab', () => {
    render(<PersonalZakat nisab={8000} />);
    expect(screen.getByText('What Does My Zakat Do?')).toBeInTheDocument();

    const sliders = screen.getAllByRole('slider');
    // Default savings = 25000 (above Nisab 8000) -> 2.5% = $625
    expect(sliders.length).toBe(2);

    // Set below Nisab
    fireEvent.change(sliders[0], { target: { value: '4000' } });
    // Set community size
    fireEvent.change(sliders[1], { target: { value: '5000' } });
    // Set back above Nisab
    fireEvent.change(sliders[0], { target: { value: '100000' } });
    expect(screen.getByText('$100.0K')).toBeInTheDocument();
  });

  it('renders WisdomBanner and toggles guide visibility', () => {
    render(<WisdomBanner />);
    expect(screen.getByText(/THE WISDOM OF 2\.5%/i)).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: /Hide Guide/i });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /Show Guide/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Show Guide/i }));
    expect(screen.getByText(/Taxes Idle Wealth/i)).toBeInTheDocument();
  });

  it('renders HomePage, filters by category, and invokes onSelectModule', () => {
    const onSelectModule = vi.fn();
    render(<HomePage onSelectModule={onSelectModule} />);

    // Click category filter buttons if present
    const buttons = screen.getAllByRole('button');
    for (const btn of buttons) {
      if (['All', 'Belief', 'Individual', 'Economy & Finance', 'Community & Society'].some((c) => btn.textContent?.includes(c))) {
        fireEvent.click(btn);
      }
    }

    // Click a topic card / launch button
    const zakatButtons = screen.getAllByRole('button', { name: /Zakat/i });
    fireEvent.click(zakatButtons[0]);
    expect(onSelectModule).toHaveBeenCalled();
  });

  it('renders TopicShell for a topic with multiple studies and allows switching', () => {
    const onSelectStudy = vi.fn();
    const DummyA = () => <div>Study A Content</div>;
    const DummyB = () => <div>Study B Content</div>;
    const mockTopic = {
      ...TOPICS[0],
      studies: [
        { id: 'study-a', title: 'Study A', component: DummyA },
        { id: 'study-b', title: 'Study B', component: DummyB },
      ],
    };

    render(
      <TopicShell
        topic={mockTopic}
        activeStudyId="study-a"
        onSelectStudy={onSelectStudy}
      />
    );
    expect(screen.getByText('Study A Content')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /Study B/i }));
    expect(onSelectStudy).toHaveBeenCalledWith(mockTopic.id, 'study-b');
  });
});
