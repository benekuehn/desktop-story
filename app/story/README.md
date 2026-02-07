# Story Components

A polished, library-quality story viewer component for React 19+.

## Features

- **Compound Component API** - Flexible composition with `StoryCard.Provider`, `StoryCard.Frame`, etc.
- **Performance Optimized** - Memoized calculations, minimal effects, event-driven state
- **Accessibility** - ARIA labels, keyboard navigation, focus management
- **TypeScript** - Full type safety with comprehensive JSDoc documentation

## Installation

These components are designed for internal use. Import from the `story` module:

```tsx
import { StoryCard, StoryViewer } from "@/app/story";
```

## Quick Start

### Simple Usage

```tsx
import { StoryCard } from "./story";

<StoryCard
    story={storyData}
    position={0}
    isActive={true}
    isMuted={false}
    onToggleMute={() => setMuted((m) => !m)}
    onEnded={() => goNext()}
/>;
```

### Custom Layout (Compound API)

```tsx
import { StoryCard } from "./story";

<StoryCard.Provider
    story={storyData}
    position={0}
    isActive={true}
    isMuted={false}
    onToggleMute={toggleMute}
>
    <StoryCard.Frame>
        <StoryCard.Video />
        <StoryCard.ClickOverlay />
        <StoryCard.InactiveOverlay />
        <StoryCard.GradientOverlays />
        <StoryCard.Progress className='mt-4 mx-2' />
        <StoryCard.Controls className='absolute top-6 right-3' />
        {/* Add your custom content here */}
    </StoryCard.Frame>
</StoryCard.Provider>;
```

## Components

### StoryCard

The main compound component with all subcomponents attached.

| Subcomponent                 | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `StoryCard.Provider`         | Context provider with state management           |
| `StoryCard.Frame`            | Main container with positioning and interactions |
| `StoryCard.Video`            | Video player element                             |
| `StoryCard.ClickOverlay`     | Invisible overlay for play/pause on click        |
| `StoryCard.InactiveOverlay`  | Dark overlay for inactive cards                  |
| `StoryCard.GradientOverlays` | Top/bottom gradients for active cards            |
| `StoryCard.Progress`         | Progress bar for substories                      |
| `StoryCard.Controls`         | Video controls (play/pause + mute)               |
| `StoryCard.PlayPauseButton`  | Play/pause button only                           |
| `StoryCard.MuteButton`       | Mute button only                                 |
| `StoryCard.Navigation`       | Prev/next navigation buttons                     |
| `StoryCard.PreviousButton`   | Previous button only                             |
| `StoryCard.NextButton`       | Next button only                                 |
| `StoryCard.DefaultLayout`    | Pre-composed default layout                      |

### StoryViewer

Full-screen story viewer with carousel navigation.

```tsx
import { StoryViewer } from "./StoryViewer";

<StoryViewer isOpen={isOpen} onClose={() => setOpen(false)} />;
```

## Hooks

### useVideoPlayback

Custom hook for managing video playback state and controls.

```tsx
import { useVideoPlayback } from "./story/hooks";

const { state, actions } = useVideoPlayback({
    isActive: true,
    isMuted: false,
    onEnded: () => console.log("Video ended"),
});

// state: { isPlaying, progress, videoRef }
// actions: { play, pause, togglePlayPause, setMuted, reset }
```

### useStoryCard

Access StoryCard context in custom subcomponents.

```tsx
import { useStoryCard } from "./story";

function CustomComponent() {
    const { state, actions, meta } = useStoryCard();
    // ...
}
```

## Types

```tsx
// Position in carousel (-3 to 3, where 0 is active)
type StoryCardPosition = -3 | -2 | -1 | 0 | 1 | 2 | 3;

// Story data structure
interface Story {
    id: number;
    substories: Substory[];
}

interface Substory {
    id: number;
    videoUrl: string;
}

// Props for StoryCard
interface StoryCardProps {
    story: Story;
    position: StoryCardPosition;
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    onEnded?: () => void;
    startAtLastSubstory?: boolean;
    onGoPrevious?: () => void;
    onGoNext?: () => void;
    canGoPrevious?: boolean;
    canGoNext?: boolean;
    onCardClick?: () => void;
}
```

## Architecture

```
story/
├── index.ts              # Public exports
├── types.ts              # TypeScript types and constants
├── StoryCard.tsx         # Main compound component
├── StoryCardContext.tsx  # Context provider and hook
├── ProgressBar.tsx       # Progress bar component
├── VideoControls.tsx     # Play/pause and mute buttons
├── NavigationButtons.tsx # Prev/next navigation
└── hooks/
    ├── index.ts
    └── useVideoPlayback.ts  # Video playback hook
```

## Performance Considerations

1. **Memoized Calculations** - `visibleStories`, navigation state computed once
2. **Stable Callbacks** - All handlers wrapped in `useCallback`
3. **Minimal Effects** - Side effects only for video element interactions
4. **Event-Driven State** - Video progress tracked via events, not polling
5. **Context Splitting** - Separate state/actions/meta to minimize re-renders

## Accessibility

- `aria-label` on all interactive elements
- `role="progressbar"` with proper ARIA attributes
- Keyboard support (`Space`/`Enter` for play/pause)
- Focus management for modal dialog
