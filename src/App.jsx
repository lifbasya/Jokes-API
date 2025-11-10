import React, { useEffect, useState } from "react";

export default function RandomJokeCard() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState("dark"); // 🌙 default: dark mode

  // 🔹 Ambil data favorites dan theme dari localStorage saat load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // 🔹 Fetch joke dari API
  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://official-joke-api.appspot.com/random_joke"
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

  // 🔹 Toggle dark/white mode
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // 🔹 Tambah / hapus joke dari favorites
  const toggleFavorite = (joke) => {
    if (!joke) return;
    const exists = favorites.some((fav) => fav.id === joke.id);
    let updated = exists
      ? favorites.filter((fav) => fav.id !== joke.id)
      : [...favorites, joke];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
          : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"
      }`}
    >
      <div className="max-w-xl w-full">
        <div
          className={`backdrop-blur-sm border rounded-2xl p-4 sm:p-6 shadow-2xl transition-colors duration-500 ${
            theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-4">
            <h1
              className={`text-xl md:text-2xl font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Random Joke
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {/* 🌗 Tombol Theme */}
              <button
                onClick={toggleTheme}
                className={`px-2.5 py-1.5 sm:px-3 rounded-lg text-sm transition ${
                  theme === "dark"
                    ? "bg-white/10 hover:bg-white/20 text-white/90"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>

              {/* Tombol New */}
              <button
                onClick={fetchJoke}
                className={`inline-flex items-center gap-2 px-2.5 py-1.5 sm:px-3 rounded-lg text-sm transition ${
                  theme === "dark"
                    ? "bg-white/10 hover:bg-white/20 text-white/90"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {loading ? "Loading..." : "New"}
              </button>

              {/* Tombol Copy */}
              <button
                onClick={() => {
                  if (!joke) return;
                  navigator.clipboard?.writeText(
                    `${joke.setup} - ${joke.punchline}`
                  );
                }}
                className={`px-2.5 py-1.5 sm:px-3 rounded-lg text-sm transition ${
                  theme === "dark"
                    ? "bg-white/10 hover:bg-white/20 text-white/90"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Copy
              </button>

              {/* Tombol Like */}
              <button
                onClick={() => toggleFavorite(joke)}
                className={`px-2.5 py-1.5 sm:px-3 rounded-lg text-sm transition ${
                  isFavorite(joke?.id)
                    ? "bg-pink-600/70 hover:bg-pink-600 text-white"
                    : theme === "dark"
                    ? "bg-white/10 hover:bg-white/20 text-white/90"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {isFavorite(joke?.id) ? "♥ Liked" : "♡ Like"}
              </button>
            </div>
          </div>

          <hr
            className={theme === "dark" ? "border-white/10" : "border-gray-300"}
          />

          {/* Konten Joke */}
          <div
            className={`p-4 sm:p-6 rounded-xl border mt-4 transition-colors ${
              theme === "dark"
                ? "bg-white/5 border-white/10 text-gray-100"
                : "bg-gray-50 border-gray-200 text-gray-800"
            }`}
          >
            {error ? (
              <p className="text-red-400">{error}</p>
            ) : !joke ? (
              <p>No joke available. Press 'New' to try again.</p>
            ) : (
              <div>
                <p className="text-lg md:text-xl font-medium mb-3">
                  {joke.setup}
                </p>
                <hr
                  className={
                    theme === "dark" ? "border-white/10" : "border-gray-300"
                  }
                />
                <p className="text-base md:text-lg font-semibold mt-3">
                  {joke.punchline}
                </p>
                <p className="mt-4 text-xs opacity-70">
                  Type: {joke.type} • ID: {joke.id}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 text-right">
            <small
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Source: official-joke-api.appspot.com
            </small>
          </div>

          {/* 🌟 Daftar Favorit */}
          {favorites.length > 0 && (
            <div
              className={`mt-6 p-4 rounded-xl border transition-colors ${
                theme === "dark"
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  className={`font-semibold text-base ${
                    theme === "dark" ? "text-white/90" : "text-gray-800"
                  }`}
                >
                  Favorites ({favorites.length})
                </h2>
                <button
                  onClick={() => {
                    setFavorites([]);
                    localStorage.removeItem("favorites");
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md transition ${
                    theme === "dark"
                      ? "bg-white/10 hover:bg-white/20 text-white/80"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Clear All
                </button>
              </div>
              <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {favorites.map((f) => (
                  <li
                    key={f.id}
                    className={`border rounded-lg p-3 flex flex-col gap-3 transition ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{f.setup}</p>
                      <hr className="my-2 opacity-30" />
                      <p className="font-semibold">{f.punchline}</p>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 text-xs opacity-70">
                      <p>
                        Type: {f.type} • ID: {f.id}
                      </p>
                      <button
                        onClick={() => toggleFavorite(f)}
                        className={`px-2 py-1 text-[13px] rounded-md transition ${
                          theme === "dark"
                            ? "bg-white/10 hover:bg-white/20 text-white/80"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
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
