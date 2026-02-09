import { useEffect, useMemo, useRef } from "react";

interface StoryPreloadOptions {
    isEnabled?: boolean;
}

// Fully read the response stream so the browser can commit it to cache.
const drainResponse = async (response: Response) => {
    const reader = response.body?.getReader();
    if (!reader) return;

    try {
        while (true) {
            const { done } = await reader.read();
            if (done) break;
        }
    } finally {
        reader.releaseLock();
    }
};

export const useStoryPreload = (urls: string[], options: StoryPreloadOptions = {}) => {
    const { isEnabled = true } = options;
    const startedRef = useRef(false);

    const uniqueUrls = useMemo(() => {
        const deduped = new Set<string>();
        urls.forEach((url) => {
            if (url) deduped.add(url);
        });
        return Array.from(deduped);
    }, [urls]);

    useEffect(() => {
        if (!isEnabled || startedRef.current) return;
        if (uniqueUrls.length === 0) return;
        if (typeof document === "undefined") return;

        startedRef.current = true;
        const controller = new AbortController();

        // Hint to the browser: these assets are definitely needed soon.
        uniqueUrls.forEach((url) => {
            if (!document.head.querySelector(`link[rel=\"preload\"][href=\"${url}\"]`)) {
                const link = document.createElement("link");
                link.rel = "preload";
                link.as = "video";
                link.href = url;
                link.setAttribute("fetchpriority", "high");
                document.head.appendChild(link);
            }
        });

        // Warm the cache aggressively by fetching and draining each asset once.
        uniqueUrls.forEach(async (url) => {
            try {
                const response = await fetch(url, {
                    cache: "force-cache",
                    signal: controller.signal,
                });

                if (!response.ok) return;
                await drainResponse(response);
            } catch {
                // Ignore preload failures (network aborts, unsupported cache modes, etc.)
            }
        });

        return () => {
            controller.abort();
        };
    }, [isEnabled, uniqueUrls]);
};
