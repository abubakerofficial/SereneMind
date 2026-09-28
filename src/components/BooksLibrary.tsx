import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Bookmark,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Quote,
  Clock,
  User,
} from 'lucide-react';
import { BookItem } from '../types';
import { MINDFUL_BOOKS } from '../data/books';
import { soundEngine } from '../utils/audio';

export const BooksLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'overthinking' | 'meditation' | 'clarity'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredBooks = MINDFUL_BOOKS.filter((book) => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayBookSummary = (book: BookItem) => {
    if (isPlayingAudio) {
      soundEngine.stopPlayback();
      setIsPlayingAudio(false);
      return;
    }

    const narrationText = `${book.title} by ${book.author}. ${book.tagline}. Core Insight: ${book.corePhilosophy}. Key Quote: ${book.goldenQuote}`;
    setIsPlayingAudio(true);
    soundEngine.speakFallback(narrationText, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleCloseModal = () => {
    if (isPlayingAudio) {
      soundEngine.stopPlayback();
      setIsPlayingAudio(false);
    }
    setActiveBook(null);
  };

  return (
    <section className="bg-stone-900/50 border border-stone-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-950/50">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 tracking-tight">
                Mindfulness &amp; Overthinking Library
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                کتب خانہ
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Curated masterworks on stopping overthinking, daily meditation, breath awareness, and mental clarity.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
              : 'bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          All Books ({MINDFUL_BOOKS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('overthinking')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'overthinking'
              ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
              : 'bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Overthinking Relief (اوور تھنکنگ)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('meditation')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'meditation'
              ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
              : 'bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Meditation &amp; Breath (میڈیٹیشن)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('clarity')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'clarity'
              ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
              : 'bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Mental Clarity &amp; Peace</span>
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setActiveBook(book)}
            className={`group cursor-pointer rounded-2xl bg-gradient-to-br ${book.gradient} border p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-emerald-500/40 flex flex-col justify-between`}
          >
            <div>
              {/* Badge & Read Time */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-900/90 text-emerald-300 border border-emerald-500/20">
                  {book.badge}
                </span>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-500" />
                  {book.readTime}
                </span>
              </div>

              {/* Title & Author */}
              <h3 className="text-base font-bold text-stone-100 group-hover:text-emerald-300 transition-colors leading-snug">
                {book.title}
              </h3>
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
                <User className="w-3 h-3 text-stone-500" />
                {book.author}
              </p>

              {/* Tagline */}
              <p className="text-xs text-stone-300/90 mt-2.5 line-clamp-2 leading-relaxed">
                {book.tagline}
              </p>
            </div>

            {/* Bottom Quote & Action */}
            <div className="pt-4 mt-4 border-t border-stone-800/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                Read Key Summary &amp; Exercises
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-400">
            <BookOpen className="w-8 h-8 mx-auto text-stone-600 mb-2" />
            <p className="text-sm">No books found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-emerald-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Book Detail & Actionable Summary Modal */}
      {activeBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-stone-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-stone-100 shadow-2xl relative space-y-6">
            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {activeBook.categoryLabel}
                </span>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-500" />
                  {activeBook.readTime}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-stone-100 tracking-tight">
                {activeBook.title}
              </h2>
              <p className="text-sm text-emerald-400 font-medium mt-0.5">
                by {activeBook.author}
              </p>
              <p className="text-xs text-stone-400 italic mt-1">
                "{activeBook.tagline}"
              </p>
            </div>

            {/* Listen Audio Narration Button */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800">
              <button
                onClick={() => handlePlayBookSummary(activeBook)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-stone-950 shadow-md shadow-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen to Voice Summary</span>
                  </>
                )}
              </button>
              <span className="text-xs text-stone-400">
                {isPlayingAudio ? 'Speaking book key takeaway...' : 'Listen to core insights read aloud'}
              </span>
            </div>

            {/* Core Philosophy & Insight */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Lightbulb className="w-4 h-4" />
                <span>Core Philosophy &amp; Teaching</span>
              </div>
              <p className="text-sm text-stone-300 leading-relaxed bg-stone-950/40 p-4 rounded-2xl border border-stone-800/80">
                {activeBook.corePhilosophy}
              </p>
            </div>

            {/* 3 Actionable Daily Exercises */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>3 Actionable Exercises You Can Do Today</span>
              </div>
              <div className="space-y-2.5">
                {activeBook.actionableExercises.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800/70"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-teal-950/20 to-stone-950 border border-emerald-500/20 flex items-start gap-3">
              <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                  Golden Insight
                </span>
                <p className="text-sm font-medium text-stone-100 italic leading-relaxed">
                  {activeBook.goldenQuote}
                </p>
              </div>
            </div>

            {/* Modal Bottom Close Button */}
            <div className="pt-2 text-right">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
