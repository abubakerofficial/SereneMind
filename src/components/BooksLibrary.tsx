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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'overthinking' | 'meditation' | 'clarity' | 'psychology'>('all');
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
    <section className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-sm text-slate-700 relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight">
                Mindfulness &amp; Overthinking Library
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                کتب خانہ
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated masterworks on stopping overthinking, daily meditation, breath awareness, and mental clarity.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400 transition-all"
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          All Books ({MINDFUL_BOOKS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('overthinking')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'overthinking'
              ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Overthinking Relief (اوور تھنکنگ)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('meditation')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'meditation'
              ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Meditation &amp; Breath (میڈیٹیشن)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('clarity')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'clarity'
              ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Mental Clarity &amp; Peace</span>
        </button>
        <button
          onClick={() => setSelectedCategory('psychology')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'psychology'
              ? 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clinical Psychology (نفسیات)</span>
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setActiveBook(book)}
            className="group cursor-pointer rounded-2xl bg-white border border-slate-100 p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-sky-300 flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Badge & Read Time */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                  {book.badge}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {book.readTime}
                </span>
              </div>

              {/* Title & Author */}
              <h3 className="text-base font-bold text-slate-700 group-hover:text-sky-600 transition-colors leading-snug">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                <User className="w-3 h-3 text-slate-400" />
                {book.author}
              </p>

              {/* Tagline */}
              <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                {book.tagline}
              </p>
            </div>

            {/* Bottom Quote & Action */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-sky-600 group-hover:text-sky-700 flex items-center gap-1">
                Read Key Summary &amp; Exercises
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm">No books found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-sky-600 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Book Detail & Actionable Summary Modal */}
      {activeBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-slate-700 shadow-2xl relative space-y-6">
            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  {activeBook.categoryLabel}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {activeBook.readTime}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-700 tracking-tight">
                {activeBook.title}
              </h2>
              <p className="text-sm text-sky-600 font-medium mt-0.5">
                by {activeBook.author}
              </p>
              <p className="text-xs text-slate-500 italic mt-1">
                "{activeBook.tagline}"
              </p>
            </div>

            {/* Listen Audio Narration Button */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <button
                onClick={() => handlePlayBookSummary(activeBook)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200/50'
                    : 'bg-gradient-to-r from-sky-400 to-teal-300 hover:from-sky-500 hover:to-teal-400 text-white shadow-md shadow-sky-200/50'
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
              <span className="text-xs text-slate-500">
                {isPlayingAudio ? 'Speaking book key takeaway...' : 'Listen to core insights read aloud'}
              </span>
            </div>

            {/* Core Philosophy & Insight */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
                <Lightbulb className="w-4 h-4" />
                <span>Core Philosophy &amp; Teaching</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {activeBook.corePhilosophy}
              </p>
            </div>

            {/* 3 Actionable Daily Exercises */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>3 Actionable Exercises You Can Do Today</span>
              </div>
              <div className="space-y-2.5">
                {activeBook.actionableExercises.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Quote */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
              <Quote className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-sky-600 block mb-1">
                  Golden Insight
                </span>
                <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
                  {activeBook.goldenQuote}
                </p>
              </div>
            </div>

            {/* Modal Bottom Close Button */}
            <div className="pt-2 text-right">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
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
