import React, { useState } from 'react';
import { CompassLogo } from '../common/CompassLogo';
import {
  Compass,
  FileQuestion,
  Award,
  BookOpen,
  User,
  MessageSquare,
  Globe,
  Menu,
  X
} from 'lucide-react';

export type ScreenType = 'welcome' | 'dashboard' | 'questionnaire' | 'results' | 'explore' | 'profile';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  onOpenFeedback: () => void;
  hasResults: boolean;
  savedMajorsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  lang,
  onToggleLang,
  onOpenFeedback,
  hasResults,
  savedMajorsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      id: 'dashboard' as ScreenType,
      label_en: 'Dashboard',
      label_ar: 'لوحة التحكم',
      icon: Compass
    },
    {
      id: 'questionnaire' as ScreenType,
      label_en: 'Questionnaire',
      label_ar: 'استبيان التوجيه',
      icon: FileQuestion
    },
    {
      id: 'results' as ScreenType,
      label_en: 'Results',
      label_ar: 'النتائج والتوصيات',
      icon: Award,
      badge: hasResults ? 'Ready' : undefined
    },
    {
      id: 'explore' as ScreenType,
      label_en: 'Explore Majors',
      label_ar: 'دليل التخصصات',
      icon: BookOpen
    },
    {
      id: 'profile' as ScreenType,
      label_en: 'My Profile',
      label_ar: 'ملفي الدراسي',
      icon: User,
      badge: savedMajorsCount > 0 ? `${savedMajorsCount}` : undefined
    }
  ];

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F3D37] text-white shadow-md border-b border-[#1F7A6E]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo brand */}
          <div
            className="cursor-pointer py-1"
            onClick={() => handleNavClick('dashboard')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('dashboard')}
            aria-label="NaviStudo Home"
          >
            <CompassLogo size={34} lightText={true} />
          </div>

          {/* Desktop Navigation Links (anti-slop clean typography) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 text-sm font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors relative ${
                    isActive
                      ? 'bg-[#1F7A6E] text-white font-semibold shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A7D0B8]' : 'text-white/70'}`} />
                  <span>{lang === 'ar' ? item.label_ar : item.label_en}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#A7D0B8] text-[#0F3D37]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions: Language toggle + Feedback button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onToggleLang}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition-colors border border-white/15"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#A7D0B8]" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              title="Provide Developer Feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#A7D0B8]" />
              <span className="hidden lg:inline">{lang === 'ar' ? 'ملاحظات' : 'Feedback'}</span>
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleLang}
              className="p-2 text-white/80 hover:text-white text-xs font-bold"
              aria-label="Toggle language"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-white/30"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A2E29] border-t border-[#1F7A6E]/40 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1F7A6E] text-white font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#A7D0B8]" />
                  <span>{lang === 'ar' ? item.label_ar : item.label_en}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A7D0B8] text-[#0F3D37]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenFeedback();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[#A7D0B8] hover:text-white py-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إرسال ملاحظات المطور' : 'Developer Feedback'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
