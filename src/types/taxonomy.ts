/**
 * NaviStudo — Canonical Taxonomy Definitions
 * Uses canonical snake_case IDs with authoritative Arabic & English labels.
 */

export interface TaxonomyOption {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  category?: string;
}

export const ACADEMIC_STAGES: TaxonomyOption[] = [
  {
    id: 'first_year_secondary',
    name_en: 'First Year Secondary (Common Core)',
    name_ar: 'السنة الأولى ثانوي (جذع مشترك)',
    description_en: 'Initial stage of high school before specialized academic branches.',
    description_ar: 'المرحلة التمهيدية في التعليم الثانوي قبل اختيار الشعبة التخصصية.'
  },
  {
    id: 'third_year_secondary',
    name_en: 'Third Year Secondary (Baccalaureate)',
    name_ar: 'السنة الثالثة ثانوي (البكالوريا)',
    description_en: 'Terminal year preparing for the national Baccalaureate examination.',
    description_ar: 'السنة الختامية المؤهلة لامتحان شهادة البكالوريا والدخول الجامعي.'
  }
];

export const FIRST_YEAR_STUDY_GROUPS: TaxonomyOption[] = [
  {
    id: 'science_and_technology',
    name_en: 'Common Core Science and Technology',
    name_ar: 'جذع مشترك علوم وتكنولوجيا',
    description_en: 'Emphasis on mathematics, physics, natural sciences, and technology.',
    description_ar: 'التركيز على الرياضيات، العلوم الفيزيائية، علوم الطبيعة والحياة والتكنولوجيا.'
  },
  {
    id: 'arts_and_humanities',
    name_en: 'Common Core Arts and Humanities',
    name_ar: 'جذع مشترك آداب',
    description_en: 'Emphasis on literature, languages, philosophy, history, and geography.',
    description_ar: 'التركيز على الأدب العربي، اللغات الأجنبية، التاريخ والجغرافيا والعلوم الإنسانية.'
  }
];

export const THIRD_YEAR_BRANCHES: TaxonomyOption[] = [
  {
    id: 'experimental_sciences',
    name_en: 'Experimental Sciences',
    name_ar: 'علوم تجريبية',
    description_en: 'Balanced focus on biology, physics-chemistry, and mathematics.',
    description_ar: 'توازن بين علوم الطبيعة والحياة، الفيزياء والكيمياء، والرياضيات.'
  },
  {
    id: 'mathematics',
    name_en: 'Mathematics',
    name_ar: 'رياضيات',
    description_en: 'Intensive mathematical theory, advanced physics, and rigorous analysis.',
    description_ar: 'التركيز العالي على النظريات الرياضية والفيزياء التحليلية المتقدمة.'
  },
  {
    id: 'mathematical_technique',
    name_en: 'Mathematical Technique (Technical Math)',
    name_ar: 'تقني رياضي',
    description_en: 'Applied mathematics, physics, and technical engineering specialization.',
    description_ar: 'الرياضيات والفيزياء التطبيقية مع مادة التخصص الهندسي التقني.'
  },
  {
    id: 'management_and_economics',
    name_en: 'Management and Economics',
    name_ar: 'تسيير واقتصاد',
    description_en: 'Focus on economics, accounting, financial management, law, and applied math.',
    description_ar: 'الاقتصاد، التسيير المالي والمحاسبي، القانون والرياضيات التطبيقية.'
  },
  {
    id: 'foreign_languages',
    name_en: 'Foreign Languages',
    name_ar: 'لغات أجنبية',
    description_en: 'In-depth study of Arabic, French, English, and a third foreign language.',
    description_ar: 'دراسة معمقة للغة العربية، الفرنسية، الإنجليزية، ولغة أجنبية ثالثة.'
  },
  {
    id: 'literature_and_philosophy',
    name_en: 'Literature and Philosophy',
    name_ar: 'آداب وفلسفة',
    description_en: 'Mastery of Arabic literature, philosophical inquiry, history, and humanities.',
    description_ar: 'التعمق في الأدب العربي، الفكر الفلسفي، التاريخ والجغرافيا.'
  }
];

