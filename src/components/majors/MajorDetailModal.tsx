import React from 'react';
import { MajorDatabaseEntry } from '../../data/majorsDatabase';
import { Language } from '../../types/contract';
import {
  X,
  Bookmark,
  Building,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award
} from 'lucide-react';

interface MajorDetailModalProps {
  major: MajorDatabaseEntry | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (majorId: string) => void;
  onSelectAlternativeMajor: (majorId: string) => void;
  lang: Language;
}

export const MajorDetailModal: React.FC<MajorDetailModalProps> = ({
  major,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectAlternativeMajor,
  lang
}) => {
  if (!isOpen || !major) return null;

  const getTitle = () => {
    if (lang === 'ar') return major.title_ar;
    if (lang === 'fr' && major.title_fr) return major.title_fr;
    return major.title_en;
  };

  const getExplanation = () => {
    if (lang === 'ar') return major.explanation_ar;
    if (lang === 'fr' && major.explanation_fr) return major.explanation_fr;
    return major.explanation_en;
  };

  const getDescription = () => {
    if (lang === 'ar') return major.description_ar;
    if (lang === 'fr' && major.description_fr) return major.description_fr;
    return major.description_en;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="major-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#A7D0B8]/40 flex flex-col">
        {/* Header */}
        <div className="bg-[#0F3D37] text-white p-6 rounded-t-2xl relative sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A7D0B8] uppercase tracking-wider">
                <span className="capitalize">{major.category}</span>
                <span>·</span>
                <span>
                  {major.study_duration_years} {lang === 'fr' ? 'ans de formation' : lang === 'ar' ? 'سنوات تكوين' : 'Years Study Duration'}
                </span>
                {major.min_indicative_average && (
                  <>
                    <span>·</span>
                    <span>
                      {lang === 'ar'
                        ? `معدل استرشادي: ~${major.min_indicative_average}`
                        : lang === 'fr'
                        ? `Moyenne indicative Bac : ~${major.min_indicative_average}`
                        : `Indicative Bac Avg: ~${major.min_indicative_average}`}
                    </span>
                  </>
                )}
              </div>

              <h2 id="major-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {getTitle()}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(major.major_id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-[#A7D0B8] text-[#0F3D37] border-[#A7D0B8]'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
                title={isBookmarked ? 'Retirer' : 'Enregistrer'}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 text-[#0F3D37]">
          {/* Why It Matches Banner */}
          <div className="bg-[#F7F6F2] border border-[#A7D0B8] rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F7A6E]">
                <Award className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'تحليل التوافق مع ملفك الدراسي'
                    : lang === 'fr'
                    ? 'Analyse d\'adéquation avec votre profil scolaire'
                    : 'Profile Match Analysis'}
                </span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {major.match_score}% Match ({major.match_level.replace('_', ' ')})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              {getExplanation()}
            </p>
          </div>

          {/* Academic Overview Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F7A6E]">
              {lang === 'ar' ? 'نبذة عن التخصص الجامعي' : lang === 'fr' ? 'Présentation de la filière' : 'Academic Field Overview'}
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {getDescription()}
            </p>
          </div>

          {/* Key High School Subjects & Prerequisites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D37]">
                <BookOpen className="w-4 h-4 text-[#1F7A6E]" />
                <span>
                  {lang === 'ar' ? 'المواد الثانوية المفتاحية' : lang === 'fr' ? 'Matières clés du secondaire' : 'Key High School Subjects'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {major.key_subjects.map(subj => (
                  <span
                    key={subj}
                    className="text-xs font-medium bg-[#F7F6F2] text-[#0F3D37] px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    {subj.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D37]">
                <GraduationCap className="w-4 h-4 text-[#1F7A6E]" />
                <span>
                  {lang === 'ar' ? 'الشعب الثانوية المؤهلة' : lang === 'fr' ? 'Séries / Filières du Bac admises' : 'Eligible High School Branches'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {major.prerequisite_branches.map(branch => (
                  <span
                    key={branch}
                    className="text-xs font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200"
                  >
                    {branch.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Higher Education Institutions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'مؤسسات التعليم العالي الحاضنة'
                  : lang === 'fr'
                  ? 'Établissements d\'enseignement supérieur'
                  : 'Higher Education Institutions'}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#4B5563]">
              {major.institution_types.map((inst, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A6E]" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample Curriculum Modules */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
              {lang === 'ar'
                ? 'نماذج من المقاييس والمواد المدرسة بالجامعة'
                : lang === 'fr'
                ? 'Exemples d\'unités d\'enseignement et modules'
                : 'Sample University Curriculum Modules'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {major.sample_curriculum_modules.map((mod, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {/* Typical Careers & Employment Outlook */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F7A6E]">
              <Briefcase className="w-4 h-4" />
              <span>
                {lang === 'ar' ? 'الآفاق المهنية وسوق العمل' : lang === 'fr' ? 'Perspectives professionnelles & Marché' : 'Career Paths & Labor Market Outlook'}
              </span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {major.employment_outlook}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {major.typical_careers.map((career, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold bg-white text-[#0F3D37] px-2.5 py-1 rounded-md border border-teal-300 shadow-2xs"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={() => onToggleBookmark(major.major_id)}
            className="text-xs font-bold text-[#1F7A6E] hover:text-[#0F3D37] flex items-center gap-1.5"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>
              {isBookmarked
                ? (lang === 'ar' ? 'إلغاء الحفظ' : lang === 'fr' ? 'Retirer des favoris' : 'Remove Bookmark')
                : (lang === 'ar' ? 'حفظ في ملفي' : lang === 'fr' ? 'Ajouter à mes favoris' : 'Bookmark to Profile')}
            </span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close Details'}
          </button>
        </div>
      </div>
    </div>
  );
};
