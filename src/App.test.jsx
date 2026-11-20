import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders HomePage at root route and sets document title', () => {
    render(<App />);
    expect(screen.getByText('MercyByDesign')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveClass('active');
    expect(document.title).toContain('MercyByDesign');
  });

  it('navigates to About page via header nav and updates URL', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'About' }));
    expect(window.location.pathname).toBe('/about');
    expect(document.title).toBe('About — MercyByDesign');
    expect(screen.getByRole('button', { name: 'About' })).toHaveClass('active');
  });

  it('opens Studies dropdown, closes on Escape and outside click, and navigates to a topic', async () => {
    render(<App />);
    const studiesBtn = screen.getByRole('button', { name: /Studies/i });

    // Open and close with Escape
    fireEvent.click(studiesBtn);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Open and close with outside click
    fireEvent.click(studiesBtn);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Open and select Zakat
    fireEvent.click(studiesBtn);
    const zakatItem = screen.getByRole('menuitem', { name: /Zakat/i });
    fireEvent.click(zakatItem);

    expect(window.location.pathname).toBe('/zakat');
    expect(document.title).toContain('Zakat');
    await waitFor(() => {
      expect(screen.getByText(/Studies: Zakat/i)).toBeInTheDocument();
    });
  });

  it('falls back to HomePage on unknown route and responds to popstate', () => {
    window.history.pushState({}, '', '/unknown-route');
    render(<App />);
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveClass('active');

    window.history.pushState({}, '', '/about');
    fireEvent(window, new PopStateEvent('popstate'));
    expect(screen.getByRole('button', { name: 'About' })).toHaveClass('active');

    // Click brand trigger to return home
    fireEvent.click(screen.getByText('MercyByDesign'));
    expect(window.location.pathname).toBe('/');
  });
});