export const BRANCH_SUBTYPES_TECHNICAL_MATH: TaxonomyOption[] = [
  {
    id: 'mechanical_engineering',
    name_en: 'Mechanical Engineering',
    name_ar: 'هندسة ميكانيكية',
    description_en: 'Mechanics, kinematics, CAD, automated manufacturing, and thermodynamics.',
    description_ar: 'الميكانيك، علم الحركة، التصميم بمساعدة الحاسوب والأنظمة الآلية.'
  },
  {
    id: 'electrical_engineering',
    name_en: 'Electrical Engineering',
    name_ar: 'هندسة كهربائية',
    description_en: 'Electronics, electrical circuitry, microcontrollers, and logic automation.',
    description_ar: 'الدارات الكهربائية، الإلكترونيات، المتحكمات الدقيقة والأنظمة المنطقية.'
  },
  {
    id: 'civil_engineering',
    name_en: 'Civil Engineering',
    name_ar: 'هندسة مدنية',
    description_en: 'Structural analysis, building materials, geodesy, and infrastructure.',
    description_ar: 'مقاومة المواد، التصميم الإنشائي، الطبوغرافيا ومشاريع البناء.'
  },
  {
    id: 'process_engineering',
    name_en: 'Process Engineering (Chemical)',
    name_ar: 'هندسة الطرائق',
    description_en: 'Industrial chemical processes, material transformation, and analytical chemistry.',
    description_ar: 'الكيمياء الصناعية، تحويل المواد والعمليات المخبرية.'
  }
];

export interface SubjectOption extends TaxonomyOption {
  coefficient_typical?: number;
}

export const ALL_SUBJECTS: SubjectOption[] = [
  { id: 'mathematics', name_en: 'Mathematics', name_ar: 'الرياضيات' },
  { id: 'physics_chemistry', name_en: 'Physics & Chemistry', name_ar: 'الفيزياء والكيمياء' },
  { id: 'natural_sciences', name_en: 'Natural & Life Sciences', name_ar: 'علوم الطبيعة والحياة' },
  { id: 'arabic_language', name_en: 'Arabic Literature', name_ar: 'اللغة العربية وآدابها' },
  { id: 'french_language', name_en: 'French Language', name_ar: 'اللغة الفرنسية' },
  { id: 'english_language', name_en: 'English Language', name_ar: 'اللغة الإنجليزية' },
  { id: 'history_geography', name_en: 'History & Geography', name_ar: 'التاريخ والجغرافيا' },
  { id: 'philosophy', name_en: 'Philosophy', name_ar: 'الفلسفة' },
  { id: 'islamic_education', name_en: 'Islamic Studies', name_ar: 'العلوم الإسلامية' },
  { id: 'technology', name_en: 'Technology', name_ar: 'التكنولوجيا' },
  { id: 'economics_management', name_en: 'Economics & Management', name_ar: 'الاقتصاد والتسيير' },
  { id: 'accounting_finance', name_en: 'Accounting & Financial Management', name_ar: 'التسيير المحاسبي والمالي' },
  { id: 'law', name_en: 'Law', name_ar: 'القانون' },
  { id: 'third_foreign_language', name_en: 'Third Foreign Language (German/Spanish/Italian)', name_ar: 'اللغة الأجنبية الثالثة' },
  { id: 'engineering_specialty', name_en: 'Technical Engineering Specialty', name_ar: 'تكنولوجيا الهندسة التطبيقية' }
];

