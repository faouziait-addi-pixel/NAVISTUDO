import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  normalizeRecommendationResponse,
  submitQuestionnaire,
  getSavedAnalysis,
  API_BASE_URL
} from '../services/api';
import { RecommendationRequestEnvelope } from '../types/contract';

describe('NaviStudo Backend API Integration', () => {
  const dummyPayload: RecommendationRequestEnvelope = {
    schema_version: '1.0.0',
    student_profile: {
      current_stage_id: 'third_year_secondary',
      current_branch_id: 'experimental_sciences',
      subject_performance: [{ subject_id: 'mathematics', min_score: 15, max_score: 17 }],
      has_taken_baccalaureate: false,
      baccalaureate_average: null,
      subject_preference_order: ['mathematics'],
      difficult_subject_ids: []
    },
    interests: {
      field_interest_levels: [{ field_id: 'computer_science_ai', interest_level: 5 }],
      selected_topic_ids: [],
      curiosity_field_ids: [],
      curiosity_topic_ids: [],
      activity_ids: []
    },
    future_direction: {
      goal_clarity: 'clear_goal'
    }
  };

  const sampleBackendResponse = {
    schema_version: '1.0.0',
    analysis_id: 'ana_test_98765',
    created_at: '2026-10-20T12:00:00Z',
    recommendations: [
      {
        major_id: 'major_computer_science_ai',
        title_en: 'Computer Science & AI',
        title_ar: 'علوم الحاسوب والذكاء الاصطناعي',
        title_fr: 'Informatique & Intelligence Artificielle',
        category: 'engineering',
        match_score: 95,
        match_level: 'strong_match',
        explanation_en: 'High logical reasoning alignment.',
        explanation_ar: 'توافق عالي مع التفكير المنطقي.',
        explanation_fr: 'Forte adéquation avec le raisonnement logique.',
        key_subjects: ['mathematics', 'physics_chemistry'],
        typical_careers: ['Software Engineer', 'Data Scientist'],
        prerequisite_branches: ['mathematics', 'experimental_sciences'],
        min_indicative_average: 15.5,
        study_duration_years: 5,
        institution_types: ['National Higher Schools (ESI)']
      }
    ],
    summary: {
      primary_strength: 'Informatique & Intelligence Artificielle',
      suggested_focus: 'Filières d\'ingénierie et sciences exactes',
      total_evaluated: 1
    }
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('normalizeRecommendationResponse', () => {
    it('normalizes standard envelope response', () => {
      const normalized = normalizeRecommendationResponse(sampleBackendResponse);
      expect(normalized.schema_version).toBe('1.0.0');
      expect(normalized.analysis_id).toBe('ana_test_98765');
      expect(normalized.recommendations).toHaveLength(1);
      expect(normalized.recommendations[0].major_id).toBe('major_computer_science_ai');
      expect(normalized.recommendations[0].match_score).toBe(95);
      expect(normalized.recommendations[0].match_level).toBe('strong_match');
    });

    it('normalizes raw array or nested data wrapper gracefully', () => {
      const nested = {
        data: {
          id: 'analysis_456',
          recommendations: [
            {
              id: 'med_01',
              title: 'Médecine',
              score: 0.92,
              category: 'health'
            }
          ]
        }
      };

      const normalized = normalizeRecommendationResponse(nested);
      expect(normalized.analysis_id).toBe('analysis_456');
      expect(normalized.recommendations).toHaveLength(1);
      expect(normalized.recommendations[0].major_id).toBe('med_01');
      expect(normalized.recommendations[0].title_fr).toBe('Médecine');
      expect(normalized.recommendations[0].match_score).toBe(92);
      expect(normalized.recommendations[0].match_level).toBe('strong_match');
    });

    it('throws error for empty or invalid input', () => {
      expect(() => normalizeRecommendationResponse(null)).toThrow('Réponse vide ou invalide');
    });
  });

  describe('submitQuestionnaire', () => {
    it('throws AUTH_REQUIRED error if no token is available', async () => {
      await expect(submitQuestionnaire(dummyPayload, null)).rejects.toThrow('AUTH_REQUIRED');
    });

    it('sends POST to /api/v1/recommendations with Bearer token and returns normalized data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleBackendResponse
      });

      const result = await submitQuestionnaire(dummyPayload, 'mock_firebase_id_token_123');

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = (global.fetch as any).mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/v1/recommendations`);
      expect(options.method).toBe('POST');
      expect(options.headers['Authorization']).toBe('Bearer mock_firebase_id_token_123');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(options.body).schema_version).toBe('1.0.0');

      expect(result.isLocalFallback).toBe(false);
      expect(result.data.analysis_id).toBe('ana_test_98765');
      expect(result.data.recommendations).toHaveLength(1);
    });

    it('handles 401 Unauthorized with descriptive AUTH_INVALID error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'unauthorized', message: 'Token expired' })
      });

      await expect(
        submitQuestionnaire(dummyPayload, 'expired_token')
      ).rejects.toThrow('AUTH_INVALID');
    });

    it('handles 400/422 Validation error cleanly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ error: 'validation', message: 'Invalid field' })
      });

      await expect(
        submitQuestionnaire(dummyPayload, 'valid_token')
      ).rejects.toThrow('VALIDATION_ERROR');
    });

    it('handles 500 Server error cleanly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error'
      });

      await expect(
        submitQuestionnaire(dummyPayload, 'valid_token')
      ).rejects.toThrow('SERVER_ERROR');
    });
  });

  describe('getSavedAnalysis', () => {
    it('throws error if analysisId is empty', async () => {
      await expect(getSavedAnalysis('', 'token')).rejects.toThrow('ID d\'analyse invalide');
    });

    it('sends GET to /api/v1/recommendations/<id> with Bearer token', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleBackendResponse
      });

      const analysis = await getSavedAnalysis('ana_test_98765', 'test_token');

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = (global.fetch as any).mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/v1/recommendations/ana_test_98765`);
      expect(options.method).toBe('GET');
      expect(options.headers['Authorization']).toBe('Bearer test_token');
      expect(analysis.analysis_id).toBe('ana_test_98765');
      expect(analysis.recommendations[0].major_id).toBe('major_computer_science_ai');
    });

    it('handles 404 NOT_FOUND error when analysis does not exist', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'not_found', message: 'Analysis not found' })
      });

      await expect(getSavedAnalysis('non_existent_id', 'test_token')).rejects.toThrow('NOT_FOUND');
    });
  });
});
