"use client";

import { useStoryCard } from "./StoryCardContext";

// ============================================================================
// Progress Bar Segment
// ============================================================================

interface ProgressSegmentProps {
    /** Whether this segment is completed */
    isCompleted: boolean;
    /** Whether this is the current segment */
    isCurrent: boolean;
    /** Progress percentage (0-100) for current segment */
    progress: number;
}

/**
 * Individual progress segment for a substory.
 */
const ProgressSegment = ({ isCompleted, isCurrent, progress }: ProgressSegmentProps) => {
    const currentProgress = isCurrent ? progress : 0;

    return (
        <div
            className={`h-1 grow ${isCompleted ? "bg-white" : "bg-gray-500"} rounded-full overflow-hidden`}
            role='progressbar'
            aria-valuenow={isCompleted ? 100 : currentProgress}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            {!isCompleted && (
                <div
                    className='h-full w-full bg-white rounded-full origin-left transition-transform duration-100'
                    style={{
                        transform: `scaleX(${currentProgress / 100})`,
                    }}
                />
            )}
        </div>
    );
}

// ============================================================================
// Progress Bar
// ============================================================================

export interface ProgressBarProps {
    /** Additional CSS classes */
    className?: string;
}

/**
 * Progress bar showing substory completion.
 * Only renders when the story is active.
 *
 * @example
 * ```tsx
 * <StoryCard.Progress className="mt-4 mx-2" />
 * ```
 */
export const ProgressBar = ({ className = "mt-4 mx-2" }: ProgressBarProps) => {
    const { state } = useStoryCard();
    const { story, currentSubstoryIndex, progress, isActive } = state;

    // Only show for active story
    if (!isActive) return null;

    return (
        <div
            className={`relative flex flex-row gap-3 z-10 ${className}`}
            role='group'
            aria-label='Story progress'
        >
            {story.substories.map((substory, index) => (
                <ProgressSegment
                    key={substory.id}
                    isCompleted={index < currentSubstoryIndex}
                    isCurrent={index === currentSubstoryIndex}
                    progress={progress}
                />
            ))}
        </div>
    );
}
