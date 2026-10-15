import React, { useState } from 'react';
import { MAJORS_DATABASE } from '../../data/majorsDatabase';
import { Language } from '../../types/contract';
import {
  Search,
  BookOpen,
  ChevronRight,
  Bookmark,
  Clock
} from 'lucide-react';

interface ExploreMajorsViewProps {
  onSelectMajor: (majorId: string) => void;
  bookmarkedMajorIds: string[];
  onToggleBookmark: (majorId: string) => void;
  lang: Language;
}

export const ExploreMajorsView: React.FC<ExploreMajorsViewProps> = ({
  onSelectMajor,
  bookmarkedMajorIds,
  onToggleBookmark,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');

  const branches = [
    { id: 'all', en: 'All Branches', ar: 'جميع الشعب', fr: 'Toutes les filières' },
    { id: 'experimental_sciences', en: 'Experimental Sciences', ar: 'علوم تجريبية', fr: 'Sciences Expérimentales' },
    { id: 'mathematics', en: 'Mathematics', ar: 'رياضيات', fr: 'Mathématiques' },
    { id: 'mathematical_technique', en: 'Technical Math', ar: 'تقني رياضي', fr: 'Technique Mathématique' },
    { id: 'management_and_economics', en: 'Management & Economics', ar: 'تسيير واقتصاد', fr: 'Gestion & Économie' },
    { id: 'foreign_languages', en: 'Foreign Languages', ar: 'لغات أجنبية', fr: 'Langues Étrangères' },
    { id: 'literature_and_philosophy', en: 'Literature & Philosophy', ar: 'آداب وفلسفة', fr: 'Lettres & Philosophie' }
  ];

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

  const filtered = MAJORS_DATABASE.filter(m => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      m.title_en.toLowerCase().includes(query) ||
      (m.title_fr && m.title_fr.toLowerCase().includes(query)) ||
      m.title_ar.includes(searchQuery) ||
      m.category.toLowerCase().includes(query) ||
      m.typical_careers.some(c => c.toLowerCase().includes(query));

    const matchesBranch =
      selectedBranchFilter === 'all' ||
      m.prerequisite_branches.includes(selectedBranchFilter);

    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-[#0F3D37] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#1F7A6E]/30 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#A7D0B8] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>
            {lang === 'ar'
              ? 'الدليل الوطني للتخصصات الجامعية والمدارس العليا'
              : lang === 'fr'
              ? 'Répertoire National des Filières Universitaires & Grandes Écoles'
              : 'National Higher Education & University Majors Directory'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'ar'
            ? 'استكشف التخصصات ومسارات المستقبل'
            : lang === 'fr'
            ? 'Explorez les spécialités et perspectives professionnelles'
            : 'Explore Academic Fields & Career Pathways'}
        </h1>
        <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
          {lang === 'ar'
            ? 'تصفح كافة التخصصات المتاحة لحاملي شهادة البكالوريا والتعليم الثانوي، مع الشروط الاسترشادية ومواد التخصص وسوق العمل.'
            : lang === 'fr'
            ? 'Consultez les filières ouvertes aux bacheliers, les conditions d\'accès, les matières enseignées et les débouchés réels.'
            : 'Browse higher education programs, faculties, polytechnics, and normal schools, with curriculum insights and prerequisite branches.'}
        </p>
      </div>

      {/* Search & Branch Filters */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'ابحث بالاسم، الكلمات المفتاحية، أو المهن...'
                : lang === 'fr'
                ? 'Rechercher par intitulé, mot-clé ou profession visée...'
                : 'Search by major title, keyword, or career roles...'
            }
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#0F3D37] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1F7A6E]"
          />
        </div>

        {/* Branch Filter Buttons */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {lang === 'ar' ? 'تصفية حسب الشعبة المؤهلة:' : lang === 'fr' ? 'Filtrer selon votre filière du Bac :' : 'Filter by eligible high school branch:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {branches.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBranchFilter(b.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedBranchFilter === b.id
                    ? 'bg-[#1F7A6E] text-white shadow-xs'
                    : 'bg-[#F7F6F2] text-[#4B5563] hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? b.ar : lang === 'fr' ? b.fr : b.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Majors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(major => {
          const isSaved = bookmarkedMajorIds.includes(major.major_id);
          return (
            <div
              key={major.major_id}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-[#1F7A6E] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#4B5563]">
                  <span className="capitalize font-semibold text-[#1F7A6E]">
                    {major.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {major.study_duration_years} {lang === 'fr' ? 'ans' : lang === 'ar' ? 'سنوات' : 'Yrs'}
                    </span>
                    <button
                      onClick={() => onToggleBookmark(major.major_id)}
                      className={`p-1.5 rounded-md border transition-colors ${
                        isSaved ? 'bg-[#1F7A6E] text-white border-[#1F7A6E]' : 'bg-[#F7F6F2] text-slate-400 hover:text-[#0F3D37]'
                      }`}
                      title={isSaved ? 'Retirer' : 'Enregistrer'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#0F3D37]">
                  {getMajorTitle(major)}
                </h3>

                <p className="text-xs text-[#4B5563] line-clamp-3 leading-relaxed">
                  {getMajorDesc(major)}
                </p>

                <div className="pt-1 flex flex-wrap gap-1.5">
                  {major.prerequisite_branches.slice(0, 3).map(b => (
                    <span key={b} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {b.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {major.typical_careers.length} {lang === 'fr' ? 'débouchés professionnels' : lang === 'ar' ? 'مسارات مهنية' : 'Career Paths'}
                </span>

                <button
                  onClick={() => onSelectMajor(major.major_id)}
                  className="px-4 py-2 bg-[#F7F6F2] hover:bg-[#1F7A6E] text-[#0F3D37] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'ar' ? 'عرض التفاصيل' : lang === 'fr' ? 'Consulter la fiche' : 'View Details'}</span>
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
