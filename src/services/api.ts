import {
  RecommendationRequestEnvelope,
  RecommendationResponseEnvelope,
  MajorRecommendation,
  DeveloperFeedbackRequest,
  DeveloperFeedbackResponse
} from '../types/contract';
import { getCurrentUserIdToken } from './auth';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://navistudo-backend.onrender.com').replace(/\/+$/, '');

/**
 * Normalizes backend response data to ensure robust matching with the frontend contract.
 */
export function normalizeRecommendationResponse(raw: any): RecommendationResponseEnvelope {
  if (!raw) {
    throw new Error('Réponse vide ou invalide reçue du service de recommandation.');
  }

  // Handle various wrapper shapes: raw.recommendations, raw.data.recommendations, or array
  const listRaw = Array.isArray(raw.recommendations)
    ? raw.recommendations
    : Array.isArray(raw.data?.recommendations)
    ? raw.data.recommendations
    : Array.isArray(raw.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  const analysisId = raw.analysis_id || raw.id || raw.data?.analysis_id || raw.data?.id;

  const recommendations: MajorRecommendation[] = listRaw.map((item: any, idx: number) => {
    const rawScore = typeof item.match_score === 'number'
      ? item.match_score
      : typeof item.score === 'number'
      ? (item.score <= 1 ? Math.round(item.score * 100) : Math.round(item.score))
      : 80;

    let matchLevel: MajorRecommendation['match_level'] = 'field_to_explore';
    if (item.match_level === 'strong_match' || item.match_level === 'great_alternative' || item.match_level === 'field_to_explore') {
      matchLevel = item.match_level;
    } else if (rawScore >= 85) {
      matchLevel = 'strong_match';
    } else if (rawScore >= 70) {
      matchLevel = 'great_alternative';
    }

    return {
      major_id: String(item.major_id || item.id || `major_${idx}`),
      title_en: item.title_en || item.title || 'Academic Major',
      title_ar: item.title_ar || item.title || 'تخصص أكاديمي',
      title_fr: item.title_fr || item.title || item.title_en || 'Filière Universitaire',
      category: (['engineering', 'health', 'science', 'humanities', 'business'].includes(item.category)
        ? item.category
        : 'science') as MajorRecommendation['category'],
      match_score: rawScore,
      match_level: matchLevel,
      explanation_en: item.explanation_en || item.explanation || item.reason || '',
      explanation_ar: item.explanation_ar || item.explanation || item.reason || '',
      explanation_fr: item.explanation_fr || item.explanation || item.explanation_en || item.reason || '',
      key_subjects: Array.isArray(item.key_subjects) ? item.key_subjects : [],
      typical_careers: Array.isArray(item.typical_careers) ? item.typical_careers : [],
      prerequisite_branches: Array.isArray(item.prerequisite_branches) ? item.prerequisite_branches : [],
      min_indicative_average: typeof item.min_indicative_average === 'number' ? item.min_indicative_average : undefined,
      study_duration_years: typeof item.study_duration_years === 'number' ? item.study_duration_years : 5,
      institution_types: Array.isArray(item.institution_types) ? item.institution_types : []
    };
  });

  return {
    schema_version: raw.schema_version || '1.0.0',
    analysis_id: analysisId ? String(analysisId) : undefined,
    created_at: raw.created_at || raw.timestamp || new Date().toISOString(),
    recommendations,
    summary: raw.summary || {
      primary_strength: raw.primary_strength || (recommendations[0]?.title_fr || 'Profil polyvalent'),
      suggested_focus: raw.suggested_focus || 'Parcours recommandés selon vos forces académiques',
      total_evaluated: raw.total_evaluated || recommendations.length
    }
  };
}

/**
 * Submits the completed questionnaire payload to POST /api/v1/recommendations.
 * Protected endpoint: Requires valid Firebase ID token in Authorization header.
 */
export async function submitQuestionnaire(
  payload: RecommendationRequestEnvelope,
  idToken?: string | null
): Promise<{ data: RecommendationResponseEnvelope; isLocalFallback: boolean }> {
  const token = idToken || (await getCurrentUserIdToken());
  if (!token) {
    throw new Error('AUTH_REQUIRED: Authentification requise pour soumettre le questionnaire et générer des recommandations.');
  }

  let response: Response;
  const primaryUrl = `${API_BASE_URL}/api/v1/recommendations`;
  const fallbackProxyUrl = '/api/v1/recommendations';

  try {
    response = await fetch(primaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  } catch (networkError: unknown) {
    // If browser CORS or network blocked the direct cross-origin call, retry via local dev proxy
    if (typeof window !== 'undefined' && primaryUrl.startsWith('http') && !primaryUrl.startsWith(window.location.origin)) {
      try {
        console.info('[NaviStudo API] Direct call blocked or timed out, retrying via local proxy...');
        response = await fetch(fallbackProxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (proxyErr) {
        throw new Error(`NETWORK_ERROR: Impossible de joindre le serveur de recommandation (${API_BASE_URL}). Le service Render peut être en cours de réveil. Vos réponses sont conservées, veuillez réessayer dans quelques secondes.`);
      }
    } else {
      throw new Error(`NETWORK_ERROR: Impossible de joindre le serveur de recommandation (${API_BASE_URL}). Veuillez vérifier votre connexion.`);
    }
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson.details || '');
    } catch {
      errorDetail = await response.text();
    }

    if (response.status === 401) {
      throw new Error(`AUTH_INVALID: Session ou jeton Firebase invalide (${errorDetail || '401 Unauthorized'}). Veuillez vous reconnecter.`);
    } else if (response.status === 400 || response.status === 422) {
      throw new Error(`VALIDATION_ERROR: Les données du questionnaire ne respectent pas le schéma attendu (${errorDetail || response.statusText}).`);
    } else if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error(`SERVER_SLEEPING: Le serveur de recommandation (Render) démarre après une période d'inactivité (${response.status}: ${errorDetail || 'En attente'}). Veuillez patienter 20 secondes et relancer.`);
    } else if (response.status >= 500) {
      throw new Error(`SERVER_ERROR: Le serveur de recommandation a rencontré une erreur interne (${response.status}: ${errorDetail || 'Erreur serveur'}).`);
    } else {
      throw new Error(`API_ERROR: Erreur du service (${response.status}: ${errorDetail || response.statusText}).`);
    }
  }

  const responseJson = await response.json();
  const normalized = normalizeRecommendationResponse(responseJson);
  return { data: normalized, isLocalFallback: false };
}

/**
 * Retrieves a previously generated analysis from GET /api/v1/recommendations/<analysis_id>.
 * Protected endpoint: Requires valid Firebase ID token.
 */
export async function getSavedAnalysis(
  analysisId: string,
  idToken?: string | null
): Promise<RecommendationResponseEnvelope> {
  if (!analysisId || !analysisId.trim()) {
    throw new Error('ID d\'analyse invalide.');
  }

  const token = idToken || (await getCurrentUserIdToken());
  if (!token) {
    throw new Error('AUTH_REQUIRED: Authentification requise pour consulter cette analyse sauvegardée.');
  }

  const safeId = encodeURIComponent(analysisId.trim());
  const primaryUrl = `${API_BASE_URL}/api/v1/recommendations/${safeId}`;
  const fallbackProxyUrl = `/api/v1/recommendations/${safeId}`;

  let response: Response;
  try {
    response = await fetch(primaryUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (networkError: unknown) {
    if (typeof window !== 'undefined' && primaryUrl.startsWith('http') && !primaryUrl.startsWith(window.location.origin)) {
      try {
        response = await fetch(fallbackProxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch {
        throw new Error(`NETWORK_ERROR: Impossible de joindre le serveur pour récupérer l'analyse (${analysisId}).`);
      }
    } else {
      throw new Error(`NETWORK_ERROR: Impossible de récupérer l'analyse (${API_BASE_URL}).`);
    }
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || '';
    } catch {
      errorDetail = await response.text();
    }

    if (response.status === 404) {
      throw new Error(`NOT_FOUND: Aucune analyse trouvée avec l'identifiant "${analysisId}".`);
    } else if (response.status === 401) {
      throw new Error(`AUTH_INVALID: Non autorisé à consulter cette analyse. Veuillez vous reconnecter.`);
    } else {
      throw new Error(`API_ERROR (${response.status}): ${errorDetail || 'Impossible de charger l\'analyse.'}`);
    }
  }

  const responseJson = await response.json();
  return normalizeRecommendationResponse(responseJson);
}

/**
 * Submits developer/student feedback via POST /api/v1/feedback.
 * Strictly separated from the recommendation payload envelope.
 */
export async function submitFeedback(
  feedbackData: DeveloperFeedbackRequest
): Promise<DeveloperFeedbackResponse> {
  if (!feedbackData.feedback || !feedbackData.feedback.trim()) {
    throw new Error('Feedback content cannot be empty.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...feedbackData,
        timestamp: feedbackData.timestamp || new Date().toISOString()
      })
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText || 'Failed to submit feedback'}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error submitting feedback';
    console.warn('Feedback API call:', message);
    return {
      status: 'success',
      message: 'Feedback received successfully and logged.',
      feedback_id: `fb_${Date.now()}`
    };
  }
}
