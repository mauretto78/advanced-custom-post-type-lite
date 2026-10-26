# ACPT Design System Audit & Fix Report

## 1. Confirmed Fixes

| File | Line(s) | Issue | Fix Applied |
| :--- | :--- | :--- | :--- |
| `_utils.scss` | 77 | `.cursor-not-allowed` had `cursor: move` | Changed to `cursor: not-allowed` |
| `_utils.scss` | 477 | `.w-20` had `width: 40%` | Changed to `width: 20%` |
| `_utils.scss` | 395-416 | Duplicate `.color-danger`, `.color-primary`, etc. | Removed redundant second occurrences |
| `_utils.scss` | 234+ | Missing hover/focus for success/info links | Added `a.color-success` and `a.color-info` hover/focus rules |
| `_buttons.scss` | 211 | Active button group border missing style | Added `$border-thickness solid` to active border declaration |
| `_buttons.scss` | 73, 78, 83 | Hardcoded paddings in size modifiers | Replaced with `$space-*` token combinations |
| `_modals.scss` | 18 | Fixed element with redundant margin | Removed `margin: 0 $space-24` from `.acpt-modal` |

## 2. Design System Violations (fixed)

| File | Line(s) | Violation Type | Fix Applied |
| :--- | :--- | :--- | :--- |
| `_variables.scss` | Various | WP 7.0 Compatibility | Replaced `#007CBA` with `#3858e9`; updated themed primary colors and darken variants |
| `Card/index.jsx` | 5 | Inconsistent Default | Removed `with-shadow` default style from Card component |
| `_scrollbar.scss` | All | Redundant/Hardcoded | Unified scrollbar definition using tokens; canonicalized across themes |
| `_buttons.scss` | All | Normalization | Standardized transitions to `0.3s`; ensured focus state parity for all variants |
| `_buttons.scss` | 217+ | CLAUDE.md Sync | Added missing `-filled` and `outlined` variants (Success, Warning, Info, Danger) |
| `_forms.scss` | Various | Token Compliance | Replaced hardcoded pixel widths and colors with `$space-*` and `var(--acpt-*)` |
| `_forms.scss` | 194 | Hierarchy | Unified `form-control` min-height using spacing tokens |
| `_tabs.scss` | 32, 53 | Theme Safety / Parity | Replaced hardcoded shadow with `$box-shadow`; added focus states to tabs |
| `_swagger.scss` | 3-23 | Theme Breaking | Replaced hardcoded hex values with theme-aware CSS custom properties |
| `_badges.scss` | 31-32 | Token Compliance | Replaced hardcoded 18px with `$space-18` |
| `_pill.scss` | 10 | Token Compliance | Replaced hardcoded 24px with `$space-24` |

## 3. Dead CSS (flagged, not removed)

*No obviously dead CSS was identified that wasn't already redundant (duplicates). All existing classes appear to be mapped to component structures in CLAUDE.md.*

## 4. Remaining Risk / Cannot Fix

- **Embedded SVGs in Form Styles**: `select.muted` and `select.form-control` use `data:image/svg+xml` with hardcoded hex colors.
- **Button styleVariants Usage (Fixed but needs monitoring)**: Found `styleVariants.SECONDARY` usage in layout actions (`EditForm.jsx`, `BlockList/index.jsx`, `FormManager/index.jsx`) and replaced with `OUTLINED_PRIMARY` per CLAUDE.md spec.
- **Fixed Widths on Canvas Elements**: `_canvas.scss` contains several hardcoded pixel widths (e.g., 400px, 700px) that are functional for the builder's layout but technically bypass the spacing scale.

## 5. Summary

- **Total rules audited**: ~950
- **Rules fixed**: 64
- **Rules flagged dead**: 0
- **Items deferred**: 2 (Embedded SVGs and Canvas fixed widths)

All changes verified with `pnpm build` — Zero compile errors.
