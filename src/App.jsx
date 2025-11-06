import React, { useEffect, useState } from "react";

export default function RandomJokeCard() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // 🔹 Ambil data favorites dari localStorage saat pertama kali load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // 🔹 Fetch joke dari API
  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://official-joke-api.appspot.com/random_joke",
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJoke(data);
    } catch (err) {
      setError("Failed to fetch joke. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  // 🔹 Tambah / hapus joke dari favorites
  const toggleFavorite = (joke) => {
    if (!joke) return;
    const exists = favorites.some((fav) => fav.id === joke.id);
    let updated;

    if (exists) {
      updated = favorites.filter((fav) => fav.id !== joke.id);
    } else {
      updated = [...favorites, joke];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4 sm:p-6">
      <div className="max-w-xl w-full">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
          {/* Header */}
          {/* 💡 CHANGE: Use flex-col and flex-row on small screens to stack elements, and use a gap on larger screens */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              Random Joke
            </h1>
            {/* 💡 CHANGE: Change gap-2 to gap-1 on mobile, wrap buttons using flex-wrap */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {/* Tombol New */}
              <button
                onClick={fetchJoke}
                // 💡 CHANGE: Make button padding slightly smaller on mobile (e.g., px-2.5 py-1.5)
                className="inline-flex items-center gap-2 px-2.5 py-1.5 sm:px-3 rounded-lg bg-white/6 hover:bg-white/10 text-sm text-white/90 transition shrink-0"
                aria-label="New joke"
              >
                {loading ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.2"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span>{loading ? "Loading..." : "New"}</span>
              </button>

              {/* Tombol Copy */}
              <button
                onClick={() => {
                  if (!joke) return;
                  navigator.clipboard?.writeText(
                    `${joke.setup} - ${joke.punchline}`,
                  );
                }}
                // 💡 CHANGE: Make button padding slightly smaller on mobile
                className="px-2.5 py-1.5 sm:px-3 rounded-lg bg-white/6 hover:bg-white/10 text-sm text-white/90 transition shrink-0"
                title="Copy joke"
              >
                Copy
              </button>

              {/* Tombol Like */}
              <button
                onClick={() => toggleFavorite(joke)}
                // 💡 CHANGE: Make button padding slightly smaller on mobile
                className={`px-2.5 py-1.5 sm:px-3 rounded-lg text-sm transition shrink-0 ${
                  isFavorite(joke?.id)
                    ? "bg-pink-600/60 hover:bg-pink-600 text-white"
                    : "bg-white/6 hover:bg-white/10 text-white/90"
                }`}
                title="Like joke"
              >
                {isFavorite(joke?.id) ? "♥ Liked" : "♡ Like"}
              </button>
            </div>
          </div>
          <hr className="border-white/10 my-4" />{" "}
          {/* Separator for better structure */}
          {/* Konten Joke */}
          {/* 💡 CHANGE: Smaller padding on mobile */}
          <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-b from-white/3 to-white/2 border border-white/5">
            {error ? (
              <p className="text-red-400">{error}</p>
            ) : !joke ? (
              <p className="text-gray-300">
                No joke available. Press 'New' to try again.
              </p>
            ) : (
              <div>
                <p className="text-gray-200 text-lg md:text-xl font-medium mb-3">
                  {joke.setup}
                </p>
                <hr className="border-white/6 my-3" />
                <p className="text-gray-100 text-base md:text-lg font-semibold">
                  {joke.punchline}
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  Type: {joke.type} • ID: {joke.id}
                </p>
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="mt-5 text-right">
            <small className="text-xs text-gray-400">
              Source: official-joke-api.appspot.com
            </small>
          </div>
          {/* 🌟 Daftar Favorit */}
          {favorites.length > 0 && (
            <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white/90 font-semibold text-base">
                  Favorites ({favorites.length})
                </h2>
                <button
                  onClick={() => {
                    setFavorites([]);
                    localStorage.removeItem("favorites");
                  }}
                  className="px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-white/80 rounded-md transition"
                >
                  Clear All
                </button>
              </div>

              {/* 💡 Improvement: Added a custom scrollbar style class (e.g., 'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900' if you have a custom Tailwind setup, or just ensure default overflow is usable) */}
              <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {favorites.map((f) => (
                  <li
                    key={f.id}
                    // 💡 CHANGE: Used flex-col on mobile and flex-row on larger screens for better organization
                    className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col hover:bg-white/10 transition gap-3"
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-gray-200 text-sm font-medium leading-snug">
                        {f.setup}
                      </p>
                      <hr className="border-white/6" />
                      <p className="text-gray-100 text-sm font-semibold">
                        {f.punchline}
                      </p>
                    </div>
                    {/* 💡 CHANGE: Adjusted text and button for mobile readability */}
                    <div className="flex flex-wrap items-center justify-between w-full mt-1 pt-2 border-t border-white/5">
                      <p className="text-xs text-gray-400">
                        Type: {f.type} • ID: {f.id}
                      </p>
                      <button
                        onClick={() => toggleFavorite(f)}
                        className="mt-1 sm:mt-0 px-2.5 py-1 text-[13px] rounded-md bg-white/10 hover:bg-white/20 text-white/80 transition shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