export function getSubjectsForStage(stageId: string, branchId?: string, studyGroupId?: string): SubjectOption[] {
  if (stageId === 'first_year_secondary') {
    if (studyGroupId === 'arts_and_humanities') {
      return ALL_SUBJECTS.filter(s =>
        ['arabic_language', 'french_language', 'english_language', 'history_geography', 'mathematics', 'natural_sciences', 'islamic_education'].includes(s.id)
      );
    }
    // Science & Tech default
    return ALL_SUBJECTS.filter(s =>
      ['mathematics', 'physics_chemistry', 'natural_sciences', 'arabic_language', 'french_language', 'english_language', 'technology', 'history_geography', 'islamic_education'].includes(s.id)
    );
  }

  // 3rd year branches
  switch (branchId) {
    case 'mathematics':
      return ALL_SUBJECTS.filter(s =>
        ['mathematics', 'physics_chemistry', 'natural_sciences', 'arabic_language', 'french_language', 'english_language', 'philosophy', 'history_geography', 'islamic_education'].includes(s.id)
      );
    case 'experimental_sciences':
      return ALL_SUBJECTS.filter(s =>
        ['natural_sciences', 'physics_chemistry', 'mathematics', 'arabic_language', 'french_language', 'english_language', 'philosophy', 'history_geography', 'islamic_education'].includes(s.id)
      );
    case 'mathematical_technique':
      return ALL_SUBJECTS.filter(s =>
        ['engineering_specialty', 'mathematics', 'physics_chemistry', 'arabic_language', 'french_language', 'english_language', 'philosophy', 'history_geography', 'islamic_education'].includes(s.id)
      );
    case 'management_and_economics':
      return ALL_SUBJECTS.filter(s =>
        ['accounting_finance', 'economics_management', 'mathematics', 'law', 'history_geography', 'arabic_language', 'french_language', 'english_language', 'philosophy', 'islamic_education'].includes(s.id)
      );
    case 'foreign_languages':
      return ALL_SUBJECTS.filter(s =>
        ['french_language', 'english_language', 'third_foreign_language', 'arabic_language', 'philosophy', 'history_geography', 'mathematics', 'islamic_education'].includes(s.id)
      );
    case 'literature_and_philosophy':
      return ALL_SUBJECTS.filter(s =>
        ['philosophy', 'arabic_language', 'history_geography', 'french_language', 'english_language', 'mathematics', 'islamic_education'].includes(s.id)
      );
    default:
      return ALL_SUBJECTS.filter(s =>
        ['mathematics', 'physics_chemistry', 'natural_sciences', 'arabic_language', 'french_language', 'english_language', 'philosophy'].includes(s.id)
      );
  }
}

export const INTEREST_FIELDS: TaxonomyOption[] = [
  {
    id: 'computer_science_ai',
    name_en: 'Computer Science, Software & AI',
    name_ar: 'علوم الحاسوب، البرمجيات والذكاء الاصطناعي',
    description_en: 'Algorithms, cybersecurity, application development, and intelligent systems.',
    description_ar: 'الخوارزميات، الأمن السيبراني، تطوير البرمجيات والأنظمة الذكية.'
  },
  {
    id: 'engineering_robotics',
    name_en: 'Engineering, Hardware & Robotics',
    name_ar: 'الهندسة، الأنظمة المادية والروبوتات',
    description_en: 'Mechanical, electrical, civil systems, automation, and aerospace.',
    description_ar: 'الأنظمة الميكانيكية والكهربائية، البنية التحتية، الأتمتة وصناعة الطيران.'
  },
  {
    id: 'medicine_health',
    name_en: 'Medicine, Dentistry & Health Sciences',
    name_ar: 'الطب، جراحة الأسنان والعلوم الصحية',
    description_en: 'Clinical care, human physiology, pharmacology, and medical research.',
    description_ar: 'الرعاية الطبية السريرية، وظائف الأعضاء، علم الصيدلة والأبحاث المخبرية.'
  },
  {
    id: 'natural_sciences_bio',
    name_en: 'Biology, Biotechnology & Ecology',
    name_ar: 'البيولوجيا، التكنولوجيا الحيوية والبيئة',
    description_en: 'Genetics, microbiology, ecosystems, agriculture, and life sciences.',
    description_ar: 'علم الوراثة، الأحياء الدقيقة، الأنظمة البيئية والعلوم الزراعية.'
  },
  {
    id: 'architecture_urban',
    name_en: 'Architecture, Urban Planning & Design',
    name_ar: 'الهندسة المعمارية، التصميم الحضري والعمران',
    description_en: 'Building aesthetics, spatial planning, sustainable cities, and interior structure.',
    description_ar: 'التصميم المعماري، تخطيط المدن، الاستدامة الحضرية وتصميم المساحات.'
  },
  {
    id: 'business_finance',
    name_en: 'Business, Economics & Finance',
    name_ar: 'إدارة الأعمال، الاقتصاد والمالية',
    description_en: 'Corporate management, international trade, investment, marketing, and data analytics.',
    description_ar: 'الإدارة الاستراتيجية، التجارة الدولية، المحاسبة، التحليل المالي والتسويق.'
  },
  {
    id: 'law_governance',
    name_en: 'Law, Political Science & International Relations',
    name_ar: 'الحقوق، العلوم السياسية والعلاقات الدولية',
    description_en: 'Judicial systems, international diplomacy, human rights, and public administration.',
    description_ar: 'النظم القضائية، الدبلوماسية الدولية، حقوق الإنسان وإدارة السياسات العامة.'
  },
  {
    id: 'languages_translation',
    name_en: 'Languages, Translation & Linguistics',
    name_ar: 'اللغات، الترجمة وعلم اللسانيات',
    description_en: 'Cross-cultural translation, literature, multilingual communication, and linguistic analysis.',
    description_ar: 'الترجمة الفورية والكتابية، اللغات المقارنة، والاتصال متعدد الثقافات.'
  },
  {
    id: 'media_communication',
    name_en: 'Media, Journalism & Digital Content',
    name_ar: 'الإعلام، الصحافة وصناعة المحتوى الرقمي',
    description_en: 'Investigative reporting, digital media production, audiovisual communication, and PR.',
    description_ar: 'الصحافة الاستقصائية، الإنتاج السمعي البصري، والعلاقات العامة.'
  },
  {
    id: 'education_pedagogy',
    name_en: 'Education, Pedagogy & Academic Teaching',
    name_ar: 'التعليم، علوم التربية والتدريس الأكاديمي',
    description_en: 'Pedagogical psychology, curriculum design, school leadership, and educational research.',
    description_ar: 'علم النفس التربوي، إعداد المناهج، التدريس وإدارة المؤسسات التعليمية.'
  }
];

