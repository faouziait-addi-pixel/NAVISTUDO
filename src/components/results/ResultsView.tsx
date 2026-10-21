import React, { useState } from 'react';
import { MajorRecommendation, Language } from '../../types/contract';
import {
  Award,
  Sparkles,
  Bookmark,
  ChevronRight,
  Filter,
  RotateCcw,
  Clock,
  CheckCircle,
  Printer,
  GraduationCap,
  Calendar,
  User,
  Building,
  Briefcase,
  Download,
  Eye,
  X,
  FileText,
  Check,
  AlertCircle
} from 'lucide-react';
import { ScreenType } from '../layout/Navbar';
import { QuestionnaireFormState } from '../../services/payloadBuilder';
import { AppUser } from '../../services/auth';
import {
  THIRD_YEAR_BRANCHES,
  FIRST_YEAR_STUDY_GROUPS,
  ACADEMIC_STAGES
} from '../../types/taxonomy';

interface ResultsViewProps {
  recommendations: MajorRecommendation[];
  isLocalFallback: boolean;
  bookmarkedMajorIds: string[];
  onToggleBookmark: (majorId: string) => void;
  onSelectMajor: (majorId: string) => void;
  onRevisitQuestionnaire: () => void;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
  formState?: QuestionnaireFormState;
  currentUser?: AppUser | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  recommendations,
  isLocalFallback,
  bookmarkedMajorIds,
  onToggleBookmark,
  onSelectMajor,
  onRevisitQuestionnaire,
  onNavigate,
  lang,
  formState,
  currentUser
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMatchLevel, setFilterMatchLevel] = useState<string>('all');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printBlockedNotice, setPrintBlockedNotice] = useState<boolean>(false);

  const categories = [
    { id: 'all', en: 'All Disciplines', ar: 'جميع التخصصات', fr: 'Toutes les disciplines' },
    { id: 'engineering', en: 'Engineering & Tech', ar: 'الهندسة والتكنولوجيا', fr: 'Sciences de l\'Ingénieur & Tech' },
    { id: 'health', en: 'Health & Medical', ar: 'العلوم الطبية والصحية', fr: 'Sciences Médicales & Santé' },
    { id: 'science', en: 'Natural Sciences', ar: 'العلوم الدقيقة والطبيعية', fr: 'Sciences Exactes & Naturelles' },
    { id: 'business', en: 'Business & Economics', ar: 'التسيير والاقتصاد', fr: 'Gestion & Économie' },
    { id: 'humanities', en: 'Law & Humanities', ar: 'الحقوق والعلوم الإنسانية', fr: 'Droit & Lettres' }
  ];

  const getMajorTitle = (m: MajorRecommendation) => {
    if (lang === 'ar') return m.title_ar;
    if (lang === 'fr' && m.title_fr) return m.title_fr;
    return m.title_en;
  };

  const getMajorExplanation = (m: MajorRecommendation) => {
    if (lang === 'ar') return m.explanation_ar;
    if (lang === 'fr' && m.explanation_fr) return m.explanation_fr;
    return m.explanation_en;
  };

  const getStudentAcademicSummary = () => {
    if (!formState) {
      return lang === 'ar' ? 'التعليم الثانوي' : lang === 'fr' ? 'Cycle Secondaire' : 'Secondary Education';
    }

    if (formState.stageId === 'third_year_secondary') {
      const branchObj = THIRD_YEAR_BRANCHES.find(b => b.id === formState.branchId);
      const branchName = branchObj
        ? (lang === 'ar' ? branchObj.name_ar : lang === 'fr' && branchObj.name_fr ? branchObj.name_fr : branchObj.name_en)
        : formState.branchId.replace(/_/g, ' ');

      if (lang === 'ar') return `السنة الثالثة ثانوي (البكالوريا) · شعبة ${branchName}`;
      if (lang === 'fr') return `Terminale (Baccalauréat) · Filière ${branchName}`;
      return `3rd Year Secondary (Baccalaureate) · ${branchName}`;
    }

    if (formState.stageId === 'first_year_secondary') {
      const groupObj = FIRST_YEAR_STUDY_GROUPS.find(g => g.id === formState.studyGroupId);
      const groupName = groupObj
        ? (lang === 'ar' ? groupObj.name_ar : lang === 'fr' && groupObj.name_fr ? groupObj.name_fr : groupObj.name_en)
        : formState.studyGroupId.replace(/_/g, ' ');

      if (lang === 'ar') return `السنة الأولى ثانوي · ${groupName}`;
      if (lang === 'fr') return `1ère Année Secondaire · ${groupName}`;
      return `1st Year Secondary · ${groupName}`;
    }

    return lang === 'ar' ? 'التعليم الثانوي' : lang === 'fr' ? 'Cycle Secondaire' : 'Secondary Education';
  };

  /**
   * Safe trigger for native browser print with fallback diagnostics
   */
  const safeTriggerPrint = () => {
    const originalTitle = document.title;
    document.title = lang === 'ar'
      ? 'NaviStudo_تقرير_التوجيه_الجامعي'
      : lang === 'fr'
      ? 'NaviStudo_Bilan_Orientation_Universitaire'
      : 'NaviStudo_Academic_Orientation_Report';

    try {
      window.print();
    } catch (err) {
      console.warn('Native window.print() was blocked or failed:', err);
      setPrintBlockedNotice(true);
    } finally {
      setTimeout(() => {
        document.title = originalTitle;
      }, 1500);
    }
  };

  /**
   * Main print action: opens the official print state modal & invokes native print
   */
  const handlePrintPdf = () => {
    setIsPrintModalOpen(true);
    safeTriggerPrint();
  };

  /**
   * Generate an offline, standalone, beautifully-styled HTML document for print & PDF archiving
   * Completely bypasses iframe sandboxes, cross-origin restrictions, and popup blockers
   */
  const generatePrintableHtml = (): string => {
    const isAr = lang === 'ar';
    const isFr = lang === 'fr';
    const reportDate = new Date().toLocaleDateString(isAr ? 'ar-DZ' : isFr ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const reportId = `NS-REC-${new Date().getFullYear()}-${recommendations.length}`;
    const studentName = currentUser?.displayName || currentUser?.email || (isAr ? 'طالب مجهول' : isFr ? 'Profil Étudiant' : 'Anonymous Student');
    const academicSummary = getStudentAcademicSummary();
    const evaluationEngine = isLocalFallback
      ? (isFr ? 'Critères académiques officiels (Règles ministérielles)' : isAr ? 'المعايير الأكاديمية الرسمية' : 'Authoritative Rules Engine')
      : (isFr ? 'Moteur d\'adéquation complet' : isAr ? 'محرك التوافق الشامل' : 'Full Alignment Engine');

    const docTitle = isAr
      ? 'NaviStudo - تقرير التوجيه الجامعي الرسمي'
      : isFr
      ? 'NaviStudo - Bilan Officiel d\'Orientation Universitaire'
      : 'NaviStudo - Official Academic Orientation Assessment';

    const itemsHtml = recommendations.map((rec, index) => {
      const title = getMajorTitle(rec);
      const explanation = getMajorExplanation(rec);
      const matchLabel = rec.match_level === 'strong_match'
        ? (isAr ? 'توافق قوي ومباشر' : isFr ? 'Forte Adéquation' : 'Strong Match')
        : rec.match_level === 'great_alternative'
        ? (isAr ? 'بديل أكاديمي ممتاز' : isFr ? 'Alternative Conseillée' : 'Great Alternative')
        : (isAr ? 'مجال واعد للاستكشاف' : isFr ? 'Filière à Explorer' : 'Field to Explore');

      const subjectsHtml = rec.key_subjects.slice(0, 5).map(s =>
        `<span style="display:inline-block;background:#f1f5f9;border:1px solid #cbd5e1;padding:2px 8px;border-radius:4px;font-size:11px;margin-right:4px;color:#1e293b;">${s.replace(/_/g, ' ')}</span>`
      ).join(' ');

      const careersHtml = rec.typical_careers && rec.typical_careers.length > 0
        ? `<div style="margin-top:6px;font-size:11px;color:#334155;"><strong>${isAr ? 'المهن المستهدفة:' : isFr ? 'Débouchés professionnels :' : 'Target Careers:'}</strong> ${rec.typical_careers.slice(0, 4).join(' • ')}</div>`
        : '';

      const instHtml = rec.institution_types && rec.institution_types.length > 0
        ? `<div style="margin-top:4px;font-size:11px;color:#334155;"><strong>${isAr ? 'المؤسسات:' : isFr ? 'Établissements :' : 'Institutions:'}</strong> ${rec.institution_types.join(', ')} ${rec.min_indicative_average ? `<span style="color:#065f46;font-weight:bold;margin-left:6px;">(${isAr ? 'المعدل الأدنى الاسترشادي:' : isFr ? 'Moyenne indicative :' : 'Indicative avg:'} ${rec.min_indicative_average}/20)</span>` : ''}</div>`
        : '';

      return `
        <div style="border:1px solid #cbd5e1;border-radius:8px;padding:12px 16px;margin-bottom:12px;background:#ffffff;page-break-inside:avoid;break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div style="flex:1;">
              <div style="font-size:11px;color:#64748b;margin-bottom:4px;">
                <strong style="color:#0F3D37;margin-right:6px;">#${index + 1}</strong>
                <span style="display:inline-block;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;border-radius:4px;padding:1px 6px;font-weight:bold;font-size:10px;margin-right:6px;">${matchLabel}</span>
                <span style="text-transform:capitalize;">${rec.category}</span> · <span>${rec.study_duration_years} ${isFr ? 'ans' : isAr ? 'سنوات' : 'years'}</span>
              </div>
              <h3 style="margin:2px 0 6px 0;font-size:16px;font-weight:bold;color:#0F3D37;">${title}</h3>
              <p style="margin:0 0 8px 0;font-size:12px;color:#334155;line-height:1.5;">${explanation}</p>
            </div>
            <div style="text-align:right;min-width:70px;margin-left:12px;">
              <span style="font-size:22px;font-weight:900;color:#1F7A6E;display:block;line-height:1;">${rec.match_score}%</span>
              <span style="font-size:9px;color:#64748b;text-transform:uppercase;font-weight:bold;">${isAr ? 'نسبة التوافق' : isFr ? 'Affinité' : 'Score'}</span>
            </div>
          </div>
          <div style="margin-top:6px;padding-top:6px;border-top:1px solid #f1f5f9;font-size:11px;color:#334155;">
            <strong>${isAr ? 'المواد الدراسية المرتبطة:' : isFr ? 'Matières clés :' : 'Key Subjects:'}</strong>
            ${subjectsHtml}
          </div>
          ${careersHtml}
          ${instHtml}
        </div>
      `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm 15mm 15mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      font-family: ${isAr ? "'Tajawal', 'Segoe UI', Tahoma, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"};
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
    }
    .print-banner {
      background: #0F3D37;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .print-action-btn {
      background: #ffffff;
      color: #0F3D37;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 13px;
    }
    .header-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0F3D37;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .logo-badge {
      width: 44px;
      height: 44px;
      background: #0F3D37;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 18px;
      border-radius: 10px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
    }
    .signature-area {
      display: flex;
      justify-content: space-between;
      margin-top: 18px;
      padding: 12px 18px;
      border: 1px dashed #94a3b8;
      border-radius: 8px;
      font-size: 11px;
      color: #475569;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .official-footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 2px solid #cbd5e1;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    @media print {
      .print-banner { display: none !important; }
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="print-banner">
    <div>
      <strong style="font-size: 15px;">NaviStudo</strong> — ${isAr ? 'بيان التوجيه الجامعي جاهز للطباعة والحفظ' : isFr ? 'État d\'impression officiel prêt pour archivage PDF' : 'Official orientation assessment ready'}
    </div>
    <button class="print-action-btn" onclick="window.print()">${isAr ? 'طباعة الآن / حفظ كـ PDF' : isFr ? 'Imprimer / Sauvegarder en PDF' : 'Print / Save as PDF'}</button>
  </div>

  <div class="header-box">
    <div style="display:flex;align-items:center;gap:12px;">
      <div class="logo-badge">NS</div>
      <div>
        <div style="font-size:22px;font-weight:900;color:#0F3D37;margin:0;">NaviStudo</div>
        <div style="font-size:11px;color:#475569;">${isAr ? 'المنصة الوطنية للتوجيه المدرسي والأكاديمي' : isFr ? 'Plateforme d\'Orientation Scolaire & Universitaire' : 'Academic & University Orientation Platform'}</div>
      </div>
    </div>
    <div style="text-align:right;font-size:11px;color:#475569;">
      <div><strong>${isAr ? 'تاريخ التقرير:' : isFr ? 'Date du rapport :' : 'Report Date:'}</strong> ${reportDate}</div>
      <div style="font-family:monospace;font-size:10px;color:#94a3b8;margin-top:2px;">ID: ${reportId}</div>
    </div>
  </div>

  <div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:10px 16px;margin-bottom:14px;">
    <h1 style="margin:0;font-size:15px;color:#0F3D37;text-transform:uppercase;letter-spacing:0.5px;">${isAr ? 'تقرير التوجيه الأكاديمي والمسارات الجامعية المقترحة' : isFr ? 'Bilan Officiel d\'Orientation Académique & Recommandations de Filières' : 'Official Academic Guidance Assessment & Major Recommendations'}</h1>
    <div style="font-size:11px;color:#475569;margin-top:3px;">
      ${isAr ? `تحليل شامل ومفصل لدرجات المواد والميول الأكاديمية (${recommendations.length} مساراً موصى به).` : isFr ? `Analyse synthétique des performances scolaires et affinités (${recommendations.length} filières sélectionnées).` : `Comprehensive academic profile analysis (${recommendations.length} ranked majors).`}
    </div>
  </div>

  <div class="meta-grid">
    <div>
      <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:bold;display:block;">${isAr ? 'الطالب / المستفيد' : isFr ? 'Élève / Candidat' : 'Student'}</span>
      <span style="font-size:12px;font-weight:bold;color:#1e293b;display:block;margin-top:2px;">${studentName}</span>
    </div>
    <div>
      <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:bold;display:block;">${isAr ? 'المستوى الدراسي والشعبة' : isFr ? 'Cycle & Série d\'études' : 'Academic Stream'}</span>
      <span style="font-size:12px;font-weight:bold;color:#1e293b;display:block;margin-top:2px;">${academicSummary}</span>
    </div>
    <div>
      <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:bold;display:block;">${isAr ? 'نظام التقييم' : isFr ? 'Évaluation' : 'Evaluation'}</span>
      <span style="font-size:12px;font-weight:bold;color:#065f46;display:block;margin-top:2px;">${evaluationEngine}</span>
    </div>
  </div>

  ${itemsHtml}

  <div class="signature-area">
    <div>
      <strong>${isAr ? 'تأشيرة مستشار التوجيه والإرشاد المدرسي:' : isFr ? 'Visa du Conseiller d\'Orientation Scolaire :' : 'Guidance Counselor Visa:'}</strong>
      <div style="height:36px;"></div>
      <span>${isAr ? 'الاسم والتوقيع: .......................................' : isFr ? 'Nom & Signature : .......................................' : 'Name & Signature: .......................................'}</span>
    </div>
    <div style="text-align:right;">
      <strong>${isAr ? 'ختم المؤسسة التربوية / المركز الجامعي:' : isFr ? 'Cachet de l\'Établissement :' : 'Institution Stamp:'}</strong>
      <div style="height:36px;"></div>
      <span>Date: .......................................</span>
    </div>
  </div>

  <div class="official-footer">
    <div>NaviStudo — Plateforme d'Orientation Scolaire & Universitaire · https://navistudo.edu</div>
    <div style="margin-top:4px;">
      ${isAr ? 'وثيقة رسمية استرشادية صادرة عن منصة NaviStudo لمرافقة التلميذ في تحضير رغبات التسجيل والتوجيه الجامعي.' : isFr ? 'Document officiel d\'aide à l\'orientation scolaire et universitaire généré par NaviStudo pour accompagner les choix d\'inscription.' : 'Official guidance assessment document generated by NaviStudo.'}
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try { window.print(); } catch (e) {}
      }, 400);
    });
  </script>
