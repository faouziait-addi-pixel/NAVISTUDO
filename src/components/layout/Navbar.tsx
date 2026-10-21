import React, { useState } from 'react';
import { CompassLogo } from '../common/CompassLogo';
import { Language } from '../../types/contract';
import { AppUser } from '../../services/auth';
import {
  Compass,
  FileQuestion,
  Award,
  BookOpen,
  User,
  MessageSquare,
  Globe,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  LogIn,
  Home,
  LogOut
} from 'lucide-react';

export type ScreenType = 'welcome' | 'dashboard' | 'questionnaire' | 'results' | 'explore' | 'profile';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenFeedback: () => void;
  onOpenAuth: (initialTab?: 'anonymous' | 'login' | 'register') => void;
  onLogout?: () => void;
  currentUser: AppUser | null;
  hasResults: boolean;
  savedMajorsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  lang,
  onSelectLang,
  onOpenFeedback,
  onOpenAuth,
  onLogout,
  currentUser,
  hasResults,
  savedMajorsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      id: 'welcome' as ScreenType,
      label_en: 'Home',
      label_ar: 'الرئيسية',
      label_fr: 'Accueil',
      icon: Home
    },
    {
      id: 'dashboard' as ScreenType,
      label_en: 'Dashboard',
      label_ar: 'لوحة التحكم',
      label_fr: 'Tableau de bord',
      icon: Compass
    },
    {
      id: 'questionnaire' as ScreenType,
      label_en: 'Questionnaire',
      label_ar: 'استبيان التوجيه',
      label_fr: 'Questionnaire',
      icon: FileQuestion
    },
    {
      id: 'results' as ScreenType,
      label_en: 'Results',
      label_ar: 'النتائج والتوصيات',
      label_fr: 'Recommandations',
      icon: Award,
      badge: hasResults ? (lang === 'fr' ? 'Prêt' : lang === 'ar' ? 'جاهز' : 'Ready') : undefined
    },
    {
      id: 'explore' as ScreenType,
      label_en: 'Explore Majors',
      label_ar: 'دليل التخصصات',
      label_fr: 'Guide des Filières',
      icon: BookOpen
    },
    {
      id: 'profile' as ScreenType,
      label_en: 'My Profile',
      label_ar: 'ملفي الدراسي',
      label_fr: 'Mon Profil',
      icon: User,
      badge: savedMajorsCount > 0 ? `${savedMajorsCount}` : undefined
    }
  ];

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  const getNavLabel = (item: typeof navLinks[0]) => {
    if (lang === 'ar') return item.label_ar;
    if (lang === 'fr') return item.label_fr;
    return item.label_en;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F3D37] text-white shadow-md border-b border-[#1F7A6E]/40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo brand */}
          <div
            className="cursor-pointer py-1"
            onClick={() => handleNavClick('welcome')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('welcome')}
            aria-label="NaviStudo Home"
          >
            <CompassLogo size={34} lightText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 text-sm font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors relative cursor-pointer ${
                    isActive
                      ? 'bg-[#1F7A6E] text-white font-semibold shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A7D0B8]' : 'text-white/70'}`} />
                  <span>{getNavLabel(item)}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#A7D0B8] text-[#0F3D37]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions: Auth + Language + Feedback */}
          <div className="hidden sm:flex items-center gap-2">

            {/* User Auth Button */}
            <button
              onClick={() => onOpenAuth(currentUser ? undefined : 'login')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentUser
                  ? currentUser.isAnonymous
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
                    : 'bg-[#1F7A6E] text-white border border-teal-500 hover:bg-[#155A51]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {currentUser ? (
                currentUser.isAnonymous ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'fr' ? 'Invité (Anonyme)' : 'Guest (Anon)'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A7D0B8]" />
                    <span className="max-w-[90px] truncate">{currentUser.displayName || currentUser.email}</span>
                  </>
                )
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Connexion' : 'Sign In'}</span>
                </>
              )}
            </button>

            {/* Quick Logout Button when connected */}
            {currentUser && onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-200 hover:bg-rose-500/30 border border-rose-400/30 transition-colors cursor-pointer"
                title={lang === 'fr' ? 'Se déconnecter (effacer les données du questionnaire)' : lang === 'ar' ? 'تسجيل الخروج ومسح البيانات' : 'Sign Out & Reset'}
              >
                <LogOut className="w-3.5 h-3.5 text-rose-300" />
                <span className="hidden lg:inline">{lang === 'fr' ? 'Déconnexion' : lang === 'ar' ? 'خروج' : 'Logout'}</span>
              </button>
            )}

            {/* Multi-language segmented control */}
            <div className="flex items-center bg-white/10 p-1 rounded-lg border border-white/15 text-xs font-semibold">
              <button
                onClick={() => onSelectLang('fr')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-[#1F7A6E] text-white shadow-2xs font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Passer en Français"
              >
                FR
              </button>
              <button
                onClick={() => onSelectLang('en')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#1F7A6E] text-white shadow-2xs font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => onSelectLang('ar')}
                className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-[#1F7A6E] text-white shadow-2xs font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
                title="التحويل إلى العربية"
              >
                عربي
              </button>
            </div>

            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#A7D0B8]" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => onOpenAuth(currentUser ? undefined : 'login')}
              className="p-1.5 rounded-lg bg-white/10 text-xs font-bold flex items-center gap-1"
            >
              <User className="w-4 h-4 text-[#A7D0B8]" />
            </button>

            <div className="flex items-center bg-white/10 p-0.5 rounded text-[11px] font-bold">
              <button
                onClick={() => onSelectLang('fr')}
                className={`px-1.5 py-0.5 rounded ${lang === 'fr' ? 'bg-[#1F7A6E] text-white' : 'text-white/70'}`}
              >
                FR
              </button>
              <button
                onClick={() => onSelectLang('en')}
                className={`px-1.5 py-0.5 rounded ${lang === 'en' ? 'bg-[#1F7A6E] text-white' : 'text-white/70'}`}
              >
                EN
              </button>
              <button
                onClick={() => onSelectLang('ar')}
                className={`px-1.5 py-0.5 rounded ${lang === 'ar' ? 'bg-[#1F7A6E] text-white' : 'text-white/70'}`}
              >
                AR
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-white/30 cursor-pointer"
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1F7A6E] text-white font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#A7D0B8]" />
                  <span>{getNavLabel(item)}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A7D0B8] text-[#0F3D37]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 space-y-2">

            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 text-sm text-white hover:text-white py-1.5 px-3 rounded-lg bg-white/10 font-bold"
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>
                {currentUser
                  ? (currentUser.isAnonymous
                      ? (lang === 'fr' ? 'Mode Invité (Anonyme)' : 'Guest Mode')
                      : (currentUser.displayName || currentUser.email))
                  : (lang === 'fr' ? 'Authentification & Accès Anonyme' : 'Sign In / Guest')}
              </span>
            </button>

            {currentUser && onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 text-sm text-rose-300 hover:text-white py-1.5 px-3 rounded-lg bg-rose-500/20 font-bold"
              >
                <LogOut className="w-4 h-4 text-rose-300" />
                <span>{lang === 'fr' ? 'Se déconnecter (effacer mes données)' : lang === 'ar' ? 'تسجيل الخروج ومسح بياناتي' : 'Sign Out & Reset'}</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenFeedback();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-teal-200 hover:text-white py-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'إرسال ملاحظات المطور'
                  : lang === 'fr'
                  ? 'Donner un avis développeur'
                  : 'Developer Feedback'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
