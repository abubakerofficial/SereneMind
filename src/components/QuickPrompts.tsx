import React from 'react';
import { MessageSquareText, ShieldAlert, Moon, Sparkles, Compass } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

const PROMPT_SUGGESTIONS = [
  {
    icon: Compass,
    title: 'Direct Question',
    text: "What are three effective ways people prioritize tasks when they have a busy schedule?",
  },
  {
    icon: Sparkles,
    title: 'Casual Chat',
    text: "Hey! What's a good book or topic to learn about for sharpening focus?",
  },
  {
    icon: ShieldAlert,
    title: 'Looping Thought',
    text: "I keep overthinking a comment someone made earlier and I can't stop replaying it.",
  },
  {
    icon: Moon,
    title: 'Wind Down Help',
    text: "My brain feels exhausted from a long day. Can you give me a quick 2-minute reset?",
  },
];

export const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  return (
    <div className="w-full py-2">
      <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2.5 font-medium px-1">
        <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
        <span>Common Overthinking Starters:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PROMPT_SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.text)}
              disabled={disabled}
              className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-900/40 hover:bg-stone-850 border border-stone-800/80 hover:border-emerald-500/30 text-left transition-all group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="p-2 rounded-xl bg-stone-800/80 group-hover:bg-emerald-950/40 text-stone-400 group-hover:text-emerald-400 border border-stone-700/50 group-hover:border-emerald-500/20 shrink-0 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-stone-200 block group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </span>
                <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                  "{item.text}"
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
