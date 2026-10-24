import React, { useState } from 'react';
import { MountainPathGraphic } from '../common/MountainPathGraphic';
import {
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Sparkles,
  UserCheck,
  LogIn,
  UserPlus,
  ShieldCheck,
  Shield,
  GraduationCap,
  Award,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Stethoscope,
  Building2,
  Scale,
  Brain,
  School
} from 'lucide-react';
import { ScreenType } from '../layout/Navbar';
import { Language } from '../../types/contract';
import { AppUser } from '../../services/auth';

interface WelcomeViewProps {
  onStartQuestionnaire: (presetStage?: 'first_year_secondary' | 'third_year_secondary') => void;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  currentUser?: AppUser | null;
  onOpenAuth?: (tab?: 'anonymous' | 'login' | 'register') => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartQuestionnaire,
  onNavigate,
  lang,
  currentUser,
  onOpenAuth
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(prev => (prev === idx ? null : idx));
  };

  const faqItems = [
    {
      q_fr: "Mes données et mes notes scolaires sont-elles confidentielles ?",
      q_ar: "هل درجاتي وبياناتي المدرسية محمية وبخصوصية تامة؟",
      q_en: "Are my grades and questionnaire answers private and confidential?",
      a_fr: "Absolument. NaviStudo respecte strictement la confidentialité des lycéens. Vos notes ne sont jamais partagées avec des tiers. De plus, lors de votre déconnexion, toutes vos réponses sont immédiatement effacées de votre appareil.",
      a_ar: "نعم، بشكل كامل. تحترم NaviStudo خصوصية التلاميذ ولا تتم مشاركة درجاتك مع أي جهة. عند تسجيل الخروج، يتم مسح بيانات الاستبيان تماماً من جهازك.",
      a_en: "Absolutely. NaviStudo ensures strict student privacy. Your scores are never shared with third parties. Furthermore, when you sign out, all local questionnaire data is safely erased from your device."
    },
    {
      q_fr: "Comment est calculée la compatibilité avec chaque filière universitaire ?",
      q_ar: "كيف يتم حساب نسبة التوافق مع كل تخصص جامعي؟",
      q_en: "How is match affinity calculated for each university major?",
      a_fr: "Notre moteur d'orientation analyse vos notes réelles selon les coefficients officiels du système éducatif algérien, croisées avec vos centres d'intérêt, vos matières favorites et vos préférences de travail (pratique, recherche, management, social).",
      a_ar: "يقوم محرك التوجيه بمطابقة معدلاتك وفق المعاملات الرسمية في المنهاج الجزائري، مدمجة مع ميولك المعرفية، وموادك المفضلة، ونمط العمل الأنسب لشخصيتك.",
      a_en: "Our guidance engine cross-references your real grade ranges using official Algerian curriculum coefficients with your interest areas, favorite subjects, and practical workplace preferences."
    },
    {
      q_fr: "Puis-je passer le test si je suis en 1ère Année Secondaire (Tronc Commun) ?",
      q_ar: "هل يمكنني خوض الاستبيان إذا كنت في السنة الأولى ثانوي (جذع مشترك)؟",
      q_en: "Can I take the test if I am in 1st Year Secondary (Common Core)?",
      a_fr: "Oui ! Un parcours spécifique est dédié au Tronc Commun (Sciences & Technologies ou Lettres) pour vous aider à choisir la meilleure filière de 2ème et 3ème année (Maths, Sciences Expérimentales, Technique Math, Gestion, Lettres & Philo, Langues).",
      a_ar: "نعم بالطبع! توجد مسارات مخصصة لتلاميذ الجذع المشترك (علوم وتكنولوجيا أو آداب) لمساعدتك في اختيار شعبة السنة الثانية والثالثة ثانوي المناسبة لقدراتك.",
      a_en: "Yes! A dedicated adaptive route exists for Common Core students (Science & Tech or Arts) to help select the best 2nd and 3rd year stream with confidence."
    },
    {
      q_fr: "Que faire si je me déconnecte de mon compte ?",
      q_ar: "ماذا يحدث عند تسجيل الخروج من حسابي؟",
      q_en: "What happens when I log out of my account?",
      a_fr: "La déconnexion réinitialise les données locales du questionnaire afin de protéger votre vie privée, particulièrement si vous utilisez un ordinateur partagé au lycée ou dans un cybercafé. Si vous avez un compte, vos données restent sauvegardées dans votre espace Cloud sécurisé.",
      a_ar: "تسجيل الخروج يمسح فوراً البيانات المحلية لحماية خصوصيتك في حال استخدام جهاز مشترك أو في قاعة الإنترنت. إذا كنت مسجلاً، يمكنك استرجاع مسارك لاحقاً من حسابك السحابي.",
      a_en: "Signing out resets the local questionnaire state on your device to ensure privacy on shared computers. If you have an account, your data remains safely stored in your secure Cloud profile."
    }
  ];

  return (
    <div className="space-y-14 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0F3D37] text-white shadow-2xl border border-[#1F7A6E]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text Column */}
          <div className="p-8 sm:p-12 lg:p-14 lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F7A6E]/50 border border-[#A7D0B8]/30 text-xs font-semibold text-[#A7D0B8]">
              <Compass className="w-3.5 h-3.5 text-[#A7D0B8]" />
              <span>
                {lang === 'ar'
                  ? 'المنصة الوطنية للتوجيه المدرسي والجامعي في الجزائر'
                  : lang === 'fr'
                  ? 'Portail d\'Orientation Scolaire & Supérieure · Algérie'
                  : 'Algerian Secondary & Higher Education Guidance Portal'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {lang === 'ar' ? (
                <>
                  اختر مسارك الأكاديمي <br />
                  <span className="text-[#A7D0B8]">بثقة ودقة وتوجيه علمي مدروس</span>
                </>
              ) : lang === 'fr' ? (
                <>
                  Construisez votre avenir <br />
                  <span className="text-[#A7D0B8]">du lycée aux grandes écoles d'Algérie</span>
                </>
              ) : (
                <>
                  Empowering your academic path <br />
                  <span className="text-[#A7D0B8]">from secondary school to Algerian universities</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/85 leading-relaxed max-w-xl">
              {lang === 'ar'
                ? 'تساعدك منصة NaviStudo على اكتشاف الشعب والتخصصات الأنسب لمستواك وميولك: من الجذع المشترك في الأولى ثانوي إلى توجيه البكالوريا والمدارس العليا والجامعات الجزائرية.'
                : lang === 'fr'
                ? 'NaviStudo accompagne les lycéens algériens dans leur choix de filière et d\'études supérieures. Une analyse objective de vos notes réelles, de vos curiosités et de vos talents, sans choix imposé.'
                : 'NaviStudo guides Algerian secondary students through scientifically grounded orientation, matching actual subject mastery, personal interests, and career ambitions.'}
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center">
              <button
                onClick={() => onStartQuestionnaire()}
                className="px-7 py-4 bg-[#1F7A6E] hover:bg-[#A7D0B8] hover:text-[#0F3D37] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>
                  {lang === 'ar'
                    ? 'ابدأ اختبار التوجيه الأكاديمي'
                    : lang === 'fr'
                    ? 'Démarrer le test d\'orientation (Gratuit)'
                    : 'Start Free Orientation Test'}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-2xl border border-white/25 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-[#A7D0B8]" />
                <span>
                  {lang === 'ar'
                    ? 'دليل التخصصات والمدارس'
                    : lang === 'fr'
                    ? 'Consulter le Guide des Filières'
                    : 'Browse Majors Catalog'}
                </span>
              </button>
            </div>

            {/* Reassuring metric highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/10 text-xs text-white/75">
              <div>
                <span className="block font-black text-[#A7D0B8] text-base sm:text-lg">6 Filières</span>
                <span>
                  {lang === 'ar'
                    ? 'شعب البكالوريا الوطنية'
                    : lang === 'fr'
                    ? 'Toutes les filières Bac'
                    : 'All national Bac streams'}
                </span>
              </div>
              <div>
                <span className="block font-black text-[#A7D0B8] text-base sm:text-lg">100% Neutre</span>
                <span>
                  {lang === 'ar'
                    ? 'توجيه موضوعي بلا تحيز'
                    : lang === 'fr'
                    ? 'Sans choix imposé'
                    : 'No forced bias'}
                </span>
              </div>
              <div>
                <span className="block font-black text-[#A7D0B8] text-base sm:text-lg">Sécurisé</span>
                <span>
                  {lang === 'ar'
                    ? 'حماية خصوصية التلميذ'
                    : lang === 'fr'
                    ? 'Effacement à la déconnexion'
                    : 'Data cleared on logout'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Column */}
          <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative min-h-[380px] bg-[#0A2824]">
            <MountainPathGraphic className="w-full h-full" />
            <div className="absolute bottom-4 right-4 bg-[#0F3D37]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#A7D0B8]/30 text-xs text-white shadow-md flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A7D0B8]" />
              <span>
                {lang === 'ar'
                  ? 'مسار الصعود نحو التفوق الجامعي'
                  : lang === 'fr'
                  ? 'Ascension vers votre réussite académique'
                  : 'Climb toward academic excellence'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AUTHENTICATION & QUICK STUDENT ACCESS BANNER */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-[#0F3D37]">
              <Shield className="w-3.5 h-3.5 text-[#1F7A6E]" />
              <span>
                {lang === 'fr'
                  ? 'Espace Élève & Authentification Sécurisée'
                  : lang === 'ar'
                  ? 'فضاء التلميذ وتسجيل الدخول الآمن'
                  : 'Student Account & Access'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F3D37]">
              {currentUser ? (
                currentUser.isAnonymous ? (
                  lang === 'fr' ? 'Session Invité Anonyme Active' : lang === 'ar' ? 'جلسة ضيف مجهول مفعلة' : 'Anonymous Guest Session Active'
                ) : (
                  lang === 'fr' ? `Bienvenue, ${currentUser.displayName || currentUser.email}` : lang === 'ar' ? `مرحباً، ${currentUser.displayName || currentUser.email}` : `Welcome, ${currentUser.displayName || currentUser.email}`
                )
              ) : (
                lang === 'fr' ? 'Accès Immédiat en Mode Invité ou avec Compte' : lang === 'ar' ? 'دخول فوري كضيف أو بحساب تلميذ' : 'Immediate Guest or Account Access'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              {currentUser ? (
                currentUser.isAnonymous ? (
                  lang === 'fr'
                    ? 'Vous naviguez en mode invité. Vos résultats sont actifs pour cette session. À la déconnexion, vos réponses locales sont réinitialisées pour votre confidentialité. Créez un compte permanent pour les synchroniser.'
                    : lang === 'ar'
                    ? 'أنت تتصفح كضيف مجهول. إجاباتك محفوظة لهذه الجلسة. عند الخروج يتم مسح البيانات المحلية لحمايتك. يمكنك إنشاء حساب دائم للاحتفاظ بها.'
                    : 'You are browsing as an anonymous guest. Your answers are saved for this session. When you log out, local data is cleared.'
                ) : (
                  lang === 'fr'
                    ? 'Votre compte est connecté. Vos bilans, favoris et données d\'orientation sont synchronisés dans votre espace sécurisé. Lorsque vous vous déconnectez, vos réponses locales sont effacées de cet appareil.'
                    : lang === 'ar'
                    ? 'حسابك متصل. يتم حفظ استبياناتك وتوصياتك المفضلة على السحابة، وتُمسح البيانات المحلية من الجهاز فور تسجيل الخروج.'
                    : 'Your account is connected. Data syncs to the cloud, and local device state is wiped on sign out.'
                )
              ) : (
                lang === 'fr'
                  ? 'Vous pouvez passer le test d\'orientation sans créer de compte en 1 clic (Accès Anonyme), ou vous connecter / créer un compte pour retrouver vos recommandations plus tard.'
                  : lang === 'ar'
                  ? 'يمكنك خوض الاختبار مباشرة بنقرة واحدة (دخول مجهول بدون كلمة مرور)، أو تسجيل الدخول لحفظ نتائجك ومراجعتها لاحقاً.'
                  : 'Start instantly with 1-click anonymous access, or log in / sign up to save recommendations.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {currentUser ? (
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                <div className="px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {currentUser.isAnonymous
                      ? (lang === 'fr' ? 'Invité (UID Actif)' : 'Guest Active')
                      : (lang === 'fr' ? 'Compte vérifié' : 'Verified Student')}
                  </span>
                </div>
                {onOpenAuth && (
                  <button
                    onClick={() => onOpenAuth(currentUser.isAnonymous ? 'register' : 'login')}
                    className="px-4 py-2.5 bg-[#0F3D37] hover:bg-[#1F7A6E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {currentUser.isAnonymous
                      ? (lang === 'fr' ? 'Créer compte permanent' : 'Upgrade Account')
                      : (lang === 'fr' ? 'Gérer mon compte' : 'Manage Account')}
                  </button>
                )}
              </div>
            ) : (
              <>
                {onOpenAuth && (
                  <button
                    onClick={() => onOpenAuth('anonymous')}
                    className="flex-1 sm:flex-initial px-4 py-3 bg-teal-50 hover:bg-teal-100 text-[#0F3D37] border border-teal-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-[#1F7A6E]" />
                    <span>{lang === 'fr' ? 'Accès Anonyme (1 clic)' : lang === 'ar' ? 'دخول مجهول فوري' : 'Anonymous Guest'}</span>
                  </button>
                )}

                {onOpenAuth && (
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="flex-1 sm:flex-initial px-4 py-3 bg-white hover:bg-slate-50 text-[#0F3D37] border border-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-slate-600" />
                    <span>{lang === 'fr' ? 'Connexion (Sign In)' : lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>
                )}

                {onOpenAuth && (
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full sm:w-auto px-5 py-3 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Créer un compte' : lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. TWO ACADEMIC ENTRY ROUTES: 1AS AND 3AS BAC */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'المسارات الأكاديمية' : lang === 'fr' ? 'Deux parcours adaptés' : 'Two Academic Routes'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F3D37]">
            {lang === 'ar'
              ? 'اختر مستواك الدراسي للانطلاق'
              : lang === 'fr'
              ? 'Choisissez votre cycle d\'orientation'
              : 'Select Your Academic Stage'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {lang === 'ar'
              ? 'يتكيف استبيان NaviStudo آلياً مع مقررات المنهاج الجزائري الرسمي لكل مستوى.'
              : lang === 'fr'
              ? 'Le test s\'adapte aux spécificités de chaque cycle : Tronc Commun en 1AS ou filières officielles du Baccalauréat en 3AS.'
              : 'The test dynamically adapts questions to official Algerian secondary school curricula.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: 1AS Tronc Commun */}
          <div className="bg-white rounded-3xl p-7 shadow-xs border border-slate-200 hover:border-[#1F7A6E] transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#A7D0B8]/30 text-[#0F3D37] flex items-center justify-center font-black text-xl group-hover:bg-[#1F7A6E] group-hover:text-white transition-colors">
                  1AS
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {lang === 'fr' ? 'Tronc Commun' : lang === 'ar' ? 'جذع مشترك' : 'Common Core'}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
                  {lang === 'ar' ? 'المسار أ · الأولى ثانوي' : lang === 'fr' ? 'Parcours A · 1ère Année Secondaire' : 'Route A · 1st Year'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F3D37] mt-1">
                  {lang === 'ar' ? 'الجذع المشترك علوم أو آداب' : lang === 'fr' ? 'Tronc Commun Sciences & Lettres' : 'Science & Arts Common Core'}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {lang === 'ar'
                  ? 'مخصص لتلاميذ السنة الأولى ثانوي لاختيار الشعبة الأنسب في السنة الثانية (رياضيات، علوم تجريبية، تقني رياضي، تسيير واقتصاد، آداب وفلسفة، لغات أجنبية).'
                  : lang === 'fr'
                  ? 'Conçu pour orienter les élèves de 1AS vers leur future filière de 2ème et 3ème année. Détecte vos aptitudes réelles en sciences, logique ou lettres sans angoisse.'
                  : 'Tailored for 1st year secondary students to select the ideal 2nd/3rd year stream based on genuine strengths and curiosity.'}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E] shrink-0" />
                  <span>{lang === 'fr' ? 'TC Sciences & Technologies ou TC Lettres' : 'TC Sciences or TC Letters'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E] shrink-0" />
                  <span>{lang === 'fr' ? 'Analyse des matières fortes et difficultés' : 'Subject strengths & difficulty analysis'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E] shrink-0" />
                  <span>{lang === 'fr' ? 'Aucune pression de choix universitaire prématuré' : 'No premature university choice stress'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartQuestionnaire('first_year_secondary')}
              className="mt-6 w-full py-3 px-4 bg-[#F7F6F2] hover:bg-[#1F7A6E] text-[#0F3D37] hover:text-white font-bold text-sm rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {lang === 'ar'
                  ? 'بدء استبيان الأولى ثانوي (1AS)'
                  : lang === 'fr'
                  ? 'Commencer l\'orientation 1AS'
                  : 'Start 1st Year Guidance'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: 3AS Baccalauréat */}
          <div className="bg-white rounded-3xl p-7 shadow-xs border border-slate-200 hover:border-[#1F7A6E] transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#0F3D37] text-[#A7D0B8] flex items-center justify-center font-black text-xl group-hover:bg-[#1F7A6E] group-hover:text-white transition-colors">
                  3AS
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {lang === 'fr' ? 'Baccalauréat & Supérieur' : lang === 'ar' ? 'البكالوريا والجامعة' : 'BAC & Higher Ed'}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
                  {lang === 'ar' ? 'المسارات ب / ج / د · البكالوريا' : lang === 'fr' ? 'Parcours B/C/D · 3ème Année Secondaire' : 'Routes B/C/D · Terminale'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F3D37] mt-1">
                  {lang === 'ar' ? 'شهادة البكالوريا والتوجيه الجامعي' : lang === 'fr' ? 'Baccalauréat & Enseignement Supérieur' : 'Baccalaureate & University Guidance'}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {lang === 'ar'
                  ? 'لجميع الشعب: علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد، آداب وفلسفة، لغات أجنبية. يطابق درجاتك ومعدلك مع كليات الطب، المدارس العليا (ESI, ENS, EPAU...) والتخصصات الجامعية.'
                  : lang === 'fr'
                  ? 'Pour les 6 filières du Baccalauréat algérien. Calcule votre affinité avec les facultés de médecine, les écoles nationales supérieures d\'ingénieurs (ESI, Polytech, EPAU), le droit, l\'économie et les sciences.'
                  : 'For all 6 Algerian Baccalaureate streams. Matches grades and preferences to Medicine, Engineering, ENS, and university faculties.'}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E] shrink-0" />
                  <span>{lang === 'fr' ? 'Prise en compte des notes clés et moyenne au Bac' : 'Key subject grades and Baccalaureate GPA'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E] shrink-0" />
                  <span>{lang === 'fr' ? 'Écoles Nationales Supérieures (ESI, EPAU, ENS, ENSIA)' : 'National Higher Schools in Algeria'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E] shrink-0" />
                  <span>{lang === 'fr' ? 'Recommandations transparentes avec débouchés métiers' : 'Transparent recommendations & career outcomes'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartQuestionnaire('third_year_secondary')}
              className="mt-6 w-full py-3 px-4 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>
                {lang === 'ar'
                  ? 'بدء استبيان البكالوريا والتوجيه (3AS)'
                  : lang === 'fr'
                  ? 'Commencer l\'orientation Baccalauréat'
                  : 'Start Baccalaureate Guidance'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HIGHER EDUCATION PANORAMA IN ALGERIA */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
            <School className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'التعليم العالي في الجزائر' : lang === 'fr' ? 'Panorama Supérieur Algérien' : 'Higher Education Sectors'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F3D37]">
            {lang === 'ar'
              ? 'المدارس العليا والجامعات المتاحة'
              : lang === 'fr'
              ? 'Les Grands Pôles Universitaires & Grandes Écoles'
              : 'Key Higher Education Hubs in Algeria'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {lang === 'ar'
              ? 'تغطي المنصة مختلف المسارات الوطنية لتوجيه الطلبة نحو الكليات والمدارس الأكثر مطابقة لملفهم.'
              : lang === 'fr'
              ? 'Découvrez les filières et institutions ciblées par nos algorithmes de recommandation.'
              : 'Discover academic pathways referenced in our orientation engine.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Hub 1: Tech & Engineering */}
          <div className="p-5 rounded-2xl bg-[#F7F6F2] border border-slate-200 hover:border-[#1F7A6E] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F3D37] text-[#A7D0B8] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#0F3D37] text-base">
              {lang === 'fr' ? 'Ingénierie & Numérique' : lang === 'ar' ? 'الهندسة والتكنولوجيا' : 'Engineering & Tech'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'fr'
                ? 'ESI Alger, ENSIA Sidi Abdellah, Polytech Alger/Oran/Constantine, EPAU Architecture, USTHB Bab Ezzouar.'
                : 'ESI, Polytech, EPAU, ENSIA, USTHB Bab Ezzouar.'}
            </p>
            <div className="text-[11px] font-bold text-[#1F7A6E]">
              {lang === 'fr' ? 'Maths, Technique Math, Sciences' : 'Maths, Tech Math, Sciences'}
            </div>
          </div>

          {/* Hub 2: Health & Medicine */}
          <div className="p-5 rounded-2xl bg-[#F7F6F2] border border-slate-200 hover:border-[#1F7A6E] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F7A6E] text-white flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#0F3D37] text-base">
              {lang === 'fr' ? 'Sciences Médicales' : lang === 'ar' ? 'العلوم الطبية والصيدلة' : 'Medical Sciences'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'fr'
                ? 'Facultés de Médecine d\'Alger, Oran, Constantine, Tizi Ouzou, Sétif : Médecine générale, Pharmacie, Dentaire.'
                : 'Faculties of Medicine: General Medicine, Pharmacy, Dentistry.'}
            </p>
            <div className="text-[11px] font-bold text-[#1F7A6E]">
              {lang === 'fr' ? 'Sciences Expérimentales, Maths' : 'Experimental Sciences, Maths'}
            </div>
          </div>

          {/* Hub 3: Economy & Management */}
          <div className="p-5 rounded-2xl bg-[#F7F6F2] border border-slate-200 hover:border-[#1F7A6E] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F3D37] text-[#A7D0B8] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#0F3D37] text-base">
              {lang === 'fr' ? 'Économie & Commerce' : lang === 'ar' ? 'التسيير والعلوم الاقتصادية' : 'Economics & Business'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'fr'
                ? 'HEC Alger, ESC Koléa, ENSSEA, Facultés des Sciences Économiques, Finance, Comptabilité et Audit.'
                : 'HEC Alger, ESC Kolea, Faculties of Economics and Finance.'}
            </p>
            <div className="text-[11px] font-bold text-[#1F7A6E]">
              {lang === 'fr' ? 'Gestion & Économie, Maths' : 'Management & Economics, Maths'}
            </div>
          </div>

          {/* Hub 4: Law, Languages & Human Sciences */}
          <div className="p-5 rounded-2xl bg-[#F7F6F2] border border-slate-200 hover:border-[#1F7A6E] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F7A6E] text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#0F3D37] text-base">
              {lang === 'fr' ? 'Droit, Langues & ENS' : lang === 'ar' ? 'الحقوق، اللغات والآداب' : 'Law, Humanities & ENS'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'fr'
                ? 'ENS Bouzaréah (Enseignement), Droit & Sciences Politiques, Traduction, Langues Étrangères (Anglais, Espagnol, Allemand).'
                : 'ENS Bouzareah, Faculty of Law, Foreign Languages & Translation.'}
            </p>
            <div className="text-[11px] font-bold text-[#1F7A6E]">
              {lang === 'fr' ? 'Lettres & Philo, Langues, Toutes filières' : 'Letters & Philosophy, Languages'}
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW NAVISTUDO WORKS: 3 SIMPLE STEPS */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'منهجية التوجيه' : lang === 'fr' ? 'Méthodologie en 3 étapes' : 'Guidance Methodology'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F3D37]">
            {lang === 'ar'
              ? 'كيف تصل إلى توصيتك المثالية؟'
              : lang === 'fr'
              ? 'Comment fonctionne le test d\'orientation ?'
              : 'How the Orientation Process Works'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {lang === 'ar'
              ? 'عملية علمية بسيطة وسريعة من 5 إلى 7 دقائق تقودك إلى رؤية واضحة لمستقبلك.'
              : lang === 'fr'
              ? 'Une démarche transparente en 3 étapes clés sans questionnaires interminables.'
              : 'A transparent, objective 3-step evaluation that respects your profile.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#F7F6F2] border border-slate-200 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#0F3D37] text-white flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="font-extrabold text-[#0F3D37] text-base">
              {lang === 'ar' ? '1. تقييم درجاتك ومستواك' : lang === 'fr' ? '1. Diagnostic des notes réelles' : '1. Real Grade Diagnostic'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'ar'
                ? 'أدخل مجالات علاماتك في المواد الأساسية (0 إلى 20) ومعدل البكالوريا لتقييم واقعي لمؤهلاتك الأكاديمية.'
                : lang === 'fr'
                ? 'Indiquez vos plages de notes réelles sur l\'échelle 0 à 20 dans les matières clés du programme officiel algérien.'
                : 'Enter your real score ranges (0 to 20) in core subjects based on the Algerian curriculum.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F6F2] border border-slate-200 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#1F7A6E] text-white flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="font-extrabold text-[#0F3D37] text-base">
              {lang === 'ar' ? '2. تحديد الميول ونمط العمل' : lang === 'fr' ? '2. Centres d\'intérêt & style' : '2. Interests & Workplace Style'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'ar'
                ? 'استكشف بيئات العمل المفضلة: المختبر، البرمجة، العمل الميداني، المستشفيات، أو ريادة الأعمال.'
                : lang === 'fr'
                ? 'Choisissez ce qui vous passionne : technologie, santé, recherche, justice, contact humain ou créativité.'
                : 'Select the environments and problems you genuinely enjoy solving.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F6F2] border border-slate-200 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#A7D0B8] text-[#0F3D37] flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="font-extrabold text-[#0F3D37] text-base">
              {lang === 'ar' ? '3. تقرير التوصيات والبدائل' : lang === 'fr' ? '3. Recommandations & Débouchés' : '3. Custom Recommendations'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'ar'
                ? 'احصل على تصنيف دقيق للتخصصات المتطابقة مع نسب مئوية، شروط القبول الوطنية، وفرص العمل الحقيقية.'
                : lang === 'fr'
                ? 'Recevez votre rapport personnalisé avec taux de compatibilité, exigences académiques et perspectives de carrière.'
                : 'Receive a personalized match report with compatibility scores and career pathways.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الأسئلة الشائعة' : lang === 'fr' ? 'Questions Fréquentes' : 'FAQ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F3D37]">
            {lang === 'ar'
              ? 'كل ما يهمك حول التوجيه على NaviStudo'
              : lang === 'fr'
              ? 'Foire Aux Questions des Lycéens'
              : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            {lang === 'ar'
              ? 'إجابات واضحة ومباشرة عن الاستبيان والخصوصية والتوجيه الجامعي في الجزائر.'
              : lang === 'fr'
              ? 'Des réponses claires pour aborder votre orientation avec sérénité.'
              : 'Answers to the most common questions regarding student guidance.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 pt-2">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            const q = lang === 'ar' ? item.q_ar : lang === 'fr' ? item.q_fr : item.q_en;
            const a = lang === 'ar' ? item.a_ar : lang === 'fr' ? item.a_fr : item.a_en;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors bg-[#F7F6F2]/50"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-[#0F3D37] text-sm sm:text-base cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <span className="flex-1">{q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#1F7A6E] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4B5563] leading-relaxed border-t border-slate-200/60 bg-white">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="rounded-3xl bg-gradient-to-br from-[#0F3D37] to-[#1F7A6E] text-white p-8 sm:p-12 shadow-xl text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {lang === 'ar'
              ? 'جاهز لاكتشاف مستقبلك الأكاديمي؟'
              : lang === 'fr'
              ? 'Prêt à construire votre orientation avec certitude ?'
              : 'Ready to build your academic journey with certainty?'}
          </h2>
          <p className="text-xs sm:text-base text-white/85 leading-relaxed">
            {lang === 'ar'
              ? 'ابدأ الاستبيان الآن مجاناً وبدون تعقيدات، واحصل على تقرير توجيه مفصل يتطابق مع قدراتك الحقيقية.'
              : lang === 'fr'
              ? 'Prenez 5 minutes pour évaluer vos forces, comparer les filières et prendre les meilleures décisions pour votre Baccalauréat et vos études supérieures.'
              : 'Spend 5 minutes assessing your strengths and finding your highest matching fields in Algeria.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onStartQuestionnaire()}
            className="w-full sm:w-auto px-8 py-4 bg-[#A7D0B8] hover:bg-white text-[#0F3D37] font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>
              {lang === 'ar' ? 'ابدأ الاستبيان الآن' : lang === 'fr' ? 'Lancer mon test d\'orientation' : 'Start Orientation Now'}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-2xl border border-white/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-[#A7D0B8]" />
            <span>
              {lang === 'ar' ? 'لوحة التحكم والمتابعة' : lang === 'fr' ? 'Accéder au Tableau de bord' : 'Go to Dashboard'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
