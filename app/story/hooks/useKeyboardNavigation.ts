"use client";

import { useEffect } from "react";
import type { StoryCardActions, StoryCardMeta } from "../types";

// ============================================================================
// Types
// ============================================================================

interface UseKeyboardNavigationOptions {
    /** Whether keyboard navigation is enabled (only for active story) */
    isEnabled: boolean;
    /** Navigation actions from StoryCard context */
    actions: Pick<StoryCardActions, "goPrevious" | "goNext" | "goPreviousStory" | "goNextStory">;
    /** Navigation availability metadata */
    meta: Pick<StoryCardMeta, "canGoPrevious" | "canGoNext" | "canGoPreviousStory" | "canGoNextStory">;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Handles keyboard navigation for the story viewer.
 *
 * - Left/Right arrows: Navigate between substories (same as nav buttons)
 * - Up/Down arrows: Jump to previous/next story (skip substories)
 *
 * @example
 * ```tsx
 * useKeyboardNavigation({
 *   isEnabled: isActive,
 *   actions: { goPrevious, goNext, goPreviousStory, goNextStory },
 *   meta: { canGoPrevious, canGoNext, canGoPreviousStory, canGoNextStory },
 * });
 * ```
 */
export const useKeyboardNavigation = ({
    isEnabled,
    actions,
    meta,
}: UseKeyboardNavigationOptions): void => {
    useEffect(() => {
        if (!isEnabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input
            const target = event.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
                return;
            }

            switch (event.key) {
                case "ArrowLeft":
                    if (meta.canGoPrevious) {
                        event.preventDefault();
                        actions.goPrevious();
                    }
                    break;

                case "ArrowRight":
                    if (meta.canGoNext) {
                        event.preventDefault();
                        actions.goNext();
                    }
                    break;

                case "ArrowUp":
                    if (meta.canGoPreviousStory) {
                        event.preventDefault();
                        actions.goPreviousStory();
                    }
                    break;

                case "ArrowDown":
                    if (meta.canGoNextStory) {
                        event.preventDefault();
                        actions.goNextStory();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isEnabled, actions, meta]);
};
