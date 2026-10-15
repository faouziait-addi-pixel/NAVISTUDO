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
import { AuthModal } from './components/auth/AuthModal';
import {
  QuestionnaireFormState,
  INITIAL_FORM_STATE,
  buildRecommendationPayload
} from './services/payloadBuilder';
import {
  MajorRecommendation,
  RecommendationResponseEnvelope,
  Language
} from './types/contract';
import { findMajorById } from './data/majorsDatabase';
import {
  AppUser,
  subscribeToAuth,
  saveSubmissionToFirestore,
  bookmarkMajorInFirestore,
  unbookmarkMajorInFirestore,
  fetchUserBookmarks,
  logoutUser
} from './services/auth';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('navistudo_lang');
      return (saved === 'ar' || saved === 'fr' || saved === 'en') ? saved : 'fr';
    } catch {
      return 'fr';
    }
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'anonymous' | 'login' | 'register'>('anonymous');
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

  const handleOpenAuth = (tab?: 'anonymous' | 'login' | 'register') => {
    setAuthModalTab(tab || 'login');
    setIsAuthModalOpen(true);
  };

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

  /**
   * Complete clean logout: clears user credentials, wipes questionnaire answers,
   * resets calculated recommendations and bookmarks, removes local storage keys,
   * and navigates cleanly to the welcome page (Page d'Accueil).
   */
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Firebase logout warning:', err);
    }

    setCurrentUser(null);
    setFormState(INITIAL_FORM_STATE);
    setRecommendations([]);
    setBookmarkedMajorIds(['major_computer_science_ai']);

    try {
      localStorage.removeItem('navistudo_form_state');
      localStorage.removeItem('navistudo_recommendations');
      localStorage.removeItem('navistudo_bookmarks');
    } catch (e) {
      console.warn('Could not clear localStorage on logout', e);
    }

    setCurrentScreen('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setLogoutNotice(
      lang === 'ar'
        ? 'تم تسجيل الخروج بنجاح. تم مسح جميع إجابات الاستبيان والتوصيات لحماية خصوصيتك.'
        : lang === 'fr'
        ? 'Déconnexion effectuée avec succès. Vos réponses au questionnaire ont été effacées pour protéger votre vie privée.'
        : 'Signed out successfully. Your questionnaire answers and recommendations have been cleared.'
    );

    setTimeout(() => {
      setLogoutNotice(null);
    }, 6000);
  };

  /**
   * Reset questionnaire data intentionally
   */
  const handleResetQuestionnaire = () => {
    setFormState(INITIAL_FORM_STATE);
    setRecommendations([]);
    try {
      localStorage.removeItem('navistudo_form_state');
      localStorage.removeItem('navistudo_recommendations');
    } catch (e) {
      console.warn('Could not clear localStorage on reset', e);
    }
    setCurrentScreen('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    let hadUser = false;
    const unsubscribe = subscribeToAuth((user) => {
      if (!user && hadUser) {
        // Auth state flipped from logged in to logged out!
        setFormState(INITIAL_FORM_STATE);
        setRecommendations([]);
        setBookmarkedMajorIds(['major_computer_science_ai']);
        try {
          localStorage.removeItem('navistudo_form_state');
          localStorage.removeItem('navistudo_recommendations');
          localStorage.removeItem('navistudo_bookmarks');
        } catch (e) {}
        setCurrentScreen('welcome');
      }
      hadUser = Boolean(user);
      setCurrentUser(user);

      if (user) {
        // Sync bookmarks from Firestore
        fetchUserBookmarks(user.uid).then((bks) => {
          if (bks.length > 0) {
            setBookmarkedMajorIds(prev => Array.from(new Set([...prev, ...bks])));
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Save language to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('navistudo_lang', lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  }, [lang]);

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
    setBookmarkedMajorIds(prev => {
      const exists = prev.includes(majorId);
      const next = exists ? prev.filter(id => id !== majorId) : [...prev, majorId];

      // Synchronize with Firestore if user is logged in
      if (currentUser) {
        if (exists) {
          unbookmarkMajorInFirestore(currentUser.uid, majorId).catch(console.warn);
        } else {
          bookmarkMajorInFirestore(currentUser.uid, majorId).catch(console.warn);
        }
      }

      return next;
    });
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

    // Build payload and save to Firestore if user logged in
    const payload = buildRecommendationPayload(formState);
    if (currentUser) {
      saveSubmissionToFirestore(
        currentUser.uid,
        formState.stageId,
        formState.stageId === 'third_year_secondary' ? formState.branchId : formState.studyGroupId,
        payload
      ).catch(console.warn);
    }

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
        onSelectLang={(newLang) => setLang(newLang)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenAuth={(tab) => handleOpenAuth(tab)}
        onLogout={handleLogout}
        currentUser={currentUser}
        hasResults={recommendations.length > 0}
        savedMajorsCount={bookmarkedMajorIds.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-4">
        {/* Post-Logout Privacy Notice Banner */}
        {logoutNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">{logoutNotice}</p>
            </div>
            <button
              onClick={() => setLogoutNotice(null)}
              className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {currentScreen === 'welcome' && (
          <WelcomeView
            onStartQuestionnaire={handleStartQuestionnaire}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
            currentUser={currentUser}
            onOpenAuth={(tab) => handleOpenAuth(tab)}
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
            currentUser={currentUser}
            onOpenAuth={(tab) => handleOpenAuth(tab)}
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
            onResetState={handleResetQuestionnaire}
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
            currentUser={currentUser}
            onOpenAuth={(tab) => handleOpenAuth(tab)}
            onLogout={handleLogout}
            onResetData={handleResetQuestionnaire}
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

      {/* Auth Modal (Login / Register / Anonymous Access) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={(usr) => {
          if (!usr) {
            handleLogout();
          } else {
            setCurrentUser(usr);
          }
        }}
        onLogout={handleLogout}
        lang={lang}
        initialTab={authModalTab}
      />

      {/* Developer Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        contextData={{
          stage_id: formState.stageId,
          branch_id: formState.stageId === 'third_year_secondary' ? formState.branchId : formState.studyGroupId
        }}
        lang={lang}
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
