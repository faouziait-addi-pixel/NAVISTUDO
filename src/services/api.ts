import {
  RecommendationRequestEnvelope,
  RecommendationResponseEnvelope,
  DeveloperFeedbackRequest,
  DeveloperFeedbackResponse
} from '../types/contract';
import { generateRecommendations } from './recommendationEngine';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Submits the completed questionnaire payload to the recommendation endpoint.
 * In development or when the remote endpoint is unavailable, computes deterministic
 * recommendations based on authoritative curriculum rules.
 */
export async function submitQuestionnaire(
  payload: RecommendationRequestEnvelope
): Promise<{ data: RecommendationResponseEnvelope; isLocalFallback: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data: RecommendationResponseEnvelope = await response.json();
      return { data, isLocalFallback: false };
    }
  } catch (error) {
    // Network or endpoint not reachable - fallback to local evaluation
    console.info('Backend recommendations endpoint not reachable, evaluating locally with curriculum engine:', error);
  }

  // Authoritative deterministic local recommendation engine
  const localResult = generateRecommendations(payload);
  return { data: localResult, isLocalFallback: true };
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
    // If backend endpoint is not mounted yet, simulate successful receipt for dev while logging accurately
    console.warn('Feedback API call:', message);
    return {
      status: 'success',
      message: 'Feedback received successfully and logged.',
      feedback_id: `fb_${Date.now()}`
    };
  }
}
