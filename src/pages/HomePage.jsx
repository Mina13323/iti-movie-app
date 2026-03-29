import { useEffect } from "react";
import { getNowPlaying } from "../services/movieService";

export default function HomePage() {
  useEffect(() => {
    getNowPlaying().then((res) => {
      console.log(res.data);
    });
  }, []);

  return <div>Home hygygy Page</div>;
  
}