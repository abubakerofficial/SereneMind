import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface DeviceGuideInfo {
  brandName: string;
  badgeText: string;
  steps: string[];
  note: string;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInfinix, setIsInfinix] = useState(false);
  const [isSamsung, setIsSamsung] = useState(false);
  const [isXiaomi, setIsXiaomi] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceModel, setDeviceModel] = useState<string>('موبائل فون');
  const [platformName, setPlatformName] = useState<string>('Android Phone');

  useEffect(() => {
    // 1. Detect standalone mode (real app on homescreen - zero browser window)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandaloneMode);
    };

    checkStandalone();

    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const hasTouch = Boolean(
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
    );
    const isMobileWidth = typeof window !== 'undefined' ? window.innerWidth <= 1024 : false;
    const mobileDetected = hasTouch || isMobileWidth;
    setIsMobile(mobileDetected);

    // 2. Detect iOS (iPhone / iPad)
    const isIOSDevice = Boolean(
      /iphone|ipad|ipod/.test(userAgent) ||
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );

    // 3. Detect Phone Brands
    const infinixFound = /infinix|xos|tecno|transsion|x68/.test(userAgent);
    const samsungFound = /samsung|sm-|galaxy/.test(userAgent);
    const xiaomiFound = /xiaomi|redmi|poco|miui/.test(userAgent);
    const oppoFound = /oppo|vivo|realme|oneplus/.test(userAgent);
    const pixelFound = /pixel/.test(userAgent);

    setIsInfinix(infinixFound);
    setIsSamsung(samsungFound);
    setIsXiaomi(xiaomiFound);

    // 4. Detect Android
    const isAndroidDevice = Boolean(
      !isIOSDevice &&
      (/android|linux/i.test(userAgent) ||
        infinixFound ||
        samsungFound ||
        xiaomiFound ||
        oppoFound ||
        pixelFound ||
        (hasTouch && isMobileWidth))
    );

    const isDesktopDevice = Boolean(!isIOSDevice && !isAndroidDevice && !hasTouch && !isMobileWidth);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsDesktop(isDesktopDevice);

    // Determine Urdu label for user's device
    if (isIOSDevice) {
      setPlatformName('Apple iPhone / iPad');
      setDeviceModel('آئی فون (Apple iOS)');
    } else if (infinixFound) {
      setPlatformName('Infinix Smart / Hot (Android)');
      setDeviceModel('انفنکس فون (Infinix Mobile)');
    } else if (samsungFound) {
      setPlatformName('Samsung Galaxy (Android)');
      setDeviceModel('سام سنگ گلیکسی (Samsung Mobile)');
    } else if (xiaomiFound) {
      setPlatformName('Xiaomi / Redmi (Android)');
      setDeviceModel('شیاؤمی ریڈمی (Xiaomi Redmi)');
    } else if (oppoFound) {
      setPlatformName('Oppo / Vivo / Realme');
      setDeviceModel('اوپو / ویوو (Android Mobile)');
    } else if (pixelFound) {
      setPlatformName('Google Pixel');
      setDeviceModel('گوگل پکسل (Google Pixel)');
    } else if (isAndroidDevice) {
      setPlatformName('Android Phone');
      setDeviceModel('اینڈرائیڈ موبائل (Android Phone)');
    } else if (/windows/i.test(userAgent)) {
      setPlatformName('Windows PC');
      setDeviceModel('ونڈوز کمپیوٹر (Windows PC)');
    } else if (/macintosh/i.test(userAgent)) {
      setPlatformName('Mac (macOS)');
      setDeviceModel('ایپل میک (macOS)');
    } else {
      setPlatformName('Mobile & Web');
      setDeviceModel('موبائل ڈیوائس');
    }

    // PWA beforeinstallprompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024 || 'ontouchstart' in window);
      checkStandalone();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // One-click install prompt
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

  // Toggle fullscreen mode (removes browser URL bar & window frame)
  const toggleFullscreen = async (): Promise<boolean> => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
          return true;
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
          return false;
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle not permitted:', err);
    }
    return false;
  };

  // Customized step-by-step instructions in Urdu for the user's phone
  const getDeviceGuide = (): DeviceGuideInfo => {
    if (isIOS) {
      return {
        brandName: 'Apple iPhone (iOS Safari)',
        badgeText: 'آئی فون خودکار فٹنگ',
        steps: [
          'نیچے سفاری براؤزر میں شیئر کے بٹن (Share Icon ⎋) پر کلک کریں۔',
          'تھوڑا نیچے سکرول کریں اور "Add to Home Screen" (ہوم اسکرین میں شامل کریں ⊞) منتخب کریں۔',
          'اوپر دائیں کونے میں "Add" دبائیں۔ ایپ بغیر براؤزر بار کے اصلی آئی فون ایپ کی طرح کھل جائے گی!',
        ],
        note: 'آئی فون کی اسکرین پر یہ خودکار طور پر ڈائنامک آئی لینڈ اور نوچ کے مطابق فل اسکرین سیٹ ہو جاتی ہے۔',
      };
    }

    if (isInfinix) {
      return {
        brandName: 'Infinix Smart / Hot Phone',
        badgeText: 'انفنکس اسپیشل فٹنگ',
        steps: [
          'اوپر دیے گئے "انسٹال کریں" بٹن پر کلک کریں۔',
          'یا کروم / ایکس او ایس (XOS) براؤزر کے اوپر ۳ نقطوں (⋮) پر کلک کریں۔',
          '"Install app" یا "Add to Home Screen" پر ٹیپ کریں—فوری فل اسکرین اصلی ایپ محفوظ ہو جائے گی۔',
        ],
        note: 'انفنکس موبائل کی سائز اور ریفریش ریٹ کے مطابق خودکار فل اسکرین اور آف لائن سپاہی۔',
      };
    }

    if (isSamsung) {
      return {
        brandName: 'Samsung Galaxy Mobile',
        badgeText: 'سام سنگ ون یو آئی فٹنگ',
        steps: [
          'براہ راست نیچے "انسٹال کریں" بٹن دبائیں۔',
          'یا سام سنگ انٹرنیٹ / کروم میں مینو (≡ یا ⋮) کھول کر "Install / Add page to" منتخب کریں۔',
          'سام سنگ ایپ ڈراور اور ہوم اسکرین پر ریل ایپ فوری فعال ہو جائے گی۔',
        ],
        note: 'سام سنگ ایج پینل اور نوچ کے ساتھ ہم آہنگ بغیر براؤزر فریم کے۔',
      };
    }

    // Default Android Phone (Xiaomi, Oppo, Vivo, etc.)
    return {
      brandName: 'Android Mobile (ہر ماڈل کے لیے)',
      badgeText: 'اینڈرائیڈ ریل ایپ فٹنگ',
      steps: [
        'اوپر دیے گئے "انسٹال ریل ایپ" پر ایک کلک کریں۔',
        'اگر براؤزر آپشن پوچھے تو "Install" پر کلک کریں۔',
        'موبائل ہوم اسکرین پر بغیر کسی ونڈو یا یو آر ایل بار کے خالص 100% ریل ایپ کھل جائے گی۔',
      ],
      note: 'ہر کمپنی کے اینڈرائیڈ فون (شیاؤمی، ویوو، اوپو، موٹرولا وغیرہ) میں خودکار ایڈجسٹ ہوتی ہے۔',
    };
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isInfinix,
    isSamsung,
    isXiaomi,
    isDesktop,
    isMobile,
    isFullscreen,
    deviceModel,
    platformName,
    install,
    toggleFullscreen,
    getDeviceGuide,
  };
}
