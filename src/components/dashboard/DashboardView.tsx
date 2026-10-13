import React, { useState } from 'react';
import { MountainPathGraphic } from '../common/MountainPathGraphic';
import {
  Compass,
  Search,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Bookmark
} from 'lucide-react';
import { ScreenType } from '../layout/Navbar';
import { MajorRecommendation } from '../../types/contract';
import { MAJORS_DATABASE } from '../../data/majorsDatabase';

interface DashboardViewProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectMajor: (majorId: string) => void;
  hasProfile: boolean;
  completionPercentage: number;
  currentStageId?: string;
  currentBranchId?: string;
  recommendations: MajorRecommendation[];
  bookmarkedMajorIds: string[];
  lang: 'en' | 'ar';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectMajor,
  hasProfile,
  completionPercentage,
  currentStageId,
  currentBranchId,
  recommendations,
  bookmarkedMajorIds,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter majors if search query entered
  const filteredMajors = searchQuery.trim()
    ? MAJORS_DATABASE.filter(m =>
        m.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title_ar.includes(searchQuery) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const getBranchLabel = (id?: string) => {
    switch (id) {
      case 'experimental_sciences': return lang === 'ar' ? 'علوم تجريبية' : 'Experimental Sciences';
      case 'mathematics': return lang === 'ar' ? 'رياضيات' : 'Mathematics';
      case 'mathematical_technique': return lang === 'ar' ? 'تقني رياضي' : 'Technical Math';
      case 'management_and_economics': return lang === 'ar' ? 'تسيير واقتصاد' : 'Economics & Mgmt';
      case 'foreign_languages': return lang === 'ar' ? 'لغات أجنبية' : 'Foreign Languages';
      case 'literature_and_philosophy': return lang === 'ar' ? 'آداب وفلسفة' : 'Literature & Philosophy';
      default: return id || (lang === 'ar' ? 'غير محدد' : 'General');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Search Header Bar */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث عن تخصص جامعي، كلية، أو شعبة...' : 'Search majors, faculties, or disciplines...'}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-[#0F3D37] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1F7A6E]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37] flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'فهرس التخصصات الكامل' : 'Browse All Majors'}</span>
          </button>
        </div>
      </div>

      {/* Search Results Dropdown Preview if typing */}
      {searchQuery.trim() && (
        <div className="bg-white rounded-xl p-4 shadow-lg border border-[#A7D0B8] space-y-2 animate-in fade-in duration-150">
          <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
            {lang === 'ar' ? 'نتائج البحث السريع' : 'Search Matches'} ({filteredMajors.length})
          </div>
          {filteredMajors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {filteredMajors.map((m) => (
                <div
                  key={m.major_id}
                  onClick={() => onSelectMajor(m.major_id)}
                  className="p-3 rounded-lg border border-slate-100 hover:border-[#1F7A6E] hover:bg-[#F7F6F2] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#0F3D37]">{lang === 'ar' ? m.title_ar : m.title_en}</h4>
                    <p className="text-xs text-[#4B5563] mt-0.5 capitalize">{m.category} · {m.study_duration_years} Years</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#1F7A6E] shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-2">
              {lang === 'ar' ? 'لم يتم العثور على تخصص مطابق. حاول البحث بكلمة أخرى.' : 'No matching majors found. Try another search term.'}
            </p>
          )}
        </div>
      )}

      {/* Dark Green Hero Banner matching visual reference */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0F3D37] text-white shadow-xl border border-[#1F7A6E]/30">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-8 sm:p-10 md:col-span-8 space-y-4 z-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#A7D0B8]">
              <Compass className="w-4 h-4" />
              <span>{hasProfile ? (lang === 'ar' ? 'مرحباً بك مجدداً في مسارك' : 'Welcome to your guidance journey') : (lang === 'ar' ? 'ابدأ رحلة التوجيه' : 'Start your guidance path')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {hasProfile ? (
                <>
                  {lang === 'ar' ? 'ملفك الأكاديمي قيد المتابعة' : 'Your Academic Profile is Active'}
                  <span className="block text-[#A7D0B8] text-xl sm:text-2xl mt-1 font-semibold">
                    {currentStageId === 'first_year_secondary'
                      ? (lang === 'ar' ? 'السنة الأولى ثانوي (جذع مشترك)' : 'First Year Secondary (Common Core)')
                      : `${lang === 'ar' ? 'شعبة:' : 'Branch:'} ${getBranchLabel(currentBranchId)}`}
                  </span>
                </>
              ) : (
                <>
                  {lang === 'ar' ? 'اكتشف مستقبلك الدراسي والجامعي' : 'Discover Your Academic Direction'}
                  <span className="block text-[#A7D0B8] text-xl sm:text-2xl mt-1 font-semibold">
                    {lang === 'ar' ? 'توجيه علمي مبني على قدراتك واهتماماتك' : 'Empowered by real subject scores & aspirations'}
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
              {hasProfile && recommendations.length > 0
                ? (lang === 'ar'
                    ? 'تم توليد توصياتك الأكاديمية بنجاح بناءً على إجابات الاستبيان. يمكنك استعراضها، حفظ التخصصات، أو تحديث معطياتك في أي وقت.'
                    : 'Your recommendations are ready based on your completed profile. Explore matched majors, bookmark top choices, or re-evaluate your preferences.')
                : (lang === 'ar'
                    ? 'أجب عن استبيان التوجيه المدرسي في بضع دقائق للحصول على تحليل مخصص ومطابقة دقيقة للشعب والتخصصات الجامعية.'
                    : 'Complete the structured guidance questionnaire to unlock tailored academic pathways and university recommendations.')}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              {recommendations.length > 0 ? (
                <>
                  <button
                    onClick={() => onNavigate('results')}
                    className="px-5 py-2.5 bg-[#1F7A6E] hover:bg-[#A7D0B8] hover:text-[#0F3D37] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'عرض التوصيات والنتائج' : 'View Recommendations'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('questionnaire')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-colors flex items-center gap-2"
                  >
                    <span>{lang === 'ar' ? 'إعادة الاستبيان / تعديل' : 'Edit Questionnaire'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onNavigate('questionnaire')}
                  className="px-6 py-3 bg-[#1F7A6E] hover:bg-[#A7D0B8] hover:text-[#0F3D37] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'بدء استبيان التوجيه' : 'Start Guidance Questionnaire'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-4 h-56 sm:h-64 md:h-full relative bg-[#0B2A26] min-h-[220px]">
            <MountainPathGraphic className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* Profile Completion / Status Section */}
      <section className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${completionPercentage === 100 ? 'text-emerald-600' : 'text-[#1F7A6E]'}`} />
              <h3 className="text-base font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'حالة تقدم التوجيه الدراسي' : 'Orientation Guidance Status'}
              </h3>
            </div>
            <p className="text-xs text-[#4B5563]">
              {hasProfile
                ? (completionPercentage === 100
                    ? (lang === 'ar' ? 'اكتملت جميع أقسام الاستبيان بنجاح.' : 'Profile complete and ready for exploration.')
                    : (lang === 'ar' ? 'الاستبيان مكتمل جزئياً.' : 'Questionnaire partially completed.'))
                : (lang === 'ar' ? 'لم تبدأ الاستبيان بعد. ابدأ الآن لاكتشاف مسارك.' : 'No profile data yet. Take the questionnaire to get started.')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-40 sm:w-48 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-[#0F3D37]">
                <span>{lang === 'ar' ? 'الإنجاز' : 'Completion'}</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1F7A6E] rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onNavigate('profile')}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37] border border-slate-200 hover:border-[#1F7A6E] rounded-lg transition-colors whitespace-nowrap"
            >
              {lang === 'ar' ? 'عرض الملف' : 'View Profile'}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content: Recommendations or Guidance Pathway Preview */}
      {recommendations.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'أفضل التخصصات المطابقة لملفك' : 'Top Recommended Majors for You'}
              </h2>
              <p className="text-xs text-[#4B5563]">
                {lang === 'ar' ? 'مرتبة وفق أعلى درجات التوافق مع إجاباتك' : 'Ranked according to highest compatibility with your answers'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('results')}
              className="text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37] flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'عرض كافة النتائج' : 'See all recommendations'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendations.slice(0, 3).map((rec, index) => {
              const isSaved = bookmarkedMajorIds.includes(rec.major_id);
              return (
                <div
                  key={rec.major_id}
                  className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:border-[#1F7A6E] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#4B5563]">
                      <span className="font-bold text-[#1F7A6E]">#{index + 1} Match</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {rec.match_score}%
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#0F3D37] line-clamp-2">
                      {lang === 'ar' ? rec.title_ar : rec.title_en}
                    </h3>

                    <p className="text-xs text-[#4B5563] line-clamp-3 leading-relaxed">
                      {lang === 'ar' ? rec.explanation_ar : rec.explanation_en}
                    </p>

                    <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.study_duration_years} {lang === 'ar' ? 'سنوات دراسة' : 'Years'}</span>
                      <span>·</span>
                      <span className="capitalize">{rec.category}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectMajor(rec.major_id)}
                      className="text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37] flex items-center gap-1"
                    >
                      <span>{lang === 'ar' ? 'التفاصيل الكاملة' : 'View Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {isSaved && (
                      <span className="text-[11px] text-[#1F7A6E] flex items-center gap-1 font-medium">
                        <Bookmark className="w-3 h-3 fill-current" />
                        <span>{lang === 'ar' ? 'محفوظ' : 'Saved'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        /* Empty state for new users */
        <section className="bg-white rounded-2xl p-8 sm:p-10 text-center space-y-4 border border-dashed border-slate-300">
          <div className="w-14 h-14 bg-[#A7D0B8]/20 text-[#0F3D37] rounded-2xl flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 text-[#1F7A6E]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#0F3D37]">
              {lang === 'ar' ? 'لا توجد توصيات حتى الآن' : 'No Recommendations Generated Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              {lang === 'ar'
                ? 'يحتاج النظام إلى الإجابة عن استبيان التوجيه للتعرف على مستواك الدراسي واهتماماتك وميولك.'
                : 'Take the quick guidance questionnaire to receive personalized, evidence-grounded recommendations for secondary and university paths.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('questionnaire')}
            className="px-6 py-2.5 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ar' ? 'بدء الاستبيان الآن' : 'Start Questionnaire'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* Quick Explore Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1F7A6E]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0F3D37]">
              {lang === 'ar' ? 'الشعب الثانوية والتخصصات' : 'Secondary Branches & Higher Schools'}
            </h3>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {lang === 'ar'
              ? 'استكشف التوزيع الأكاديمي لشعب التعليم الثانوي الجزائري: العلوم التجريبية، الرياضيات، التقني رياضي، التسيير، واللغات.'
              : 'Browse prerequisites, subjects, coefficients, and pathways across all Algerian secondary education branches.'}
          </p>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37] flex items-center gap-1 pt-1"
          >
            <span>{lang === 'ar' ? 'استعراض الدليل الأكاديمي' : 'Explore Academic Directory'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-50 text-[#1F7A6E]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0F3D37]">
              {lang === 'ar' ? 'التوجيه نحو المهن المستقبلية' : 'Future Career Sectors'}
            </h3>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {lang === 'ar'
              ? 'تعرف على التخصصات ذات الطلب المرتفع في سوق العمل: الذكاء الاصطناعي، الطاقات المتجددة، الطب، والصناعات الدوائية.'
              : 'Discover evolving career fields in technology, engineering, healthcare, and finance aligned with national development goals.'}
          </p>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37] flex items-center gap-1 pt-1"
          >
            <span>{lang === 'ar' ? 'تصفح التخصصات الواعدة' : 'View High-Demand Majors'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
