# Contributing to MercyByDesign

Thank you for your interest in contributing to **MercyByDesign** — an open-source, interactive educational platform exploring how Islamic principles benefit individuals, families, communities, and society.

Our goal is to keep every study **transparent, welcoming, well-sourced, and credible** for both Muslims and non-Muslims.

---

## High-Impact Ways to Contribute

1. **Add a Country Dataset (Zakat Study)**
   - Create a new file in `src/data/regions/<country>.js` (copy `indonesia.js` as a template) and register it in `src/data/regions/index.js`.
   - Include primary sources (e.g., central bank wealth surveys, UBS Global Wealth Report, World Bank PPP poverty lines).
   - Ensure tier `share` values sum to `1.0` and run `npm test`.
2. **Fiqh & Economic Peer Review**
   - Spot a Fiqh nuance, formula edge case, or misleading assumption? Open a **Methodology / Fiqh Correction** issue with scholarly or empirical citations.
3. **Translations & Accessibility**
   - Improve keyboard navigation, screen-reader labels, color contrast, or help prepare internationalization (i18n).
4. **Bug Fixes & Visual Polish**
   - Fix responsive layout issues, SVG chart edge cases, or performance bottlenecks.
5. **New Study or Principle Proposals**
   - Propose a new interactive study (e.g., *Salah* spine/posture mobility, *Mirath* inheritance dispersion, prohibition of alcohol/gambling) via the **New Study Proposal** issue template before writing code.
   - **Adding a study to an existing principle** (e.g., a second study under `salah`): create `src/components/<Name>Module.jsx` (including `<MethodologyDrawer />`) and append it to that topic's `studies` array in `src/studies/registry.js`. A study switcher tab bar and deep link (`/<topic>/<studyId>`) appear automatically.
   - **Adding a brand-new principle / category:** append a new topic object to `TOPICS` in `src/studies/registry.js`.

---

## Editorial & Fiqh Governance

- **Open code, curated editorial voice:** Anyone is welcome to inspect, fork, and submit pull requests. Final merge decisions on methodology, Fiqh framing, and editorial tone remain with the project maintainers.
- **Evidence-based & respectful:** All methodology discussions should cite primary sources (Qur'an, authenticated Hadith, recognized Fiqh standards such as AAOIFI, or peer-reviewed economic/scientific literature). Sectarian debates and unsourced claims will be closed.
- **Honest labeling:** Every study must clearly distinguish between a **Data-Backed Simulation** and a **Conceptual Model** via `MethodologyDrawer`.

---

## Local Development

```bash
npm install
npm run dev     # Start local dev server
npm test        # Run simulation unit tests (node --test)
npm run build   # Verify production build
```

### Pull Request Checklist
- [ ] `npm test` passes with zero failures.
- [ ] `npm run build` completes cleanly.
- [ ] Any new data or methodology changes include citations in `MethodologyDrawer`.
- [ ] Tone remains clear, respectful, and accessible to general readers.
