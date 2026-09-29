import React from 'react';
import { Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenModal }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // If already installed and running standalone, provide a subtle indicator
  if (isInstalled) {
    return (
      <button
        onClick={onOpenModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm"
        title="App Installed - Download Center"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed</span>
      </button>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const succeeded = await install();
      if (!succeeded) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer group"
      title="Download SereneMind AI for all devices (Android, iOS, PC, Mac)"
    >
      <Download className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
      <span>ڈاؤن لوڈ (Download)</span>
    </button>
  );
};
