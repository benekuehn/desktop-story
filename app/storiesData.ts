export type Substory = {
    id: number;
    videoUrl: string;
};

export type Story = {
    id: number;
    substories: Substory[];
};

export const stories: Story[] = [
    {
        id: 1,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/bangkok/1.mov",
            },
        ],
    },
    {
        id: 2,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/basketball/1.mov",
            },
            {
                id: 2,
                videoUrl: "/stories/basketball/2.mov",
            },
            {
                id: 3,
                videoUrl: "/stories/basketball/3.mov",
            },
            {
                id: 4,
                videoUrl: "/stories/basketball/4.mov",
            },
        ],
    },
    {
        id: 3,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/lake/1.webm",
            },
        ],
    },
    {
        id: 4,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/sailing/1.mov",
            },
            {
                id: 2,
                videoUrl: "/stories/sailing/2.mov",
            },
            {
                id: 3,
                videoUrl: "/stories/sailing/3.mov",
            },
        ],
    },
    {
        id: 5,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/ski/1.webm",
            },
            {
                id: 2,
                videoUrl: "/stories/ski/2.webm",
            },
            {
                id: 3,
                videoUrl: "/stories/ski/3.mov",
            },
        ],
    },
    {
        id: 6,
        substories: [
            {
                id: 1,
                videoUrl: "/stories/waterfall/1.webm",
            },
            {
                id: 2,
                videoUrl: "/stories/waterfall/2.mov",
            },
        ],
    },
];
