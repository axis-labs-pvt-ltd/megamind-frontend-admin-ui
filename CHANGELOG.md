```
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Global Animations**: Implemented a comprehensive animation system using Tailwind CSS.
  - Added custom keyframes: `fadeIn`, `slideUp`, `slideDown`, `slideRight`, `scaleIn`.
  - Added utility classes: `animate-slide-up`, `animation-delay-100`, etc.
- **Sidebar**: Added smooth hover effects, brand scaling, and navigation item transitions.
- **Page Transitions**: Implemented global page entrance animations.
- **Dashboard**: Added staggered entrance animations for welcome section, stats grid, and charts.
- **Lists & Tables**: Implemented cascading row animations for Tests, Questions, Subjects, and Analytics pages.
- **Components**:
  - `Button`: Added active scale and disabled states.
  - `TestCard`: Enhanced hover lift and shadow effects.
  - `Badge`: Added interactive states and `onClick` support.
  - `Input`: Added transition effects and keyboard event support.
- **Create Test Page**: Added staggered animations for form sections.
- **Analytics Page**: Added staggered animations for overview cards and performance lists.

### Fixed
- Fixed TypeScript errors in `QuestionsPage` and `Input` component.
- Improved prop types for `Button` and `Badge` components.
```
