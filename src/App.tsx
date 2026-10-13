import React, { useState, useEffect } from 'react';
import { Navbar, ScreenType } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WelcomeView } from './components/onboarding/WelcomeView';
import { DashboardView } from './components/dashboard/DashboardView';
import { QuestionnaireView } from './components/questionnaire/QuestionnaireView';
import { ResultsView } from './components/results/ResultsView';
import { ExploreMajorsView } from './components/majors/ExploreMajorsView';
import { ProfileView } from './components/profile/ProfileView';
import { MajorDetailModal } from './components/majors/MajorDetailModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { QuestionnaireFormState, INITIAL_FORM_STATE } from './services/payloadBuilder';
import { MajorRecommendation, RecommendationResponseEnvelope } from './types/contract';
import { MAJORS_DATABASE, findMajorById } from './data/majorsDatabase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Form State
  const [formState, setFormState] = useState<QuestionnaireFormState>(() => {
    try {
      const saved = localStorage.getItem('navistudo_form_state');
      return saved ? JSON.parse(saved) : INITIAL_FORM_STATE;
    } catch {
      return INITIAL_FORM_STATE;
    }
  });

  // Recommendations state
  const [recommendations, setRecommendations] = useState<MajorRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem('navistudo_recommendations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLocalFallback, setIsLocalFallback] = useState(false);

  // Bookmarks state
  const [bookmarkedMajorIds, setBookmarkedMajorIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navistudo_bookmarks');
      return saved ? JSON.parse(saved) : ['major_computer_science_ai'];
    } catch {
      return ['major_computer_science_ai'];
    }
  });

  // Selected major for modal
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);

  // Feedback modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Save to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('navistudo_form_state', JSON.stringify(formState));
    } catch (e) {
      console.warn('Could not save form state to localStorage', e);
    }
  }, [formState]);

  useEffect(() => {
    try {
      localStorage.setItem('navistudo_recommendations', JSON.stringify(recommendations));
    } catch (e) {
      console.warn('Could not save recommendations to localStorage', e);
    }
  }, [recommendations]);

  useEffect(() => {
    try {
      localStorage.setItem('navistudo_bookmarks', JSON.stringify(bookmarkedMajorIds));
    } catch (e) {
      console.warn('Could not save bookmarks to localStorage', e);
    }
  }, [bookmarkedMajorIds]);

  const handleToggleBookmark = (majorId: string) => {
    setBookmarkedMajorIds(prev =>
      prev.includes(majorId) ? prev.filter(id => id !== majorId) : [...prev, majorId]
    );
  };

  const handleStartQuestionnaire = (presetStage?: 'first_year_secondary' | 'third_year_secondary') => {
    if (presetStage) {
      setFormState(prev => ({ ...prev, stageId: presetStage }));
    }
    setCurrentScreen('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionnaireSuccess = (data: RecommendationResponseEnvelope, isLocal: boolean) => {
    setRecommendations(data.recommendations);
    setIsLocalFallback(isLocal);
    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Completion percentage
  const calculateCompletion = () => {
    if (recommendations.length > 0) return 100;
    let score = 20; // base stage
    if (Object.keys(formState.subjectScores).length > 0) score += 25;
    if (formState.subjectPreferenceOrder.length > 0) score += 20;
    if (formState.selectedTopicIds.length > 0 || Object.keys(formState.fieldInterestLevels).length > 0) score += 20;
    if (formState.priorityIds.length > 0) score += 15;
    return Math.min(100, score);
  };

  const selectedMajorObj = selectedMajorId ? findMajorById(selectedMajorId) || null : null;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#0F3D37]"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Main Global Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        onToggleLang={() => setLang(prev => prev === 'en' ? 'ar' : 'en')}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        hasResults={recommendations.length > 0}
        savedMajorsCount={bookmarkedMajorIds.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentScreen === 'welcome' && (
          <WelcomeView
            onStartQuestionnaire={handleStartQuestionnaire}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardView
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectMajor={(id) => setSelectedMajorId(id)}
            hasProfile={recommendations.length > 0 || Object.keys(formState.subjectScores).length > 0}
            completionPercentage={calculateCompletion()}
            currentStageId={formState.stageId}
            currentBranchId={formState.branchId}
            recommendations={recommendations}
            bookmarkedMajorIds={bookmarkedMajorIds}
            lang={lang}
          />
        )}

        {currentScreen === 'questionnaire' && (
          <QuestionnaireView
            initialState={formState}
            onSaveState={(updated) => setFormState(updated)}
            onSubmitSuccess={handleQuestionnaireSuccess}
            onCancel={() => {
              setCurrentScreen('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
          />
        )}

        {currentScreen === 'results' && (
          <ResultsView
            recommendations={recommendations}
            isLocalFallback={isLocalFallback}
            bookmarkedMajorIds={bookmarkedMajorIds}
            onToggleBookmark={handleToggleBookmark}
            onSelectMajor={(id) => setSelectedMajorId(id)}
            onRevisitQuestionnaire={() => {
              setCurrentScreen('questionnaire');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
          />
        )}

        {currentScreen === 'explore' && (
          <ExploreMajorsView
            onSelectMajor={(id) => setSelectedMajorId(id)}
            bookmarkedMajorIds={bookmarkedMajorIds}
            onToggleBookmark={handleToggleBookmark}
            lang={lang}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileView
            formState={formState}
            hasCompletedQuestionnaire={recommendations.length > 0}
            bookmarkedMajorIds={bookmarkedMajorIds}
            onToggleBookmark={handleToggleBookmark}
            onSelectMajor={(id) => setSelectedMajorId(id)}
            onEditQuestionnaire={() => {
              setCurrentScreen('questionnaire');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
          />
        )}
      </main>

      {/* Global Major Details Modal */}
      <MajorDetailModal
        major={selectedMajorObj}
        isOpen={Boolean(selectedMajorId)}
        onClose={() => setSelectedMajorId(null)}
        isBookmarked={selectedMajorId ? bookmarkedMajorIds.includes(selectedMajorId) : false}
        onToggleBookmark={handleToggleBookmark}
        onSelectAlternativeMajor={(id) => setSelectedMajorId(id)}
        lang={lang}
      />

      {/* Developer Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        contextData={{
          stage_id: formState.stageId,
          branch_id: formState.stageId === 'third_year_secondary' ? formState.branchId : formState.studyGroupId
        }}
      />

      {/* Main Global Footer */}
      <Footer
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
      />
    </div>
  );
}
