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

interface BooksLibraryProps {
  theme?: 'universe' | 'sunrise';
}

export const BooksLibrary: React.FC<BooksLibraryProps> = ({ theme = 'universe' }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'overthinking' | 'meditation' | 'clarity' | 'psychology'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isCosmic = theme === 'universe';

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

  // Distinctive universe color cards for each category
  const getCardStyle = (category: string) => {
    if (!isCosmic) {
      return 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 shadow-sm';
    }
    switch (category) {
      case 'overthinking':
        return 'bg-gradient-to-br from-[#072428]/90 via-[#0b333a]/85 to-[#081e33]/90 border-emerald-400/40 hover:border-emerald-300 text-slate-100 shadow-lg shadow-emerald-950/40';
      case 'meditation':
        return 'bg-gradient-to-br from-[#230d3f]/90 via-[#2d1150]/85 to-[#1b0b38]/90 border-purple-400/40 hover:border-purple-300 text-slate-100 shadow-lg shadow-purple-950/40';
      case 'clarity':
        return 'bg-gradient-to-br from-[#0c2048]/90 via-[#102c60]/85 to-[#0c183e]/90 border-sky-400/40 hover:border-cyan-300 text-slate-100 shadow-lg shadow-sky-950/40';
      case 'psychology':
        return 'bg-gradient-to-br from-[#1c1240]/90 via-[#281a5a]/85 to-[#131038]/90 border-indigo-400/40 hover:border-indigo-300 text-slate-100 shadow-lg shadow-indigo-950/40';
      default:
        return 'bg-gradient-to-br from-[#0c173d]/90 via-[#102252]/85 to-[#0c1333]/90 border-indigo-400/40 hover:border-cyan-300 text-slate-100 shadow-lg shadow-indigo-950/40';
    }
  };

  const getBadgeStyle = (category: string) => {
    if (!isCosmic) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    switch (category) {
      case 'overthinking':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-400/40';
      case 'meditation':
        return 'bg-purple-950/90 text-fuchsia-300 border-purple-400/40';
      case 'clarity':
        return 'bg-sky-950/90 text-cyan-300 border-sky-400/40';
      case 'psychology':
        return 'bg-indigo-950/90 text-indigo-300 border-indigo-400/40';
      default:
        return 'bg-indigo-950/90 text-cyan-300 border-indigo-400/40';
    }
  };

  return (
    <section
      className={`rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all duration-500 ${
        isCosmic
          ? 'bg-gradient-to-br from-[#0a1438]/92 via-[#0e1d4b]/88 to-[#161240]/92 backdrop-blur-2xl border border-sky-400/35 shadow-2xl shadow-indigo-950/70 text-slate-100'
          : 'bg-white border border-slate-100 shadow-sm text-slate-700'
      }`}
    >
      {/* Background celestial glow in cosmic mode */}
      {isCosmic && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Section Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b mb-6 relative z-10 ${
          isCosmic ? 'border-sky-500/25' : 'border-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl border shadow-xs ${
              isCosmic
                ? 'bg-sky-950/80 border-sky-400/40 text-cyan-300'
                : 'bg-sky-50 border-sky-100 text-sky-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-lg sm:text-xl font-bold tracking-tight ${
                  isCosmic ? 'text-white' : 'text-slate-700'
                }`}
              >
                Mindfulness &amp; Overthinking Library
              </h2>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isCosmic
                    ? 'bg-sky-950/90 text-cyan-300 border-sky-400/40'
                    : 'bg-sky-50 text-sky-700 border-sky-100'
                }`}
              >
                کتب خانہ
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isCosmic ? 'text-cyan-200/80' : 'text-slate-500'}`}>
              اوور تھنکنگ کے خاتمے، روزمرہ مراقبے، سانس کے ہوش اور ذہنی سکون پر شاہکار خلاصے۔
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isCosmic ? 'text-cyan-300' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="کتابیں، مصنفین یا موضوعات تلاش کریں..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs transition-all focus:outline-none ${
              isCosmic
                ? 'bg-slate-950/80 border border-indigo-400/40 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                : 'bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-sky-400'
            }`}
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            selectedCategory === 'all'
              ? isCosmic
                ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 border-cyan-400/50'
                : 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50 border-transparent'
              : isCosmic
              ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300 hover:text-white hover:border-cyan-400/50'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          تمام کتب / All ({MINDFUL_BOOKS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('overthinking')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
            selectedCategory === 'overthinking'
              ? isCosmic
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-md shadow-emerald-500/25 border-emerald-400/50'
                : 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50 border-transparent'
              : isCosmic
              ? 'bg-slate-900/80 border-emerald-500/30 text-slate-300 hover:text-white hover:border-emerald-400/50'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>اوور تھنکنگ کا علاج (Overthinking)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('meditation')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
            selectedCategory === 'meditation'
              ? isCosmic
                ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-600 text-white shadow-md shadow-purple-500/25 border-purple-400/50'
                : 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50 border-transparent'
              : isCosmic
              ? 'bg-slate-900/80 border-purple-500/30 text-slate-300 hover:text-white hover:border-purple-400/50'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>مراقبہ و سانس (Meditation)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('clarity')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
            selectedCategory === 'clarity'
              ? isCosmic
                ? 'bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 text-white shadow-md shadow-sky-500/25 border-sky-400/50'
                : 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50 border-transparent'
              : isCosmic
              ? 'bg-slate-900/80 border-sky-500/30 text-slate-300 hover:text-white hover:border-sky-400/50'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>ذہنی یکسوئی و امن (Clarity)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('psychology')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
            selectedCategory === 'psychology'
              ? isCosmic
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/25 border-indigo-400/50'
                : 'bg-gradient-to-r from-sky-400 to-teal-300 text-white shadow-md shadow-sky-200/50 border-transparent'
              : isCosmic
              ? 'bg-slate-900/80 border-indigo-500/30 text-slate-300 hover:text-white hover:border-indigo-400/50'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>علمِ نفسیات (Psychology)</span>
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setActiveBook(book)}
            className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.015] flex flex-col justify-between ${getCardStyle(
              book.category
            )}`}
          >
            <div>
              {/* Badge & Read Time */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getBadgeStyle(book.category)}`}>
                  {book.badge}
                </span>
                <span className={`text-[11px] flex items-center gap-1 ${isCosmic ? 'text-slate-400' : 'text-slate-400'}`}>
                  <Clock className="w-3 h-3" />
                  {book.readTime}
                </span>
              </div>

              {/* Title & Author */}
              <h3
                className={`text-base font-bold transition-colors leading-snug ${
                  isCosmic ? 'text-white group-hover:text-cyan-300' : 'text-slate-700 group-hover:text-sky-600'
                }`}
              >
                {book.title}
              </h3>
              <p className={`text-xs flex items-center gap-1 mt-1 font-medium ${isCosmic ? 'text-cyan-300' : 'text-slate-500'}`}>
                <User className="w-3 h-3 opacity-70" />
                {book.author}
              </p>

              {/* Tagline */}
              <p className={`text-xs mt-2.5 line-clamp-2 leading-relaxed ${isCosmic ? 'text-slate-200' : 'text-slate-500'}`}>
                {book.tagline}
              </p>
            </div>

            {/* Bottom Quote & Action */}
            <div className={`pt-4 mt-4 border-t flex items-center justify-between ${isCosmic ? 'border-indigo-500/25' : 'border-slate-100'}`}>
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  isCosmic ? 'text-cyan-300 group-hover:text-white' : 'text-sky-600 group-hover:text-sky-700'
                }`}
              >
                خلاصہ اور عملی مشقیں پڑھیں
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
            <p className="text-sm">آپ کی تلاش کے مطابق کوئی کتاب نہیں ملی۔</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              تمام فلٹرز ری سیٹ کریں
            </button>
          </div>
        )}
      </div>

      {/* Book Detail & Actionable Summary Modal */}
      {activeBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div
            className={`border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6 ${
              isCosmic
                ? 'bg-gradient-to-br from-[#09122f] via-[#0d1a44] to-[#151036] border-cyan-400/45 text-slate-100'
                : 'bg-white border-slate-100 text-slate-700'
            }`}
          >
            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              className={`absolute top-5 right-5 p-2 rounded-2xl transition-colors cursor-pointer ${
                isCosmic ? 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(activeBook.category)}`}>
                  {activeBook.categoryLabel}
                </span>
                <span className={`text-xs flex items-center gap-1 ${isCosmic ? 'text-slate-400' : 'text-slate-400'}`}>
                  <Clock className="w-3 h-3" />
                  {activeBook.readTime}
                </span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight pr-8 ${isCosmic ? 'text-white' : 'text-slate-700'}`}>
                {activeBook.title}
              </h2>
              <p className={`text-sm font-medium mt-0.5 ${isCosmic ? 'text-cyan-300' : 'text-sky-600'}`}>
                تصنیف: {activeBook.author}
              </p>
              <p className={`text-xs mt-2 italic leading-relaxed ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>
                "{activeBook.tagline}"
              </p>
            </div>

            {/* Core Philosophy Section */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isCosmic ? 'text-cyan-300' : 'text-sky-700'}`}>
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                کتاب کا بنیادی فلسفہ و سائنسی نکتہ (Core Philosophy)
              </h4>
              <p
                className={`text-sm leading-relaxed p-4 rounded-2xl border ${
                  isCosmic
                    ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border-cyan-500/35 text-slate-100'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
              >
                {activeBook.corePhilosophy}
              </p>
            </div>

            {/* Actionable Exercises */}
            <div className="space-y-2.5">
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isCosmic ? 'text-teal-300' : 'text-teal-700'}`}>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                فوری قابلِ عمل ۳ مشقیں (Actionable Exercises)
              </h4>
              <div className="space-y-2">
                {activeBook.actionableExercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      isCosmic
                        ? 'bg-slate-900/80 border-indigo-500/30 text-slate-200'
                        : 'bg-teal-50/50 border-teal-100 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCosmic
                          ? 'bg-teal-900/80 text-teal-300 border border-teal-400/40'
                          : 'bg-teal-100 text-teal-700'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className="text-xs leading-relaxed">{exercise}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Quote */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isCosmic
                  ? 'bg-gradient-to-r from-amber-950/50 to-orange-950/40 border-amber-500/35 text-amber-200'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}
            >
              <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider block mb-0.5 ${isCosmic ? 'text-amber-300' : 'text-amber-800'}`}>
                  سنہری قول (Key Takeaway)
                </span>
                <p className="text-sm font-semibold">{activeBook.goldenQuote}</p>
              </div>
            </div>

            {/* Audio Narration Action */}
            <div className={`flex items-center justify-between pt-2 border-t ${isCosmic ? 'border-indigo-500/25' : 'border-slate-100'}`}>
              <button
                onClick={() => handlePlayBookSummary(activeBook)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                    : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/30'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>آواز بند کریں (Stop Audio)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 animate-pulse text-amber-200" />
                    <span>خلاصہ سنیں (Listen to Summary)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCloseModal}
                className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${
                  isCosmic ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                بند کریں (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
