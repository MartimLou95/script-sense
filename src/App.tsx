import React, { useState } from 'react';
import { Search, BookOpenText, Brain, Send, Award, TrendingUp, Star, Film, Filter } from 'lucide-react';
import { ScriptCard } from './components/ScriptCard';
import { ScriptDetail } from './components/ScriptDetail';
import { Script, ScriptFilter } from './types/script';

// Sample data - in a real app, this would come from an API
const sampleScripts: Script[] = [
  {
    id: '1',
    title: "The Shawshank Redemption",
    writer: "Frank Darabont",
    year: 1994,
    genre: ["Drama", "Crime"],
    image: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    rating: 4.8,
    ratingCount: 1250,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
  },
  {
    id: '2',
    title: "Pulp Fiction",
    writer: "Quentin Tarantino",
    year: 1994,
    genre: ["Crime", "Drama"],
    image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    rating: 4.7,
    ratingCount: 980,
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
  },
  // Add more sample scripts here...
];

function App() {
  const [question, setQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [filters, setFilters] = useState<ScriptFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Question submitted:', question);
    setQuestion('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleRateScript = (rating: number) => {
    if (selectedScript) {
      // In a real app, this would update the backend
      console.log(`Rating ${selectedScript.title} with ${rating}`);
      setSelectedScript(null);
    }
  };

  const filteredScripts = sampleScripts.filter(script => {
    if (filters.genre && !script.genre.includes(filters.genre)) return false;
    if (filters.minRating && script.rating < filters.minRating) return false;
    if (filters.year && script.year !== filters.year) return false;
    if (filters.category && script.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpenText className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold text-white">ScriptSense</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-400 hover:text-white"
            >
              <Filter className="h-5 w-5" />
            </button>
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a specific script..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ask AI About Any Screenplay
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Get instant insights about your favorite movies' screenplays. Ask about plot structure, character development, or any specific scene.
          </p>
          
          {/* AI Question Input */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="relative flex-grow max-w-2xl">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How does the character development work in The Shawshank Redemption?"
                className="w-full pl-4 pr-12 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-400"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-slate-800 p-4 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.genre || ''}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value || undefined })}
                className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Genres</option>
                <option value="Drama">Drama</option>
                <option value="Crime">Crime</option>
                <option value="Action">Action</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>
              <select
                value={filters.minRating || ''}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
              <select
                value={filters.year || ''}
                onChange={(e) => setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Any Year</option>
                <option value="2020">2020s</option>
                <option value="2010">2010s</option>
                <option value="2000">2000s</option>
                <option value="1990">1990s</option>
              </select>
              <button
                onClick={() => setFilters({})}
                className="bg-emerald-500 text-white rounded-lg px-4 py-2 hover:bg-emerald-600 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Popular Scripts */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Popular Screenplays</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {filteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onClick={() => setSelectedScript(script)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Script Detail Modal */}
      {selectedScript && (
        <ScriptDetail
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
          onRate={handleRateScript}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16">
        <div className="container mx-auto px-6 py-8 text-center text-gray-400">
          © 2024 ScriptSense. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;