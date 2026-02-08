import type { Substory, Story } from "../storiesData";

// ============================================================================
// Position Types
// ============================================================================

/**
 * Valid positions for a story card in the carousel.
 * - Negative values: cards to the left of active
 * - Zero: the active card
 * - Positive values: cards to the right of active
 */
export type StoryCardPosition = -3 | -2 | -1 | 0 | 1 | 2 | 3;

// ============================================================================
// Story Card Props
// ============================================================================

/**
 * Configuration for story card navigation callbacks.
 */
export interface StoryCardNavigationProps {
    /** Callback to navigate to the previous story */
    onGoPrevious?: () => void;
    /** Callback to navigate to the next story */
    onGoNext?: () => void;
    /** Whether navigation to previous story is available */
    canGoPrevious?: boolean;
    /** Whether navigation to next story is available */
    canGoNext?: boolean;
}

/**
 * Configuration for audio controls.
 */
export interface StoryCardAudioProps {
    /** Whether the video audio is muted */
    isMuted: boolean;
    /** Callback to toggle mute state */
    onToggleMute: () => void;
}

/**
 * Props for the StoryCard component.
 *
 * @example
 * ```tsx
 * <StoryCard
 *   story={storyData}
 *   position={0}
 *   isActive={true}
 *   isMuted={false}
 *   onToggleMute={() => setMuted(m => !m)}
 *   onEnded={() => goNextStory()}
 * />
 * ```
 */
export interface StoryCardProps extends StoryCardNavigationProps, StoryCardAudioProps {
    /** The story data containing substories */
    story: Story;
    /** Position in the carousel (-3 to 3, where 0 is active) */
    position: StoryCardPosition;
    /** Whether this card is the active/focused story */
    isActive: boolean;
    /** Callback when the last substory ends */
    onEnded?: () => void;
    /** Whether to start at the last substory (for backward navigation) */
    startAtLastSubstory?: boolean;
    /** Callback when an inactive adjacent card is clicked */
    onCardClick?: () => void;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * State available through the StoryCard context.
 */
export interface StoryCardState {
    /** The story data */
    story: Story;
    /** Current substory being displayed */
    currentSubstory: Substory;
    /** Index of the current substory */
    currentSubstoryIndex: number;
    /** Position in the carousel */
    position: StoryCardPosition;
    /** Whether this is the active story */
    isActive: boolean;
    /** Whether the video is playing */
    isPlaying: boolean;
    /** Whether the video is muted */
    isMuted: boolean;
    /** Current playback progress (0-100) */
    progress: number;
    /** Whether the card is being hovered */
    isHovered: boolean;
    /** Whether the card is being pressed (for click animation) */
    isPressed: boolean;
    /** Reference to the video element */
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * Actions available through the StoryCard context.
 */
export interface StoryCardActions {
    /** Toggle video play/pause */
    togglePlayPause: () => void;
    /** Toggle mute state */
    toggleMute: () => void;
    /** Go to previous substory or story */
    goPrevious: () => void;
    /** Go to next substory or story */
    goNext: () => void;
    /** Jump to previous story (skip substories) */
    goPreviousStory: () => void;
    /** Jump to next story (skip substories) */
    goNextStory: () => void;
    /** Set hover state */
    setHovered: (hovered: boolean) => void;
    /** Set pressed state */
    setPressed: (pressed: boolean) => void;
}

/**
 * Metadata about navigation availability.
 */
export interface StoryCardMeta {
    /** Whether there's a previous substory or story */
    canGoPrevious: boolean;
    /** Whether there's a next substory or story */
    canGoNext: boolean;
    /** Whether there's a previous story (story-level, ignoring substories) */
    canGoPreviousStory: boolean;
    /** Whether there's a next story (story-level, ignoring substories) */
    canGoNextStory: boolean;
    /** Whether the card is clickable (adjacent to active) */
    isClickable: boolean;
    /** Computed z-index based on position */
    zIndex: number;
    /** Computed CSS transform based on position */
    transform: string;
}

/**
 * Full context value for the StoryCard.
 */
export interface StoryCardContextValue {
    state: StoryCardState;
    actions: StoryCardActions;
    meta: StoryCardMeta;
}

// ============================================================================
// Style Constants
// ============================================================================

/**
 * Position-based transforms for the carousel effect.
 */
export const POSITION_TRANSFORMS: Record<StoryCardPosition, string> = {
    "-3": "translateX(-996px) scale(0.6)",
    "-2": "translateX(-722px) scale(0.6)",
    "-1": "translateX(-448px) scale(0.6)",
    "0": "translateX(0) scale(1)",
    "1": "translateX(448px) scale(0.6)",
    "2": "translateX(722px) scale(0.6)",
    "3": "translateX(996px) scale(0.6)",
};

/**
 * Scale applied when pressing an adjacent card.
 */
export const PRESSED_SCALE = "scale(0.45)";

/**
 * Card dimensions.
 */
export const CARD_DIMENSIONS = {
    width: 390,
    height: 700, // 43.75rem = 700px
} as const;

/**
 * Navigation button offset from card edge.
 */
export const NAV_BUTTON_OFFSET = 84;
