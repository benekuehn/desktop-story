import { useRef, useState, useCallback, useEffect } from "react";

/**
 * Video playback state and controls
 */
export interface VideoPlaybackState {
    /** Whether the video is currently playing */
    isPlaying: boolean;
    /** Current playback progress (0-100) */
    progress: number;
    /** Reference to the video element */
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * Video playback control actions
 */
export interface VideoPlaybackActions {
    /** Play the video */
    play: () => Promise<void>;
    /** Pause the video */
    pause: () => void;
    /** Toggle play/pause state */
    togglePlayPause: () => void;
    /** Set the muted state */
    setMuted: (muted: boolean) => void;
    /** Reset playback to the beginning */
    reset: () => void;
}

/**
 * Options for the useVideoPlayback hook
 */
export interface UseVideoPlaybackOptions {
    /** Whether playback should be active */
    isActive: boolean;
    /** Whether the video should be muted */
    isMuted: boolean;
    /** Callback when video ends */
    onEnded?: () => void;
    /** Callback when progress updates */
    onProgress?: (progress: number) => void;
    /** Unique key for the current video (resets progress when changed) */
    videoKey?: string | number;
}

/**
 * Custom hook for managing video playback state and controls.
 *
 * Encapsulates all video element interactions, progress tracking,
 * and play/pause state management.
 *
 * @example
 * ```tsx
 * const { state, actions } = useVideoPlayback({
 *   isActive: true,
 *   isMuted: false,
 *   onEnded: () => console.log('Video ended'),
 * });
 *
 * return (
 *   <video ref={state.videoRef} />
 *   <button onClick={actions.togglePlayPause}>
 *     {state.isPlaying ? 'Pause' : 'Play'}
 *   </button>
 * );
 * ```
 */
export const useVideoPlayback = ({
    isActive,
    isMuted,
    onEnded,
    onProgress,
    videoKey,
}: UseVideoPlaybackOptions): {
    state: VideoPlaybackState;
    actions: VideoPlaybackActions;
} => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Play video with error handling
    const play = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            await video.play();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        }
    }, []);

    // Pause video
    const pause = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        video.pause();
        setIsPlaying(false);
    }, []);

    // Toggle play/pause
    const togglePlayPause = useCallback(() => {
        const video = videoRef.current;
        if (!video || !isActive) return;

        if (video.paused) {
            play();
        } else {
            pause();
        }
    }, [isActive, play, pause]);

    // Set muted state
    const setMuted = useCallback((muted: boolean) => {
        const video = videoRef.current;
        if (video) {
            video.muted = muted;
        }
    }, []);

    // Reset playback
    const reset = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
        }
        setProgress(0);
    }, []);

    // Reset progress when video key changes (new substory)
    useEffect(() => {
        setProgress(0);
    }, [videoKey]);

    // Auto-play/pause based on isActive
    useEffect(() => {
        if (isActive) {
            play();
        } else {
            pause();
        }
    }, [isActive, play, pause]);

    // Sync mute state with video element
    useEffect(() => {
        setMuted(isMuted);
    }, [isMuted, setMuted]);

    // Track progress and handle video end
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (!Number.isFinite(video.duration) || video.duration <= 0) return;
            const percentage = (video.currentTime / video.duration) * 100;
            setProgress(percentage);
            onProgress?.(percentage);
        };

        const handleEnded = () => {
            if (isActive) {
                onEnded?.();
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleEnded);
        };
    }, [isActive, onEnded, onProgress]);

    return {
        state: {
            isPlaying,
            progress,
            videoRef,
        },
        actions: {
            play,
            pause,
            togglePlayPause,
            setMuted,
            reset,
        },
    };
}
