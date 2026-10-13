import {
  RecommendationRequestEnvelope,
  StudentProfilePayload,
  InterestsPayload,
  FutureDirectionPayload,
  ProblemPreferencesPayload,
  SubjectPerformanceItem
} from '../types/contract';

export interface QuestionnaireFormState {
  // Stage & Stream
  stageId: 'first_year_secondary' | 'third_year_secondary';
  studyGroupId: string;
  branchId: string;
  branchSubtypeId: string;

  // Performance
  subjectScores: Record<string, { min: number; max: number }>;
  hasTakenBaccalaureate: boolean;
  baccalaureateAverage: number | null;

  // Preferences & Difficulties
  subjectPreferenceOrder: string[];
  difficultSubjectIds: string[];

  // Interests & Curiosity
  fieldInterestLevels: Record<string, number>; // 1-5
  selectedTopicIds: string[];
  topicOtherText: string;
  targetRoleText: string;
  curiosityFieldIds: string[];
  curiosityTopicIds: string[];
  curiosityOtherText: string;
  activityIds: string[];
  workEnvironmentIds: string[];

  // Future Direction
  goalClarity: 'clear_goal' | 'general_direction' | 'no_defined_goal';
  targetFieldIds: string[];
  consideredFieldIds: string[];
  motivationIds: string[];
  motivationOtherText: string;
  futureRoleStatus: 'has_ideas' | 'exploring' | 'not_specified';
  priorityIds: string[];
  alternativePathStatus: 'has_alternatives' | 'no_alternatives' | 'undecided';
  alternativeFieldIds: string[];
  alternativeFieldOtherText: string;
  goalFlexibility: number;
  fieldDiscoveryLevels: Record<string, number>;
  fieldDiscoveryOtherText: string;

  // Problem preferences (3rd year)
  problemTypeIds: string[];
  theoryApplicationPreference: number;
  abstractConcretePreference: number;
  humanSystemPreference: number;
}

export const INITIAL_FORM_STATE: QuestionnaireFormState = {
  stageId: 'third_year_secondary',
  studyGroupId: 'science_and_technology',
  branchId: 'experimental_sciences',
  branchSubtypeId: '',

  subjectScores: {},
  hasTakenBaccalaureate: false,
  baccalaureateAverage: null,

  subjectPreferenceOrder: [],
  difficultSubjectIds: [],

  fieldInterestLevels: {},
  selectedTopicIds: [],
  topicOtherText: '',
  targetRoleText: '',
  curiosityFieldIds: [],
  curiosityTopicIds: [],
  curiosityOtherText: '',
  activityIds: [],
  workEnvironmentIds: [],

  goalClarity: 'clear_goal',
  targetFieldIds: [],
  consideredFieldIds: [],
  motivationIds: [],
  motivationOtherText: '',
  futureRoleStatus: 'has_ideas',
  priorityIds: [],
  alternativePathStatus: 'has_alternatives',
  alternativeFieldIds: [],
  alternativeFieldOtherText: '',
  goalFlexibility: 3,
  fieldDiscoveryLevels: {},
  fieldDiscoveryOtherText: '',

  problemTypeIds: [],
  theoryApplicationPreference: 3,
  abstractConcretePreference: 3,
  humanSystemPreference: 3
};

/**
 * Builds the exact recommendation request envelope conforming to MVP v1.0 specifications.
 * Enforces route boundaries (Routes A, B, C, D) and isolates conditional data.
 */
