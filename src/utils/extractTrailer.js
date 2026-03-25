export function extractTrailer(videos = []) {
  return (
    videos.find(
      (video) =>
        video.site === "YouTube" && video.type === "Trailer" && video.official
    ) ||
    videos.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    ) ||
    null
  );
}