import React from 'react';
import { MountainPathGraphic } from '../common/MountainPathGraphic';
import { CompassLogo } from '../common/CompassLogo';
import {
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { ScreenType } from '../layout/Navbar';

interface WelcomeViewProps {
  onStartQuestionnaire: (presetStage?: 'first_year_secondary' | 'third_year_secondary') => void;
  onNavigate: (screen: ScreenType) => void;
  lang: 'en' | 'ar';
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartQuestionnaire,
  onNavigate,
  lang
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0F3D37] text-white shadow-xl border border-[#1F7A6E]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text Column */}
          <div className="p-8 sm:p-12 lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1F7A6E]/40 border border-[#A7D0B8]/30 text-xs font-semibold text-[#A7D0B8]">
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المنصة الوطنية للتوجيه المدرسي والجامعي' : 'National Secondary & Higher Education Orientation'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {lang === 'ar' ? (
                <>
                  اختر مسارك الأكاديمي <br />
                  <span className="text-[#A7D0B8]">بوضوح وثقة وتوجيه مدروس</span>
                </>
              ) : (
                <>
                  Navigate your academic future <br />
                  <span className="text-[#A7D0B8]">with clarity, purpose & evidence</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              {lang === 'ar'
                ? 'تساعدك NaviStudo على اكتشاف الشعب الدراسية والتخصصات الجامعية التي تتوافق مع أدائك الدراسي الفعلي، ميولك الشخصية، وطبيعة التحديات التي تفضل حلها.'
                : 'NaviStudo guides Algerian secondary students through scientifically structured orientation, analyzing real subject performance, genuine interests, and future aspirations without forcing premature decisions.'}
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center">
              <button
                onClick={() => onStartQuestionnaire()}
                className="px-7 py-3.5 bg-[#1F7A6E] hover:bg-[#A7D0B8] hover:text-[#0F3D37] text-white font-bold text-base rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{lang === 'ar' ? 'ابدأ الاستبيان الآن' : 'Start Orientation Questionnaire'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-[#A7D0B8]" />
                <span>{lang === 'ar' ? 'تصفح دليل التخصصات' : 'Browse Majors Catalog'}</span>
              </button>
            </div>

            {/* Reassuring anti-slop metric highlights */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-xs text-white/70">
              <div>
                <span className="block font-bold text-[#A7D0B8] text-base">4 Routes</span>
                <span>{lang === 'ar' ? 'مسارات مخصصة لكل سنة' : 'Adaptive pathway logic'}</span>
              </div>
              <div>
                <span className="block font-bold text-[#A7D0B8] text-base">100% Confidential</span>
                <span>{lang === 'ar' ? 'بياناتك ملكك بالكامل' : 'Private student profile'}</span>
              </div>
              <div>
                <span className="block font-bold text-[#A7D0B8] text-base">Unbiased</span>
                <span>{lang === 'ar' ? 'توجيه موضوعي دقيق' : 'No forced choices'}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Column */}
          <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative min-h-[380px] bg-[#0A2824]">
            <MountainPathGraphic className="w-full h-full" />
            <div className="absolute bottom-4 right-4 bg-[#0F3D37]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#A7D0B8]/30 text-xs text-white shadow-md flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A7D0B8]" />
              <span>{lang === 'ar' ? 'منهجية مستوحاة من مسار الصعود والنجاح' : 'Ascent-path academic guidance'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Entry Routes Selection Cards */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D37]">
            {lang === 'ar' ? 'اختر مستواك الدراسي للانطلاق' : 'Select Your Current Academic Stage'}
          </h2>
          <p className="text-sm text-[#4B5563]">
            {lang === 'ar'
              ? 'يتم تكييف أسئلة الاستبيان آلياً وفق مرحلتك، مع احترام معايير المنهاج الجزائري الرسمي.'
              : 'The questionnaire automatically customizes question flows, subjects, and fields according to your stage.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: 1st Year Secondary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-[#1F7A6E] transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#A7D0B8]/30 text-[#0F3D37] flex items-center justify-center font-bold text-xl group-hover:bg-[#1F7A6E] group-hover:text-white transition-colors">
                1AS
              </div>
              <div>
                <span className="text-xs font-semibold text-[#1F7A6E] uppercase tracking-wider">
                  {lang === 'ar' ? 'الجذع المشترك' : 'Route A · Common Core'}
                </span>
                <h3 className="text-xl font-bold text-[#0F3D37] mt-0.5">
                  {lang === 'ar' ? 'السنة الأولى ثانوي' : 'First Year Secondary (1AS)'}
                </h3>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {lang === 'ar'
                  ? 'اختر بين الجذع المشترك علوم وتكنولوجيا أو آداب. استكشف المواد المفضلة ومجالات الفضول المعرفي لتحديد الشعبة الأنسب للسنة الثانية والثالثة ثانوي.'
                  : 'Tailored for Common Core Science & Tech or Arts. Focuses on subject mastery, intellectual curiosity, and exploration for stream selection.'}
              </p>
              <ul className="space-y-2 text-xs text-[#4B5563] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E]" />
                  <span>{lang === 'ar' ? 'استكشاف التوجه العلمي أو الأدبي' : 'Explore Scientific vs Literary core streams'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E]" />
                  <span>{lang === 'ar' ? 'لا يتطلب أهدافاً جامعية مسبقة' : 'No premature university goal pressure'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onStartQuestionnaire('first_year_secondary')}
              className="mt-6 w-full py-2.5 px-4 bg-[#F7F6F2] hover:bg-[#1F7A6E] text-[#0F3D37] hover:text-white font-semibold text-sm rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'بدء استبيان الأولى ثانوي' : 'Start 1st Year Guidance'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: 3rd Year Secondary / Bac */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-[#1F7A6E] transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0F3D37] text-[#A7D0B8] flex items-center justify-center font-bold text-xl group-hover:bg-[#1F7A6E] group-hover:text-white transition-colors">
                3AS
              </div>
              <div>
                <span className="text-xs font-semibold text-[#1F7A6E] uppercase tracking-wider">
                  {lang === 'ar' ? 'شهادة البكالوريا والتوجيه الجامعي' : 'Routes B, C, D · Baccalaureate'}
                </span>
                <h3 className="text-xl font-bold text-[#0F3D37] mt-0.5">
                  {lang === 'ar' ? 'السنة الثالثة ثانوي (البكالوريا)' : 'Third Year Secondary (3AS / BAC)'}
                </h3>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {lang === 'ar'
                  ? 'لجميع الشعب: علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد، لغات، آداب وفلسفة. تحليل دقيق للشعب الجامعية والمدارس العليا والمهن.'
                  : 'Covers all 6 national branches with adaptive branches for Clear Goals, General Directions, or Discovery mode with scale preferences.'}
              </p>
              <ul className="space-y-2 text-xs text-[#4B5563] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E]" />
                  <span>{lang === 'ar' ? 'تحليل معدل البكالوريا والمواد الأساسية' : 'BAC average and subject performance analysis'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1F7A6E]" />
                  <span>{lang === 'ar' ? 'توصيات كليات الطب، المدارس العليا، والهندسة' : 'Medicine, Engineering, ENS, and University paths'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onStartQuestionnaire('third_year_secondary')}
              className="mt-6 w-full py-2.5 px-4 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{lang === 'ar' ? 'بدء استبيان البكالوريا والتوجيه' : 'Start Baccalaureate Guidance'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How it works features */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
        <h2 className="text-xl font-bold text-[#0F3D37] text-center">
          {lang === 'ar' ? 'كيف تعمل منصة NaviStudo؟' : 'The NaviStudo Guidance Methodology'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#A7D0B8]/30 text-[#0F3D37] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-[#0F3D37]">
              {lang === 'ar' ? 'أداء أكاديمي واقعي' : 'Objective Performance'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'ar'
                ? 'تقييم درجات المواد ومستويات الصعوبة وفق مقياس علامات 0 إلى 20 دون تعقيدات.'
                : 'Captures actual score ranges (0 to 20) and separates difficult subjects from preferences.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#A7D0B8]/30 text-[#0F3D37] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-[#0F3D37]">
              {lang === 'ar' ? 'مسارات ذكية مرنة' : 'Adaptive Branching'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'ar'
                ? 'يميز النظام بين من يملك هدفاً دقيقاً، ومن يبحث عن اتجاه عام، ومن يرغب في الاستكشاف الخالص.'
                : 'Adapts dynamically to clear goals, general inclinations, or students discovering options from scratch.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#A7D0B8]/30 text-[#0F3D37] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-[#0F3D37]">
              {lang === 'ar' ? 'تفسير شفاف للتوصيات' : 'Transparent Reasoning'}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {lang === 'ar'
                ? 'شرح معلل لكل تخصص يوضح أسباب التوافق والمواد المطلوبة وفرص العمل الحقيقية.'
                : 'Every recommendation is accompanied by transparent rationale grounded in curriculum requirements.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
