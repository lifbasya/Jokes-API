import React, { useEffect, useState } from "react";

export default function RandomJokeCard() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6">
      <div className="max-w-xl w-full">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-semibold text-white">Random Joke</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchJoke}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/6 hover:bg-white/10 text-sm text-white/90 transition"
                aria-label="New joke"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span>{loading ? "Loading..." : "New"}</span>
              </button>

              <button
                onClick={() => {
                  if (!joke) return;
                  navigator.clipboard?.writeText(`${joke.setup} - ${joke.punchline}`);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/6 hover:bg-white/10 text-sm text-white/90 transition"
                title="Copy joke"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-b from-white/3 to-white/2 border border-white/5">
            {error ? (
              <p className="text-red-400">{error}</p>
            ) : !joke ? (
              <p className="text-gray-300">No joke available. Press 'New' to try again.</p>
            ) : (
              <div>
                <p className="text-gray-200 text-lg md:text-xl font-medium mb-4">{joke.setup}</p>
                <hr className="border-white/6 my-3" />
                <p className="text-gray-100 text-base md:text-lg font-semibold">{joke.punchline}</p>
                <p className="mt-4 text-xs text-gray-400">Type: {joke.type} • ID: {joke.id}</p>
              </div>
            )}
          </div>

          <div className="mt-5 text-right">
            <small className="text-xs text-gray-400">Source: official-joke-api.appspot.com</small>
          </div>
        </div>
      </div>
    </div>
  );
}

