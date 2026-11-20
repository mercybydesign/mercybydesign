import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TawhidModule } from './TawhidModule.jsx';
import { AkhirahModule } from './AkhirahModule.jsx';
import { SalahModule } from './SalahModule.jsx';
import { ZakatModule } from './ZakatModule.jsx';
import { SawmModule } from './SawmModule.jsx';
import { HajjModule } from './HajjModule.jsx';
import { RibaModule } from './RibaModule.jsx';
import { WaqfModule } from './WaqfModule.jsx';
import { CommunityModule } from './CommunityModule.jsx';

const ALL_MODULES = [
  { name: 'TawhidModule', Component: TawhidModule },
  { name: 'AkhirahModule', Component: AkhirahModule },
  { name: 'SalahModule', Component: SalahModule },
  { name: 'ZakatModule', Component: ZakatModule },
  { name: 'SawmModule', Component: SawmModule },
  { name: 'HajjModule', Component: HajjModule },
  { name: 'RibaModule', Component: RibaModule },
  { name: 'WaqfModule', Component: WaqfModule },
  { name: 'CommunityModule', Component: CommunityModule },
];

describe('Interactive Study Modules', () => {
  for (const { name, Component } of ALL_MODULES) {
    it(`renders ${name} and responds to interactive controls`, () => {
      const { container } = render(<Component />);
      expect(container.firstChild).not.toBeNull();

      // Exercise range sliders
      const sliders = container.querySelectorAll('input[type="range"]');
      for (const slider of sliders) {
        const min = Number(slider.getAttribute('min') ?? 0);
        const max = Number(slider.getAttribute('max') ?? 100);
        const mid = Math.round((min + max) / 2);
        fireEvent.change(slider, { target: { value: String(mid) } });
      }

      // Exercise checkboxes
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      for (const cb of checkboxes) {
        fireEvent.click(cb);
      }

      // Exercise select dropdowns
      const selects = container.querySelectorAll('select');
      for (const select of selects) {
        const options = select.querySelectorAll('option');
        if (options.length > 1) {
          fireEvent.change(select, { target: { value: options[1].value } });
        }
      }

      // Exercise MethodologyDrawer toggle if present
      const methBtn = screen.queryByRole('button', { name: /Methodology & Sources/i });
      if (methBtn) {
        fireEvent.click(methBtn);
        expect(methBtn).toHaveAttribute('aria-expanded', 'true');
      }
    });
  }

  it('exercises ZakatModule tabs, region buttons, and presets', () => {
    render(<ZakatModule />);
    const buttons = screen.getAllByRole('button');
    for (const btn of buttons) {
      if (
        ['United States', 'India', 'Indonesia', 'Personal', 'Global', 'Reset'].some((label) =>
          btn.textContent?.includes(label)
        )
      ) {
        fireEvent.click(btn);
      }
    }
    expect(screen.getAllByText(/Zakat/i).length).toBeGreaterThan(0);
  });

  it('exercises RibaModule and WaqfModule preset buttons', () => {
    const { unmount } = render(<RibaModule />);
    for (const btn of screen.getAllByRole('button')) {
      fireEvent.click(btn);
    }
    unmount();

    render(<WaqfModule />);
    for (const btn of screen.getAllByRole('button')) {
      fireEvent.click(btn);
    }
  });
});