</body>
</html>`;
  };

  /**
   * Triggers download of the self-contained printable report file
   */
  const handleDownloadPrintableReport = () => {
    try {
      const htmlContent = generatePrintableHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lang === 'ar'
        ? 'NaviStudo_تقرير_التوجيه_الجامعي.html'
        : lang === 'fr'
        ? 'NaviStudo_Bilan_Orientation_Universitaire.html'
        : 'NaviStudo_Academic_Orientation_Report.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating printable report file:', err);
    }
  };

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
          {lang === 'ar'
            ? 'لم يتم توليد أي توصيات بعد'
            : lang === 'fr'
            ? 'Aucune recommandation disponible'
            : 'No Recommendations Available'}
        </h2>
        <p className="text-sm text-[#4B5563] leading-relaxed">
          {lang === 'ar'
            ? 'للحصول على توصيات مصممة خصيصاً لمستواك وميولك، يرجى ملء استبيان التوجيه المدرسي أولاً.'
            : lang === 'fr'
            ? 'Pour obtenir des recommandations personnalisées fondées sur votre cycle et vos notes, veuillez d\'abord compléter le questionnaire.'
            : 'To view recommendations tailored to your academic background and interests, please complete the orientation questionnaire.'}
        </p>
        <button
          onClick={onRevisitQuestionnaire}
          className="px-6 py-3 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-bold text-sm rounded-xl shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {lang === 'ar'
              ? 'بدء استبيان التوجيه الآن'
              : lang === 'fr'
              ? 'Lancer le questionnaire d\'orientation'
              : 'Start Orientation Questionnaire'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 print:space-y-4 print:pb-0">
      {/* Formal Print-Only Document Header (replaces screen banner during print / PDF generation) */}
      <div className="navistudo-print-only pb-4 mb-4 border-b-2 border-[#0F3D37] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F3D37] text-white flex items-center justify-center font-black text-sm">
              NS
            </div>
            <div>
              <div className="text-xl font-black text-[#0F3D37] tracking-tight">NaviStudo</div>
              <div className="text-[11px] text-slate-600 font-medium">
                {lang === 'ar'
                  ? 'المنصة الوطنية للتوجيه المدرسي والأكاديمي'
                  : lang === 'fr'
                  ? 'Plateforme d\'Orientation Scolaire & Universitaire'
                  : 'Academic & Higher Education Orientation Platform'}
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div>
              <span className="font-bold text-slate-700">
                {lang === 'ar' ? 'تاريخ التقرير:' : lang === 'fr' ? 'Date du rapport :' : 'Report Date:'}{' '}
              </span>
              <span>
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              ID: NS-REC-{new Date().getFullYear()}-{recommendations.length}
            </div>
          </div>
        </div>

        {/* Document Title Banner */}
        <div className="bg-slate-100 rounded-lg p-3 border border-slate-300">
          <h1 className="text-base font-bold text-[#0F3D37] uppercase tracking-wide">
            {lang === 'ar'
              ? 'تقرير التوجيه الأكاديمي والمسارات الجامعية المقترحة'
              : lang === 'fr'
              ? 'Bilan Officiel d\'Orientation Académique & Recommandations de Filières'
              : 'Official Academic Guidance Assessment & Major Recommendations'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {lang === 'ar'
              ? `تحليل شامل ومفصل لدرجات المواد، أسلوب حل المشكلات والميول الشخصية (${recommendations.length} مساراً موصى به).`
              : lang === 'fr'
              ? `Analyse synthétique des performances scolaires, méthode de résolution et affinités (${recommendations.length} filières sélectionnées).`
              : `Comprehensive synthesis based on academic strengths, problem-solving style, and interest profile (${recommendations.length} ranked paths).`}
          </p>
        </div>

        {/* Student Profile Metadata Box */}
        <div className="grid grid-cols-3 gap-3 bg-white rounded-lg p-3 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {lang === 'ar' ? 'الطالب / المستفيد' : lang === 'fr' ? 'Élève / Candidat' : 'Student'}
            </span>
            <span className="font-bold text-slate-800 text-xs">
              {currentUser?.displayName || currentUser?.email || (lang === 'ar' ? 'طالب مجهول' : lang === 'fr' ? 'Profil Étudiant' : 'Anonymous Student')}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {lang === 'ar' ? 'المستوى الدراسي والشعبة' : lang === 'fr' ? 'Cycle & Série d\'études' : 'Academic Stream'}
            </span>
            <span className="font-semibold text-slate-700">
              {getStudentAcademicSummary()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {lang === 'ar' ? 'نظام التقييم' : lang === 'fr' ? 'Évaluation' : 'Evaluation'}
            </span>
            <span className="font-semibold text-emerald-800">
              {isLocalFallback
                ? (lang === 'fr' ? 'Critères académiques officiels' : 'Authoritative Rules Engine')
                : (lang === 'fr' ? 'Moteur d\'adéquation complet' : 'Full Alignment Engine')}
            </span>
          </div>
        </div>
      </div>

      {/* Screen Header Results Summary Banner (hidden during print) */}
      <div className="bg-[#0F3D37] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#1F7A6E]/30 relative overflow-hidden print:hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#A7D0B8] uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'تقرير التوجيه الأكاديمي المخصص'
                  : lang === 'fr'
                  ? 'Rapport d\'Orientation Académique Personnalisé'
                  : 'Custom Orientation Recommendation Report'}
              </span>
            </div>

            {/* Top Action Bar (Print en PDF + État d'impression Preview + Edit Answers) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPdf}
                className="px-4 py-2 bg-white text-[#0F3D37] hover:bg-[#A7D0B8] rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:scale-102 transform duration-150 shrink-0"
                title={
                  lang === 'ar'
                    ? 'طباعة النتائج أو حفظها كملف PDF'
                    : lang === 'fr'
                    ? 'Imprimer ou enregistrer le rapport en PDF'
                    : 'Print or save report as PDF'
                }
              >
                <Printer className="w-4 h-4 text-[#1F7A6E]" />
                <span>
                  {lang === 'ar'
                    ? 'طباعة في PDF'
                    : lang === 'fr'
                    ? 'Imprimer en PDF'
                    : 'Print to PDF'}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                  PDF
                </span>
              </button>

              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                title={lang === 'ar' ? 'معاينة بيان وحالة الطباعة' : lang === 'fr' ? 'Consulter l\'état d\'impression officiel' : 'Official Print State & Assessment Preview'}
              >
                <Eye className="w-3.5 h-3.5 text-[#A7D0B8]" />
                <span>
                  {lang === 'ar'
                    ? 'بيان الطباعة'
                    : lang === 'fr'
                    ? 'État d\'impression'
                    : 'Print State'}
                </span>
              </button>

              <button
                onClick={onRevisitQuestionnaire}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar'
                    ? 'تعديل الإجابات'
                    : lang === 'fr'
                    ? 'Modifier mes réponses'
                    : 'Edit Answers'}
                </span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'ar'
              ? 'نتائج ومسارات التوجيه المقترحة'
              : lang === 'fr'
              ? 'Vos spécialités et filières recommandées'
              : 'Your Recommended Academic Paths & Majors'}
          </h1>

          <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
            {lang === 'ar'
              ? `تم تحليل أدائك في المواد الدراسية، أسلوبك في حل المشكلات، واهتماماتك المهنية لتوليد ${recommendations.length} مساراً أكاديمياً مرتبة حسب درجة التوافق.`
              : lang === 'fr'
              ? `Sur la base de votre profil scolaire, vos matières fortes et vos aspirations, nous avons identifié ${recommendations.length} filières classées par affinité.`
              : `Based on your subject score profile, problem-solving preferences, and aspirations, we identified ${recommendations.length} compatible paths, ranked from strongest match.`}
          </p>

          {isLocalFallback && (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#A7D0B8] bg-black/20 px-3 py-1 rounded-md border border-[#A7D0B8]/20">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {lang === 'fr'
                  ? 'Évalué selon le moteur de critères universitaires (règles officielles)'
                  : 'Evaluated via curriculum engine (authoritative scoring rules)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs (hidden during print) */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D37]">
            <Filter className="w-4 h-4 text-[#1F7A6E]" />
            <span>
              {lang === 'ar' ? 'تصفية حسب المجال المعرفي:' : lang === 'fr' ? 'Filtrer par discipline :' : 'Filter by Academic Discipline:'}
            </span>
          </div>

          {/* Segmented Match Level Selector */}
          <div className="flex items-center gap-1 bg-[#F7F6F2] p-1 rounded-lg text-xs">
            {[
              { id: 'all', en: 'All Levels', ar: 'الكل', fr: 'Tous' },
              { id: 'strong_match', en: 'Strong Match', ar: 'توافق قوي', fr: 'Très forte affinité' },
              { id: 'great_alternative', en: 'Alternatives', ar: 'بدائل ممتازة', fr: 'Alternatives' }
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
                {lang === 'ar' ? lvl.ar : lang === 'fr' ? lvl.fr : lvl.en}
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
              {lang === 'ar' ? cat.ar : lang === 'fr' ? cat.fr : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Recommendations List */}
      <div className="space-y-4 print:space-y-3">
        {filteredList.map((rec, index) => {
          const isSaved = bookmarkedMajorIds.includes(rec.major_id);

          const matchLevelBadge = {
            strong_match: {
              label_en: 'Strong Match',
              label_ar: 'توافق قوي ومباشر',
              label_fr: 'Forte Adéquation',
              color: 'text-emerald-800 bg-emerald-50 border-emerald-200 print:text-emerald-950 print:bg-emerald-50/80 print:border-emerald-300'
            },
            great_alternative: {
              label_en: 'Great Alternative',
              label_ar: 'بديل أكاديمي ممتاز',
              label_fr: 'Alternative Conseillée',
              color: 'text-teal-800 bg-teal-50 border-teal-200 print:text-teal-950 print:bg-teal-50/80 print:border-teal-300'
            },
            field_to_explore: {
              label_en: 'Field to Explore',
              label_ar: 'مجال واعد للاستكشاف',
              label_fr: 'Filière à Explorer',
              color: 'text-slate-800 bg-slate-100 border-slate-200 print:text-slate-900 print:bg-slate-100 print:border-slate-300'
            }
          }[rec.match_level];

          const badgeLabel = lang === 'ar' ? matchLevelBadge.label_ar : lang === 'fr' ? matchLevelBadge.label_fr : matchLevelBadge.label_en;

          return (
            <div
              key={rec.major_id}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-[#1F7A6E] transition-all space-y-4 group print:shadow-none print:border print:border-slate-300 print:rounded-xl print:p-4 print:mb-3 print:break-inside-avoid print:bg-white print:space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 print:flex-row print:items-start">
                <div className="space-y-1.5 flex-1">
                  {/* Unboxed metadata row */}
                  <div className="flex items-center gap-2 text-xs text-[#4B5563] print:text-slate-700">
                    <span className="font-bold text-[#1F7A6E] print:text-emerald-900">#{index + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${matchLevelBadge.color}`}>
                      {badgeLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{rec.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.study_duration_years} {lang === 'fr' ? 'ans' : lang === 'ar' ? 'سنوات' : 'Years'}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0F3D37] print:text-base print:font-extrabold">
                    {getMajorTitle(rec)}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4B5563] print:text-slate-700 leading-relaxed pt-1">
                    {getMajorExplanation(rec)}
                  </p>
                </div>

                {/* Match Score Badge */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 print:flex-col print:items-end">
                  <div className="text-right print:text-right">
                    <span className="block text-2xl font-black text-[#1F7A6E] print:text-emerald-900 print:text-xl">
                      {rec.match_score}%
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      {lang === 'ar' ? 'نسبة التطابق' : lang === 'fr' ? 'Affinité' : 'Match Score'}
                    </span>
                  </div>

                  {/* Bookmark Button: hidden in print */}
                  <button
                    onClick={() => onToggleBookmark(rec.major_id)}
                    className={`p-2 rounded-lg border transition-colors print:hidden ${
                      isSaved
                        ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]'
                        : 'bg-[#F7F6F2] text-[#4B5563] hover:text-[#0F3D37] border-slate-200'
                    }`}
                    title={isSaved ? 'Enregistré' : 'Enregistrer'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Bottom detail row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs print:pt-2 print:border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#0F3D37] print:text-slate-800">
                    {lang === 'ar' ? 'المواد المرتبطة:' : lang === 'fr' ? 'Matières clés :' : 'Key Subjects:'}
                  </span>
                  {rec.key_subjects.slice(0, 4).map(s => (
                    <span
                      key={s}
                      className="bg-[#F7F6F2] px-2 py-0.5 rounded text-slate-700 font-mono text-[11px] print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300"
                    >
                      {s.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>

                {/* Details Button: hidden in print */}
                <button
                  onClick={() => onSelectMajor(rec.major_id)}
                  className="px-4 py-2 bg-[#F7F6F2] hover:bg-[#1F7A6E] text-[#0F3D37] hover:text-white rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer ml-auto print:hidden"
                >
                  <span>
                    {lang === 'ar'
                      ? 'عرض التفاصيل والمسارات المهنية'
                      : lang === 'fr'
                      ? 'Détails de la filière & Carrières'
                      : 'View Major Details'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Extended Details for Print & PDF Archive */}
              <div className="navistudo-print-only pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-700">
                {rec.typical_careers && rec.typical_careers.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-800">
                      {lang === 'ar' ? 'المهن والوظائف المستهدفة:' : lang === 'fr' ? 'Débouchés professionnels :' : 'Target Careers:'}{' '}
                    </span>
                    <span className="text-slate-600">{rec.typical_careers.slice(0, 4).join(' • ')}</span>
                  </div>
                )}
                {rec.institution_types && rec.institution_types.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-800">
                      {lang === 'ar' ? 'المؤسسات والجامعات:' : lang === 'fr' ? 'Établissements :' : 'Institutions:'}{' '}
                    </span>
                    <span className="text-slate-600">{rec.institution_types.join(', ')}</span>
                    {rec.min_indicative_average && (
                      <span className="ml-2 font-bold text-emerald-800">
                        ({lang === 'ar' ? `المعدل الأدنى الاسترشادي: ${rec.min_indicative_average}/20` : lang === 'fr' ? `Moyenne indicative : ${rec.min_indicative_average}/20` : `Indicative average: ${rec.min_indicative_average}/20`})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Bottom Banner for PDF Print / Download */}
      <div className="bg-gradient-to-r from-[#0F3D37] to-[#1F7A6E] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 print:hidden border border-emerald-400/20">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-base font-bold text-[#A7D0B8]">
            <Printer className="w-5 h-5" />
            <span>
              {lang === 'ar'
                ? 'بيان وحفظ التقرير الأكاديمي كملف PDF'
                : lang === 'fr'
                ? 'État d\'impression & Enregistrement du bilan'
                : 'Official Assessment Print & PDF Export'}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-400/20 text-[#A7D0B8] border border-emerald-400/30 font-bold">
              A4 Format
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
            {lang === 'ar'
              ? 'احفظ نتائجك الرسمية كملف PDF يتضمن تفاصيل المقاييس والمعدلات الاسترشادية وشعب البكالوريا لمشاركتها مع أساتذتك أو أوليائك.'
              : lang === 'fr'
              ? 'Consultez l\'état d\'impression officiel conforme A4 ou téléchargez directement votre fiche d\'orientation pour l\'imprimer en PDF sans contrainte.'
              : 'View the official A4 print preview or download your self-contained orientation assessment to print/save as PDF.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={handlePrintPdf}
            className="px-5 py-3 bg-white text-[#0F3D37] hover:bg-[#A7D0B8] rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-102 transform duration-150"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F7A6E]" />
            <span>
              {lang === 'ar'
                ? 'طباعة في PDF (A4)'
                : lang === 'fr'
                ? 'Imprimer en PDF'
                : 'Print to PDF (A4)'}
            </span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-3 bg-emerald-950/40 hover:bg-emerald-950/60 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#A7D0B8]/30 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#A7D0B8]" />
            <span>
              {lang === 'ar'
                ? 'معاينة بيان الطباعة'
                : lang === 'fr'
                ? 'Aperçu de l\'état'
                : 'View Print State'}
            </span>
          </button>

          <button
            onClick={handleDownloadPrintableReport}
            className="px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border border-emerald-400/40 transition-all cursor-pointer shadow-md"
            title={lang === 'ar' ? 'تحميل ملف التقرير الجاهز للطباعة' : lang === 'fr' ? 'Télécharger la fiche prête à imprimer (.html / PDF)' : 'Download ready-to-print assessment file'}
          >
            <Download className="w-4 h-4 text-[#A7D0B8]" />
            <span>
              {lang === 'ar'
                ? 'تحميل الفيشة'
                : lang === 'fr'
                ? 'Télécharger (.html/PDF)'
                : 'Download File'}
            </span>
          </button>
        </div>
      </div>

      {/* Print-Only Official Footer */}
      <div className="navistudo-print-only pt-6 mt-8 border-t-2 border-slate-300 text-center text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>NaviStudo — Plateforme d'Orientation Scolaire & Universitaire</span>
          <span>https://navistudo.edu</span>
        </div>
        <p className="text-[10px] text-slate-500 pt-1">
          {lang === 'ar'
            ? 'وثيقة رسمية استرشادية صادرة عن منصة NaviStudo. تم استخراج هذه التوصيات بناءً على خوارزمية التوافق الأكاديمي ومعايير الدخول الجامعي.'
            : lang === 'fr'
            ? 'Document officiel d\'aide à l\'orientation scolaire et universitaire généré par NaviStudo. Recommandations indicatives destinées à accompagner les choix d\'orientation et la préparation aux inscriptions.'
            : 'Official guidance document generated by NaviStudo. Recommendations based on academic criteria and official admissions weighting.'}
        </p>
      </div>

      {/* Modal: État d'impression & Aperçu Document Officiel (Print State Modal) */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden animate-in fade-in duration-200">
          <div className="bg-slate-100 rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Top Control Bar */}
            <div className="bg-[#0F3D37] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#A7D0B8]" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                    {lang === 'ar'
                      ? 'بيان وحالة الطباعة — التقرير الرسمي للتوجيه الأكاديمي'
                      : lang === 'fr'
                      ? 'État d\'impression — Bilan Officiel d\'Orientation Académique'
                      : 'Official Print Document — Orientation Assessment'}
                  </h3>
                  <p className="text-[11px] text-[#A7D0B8]/80">
                    {lang === 'ar'
                      ? 'معاينة مطابقة بحجم A4 للطباعة المباشرة أو التنزيل'
                      : lang === 'fr'
                      ? 'Format normalisé A4 prêt pour impression navigateur ou export PDF'
                      : 'Conforming A4 layout ready for browser print dialog or download'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={safeTriggerPrint}
                  className="px-3.5 py-1.5 bg-white text-[#0F3D37] hover:bg-[#A7D0B8] rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 transform duration-150"
                  title="Ctrl + P"
                >
                  <Printer className="w-3.5 h-3.5 text-[#1F7A6E]" />
                  <span>
                    {lang === 'ar' ? 'طباعة عبر المتصفح' : lang === 'fr' ? 'Lancer l\'impression' : 'Print Now'}
                  </span>
                </button>

                <button
                  onClick={handleDownloadPrintableReport}
                  className="px-3 py-1.5 bg-[#1F7A6E] hover:bg-[#155A51] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title={lang === 'ar' ? 'تنزيل ملف HTML مستقل وجاهز للطباعة' : lang === 'fr' ? 'Télécharger le fichier imprimable (.html / PDF)' : 'Download printable file'}
                >
                  <Download className="w-3.5 h-3.5 text-[#A7D0B8]" />
                  <span>
                    {lang === 'ar' ? 'تحميل كملف' : lang === 'fr' ? 'Télécharger fiche' : 'Download'}
                  </span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
                  title={lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* In-Modal Guidance / Sandbox diagnostic banner */}
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900 gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'نصيحة: إذا تم حظر مربع حوار الطباعة بسبب أمان الإطار، انقر على «تحميل كملف» لفتحه وطباعته أو اضغط Ctrl+P.'
                    : lang === 'fr'
                    ? 'Note : Si la boîte d\'impression est restreinte par votre navigateur, cliquez sur « Télécharger fiche » pour l\'ouvrir hors-cadre ou utilisez Ctrl+P.'
                    : 'Tip: If the browser print dialog is restricted by the frame sandbox, click "Download" to open it standalone or press Ctrl+P.'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                A4 Portrait
              </span>
            </div>

            {/* Scrollable A4 Document Paper Sheet Preview */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-200/70 flex-1">
              <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-slate-300 p-6 sm:p-10 space-y-6 text-[#0F3D37]">
                {/* Formal Sheet Header */}
                <div className="flex items-center justify-between border-b-2 border-[#0F3D37] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#0F3D37] text-white flex items-center justify-center font-black text-base shadow-sm">
                      NS
                    </div>
                    <div>
                      <div className="text-xl font-black text-[#0F3D37] tracking-tight">NaviStudo</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {lang === 'ar'
                          ? 'المنصة الوطنية للتوجيه المدرسي والأكاديمي'
                          : lang === 'fr'
                          ? 'Plateforme d\'Orientation Scolaire & Universitaire'
                          : 'Academic & University Orientation Platform'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-600 space-y-0.5">
                    <div>
                      <span className="font-bold text-slate-700">
                        {lang === 'ar' ? 'تاريخ التقرير:' : lang === 'fr' ? 'Date du rapport :' : 'Report Date:'}{' '}
                      </span>
                      <span>
                        {new Date().toLocaleDateString(lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ID: NS-REC-{new Date().getFullYear()}-{recommendations.length}
                    </div>
                  </div>
                </div>

                {/* Document Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-[#0F3D37] uppercase tracking-wide">
                    {lang === 'ar'
                      ? 'تقرير التوجيه الأكاديمي والمسارات الجامعية المقترحة'
                      : lang === 'fr'
                      ? 'Bilan Officiel d\'Orientation Académique & Recommandations de Filières'
                      : 'Official Academic Guidance Assessment & Major Recommendations'}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ar'
                      ? `تحليل شامل ومفصل لدرجات المواد والميول الأكاديمية (${recommendations.length} مساراً موصى به).`
                      : lang === 'fr'
                      ? `Synthèse des performances scolaires, méthode de résolution et affinités (${recommendations.length} filières sélectionnées).`
                      : `Synthesis based on academic strengths and profile (${recommendations.length} ranked majors).`}
                  </p>
                </div>

                {/* Student Metadata Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 rounded-lg p-3 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === 'ar' ? 'الطالب / المستفيد' : lang === 'fr' ? 'Élève / Candidat' : 'Student'}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {currentUser?.displayName || currentUser?.email || (lang === 'ar' ? 'طالب مجهول' : lang === 'fr' ? 'Profil Étudiant' : 'Anonymous Student')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === 'ar' ? 'المستوى والشعبة' : lang === 'fr' ? 'Cycle & Série' : 'Academic Stream'}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {getStudentAcademicSummary()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === 'ar' ? 'نظام التقييم' : lang === 'fr' ? 'Évaluation' : 'Evaluation'}
                    </span>
                    <span className="font-semibold text-emerald-800">
                      {isLocalFallback
                        ? (lang === 'fr' ? 'Critères académiques officiels' : 'Authoritative Rules Engine')
                        : (lang === 'fr' ? 'Moteur d\'adéquation complet' : 'Full Alignment Engine')}
                    </span>
                  </div>
                </div>

                {/* Recommended Majors Itemized Sheet */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                    {lang === 'ar' ? 'قائمة الشعب والتخصصات المصنفة:' : lang === 'fr' ? 'Filières recommandées par ordre d\'affinité :' : 'Ranked Major Recommendations:'}
                  </div>

                  {recommendations.map((rec, idx) => {
                    const matchLabel = rec.match_level === 'strong_match'
                      ? (lang === 'ar' ? 'توافق قوي ومباشر' : lang === 'fr' ? 'Forte Adéquation' : 'Strong Match')
                      : rec.match_level === 'great_alternative'
                      ? (lang === 'ar' ? 'بديل أكاديمي ممتاز' : lang === 'fr' ? 'Alternative Conseillée' : 'Great Alternative')
                      : (lang === 'ar' ? 'مجال واعد للاستكشاف' : lang === 'fr' ? 'Filière à Explorer' : 'Field to Explore');

                    return (
                      <div key={rec.major_id} className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span className="font-black text-[#0F3D37]">#{idx + 1}</span>
                              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {matchLabel}
                              </span>
                              <span className="capitalize">{rec.category}</span>
                              <span>·</span>
                              <span>{rec.study_duration_years} {lang === 'fr' ? 'ans' : lang === 'ar' ? 'سنوات' : 'years'}</span>
                            </div>

                            <h4 className="font-bold text-[#0F3D37] text-sm">
                              {getMajorTitle(rec)}
                            </h4>

                            <p className="text-slate-600 leading-relaxed text-xs">
                              {getMajorExplanation(rec)}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xl font-black text-[#1F7A6E] block">
                              {rec.match_score}%
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400">
                              {lang === 'ar' ? 'نسبة التطابق' : lang === 'fr' ? 'Affinité' : 'Score'}
                            </span>
                          </div>
                        </div>

                        {/* Subjects & Careers */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="font-bold text-slate-700">
                            {lang === 'ar' ? 'المواد الأساسية:' : lang === 'fr' ? 'Matières clés :' : 'Key Subjects:'}
                          </span>
                          {rec.key_subjects.slice(0, 4).map(s => (
                            <span key={s} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[10px]">
                              {s.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>

                        {rec.typical_careers && rec.typical_careers.length > 0 && (
                          <div className="text-[11px] text-slate-600">
                            <span className="font-bold text-slate-700">
                              {lang === 'ar' ? 'المهن المستهدفة:' : lang === 'fr' ? 'Débouchés :' : 'Careers:'}{' '}
                            </span>
                            <span>{rec.typical_careers.slice(0, 3).join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Institutional Stamp & Signature Area */}
                <div className="grid grid-cols-2 gap-4 border border-dashed border-slate-300 rounded-lg p-3 text-xs text-slate-600">
                  <div className="space-y-8">
                    <span className="font-bold text-slate-700 block">
                      {lang === 'ar' ? 'تأشيرة مستشار التوجيه المدرسي:' : lang === 'fr' ? 'Visa du Conseiller d\'Orientation :' : 'Counselor Visa:'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'ar' ? 'التوقيع: .......................................' : lang === 'fr' ? 'Signature : .......................................' : 'Signature: .......................................'}
                    </span>
                  </div>
                  <div className="space-y-8 text-right">
                    <span className="font-bold text-slate-700 block">
                      {lang === 'ar' ? 'ختم المؤسسة التربوية:' : lang === 'fr' ? 'Cachet de l\'Établissement :' : 'Institution Stamp:'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Date: .......................................
                    </span>
                  </div>
                </div>

                {/* Document Footer */}
                <div className="border-t pt-3 text-center text-[10px] text-slate-400 space-y-0.5">
                  <div>NaviStudo — Plateforme d'Orientation Scolaire & Universitaire</div>
                  <div>
                    {lang === 'ar'
                      ? 'وثيقة رسمية استرشادية صادرة عن منصة NaviStudo.'
                      : lang === 'fr'
                      ? 'Document d\'aide à l\'orientation scolaire et universitaire généré par NaviStudo.'
                      : 'Guidance document generated by NaviStudo.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {lang === 'ar'
                  ? `يتضمن التقرير ${recommendations.length} تخصصاً مصنفاً`
                  : lang === 'fr'
                  ? `${recommendations.length} filières récapitulées dans cet état d'impression`
                  : `${recommendations.length} majors included in this assessment`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={safeTriggerPrint}
                  className="px-4 py-2 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>
                    {lang === 'ar' ? 'طباعة / حفظ PDF' : lang === 'fr' ? 'Imprimer / Sauvegarder PDF' : 'Print / Save PDF'}
                  </span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
