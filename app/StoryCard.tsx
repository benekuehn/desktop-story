"use client";
import { useEffect, useRef, useState } from "react";
import {
    Play,
    Pause,
    SpeakerHigh,
    SpeakerSlash,
    ArrowLeftIcon,
    ArrowRightIcon,
} from "@phosphor-icons/react";
import { type Story } from "./storiesData";

type StoryCardProps = {
    story: Story;
    position: -3 | -2 | -1 | 0 | 1 | 2 | 3;
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
};

export const StoryCard = ({
    story,
    position,
    isActive,
    isMuted,
    onToggleMute,
    onEnded,
    startAtLastSubstory,
    onGoPrevious,
    onGoNext,
    canGoPrevious = true,
    canGoNext = true,
    onCardClick,
}: StoryCardProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSubstoryIndex, setCurrentSubstoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPressed, setIsPressed] = useState(false);

    // Position-based transforms
    const getTransform = () => {
        const transforms = {
            "-3": "translateX(-996px) scale(0.6)",
            "-2": "translateX(-722px) scale(0.6)",
            "-1": "translateX(-448px) scale(0.6)",
            "0": "translateX(0) scale(1)",
            "1": "translateX(448px) scale(0.6)",
            "2": "translateX(722px) scale(0.6)",
            "3": "translateX(996px) scale(0.6)",
        };
        const baseTransform = transforms[position.toString() as keyof typeof transforms];

        // Apply pressed scale effect for adjacent cards
        if (!isActive && isPressed && (position === -1 || position === 1)) {
            return baseTransform.replace("scale(0.6)", "scale(0.45)");
        }
        return baseTransform;
    };

    // Handle card click for non-active stories
    const handleCardMouseDown = () => {
        if (isActive || (position !== -1 && position !== 1)) return;
        setIsPressed(true);
    };

    const handleCardMouseUp = () => {
        if (!isPressed) return;
        setIsPressed(false);
        if (onCardClick) {
            onCardClick();
        }
    };

    const handleCardMouseLeave = () => {
        setIsPressed(false);
    };

    const getZIndex = () => {
        return 3 - Math.abs(position);
    };

    const currentSubstory = story.substories[currentSubstoryIndex];

    // Reset substory index when story changes or becomes inactive
    useEffect(() => {
        if (!isActive) {
            // When becoming inactive, reset to appropriate substory
            if (startAtLastSubstory) {
                setCurrentSubstoryIndex(story.substories.length - 1);
            } else {
                setCurrentSubstoryIndex(0);
            }
            setProgress(0);
        }
    }, [isActive, story.id, startAtLastSubstory, story.substories.length]);

    // Initialize to last substory if navigating backwards
    useEffect(() => {
        if (isActive && startAtLastSubstory) {
            setCurrentSubstoryIndex(story.substories.length - 1);
        }
    }, [isActive, startAtLastSubstory, story.substories.length]);

    // Handle video playback based on isActive
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            const playPromise = video.play();
            if (playPromise) {
                playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, [isActive, currentSubstoryIndex]);

    // Sync mute state with video element
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = isMuted;
        }
    }, [isMuted]);

    // Track video progress and handle substory/story transitions
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (!Number.isFinite(video.duration) || video.duration <= 0) {
                return;
            }
            const percentage = (video.currentTime / video.duration) * 100;
            setProgress(percentage);
        };

        const handleEnded = () => {
            if (!isActive) return;

            // Check if there are more substories in this story
            if (currentSubstoryIndex < story.substories.length - 1) {
                // Move to next substory
                setCurrentSubstoryIndex(currentSubstoryIndex + 1);
                setProgress(0);
            } else {
                // Last substory ended, move to next story
                if (onEnded) {
                    onEnded();
                }
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleEnded);
        };
    }, [isActive, onEnded, currentSubstoryIndex, story.substories.length]);

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video || !isActive) return;

        if (video.paused) {
            const playPromise = video.play();
            if (playPromise) {
                playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleToggleMute = () => {
        if (!isActive) return;
        onToggleMute();
    };

    const handlePrevious = () => {
        if (!isActive) return;
        if (currentSubstoryIndex > 0) {
            // Go to previous substory
            setCurrentSubstoryIndex(currentSubstoryIndex - 1);
            setProgress(0);
        } else if (onGoPrevious) {
            // Go to previous story
            onGoPrevious();
        }
    };

    const handleNext = () => {
        if (!isActive) return;
        if (currentSubstoryIndex < story.substories.length - 1) {
            // Go to next substory
            setCurrentSubstoryIndex(currentSubstoryIndex + 1);
            setProgress(0);
        } else if (onGoNext) {
            // Go to next story
            onGoNext();
        }
    };

    // Show previous button if there's a previous substory OR a previous story
    const showPreviousButton = currentSubstoryIndex > 0 || canGoPrevious;
    // Show next button if there's a next substory OR a next story
    const showNextButton = currentSubstoryIndex < story.substories.length - 1 || canGoNext;

    const isClickable = !isActive && (position === -1 || position === 1);

    return (
        <div
            className={`absolute w-[390px] h-[43.75rem] transition-all duration-700 ease-in-out ${isClickable ? "cursor-pointer" : ""}`}
            style={{
                transform: getTransform(),
                zIndex: getZIndex(),
                left: "50%",
                marginLeft: "-195px",
            }}
            onMouseDown={handleCardMouseDown}
            onMouseUp={handleCardMouseUp}
            onMouseLeave={handleCardMouseLeave}
            onTouchStart={handleCardMouseDown}
            onTouchEnd={handleCardMouseUp}
        >
            {/* Navigation buttons - attached to the card, scale with it */}
            {isActive && showPreviousButton && (
                <button
                    onClick={handlePrevious}
                    className='absolute top-1/2 z-10 text-white rounded-full w-8 h-8 flex items-center justify-center animate-nav-button nav-button'
                    style={{ left: "-84px" }}
                    aria-label='Previous'
                    title='Previous'
                >
                    <ArrowLeftIcon size={16} weight='bold' />
                </button>
            )}

            {isActive && showNextButton && (
                <button
                    onClick={handleNext}
                    className='absolute top-1/2 z-10 text-white rounded-full w-8 h-8 flex items-center justify-center animate-nav-button nav-button'
                    style={{ right: "-84px" }}
                    aria-label='Next'
                    title='Next'
                >
                    <ArrowRightIcon size={16} weight='bold' />
                </button>
            )}

            {/* Inner container with overflow hidden for video content */}
            <div className='relative w-full h-full overflow-hidden'>
                {/* Video background */}
                <video
                    ref={videoRef}
                    key={currentSubstory.id}
                    loop={false}
                    muted={isMuted}
                    playsInline
                    className='absolute inset-0 w-full h-full object-cover'
                    src={currentSubstory.videoUrl}
                />

                {/* Clickable overlay for play/pause - only for active story */}
                {isActive && (
                    <div
                        className='absolute inset-0 z-[2] cursor-pointer'
                        onClick={togglePlayPause}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                        role='button'
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                                e.preventDefault();
                                togglePlayPause();
                            }
                        }}
                    />
                )}

                {/* Dark overlay for non-active stories */}
                {!isActive && (
                    <div
                        className='absolute inset-0 z-[1] pointer-events-none'
                        style={{
                            background: "var(--background-backdrop, rgba(16, 17, 18, 0.4))",
                        }}
                    />
                )}

                {/* Gradient overlays - only show for active story */}
                {isActive && (
                    <>
                        <div
                            className='absolute top-0 left-0 right-0 h-20 z-[1] pointer-events-none'
                            style={{
                                background:
                                    "linear-gradient(0deg, rgba(16, 17, 18, 0) 5.8%, var(--story-background) 65.63%)",
                            }}
                        />
                        <div
                            className='absolute bottom-0 left-0 right-0 h-20 z-[1] pointer-events-none'
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(16, 17, 18, 0) 5.8%, var(--story-background) 65.63%)",
                            }}
                        />
                    </>
                )}

                {/* Progress bars - only show for active story */}
                {isActive && (
                    <div className='relative mt-4 mx-2 flex flex-row gap-3 z-10'>
                        {story.substories.map((substory, index) => {
                            const isCompleted = index < currentSubstoryIndex;
                            const isCurrent = index === currentSubstoryIndex;
                            const currentProgress = isCurrent ? progress : 0;

                            return (
                                <div
                                    key={substory.id}
                                    className={`h-1 grow ${isCompleted ? "bg-white" : "bg-gray-500"} rounded-full overflow-hidden`}
                                >
                                    {!isCompleted && (
                                        <div
                                            className='h-full bg-white rounded-full transition-all duration-100'
                                            style={{ width: `${currentProgress}%` }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Video controls - only show for active story */}
                {isActive && (
                    <div className='absolute top-5 right-4 flex gap-3 z-10'>
                        <button
                            onClick={togglePlayPause}
                            className='text-white rounded-full p-2 hover:bg-black/70 transition'
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause size={24} weight='regular' /> : <Play size={24} />}
                        </button>

                        <button
                            onClick={handleToggleMute}
                            className='text-white rounded-full p-2 hover:bg-black/70 transition'
                            aria-label={isMuted ? "Unmute video" : "Mute video"}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <SpeakerSlash size={24} /> : <SpeakerHigh size={24} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
