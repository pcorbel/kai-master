/**
 * Liveness probe, wired to the container's HEALTHCHECK.
 *
 * The app has no database and no server-side state; the one upstream, Project
 * Aon, is only contacted when a reader downloads a book, so it is deliberately
 * not probed here: an outage there should not restart this container.
 */
export default defineEventHandler(() => ({ status: "ok" as const }));
