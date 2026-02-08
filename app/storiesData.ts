export type Substory = {
    id: number;
    videoUrl: string;
};

export type Story = {
    id: number;
    substories: Substory[];
};

export const videoStories: Story[] = [
    {
        id: 1,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/videos/bangkok/1.mov",
            },
        ],
    },
    {
        id: 2,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/videos/basketball/1.mov",
            },
            {
                id: 2,
                videoUrl: "/stories/videos/basketball/2.mov",
            },
            {
                id: 3,
                videoUrl: "/stories/videos/basketball/3.mov",
            },
            {
                id: 4,
                videoUrl: "/stories/videos/basketball/4.mov",
            },
        ],
    },
    {
        id: 3,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/videos/lake/1.webm",
            },
        ],
    },
    {
        id: 4,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/videos/sailing/1.mov",
            },
            {
                id: 2,
                videoUrl: "/stories/videos/sailing/2.mov",
            },
            {
                id: 3,
                videoUrl: "/stories/videos/sailing/3.mov",
            },
        ],
    },
    {
        id: 5,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/videos/ski/1.webm",
            },
            {
                id: 2,
                videoUrl: "/stories/videos/ski/2.webm",
            },
            {
                id: 3,
                videoUrl: "/stories/videos/ski/3.mov",
            },
        ],
    },
    {
        id: 6,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/videos/waterfall/1.webm",
            },
            {
                id: 2,
                videoUrl: "/stories/videos/waterfall/2.mov",
            },
        ],
    },
];
