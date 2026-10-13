import { RecommendationRequestEnvelope, RecommendationResponseEnvelope, MajorRecommendation } from '../types/contract';
import { MAJORS_DATABASE, MajorDatabaseEntry } from '../data/majorsDatabase';

/**
 * Deterministic recommendation engine that evaluates educational pathways based on:
 * - Branch eligibility & prerequisites
 * - Key subject performance scores
 * - Holland interest alignment & topic overlap
 * - Cognitive problem-solving preferences (Theory vs Application, Abstract vs Concrete, Human vs System)
 */
export function generateRecommendations(payload: RecommendationRequestEnvelope): RecommendationResponseEnvelope {
  const profile = payload.student_profile;
  const interests = payload.interests;
  const direction = payload.future_direction;
  const problemPrefs = payload.problem_preferences;

  const isFirstYear = profile.current_stage_id === 'first_year_secondary';
  const branchId = profile.current_branch_id || '';
  const studyGroupId = profile.current_study_group_id || '';

  // Pre-index subject performance scores for fast lookup
  const subjectScores: Record<string, number> = {};
  profile.subject_performance.forEach(p => {
    // Average of min and max score for orientation weighting
    subjectScores[p.subject_id] = (p.min_score + p.max_score) / 2;
  });

  // Calculate score for each major in database
  const scoredMajors = MAJORS_DATABASE.map(major => {
    let score = 50; // baseline

    // 1. Branch / Study Group Eligibility & Bonus
    if (isFirstYear) {
      if (studyGroupId === 'science_and_technology') {
        if (['engineering', 'health', 'science'].includes(major.category)) {
          score += 15;
        } else if (major.category === 'business') {
          score += 8;
        }
      } else if (studyGroupId === 'arts_and_humanities') {
        if (['humanities', 'business'].includes(major.category)) {
          score += 18;
        } else {
          score -= 20; // difficult transition from literary common core to STEM
        }
      }
    } else {
      // 3rd year secondary branch check
      if (major.prerequisite_branches.includes(branchId)) {
        score += 15;
      } else {
        score -= 25; // penalize incompatible branch orientations
      }

      // Check baccalaureate average if taken
      if (profile.has_taken_baccalaureate && profile.baccalaureate_average !== null && major.min_indicative_average) {
        const diff = profile.baccalaureate_average - major.min_indicative_average;
        if (diff >= 0) {
          score += Math.min(15, diff * 3);
        } else {
          score -= Math.min(25, Math.abs(diff) * 4);
        }
      }
    }

    // 2. Key Subject Performance Contribution
    let keySubjectBonus = 0;
    let countedSubjects = 0;
    major.key_subjects.forEach(subjId => {
      const avg = subjectScores[subjId];
      if (avg !== undefined) {
        countedSubjects++;
        // 10 is pass, 15 is good, 18+ is excellent
        if (avg >= 15) {
          keySubjectBonus += (avg - 14) * 3;
        } else if (avg < 10) {
          keySubjectBonus -= (10 - avg) * 2.5;
        }
      }
    });
    if (countedSubjects > 0) {
      score += Math.max(-15, Math.min(20, keySubjectBonus / countedSubjects * 2));
    }

    // 3. Subject Preference Order Alignment
    if (profile.subject_preference_order.length > 0) {
      const topPreference = profile.subject_preference_order[0];
      const secondPreference = profile.subject_preference_order[1];
      if (major.key_subjects.includes(topPreference)) {
        score += 8;
      }
      if (secondPreference && major.key_subjects.includes(secondPreference)) {
        score += 4;
      }
    }

    // 4. Difficult Subjects Penalty
    if (profile.difficult_subject_ids.length > 0) {
      const difficultOverlaps = profile.difficult_subject_ids.filter(d => major.key_subjects.includes(d));
      score -= difficultOverlaps.length * 6;
    }

    // 5. Interest Fields and Topics
    const fieldInterest = interests.field_interest_levels.find(f => {
      if (major.category === 'engineering' && (f.field_id === 'computer_science_ai' || f.field_id === 'engineering_robotics' || f.field_id === 'architecture_urban')) return true;
      if (major.category === 'health' && f.field_id === 'medicine_health') return true;
      if (major.category === 'science' && (f.field_id === 'natural_sciences_bio' || f.field_id === 'education_pedagogy')) return true;
      if (major.category === 'business' && f.field_id === 'business_finance') return true;
      if (major.category === 'humanities' && (f.field_id === 'law_governance' || f.field_id === 'languages_translation' || f.field_id === 'media_communication')) return true;
      return false;
    });

    if (fieldInterest) {
      score += (fieldInterest.interest_level - 3) * 5; // -10 to +10
    }

    // 6. Future Direction Bonus
    if (direction.goal_clarity === 'clear_goal' && direction.target_field_ids) {
      const isTarget = direction.target_field_ids.some(tid =>
        (major.category === 'engineering' && (tid === 'computer_science_ai' || tid === 'engineering_robotics')) ||
        (major.category === 'health' && tid === 'medicine_health') ||
        (major.category === 'business' && tid === 'business_finance') ||
        (major.category === 'humanities' && tid === 'law_governance')
      );
      if (isTarget) score += 12;
    } else if (direction.goal_clarity === 'general_direction' && direction.considered_field_ids) {
      const isConsidered = direction.considered_field_ids.some(cid =>
        (major.category === 'engineering' && (cid === 'computer_science_ai' || cid === 'engineering_robotics')) ||
        (major.category === 'health' && cid === 'medicine_health') ||
        (major.category === 'business' && cid === 'business_finance') ||
        (major.category === 'humanities' && cid === 'law_governance')
      );
      if (isConsidered) score += 8;
    }

    // 7. Problem Preferences (for 3rd year)
    if (problemPrefs) {
      // Theory vs Application: 1 (Theory) to 5 (Application)
      if (major.category === 'engineering' && problemPrefs.theory_application_preference >= 4) score += 4;
      if (major.category === 'science' && problemPrefs.theory_application_preference <= 2) score += 4;

      // Abstract vs Concrete: 1 (Abstract) to 5 (Concrete)
      if (major.major_id === 'major_computer_science_ai' && problemPrefs.abstract_concrete_preference <= 2) score += 4;
      if (major.major_id === 'major_electronics_robotics' && problemPrefs.abstract_concrete_preference >= 4) score += 4;

      // Human vs System: 1 (Human) to 5 (System)
      if ((major.category === 'health' || major.category === 'humanities') && problemPrefs.human_system_preference <= 2) score += 5;
      if ((major.category === 'engineering' || major.major_id === 'major_computer_science_ai') && problemPrefs.human_system_preference >= 4) score += 5;
    }

    // Bound final score between 40 and 98
    const finalScore = Math.round(Math.max(45, Math.min(97, score)));

    // Categorize match level
    let matchLevel: 'strong_match' | 'great_alternative' | 'field_to_explore';
    if (finalScore >= 85) {
      matchLevel = 'strong_match';
    } else if (finalScore >= 75) {
      matchLevel = 'great_alternative';
    } else {
      matchLevel = 'field_to_explore';
    }

    return {
      ...major,
      match_score: finalScore,
      match_level: matchLevel
    };
  });

  // Sort descending by score
  const sortedMajors = scoredMajors.sort((a, b) => b.match_score - a.match_score);

  // Pick top recommendations
  const recommendations: MajorRecommendation[] = sortedMajors.map(m => ({
    major_id: m.major_id,
    title_en: m.title_en,
    title_ar: m.title_ar,
    category: m.category,
    match_score: m.match_score,
    match_level: m.match_level,
    explanation_en: m.explanation_en,
    explanation_ar: m.explanation_ar,
    key_subjects: m.key_subjects,
    typical_careers: m.typical_careers,
    prerequisite_branches: m.prerequisite_branches,
    min_indicative_average: m.min_indicative_average,
    study_duration_years: m.study_duration_years,
    institution_types: m.institution_types
  }));

  const topMajor = sortedMajors[0];
  const summary = {
    primary_strength: topMajor ? topMajor.title_en : 'Scientific & Technical Reasoning',
    suggested_focus: topMajor
      ? `Strong alignment with ${topMajor.category.toUpperCase()} pathways given your academic performance and interest profile.`
      : 'Comprehensive orientation recommended across high-demand pathways.',
    total_evaluated: MAJORS_DATABASE.length
  };

  return {
    schema_version: '1.0.0',
    recommendations,
    summary
  };
}
