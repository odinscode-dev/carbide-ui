import { useEffect, useRef } from "react";

const SELECTOR = "[data-home-chart-tile-id]";

export function useHomeChartTileScrollRestoration(): void {
  const lastVisible = useRef<{ id: string; ratio: number } | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || typeof matchMedia === "undefined") {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!(entry.target instanceof HTMLElement)) {
          continue;
        }
        const id = entry.target.dataset.homeChartTileId;
        if (id === undefined) {
          continue;
        }

        if (!entry.isIntersecting) {
          if (lastVisible.current?.id === id) {
            lastVisible.current = null;
          }
          continue;
        }

        const current = lastVisible.current;
        if (current === null || current.id === id || entry.intersectionRatio >= current.ratio) {
          lastVisible.current = { id, ratio: entry.intersectionRatio };
        }
      }
    });

    for (const tile of document.querySelectorAll<HTMLElement>(SELECTOR)) {
      observer.observe(tile);
    }

    const query = matchMedia("(orientation: landscape)");
    const restore = () => {
      const id = lastVisible.current?.id;
      if (id === undefined) {
        return;
      }
      document
        .querySelector<HTMLElement>(`[data-home-chart-tile-id="${id}"]`)
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    query.addEventListener("change", restore);

    return () => {
      observer.disconnect();
      query.removeEventListener("change", restore);
    };
  }, []);
}
