import { useState, useEffect } from 'react';
import { StarBackground } from './components/StarBackground';
import { DraggableWindow } from './components/DraggableWindow';
import { Volume2, VolumeX, User, Link2, Images } from 'lucide-react';
import DecryptedText from "./components/DecryptedText";
import { LanyardProvider, DiscordAvatarTrigger, DiscordPresenceContent } from './components/DiscordPresence';

function App() {
  const [windows, setWindows] = useState({
    about: false,
    links: false,
    gallery: false,
    discord: false,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);
  const [windowZ, setWindowZ] = useState<Record<keyof typeof windows, number>>({
    about: 50,
    links: 50,
    gallery: 50,
    discord: 50,
  });
  const [zCounter, setZCounter] = useState(60);
  const [isMobile, setIsMobile] = useState(false);
  const [decryptKey, setDecryptKey] = useState(0);
  const [decryptDirection, setDecryptDirection] = useState<'start' | 'center' | 'end'>('start');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Preload gallery images
    galleryImages.forEach((src) => {
      if (!document.querySelector(`link[rel="preload"][href="${src}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Replay decrypt animation every 5 seconds with a random reveal direction
  useEffect(() => {
    const directions: ('start' | 'center' | 'end')[] = ['start', 'center', 'end'];
    const id = setInterval(() => {
      setDecryptDirection(directions[Math.floor(Math.random() * directions.length)]);
      setDecryptKey(k => k + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ─── KUSTOMISASI ────────────────────────────────────────────────────────
  // Ganti path di bawah dengan foto-foto kamu sendiri.
  // Taruh file gambar di folder public/assets/img/
  // Format yang didukung: .webp, .jpg, .png
  const galleryImages = [
    '/assets/img/myhanni.jpeg',
    '/assets/img/kucing1.jpeg',
    '/assets/img/kucing2.jpeg',
    '/assets/img/kunci1.jpeg',
    '/assets/img/noir.jpeg',
    '/assets/img/vw.jpeg',
    '/assets/img/bayangan.jpeg',
    '/assets/img/bulan1.jpeg',
    '/assets/img/laut.jpeg',
    '/assets/img/game.jpeg',
    '/assets/img/ayam1.jpeg',
  ];

  // ─── SOCIAL LINKS ──────────────────────────────────────────────────────
  // Ganti '#' dengan link profil kamu yang asli
  const socialLinks = {
    discord: { url: 'https://discord.com/users/473723354570817536', label: 'Discord' },         // contoh: 'https://discord.com/users/123456789'
    instagram: { url: 'https://instagram.com/ramlizhafran', label: 'Instagram' },      // contoh: 'https://instagram.com/username'
    github: { url: 'https://github.com/RamliZhafran', label: 'GitHub' },             // contoh: 'https://github.com/username'
  };
  // ─────────────────────────────────────────────────────────────────────────

  const toggleMute = () => setIsMuted(prev => !prev);

  const bringWindowToFront = (key: keyof typeof windows) => {
    setWindowZ(prev => ({
      ...prev,
      [key]: zCounter,
    }));
    setZCounter(prev => prev + 1);
  };

  const toggleWindow = (key: keyof typeof windows) => {
    const isOpening = !windows[key];

    if (isOpening) {
      bringWindowToFront(key);
    }

    setWindows(prev => ({ ...prev, [key]: !prev[key] }));

    if (!isMuted) {
      const soundFile = windows[key] ? '/sfx/button-click-2.mp3' : '/sfx/button-click-1.mp3';
      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const openFullSizeImage = (image: string) => {
    setFullSizeImage(image);
    if (!isMuted) {
      const audio = new Audio('/sfx/button-click-1.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const closeFullSizeImage = () => {
    setFullSizeImage(null);
    if (!isMuted) {
      const audio = new Audio('/sfx/button-click-2.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio play failed", e));
    }
  };

  // Hover/press style handlers for buttons
  const btnHandlers = (mobile = false) => mobile ? {
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(0.95)'; },
    onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(1)'; },
  } : {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(1.05)'; },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(1)'; },
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(0.95)'; },
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(1.05)'; },
  };

  const btnStyle = { willChange: 'transform' as const, transition: 'transform 0.15s ease-out' };

  return (
    <LanyardProvider>
      <>
        <StarBackground />

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className="fixed top-6 left-6 z-50 p-2 text-neutral-400 hover:text-white transition-transform hover:scale-110 active:scale-90"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* ── About Window ── */}
        <DraggableWindow
          title="about.txt"
          isOpen={windows.about}
          onClose={() => toggleWindow('about')}
          initialPosition={{ x: 0, y: 0 }}
          isMuted={isMuted}
          zIndex={windowZ.about}
          onFocus={() => bringWindowToFront('about')}
          isMobile={isMobile}
          stickyHeader={
            <>
              <div className="flex items-center gap-6">
                {/* Profile Photo — ganti /pfp.webp dengan foto kamu */}
                <img
                  src="/pp_seasonsofblossom.webp"
                  alt="Ramli Zhafran"
                  className="w-28 h-28 rounded-full object-cover border-2 border-neutral-700 flex-shrink-0"
                  onError={(e) => {
                    // Fallback jika foto belum ada
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Name & Info — GANTI TEKS DI BAWAH */}
                <div className="space-y-1.5">
                  <h2 className="text-3xl font-mono text-white">Ramli Zhafran</h2>
                  <p className="text-lg text-neutral-400">a quiet ordinary person</p>
                  <p className="text-base text-neutral-500">welcome to my space</p>
                </div>
              </div>
              <div className="border-b border-neutral-700 mt-5" />
            </>
          }
        >
          {/* BIO — GANTI TEKS DI BAWAH */}
          <div className="space-y-4">
            <p>
              Hello! I'm Ramli Zhafran.
              I'm just someone who enjoys learning, building things, and figuring stuff out along the way.
            </p>
            <p>
              I like exploring ideas, trying new tools, and slowly turning thoughts into something real.
            </p>
            <p>
              Thanks for stopping by.
            </p>
          </div>
        </DraggableWindow>

        {/* ── Links Window ── */}
        <DraggableWindow
          title="links.html"
          isOpen={windows.links}
          onClose={() => toggleWindow('links')}
          initialPosition={{ x: 20, y: 20 }}
          isMuted={isMuted}
          windowClassName="w-auto"
          zIndex={windowZ.links}
          onFocus={() => bringWindowToFront('links')}
          isMobile={isMobile}
        >
          <div className="flex flex-wrap justify-start sm:justify-center gap-8 p-4" style={{ maxWidth: 'calc(4 * (80px + 32px))' }}>
            {/* Discord */}
            <a
              href={socialLinks.discord.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-row sm:flex-col items-center gap-3 transition-colors w-full sm:w-20"
            >
              <div className="p-4 rounded-xl bg-neutral-800/50 group-hover:bg-[#5865F2]/20 transition-colors border border-neutral-700 group-hover:border-[#5865F2]/50 flex items-center justify-start sm:justify-center w-full">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-neutral-400 group-hover:fill-[#5865F2] transition-colors group-hover:scale-110 duration-300" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.07.07 0 0 0-.079.036c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.07.07 0 0 0-.079-.036A19.74 19.74 0 0 0 3.677 4.37a.06.06 0 0 0-.03.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.055 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.85 19.85 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028" />
                </svg>
                <span className="ml-2 text-xs sm:text-sm font-mono text-neutral-500 group-hover:text-[#5865F2] transition-colors sm:hidden">
                  {socialLinks.discord.label}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-mono text-neutral-500 group-hover:text-[#5865F2] transition-colors">
                {socialLinks.discord.label}
              </span>
            </a>

            {/* Instagram */}
            <a
              href={socialLinks.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-row sm:flex-col items-center gap-3 transition-colors w-full sm:w-20"
            >
              <div className="p-4 rounded-xl bg-neutral-800/50 group-hover:bg-[#E1306C]/20 transition-colors border border-neutral-700 group-hover:border-[#E1306C]/50 flex items-center justify-start sm:justify-center w-full">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-neutral-400 group-hover:fill-[#E1306C] transition-colors group-hover:scale-110 duration-300" viewBox="0 0 24 24">
                  <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.78.22 2.41.46.66.25 1.22.6 1.77 1.15.5.5.9 1.11 1.15 1.77.24.63.41 1.35.46 2.41.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.78-.46 2.41a4.9 4.9 0 0 1-1.15 1.77c-.5.5-1.11.9-1.77 1.15-.63.24-1.35.41-2.41.46-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.78-.22-2.41-.46a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.24-.63-.41-1.35-.46-2.41C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.78.46-2.41.25-.66.6-1.22 1.15-1.77.5-.5 1.11-.9 1.77-1.15.63-.24 1.35-.41 2.41-.46C8.94 2.01 9.28 2 12 2m0 3.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4m0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-10.45a1.45 1.45 0 1 1-2.9 0 1.45 1.45 0 0 1 2.9 0" />
                </svg>
                <span className="ml-2 text-xs sm:text-sm font-mono text-neutral-500 group-hover:text-[#E1306C] transition-colors sm:hidden">
                  {socialLinks.instagram.label}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-mono text-neutral-500 group-hover:text-[#E1306C] transition-colors">
                {socialLinks.instagram.label}
              </span>
            </a>

            {/* GitHub */}
            <a
              href={socialLinks.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-row sm:flex-col items-center gap-3 transition-colors w-full sm:w-20"
            >
              <div className="p-4 rounded-xl bg-neutral-800/50 group-hover:bg-white/10 transition-colors border border-neutral-700 group-hover:border-white/30 flex items-center justify-start sm:justify-center w-full">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-neutral-400 group-hover:fill-white transition-colors group-hover:scale-110 duration-300" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2" />
                </svg>
                <span className="ml-2 text-xs sm:text-sm font-mono text-neutral-500 group-hover:text-white transition-colors sm:hidden">
                  {socialLinks.github.label}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-mono text-neutral-500 group-hover:text-white transition-colors">
                {socialLinks.github.label}
              </span>
            </a>
          </div>
        </DraggableWindow>

        {/* ── Gallery Window ── */}
        <DraggableWindow
          title="gallery.jpg"
          isOpen={windows.gallery}
          onClose={() => toggleWindow('gallery')}
          initialPosition={{ x: -20, y: 40 }}
          isMuted={isMuted}
          windowClassName="w-[900px]"
          zIndex={windowZ.gallery}
          onFocus={() => bringWindowToFront('gallery')}
          isMobile={isMobile}
        >
          <div className="px-6 pb-6">
            <h2 className="text-3xl font-mono text-white mb-4 font-bold">
              GALLERY
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg cursor-pointer bg-neutral-800 transition-transform duration-300 ease-out hover:scale-105"
                  onClick={() => openFullSizeImage(image)}
                >
                  <img
                    src={image}
                    alt={`Photo ${index + 1}`}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </DraggableWindow>

        {/* Full Size Image Modal */}
        {fullSizeImage && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
            onClick={closeFullSizeImage}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={fullSizeImage}
                alt="Full size"
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* ── Discord Presence Window ── */}
        <DraggableWindow
          title="discord.exe"
          isOpen={windows.discord}
          onClose={() => toggleWindow('discord')}
          initialPosition={{ x: 40, y: -60 }}
          isMuted={isMuted}
          windowClassName="w-[420px]"
          zIndex={windowZ.discord}
          onFocus={() => bringWindowToFront('discord')}
          isMobile={isMobile}
        >
          <div className="pb-2">
            <DiscordPresenceContent />
          </div>
        </DraggableWindow>

        {/* Mobile Discord Avatar Trigger */}
        <div className="md:hidden">
          <div className="fixed top-5 right-5 z-50">
            <DiscordAvatarTrigger onClick={() => toggleWindow('discord')} />
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">

          {/* Desktop View — Card Window */}
          <div className="hidden md:block w-full max-w-3xl min-h-[450px] bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-xl shadow-2xl animate-fade-in-up flex flex-col overflow-hidden">
            {/* Window Header */}
            <div className="h-10 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between px-4 relative">
              <span className="text-sm font-medium text-neutral-400">home</span>
              <DiscordAvatarTrigger onClick={() => toggleWindow('discord')} />
            </div>

            {/* Window Content */}
            <div className="flex-1 flex flex-col items-center justify-center mt-10 p-12 gap-10">
              <div className="text-center space-y-2">
                <h1 className="text-6xl font-mono text-white tracking-tight">
                  hi!{" "}
                  <DecryptedText
                    key={decryptKey}
                    text="i'm ramlizhafran"
                    animateOn="view"
                    speed={80}
                    maxIterations={15}
                    sequential
                    revealDirection={decryptDirection}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
                    className="font-bold text-white"
                    encryptedClassName="text-neutral-500"
                  />
                </h1>
                <p className="text-xl text-neutral-400 leading-relaxed max-w-lg mx-auto">
                  welcome to a quiet ordinary space
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => toggleWindow('about')}
                  className="px-8 py-4 bg-neutral-800 text-neutral-300 rounded-lg text-base border border-neutral-700 flex flex-col items-center gap-2 transform-gpu"
                  style={btnStyle}
                  {...btnHandlers()}
                >
                  <User size={24} />
                  <span>About</span>
                </button>
                <button
                  onClick={() => toggleWindow('links')}
                  className="px-8 py-4 bg-neutral-800 text-neutral-300 rounded-lg text-base border border-neutral-700 flex flex-col items-center gap-2 transform-gpu"
                  style={btnStyle}
                  {...btnHandlers()}
                >
                  <Link2 size={24} />
                  <span>Links</span>
                </button>
                <button
                  onClick={() => toggleWindow('gallery')}
                  className="px-8 py-4 bg-neutral-800 text-neutral-300 rounded-lg text-base border border-neutral-700 flex flex-col items-center gap-2 transform-gpu"
                  style={btnStyle}
                  {...btnHandlers()}
                >
                  <Images size={24} />
                  <span>Gallery</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile View — No Card */}
          <div className="md:hidden w-full flex flex-col items-center justify-center px-4 py-12 gap-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-mono text-white tracking-tight">
                hi!{" "}
                <DecryptedText
                  key={decryptKey}
                  text="i'm ramlizhafran"
                  animateOn="view"
                  speed={80}
                  maxIterations={15}
                  sequential
                  revealDirection={decryptDirection}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
                  className="font-bold text-white"
                  encryptedClassName="text-neutral-500"
                />
              </h1>
              <p className="text-lg text-neutral-400 leading-relaxed">
                welcome to a quiet ordinary space
              </p>
            </div>

            <div className="w-full flex gap-3">
              <button
                onClick={() => toggleWindow('about')}
                className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-300 rounded-lg text-sm border border-neutral-700 flex flex-col items-center gap-2 transform-gpu"
                style={btnStyle}
                {...btnHandlers(true)}
              >
                <User size={20} />
                <span>About</span>
              </button>
              <button
                onClick={() => toggleWindow('links')}
                className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-300 rounded-lg text-sm border border-neutral-700 flex flex-col items-center gap-2 transform-gpu"
                style={btnStyle}
                {...btnHandlers(true)}
              >
                <Link2 size={20} />
                <span>Links</span>
              </button>
              <button
                onClick={() => toggleWindow('gallery')}
                className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-300 rounded-lg text-sm border border-neutral-700 flex flex-col items-center gap-2 transform-gpu"
                style={btnStyle}
                {...btnHandlers(true)}
              >
                <Images size={20} />
                <span>Gallery</span>
              </button>
            </div>
          </div>

          <footer className="absolute bottom-6 text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} ramlizhafran
          </footer>
        </div>
      </>
    </LanyardProvider>
  );
}

export default App;
