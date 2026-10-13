import { describe, it, expect } from 'vitest';
import { buildRecommendationPayload, INITIAL_FORM_STATE, QuestionnaireFormState } from '../services/payloadBuilder';

describe('NaviStudo Technical Specification — Payload Construction & Route Boundaries', () => {
  it('Route A (First Year Secondary): correctly constructs envelope and omits 3rd-year fields', () => {
    const routeAState: QuestionnaireFormState = {
      ...INITIAL_FORM_STATE,
      stageId: 'first_year_secondary',
      studyGroupId: 'science_and_technology',
      branchId: 'experimental_sciences', // should NOT leak into Route A student_profile
      subjectScores: {
        mathematics: { min: 14, max: 16 },
        physics_chemistry: { min: 13, max: 15 }
      },
      hasTakenBaccalaureate: true, // should be forced to false for 1st year
      baccalaureateAverage: 15.5, // should be null for 1st year
      subjectPreferenceOrder: ['mathematics', 'physics_chemistry', 'mathematics'], // duplicates should be deduplicated
      difficultSubjectIds: ['french_language'],
      fieldInterestLevels: {
        computer_science_ai: 5
      },
      selectedTopicIds: ['topic_web_mobile_dev'],
      topicOtherText: 'Robotic clubs',
      targetRoleText: 'Software Architect',
      curiosityFieldIds: ['engineering_robotics'],
      curiosityTopicIds: ['topic_smart_electronics'],
      curiosityOtherText: '',
      activityIds: ['act_coding_software'],
      workEnvironmentIds: ['env_tech_office_remote'], // should NOT be in Route A
      goalClarity: 'clear_goal',
      targetFieldIds: ['computer_science_ai'],
      priorityIds: ['prio_job_security', 'prio_high_income'],
      problemTypeIds: ['prob_practical_troubleshooting'],
      theoryApplicationPreference: 4,
      abstractConcretePreference: 2,
      humanSystemPreference: 5
    };

    const payload = buildRecommendationPayload(routeAState);

    // Envelope checks
    expect(payload.schema_version).toBe('1.0.0');
    expect(payload.student_profile.current_stage_id).toBe('first_year_secondary');
    expect(payload.student_profile.current_study_group_id).toBe('science_and_technology');
    expect(payload.student_profile.current_branch_id).toBeUndefined();
    expect(payload.student_profile.current_branch_subtype_id).toBeUndefined();

    // Baccalaureate logic for 1st year
    expect(payload.student_profile.has_taken_baccalaureate).toBe(false);
    expect(payload.student_profile.baccalaureate_average).toBeNull();

    // Subject performance boundary & score validation
    expect(payload.student_profile.subject_performance).toHaveLength(2);
    expect(payload.student_profile.subject_performance[0]).toEqual({
      subject_id: 'mathematics',
      min_score: 14,
      max_score: 16
    });

    // Deduplication of subject preferences
    expect(payload.student_profile.subject_preference_order).toEqual(['mathematics', 'physics_chemistry']);

    // Difficult subjects isolated
    expect(payload.student_profile.difficult_subject_ids).toEqual(['french_language']);

    // Route A interests: work_environment_ids must NOT be included
    expect(payload.interests.work_environment_ids).toBeUndefined();

    // Free text question-answer formatting
    expect(payload.interests.topic_other_text).toEqual({
      question: 'Other topics of interest',
      answer: 'Robotic clubs'
    });

    // Problem preferences MUST be omitted for Route A
    expect(payload.problem_preferences).toBeUndefined();
  });

  it('Route B (Third Year Secondary — Clear Goal): validates target fields, max 3 priorities, and problem scales', () => {
    const routeBState: QuestionnaireFormState = {
      ...INITIAL_FORM_STATE,
      stageId: 'third_year_secondary',
      branchId: 'mathematical_technique',
      branchSubtypeId: 'electrical_engineering',
      hasTakenBaccalaureate: true,
      baccalaureateAverage: 16.75,
      subjectScores: {
        mathematics: { min: 17, max: 18 },
        physics_chemistry: { min: 16, max: 17 }
      },
      goalClarity: 'clear_goal',
      targetFieldIds: ['computer_science_ai', 'engineering_robotics'],
      motivationIds: ['mot_passion_personal_interest', 'mot_intellectual_curiosity'],
      targetRoleText: 'Robotics Engineer',
      priorityIds: ['prio_job_security', 'prio_high_income', 'prio_intellectual_challenge', 'prio_creative_freedom'], // 4 items!
      alternativePathStatus: 'has_alternatives',
      alternativeFieldIds: ['natural_sciences_bio'],
      goalFlexibility: 4,
      problemTypeIds: ['prob_practical_troubleshooting', 'prob_data_analytical'],
      theoryApplicationPreference: 4,
      abstractConcretePreference: 5,
      humanSystemPreference: 4
    };

    const payload = buildRecommendationPayload(routeBState);

    expect(payload.student_profile.current_stage_id).toBe('third_year_secondary');
    expect(payload.student_profile.current_branch_id).toBe('mathematical_technique');
    expect(payload.student_profile.current_branch_subtype_id).toBe('electrical_engineering');
    expect(payload.student_profile.has_taken_baccalaureate).toBe(true);
    expect(payload.student_profile.baccalaureate_average).toBe(16.75);

    // Goal clarity
    expect(payload.future_direction.goal_clarity).toBe('clear_goal');
    expect(payload.future_direction.target_field_ids).toEqual(['computer_science_ai', 'engineering_robotics']);
    expect(payload.future_direction.considered_field_ids).toBeUndefined();
    expect(payload.future_direction.field_discovery_levels).toBeUndefined();

    // Priorities strictly capped to max 3
    expect(payload.future_direction.priority_ids).toHaveLength(3);
    expect(payload.future_direction.priority_ids).toEqual([
      'prio_job_security',
      'prio_high_income',
      'prio_intellectual_challenge'
    ]);

    // Problem preferences included for 3rd year
    expect(payload.problem_preferences).toBeDefined();
    expect(payload.problem_preferences?.theory_application_preference).toBe(4);
    expect(payload.problem_preferences?.abstract_concrete_preference).toBe(5);
    expect(payload.problem_preferences?.human_system_preference).toBe(4);
  });

  it('Route C (Third Year Secondary — General Direction): keeps considered_field_ids separate from target_field_ids', () => {
    const routeCState: QuestionnaireFormState = {
      ...INITIAL_FORM_STATE,
      stageId: 'third_year_secondary',
      branchId: 'experimental_sciences',
      goalClarity: 'general_direction',
      consideredFieldIds: ['medicine_health', 'natural_sciences_bio'],
      targetFieldIds: ['computer_science_ai'], // Should NOT be included in Route C
      futureRoleStatus: 'has_ideas',
      targetRoleText: 'Clinical Researcher',
      priorityIds: ['prio_social_contribution'],
      problemTypeIds: ['prob_theoretical_modeling'],
      theoryApplicationPreference: 2,
      abstractConcretePreference: 3,
      humanSystemPreference: 1
    };

    const payload = buildRecommendationPayload(routeCState);

    expect(payload.future_direction.goal_clarity).toBe('general_direction');
    expect(payload.future_direction.considered_field_ids).toEqual(['medicine_health', 'natural_sciences_bio']);
    expect(payload.future_direction.target_field_ids).toBeUndefined();
    expect(payload.future_direction.future_role_status).toBe('has_ideas');
  });

  it('Route D (Third Year Secondary — No Defined Goal): never fabricates target fields or roles', () => {
    const routeDState: QuestionnaireFormState = {
      ...INITIAL_FORM_STATE,
      stageId: 'third_year_secondary',
      branchId: 'mathematics',
      goalClarity: 'no_defined_goal',
      targetFieldIds: ['invented_field'], // Must be omitted
      targetRoleText: 'Invented Role', // Must be omitted
      fieldDiscoveryLevels: {
        natural_sciences_bio: 4,
        business_finance: 3
      },
      fieldDiscoveryOtherText: 'Interested in emerging environmental careers',
      priorityIds: ['prio_intellectual_challenge'],
      problemTypeIds: ['prob_theoretical_modeling'],
      theoryApplicationPreference: 1,
      abstractConcretePreference: 1,
      humanSystemPreference: 3
    };

    const payload = buildRecommendationPayload(routeDState);

    expect(payload.future_direction.goal_clarity).toBe('no_defined_goal');
    expect(payload.future_direction.target_field_ids).toBeUndefined();
    expect(payload.future_direction.considered_field_ids).toBeUndefined();
    expect(payload.future_direction.target_role_text).toBeUndefined();

    // Discovery levels present
    expect(payload.future_direction.field_discovery_levels).toHaveLength(2);
    expect(payload.future_direction.field_discovery_other_text).toEqual({
      question: 'Areas student is open to discovering',
      answer: 'Interested in emerging environmental careers'
    });
  });

  it('Score range validation: enforces min <= max and clamps 0 to 20', () => {
    const stateWithInvertedScores: QuestionnaireFormState = {
      ...INITIAL_FORM_STATE,
      stageId: 'first_year_secondary',
      subjectScores: {
        mathematics: { min: 18, max: 12 }, // inverted!
        philosophy: { min: -5, max: 25 } // out of bounds!
      }
    };

    const payload = buildRecommendationPayload(stateWithInvertedScores);
    const mathPerf = payload.student_profile.subject_performance.find(p => p.subject_id === 'mathematics');
    const philPerf = payload.student_profile.subject_performance.find(p => p.subject_id === 'philosophy');

    expect(mathPerf?.min_score).toBe(12);
    expect(mathPerf?.max_score).toBe(18);

    expect(philPerf?.min_score).toBe(0);
    expect(philPerf?.max_score).toBe(20);
  });

  it('Developer Feedback Isolation: feedback is never mixed into recommendation envelope', () => {
    const state: QuestionnaireFormState = {
      ...INITIAL_FORM_STATE,
      stageId: 'third_year_secondary',
      branchId: 'mathematics'
    };

    const payload = buildRecommendationPayload(state);
    // Ensure no feedback property exists on recommendation envelope
    expect((payload as any).feedback).toBeUndefined();
    expect((payload as any).developer_feedback).toBeUndefined();
    expect((payload.student_profile as any).feedback).toBeUndefined();
  });
});
