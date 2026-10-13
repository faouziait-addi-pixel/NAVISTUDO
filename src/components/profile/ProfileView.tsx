import React from 'react';
import { QuestionnaireFormState } from '../../services/payloadBuilder';
import { MAJORS_DATABASE } from '../../data/majorsDatabase';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Bookmark,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ScreenType } from '../layout/Navbar';

interface ProfileViewProps {
  formState: QuestionnaireFormState;
  hasCompletedQuestionnaire: boolean;
  bookmarkedMajorIds: string[];
  onToggleBookmark: (majorId: string) => void;
  onSelectMajor: (majorId: string) => void;
  onEditQuestionnaire: () => void;
  onNavigate: (screen: ScreenType) => void;
  lang: 'en' | 'ar';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  formState,
  hasCompletedQuestionnaire,
  bookmarkedMajorIds,
  onToggleBookmark,
  onSelectMajor,
  onEditQuestionnaire,
  onNavigate,
  lang
}) => {
  const isFirstYear = formState.stageId === 'first_year_secondary';

  // Bookmarked majors list
  const bookmarkedMajors = MAJORS_DATABASE.filter(m => bookmarkedMajorIds.includes(m.major_id));

  // Subject scores count
  const scoredCount = Object.keys(formState.subjectScores).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0F3D37] text-[#A7D0B8] flex items-center justify-center font-bold text-2xl shadow-md">
            <User className="w-8 h-8 text-[#A7D0B8]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F3D37]">
                {lang === 'ar' ? 'الملف الأكاديمي للطالب' : 'Student Academic Profile'}
              </h1>
              {hasCompletedQuestionnaire && (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {lang === 'ar' ? 'مكتمل' : 'Complete'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563]">
              {isFirstYear
                ? (lang === 'ar' ? 'السنة الأولى ثانوي · جذع مشترك' : 'First Year Secondary · Common Core')
                : (lang === 'ar' ? `السنة الثالثة ثانوي · شعبة ${formState.branchId}` : `3rd Year Secondary · Branch: ${formState.branchId}`)}
            </p>
          </div>
        </div>

        <button
          onClick={onEditQuestionnaire}
          className="px-5 py-2.5 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تعديل بيانات الاستبيان' : 'Edit Questionnaire Answers'}</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Performance Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F3D37] border-b border-slate-100 pb-3">
            <GraduationCap className="w-4 h-4 text-[#1F7A6E]" />
            <span>{lang === 'ar' ? 'الأداء الأكاديمي والدرجات' : 'Academic Scores & Baccalaureate'}</span>
          </div>

          <div className="space-y-3">
            {formState.hasTakenBaccalaureate && formState.baccalaureateAverage !== null ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-900">
                  {lang === 'ar' ? 'معدل شهادة البكالوريا المسجل:' : 'Baccalaureate Average:'}
                </span>
                <span className="font-bold text-sm text-emerald-800">
                  {formState.baccalaureateAverage} / 20
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                {lang === 'ar' ? 'امتحان البكالوريا: قيد التحضير أو لم يحدد بعد.' : 'Baccalaureate exam: In preparation / not yet taken.'}
              </div>
            )}

            {/* Subject scores count */}
            <div className="text-xs text-[#4B5563] space-y-1.5 pt-1">
              <span className="font-semibold block text-[#0F3D37]">
                {lang === 'ar' ? `المواد المقيّمة (${scoredCount} مواد):` : `Evaluated Subjects (${scoredCount}):`}
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto">
                {Object.entries(formState.subjectScores).map(([subjId, score]) => (
                  <div key={subjId} className="p-2 bg-[#F7F6F2] rounded text-[11px] flex justify-between">
                    <span className="truncate pr-1 capitalize">{subjId.replace('_', ' ')}</span>
                    <span className="font-mono font-bold text-[#1F7A6E] shrink-0">
                      {score.min}-{score.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences & Future Direction */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F3D37] border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-[#1F7A6E]" />
            <span>{lang === 'ar' ? 'التفضيلات والأهداف المستقبلية' : 'Preferences & Future Path'}</span>
          </div>

          <div className="space-y-3 text-xs text-[#4B5563]">
            <div>
              <span className="font-bold text-[#0F3D37] block">
                {lang === 'ar' ? 'المادة المفضلة الأولى:' : 'Top Preferred Subject:'}
              </span>
              <span className="capitalize text-slate-700">
                {formState.subjectPreferenceOrder[0]?.replace('_', ' ') || 'None selected'}
              </span>
            </div>

            <div>
              <span className="font-bold text-[#0F3D37] block">
                {lang === 'ar' ? 'المواد التي تواجه فيها صعوبة:' : 'Difficult Subjects:'}
              </span>
              <span>
                {formState.difficultSubjectIds.length > 0
                  ? formState.difficultSubjectIds.map(d => d.replace('_', ' ')).join(', ')
                  : (lang === 'ar' ? 'لا يوجد صعوبات محددة' : 'None indicated')}
              </span>
            </div>

            {!isFirstYear && (
              <>
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-[#0F3D37] block">
                    {lang === 'ar' ? 'وضوح الهدف المهني:' : 'Career Goal Clarity:'}
                  </span>
                  <span className="capitalize text-slate-700">
                    {formState.goalClarity.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-[#0F3D37] block">
                    {lang === 'ar' ? 'الأولويات المهنية (حتى 3):' : 'Key Priorities:'}
                  </span>
                  <span>
                    {formState.priorityIds.length > 0
                      ? formState.priorityIds.map(p => p.replace('prio_', '').replace('_', ' ')).join(', ')
                      : 'None'}
                  </span>
                </div>
              </>
            )}

            {formState.targetRoleText && (
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-[#0F3D37] block">
                  {lang === 'ar' ? 'المهنة المستهدفة المصرح بها:' : 'Declared Target Role:'}
                </span>
                <span className="text-[#1F7A6E] font-semibold">{formState.targetRoleText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookmarked / Saved Majors Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#1F7A6E] fill-current" />
            <h2 className="text-lg font-bold text-[#0F3D37]">
              {lang === 'ar' ? 'التخصصات المحفوظة في قائمتك' : 'Bookmarked Pathways & Majors'} ({bookmarkedMajors.length})
            </h2>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37]"
          >
            {lang === 'ar' ? 'استكشاف المزيد من التخصصات' : 'Browse More Majors'}
          </button>
        </div>

        {bookmarkedMajors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarkedMajors.map(m => (
              <div
                key={m.major_id}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#1F7A6E] transition-all flex flex-col justify-between space-y-3 bg-[#F7F6F2]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#4B5563]">
                    <span className="capitalize font-semibold text-[#1F7A6E]">{m.category}</span>
                    <button
                      onClick={() => onToggleBookmark(m.major_id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      {lang === 'ar' ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-[#0F3D37] mt-1">
                    {lang === 'ar' ? m.title_ar : m.title_en}
                  </h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2 mt-1">
                    {lang === 'ar' ? m.description_ar : m.description_en}
                  </p>
                </div>

                <button
                  onClick={() => onSelectMajor(m.major_id)}
                  className="w-full py-1.5 px-3 bg-white hover:bg-[#1F7A6E] text-[#0F3D37] hover:text-white rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>{lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <p>{lang === 'ar' ? 'لم تقم بحفظ أي تخصص بعد. يمكنك حفظ التخصصات المفضلة من صفحة النتائج أو دليل التخصصات.' : 'No bookmarked majors yet. You can save any major from Results or Explore Majors.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