export const TOPICS_BY_FIELD: Record<string, TaxonomyOption[]> = {
  computer_science_ai: [
    { id: 'topic_web_mobile_dev', name_en: 'Web & Mobile Development', name_ar: 'تطوير تطبيقات الويب والهواتف' },
    { id: 'topic_cybersecurity', name_en: 'Cybersecurity & Network Defense', name_ar: 'الأمن السيبراني وحماية الشبكات' },
    { id: 'topic_artificial_intelligence', name_en: 'Artificial Intelligence & Machine Learning', name_ar: 'الذكاء الاصطناعي وتعلم الآلة' },
    { id: 'topic_game_dev', name_en: 'Video Game Development & 3D', name_ar: 'تطوير ألعاب الفيديو والبيئات ثلاثية الأبعاد' },
    { id: 'topic_data_science', name_en: 'Big Data & Analytics', name_ar: 'علم البيانات والتحليلات الضخمة' }
  ],
  engineering_robotics: [
    { id: 'topic_robotics_automation', name_en: 'Robotics & Industrial Automation', name_ar: 'الروبوتات والأتمتة الصناعية' },
    { id: 'topic_renewable_energy', name_en: 'Solar & Renewable Energy Systems', name_ar: 'الطاقات المتجددة والأنظمة الكهروضوئية' },
    { id: 'topic_aerospace_mechanics', name_en: 'Aerospace & Automotive Engineering', name_ar: 'هندسة الطيران والميكانيك المتقدمة' },
    { id: 'topic_smart_electronics', name_en: 'Embedded Systems & Smart Circuits', name_ar: 'الأنظمة المدمجة والإلكترونيات الذكية' },
    { id: 'topic_infrastructure_bridges', name_en: 'Civil Structures & Mega-Projects', name_ar: 'المنشآت الكبرى والبنية التحتية' }
  ],
  medicine_health: [
    { id: 'topic_clinical_medicine', name_en: 'General Medicine & Surgery', name_ar: 'الطب البشري والجراحة العامة' },
    { id: 'topic_dentistry', name_en: 'Dental Surgery & Orthodontics', name_ar: 'طب وجراحة الأسنان وتقويمها' },
    { id: 'topic_pharmacy_drug_design', name_en: 'Pharmacy & Drug Formulation', name_ar: 'الصيدلة وصناعة الأدوية' },
    { id: 'topic_medical_imaging', name_en: 'Biomedical Technology & Radiology', name_ar: 'التصوير الطبي والتقنيات الإشعاعية' },
    { id: 'topic_public_health', name_en: 'Epidemiology & Preventive Health', name_ar: 'الوقاية الوبائية والصحة العامة' }
  ],
  natural_sciences_bio: [
    { id: 'topic_genetics_biotech', name_en: 'Genetics & Molecular Biotechnology', name_ar: 'علم الوراثة والبيوتكنولوجيا الجزيئية' },
    { id: 'topic_environmental_ecology', name_en: 'Ecosystems & Biodiversity Conservation', name_ar: 'حماية البيئة والتنوع الحيوي' },
    { id: 'topic_agronomy_food_science', name_en: 'Agronomy & Food Science', name_ar: 'العلوم الفلاحية والصناعات الغذائية' }
  ],
  architecture_urban: [
    { id: 'topic_architectural_design', name_en: 'Architectural Aesthetics & Blueprinting', name_ar: 'التصميم المعماري والمخططات الهندسية' },
    { id: 'topic_smart_cities', name_en: 'Sustainable Urban Planning & Smart Cities', name_ar: 'تخطيط المدن المستدامة والعمران الذكي' },
    { id: 'topic_interior_design', name_en: 'Interior Architecture & Space Ergonomics', name_ar: 'العمارة الداخلية وهندسة المساحات' }
  ],
  business_finance: [
    { id: 'topic_entrepreneurship_startups', name_en: 'Startups & Business Innovation', name_ar: 'ريادة الأعمال والشركات الناشئة' },
    { id: 'topic_financial_markets', name_en: 'Financial Markets, Banking & Investment', name_ar: 'الأسواق المالية، البنوك والاستثمار' },
    { id: 'topic_digital_marketing', name_en: 'Digital Marketing & Brand Strategy', name_ar: 'التسويق الرقمي واستراتيجيات العلامات التجارية' },
    { id: 'topic_international_logistics', name_en: 'Supply Chain & International Trade', name_ar: 'سلاسل الإمداد والتجارة الدولية' }
  ],
  law_governance: [
    { id: 'topic_international_law', name_en: 'International Law & Diplomatic Relations', name_ar: 'القانون الدولي والعلاقات الدبلوماسية' },
    { id: 'topic_constitutional_rights', name_en: 'Constitutional Law & Human Rights', name_ar: 'القانون الدستوري والعدالة وحقوق الإنسان' },
    { id: 'topic_business_corporate_law', name_en: 'Corporate Law & Intellectual Property', name_ar: 'قانون الأعمال والملكية الفكرية' }
  ],
  languages_translation: [
    { id: 'topic_simultaneous_translation', name_en: 'Simultaneous Conference Translation', name_ar: 'الترجمة الفورية والمؤتمرات' },
    { id: 'topic_foreign_languages_applied', name_en: 'Applied Foreign Languages for Business', name_ar: 'اللغات الحية المطبقة في التجارة' },
    { id: 'topic_comparative_literature', name_en: 'Comparative World Literature', name_ar: 'الأدب المقارن والدراسات اللغوية' }
  ],
  media_communication: [
    { id: 'topic_digital_journalism', name_en: 'Digital Journalism & Investigative Media', name_ar: 'الصحافة الرقمية والاستقصائية' },
    { id: 'topic_audiovisual_production', name_en: 'Audiovisual Directing & Podcasting', name_ar: 'الإخراج والإنتاج السمعي البصري' },
    { id: 'topic_public_relations', name_en: 'Strategic Communication & Public Relations', name_ar: 'الاتصال المؤسساتي والعلاقات العامة' }
  ],
  education_pedagogy: [
    { id: 'topic_stem_teaching', name_en: 'STEM High School Teaching (ENS)', name_ar: 'تدريس المواد العلمية (المدارس العليا للأساتذة)' },
    { id: 'topic_educational_psychology', name_en: 'Educational Psychology & Guidance', name_ar: 'علم النفس التربوي والإرشاد المدرسي' }
  ]
};

