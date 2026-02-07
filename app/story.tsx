"use client";
import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { StoryCard } from "./StoryCard";

// Sample story data - each story can have multiple substories
const stories = [
    {
        id: 1,
        substories: [
            {
                id: 1,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
        ],
    },
    {
        id: 2,
        substories: [
            {
                id: 1,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 2,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 3,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 4,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
        ],
    },
    {
        id: 3,
        substories: [
            {
                id: 1,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 2,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 3,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 4,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
        ],
    },
    {
        id: 4,
        substories: [
            {
                id: 1,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 2,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
        ],
    },
    {
        id: 5,
        substories: [
            {
                id: 1,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 2,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 3,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
        ],
    },
    {
        id: 6,
        substories: [
            {
                id: 1,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 2,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 3,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
            {
                id: 4,
                videoUrl:
                    "https://videos.ctfassets.net/7y1g9xrc1u6a/5JgjXtPICQEobAh8Cw8UjY/39502c6ed52abbed8baced0a13e9c0d0/COD-442_Bausparvertraege_angedreht_bekommen_CDU-Renten-Rebell_Reddig_Ist_die_Rente_noch_zu_retten_Podcast_AssetClass_S01E48.webm",
            },
        ],
    },
];

type VisibleStory = {
    story: (typeof stories)[number];
    position: -3 | -2 | -1 | 0 | 1 | 2 | 3;
    startAtLastSubstory?: boolean;
};

export const Story = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [navigationDirection, setNavigationDirection] = useState<"forward" | "backward" | null>(
        null,
    );

    const goNextStory = () => {
        setCurrentIndex((index) => {
            if (index < stories.length - 1) {
                setNavigationDirection("forward");
                return index + 1;
            }
            return index;
        });
    };

    const goPreviousStory = () => {
        setCurrentIndex((index) => {
            if (index > 0) {
                setNavigationDirection("backward");
                return index - 1;
            }
            return index;
        });
    };

    const handleStoryEnded = () => {
        goNextStory();
    };

    const toggleMute = () => {
        setIsMuted((muted) => !muted);
    };

    // Calculate which stories to render and their positions
    const getVisibleStories = () => {
        const visible: VisibleStory[] = [];

        for (let offset = -3; offset <= 3; offset++) {
            const index = currentIndex + offset;
            if (index >= 0 && index < stories.length) {
                visible.push({
                    story: stories[index],
                    position: offset as -3 | -2 | -1 | 0 | 1 | 2 | 3,
                    startAtLastSubstory: offset === 0 && navigationDirection === "backward",
                });
            }
        }

        return visible;
    };

    if (!isOpen) return null;

    return (
        <dialog
            open={isOpen}
            className='
        w-dvw h-dvh
        max-w-none max-h-none
        m-0 p-0
        bg-black
        border-none
      '
        >
            {/* Close button */}
            <div className='absolute top-10 right-10 z-50'>
                <button
                    onClick={onClose}
                    className='text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition'
                    aria-label='Close story viewer'
                    title='Close'
                >
                    <X size={24} weight='bold' />
                </button>
            </div>

            {/* Story carousel container */}
            <div className='flex items-center justify-center h-screen relative'>
                {/* Render all visible story cards */}
                {getVisibleStories().map(({ story, position, startAtLastSubstory }) => (
                    <StoryCard
                        key={story.id}
                        story={story}
                        position={position}
                        isActive={position === 0}
                        isMuted={isMuted}
                        onToggleMute={toggleMute}
                        onEnded={handleStoryEnded}
                        startAtLastSubstory={startAtLastSubstory}
                        onGoPrevious={goPreviousStory}
                        onGoNext={goNextStory}
                        canGoPrevious={currentIndex > 0}
                        canGoNext={currentIndex < stories.length - 1}
                    />
                ))}
            </div>
        </dialog>
    );
};
