import React from 'react';
import { MessageSquareText, ShieldAlert, Moon, Sparkles, Compass } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
  theme?: 'universe' | 'sunrise';
}

const PROMPT_SUGGESTIONS = [
  {
    icon: Compass,
    title: 'فوری سوال (Direct Question)',
    subtitle: 'کاموں کو ترجیح دینے کا طریقہ',
    text: "مصروفیات میں ترجیحات کیسے طے کریں؟ What are three effective ways to prioritize tasks when busy?",
    colorScheme: 'from-cyan-950/70 via-sky-950/60 to-slate-900/80 border-cyan-400/35 hover:border-cyan-300 text-cyan-200',
    iconColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-400/40',
  },
  {
    icon: Sparkles,
    title: 'دوستانہ گفتگو (Casual Chat)',
    subtitle: 'ذہنی فوکس اور ارتکاز',
    text: "ذہنی ارتکاز بڑھانے کے لیے کون سی کتاب یا مشق بہترین ہے؟ What helps sharpen mental focus?",
    colorScheme: 'from-amber-950/70 via-yellow-950/50 to-slate-900/80 border-amber-400/35 hover:border-amber-300 text-amber-200',
    iconColor: 'bg-amber-900/60 text-amber-300 border-amber-400/40',
  },
  {
    icon: ShieldAlert,
    title: 'گردش کرتی سوچ (Looping Thought)',
    subtitle: 'بار بار دہرائے جانے والے وسوسے',
    text: "مجھ سے ایک بات ہوئی اور میں بار بار وہی سوچ رہا ہوں۔ I keep overthinking a comment and replay it.",
    colorScheme: 'from-rose-950/70 via-pink-950/50 to-slate-900/80 border-rose-400/35 hover:border-rose-300 text-rose-200',
    iconColor: 'bg-rose-900/60 text-rose-300 border-rose-400/40',
  },
  {
    icon: Moon,
    title: 'تھکاوٹ دور کریں (Wind Down)',
    subtitle: '۲ منٹ کا پرسکون وقفہ',
    text: "میرا ذہن بہت تھکا ہوا ہے، مجھے ۲ منٹ کی پرسکون ریلیکسیشن کروائیں۔ Give me a quick 2-minute reset.",
    colorScheme: 'from-purple-950/70 via-indigo-950/50 to-slate-900/80 border-purple-400/35 hover:border-purple-300 text-purple-200',
    iconColor: 'bg-purple-900/60 text-purple-300 border-purple-400/40',
  },
];

export const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onSelectPrompt,
  disabled = false,
  theme = 'universe',
}) => {
  const isCosmic = theme === 'universe';

  return (
    <div className="w-full py-1">
      <div className="flex items-center justify-between gap-1.5 text-xs mb-3 font-medium px-1">
        <div className="flex items-center gap-1.5">
          <MessageSquareText className={`w-3.5 h-3.5 ${isCosmic ? 'text-cyan-400' : 'text-sky-600'}`} />
          <span className={isCosmic ? 'text-cyan-300 font-semibold' : 'text-slate-700 font-semibold'}>
            عام اوور تھنکنگ کے سوالات (Quick Starters):
          </span>
        </div>
        <span className={`text-[10px] ${isCosmic ? 'text-slate-400' : 'text-slate-500'}`}>
          بولنے یا کلک کرنے کے لیے منتخب کریں
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROMPT_SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.text)}
              disabled={disabled}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all group disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md ${
                isCosmic
                  ? `bg-gradient-to-br ${item.colorScheme} backdrop-blur-md`
                  : 'bg-gradient-to-br from-slate-50 to-sky-50/50 border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/80 text-slate-700'
              }`}
            >
              <div
                className={`p-2 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${
                  isCosmic ? item.iconColor : 'bg-sky-100 text-sky-600 border-sky-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-bold block transition-colors ${
                      isCosmic ? 'text-white group-hover:text-cyan-200' : 'text-slate-700 group-hover:text-sky-700'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                <span className={`text-[10px] block font-medium ${isCosmic ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.subtitle}
                </span>
                <p className={`text-[11px] line-clamp-1 mt-1 ${isCosmic ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
