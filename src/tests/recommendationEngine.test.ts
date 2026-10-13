import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../services/recommendationEngine';
import { buildRecommendationPayload, INITIAL_FORM_STATE } from '../services/payloadBuilder';

describe('NaviStudo Recommendation Engine Evaluation Tests', () => {
  it('recommends medicine and health sciences when student has strong biological sciences background', () => {
    const payload = buildRecommendationPayload({
      ...INITIAL_FORM_STATE,
      stageId: 'third_year_secondary',
      branchId: 'experimental_sciences',
      hasTakenBaccalaureate: true,
      baccalaureateAverage: 16.8,
      subjectScores: {
        natural_sciences: { min: 17, max: 18 },
        physics_chemistry: { min: 16, max: 17 },
        mathematics: { min: 14, max: 15 }
      },
      subjectPreferenceOrder: ['natural_sciences', 'physics_chemistry'],
      goalClarity: 'clear_goal',
      targetFieldIds: ['medicine_health'],
      priorityIds: ['prio_social_contribution'],
      humanSystemPreference: 1 // high human orientation
    });

    const result = generateRecommendations(payload);
    expect(result.schema_version).toBe('1.0.0');
    expect(result.recommendations.length).toBeGreaterThan(0);

    const topMajor = result.recommendations[0];
    expect(topMajor.category).toBe('health');
    expect(topMajor.major_id).toBe('major_medicine');
    expect(topMajor.match_score).toBeGreaterThanOrEqual(85);
    expect(topMajor.match_level).toBe('strong_match');
  });

  it('recommends computer science and engineering when student is math/tech focused', () => {
    const payload = buildRecommendationPayload({
      ...INITIAL_FORM_STATE,
      stageId: 'third_year_secondary',
      branchId: 'mathematics',
      hasTakenBaccalaureate: true,
      baccalaureateAverage: 17.2,
      subjectScores: {
        mathematics: { min: 18, max: 19 },
        physics_chemistry: { min: 17, max: 18 }
      },
      subjectPreferenceOrder: ['mathematics'],
      goalClarity: 'clear_goal',
      targetFieldIds: ['computer_science_ai'],
      priorityIds: ['prio_intellectual_challenge'],
      humanSystemPreference: 5, // high systems orientation
      abstractConcretePreference: 1 // high abstract software logic
    });

    const result = generateRecommendations(payload);
    const topMajor = result.recommendations[0];
    expect(topMajor.major_id).toBe('major_computer_science_ai');
    expect(topMajor.match_score).toBeGreaterThanOrEqual(90);
  });
});
