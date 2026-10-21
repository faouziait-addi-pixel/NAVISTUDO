import React, { useState, useEffect } from 'react';
import {
  signInAsGuest,
  loginWithEmail,
  registerWithEmail,
  linkAnonymousWithEmail,
  loginWithGoogle,
  logoutUser,
  AppUser
} from '../../services/auth';
import { Language } from '../../types/contract';
import {
  X,
  UserCheck,
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  LogOut,
  Shield,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onUserChange?: (user: AppUser | null) => void;
  onLogout?: () => void;
  lang: Language;
  initialTab?: 'anonymous' | 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onLogout,
  lang,
  initialTab = 'anonymous'
}) => {
  const [tab, setTab] = useState<'anonymous' | 'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentUser?.isAnonymous) {
        setTab('register'); // Encourage converting or show register/sign in
      } else {
        setTab(initialTab);
      }
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialTab, currentUser]);

  if (!isOpen) return null;

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInAsGuest();
      if (onUserChange) onUserChange(user);
      onClose();
    } catch (err: any) {
      console.warn('[NaviStudo Auth]', err?.message || err);
      setError(
        err?.message ||
        (lang === 'fr' ? 'Échec de la connexion anonyme.' : 'Anonymous sign-in failed.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(
        lang === 'fr'
          ? 'Veuillez saisir votre adresse email et mot de passe.'
          : lang === 'ar'
          ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.'
          : 'Please enter email and password.'
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithEmail(email, password);
      if (onUserChange) onUserChange(user);
      setSuccessMsg(
        lang === 'fr'
          ? `Ravi de vous revoir, ${user.displayName || user.email} !`
          : lang === 'ar'
          ? `أهلاً بعودتك، ${user.displayName || user.email}!`
          : `Welcome back, ${user.displayName || user.email}!`
      );
      setTimeout(() => {
        onClose();
      }, 1100);
    } catch (err: any) {
      console.warn('[NaviStudo Auth]', err?.message || err);
      let msg = err?.message || 'Error';
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') {
        msg =
          lang === 'fr'
            ? 'Identifiants invalides ou mot de passe incorrect.'
            : lang === 'ar'
            ? 'بيانات الاعتماد غير صالحة أو كلمة المرور خاطئة.'
            : 'Invalid email or password.';
      } else if (err?.code === 'auth/user-not-found') {
        msg =
          lang === 'fr'
            ? 'Aucun compte trouvé avec cet email. Vous pouvez en créer un.'
            : lang === 'ar'
            ? 'لم يتم العثور على حساب بهذا البريد. يمكنك إنشاء حساب جديد.'
            : 'No account found with this email.';
      } else if (err?.code === 'auth/invalid-email') {
        msg =
          lang === 'fr'
            ? 'Format d\'adresse email invalide.'
            : lang === 'ar'
            ? 'صيغة البريد الإلكتروني غير صالحة.'
            : 'Invalid email format.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(
        lang === 'fr'
          ? 'Veuillez renseigner votre email et mot de passe.'
          : lang === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة.'
          : 'Please fill all required fields.'
      );
      return;
    }
    if (password.length < 6) {
      setError(
        lang === 'fr'
          ? 'Le mot de passe doit comporter au moins 6 caractères.'
          : lang === 'ar'
          ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'
          : 'Password must have at least 6 characters.'
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let user: AppUser;
      if (currentUser?.isAnonymous) {
        // Upgrade current anonymous session so answers & bookmarks are preserved!
        user = await linkAnonymousWithEmail(email, password, displayName);
        setSuccessMsg(
          lang === 'fr'
            ? 'Compte créé et session anonyme convertie avec succès ! Vos réponses sont préservées.'
            : lang === 'ar'
            ? 'تم إنشاء الحساب وترقية الجلسة بنجاح مع الحفاظ على إجاباتك.'
            : 'Account registered! Your existing session data was preserved.'
        );
      } else {
        user = await registerWithEmail(email, password, displayName);
        setSuccessMsg(
          lang === 'fr'
            ? 'Compte créé avec succès ! Bienvenue sur NaviStudo.'
            : lang === 'ar'
            ? 'تم إنشاء الحساب بنجاح! مرحباً بك في نافي ستودو.'
            : 'Account created successfully! Welcome to NaviStudo.'
        );
      }

      if (onUserChange) onUserChange(user);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.warn('[NaviStudo Auth]', err?.message || err);
      let msg = err?.message || 'Registration error';
      if (err?.code === 'auth/email-already-in-use') {
        msg =
          lang === 'fr'
            ? 'Cette adresse email est déjà utilisée. Basculez sur l\'onglet Connexion.'
            : lang === 'ar'
            ? 'هذا البريد الإلكتروني مسجل بالفعل. انتقل إلى تبويب تسجيل الدخول.'
            : 'Email is already registered. Please sign in instead.';
      } else if (err?.code === 'auth/weak-password') {
        msg =
          lang === 'fr'
            ? 'Le mot de passe est trop faible. Utilisez au moins 6 caractères.'
            : lang === 'ar'
            ? 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.'
            : 'Password is too weak.';
      } else if (err?.code === 'auth/credential-already-in-use') {
        msg =
          lang === 'fr'
            ? 'Ce compte email existe déjà. Veuillez vous connecter.'
            : lang === 'ar'
            ? 'هذا الحساب موجود بالفعل. يرجى تسجيل الدخول.'
            : 'Account already exists. Please log in.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      if (onUserChange) onUserChange(user);
      setSuccessMsg(
        lang === 'fr'
          ? `Connecté avec Google : ${user.displayName || user.email}`
          : lang === 'ar'
          ? `تم تسجيل الدخول بواسطة Google: ${user.displayName || user.email}`
          : `Signed in with Google: ${user.displayName || user.email}`
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.warn('[NaviStudo Auth]', err?.message || err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setError(lang === 'fr' ? 'Connexion Google annulée.' : 'Google sign-in popup was closed.');
      } else {
        setError(err?.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (onLogout) {
        onLogout();
      } else {
        await logoutUser();
        if (onUserChange) onUserChange(null);
      }
      setSuccessMsg(
        lang === 'fr'
          ? 'Déconnexion effectuée. Les réponses et données du questionnaire ont été effacées.'
          : lang === 'ar'
          ? 'تم تسجيل الخروج بنجاح وتم مسح بيانات الاستبيان.'
          : 'Signed out successfully. Questionnaire responses and session data have been reset.'
      );
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F3D37] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1F7A6E] flex items-center justify-center text-white">
              <Shield className="w-4 h-4 text-[#A7D0B8]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'fr'
                  ? 'Authentification NaviStudo'
                  : lang === 'ar'
                  ? 'تسجيل الدخول إلى نافي ستودو'
                  : 'NaviStudo Authentication'}
              </h3>
              <p className="text-xs text-teal-100/80">
                {lang === 'fr'
                  ? 'Connexion, Inscription ou Accès Invité'
                  : lang === 'ar'
                  ? 'تسجيل الدخول، إنشاء حساب أو وصول كضيف'
                  : 'Sign in, Sign up, or Guest access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Card if already signed in */}
        {currentUser && (
          <div className="p-4 bg-emerald-50/90 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1F7A6E] text-white flex items-center justify-center font-bold text-sm">
                {currentUser.isAnonymous ? '?' : (currentUser.displayName?.[0] || currentUser.email?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#0F3D37]">
                    {currentUser.isAnonymous
                      ? (lang === 'fr' ? 'Accès Anonyme (Invité)' : lang === 'ar' ? 'ضيف مجهول' : 'Anonymous Guest')
                      : (currentUser.displayName || currentUser.email)}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    currentUser.isAnonymous ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentUser.isAnonymous
                      ? (lang === 'fr' ? 'Invité' : 'Guest')
                      : (lang === 'fr' ? 'Compte vérifié' : 'Verified')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                  UID: {currentUser.uid.slice(0, 12)}...
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Déconnexion' : lang === 'ar' ? 'خروج' : 'Sign Out'}</span>
            </button>
          </div>
        )}

        {/* Success or Error banners */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 3 Main Auth Modes: Anonyme, Connexion (Sign In), Créer compte (Sign Up) */}
        <div className="grid grid-cols-3 p-1.5 m-4 mb-2 bg-slate-100 rounded-xl text-xs font-bold text-[#4B5563]">
          <button
            type="button"
            onClick={() => { setTab('anonymous'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'anonymous'
                ? 'bg-white text-[#0F3D37] shadow-xs'
                : 'hover:text-[#0F3D37]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#1F7A6E]" />
            <span>{lang === 'fr' ? 'Accès Anonyme' : lang === 'ar' ? 'وصول مجهول' : 'Anonymous'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-white text-[#0F3D37] shadow-xs'
                : 'hover:text-[#0F3D37]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#1F7A6E]" />
            <span>{lang === 'fr' ? 'Connexion' : lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white text-[#0F3D37] shadow-xs'
                : 'hover:text-[#0F3D37]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1F7A6E]" />
            <span>{lang === 'fr' ? 'Créer compte' : lang === 'ar' ? 'حساب جديد' : 'Sign Up'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 pt-3 space-y-4">
          {/* TAB 1: ACCÈS ANONYME (GUEST) */}
          {tab === 'anonymous' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl space-y-2 text-xs text-[#0F3D37]">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#0F3D37]">
                  <Sparkles className="w-4 h-4 text-[#1F7A6E]" />
                  <span>
                    {lang === 'fr'
                      ? 'Accès immédiat sans mot de passe'
                      : lang === 'ar'
                      ? 'دخول فوري بدون كلمة مرور'
                      : 'Instant 1-Click Access Without Password'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {lang === 'fr'
                    ? 'L\'authentification anonyme Firebase génère instantanément une session sécurisée. Vous pouvez répondre au questionnaire d\'orientation, obtenir vos recommandations et sauvegarder vos filières favorites sans saisir d\'email.'
                    : lang === 'ar'
                    ? 'يمنحك الوصول المجهول معرفاً آمناً مؤقتاً لحفظ إجابات الاستبيان واستعراض التوصيات دون الحاجة لإدخال بريد إلكتروني أو كلمة مرور.'
                    : 'Anonymous authentication generates an instant secure session. Complete the questionnaire and save favorites without an email.'}
                </p>
                <div className="pt-1 text-[11px] text-[#1F7A6E] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'fr'
                      ? 'Possibilité de convertir en compte définitif plus tard.'
                      : lang === 'ar'
                      ? 'يمكنك ترقية حسابك إلى حساب دائم في أي وقت لاحق.'
                      : 'You can convert to a permanent account at any time.'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAnonymousSignIn}
                disabled={loading}
                className="w-full py-3 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>
                      {lang === 'fr'
                        ? 'Continuer en Accès Anonyme (1 clic)'
                        : lang === 'ar'
                        ? 'المتابعة كضيف مجهول (بنقرة واحدة)'
                        : 'Continue as Anonymous Guest'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-[#1F7A6E] hover:underline cursor-pointer font-semibold"
                >
                  {lang === 'fr'
                    ? 'Vous avez déjà un compte ? Se connecter'
                    : lang === 'ar'
                    ? 'لديك حساب بالفعل؟ تسجيل الدخول'
                    : 'Already have an account? Sign In'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONNEXION (SIGN IN) */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                  {lang === 'fr' ? 'Adresse email' : lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="etudiant@domaine.dz"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F7A6E] bg-white text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                  {lang === 'fr' ? 'Mot de passe' : lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F7A6E] bg-white text-slate-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0F3D37] hover:bg-[#1F7A6E] text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{lang === 'fr' ? 'Se connecter (Sign In)' : lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                )}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 text-[10px]">
                    {lang === 'fr' ? 'Ou continuer avec' : 'Or continue with'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{lang === 'fr' ? 'Connexion avec Google' : lang === 'ar' ? 'تسجيل الدخول عبر Google' : 'Sign in with Google'}</span>
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-[#1F7A6E] hover:underline cursor-pointer font-semibold"
                >
                  {lang === 'fr' ? 'Pas encore de compte ? S\'inscrire' : 'Need an account? Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('anonymous')}
                  className="text-slate-500 hover:text-slate-700 cursor-pointer text-[11px]"
                >
                  {lang === 'fr' ? 'Accès invité sans mot de passe' : 'Guest access'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CRÉER UN COMPTE (SIGN UP) */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {currentUser?.isAnonymous && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'fr'
                      ? 'Vous êtes actuellement en session Invité. En créant ce compte, toutes vos réponses et favoris seront automatiquement synchronisés !'
                      : lang === 'ar'
                      ? 'أنت حالياً في جلسة ضيف. بإنشاء حسابك الآن، سيتم ربط وحفظ جميع نتائجك واستبياناتك تلقائياً!'
                      : 'You are currently a guest. Creating an account will link and preserve all your session data!'}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                  {lang === 'fr' ? 'Nom ou Prénom de l\'élève' : lang === 'ar' ? 'اسم التلميذ أو اللقب' : 'Student Name or Nickname'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="ex. Amina K."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F7A6E] bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                  {lang === 'fr' ? 'Adresse email' : lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="etudiant@domaine.dz"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F7A6E] bg-white text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F3D37] mb-1">
                  {lang === 'fr' ? 'Mot de passe (min. 6 caractères)' : lang === 'ar' ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password (min. 6 chars)'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F7A6E] bg-white text-slate-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#1F7A6E] hover:bg-[#0F3D37] text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>
                    {currentUser?.isAnonymous
                      ? (lang === 'fr' ? 'Enregistrer mon compte permanent (Sign Up)' : 'Register Permanent Account')
                      : (lang === 'fr' ? 'Créer mon compte (Sign Up)' : lang === 'ar' ? 'إنشاء حساب جديد' : 'Sign Up')}
                  </span>
                )}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 text-[10px]">
                    {lang === 'fr' ? 'Ou inscription rapide avec' : 'Or quick sign up with'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{lang === 'fr' ? 'S\'inscrire avec Google' : lang === 'ar' ? 'التسجيل عبر Google' : 'Sign up with Google'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-[#1F7A6E] hover:underline cursor-pointer font-semibold"
                >
                  {lang === 'fr' ? 'Déjà un compte ? Se connecter' : 'Already have an account? Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