export const ACTIVITIES: TaxonomyOption[] = [
  { id: 'act_solving_logic_puzzles', name_en: 'Solving mathematical logic & puzzles', name_ar: 'حل الألغاز الرياضية والمسائل المنطقية' },
  { id: 'act_coding_software', name_en: 'Coding, scripting or playing with computers', name_ar: 'البرمجة واستكشاف البرمجيات والتقنية' },
  { id: 'act_building_mechanical_projects', name_en: 'Disassembling & assembling mechanical/electronic devices', name_ar: 'تفكيك وتركيب الأجهزة الميكانيكية أو الإلكترونية' },
  { id: 'act_scientific_experiments', name_en: 'Conducting biology or chemistry experiments', name_ar: 'إجراء التجارب العلمية والكيميائية المخبرية' },
  { id: 'act_writing_essays_stories', name_en: 'Writing essays, analytical articles or creative prose', name_ar: 'كتابة المقالات التحليلية أو القصص الأدبية' },
  { id: 'act_debating_public_speaking', name_en: 'Debating ideas, public speaking & persuasion', name_ar: 'المناظرة، الحوار والإقناع في مواضيع فكرية' },
  { id: 'act_team_leadership', name_en: 'Leading teams & organizing school or youth initiatives', name_ar: 'قيادة الفرق وتنظيم المبادرات والأنشطة الجماعية' },
  { id: 'act_helping_counseling_others', name_en: 'Helping, listening to, and caring for people in need', name_ar: 'مساعدة الآخرين والإنصات إليهم وتقديم الرعاية' },
  { id: 'act_creative_artistic_design', name_en: 'Drawing, 3D design, sketch modeling or visual arts', name_ar: 'الرسم، التصميم ثلاثي الأبعاد والفنون البصرية' },
  { id: 'act_analyzing_financial_data', name_en: 'Calculating budgets, trading or analyzing business trends', name_ar: 'حساب الميزانيات ومتابعة الاقتصاد ومشاريع الأعمال' }
];

