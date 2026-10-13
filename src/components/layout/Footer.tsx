import React from 'react';
import { CompassLogo } from '../common/CompassLogo';
import { ShieldCheck, Info, Compass } from 'lucide-react';
import { ScreenType } from './Navbar';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  lang: 'en' | 'ar';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang }) => {
  return (
    <footer className="bg-[#0F3D37] text-white/80 border-t border-[#1F7A6E]/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <CompassLogo size={32} lightText={true} />
            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              {lang === 'ar'
                ? 'منصة توجيه أكاديمي ومدرسي متخصصة في مساعدة طلاب المرحلة الثانوية على اكتشاف الشعب الدراسية والتخصصات الجامعية التي تناسب مؤهلاتهم وطموحاتهم.'
                : 'A dedicated academic orientation platform empowering secondary-school students to discover educational pathways, high school streams, and university majors aligned with their true strengths and aspirations.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A7D0B8] pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'ar'
                  ? 'خصوصية كاملة: بياناتك الدراسية تُعالج بأمان لأغراض التوجيه فقط.'
                  : 'Full privacy: Academic profile data processed safely for orientation guidance.'}
              </span>
            </div>
          </div>

          {/* Navigation Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A7D0B8] mb-3">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  {lang === 'ar' ? 'لوحة التحكم الرئيسية' : 'Student Dashboard'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('questionnaire')}
                  className="hover:text-white transition-colors text-left"
                >
                  {lang === 'ar' ? 'استبيان التوجيه المدرسي' : 'Orientation Questionnaire'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors text-left"
                >
                  {lang === 'ar' ? 'دليل الشعب والتخصصات' : 'Explore Academic Majors'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="hover:text-white transition-colors text-left"
                >
                  {lang === 'ar' ? 'استعراض التوصيات' : 'Orientation Results'}
                </button>
              </li>
            </ul>
          </div>

          {/* Academic disclaimer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A7D0B8] mb-3">
              {lang === 'ar' ? 'تنويه أكاديمي' : 'Academic Advisory'}
            </h3>
            <div className="flex items-start gap-2 text-xs text-white/60 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#A7D0B8]" />
              <p>
                {lang === 'ar'
                  ? 'التوصيات المقدمة هي أدوات استرشادية واستكشافية ولا تشكل قبولاً مضموناً أو شروطاً رسمية لوزارة التعليم العالي.'
                  : 'Recommendations are educational decision-support tools and do not constitute guaranteed admission, official quotas, or binding eligibility.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#A7D0B8]" />
            <span>NaviStudo &copy; {new Date().getFullYear()} — Built for Student Success</span>
          </div>
          <div className="flex items-center gap-4">
            <span>MVP v1.0 Spec-Compliant</span>
            <span>·</span>
            <span>All 4 Routes Implemented</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