export function buildRecommendationPayload(state: QuestionnaireFormState): RecommendationRequestEnvelope {
  const isFirstYear = state.stageId === 'first_year_secondary';

  // 1. Sanitize & construct subject performance
  const subjectPerformance: SubjectPerformanceItem[] = Object.entries(state.subjectScores)
    .filter(([_, score]) => score !== undefined && score.min !== undefined && score.max !== undefined)
    .map(([subjectId, score]) => {
      const min = Math.max(0, Math.min(20, Number(score.min) || 0));
      const max = Math.max(0, Math.min(20, Number(score.max) || 0));
      return {
        subject_id: subjectId,
        min_score: Math.min(min, max),
        max_score: Math.max(min, max)
      };
    });

  // 2. Dedup subject preference ordering
  const uniqueSubjectOrder = Array.from(new Set(state.subjectPreferenceOrder.filter(Boolean)));

  // 3. Build student profile payload
  const studentProfile: StudentProfilePayload = {
    current_stage_id: state.stageId,
    subject_performance: subjectPerformance,
    has_taken_baccalaureate: isFirstYear ? false : Boolean(state.hasTakenBaccalaureate),
    baccalaureate_average: (!isFirstYear && state.hasTakenBaccalaureate && state.baccalaureateAverage !== null)
      ? Math.max(0, Math.min(20, Number(state.baccalaureateAverage)))
      : null,
    subject_preference_order: uniqueSubjectOrder,
    difficult_subject_ids: Array.from(new Set(state.difficultSubjectIds.filter(Boolean)))
  };

  if (isFirstYear) {
    studentProfile.current_study_group_id = state.studyGroupId || 'science_and_technology';
  } else {
    studentProfile.current_branch_id = state.branchId || 'experimental_sciences';
    if (state.branchId === 'mathematical_technique' && state.branchSubtypeId) {
      studentProfile.current_branch_subtype_id = state.branchSubtypeId;
    } else {
      studentProfile.current_branch_subtype_id = null;
    }
  }

  // 4. Build interests payload
  const fieldInterestLevels = Object.entries(state.fieldInterestLevels)
    .filter(([_, level]) => typeof level === 'number' && level >= 1 && level <= 5)
    .map(([field_id, interest_level]) => ({ field_id, interest_level }));

  const interests: InterestsPayload = {
    field_interest_levels: fieldInterestLevels,
    selected_topic_ids: Array.from(new Set(state.selectedTopicIds.filter(Boolean))),
    curiosity_field_ids: Array.from(new Set(state.curiosityFieldIds.filter(Boolean))),
    curiosity_topic_ids: Array.isArray(state.curiosityTopicIds)
      ? Array.from(new Set(state.curiosityTopicIds.filter(Boolean)))
      : [],
    activity_ids: Array.from(new Set(state.activityIds.filter(Boolean)))
  };

  if (state.topicOtherText?.trim()) {
    interests.topic_other_text = {
      question: 'Other topics of interest',
      answer: state.topicOtherText.trim()
    };
  }

  if (state.curiosityOtherText?.trim()) {
    interests.curiosity_other_text = {
      question: 'Other curiosity topics',
      answer: state.curiosityOtherText.trim()
    };
  }

  // Target role in interests (or general free text if entered)
  if (state.targetRoleText?.trim()) {
    interests.target_role_text = {
      question: 'Target future occupation',
      answer: state.targetRoleText.trim()
    };
  }

  // Work environments are only relevant for 3rd year secondary
  if (!isFirstYear && state.workEnvironmentIds?.length > 0) {
    interests.work_environment_ids = Array.from(new Set(state.workEnvironmentIds.filter(Boolean)));
  }

  // 5. Build future direction payload according to Route
  const futureDirection: FutureDirectionPayload = {
    goal_clarity: isFirstYear ? 'general_direction' : state.goalClarity
  };

  if (isFirstYear) {
    // ROUTE A: First-year secondary
    // No university-goal questions, no work-environment preferences, no advanced problem preferences
    if (state.targetRoleText?.trim()) {
      futureDirection.target_role_text = {
        question: 'Future occupation vision',
        answer: state.targetRoleText.trim()
      };
    }
  } else if (state.goalClarity === 'clear_goal') {
    // ROUTE B: Third-year secondary with Clear Goal
    futureDirection.target_field_ids = Array.from(new Set(state.targetFieldIds.filter(Boolean)));
    futureDirection.motivation_ids = Array.from(new Set(state.motivationIds.filter(Boolean)));

    if (state.motivationOtherText?.trim()) {
      futureDirection.motivation_other_text = {
        question: 'Other motivation factors',
        answer: state.motivationOtherText.trim()
      };
    }

    if (state.targetRoleText?.trim()) {
      futureDirection.target_role_text = {
        question: 'Specific target career role',
        answer: state.targetRoleText.trim()
      };
    }

    // Max 3 priorities enforced
    futureDirection.priority_ids = Array.from(new Set(state.priorityIds.filter(Boolean))).slice(0, 3);
    futureDirection.alternative_path_status = state.alternativePathStatus || 'has_alternatives';
    futureDirection.alternative_field_ids = Array.from(new Set(state.alternativeFieldIds.filter(Boolean)));

    if (state.alternativeFieldOtherText?.trim()) {
      futureDirection.alternative_field_other_text = {
        question: 'Other alternative paths considered',
        answer: state.alternativeFieldOtherText.trim()
      };
    }

    futureDirection.goal_flexibility = Math.max(1, Math.min(5, Number(state.goalFlexibility) || 3));
  } else if (state.goalClarity === 'general_direction') {
    // ROUTE C: Third-year secondary with General Direction
    futureDirection.considered_field_ids = Array.from(new Set(state.consideredFieldIds.filter(Boolean)));
    futureDirection.motivation_ids = Array.from(new Set(state.motivationIds.filter(Boolean)));

    if (state.motivationOtherText?.trim()) {
      futureDirection.motivation_other_text = {
        question: 'Other motivation factors',
        answer: state.motivationOtherText.trim()
      };
    }

    futureDirection.future_role_status = state.futureRoleStatus || 'has_ideas';

    if (state.targetRoleText?.trim()) {
      futureDirection.target_role_text = {
        question: 'Potential career role',
        answer: state.targetRoleText.trim()
      };
    }

    // Max 3 priorities
    futureDirection.priority_ids = Array.from(new Set(state.priorityIds.filter(Boolean))).slice(0, 3);
    futureDirection.alternative_field_ids = Array.from(new Set(state.alternativeFieldIds.filter(Boolean)));

    if (state.alternativeFieldOtherText?.trim()) {
      futureDirection.alternative_field_other_text = {
        question: 'Other fields under consideration',
        answer: state.alternativeFieldOtherText.trim()
      };
    }

    futureDirection.goal_flexibility = Math.max(1, Math.min(5, Number(state.goalFlexibility) || 3));
  } else {
    // ROUTE D: Third-year secondary with No Defined Goal
    // DO NOT invent target fields or roles!
    futureDirection.priority_ids = Array.from(new Set(state.priorityIds.filter(Boolean))).slice(0, 3);

    const fieldDiscoveryLevels = Object.entries(state.fieldDiscoveryLevels)
      .filter(([_, readiness]) => typeof readiness === 'number' && readiness >= 1 && readiness <= 5)
      .map(([field_id, readiness]) => ({ field_id, readiness }));

    futureDirection.field_discovery_levels = fieldDiscoveryLevels;

    if (state.fieldDiscoveryOtherText?.trim()) {
      futureDirection.field_discovery_other_text = {
        question: 'Areas student is open to discovering',
        answer: state.fieldDiscoveryOtherText.trim()
      };
    }
  }

  // 6. Root envelope construction
  const envelope: RecommendationRequestEnvelope = {
    schema_version: '1.0.0',
    student_profile: studentProfile,
    interests: interests,
    future_direction: futureDirection
  };

  // 7. Problem preferences are strictly for 3rd year secondary routes B, C, D
  if (!isFirstYear) {
    const problemPreferences: ProblemPreferencesPayload = {
      problem_type_ids: Array.from(new Set(state.problemTypeIds.filter(Boolean))),
      theory_application_preference: Math.max(1, Math.min(5, Number(state.theoryApplicationPreference) || 3)),
      abstract_concrete_preference: Math.max(1, Math.min(5, Number(state.abstractConcretePreference) || 3)),
      human_system_preference: Math.max(1, Math.min(5, Number(state.humanSystemPreference) || 3))
    };
    envelope.problem_preferences = problemPreferences;
  }

  return envelope;
}
