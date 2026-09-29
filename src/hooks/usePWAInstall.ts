import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInfinix, setIsInfinix] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [platformName, setPlatformName] = useState('Android Phone');

  useEffect(() => {
    // Detect standalone mode (already running as installed app on homescreen/desktop)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');
    setIsInstalled(isStandalone);

    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const hasTouch = Boolean(
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
    );
    const isMobileViewport = typeof window !== 'undefined' ? window.innerWidth <= 850 : false;

    // Detect iOS (iPhone / iPad / iPod)
    const isIOSDevice = Boolean(
      /iphone|ipad|ipod/.test(userAgent) ||
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );

    // Detect Infinix / Tecno / Transsion specifically
    const infinixDetected = /infinix|xos|tecno|transsion|x68/.test(userAgent);
    setIsInfinix(infinixDetected);

    // Detect Android:
    // Any device mentioning android, linux with touch/mobile screen, infinix, samsung, or touch phone
    const isAndroidDevice = Boolean(
      !isIOSDevice &&
      (/android|infinix|xos|tecno|transsion|samsung|xiaomi|redmi|oppo|vivo|mobile|phone/i.test(userAgent) ||
        (hasTouch && isMobileViewport) ||
        (/linux/i.test(userAgent) && hasTouch))
    );

    // Only genuine desktop without touch or wide desktop viewport
    const isDesktopDevice = Boolean(!isIOSDevice && !isAndroidDevice && !hasTouch && !isMobileViewport);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsDesktop(isDesktopDevice);

    if (infinixDetected) {
      setPlatformName('Infinix Phone (Android)');
    } else if (isAndroidDevice) {
      setPlatformName('Android Phone');
    } else if (isIOSDevice) {
      setPlatformName('iPhone / iPad (iOS)');
    } else if (/windows/i.test(userAgent) && !hasTouch) {
      setPlatformName('Windows PC');
    } else if (/macintosh/i.test(userAgent) && !hasTouch) {
      setPlatformName('Mac (macOS)');
    } else if (isMobileViewport || hasTouch) {
      setPlatformName('Android Phone');
    } else {
      setPlatformName('Desktop & Mobile');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Install prompt error:', err);
      return false;
    }
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isInfinix,
    isDesktop,
    platformName,
    install,
  };
}
