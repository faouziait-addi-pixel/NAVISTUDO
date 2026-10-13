import React, { useState, useEffect } from 'react';
import {
  ACADEMIC_STAGES,
  FIRST_YEAR_STUDY_GROUPS,
  THIRD_YEAR_BRANCHES,
  BRANCH_SUBTYPES_TECHNICAL_MATH,
  getSubjectsForStage,
  INTEREST_FIELDS,
  TOPICS_BY_FIELD,
  ACTIVITIES,
  WORK_ENVIRONMENTS,
  GOAL_CLARITY_OPTIONS,
  MOTIVATIONS,
  PRIORITIES,
  PROBLEM_TYPES,
  SubjectOption
} from '../../types/taxonomy';
import { QuestionnaireFormState, buildRecommendationPayload } from '../../services/payloadBuilder';
import { submitQuestionnaire } from '../../services/api';
import { RecommendationResponseEnvelope } from '../../types/contract';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  GraduationCap,
  BookOpen,
  Send,
  RotateCcw
} from 'lucide-react';

interface QuestionnaireViewProps {
  initialState: QuestionnaireFormState;
  onSaveState: (state: QuestionnaireFormState) => void;
  onSubmitSuccess: (data: RecommendationResponseEnvelope, isLocalFallback: boolean) => void;
  onCancel: () => void;
  lang: 'en' | 'ar';
}

