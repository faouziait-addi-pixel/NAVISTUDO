import React, { useState } from 'react';
import { QuestionnaireFormState } from '../../services/payloadBuilder';
import { MAJORS_DATABASE } from '../../data/majorsDatabase';
import { Language } from '../../types/contract';
import {
  User,
  GraduationCap,
  Bookmark,
  RotateCcw,
  CheckCircle,
  Sparkles,
  ChevronRight,
  LogOut,
  Trash2,
  FileText,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ScreenType } from '../layout/Navbar';
import { AppUser } from '../../services/auth';

interface ProfileViewProps {
  formState: QuestionnaireFormState;
  hasCompletedQuestionnaire: boolean;
  bookmarkedMajorIds: string[];
  onToggleBookmark: (majorId: string) => void;
  onSelectMajor: (majorId: string) => void;
  onEditQuestionnaire: () => void;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  currentUser?: AppUser | null;
  onOpenAuth?: (tab?: 'anonymous' | 'login' | 'register') => void;
  onLogout?: () => void;
  onResetData?: () => void;
  onLoadSavedAnalysis?: (analysisId: string) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  formState,
  hasCompletedQuestionnaire,
  bookmarkedMajorIds,
  onToggleBookmark,
  onSelectMajor,
  onEditQuestionnaire,
  onNavigate,
  lang,
  currentUser,
  onOpenAuth,
  onLogout,
  onResetData,
  onLoadSavedAnalysis
}) => {
  const [analysisIdInput, setAnalysisIdInput] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFetchSavedAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisIdInput.trim() || !onLoadSavedAnalysis) return;
    setIsLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      await onLoadSavedAnalysis(analysisIdInput.trim());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Impossible de récupérer cette analyse.';
      setAnalysisError(msg);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const isFirstYear = formState.stageId === 'first_year_secondary';

  // Bookmarked majors list
  const bookmarkedMajors = MAJORS_DATABASE.filter(m => bookmarkedMajorIds.includes(m.major_id));

  // Subject scores count
  const scoredCount = Object.keys(formState.subjectScores).length;

  const getMajorTitle = (m: { title_ar: string; title_en: string; title_fr?: string }) => {
    if (lang === 'ar') return m.title_ar;
    if (lang === 'fr' && m.title_fr) return m.title_fr;
    return m.title_en;
  };

  const getMajorDesc = (m: { description_ar: string; description_en: string; description_fr?: string }) => {
    if (lang === 'ar') return m.description_ar;
    if (lang === 'fr' && m.description_fr) return m.description_fr;
    return m.description_en;
  };

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
                {lang === 'ar' ? 'الملف الأكاديمي للطالب' : lang === 'fr' ? 'Profil Scolaire de l\'Élève' : 'Student Academic Profile'}
              </h1>
              {hasCompletedQuestionnaire && (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {lang === 'ar' ? 'مكتمل' : lang === 'fr' ? 'Complété' : 'Complete'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563]">
              {isFirstYear
                ? (lang === 'ar' ? 'السنة الأولى ثانوي · جذع مشترك' : lang === 'fr' ? '1ère Année Secondaire · Tronc Commun' : 'First Year Secondary · Common Core')
                : (lang === 'ar' ? `السنة الثالثة ثانوي · شعبة ${formState.branchId}` : lang === 'fr' ? `3ème Année Secondaire · Filière ${formState.branchId}` : `3rd Year Secondary · Branch: ${formState.branchId}`)}
            </p>

            {/* Current Auth Badge */}
            <div className="pt-1 flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                currentUser
                  ? currentUser.isAnonymous
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {currentUser
                  ? currentUser.isAnonymous
                    ? (lang === 'fr' ? 'Mode Invité (Anonyme)' : 'Anonymous Guest')
                    : (currentUser.displayName || currentUser.email)
                  : (lang === 'fr' ? 'Non authentifié' : 'Not Signed In')}
              </span>
              {currentUser && (
                <span className="text-[10px] text-slate-400 font-mono">
                  UID: {currentUser.uid.slice(0, 10)}...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenAuth && (
            <button
              onClick={() => onOpenAuth(currentUser?.isAnonymous ? 'register' : 'login')}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer text-center"
            >
              {currentUser
                ? (currentUser.isAnonymous
                    ? (lang === 'fr' ? 'Créer un compte permanent' : 'Upgrade to Permanent Account')
                    : (lang === 'fr' ? 'Gérer le compte' : 'Account Details'))
                : (lang === 'fr' ? 'Connexion / Inscription' : 'Sign In / Register')}
            </button>
          )}

          {currentUser && onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title={lang === 'fr' ? 'Se déconnecter et réinitialiser la session' : 'Sign Out and Reset'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Déconnexion' : lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          )}

          {onResetData && (
            showResetConfirm ? (
              <div className="flex items-center gap-1.5 p-1 bg-rose-50 border border-rose-300 rounded-xl text-xs">
                <span className="text-[11px] font-bold text-rose-800 px-1">
                  {lang === 'ar' ? 'مسح كل شيء؟' : lang === 'fr' ? 'Tout effacer ?' : 'Reset all?'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetData();
                    setShowResetConfirm(false);
                  }}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                >
                  {lang === 'ar' ? 'نعم' : lang === 'fr' ? 'Oui' : 'Yes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-[11px] border border-slate-200 cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : lang === 'fr' ? 'Non' : 'No'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title={lang === 'fr' ? 'Effacer les réponses actuelles' : 'Clear questionnaire data'}
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'fr' ? 'Réinitialiser' : lang === 'ar' ? 'مسح الإجابات' : 'Reset'}</span>
              </button>
            )
          )}

          <button
            onClick={onEditQuestionnaire}
            className="px-4 py-2 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? 'تعديل الاستبيان'
                : lang === 'fr'
                ? 'Modifier le questionnaire'
                : 'Edit Answers'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Performance Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F3D37] border-b border-slate-100 pb-3">
            <GraduationCap className="w-4 h-4 text-[#1F7A6E]" />
            <span>
              {lang === 'ar' ? 'الأداء الأكاديمي والدرجات' : lang === 'fr' ? 'Notes scolaires & Baccalauréat' : 'Academic Scores & Baccalaureate'}
            </span>
          </div>

          <div className="space-y-3">
            {formState.hasTakenBaccalaureate && formState.baccalaureateAverage !== null ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-900">
                  {lang === 'ar' ? 'معدل شهادة البكالوريا المسجل:' : lang === 'fr' ? 'Moyenne au Bac déclarée :' : 'Baccalaureate Average:'}
                </span>
                <span className="font-bold text-sm text-emerald-800">
                  {formState.baccalaureateAverage} / 20
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'امتحان البكالوريا: قيد التحضير أو لم يحدد بعد.'
                  : lang === 'fr'
                  ? 'Baccalauréat : en cours de préparation ou non renseigné.'
                  : 'Baccalaureate exam: In preparation / not yet taken.'}
              </div>
            )}

            {/* Subject scores count */}
            <div className="text-xs text-[#4B5563] space-y-1.5 pt-1">
              <span className="font-semibold block text-[#0F3D37]">
                {lang === 'ar'
                  ? `المواد المقيّمة (${scoredCount} مواد):`
                  : lang === 'fr'
                  ? `Matières évaluées (${scoredCount}) :`
                  : `Evaluated Subjects (${scoredCount}):`}
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
            <span>
              {lang === 'ar' ? 'التفضيلات والأهداف المستقبلية' : lang === 'fr' ? 'Préférences & Objectifs' : 'Preferences & Future Path'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#4B5563]">
            <div>
              <span className="font-bold text-[#0F3D37] block">
                {lang === 'ar' ? 'المادة المفضلة الأولى:' : lang === 'fr' ? 'Matière favorite N°1 :' : 'Top Preferred Subject:'}
              </span>
              <span className="capitalize text-slate-700">
                {formState.subjectPreferenceOrder[0]?.replace('_', ' ') || 'None selected'}
              </span>
            </div>

            <div>
              <span className="font-bold text-[#0F3D37] block">
                {lang === 'ar' ? 'المواد التي تواجه فيها صعوبة:' : lang === 'fr' ? 'Matières éprouvantes :' : 'Difficult Subjects:'}
              </span>
              <span>
                {formState.difficultSubjectIds.length > 0
                  ? formState.difficultSubjectIds.map(d => d.replace('_', ' ')).join(', ')
                  : (lang === 'ar' ? 'لا يوجد صعوبات محددة' : lang === 'fr' ? 'Aucune difficulté majeure' : 'None indicated')}
              </span>
            </div>

            {!isFirstYear && (
              <>
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-[#0F3D37] block">
                    {lang === 'ar' ? 'وضوح الهدف المهني:' : lang === 'fr' ? 'Clarté du projet d\'orientation :' : 'Career Goal Clarity:'}
                  </span>
                  <span className="capitalize text-slate-700">
                    {formState.goalClarity.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-[#0F3D37] block">
                    {lang === 'ar' ? 'الأولويات المهنية (حتى 3):' : lang === 'fr' ? 'Priorités sélectionnées :' : 'Key Priorities:'}
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
                  {lang === 'ar' ? 'المهنة المستهدفة المصرح بها:' : lang === 'fr' ? 'Métier visé :' : 'Declared Target Role:'}
                </span>
                <span className="text-[#1F7A6E] font-semibold">{formState.targetRoleText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Analysis Retrieval (GET /api/v1/recommendations/<id>) */}
      {onLoadSavedAnalysis && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-[#1F7A6E]" />
            <div>
              <h2 className="text-lg font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'استرجاع تحليل سابق' : lang === 'fr' ? 'Consulter une analyse sauvegardée' : 'Retrieve Saved Analysis'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'أدخل معرف التحليل (Analysis ID) لاسترجاع تقرير التوجيه المحفوظ على الخادم.'
                  : lang === 'fr'
                  ? 'Saisissez l\'identifiant de l\'analyse (Analysis ID) pour charger un bilan généré précédemment.'
                  : 'Enter an Analysis ID to retrieve a previously saved orientation report from the backend.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleFetchSavedAnalysis} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={analysisIdInput}
                onChange={(e) => setAnalysisIdInput(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: ana_123456789' : lang === 'fr' ? 'Ex: ana_123456789 ou identifiant d\'analyse' : 'Ex: ana_123456789 or analysis ID'}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F7A6E] focus:ring-1 focus:ring-[#1F7A6E] text-xs font-mono text-slate-800 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={!analysisIdInput.trim() || isLoadingAnalysis}
              className="px-5 py-2.5 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
            >
              {isLoadingAnalysis ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement...' : 'Loading...'}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'استرجاع التحليل' : lang === 'fr' ? 'Charger le rapport' : 'Load Report'}</span>
                </>
              )}
            </button>
          </form>

          {analysisError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{analysisError}</span>
            </div>
          )}
        </div>
      )}

      {/* Bookmarked / Saved Majors Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#1F7A6E] fill-current" />
            <h2 className="text-lg font-bold text-[#0F3D37]">
              {lang === 'ar'
                ? 'التخصصات المحفوظة في قائمتك'
                : lang === 'fr'
                ? 'Filières enregistrées dans vos favoris'
                : 'Bookmarked Pathways & Majors'} ({bookmarkedMajors.length})
            </h2>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#1F7A6E] hover:text-[#0F3D37]"
          >
            {lang === 'ar' ? 'استكشاف المزيد من التخصصات' : lang === 'fr' ? 'Explorer d\'autres filières' : 'Browse More Majors'}
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
                      {lang === 'ar' ? 'إزالة' : lang === 'fr' ? 'Supprimer' : 'Remove'}
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-[#0F3D37] mt-1">
                    {getMajorTitle(m)}
                  </h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2 mt-1">
                    {getMajorDesc(m)}
                  </p>
                </div>

                <button
                  onClick={() => onSelectMajor(m.major_id)}
                  className="w-full py-1.5 px-3 bg-white hover:bg-[#1F7A6E] text-[#0F3D37] hover:text-white rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>{lang === 'ar' ? 'عرض التفاصيل' : lang === 'fr' ? 'Consulter la fiche' : 'View Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <p>
              {lang === 'ar'
                ? 'لم تقم بحفظ أي تخصص بعد. يمكنك حفظ التخصصات المفضلة من صفحة النتائج أو دليل التخصصات.'
                : lang === 'fr'
                ? 'Aucune filière enregistrée pour le moment. Vous pouvez ajouter des favoris depuis les recommandations ou le guide.'
                : 'No bookmarked majors yet. You can save any major from Results or Explore Majors.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
