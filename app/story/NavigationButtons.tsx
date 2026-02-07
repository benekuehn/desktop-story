"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useStoryCard } from "./StoryCardContext";

// ============================================================================
// Navigation Button
// ============================================================================

interface NavButtonProps {
    /** Click handler */
    onClick: () => void;
    /** Accessible label */
    ariaLabel: string;
    /** Position relative to card */
    position: "left" | "right";
    /** Button content */
    children: React.ReactNode;
}

/** Navigation button offset from card edge in pixels */
const NAV_BUTTON_OFFSET = 84;

/**
 * Styled navigation button with animation.
 */
const NavButton = ({ onClick, ariaLabel, position, children }: NavButtonProps) => {
    const positionStyle =
        position === "left"
            ? { left: `-${NAV_BUTTON_OFFSET}px` }
            : { right: `-${NAV_BUTTON_OFFSET}px` };

    return (
        <button
            onClick={onClick}
            className='absolute top-1/2 z-10 text-white rounded-full w-8 h-8 flex items-center justify-center animate-nav-button nav-button'
            style={positionStyle}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {children}
        </button>
    );
}

// ============================================================================
// Previous Button
// ============================================================================

export interface PreviousButtonProps {
    /** Icon size in pixels */
    iconSize?: number;
}

/**
 * Navigate to previous substory or story.
 *
 * @example
 * ```tsx
 * <StoryCard.PreviousButton iconSize={16} />
 * ```
 */
export const PreviousButton = ({ iconSize = 16 }: PreviousButtonProps) => {
    const { state, actions, meta } = useStoryCard();
    const { isActive } = state;
    const { canGoPrevious } = meta;

    if (!isActive || !canGoPrevious) return null;

    return (
        <NavButton onClick={actions.goPrevious} ariaLabel='Previous' position='left'>
            <ArrowLeftIcon size={iconSize} weight='bold' />
        </NavButton>
    );
}

// ============================================================================
// Next Button
// ============================================================================

export interface NextButtonProps {
    /** Icon size in pixels */
    iconSize?: number;
}

/**
 * Navigate to next substory or story.
 *
 * @example
 * ```tsx
 * <StoryCard.NextButton iconSize={16} />
 * ```
 */
export const NextButton = ({ iconSize = 16 }: NextButtonProps) => {
    const { state, actions, meta } = useStoryCard();
    const { isActive } = state;
    const { canGoNext } = meta;

    if (!isActive || !canGoNext) return null;

    return (
        <NavButton onClick={actions.goNext} ariaLabel='Next' position='right'>
            <ArrowRightIcon size={iconSize} weight='bold' />
        </NavButton>
    );
}

// ============================================================================
// Navigation Buttons (Combined)
// ============================================================================

export interface NavigationButtonsProps {
    /** Icon size in pixels */
    iconSize?: number;
}

/**
 * Combined previous/next navigation buttons.
 * Only renders for the active story.
 *
 * @example
 * ```tsx
 * <StoryCard.Navigation iconSize={16} />
 * ```
 */
export const NavigationButtons = ({ iconSize = 16 }: NavigationButtonsProps) => {
    return (
        <>
            <PreviousButton iconSize={iconSize} />
            <NextButton iconSize={iconSize} />
        </>
    );
}