export const WORK_ENVIRONMENTS: TaxonomyOption[] = [
  { id: 'env_tech_office_remote', name_en: 'Modern tech office or remote digital workspace', name_ar: 'مكتب تقني حديث أو عمل رقمي عن بعد' },
  { id: 'env_scientific_laboratory', name_en: 'Scientific research laboratory or cleanroom', name_ar: 'مخبر أبحاث علمية أو قاعة تجارب متقدمة' },
  { id: 'env_hospital_clinic', name_en: 'Hospital, specialized medical clinic or healthcare center', name_ar: 'مستشفى، عيادة طبية متخصصة أو مركز صحي' },
  { id: 'env_industrial_field', name_en: 'Industrial plant, engineering site or outdoor field projects', name_ar: 'مصنع إنتاجي، ورشات هندسية أو مشاريع ميدانية' },
  { id: 'env_creative_studio', name_en: 'Creative studio, architectural firm or media workshop', name_ar: 'استوديو إبداعي، مكتب هندسة معمارية أو ورشة إعلامية' },
  { id: 'env_court_diplomatic', name_en: 'Courtroom, legal firm, embassy or public ministry', name_ar: 'قاعات المحاكم، مكاتب المحاماة، السفارات أو الوزارات' },
  { id: 'env_academic_classroom', name_en: 'University amphitheater, research institute or high school', name_ar: 'المدرجات الجامعية، معاهد الدراسات العليا أو الثانويات' },
  { id: 'env_corporate_headquarters', name_en: 'Multinational corporate headquarters or financial trading floor', name_ar: 'المقرات الإدارية للشركات الكبرى أو المؤسسات المالية' }
];

export const GOAL_CLARITY_OPTIONS: TaxonomyOption[] = [
  {
    id: 'clear_goal',
    name_en: 'Clear Goal (I know specifically what I want to study or become)',
    name_ar: 'هدف واضح ومحدد (أعرف تحديداً التخصص أو المهنة التي أريدها)',
    description_en: 'You have a specific university major or career destination in mind.',
    description_ar: 'لديك تخصص جامعي أو مهنة محددة وواضحة تركز عليها.'
  },
  {
    id: 'general_direction',
    name_en: 'General Direction (I have fields I like, but exploring options)',
    name_ar: 'توجه عام (أميل إلى مجالات معينة، لكنني أرغب في استكشاف الخيارات)',
    description_en: 'You know your general area of interest, but want guidance on the best majors.',
    description_ar: 'تعرف المجال العام (مثل التكنولوجيا أو الصحة)، لكن تبحث عن أفضل التخصصات المناسبة.'
  },
  {
    id: 'no_defined_goal',
    name_en: 'No Defined Goal (Open to discovering paths that fit my abilities)',
    name_ar: 'ليس لدي هدف محدد بعد (منفتح على اكتشاف المسارات المناسبة لقدراتي)',
    description_en: 'You want recommendations strictly tailored to your strengths and curiosities.',
    description_ar: 'تريد اقتراحات قائمة على تحليل نقاط قوتك المدرسية وميولك الطبيعية دون انحياز مسبق.'
  }
];

