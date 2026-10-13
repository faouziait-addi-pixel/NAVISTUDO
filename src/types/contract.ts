/**
 * NaviStudo — Frontend Questionnaire Output Specification (MVP v1.0)
 * Data Contract Types & Schemas
 */

export type AcademicStageId = 'first_year_secondary' | 'third_year_secondary';

export type GoalClarityId = 'clear_goal' | 'general_direction' | 'no_defined_goal';

export interface SubjectPerformanceItem {
  subject_id: string;
  min_score: number; // 0 to 20
  max_score: number; // 0 to 20, min_score <= max_score
}

export interface StudentProfilePayload {
  current_stage_id: AcademicStageId;
  current_study_group_id?: string;
  current_branch_id?: string;
  current_branch_subtype_id?: string | null;
  subject_performance: SubjectPerformanceItem[];
  has_taken_baccalaureate: boolean;
  baccalaureate_average: number | null;
  subject_preference_order: string[];
  difficult_subject_ids: string[];
}

export interface FreeTextAnswer {
  question: string;
  answer: string;
}

export interface FieldInterestLevel {
  field_id: string;
  interest_level: number; // 1 to 5
}

export interface InterestsPayload {
  field_interest_levels: FieldInterestLevel[];
  selected_topic_ids: string[];
  topic_other_text?: FreeTextAnswer | null;
  target_role_text?: FreeTextAnswer | null;
  curiosity_field_ids: string[];
  curiosity_topic_ids: string[];
  curiosity_other_text?: FreeTextAnswer | null;
  activity_ids: string[];
  work_environment_ids?: string[];
}

export interface FieldDiscoveryLevel {
  field_id: string;
  readiness: number; // 1 to 5
}

export interface FutureDirectionPayload {
  goal_clarity: GoalClarityId;
  target_field_ids?: string[];
  considered_field_ids?: string[];
  motivation_ids?: string[];
  motivation_other_text?: FreeTextAnswer | null;
  target_role_text?: FreeTextAnswer | null;
  future_role_status?: 'has_ideas' | 'exploring' | 'not_specified';
  priority_ids?: string[]; // max 3
  alternative_path_status?: 'has_alternatives' | 'no_alternatives' | 'undecided';
  alternative_field_ids?: string[];
  alternative_field_other_text?: FreeTextAnswer | null;
  goal_flexibility?: number | string;
  field_discovery_levels?: FieldDiscoveryLevel[];
  field_discovery_other_text?: FreeTextAnswer | null;
}

export interface ProblemPreferencesPayload {
  problem_type_ids: string[];
  theory_application_preference: number; // 1 to 5
  abstract_concrete_preference: number; // 1 to 5
  human_system_preference: number; // 1 to 5
}

/**
 * Root Recommendation Request Envelope
 */
export interface RecommendationRequestEnvelope {
  schema_version: '1.0.0';
  student_profile: StudentProfilePayload;
  interests: InterestsPayload;
  future_direction: FutureDirectionPayload;
  problem_preferences?: ProblemPreferencesPayload;
}

/**
 * Developer Feedback Request Envelope
 * Strictly isolated from recommendation payload
 */
export interface DeveloperFeedbackRequest {
  feedback: string;
  context?: {
    stage_id?: string;
    branch_id?: string;
    current_step?: number;
    user_agent?: string;
  };
  timestamp?: string;
}

export interface DeveloperFeedbackResponse {
  status: 'success' | 'error';
  message: string;
  feedback_id?: string;
}

/**
 * Backend Recommendation Response Item
 */
export interface MajorRecommendation {
  major_id: string;
  title_en: string;
  title_ar: string;
  category: 'engineering' | 'health' | 'science' | 'humanities' | 'business';
  match_score: number; // 0 to 100
  match_level: 'strong_match' | 'great_alternative' | 'field_to_explore';
  explanation_en: string;
  explanation_ar: string;
  key_subjects: string[];
  typical_careers: string[];
  prerequisite_branches: string[];
  min_indicative_average?: number;
  study_duration_years: number;
  institution_types: string[];
}

export interface RecommendationResponseEnvelope {
  schema_version: '1.0.0';
  recommendations: MajorRecommendation[];
  summary: {
    primary_strength: string;
    suggested_focus: string;
    total_evaluated: number;
  };
}
