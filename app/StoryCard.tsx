"use client";
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SpeakerHigh, SpeakerSlash, CaretLeft, CaretRight } from '@phosphor-icons/react';

type Substory = {
  id: number;
  videoUrl: string;
};

type Story = {
  id: number;
  substories: Substory[];
};

type StoryCardProps = {
  story: Story;
  position: -2 | -1 | 0 | 1 | 2;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onEnded?: () => void;
  onGoNext?: () => void;
  onGoPrevious?: () => void;
  startAtLastSubstory?: boolean;
};

export const StoryCard = ({ story, position, isActive, isMuted, onToggleMute, onEnded, onGoNext, onGoPrevious, startAtLastSubstory }: StoryCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubstoryIndex, setCurrentSubstoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Position-based transforms
  const getTransform = () => {
    const transforms = {
      '-2': 'translateX(-800px) scale(0.7)',
      '-1': 'translateX(-450px) scale(0.7)',
      '0': 'translateX(0) scale(1)',
      '1': 'translateX(450px) scale(0.7)',
      '2': 'translateX(800px) scale(0.7)',
    };
    return transforms[position.toString() as keyof typeof transforms];
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
      video.play();
      setIsPlaying(true);
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

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isActive, onEnded, currentSubstoryIndex, story.substories.length]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (!isActive) return;
    onToggleMute();
  };

  const handleNext = () => {
    if (!isActive) return;

    // Check if there are more substories in current story
    if (currentSubstoryIndex < story.substories.length - 1) {
      // Go to next substory
      setCurrentSubstoryIndex(currentSubstoryIndex + 1);
      setProgress(0);
    } else {
      // Go to next story
      if (onGoNext) {
        onGoNext();
      }
    }
  };

  const handlePrevious = () => {
    if (!isActive) return;

    // Check if there are previous substories in current story
    if (currentSubstoryIndex > 0) {
      // Go to previous substory
      setCurrentSubstoryIndex(currentSubstoryIndex - 1);
      setProgress(0);
    } else {
      // Go to previous story
      if (onGoPrevious) {
        onGoPrevious();
      }
    }
  };

  const isAtFirstSubstory = currentSubstoryIndex === 0;
  const isAtLastSubstory = currentSubstoryIndex === story.substories.length - 1;

  return (
    <div
      className="absolute w-95 h-175 overflow-hidden transition-all duration-700 ease-in-out"
      style={{
        transform: getTransform(),
        zIndex: getZIndex(),
        left: '50%',
        marginLeft: '-11.875rem', // -w-95/2 to center
      }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        key={currentSubstory.id}
        loop={false}
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={currentSubstory.videoUrl}
      />

      {/* Progress bars - only show for active story */}
      {isActive && (
        <div className="relative mt-4 mx-2 flex flex-row gap-3 z-10">
          {story.substories.map((substory, index) => {
            const isCompleted = index < currentSubstoryIndex;
            const isCurrent = index === currentSubstoryIndex;
            const currentProgress = isCurrent ? progress : 0;
            const backgroundColor = isCompleted ? 'white' : 'gray-500';

            return (
              <div key={substory.id} className={`h-1 grow bg-${backgroundColor} rounded-4xl overflow-hidden`}>
                {!isCompleted && (
                  <div
                    className="h-full bg-white rounded-4xl transition-all duration-100"
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
        <div className="absolute top-5 right-4 flex gap-3 z-10">
          <button
            onClick={togglePlayPause}
            className="text-white rounded-full p-2 hover:bg-black/70 transition"
          >
            {isPlaying ? <Pause size={24} weight="regular" /> : <Play size={24} />}
          </button>

          <button
            onClick={handleToggleMute}
            className="text-white rounded-full p-2 hover:bg-black/70 transition"
          >
            {isMuted ? <SpeakerSlash size={24} /> : <SpeakerHigh size={24} />}
          </button>
        </div>
      )}

      {/* Navigation buttons - only show for active story */}
      {isActive && (
        <>
          <button
            onClick={handlePrevious}
            disabled={isAtFirstSubstory && !onGoPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <CaretLeft size={32} weight="bold" />
          </button>

          <button
            onClick={handleNext}
            disabled={isAtLastSubstory && !onGoNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <CaretRight size={32} weight="bold" />
          </button>
        </>
      )}
    </div>
  );
};