export const MOTIVATIONS: TaxonomyOption[] = [
  { id: 'mot_passion_personal_interest', name_en: 'Deep passion and natural fascination for the subject', name_ar: 'الشغف الحقيقي والاهتمام الفطري بالمجال' },
  { id: 'mot_intellectual_curiosity', name_en: 'Desire to solve complex intellectual challenges', name_ar: 'الرغبة في مواجهة التحديات الفكرية وحل المشكلات المعقدة' },
  { id: 'mot_high_employment_rate', name_en: 'Strong labor market demand and guaranteed employment', name_ar: 'الطلب المرتفع في سوق العمل وفرص التوظيف المتاحة' },
  { id: 'mot_financial_prosperity', name_en: 'High financial reward and economic independence', name_ar: 'المردود المادي العالي وتحقيق الاستقرار المالي' },
  { id: 'mot_social_impact_healing', name_en: 'Serving society, curing patients or helping communities', name_ar: 'مساعدة الناس، علاج المرضى، وإحداث أثر اجتماعي إيجابي' },
  { id: 'mot_international_career', name_en: 'Opportunities to work globally or pursue postgraduate study abroad', name_ar: 'فرص العمل دولياً ومتابعة الدراسات العليا في الخارج' },
  { id: 'mot_family_tradition', name_en: 'Family encouragement and noble academic tradition', name_ar: 'تشجيع العائلة والقدوة في هذا المسار الأكاديمي' }
];

export const PRIORITIES: TaxonomyOption[] = [
  { id: 'prio_job_security', name_en: 'Job security & career stability', name_ar: 'الأمان الوظيفي والاستقرار المهني' },
  { id: 'prio_high_income', name_en: 'High earning potential & financial growth', name_ar: 'الدخل المالي المرتفع والنمو الاقتصادي' },
  { id: 'prio_work_life_balance', name_en: 'Work-life balance & healthy schedule', name_ar: 'التوازن بين الحياة المهنية والشخصية' },
  { id: 'prio_intellectual_challenge', name_en: 'Constant intellectual stimulation & innovation', name_ar: 'التحدي الفكري المستمر والابتكار المعرفي' },
  { id: 'prio_creative_freedom', name_en: 'Autonomy, creativity & self-direction', name_ar: 'حرية الابتكار والاستقلالية في اتخاذ القرارات' },
  { id: 'prio_social_contribution', name_en: 'Direct contribution to public good & society', name_ar: 'الأثر الإنساني والمساهمة في خدمة المجتمع' },
  { id: 'prio_international_mobility', name_en: 'Global mobility & overseas opportunities', name_ar: 'الفرص العالمية والقدرة على العمل أو السفر دولياً' },
  { id: 'prio_rapid_promotion', name_en: 'Rapid professional advancement & leadership', name_ar: 'الترقي المهني السريع وبلوغ مناصب القيادة' }
];

export const PROBLEM_TYPES: TaxonomyOption[] = [
  { id: 'prob_practical_troubleshooting', name_en: 'Hands-on troubleshooting of concrete real-world systems', name_ar: 'حل المشكلات التقنية الملموسة وإصلاح الأعطال الميدانية' },
  { id: 'prob_theoretical_modeling', name_en: 'Mathematical formulation and theoretical concept proofs', name_ar: 'النمذجة الرياضية النظرية وإثبات الفرضيات العلمية' },
  { id: 'prob_creative_design', name_en: 'Open-ended creative invention without a single fixed answer', name_ar: 'الابتكار والتصميم الإبداعي الحر دون إجابة واحدة محددة' },
  { id: 'prob_data_analytical', name_en: 'Rigorous quantitative data analysis and statistical deduction', name_ar: 'تحليل البيانات الكمية بدقة واستخراج النتائج الإحصائية' },
  { id: 'prob_human_conflict_resolution', name_en: 'Interpersonal mediation, counseling, and human understanding', name_ar: 'فهم السلوك الإنساني وحل النزاعات وتقديم الإرشاد' }
];