export const QuestionnaireView: React.FC<QuestionnaireViewProps> = ({
  initialState,
  onSaveState,
  onSubmitSuccess,
  onCancel,
  lang
}) => {
  const [formState, setFormState] = useState<QuestionnaireFormState>(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state upward when changed
  useEffect(() => {
    onSaveState(formState);
  }, [formState, onSaveState]);

  const isFirstYear = formState.stageId === 'first_year_secondary';
  const totalSteps = isFirstYear ? 6 : 7; // Route A has no problem preferences step

  // Relevant subjects for current stage and branch
  const availableSubjects = getSubjectsForStage(
    formState.stageId,
    formState.branchId,
    formState.studyGroupId
  );

  // Initialize subject scores and preference order when branch changes if empty
  useEffect(() => {
    const existingSubjectIds = Object.keys(formState.subjectScores);
    const newSubjectIds = availableSubjects.map(s => s.id);

    // If subjects don't match available subjects, initialize
    const needsScoreInit = newSubjectIds.some(id => !existingSubjectIds.includes(id));
    if (needsScoreInit) {
      const newScores: Record<string, { min: number; max: number }> = { ...formState.subjectScores };
      newSubjectIds.forEach(id => {
        if (!newScores[id]) {
          newScores[id] = { min: 12, max: 14 }; // reasonable default baseline
        }
      });

      const newPrefOrder = formState.subjectPreferenceOrder.length > 0
        ? formState.subjectPreferenceOrder.filter(id => newSubjectIds.includes(id))
        : [...newSubjectIds];

      setFormState(prev => ({
        ...prev,
        subjectScores: newScores,
        subjectPreferenceOrder: newPrefOrder
      }));
    }
  }, [formState.stageId, formState.branchId, formState.studyGroupId]);

  // Validation before proceeding
  const validateStep = (step: number): boolean => {
    setValidationError(null);

    if (step === 1) {
      if (formState.stageId === 'third_year_secondary') {
        if (formState.branchId === 'mathematical_technique' && !formState.branchSubtypeId) {
          setValidationError(lang === 'ar' ? 'يرجى اختيار التخصص الهندسي لشعبة تقني رياضي.' : 'Please select your engineering specialty for Technical Math.');
          return false;
        }
        if (formState.hasTakenBaccalaureate) {
          if (formState.baccalaureateAverage === null || formState.baccalaureateAverage < 0 || formState.baccalaureateAverage > 20) {
            setValidationError(lang === 'ar' ? 'يرجى إدخال معدل البكالوريا بين 0 و 20.' : 'Please enter a valid Baccalaureate average between 0 and 20.');
            return false;
          }
        }
      }
    }

    if (step === 2) {
      // Validate subject scores: min <= max and between 0 and 20
      for (const subj of availableSubjects) {
        const score = formState.subjectScores[subj.id];
        if (score) {
          if (score.min < 0 || score.min > 20 || score.max < 0 || score.max > 20) {
            setValidationError(lang === 'ar' ? `الدرجات في مادة ${subj.name_ar} يجب أن تكون بين 0 و 20.` : `Scores for ${subj.name_en} must be between 0 and 20.`);
            return false;
          }
          if (score.min > score.max) {
            setValidationError(lang === 'ar' ? `الحد الأدنى للدرجة في مادة ${subj.name_ar} لا يمكن أن يتجاوز الحد الأقصى.` : `Minimum score for ${subj.name_en} cannot exceed maximum score.`);
            return false;
          }
        }
      }
    }

    if (step === 5 && !isFirstYear) {
      // Future direction: max 3 priorities
      if (formState.priorityIds.length > 3) {
        setValidationError(lang === 'ar' ? 'يرجى اختيار 3 أولويات كحد أقصى.' : 'Please select a maximum of 3 priorities.');
        return false;
      }
      if (formState.goalClarity === 'clear_goal' && formState.targetFieldIds.length === 0) {
        setValidationError(lang === 'ar' ? 'يرجى تحديد المجال المستهدف لهدفك الواضح.' : 'Please select at least one target field for your clear goal.');
        return false;
      }
      if (formState.goalClarity === 'general_direction' && formState.consideredFieldIds.length === 0) {
        setValidationError(lang === 'ar' ? 'يرجى اختيار مجال واحد على الأقل قيد الاهتمام.' : 'Please select at least one field under consideration.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setValidationError(null);

    try {
      // Build spec-compliant request envelope
      const payload = buildRecommendationPayload(formState);
      const result = await submitQuestionnaire(payload);
      onSubmitSuccess(result.data, result.isLocalFallback);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating recommendations.';
      setValidationError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step names
  const stepTitles = isFirstYear
    ? [
        { num: 1, en: 'Academic Stage & Stream', ar: 'المرحلة والجذع المشترك' },
        { num: 2, en: 'Subject Performance', ar: 'المستوى والدرجات' },
        { num: 3, en: 'Preferences & Difficulties', ar: 'المواد المفضلة والصعوبات' },
        { num: 4, en: 'Interests & Activities', ar: 'الميول والأنشطة' },
        { num: 5, en: 'Future Vision', ar: 'التطلعات المستقبلية' },
        { num: 6, en: 'Review & Submit', ar: 'مراجعة وتأكيد' }
      ]
    : [
        { num: 1, en: 'Stage & Branch', ar: 'المرحلة والشعبة' },
        { num: 2, en: 'Subject Scores', ar: 'درجات المواد' },
        { num: 3, en: 'Subject Order & Difficulties', ar: 'ترتيب المواد والصعوبات' },
        { num: 4, en: 'Interests & Environment', ar: 'الاهتمامات وبيئة العمل' },
        { num: 5, en: 'Future Direction', ar: 'الهدف المستقبلي' },
        { num: 6, en: 'Problem Preferences', ar: 'طبيعة التحديات والمشكلات' },
        { num: 7, en: 'Review & Confirm', ar: 'مراجعة وتأكيد' }
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Questionnaire Top Tracker Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F7A6E] uppercase tracking-wider">
              <span>{isFirstYear ? 'Route A · First Year Secondary' : `Routes B/C/D · Baccalaureate`}</span>
              <span>·</span>
              <span>{lang === 'ar' ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F3D37] mt-0.5">
              {lang === 'ar' ? stepTitles[currentStep - 1]?.ar : stepTitles[currentStep - 1]?.en}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-[#4B5563] hover:text-[#0F3D37] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              {lang === 'ar' ? 'إلغاء والعودة' : 'Exit to Dashboard'}
            </button>
          </div>
        </div>

        {/* Progress Step Circles / Segmented bar */}
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5">
          {stepTitles.map((st) => {
            const isCompleted = st.num < currentStep;
            const isCurrent = st.num === currentStep;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => {
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
                disabled={st.num > currentStep}
                className={`group flex flex-col items-center text-center p-1.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-[#1F7A6E]/10 border border-[#1F7A6E]'
                    : isCompleted
                    ? 'hover:bg-slate-50 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCurrent
                      ? 'bg-[#1F7A6E] text-white'
                      : isCompleted
                      ? 'bg-[#A7D0B8] text-[#0F3D37]'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span className="hidden md:block text-[11px] font-medium text-[#4B5563] truncate mt-1 w-full">
                  {lang === 'ar' ? st.ar : st.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Validation Alert if present */}
      {validationError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-700 animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-medium">{validationError}</div>
        </div>
      )}

      {/* Main Step Form Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200">
        {/* STEP 1: Academic Stage, Stream & Baccalaureate */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stage Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#0F3D37]">
                {lang === 'ar' ? '1. ما هو مستواك الدراسي الحالي؟' : '1. What is your current academic stage?'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ACADEMIC_STAGES.map((stage) => {
                  const selected = formState.stageId === stage.id;
                  return (
                    <div
                      key={stage.id}
                      onClick={() => setFormState(prev => ({ ...prev, stageId: stage.id as any }))}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selected
                          ? 'border-[#1F7A6E] bg-[#1F7A6E]/5 ring-1 ring-[#1F7A6E]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-[#0F3D37] text-base">
                            {lang === 'ar' ? stage.name_ar : stage.name_en}
                          </h4>
                          <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                            {lang === 'ar' ? stage.description_ar : stage.description_en}
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="stageId"
                          checked={selected}
                          onChange={() => {}}
                          className="mt-1 text-[#1F7A6E] focus:ring-[#1F7A6E]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* If 1st Year: Study Group */}
            {formState.stageId === 'first_year_secondary' && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-[#0F3D37]">
                  {lang === 'ar' ? '2. ما هو الجذع المشترك الذي تدرسه حالياً؟' : '2. What is your current common core study group?'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FIRST_YEAR_STUDY_GROUPS.map((sg) => {
                    const selected = formState.studyGroupId === sg.id;
                    return (
                      <div
                        key={sg.id}
                        onClick={() => setFormState(prev => ({ ...prev, studyGroupId: sg.id }))}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selected
                            ? 'border-[#1F7A6E] bg-[#1F7A6E]/5 ring-1 ring-[#1F7A6E]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-[#0F3D37]">
                              {lang === 'ar' ? sg.name_ar : sg.name_en}
                            </h4>
                            <p className="text-xs text-[#4B5563] mt-1">
                              {lang === 'ar' ? sg.description_ar : sg.description_en}
                            </p>
                          </div>
                          <input
                            type="radio"
                            name="studyGroupId"
                            checked={selected}
                            onChange={() => {}}
                            className="mt-1 text-[#1F7A6E]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* If 3rd Year: Branch & Subtype */}
            {formState.stageId === 'third_year_secondary' && (
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-[#0F3D37]">
                    {lang === 'ar' ? '2. ما هي شعبتك في البكالوريا؟' : '2. What is your Baccalaureate academic branch?'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {THIRD_YEAR_BRANCHES.map((b) => {
                      const selected = formState.branchId === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setFormState(prev => ({ ...prev, branchId: b.id }))}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                            selected
                              ? 'border-[#1F7A6E] bg-[#1F7A6E]/5 ring-1 ring-[#1F7A6E]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-sm text-[#0F3D37]">
                              {lang === 'ar' ? b.name_ar : b.name_en}
                            </h4>
                            <input
                              type="radio"
                              name="branchId"
                              checked={selected}
                              onChange={() => {}}
                              className="text-[#1F7A6E]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtype if Technical Math */}
                {formState.branchId === 'mathematical_technique' && (
                  <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#A7D0B8] space-y-3 animate-in fade-in">
                    <label className="block text-sm font-bold text-[#0F3D37]">
                      {lang === 'ar' ? 'حدد تخصصك الهندسي (تقني رياضي):' : 'Select your engineering specialty:'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BRANCH_SUBTYPES_TECHNICAL_MATH.map((sub) => {
                        const selected = formState.branchSubtypeId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => setFormState(prev => ({ ...prev, branchSubtypeId: sub.id }))}
                            className={`p-3 rounded-lg border transition-all cursor-pointer bg-white ${
                              selected ? 'border-[#1F7A6E] ring-1 ring-[#1F7A6E]' : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0F3D37]">
                                {lang === 'ar' ? sub.name_ar : sub.name_en}
                              </span>
                              <input
                                type="radio"
                                name="branchSubtypeId"
                                checked={selected}
                                onChange={() => {}}
                                className="text-[#1F7A6E]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Baccalaureate Status & Average */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#0F3D37]">
                        {lang === 'ar' ? 'هل اجتزت امتحان شهادة البكالوريا وحصلت على المعدل؟' : 'Have you already taken the Baccalaureate exam?'}
                      </span>
                      <p className="text-xs text-[#4B5563]">
                        {lang === 'ar' ? 'إذا كان نعم، يمكنك إدخال المعدل لتحسين دقة التوصيات.' : 'If yes, provide your Bac average (0-20) to calibrate eligibility.'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.hasTakenBaccalaureate}
                        onChange={(e) => setFormState(prev => ({
                          ...prev,
                          hasTakenBaccalaureate: e.target.checked,
                          baccalaureateAverage: e.target.checked ? (prev.baccalaureateAverage || 14.5) : null
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F7A6E]"></div>
                    </label>
                  </div>

                  {formState.hasTakenBaccalaureate && (
                    <div className="pt-2 animate-in fade-in">
                      <label htmlFor="bac-avg" className="block text-xs font-bold text-[#0F3D37] mb-1">
                        {lang === 'ar' ? 'معدل شهادة البكالوريا (من 20):' : 'Baccalaureate Average (out of 20):'}
                      </label>
                      <input
                        id="bac-avg"
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        value={formState.baccalaureateAverage ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseFloat(e.target.value);
                          setFormState(prev => ({ ...prev, baccalaureateAverage: val }));
                        }}
                        placeholder="e.g. 15.42"
                        className="w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm text-[#0F3D37] focus:ring-2 focus:ring-[#1F7A6E]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Subject Performance (Min/Max Score 0-20) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'مستواك في المواد الدراسية (معدل العلامات من 20)' : 'Subject Score Ranges (0 to 20)'}
              </h3>
              <p className="text-xs text-[#4B5563] mt-1">
                {lang === 'ar'
                  ? 'حدد المدى التقديري لعلاماتك (الحد الأدنى والأقصى) في كل مادة خلال الفصول الدراسية.'
                  : 'Specify your estimated typical score range (min and max) out of 20 for each core subject.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableSubjects.map((subj) => {
                const currentScore = formState.subjectScores[subj.id] || { min: 12, max: 14 };
                return (
                  <div
                    key={subj.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#0F3D37]">
                        {lang === 'ar' ? subj.name_ar : subj.name_en}
                      </h4>
                      <span className="text-xs font-mono font-bold text-[#1F7A6E] bg-[#1F7A6E]/10 px-2 py-0.5 rounded">
                        {currentScore.min} – {currentScore.max} / 20
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-500 block mb-1">
                          {lang === 'ar' ? 'الحد الأدنى:' : 'Min score:'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={currentScore.min}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setFormState(prev => ({
                              ...prev,
                              subjectScores: {
                                ...prev.subjectScores,
                                [subj.id]: {
                                  min: val,
                                  max: Math.max(val, currentScore.max)
                                }
                              }
                            }));
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm text-[#0F3D37] focus:ring-1 focus:ring-[#1F7A6E]"
                        />
                      </div>

                      <div>
                        <label className="text-slate-500 block mb-1">
                          {lang === 'ar' ? 'الحد الأقصى:' : 'Max score:'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={currentScore.max}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setFormState(prev => ({
                              ...prev,
                              subjectScores: {
                                ...prev.subjectScores,
                                [subj.id]: {
                                  min: Math.min(currentScore.min, val),
                                  max: val
                                }
                              }
                            }));
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm text-[#0F3D37] focus:ring-1 focus:ring-[#1F7A6E]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Subject Preferences & Difficulties */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Subject Preference Ranking */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-[#0F3D37]">
                  {lang === 'ar' ? '1. ترتيب المواد حسب تفضيلك واستمتاعك بدراستها' : '1. Rank Subjects by Your Enjoyment & Preference'}
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  {lang === 'ar'
                    ? 'استخدم الأسهم لتحريك المواد المفضلة إلى الأعلى. (المادة في الأعلى هي الأكثر تفضيلاً لديك).'
                    : 'Use the up/down arrows to rank your subjects. Top is your most favorite.'}
                </p>
              </div>

              <div className="space-y-2">
                {formState.subjectPreferenceOrder.map((subjId, idx) => {
                  const subj = availableSubjects.find(s => s.id === subjId);
                  if (!subj) return null;
                  return (
                    <div
                      key={subjId}
                      className="flex items-center justify-between p-3 bg-[#F7F6F2] rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1F7A6E] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-sm text-[#0F3D37]">
                          {lang === 'ar' ? subj.name_ar : subj.name_en}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx > 0) {
                              const newOrder = [...formState.subjectPreferenceOrder];
                              const temp = newOrder[idx - 1];
                              newOrder[idx - 1] = newOrder[idx];
                              newOrder[idx] = temp;
                              setFormState(prev => ({ ...prev, subjectPreferenceOrder: newOrder }));
                            }
                          }}
                          className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formState.subjectPreferenceOrder.length - 1}
                          onClick={() => {
                            if (idx < formState.subjectPreferenceOrder.length - 1) {
                              const newOrder = [...formState.subjectPreferenceOrder];
                              const temp = newOrder[idx + 1];
                              newOrder[idx + 1] = newOrder[idx];
                              newOrder[idx] = temp;
                              setFormState(prev => ({ ...prev, subjectPreferenceOrder: newOrder }));
                            }
                          }}
                          className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficult Subjects (kept separate) */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0F3D37]">
                  {lang === 'ar' ? '2. المواد التي تواجه فيها صعوبة أكاديمية حالياً' : '2. Subjects You Find Difficult or Challenging'}
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  {lang === 'ar'
                    ? 'اختر المواد التي تشعر أنها تتطلب جهداً كبيراً أو تجد صعوبة في فهم مفاهيمها.'
                    : 'Select subjects where you frequently encounter comprehension hurdles.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSubjects.map((subj) => {
                  const isDifficult = formState.difficultSubjectIds.includes(subj.id);
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => {
                        setFormState(prev => ({
                          ...prev,
                          difficultSubjectIds: isDifficult
                            ? prev.difficultSubjectIds.filter(id => id !== subj.id)
                            : [...prev.difficultSubjectIds, subj.id]
                        }));
                      }}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                        isDifficult
                          ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-300'
                          : 'bg-white border-slate-200 text-[#4B5563] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang === 'ar' ? subj.name_ar : subj.name_en}</span>
                        {isDifficult && <span className="text-amber-600 font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Interests, Topics & Activities */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Field Interest Levels (1-5) */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#0F3D37]">
                  {lang === 'ar' ? '1. ما مدى اهتمامك بالمجالات المعرفية التالية؟' : '1. Rate Your Interest in Core Disciplines'}
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  {lang === 'ar' ? 'مقياس من 1 (غير مهتم إطلاقاً) إلى 5 (شديد الاهتمام والشغف)' : 'Scale: 1 = Not interested at all, 5 = Highly passionate'}
                </p>
              </div>

              <div className="space-y-3">
                {INTEREST_FIELDS.slice(0, 6).map((field) => {
                  const currentLevel = formState.fieldInterestLevels[field.id] || 3;
                  return (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="sm:max-w-md">
                        <h4 className="font-bold text-sm text-[#0F3D37]">
                          {lang === 'ar' ? field.name_ar : field.name_en}
                        </h4>
                        <p className="text-xs text-[#4B5563]">
                          {lang === 'ar' ? field.description_ar : field.description_en}
                        </p>
                      </div>

                      {/* Segmented rating buttons 1-5 */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              setFormState(prev => ({
                                ...prev,
                                fieldInterestLevels: {
                                  ...prev.fieldInterestLevels,
                                  [field.id]: lvl
                                }
                              }));
                            }}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                              currentLevel === lvl
                                ? 'bg-[#1F7A6E] text-white shadow-xs'
                                : 'bg-[#F7F6F2] text-[#4B5563] hover:bg-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Topics & Free Text */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0F3D37]">
                  {lang === 'ar' ? '2. مواضيع تثير حماسك واستكشافك' : '2. Specific Topics That Excite You'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(TOPICS_BY_FIELD).flat().slice(0, 8).map((topic) => {
                  const isSelected = formState.selectedTopicIds.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        setFormState(prev => ({
                          ...prev,
                          selectedTopicIds: isSelected
                            ? prev.selectedTopicIds.filter(id => id !== topic.id)
                            : [...prev.selectedTopicIds, topic.id]
                        }));
                      }}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                        isSelected
                          ? 'bg-[#1F7A6E]/10 border-[#1F7A6E] text-[#0F3D37] ring-1 ring-[#1F7A6E]'
                          : 'bg-white border-slate-200 text-[#4B5563] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang === 'ar' ? topic.name_ar : topic.name_en}</span>
                        {isSelected && <span className="text-[#1F7A6E] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Optional Other Free text preserving question & answer */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#4B5563] mb-1">
                  {lang === 'ar' ? 'مواضيع أخرى تود إضافتها (اختياري):' : 'Other topics of interest (optional free-text):'}
                </label>
                <input
                  type="text"
                  value={formState.topicOtherText}
                  onChange={(e) => setFormState(prev => ({ ...prev, topicOtherText: e.target.value }))}
                  placeholder={lang === 'ar' ? 'اكتب مواضيع أخرى...' : 'e.g. Astrophysics, Digital animation...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-[#0F3D37]"
                />
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0F3D37]">
                  {lang === 'ar' ? '3. الأنشطة التي تستمتع بالقيام بها' : '3. Activities You Genuinely Enjoy'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ACTIVITIES.map((act) => {
                  const isSelected = formState.activityIds.includes(act.id);
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => {
                        setFormState(prev => ({
                          ...prev,
                          activityIds: isSelected
                            ? prev.activityIds.filter(id => id !== act.id)
                            : [...prev.activityIds, act.id]
                        }));
                      }}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                        isSelected
                          ? 'bg-[#1F7A6E]/10 border-[#1F7A6E] text-[#0F3D37] ring-1 ring-[#1F7A6E]'
                          : 'bg-white border-slate-200 text-[#4B5563] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang === 'ar' ? act.name_ar : act.name_en}</span>
                        {isSelected && <span className="text-[#1F7A6E] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Environments (3rd year only) */}
            {!isFirstYear && (
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-[#0F3D37]">
                    {lang === 'ar' ? '4. بيئات العمل المستقبلية المفضلة' : '4. Preferred Future Work Environments'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WORK_ENVIRONMENTS.map((env) => {
                    const isSelected = formState.workEnvironmentIds.includes(env.id);
                    return (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => {
                          setFormState(prev => ({
                            ...prev,
                            workEnvironmentIds: isSelected
                              ? prev.workEnvironmentIds.filter(id => id !== env.id)
                              : [...prev.workEnvironmentIds, env.id]
                          }));
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                          isSelected
                            ? 'bg-[#1F7A6E]/10 border-[#1F7A6E] text-[#0F3D37] ring-1 ring-[#1F7A6E]'
                            : 'bg-white border-slate-200 text-[#4B5563] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{lang === 'ar' ? env.name_ar : env.name_en}</span>
                          {isSelected && <span className="text-[#1F7A6E] font-bold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Future Direction (Branching: Route A, B, C, D) */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {isFirstYear ? (
              /* Route A: Future Vision (Simplified) */
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F3D37]">
                    {lang === 'ar' ? 'تطلعاتك المهنية المستقبلية (اختياري)' : 'Future Career Aspirations (Optional)'}
                  </h3>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    {lang === 'ar'
                      ? 'كطالب في السنة الأولى ثانوي، لست ملزماً بتحديد مهنة نهائية، ولكن يمكنك مشاركة أي مهنة تحلم بها إن وجدت.'
                      : 'As a 1st year student, you are not pressured to declare a fixed career. Share any dreams if you have them.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                    {lang === 'ar' ? 'مهنة أو قطاع يلفت انتباهك:' : 'An occupation or industry that catches your attention:'}
                  </label>
                  <input
                    type="text"
                    value={formState.targetRoleText}
                    onChange={(e) => setFormState(prev => ({ ...prev, targetRoleText: e.target.value }))}
                    placeholder={lang === 'ar' ? 'مثال: مهندس برمجيات، طبيب، أستاذ، مصمم...' : 'e.g. Software architect, surgeon, researcher, teacher...'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-[#0F3D37]"
                  />
                </div>
              </div>
            ) : (
              /* Routes B, C, D: Goal Clarity Branching */
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0F3D37]">
                    {lang === 'ar' ? '1. ما مدى وضوح هدفك الجامعي والمهني؟' : '1. How defined is your career or university goal?'}
                    <span className="text-red-500 ml-1">*</span>
                  </h3>
                </div>

                {/* 3 Goal Clarity Branch Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {GOAL_CLARITY_OPTIONS.map((opt) => {
                    const selected = formState.goalClarity === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setFormState(prev => ({ ...prev, goalClarity: opt.id as any }))}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          selected
                            ? 'border-[#1F7A6E] bg-[#1F7A6E]/5 ring-1 ring-[#1F7A6E]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold text-sm text-[#0F3D37]">
                            {lang === 'ar' ? opt.name_ar : opt.name_en}
                          </h4>
                          <p className="text-xs text-[#4B5563] mt-1">
                            {lang === 'ar' ? opt.description_ar : opt.description_en}
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="goalClarity"
                          checked={selected}
                          onChange={() => {}}
                          className="mt-3 text-[#1F7A6E]"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Conditional Fields: Route B (Clear Goal) */}
                {formState.goalClarity === 'clear_goal' && (
                  <div className="space-y-6 p-5 bg-[#F7F6F2] rounded-xl border border-[#A7D0B8] animate-in fade-in">
                    <span className="text-xs font-bold text-[#1F7A6E] uppercase tracking-wider block">
                      Route B · Clear Goal Configuration
                    </span>

                    {/* Target Fields */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#0F3D37]">
                        {lang === 'ar' ? 'المجال أو التخصص المستهدف تحديداً:' : 'Specific Target Field(s):'}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {INTEREST_FIELDS.map((f) => {
                          const isSel = formState.targetFieldIds.includes(f.id);
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => {
                                setFormState(prev => ({
                                  ...prev,
                                  targetFieldIds: isSel
                                    ? prev.targetFieldIds.filter(id => id !== f.id)
                                    : [...prev.targetFieldIds, f.id]
                                }));
                              }}
                              className={`p-2 rounded border text-xs text-left font-medium ${
                                isSel ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]' : 'bg-white border-slate-200 text-[#4B5563]'
                              }`}
                            >
                              {lang === 'ar' ? f.name_ar : f.name_en}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target Role Text */}
                    <div>
                      <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                        {lang === 'ar' ? 'المسمى الوظيفي أو المهنة المستهدفة:' : 'Target Job Title or Profession:'}
                      </label>
                      <input
                        type="text"
                        value={formState.targetRoleText}
                        onChange={(e) => setFormState(prev => ({ ...prev, targetRoleText: e.target.value }))}
                        placeholder={lang === 'ar' ? 'مثلاً: جراح، مهندس ذكاء اصطناعي، قاضي...' : 'e.g. Surgeon, AI Research Engineer, High School Teacher...'}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-[#0F3D37]"
                      />
                    </div>

                    {/* Motivations */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#0F3D37]">
                        {lang === 'ar' ? 'دوافع اختيارك لهذا الهدف:' : 'Motivations for this Goal:'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {MOTIVATIONS.map((m) => {
                          const isSel = formState.motivationIds.includes(m.id);
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setFormState(prev => ({
                                  ...prev,
                                  motivationIds: isSel
                                    ? prev.motivationIds.filter(id => id !== m.id)
                                    : [...prev.motivationIds, m.id]
                                }));
                              }}
                              className={`p-2 rounded border text-xs text-left font-medium ${
                                isSel ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]' : 'bg-white border-slate-200 text-[#4B5563]'
                              }`}
                            >
                              {lang === 'ar' ? m.name_ar : m.name_en}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Route C (General Direction) */}
                {formState.goalClarity === 'general_direction' && (
                  <div className="space-y-6 p-5 bg-[#F7F6F2] rounded-xl border border-[#A7D0B8] animate-in fade-in">
                    <span className="text-xs font-bold text-[#1F7A6E] uppercase tracking-wider block">
                      Route C · General Direction Exploration
                    </span>

                    {/* Considered Fields */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#0F3D37]">
                        {lang === 'ar' ? 'المجالات التي تفكر فيها حالياً:' : 'Fields Under Consideration:'}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {INTEREST_FIELDS.map((f) => {
                          const isSel = formState.consideredFieldIds.includes(f.id);
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => {
                                setFormState(prev => ({
                                  ...prev,
                                  consideredFieldIds: isSel
                                    ? prev.consideredFieldIds.filter(id => id !== f.id)
                                    : [...prev.consideredFieldIds, f.id]
                                }));
                              }}
                              className={`p-2 rounded border text-xs text-left font-medium ${
                                isSel ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]' : 'bg-white border-slate-200 text-[#4B5563]'
                              }`}
                            >
                              {lang === 'ar' ? f.name_ar : f.name_en}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Future role status */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#0F3D37]">
                        {lang === 'ar' ? 'حالة التفكير في المهنة المستقبلية:' : 'Status regarding potential future role:'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'has_ideas', en: 'Have some ideas', ar: 'لدي بعض الأفكار' },
                          { id: 'exploring', en: 'Actively exploring options', ar: 'أستكشف الخيارات' },
                          { id: 'not_specified', en: 'Not decided yet', ar: 'غير محدد بعد' }
                        ].map((stat) => (
                          <button
                            key={stat.id}
                            type="button"
                            onClick={() => setFormState(prev => ({ ...prev, futureRoleStatus: stat.id as any }))}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                              formState.futureRoleStatus === stat.id
                                ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {lang === 'ar' ? stat.ar : stat.en}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Route D (No Defined Goal) */}
                {formState.goalClarity === 'no_defined_goal' && (
                  <div className="space-y-4 p-5 bg-[#F7F6F2] rounded-xl border border-[#A7D0B8] animate-in fade-in">
                    <span className="text-xs font-bold text-[#1F7A6E] uppercase tracking-wider block">
                      Route D · Discovery & Open Exploration
                    </span>
                    <p className="text-xs text-[#4B5563]">
                      {lang === 'ar'
                        ? 'ممتاز! هذا الاستبيان مصمم لمساعدتك على اكتشاف الخيارات المناسبة بدون فرض أي مسار مسبق.'
                        : 'Perfect! NaviStudo will assess your performance profile and cognitive preferences objectively without assuming prior bias.'}
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                        {lang === 'ar' ? 'ما هي المجالات التي تشعر بالفضول لاكتشافها؟' : 'Which fields are you open to discovering?'}
                      </label>
                      <input
                        type="text"
                        value={formState.fieldDiscoveryOtherText}
                        onChange={(e) => setFormState(prev => ({ ...prev, fieldDiscoveryOtherText: e.target.value }))}
                        placeholder={lang === 'ar' ? 'أي ملاحظة أو قطاع ترغب في التعرف عليه...' : 'e.g. Any new emerging tech, medical research...'}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-[#0F3D37]"
                      />
                    </div>
                  </div>
                )}

                {/* Priorities (Max 3 enforced!) */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F3D37]">
                        {lang === 'ar' ? '2. أهم الأولويات بالنسبة لك في مستقبلك المهني (اختر حتى 3)' : '2. Key Career Priorities (Select up to 3)'}
                        <span className="text-red-500 ml-1">*</span>
                      </h3>
                      <p className="text-xs text-[#4B5563]">
                        {lang === 'ar' ? `المحدد: ${formState.priorityIds.length} من 3` : `Selected: ${formState.priorityIds.length} of 3`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRIORITIES.map((prio) => {
                      const isSel = formState.priorityIds.includes(prio.id);
                      return (
                        <button
                          key={prio.id}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setFormState(prev => ({
                                ...prev,
                                priorityIds: prev.priorityIds.filter(id => id !== prio.id)
                              }));
                            } else {
                              if (formState.priorityIds.length < 3) {
                                setFormState(prev => ({
                                  ...prev,
                                  priorityIds: [...prev.priorityIds, prio.id]
                                }));
                              }
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                            isSel
                              ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]'
                              : formState.priorityIds.length >= 3
                              ? 'opacity-40 cursor-not-allowed bg-white border-slate-200'
                              : 'bg-white border-slate-200 text-[#4B5563] hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{lang === 'ar' ? prio.name_ar : prio.name_en}</span>
                            {isSel && <span>✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Problem Preferences (Routes B, C, D only) */}
        {!isFirstYear && currentStep === 6 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'تفضيلات التفكير وحل المشكلات' : 'Cognitive Problem-Solving Scales'}
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                {lang === 'ar'
                  ? 'تساعد هذه المقاييس على تحديد التخصصات الهندسية أو الطبية أو النظرية الأكثر توافقاً مع أسلوب تفكيرك.'
                  : 'These scales calibrate your affinity for theoretical models vs applied hands-on work, and human-centered vs system tasks.'}
              </p>
            </div>

            {/* Scale 1: Theory vs Application */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#0F3D37]">
                <span>{lang === 'ar' ? '1. الجانب النظري والتجريدي' : '1. Theoretical Modeling'}</span>
                <span className="text-[#1F7A6E] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {lang === 'ar' ? `المستوى: ${formState.theoryApplicationPreference} من 5` : `Value: ${formState.theoryApplicationPreference} / 5`}
                </span>
                <span>{lang === 'ar' ? 'الجانب التطبيقي والميداني' : 'Applied Hands-on Practice'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formState.theoryApplicationPreference}
                onChange={(e) => setFormState(prev => ({ ...prev, theoryApplicationPreference: parseInt(e.target.value) }))}
                className="w-full accent-[#1F7A6E]"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 (نظريات وبحوث)</span>
                <span>3 (توازن)</span>
                <span>5 (تطبيق مباشر وورشات)</span>
              </div>
            </div>

            {/* Scale 2: Abstract vs Concrete */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#0F3D37]">
                <span>{lang === 'ar' ? '2. المفاهيم المجردة والبرمجية' : '2. Abstract & Software Concepts'}</span>
                <span className="text-[#1F7A6E] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {lang === 'ar' ? `المستوى: ${formState.abstractConcretePreference} من 5` : `Value: ${formState.abstractConcretePreference} / 5`}
                </span>
                <span>{lang === 'ar' ? 'الأنظمة المادية الملموسة' : 'Tangible Physical Systems'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formState.abstractConcretePreference}
                onChange={(e) => setFormState(prev => ({ ...prev, abstractConcretePreference: parseInt(e.target.value) }))}
                className="w-full accent-[#1F7A6E]"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 (خوارزميات وأفكار)</span>
                <span>3 (توازن)</span>
                <span>5 (آلات ومعدات حقيقية)</span>
              </div>
            </div>

            {/* Scale 3: Human vs System */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#0F3D37]">
                <span>{lang === 'ar' ? '3. التواصل البشري والرعاية' : '3. People & Human Relations'}</span>
                <span className="text-[#1F7A6E] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {lang === 'ar' ? `المستوى: ${formState.humanSystemPreference} من 5` : `Value: ${formState.humanSystemPreference} / 5`}
                </span>
                <span>{lang === 'ar' ? 'الأنظمة التقنية والآلات' : 'Technical Tools & Systems'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formState.humanSystemPreference}
                onChange={(e) => setFormState(prev => ({ ...prev, humanSystemPreference: parseInt(e.target.value) }))}
                className="w-full accent-[#1F7A6E]"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 (مرضى، طلاب، عملاء)</span>
                <span>3 (توازن)</span>
                <span>5 (حواسيب ومصانع)</span>
              </div>
            </div>

            {/* Problem types */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'أنواع المشكلات التي تبرع في حلها:' : 'Problem Types You Excel In:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROBLEM_TYPES.map((pt) => {
                  const isSel = formState.problemTypeIds.includes(pt.id);
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => {
                        setFormState(prev => ({
                          ...prev,
                          problemTypeIds: isSel
                            ? prev.problemTypeIds.filter(id => id !== pt.id)
                            : [...prev.problemTypeIds, pt.id]
                        }));
                      }}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                        isSel
                          ? 'bg-[#1F7A6E]/10 border-[#1F7A6E] text-[#0F3D37] ring-1 ring-[#1F7A6E]'
                          : 'bg-white border-slate-200 text-[#4B5563] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang === 'ar' ? pt.name_ar : pt.name_en}</span>
                        {isSel && <span className="text-[#1F7A6E] font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FINAL STEP: Review & Confirm */}
        {((isFirstYear && currentStep === 6) || (!isFirstYear && currentStep === 7)) && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'مراجعة بياناتك قبل توليد التوصيات' : 'Review & Confirm Your Answers'}
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                {lang === 'ar'
                  ? 'تحقق من صحة المعطيات المدخلة. يمكنك العودة لتعديل أي قسم بالضغط على الأزرار السابقة.'
                  : 'Please review your answers before submitting. You can navigate back to modify any step.'}
              </p>
            </div>

            {/* Summary Cards */}
            <div className="space-y-3">
              <div className="p-4 bg-[#F7F6F2] rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    {lang === 'ar' ? 'المرحلة الدراسية والشعبة' : 'Academic Stage & Branch'}
                  </span>
                  <h4 className="font-bold text-sm text-[#0F3D37] mt-0.5">
                    {isFirstYear
                      ? (lang === 'ar' ? 'السنة الأولى ثانوي · جذع مشترك' : 'First Year Secondary · Common Core')
                      : (lang === 'ar' ? `السنة الثالثة ثانوي · شعبة ${formState.branchId}` : `3rd Year Secondary · ${formState.branchId}`)}
                  </h4>
                  {formState.hasTakenBaccalaureate && (
                    <span className="text-xs text-[#1F7A6E] font-semibold block mt-0.5">
                      {lang === 'ar' ? `معدل البكالوريا: ${formState.baccalaureateAverage} / 20` : `BAC Average: ${formState.baccalaureateAverage} / 20`}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-[#1F7A6E] hover:underline"
                >
                  {lang === 'ar' ? 'تعديل' : 'Edit'}
                </button>
              </div>

              <div className="p-4 bg-[#F7F6F2] rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    {lang === 'ar' ? 'المواد المفضلة والصعوبات' : 'Preferences & Difficulties'}
                  </span>
                  <p className="text-xs text-[#0F3D37] font-medium mt-0.5">
                    {lang === 'ar' ? 'المواد المفضلة الأولى:' : 'Top preferred subject:'} {formState.subjectPreferenceOrder[0] || 'None'}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'ar' ? 'المواد ذات الصعوبة:' : 'Difficult subjects:'} {formState.difficultSubjectIds.join(', ') || (lang === 'ar' ? 'لا يوجد' : 'None')}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-[#1F7A6E] hover:underline"
                >
                  {lang === 'ar' ? 'تعديل' : 'Edit'}
                </button>
              </div>

              {!isFirstYear && (
                <div className="p-4 bg-[#F7F6F2] rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      {lang === 'ar' ? 'وضوح الهدف والأولويات' : 'Goal Clarity & Priorities'}
                    </span>
                    <h4 className="font-bold text-sm text-[#0F3D37] mt-0.5 capitalize">
                      {formState.goalClarity.replace('_', ' ')}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'ar' ? 'الأولويات المهنية:' : 'Priorities:'} {formState.priorityIds.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="text-xs font-bold text-[#1F7A6E] hover:underline"
                  >
                    {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                </div>
              )}
            </div>

            {/* Reassuring note */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
              <CheckCircle className="w-4 h-4 inline mr-1.5 text-emerald-600" />
              <span>
                {lang === 'ar'
                  ? 'بياناتك جاهزة للإرسال إلى محرك التوجيه الأكاديمي. ستحصل على تحليل تفصيلي للتخصصات الأكثر مطابقة لمؤهلاتك وطموحاتك.'
                  : 'Ready to submit. The recommendation engine will evaluate prerequisite branches, subject scores, and cognitive problem-solving matches.'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Actions Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#4B5563] hover:text-[#0F3D37] hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'التالي' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-7 py-3 bg-[#1F7A6E] hover:bg-[#A7D0B8] hover:text-[#0F3D37] text-white text-sm font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'ar' ? 'جاري توليد التوصيات...' : 'Generating Recommendations...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تأكيد وتوليد التوصيات' : 'Generate Recommendations'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
