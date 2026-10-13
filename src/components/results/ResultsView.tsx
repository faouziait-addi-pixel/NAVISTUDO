import React, { useState } from 'react';
import { MajorRecommendation } from '../../types/contract';
import {
  Award,
  Sparkles,
  Bookmark,
  ChevronRight,
  Filter,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Clock,
  Building,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { ScreenType } from '../layout/Navbar';

interface ResultsViewProps {
  recommendations: MajorRecommendation[];
  isLocalFallback: boolean;
  bookmarkedMajorIds: string[];
  onToggleBookmark: (majorId: string) => void;
  onSelectMajor: (majorId: string) => void;
  onRevisitQuestionnaire: () => void;
  onNavigate: (screen: ScreenType) => void;
  lang: 'en' | 'ar';
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  recommendations,
  isLocalFallback,
  bookmarkedMajorIds,
  onToggleBookmark,
  onSelectMajor,
  onRevisitQuestionnaire,
  onNavigate,
  lang
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMatchLevel, setFilterMatchLevel] = useState<string>('all');

  const categories = [
    { id: 'all', en: 'All Disciplines', ar: 'جميع التخصصات' },
    { id: 'engineering', en: 'Engineering & Tech', ar: 'الهندسة والتكنولوجيا' },
    { id: 'health', en: 'Health & Medical', ar: 'العلوم الطبية والصحية' },
    { id: 'science', en: 'Natural Sciences', ar: 'العلوم الدقيقة والطبيعية' },
    { id: 'business', en: 'Business & Economics', ar: 'التسيير والاقتصاد' },
    { id: 'humanities', en: 'Law & Humanities', ar: 'الحقوق والعلوم الإنسانية' }
  ];

  const filteredList = recommendations.filter(rec => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (filterMatchLevel !== 'all' && rec.match_level !== filterMatchLevel) return false;
    return true;
  });

  if (recommendations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 bg-[#A7D0B8]/20 text-[#1F7A6E] rounded-2xl flex items-center justify-center mx-auto">
          <Award className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-bold text-[#0F3D37]">
          {lang === 'ar' ? 'لم يتم توليد أي توصيات بعد' : 'No Recommendations Available'}
        </h2>
        <p className="text-sm text-[#4B5563] leading-relaxed">
          {lang === 'ar'
            ? 'للحصول على توصيات مصممة خصيصاً لمستواك وميولك، يرجى ملء استبيان التوجيه المدرسي أولاً.'
            : 'To view recommendations tailored to your academic background and interests, please complete the orientation questionnaire.'}
        </p>
        <button
          onClick={onRevisitQuestionnaire}
          className="px-6 py-3 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-bold text-sm rounded-xl shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'ar' ? 'بدء استبيان التوجيه الآن' : 'Start Orientation Questionnaire'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Results Summary Banner */}
      <div className="bg-[#0F3D37] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#1F7A6E]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#A7D0B8] uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تقرير التوجيه الأكاديمي المخصص' : 'Custom Orientation Recommendation Report'}</span>
            </div>

            <button
              onClick={onRevisitQuestionnaire}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مراجعة وتعديل الإجابات' : 'Edit Questionnaire Answers'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'ar' ? 'نتائج ومسارات التوجيه المقترحة' : 'Your Recommended Academic Paths & Majors'}
          </h1>

          <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
            {lang === 'ar'
              ? `تم تحليل أدائك في المواد الدراسية، أسلوبك في حل المشكلات، واهتماماتك المهنية لتوليد ${recommendations.length} مساراً أكاديمياً مرتبة حسب درجة التوافق.`
              : `Based on your subject score profile, problem-solving preferences, and aspirations, we identified ${recommendations.length} compatible paths, ranked from strongest match.`}
          </p>

          {isLocalFallback && (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#A7D0B8] bg-black/20 px-3 py-1 rounded-md border border-[#A7D0B8]/20">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Evaluated via curriculum engine (authoritative scoring rules)</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs (Interactive filter controls complying with zero-pill rule) */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D37]">
            <Filter className="w-4 h-4 text-[#1F7A6E]" />
            <span>{lang === 'ar' ? 'تصفية حسب المجال المعرفي:' : 'Filter by Academic Discipline:'}</span>
          </div>

          {/* Segmented Match Level Selector */}
          <div className="flex items-center gap-1 bg-[#F7F6F2] p-1 rounded-lg text-xs">
            {[
              { id: 'all', en: 'All Levels', ar: 'الكل' },
              { id: 'strong_match', en: 'Strong Match', ar: 'توافق قوي' },
              { id: 'great_alternative', en: 'Alternatives', ar: 'بدائل ممتازة' }
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => setFilterMatchLevel(lvl.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  filterMatchLevel === lvl.id
                    ? 'bg-[#1F7A6E] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#0F3D37]'
                }`}
              >
                {lang === 'ar' ? lvl.ar : lvl.en}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0F3D37] text-white'
                  : 'bg-[#F7F6F2] text-[#4B5563] hover:bg-slate-200'
              }`}
            >
              {lang === 'ar' ? cat.ar : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Recommendations List */}
      <div className="space-y-4">
        {filteredList.map((rec, index) => {
          const isSaved = bookmarkedMajorIds.includes(rec.major_id);

          // Visual badge styling per match level
          const matchLevelBadge = {
            strong_match: {
              label_en: 'Strong Match',
              label_ar: 'توافق قوي ومباشر',
              color: 'text-emerald-800 bg-emerald-50 border-emerald-200'
            },
            great_alternative: {
              label_en: 'Great Alternative',
              label_ar: 'بديل أكاديمي ممتاز',
              color: 'text-teal-800 bg-teal-50 border-teal-200'
            },
            field_to_explore: {
              label_en: 'Field to Explore',
              label_ar: 'مجال واعد للاستكشاف',
              color: 'text-slate-800 bg-slate-100 border-slate-200'
            }
          }[rec.match_level];

          return (
            <div
              key={rec.major_id}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-[#1F7A6E] transition-all space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  {/* Unboxed metadata row with typographic dots */}
                  <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                    <span className="font-bold text-[#1F7A6E]">#{index + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${matchLevelBadge.color}`}>
                      {lang === 'ar' ? matchLevelBadge.label_ar : matchLevelBadge.label_en}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{rec.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.study_duration_years} {lang === 'ar' ? 'سنوات' : 'Years'}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0F3D37]">
                    {lang === 'ar' ? rec.title_ar : rec.title_en}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-1">
                    {lang === 'ar' ? rec.explanation_ar : rec.explanation_en}
                  </p>
                </div>

                {/* Match Score Badge */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                  <div className="text-right">
                    <span className="block text-2xl font-black text-[#1F7A6E]">
                      {rec.match_score}%
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      {lang === 'ar' ? 'نسبة التطابق' : 'Match Score'}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(rec.major_id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]'
                        : 'bg-[#F7F6F2] text-[#4B5563] hover:text-[#0F3D37] border-slate-200'
                    }`}
                    title={isSaved ? 'Bookmarked' : 'Bookmark this path'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Bottom detail row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#0F3D37]">
                    {lang === 'ar' ? 'المواد المرتبطة:' : 'Key Subjects:'}
                  </span>
                  {rec.key_subjects.slice(0, 3).map(s => (
                    <span key={s} className="bg-[#F7F6F2] px-2 py-0.5 rounded text-slate-700 font-mono text-[11px]">
                      {s.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectMajor(rec.major_id)}
                  className="px-4 py-2 bg-[#F7F6F2] hover:bg-[#1F7A6E] text-[#0F3D37] hover:text-white rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>{lang === 'ar' ? 'عرض التفاصيل والمسارات المهنية' : 'View Major Details'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
