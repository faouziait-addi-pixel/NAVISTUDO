import React, { useState } from 'react';
import { submitFeedback } from '../../services/api';
import { Language } from '../../types/contract';
import { X, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData?: {
    stage_id?: string;
    branch_id?: string;
    current_step?: number;
  };
  lang?: Language;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  contextData,
  lang = 'en'
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى إدخال ملاحظاتك قبل الإرسال.'
          : lang === 'fr'
          ? 'Veuillez saisir votre message avant de soumettre.'
          : 'Please enter your feedback before submitting.'
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await submitFeedback({
        feedback: feedbackText.trim(),
        context: {
          ...contextData,
          user_agent: navigator.userAgent
        },
        timestamp: new Date().toISOString()
      });

      if (response.status === 'success') {
        setSuccessResponse(
          response.message ||
          (lang === 'ar'
            ? 'شكراً لك! تم إرسال ملاحظاتك بنجاح.'
            : lang === 'fr'
            ? 'Merci ! Vos remarques ont été transmises avec succès.'
            : 'Thank you! Your feedback has been transmitted.')
        );
        setFeedbackText('');
      } else {
        setErrorMessage(response.message || 'Submission failed. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send feedback.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessResponse(null);
    setErrorMessage(null);
    setFeedbackText('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#A7D0B8]/40">
        {/* Header */}
        <div className="bg-[#0F3D37] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#A7D0B8]" />
            <h2 id="feedback-modal-title" className="font-semibold text-lg">
              {lang === 'ar' ? 'ملاحظات المنصة والمطور' : lang === 'fr' ? 'Avis Développeur & Amélioration' : 'Developer & Platform Feedback'}
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/70 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {successResponse ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-[#1F7A6E] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D37]">
                {lang === 'ar' ? 'تم استلام الملاحظات بنجاح' : lang === 'fr' ? 'Avis transmis avec succès' : 'Feedback Sent Successfully'}
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed max-w-sm mx-auto">
                {successResponse}
              </p>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 bg-[#1F7A6E] text-white font-medium rounded-lg hover:bg-[#0F3D37] transition-colors"
              >
                {lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#4B5563]">
                {lang === 'ar'
                  ? 'ملاحظاتك تساهم في تحسين دقة مطابقة الشعب والتخصصات. يتم إرسال الملاحظات عبر POST /api/v1/feedback بمعزل تام عن حساب التوصيات.'
                  : lang === 'fr'
                  ? 'Vos retours permettent d\'ajuster les règles d\'orientation et la clarté des intitulés. La requête est transmise via POST /api/v1/feedback et reste strictement isolée des calculs d\'orientation.'
                  : 'Your feedback helps improve NaviStudo curriculum alignment, branch accuracy, and usability. This feedback is sent via POST /api/v1/feedback and remains strictly isolated from recommendation calculations.'}
              </p>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-sm text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label htmlFor="feedback-text" className="block text-sm font-semibold text-[#0F3D37] mb-1.5">
                  {lang === 'ar' ? 'ملاحظاتك أو اقتراحاتك' : lang === 'fr' ? 'Vos remarques ou suggestions' : 'Your comments or suggestions'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-text"
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'شاركنا برأيك حول وضوح الأسئلة، الخيارات الأكاديمية أو أي أخطاء تقنية...'
                      : lang === 'fr'
                      ? 'Partagez vos impressions sur la pertinence des filières, la formulation des questions ou un bug...'
                      : 'Share your thoughts on question clarity, academic options, or technical bugs...'
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F7A6E] focus:border-transparent text-sm text-[#0F3D37] placeholder:text-slate-400"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="text-xs text-[#4B5563] flex items-center gap-1.5">
                <span>{lang === 'fr' ? 'Contexte attaché :' : 'Context attached:'}</span>
                <span className="font-mono bg-slate-100 px-1 rounded">
                  {contextData?.stage_id || 'general'}
                </span>
                {contextData?.branch_id && (
                  <>
                    <span>·</span>
                    <span className="font-mono bg-slate-100 px-1 rounded">{contextData.branch_id}</span>
                  </>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-sm font-medium text-[#4B5563] hover:text-[#0F3D37] rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  {lang === 'ar' ? 'إلغاء' : lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedbackText.trim()}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#1F7A6E] hover:bg-[#0F3D37] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs flex items-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{lang === 'fr' ? 'Envoi...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'إرسال الملاحظات' : lang === 'fr' ? 'Envoyer' : 'Send Feedback'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
