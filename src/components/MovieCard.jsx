import { Card, CardContent } from "@/components/ui/card";

export const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "/placeholder.png";

  return (
    <Card className="rounded-2xl shadow-md hover:scale-105 transition">
      <img
        src={imageUrl}
        alt={movie.title}
        className="rounded-t-2xl w-full h-72 object-cover"
      />

      <CardContent className="p-4">
        <h2 className="text-lg font-semibold line-clamp-1">{movie.title}</h2>

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>⭐ {movie.vote_average}</span>
          <span>{movie.release_date}</span>
        </div>

        {/* Wishlist Placeholder */}
        <button className="mt-3 text-red-500">♡</button>
      </CardContent>
    </Card>
  );
};
