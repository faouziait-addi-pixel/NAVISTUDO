/**
 * NaviStudo — Canonical Taxonomy Definitions
 * Uses canonical snake_case IDs with authoritative Arabic, English & French labels.
 */

export interface TaxonomyOption {
  id: string;
  name_en: string;
  name_ar: string;
  name_fr?: string;
  description_en?: string;
  description_ar?: string;
  description_fr?: string;
  category?: string;
}

export const ACADEMIC_STAGES: TaxonomyOption[] = [
  {
    id: 'first_year_secondary',
    name_en: 'First Year Secondary (Common Core)',
    name_ar: 'السنة الأولى ثانوي (جذع مشترك)',
    name_fr: 'Première Année Secondaire (Tronc Commun)',
    description_en: 'Initial stage of high school before specialized academic branches.',
    description_ar: 'المرحلة التمهيدية في التعليم الثانوي قبل اختيار الشعبة التخصصية.',
    description_fr: 'Cycle initial du secondaire avant l\'orientation vers les filières spécialisées.'
  },
  {
    id: 'third_year_secondary',
    name_en: 'Third Year Secondary (Baccalaureate)',
    name_ar: 'السنة الثالثة ثانوي (البكالوريا)',
    name_fr: 'Troisième Année Secondaire (Baccalauréat)',
    description_en: 'Terminal year preparing for the national Baccalaureate examination.',
    description_ar: 'السنة الختامية المؤهلة لامتحان شهادة البكالوريا والدخول الجامعي.',
    description_fr: 'Année terminale préparatoire à l\'examen national du Baccalauréat et aux études supérieures.'
  }
];

export const FIRST_YEAR_STUDY_GROUPS: TaxonomyOption[] = [
  {
    id: 'science_and_technology',
    name_en: 'Common Core Science and Technology',
    name_ar: 'جذع مشترك علوم وتكنولوجيا',
    name_fr: 'Tronc Commun Sciences et Technologies',
    description_en: 'Emphasis on mathematics, physics, natural sciences, and technology.',
    description_ar: 'التركيز على الرياضيات، العلوم الفيزيائية، علوم الطبيعة والحياة والتكنولوجيا.',
    description_fr: 'Accent sur les mathématiques, les sciences physiques, les sciences de la nature et la technologie.'
  },
  {
    id: 'arts_and_humanities',
    name_en: 'Common Core Arts and Humanities',
    name_ar: 'جذع مشترك آداب',
    name_fr: 'Tronc Commun Lettres et Humanités',
    description_en: 'Emphasis on literature, languages, philosophy, history, and geography.',
    description_ar: 'التركيز على الأدب العربي، اللغات الأجنبية، التاريخ والجغرافيا والعلوم الإنسانية.',
    description_fr: 'Accent sur la littérature, les langues vivantes, l\'histoire-géographie et les sciences humaines.'
  }
];

export const THIRD_YEAR_BRANCHES: TaxonomyOption[] = [
  {
    id: 'experimental_sciences',
    name_en: 'Experimental Sciences',
    name_ar: 'علوم تجريبية',
    name_fr: 'Sciences Expérimentales',
    description_en: 'Balanced focus on biology, physics-chemistry, and mathematics.',
    description_ar: 'توازن بين علوم الطبيعة والحياة، الفيزياء والكيمياء، والرياضيات.',
    description_fr: 'Équilibre entre biologie, sciences physiques et chimiques, et mathématiques.'
  },
  {
    id: 'mathematics',
    name_en: 'Mathematics',
    name_ar: 'رياضيات',
    name_fr: 'Mathématiques',
    description_en: 'Intensive mathematical theory, advanced physics, and rigorous analysis.',
    description_ar: 'التركيز العالي على النظريات الرياضية والفيزياء التحليلية المتقدمة.',
    description_fr: 'Théorie mathématique avancée, physique approfondie et analyse rigoureuse.'
  },
  {
    id: 'mathematical_technique',
    name_en: 'Mathematical Technique (Technical Math)',
    name_ar: 'تقني رياضي',
    name_fr: 'Technique Mathématique',
    description_en: 'Applied mathematics, physics, and technical engineering specialization.',
    description_ar: 'الرياضيات والفيزياء التطبيقية مع مادة التخصص الهندسي التقني.',
    description_fr: 'Mathématiques appliquées, physique et spécialité en sciences de l\'ingénieur.'
  },
  {
    id: 'management_and_economics',
    name_en: 'Management and Economics',
    name_ar: 'تسيير واقتصاد',
    name_fr: 'Gestion et Économie',
    description_en: 'Focus on economics, accounting, financial management, law, and applied math.',
    description_ar: 'الاقتصاد، التسيير المالي والمحاسبي، القانون والرياضيات التطبيقية.',
    description_fr: 'Économie d\'entreprise, gestion comptable et financière, droit et mathématiques appliquées.'
  },
  {
    id: 'foreign_languages',
    name_en: 'Foreign Languages',
    name_ar: 'لغات أجنبية',
    name_fr: 'Langues Étrangères',
    description_en: 'In-depth study of Arabic, French, English, and a third foreign language.',
    description_ar: 'دراسة معمقة للغة العربية، الفرنسية، الإنجليزية، ولغة أجنبية ثالثة.',
    description_fr: 'Étude approfondie de l\'arabe, du français, de l\'anglais et d\'une 3ème langue vivante.'
  },
  {
    id: 'literature_and_philosophy',
    name_en: 'Literature and Philosophy',
    name_ar: 'آداب وفلسفة',
    name_fr: 'Lettres et Philosophie',
    description_en: 'Mastery of Arabic literature, philosophical inquiry, history, and humanities.',
    description_ar: 'التعمق في الأدب العربي، الفكر الفلسفي، التاريخ والجغرافيا.',
    description_fr: 'Maîtrise de la littérature arabe, pensée philosophique, histoire et sciences humaines.'
  }
];

export const BRANCH_SUBTYPES_TECHNICAL_MATH: TaxonomyOption[] = [
  {
    id: 'mechanical_engineering',
    name_en: 'Mechanical Engineering',
    name_ar: 'هندسة ميكانيكية',
    name_fr: 'Génie Mécanique',
    description_en: 'Mechanics, kinematics, CAD, automated manufacturing, and thermodynamics.',
    description_ar: 'الميكانيك، علم الحركة، التصميم بمساعدة الحاسوب والأنظمة الآلية.',
    description_fr: 'Mécanique, cinématique, CAO/DAO, fabrication assistée et thermodynamique.'
  },
  {
    id: 'electrical_engineering',
    name_en: 'Electrical Engineering',
    name_ar: 'هندسة كهربائية',
    name_fr: 'Génie Électrique',
    description_en: 'Electronics, electrical circuitry, microcontrollers, and logic automation.',
    description_ar: 'الدارات الكهربائية، الإلكترونيات، المتحكمات الدقيقة والأنظمة المنطقية.',
    description_fr: 'Électronique, circuits électriques, microcontrôleurs et automatismes logiques.'
  },
  {
    id: 'civil_engineering',
    name_en: 'Civil Engineering',
    name_ar: 'هندسة مدنية',
    name_fr: 'Génie Civil',
    description_en: 'Structural analysis, building materials, geodesy, and infrastructure.',
    description_ar: 'مقاومة المواد، التصميم الإنشائي، الطبوغرافيا ومشاريع البناء.',
    description_fr: 'Résistance des matériaux, calcul de structures, topographie et travaux publics.'
  },
  {
    id: 'process_engineering',
    name_en: 'Process Engineering (Chemical)',
    name_ar: 'هندسة الطرائق',
    name_fr: 'Génie des Procédés',
    description_en: 'Industrial chemical processes, material transformation, and analytical chemistry.',
    description_ar: 'الكيمياء الصناعية، تحويل المواد والعمليات المخبرية.',
    description_fr: 'Procédés chimiques industriels, transformation de la matière et chimie analytique.'
  }
];

export interface SubjectOption extends TaxonomyOption {
  coefficient_typical?: number;
}

export const ALL_SUBJECTS: SubjectOption[] = [
  { id: 'mathematics', name_en: 'Mathematics', name_ar: 'الرياضيات', name_fr: 'Mathématiques' },
  { id: 'physics_chemistry', name_en: 'Physics & Chemistry', name_ar: 'الفيزياء والكيمياء', name_fr: 'Physique-Chimie' },
  { id: 'natural_sciences', name_en: 'Natural & Life Sciences', name_ar: 'علوم الطبيعة والحياة', name_fr: 'Sciences de la Nature et de la Vie' },
  { id: 'arabic_language', name_en: 'Arabic Literature', name_ar: 'اللغة العربية وآدابها', name_fr: 'Langue et Littérature Arabes' },
  { id: 'french_language', name_en: 'French Language', name_ar: 'اللغة الفرنسية', name_fr: 'Langue Française' },
  { id: 'english_language', name_en: 'English Language', name_ar: 'اللغة الإنجليزية', name_fr: 'Langue Anglaise' },
  { id: 'history_geography', name_en: 'History & Geography', name_ar: 'التاريخ والجغرافيا', name_fr: 'Histoire-Géographie' },
  { id: 'philosophy', name_en: 'Philosophy', name_ar: 'الفلسفة', name_fr: 'Philosophie' },
  { id: 'islamic_education', name_en: 'Islamic Studies', name_ar: 'العلوم الإسلامية', name_fr: 'Sciences Islamiques' },
  { id: 'technology', name_en: 'Technology', name_ar: 'التكنولوجيا', name_fr: 'Technologie' },
  { id: 'economics_management', name_en: 'Economics & Management', name_ar: 'الاقتصاد والتسيير', name_fr: 'Économie et Management' },
  { id: 'accounting_finance', name_en: 'Accounting & Financial Management', name_ar: 'التسيير المحاسبي والمالي', name_fr: 'Gestion Comptable et Financière' },
  { id: 'law', name_en: 'Law', name_ar: 'القانون', name_fr: 'Droit' },
  { id: 'third_foreign_language', name_en: 'Third Foreign Language (German/Spanish/Italian)', name_ar: 'اللغة الأجنبية الثالثة', name_fr: '3ème Langue Étrangère (Allemand/Espagnol/Italien)' },
  { id: 'engineering_specialty', name_en: 'Technical Engineering Specialty', name_ar: 'تكنولوجيا الهندسة التطبيقية', name_fr: 'Matière de Spécialité Génie Technique' }
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
    name_fr: 'Informatique, Génie Logiciel & IA',
    description_en: 'Algorithms, cybersecurity, application development, and intelligent systems.',
    description_ar: 'الخوارزميات، الأمن السيبراني، تطوير البرمجيات والأنظمة الذكية.',
    description_fr: 'Algorithmique, cybersécurité, développement logiciel et systèmes intelligents.'
  },
  {
    id: 'engineering_robotics',
    name_en: 'Engineering, Hardware & Robotics',
    name_ar: 'الهندسة، الأنظمة المادية والروبوتات',
    name_fr: 'Sciences de l\'Ingénieur & Robotique',
    description_en: 'Mechanical, electrical, civil systems, automation, and aerospace.',
    description_ar: 'الأنظمة الميكانيكية والكهربائية، البنية التحتية، الأتمتة وصناعة الطيران.',
    description_fr: 'Génie mécanique, électrique, civil, automatique et aéronautique.'
  },
  {
    id: 'medicine_health',
    name_en: 'Medicine, Dentistry & Health Sciences',
    name_ar: 'الطب، جراحة الأسنان والعلوم الصحية',
    name_fr: 'Médecine, Pharmacie & Sciences Médicales',
    description_en: 'Clinical care, human physiology, pharmacology, and medical research.',
    description_ar: 'الرعاية الطبية السريرية، وظائف الأعضاء، علم الصيدلة والأبحاث المخبرية.',
    description_fr: 'Soins cliniques, physiologie humaine, pharmacologie et recherche médicale.'
  },
  {
    id: 'natural_sciences_bio',
    name_en: 'Biology, Biotechnology & Ecology',
    name_ar: 'البيولوجيا، التكنولوجيا الحيوية والبيئة',
    name_fr: 'Biologie, Biotechnologie & Environnement',
    description_en: 'Genetics, microbiology, ecosystems, agriculture, and life sciences.',
    description_ar: 'علم الوراثة، الأحياء الدقيقة، الأنظمة البيئية والعلوم الزراعية.',
    description_fr: 'Génétique, microbiologie, écologie, agronomie et sciences du vivant.'
  },
  {
    id: 'architecture_urban',
    name_en: 'Architecture, Urban Planning & Design',
    name_ar: 'الهندسة المعمارية، التصميم الحضري والعمران',
    name_fr: 'Architecture, Urbanisme & Aménagement',
    description_en: 'Building aesthetics, spatial planning, sustainable cities, and interior structure.',
    description_ar: 'التصميم المعماري، تخطيط المدن، الاستدامة الحضرية وتصميم المساحات.',
    description_fr: 'Conception architecturale, planification urbaine, villes durables et design d\'espace.'
  },
  {
    id: 'business_finance',
    name_en: 'Business, Economics & Finance',
    name_ar: 'إدارة الأعمال، الاقتصاد والمالية',
    name_fr: 'Management, Économie & Finance',
    description_en: 'Corporate management, international trade, investment, marketing, and data analytics.',
    description_ar: 'الإدارة الاستراتيجية، التجارة الدولية، المحاسبة، التحليل المالي والتسويق.',
    description_fr: 'Gestion d\'entreprise, commerce international, banque, finance et analyse de données.'
  },
  {
    id: 'law_governance',
    name_en: 'Law, Political Science & International Relations',
    name_ar: 'الحقوق، العلوم السياسية والعلاقات الدولية',
    name_fr: 'Droit, Sciences Politiques & Diplomatie',
    description_en: 'Judicial systems, international diplomacy, human rights, and public administration.',
    description_ar: 'النظم القضائية، الدبلوماسية الدولية، حقوق الإنسان وإدارة السياسات العامة.',
    description_fr: 'Systèmes juridiques, relations internationales, magistrature et politiques publiques.'
  },
  {
    id: 'languages_translation',
    name_en: 'Languages, Translation & Linguistics',
    name_ar: 'اللغات، الترجمة وعلم اللسانيات',
    name_fr: 'Langues, Traduction & Linguistique',
    description_en: 'Cross-cultural translation, literature, multilingual communication, and linguistic analysis.',
    description_ar: 'الترجمة الفورية والكتابية، اللغات المقارنة، والاتصال متعدد الثقافات.',
    description_fr: 'Traduction simultanée, interprétariat, littérature comparée et communication interculturelle.'
  },
  {
    id: 'media_communication',
    name_en: 'Media, Journalism & Digital Content',
    name_ar: 'الإعلام، الصحافة وصناعة المحتوى الرقمي',
    name_fr: 'Médias, Journalisme & Communication Digitale',
    description_en: 'Investigative reporting, digital media production, audiovisual communication, and PR.',
    description_ar: 'الصحافة الاستقصائية، الإنتاج السمعي البصري، والعلاقات العامة.',
    description_fr: 'Journalisme, production audiovisuelle, communication institutionnelle et médias digitaux.'
  },
  {
    id: 'education_pedagogy',
    name_en: 'Education, Pedagogy & Academic Teaching',
    name_ar: 'التعليم، علوم التربية والتدريس الأكاديمي',
    name_fr: 'Sciences de l\'Éducation & Enseignement Supérieur (ENS)',
    description_en: 'Pedagogical psychology, curriculum design, school leadership, and educational research.',
    description_ar: 'علم النفس التربوي، إعداد المناهج، التدريس وإدارة المؤسسات التعليمية.',
    description_fr: 'Pédagogie, psychologie de l\'apprentissage, didactique et formation d\'enseignants.'
  }
];

export const TOPICS_BY_FIELD: Record<string, TaxonomyOption[]> = {
  computer_science_ai: [
    { id: 'topic_web_mobile_dev', name_en: 'Web & Mobile Development', name_ar: 'تطوير تطبيقات الويب والهواتف', name_fr: 'Développement Web & Mobile' },
    { id: 'topic_cybersecurity', name_en: 'Cybersecurity & Network Defense', name_ar: 'الأمن السيبراني وحماية الشبكات', name_fr: 'Cybersécurité & Défense des Réseaux' },
    { id: 'topic_artificial_intelligence', name_en: 'Artificial Intelligence & Machine Learning', name_ar: 'الذكاء الاصطناعي وتعلم الآلة', name_fr: 'Intelligence Artificielle & Machine Learning' },
    { id: 'topic_game_dev', name_en: 'Video Game Development & 3D', name_ar: 'تطوير ألعاب الفيديو والبيئات ثلاثية الأبعاد', name_fr: 'Développement de Jeux Vidéo & 3D' },
    { id: 'topic_data_science', name_en: 'Big Data & Analytics', name_ar: 'علم البيانات والتحليلات الضخمة', name_fr: 'Science des Données & Big Data' }
  ],
  engineering_robotics: [
    { id: 'topic_robotics_automation', name_en: 'Robotics & Industrial Automation', name_ar: 'الروبوتات والأتمتة الصناعية', name_fr: 'Robotique & Automatisation Industrielle' },
    { id: 'topic_renewable_energy', name_en: 'Solar & Renewable Energy Systems', name_ar: 'الطاقات المتجددة والأنظمة الكهروضوئية', name_fr: 'Énergies Renouvelables & Systèmes Solaires' },
    { id: 'topic_aerospace_mechanics', name_en: 'Aerospace & Automotive Engineering', name_ar: 'هندسة الطيران والميكانيك المتقدمة', name_fr: 'Aéronautique & Ingénierie Automobile' },
    { id: 'topic_smart_electronics', name_en: 'Embedded Systems & Smart Circuits', name_ar: 'الأنظمة المدمجة والإلكترونيات الذكية', name_fr: 'Systèmes Embarqués & Électronique Intelligente' },
    { id: 'topic_infrastructure_bridges', name_en: 'Civil Structures & Mega-Projects', name_ar: 'المنشآت الكبرى والبنية التحتية', name_fr: 'Ouvrages d\'Art & Grandes Infrastructures' }
  ],
  medicine_health: [
    { id: 'topic_clinical_medicine', name_en: 'General Medicine & Surgery', name_ar: 'الطب البشري والجراحة العامة', name_fr: 'Médecine Générale & Chirurgie' },
    { id: 'topic_dentistry', name_en: 'Dental Surgery & Orthodontics', name_ar: 'طب وجراحة الأسنان وتقويمها', name_fr: 'Chirurgie Dentaire & Orthodontie' },
    { id: 'topic_pharmacy_drug_design', name_en: 'Pharmacy & Drug Formulation', name_ar: 'الصيدلة وصناعة الأدوية', name_fr: 'Pharmacie & Industrie du Médicament' },
    { id: 'topic_medical_imaging', name_en: 'Biomedical Technology & Radiology', name_ar: 'التصوير الطبي والتقنيات الإشعاعية', name_fr: 'Imagerie Médicale & Radiologie' },
    { id: 'topic_public_health', name_en: 'Epidemiology & Preventive Health', name_ar: 'الوقاية الوبائية والصحة العامة', name_fr: 'Épidémiologie & Santé Publique' }
  ],
  natural_sciences_bio: [
    { id: 'topic_genetics_biotech', name_en: 'Genetics & Molecular Biotechnology', name_ar: 'علم الوراثة والبيوتكنولوجيا الجزيئية', name_fr: 'Génétique & Biotechnologies Moléculaires' },
    { id: 'topic_environmental_ecology', name_en: 'Ecosystems & Biodiversity Conservation', name_ar: 'حماية البيئة والتنوع الحيوي', name_fr: 'Écosystèmes & Préservation de la Biodiversité' },
    { id: 'topic_agronomy_food_science', name_en: 'Agronomy & Food Science', name_ar: 'العلوم الفلاحية والصناعات الغذائية', name_fr: 'Agronomie & Industries Agroalimentaires' }
  ],
  architecture_urban: [
    { id: 'topic_architectural_design', name_en: 'Architectural Aesthetics & Blueprinting', name_ar: 'التصميم المعماري والمخططات الهندسية', name_fr: 'Conception Architecturale & Plans' },
    { id: 'topic_smart_cities', name_en: 'Sustainable Urban Planning & Smart Cities', name_ar: 'تخطيط المدن المستدامة والعمران الذكي', name_fr: 'Urbanisme Durable & Smart Cities' },
    { id: 'topic_interior_design', name_en: 'Interior Architecture & Space Ergonomics', name_ar: 'العمارة الداخلية وهندسة المساحات', name_fr: 'Architecture d\'Intérieur & Ergonomie' }
  ],
  business_finance: [
    { id: 'topic_entrepreneurship_startups', name_en: 'Startups & Business Innovation', name_ar: 'ريادة الأعمال والشركات الناشئة', name_fr: 'Entrepreneuriat & Startups' },
    { id: 'topic_financial_markets', name_en: 'Financial Markets, Banking & Investment', name_ar: 'الأسواق المالية، البنوك والاستثمار', name_fr: 'Marchés Financiers, Banque & Investissement' },
    { id: 'topic_digital_marketing', name_en: 'Digital Marketing & Brand Strategy', name_ar: 'التسويق الرقمي واستراتيجيات العلامات التجارية', name_fr: 'Marketing Digital & Stratégie de Marque' },
    { id: 'topic_international_logistics', name_en: 'Supply Chain & International Trade', name_ar: 'سلاسل الإمداد والتجارة الدولية', name_fr: 'Supply Chain & Commerce International' }
  ],
  law_governance: [
    { id: 'topic_international_law', name_en: 'International Law & Diplomatic Relations', name_ar: 'القانون الدولي والعلاقات الدبلوماسية', name_fr: 'Droit International & Relations Diplomatiques' },
    { id: 'topic_constitutional_rights', name_en: 'Constitutional Law & Human Rights', name_ar: 'القانون الدستوري والعدالة وحقوق الإنسان', name_fr: 'Droit Constitutionnel & Droits de l\'Homme' },
    { id: 'topic_business_corporate_law', name_en: 'Corporate Law & Intellectual Property', name_ar: 'قانون الأعمال والملكية الفكرية', name_fr: 'Droit des Affaires & Propriété Intellectuelle' }
  ],
  languages_translation: [
    { id: 'topic_simultaneous_translation', name_en: 'Simultaneous Conference Translation', name_ar: 'الترجمة الفورية والمؤتمرات', name_fr: 'Traduction & Interprétariat de Conférence' },
    { id: 'topic_foreign_languages_applied', name_en: 'Applied Foreign Languages for Business', name_ar: 'اللغات الحية المطبقة في التجارة', name_fr: 'Langues Étrangères Appliquées (LEA)' },
    { id: 'topic_comparative_literature', name_en: 'Comparative World Literature', name_ar: 'الأدب المقارن والدراسات اللغوية', name_fr: 'Littérature Comparée & Études Linguistiques' }
  ],
  media_communication: [
    { id: 'topic_digital_journalism', name_en: 'Digital Journalism & Investigative Media', name_ar: 'الصحافة الرقمية والاستقصائية', name_fr: 'Journalisme Numérique & Médias d\'Investigation' },
    { id: 'topic_audiovisual_production', name_en: 'Audiovisual Directing & Podcasting', name_ar: 'الإخراج والإنتاج السمعي البصري', name_fr: 'Réalisation Audiovisuelle & Production de Contenu' },
    { id: 'topic_public_relations', name_en: 'Strategic Communication & Public Relations', name_ar: 'الاتصال المؤسساتي والعلاقات العامة', name_fr: 'Communication Stratégique & Relations Publiques' }
  ],
  education_pedagogy: [
    { id: 'topic_stem_teaching', name_en: 'STEM High School Teaching (ENS)', name_ar: 'تدريس المواد العلمية (المدارس العليا للأساتذة)', name_fr: 'Enseignement Secondaire Scientifique (ENS)' },
    { id: 'topic_educational_psychology', name_en: 'Educational Psychology & Guidance', name_ar: 'علم النفس التربوي والإرشاد المدرسي', name_fr: 'Psychologie de l\'Éducation & Orientation' }
  ]
};

export const ACTIVITIES: TaxonomyOption[] = [
  { id: 'act_solving_logic_puzzles', name_en: 'Solving mathematical logic & puzzles', name_ar: 'حل الألغاز الرياضية والمسائل المنطقية', name_fr: 'Résolution d\'énigmes logiques et casse-têtes mathématiques' },
  { id: 'act_coding_software', name_en: 'Coding, scripting or playing with computers', name_ar: 'البرمجة واستكشاف البرمجيات والتقنية', name_fr: 'Programmation informatique et exploration logicielle' },
  { id: 'act_building_mechanical_projects', name_en: 'Disassembling & assembling mechanical/electronic devices', name_ar: 'تفكيك وتركيب الأجهزة الميكانيكية أو الإلكترونية', name_fr: 'Démontage et montage de dispositifs mécaniques ou électroniques' },
  { id: 'act_scientific_experiments', name_en: 'Conducting biology or chemistry experiments', name_ar: 'إجراء التجارب العلمية والكيميائية المخبرية', name_fr: 'Expérimentations scientifiques de laboratoire (chimie, biologie)' },
  { id: 'act_writing_essays_stories', name_en: 'Writing essays, analytical articles or creative prose', name_ar: 'كتابة المقالات التحليلية أو القصص الأدبية', name_fr: 'Rédaction d\'essais, d\'articles d\'analyse ou de textes littéraires' },
  { id: 'act_debating_public_speaking', name_en: 'Debating ideas, public speaking & persuasion', name_ar: 'المناظرة، الحوار والإقناع في مواضيع فكرية', name_fr: 'Débat d\'idées, prise de parole en public et persuasion' },
  { id: 'act_team_leadership', name_en: 'Leading teams & organizing school or youth initiatives', name_ar: 'قيادة الفرق وتنظيم المبادرات والأنشطة الجماعية', name_fr: 'Leadership d\'équipe et organisation de projets associatifs' },
  { id: 'act_helping_counseling_others', name_en: 'Helping, listening to, and caring for people in need', name_ar: 'مساعدة الآخرين والإنصات إليهم وتقديم الرعاية', name_fr: 'Écoute active, soutien social et aide aux personnes' },
  { id: 'act_creative_artistic_design', name_en: 'Drawing, 3D design, sketch modeling or visual arts', name_ar: 'الرسم، التصميم ثلاثي الأبعاد والفنون البصرية', name_fr: 'Dessin, modélisation 3D, arts visuels et graphisme' },
  { id: 'act_analyzing_financial_data', name_en: 'Calculating budgets, trading or analyzing business trends', name_ar: 'حساب الميزانيات ومتابعة الاقتصاد ومشاريع الأعمال', name_fr: 'Gestion de budgets, analyse de marchés et projets économiques' }
];

export const WORK_ENVIRONMENTS: TaxonomyOption[] = [
  { id: 'env_tech_office_remote', name_en: 'Modern tech office or remote digital workspace', name_ar: 'مكتب تقني حديث أو عمل رقمي عن بعد', name_fr: 'Bureau high-tech moderne ou télétravail digital' },
  { id: 'env_scientific_laboratory', name_en: 'Scientific research laboratory or cleanroom', name_ar: 'مخبر أبحاث علمية أو قاعة تجارب متقدمة', name_fr: 'Laboratoire de recherche scientifique ou salle blanche' },
  { id: 'env_hospital_clinic', name_en: 'Hospital, specialized medical clinic or healthcare center', name_ar: 'مستشفى، عيادة طبية متخصصة أو مركز صحي', name_fr: 'Hôpital universitaire (CHU), clinique ou centre de soins' },
  { id: 'env_industrial_field', name_en: 'Industrial plant, engineering site or outdoor field projects', name_ar: 'مصنع إنتاجي، ورشات هندسية أو مشاريع ميدانية', name_fr: 'Complexe industriel, chantiers d\'ingénierie ou travail de terrain' },
  { id: 'env_creative_studio', name_en: 'Creative studio, architectural firm or media workshop', name_ar: 'استوديو إبداعي، مكتب هندسة معمارية أو ورشة إعلامية', name_fr: 'Atelier de création, cabinet d\'architecture ou studio médias' },
  { id: 'env_court_diplomatic', name_en: 'Courtroom, legal firm, embassy or public ministry', name_ar: 'قاعات المحاكم، مكاتب المحاماة، السفارات أو الوزارات', name_fr: 'Tribunaux, cabinets d\'avocats, ambassades ou ministères' },
  { id: 'env_academic_classroom', name_en: 'University amphitheater, research institute or high school', name_ar: 'المدرجات الجامعية، معاهد الدراسات العليا أو الثانويات', name_fr: 'Amphithéâtres universitaires, instituts de recherche ou lycées' },
  { id: 'env_corporate_headquarters', name_en: 'Multinational corporate headquarters or financial trading floor', name_ar: 'المقرات الإدارية للشركات الكبرى أو المؤسسات المالية', name_fr: 'Siège social d\'entreprise multinationale ou salle de marché' }
];

export const GOAL_CLARITY_OPTIONS: TaxonomyOption[] = [
  {
    id: 'clear_goal',
    name_en: 'Clear Goal (I know specifically what I want to study or become)',
    name_ar: 'هدف واضح ومحدد (أعرف تحديداً التخصص أو المهنة التي أريدها)',
    name_fr: 'Projet clair (Je sais exactement ce que je souhaite étudier ou exercer)',
    description_en: 'You have a specific university major or career destination in mind.',
    description_ar: 'لديك تخصص جامعي أو مهنة محددة وواضحة تركز عليها.',
    description_fr: 'Vous avez déjà en tête une filière universitaire précise ou un métier cible.'
  },
  {
    id: 'general_direction',
    name_en: 'General Direction (I have fields I like, but exploring options)',
    name_ar: 'توجه عام (أميل إلى مجالات معينة، لكنني أرغب في استكشاف الخيارات)',
    name_fr: 'Orientation générale (J\'ai des domaines favoris, mais j\'explore les options)',
    description_en: 'You know your general area of interest, but want guidance on the best majors.',
    description_ar: 'تعرف المجال العام (مثل التكنولوجيا أو الصحة)، لكن تبحث عن أفضل التخصصات المناسبة.',
    description_fr: 'Vous connaissez vos secteurs d\'intérêt, mais cherchez la meilleure filière correspondante.'
  },
  {
    id: 'no_defined_goal',
    name_en: 'No Defined Goal (Open to discovering paths that fit my abilities)',
    name_ar: 'ليس لدي هدف محدد بعد (منفتح على اكتشاف المسارات المناسبة لقدراتي)',
    name_fr: 'Sans objectif défini (Ouvert(e) à découvrir les filières adaptées à mon profil)',
    description_en: 'You want recommendations strictly tailored to your strengths and curiosities.',
    description_ar: 'تريد اقتراحات قائمة على تحليل نقاط قوتك المدرسية وميولك الطبيعية دون انحياز مسبق.',
    description_fr: 'Vous souhaitez des recommandations basées objectivement sur vos aptitudes scolaires et centres d\'intérêt.'
  }
];

export const MOTIVATIONS: TaxonomyOption[] = [
  { id: 'mot_passion_personal_interest', name_en: 'Deep passion and natural fascination for the subject', name_ar: 'الشغف الحقيقي والاهتمام الفطري بالمجال', name_fr: 'Passion profonde et intérêt naturel pour la discipline' },
  { id: 'mot_intellectual_curiosity', name_en: 'Desire to solve complex intellectual challenges', name_ar: 'الرغبة في مواجهة التحديات الفكرية وحل المشكلات المعقدة', name_fr: 'Goût pour les défis intellectuels et la résolution de problèmes' },
  { id: 'mot_high_employment_rate', name_en: 'Strong labor market demand and guaranteed employment', name_ar: 'الطلب المرتفع في سوق العمل وفرص التوظيف المتاحة', name_fr: 'Forte demande sur le marché de l\'emploi et insertion rapide' },
  { id: 'mot_financial_prosperity', name_en: 'High financial reward and economic independence', name_ar: 'المردود المادي العالي وتحقيق الاستقرار المالي', name_fr: 'Rémunération attractive et autonomie financière' },
  { id: 'mot_social_impact_healing', name_en: 'Serving society, curing patients or helping communities', name_ar: 'مساعدة الناس، علاج المرضى، وإحداث أثر اجتماعي إيجابي', name_fr: 'Utilité sociale, soin des patients et engagement citoyen' },
  { id: 'mot_international_career', name_en: 'Opportunities to work globally or pursue postgraduate study abroad', name_ar: 'فرص العمل دولياً ومتابعة الدراسات العليا في الخارج', name_fr: 'Opportunités de carrière internationale ou de mobilité à l\'étranger' },
  { id: 'mot_family_tradition', name_en: 'Family encouragement and noble academic tradition', name_ar: 'تشجيع العائلة والقدوة في هذا المسار الأكاديمي', name_fr: 'Encouragement familial et vocation académique inspirante' }
];

export const PRIORITIES: TaxonomyOption[] = [
  { id: 'prio_job_security', name_en: 'Job security & career stability', name_ar: 'الأمان الوظيفي والاستقرار المهني', name_fr: 'Sécurité de l\'emploi et stabilité' },
  { id: 'prio_high_income', name_en: 'High earning potential & financial growth', name_ar: 'الدخل المالي المرتفع والنمو الاقتصادي', name_fr: 'Potentiel de rémunération élevé' },
  { id: 'prio_work_life_balance', name_en: 'Work-life balance & healthy schedule', name_ar: 'التوازن بين الحياة المهنية والشخصية', name_fr: 'Équilibre vie professionnelle et vie privée' },
  { id: 'prio_intellectual_challenge', name_en: 'Constant intellectual stimulation & innovation', name_ar: 'التحدي الفكري المستمر والابتكار المعرفي', name_fr: 'Stimulation intellectuelle et innovation constante' },
  { id: 'prio_creative_freedom', name_en: 'Autonomy, creativity & self-direction', name_ar: 'حرية الابتكار والاستقلالية في اتخاذ القرارات', name_fr: 'Autonomie, créativité et liberté d\'initiative' },
  { id: 'prio_social_contribution', name_en: 'Direct contribution to public good & society', name_ar: 'الأثر الإنساني والمساهمة في خدمة المجتمع', name_fr: 'Impact social et contribution au bien commun' },
  { id: 'prio_international_mobility', name_en: 'Global mobility & overseas opportunities', name_ar: 'الفرص العالمية والقدرة على العمل أو السفر دولياً', name_fr: 'Mobilité internationale et opportunités globales' },
  { id: 'prio_rapid_promotion', name_en: 'Rapid professional advancement & leadership', name_ar: 'الترقي المهني السريع وبلوغ مناصب القيادة', name_fr: 'Évolution professionnelle rapide et postes de direction' }
];

export const PROBLEM_TYPES: TaxonomyOption[] = [
  { id: 'prob_practical_troubleshooting', name_en: 'Hands-on troubleshooting of concrete real-world systems', name_ar: 'حل المشكلات التقنية الملموسة وإصلاح الأعطال الميدانية', name_fr: 'Résolution pratique de pannes et systèmes techniques concrets' },
  { id: 'prob_theoretical_modeling', name_en: 'Mathematical formulation and theoretical concept proofs', name_ar: 'النمذجة الرياضية النظرية وإثبات الفرضيات العلمية', name_fr: 'Modélisation mathématique et démonstration théorique' },
  { id: 'prob_creative_design', name_en: 'Open-ended creative invention without a single fixed answer', name_ar: 'الابتكار والتصميم الإبداعي الحر دون إجابة واحدة محددة', name_fr: 'Création et conception ouverte sans réponse unique' },
  { id: 'prob_data_analytical', name_en: 'Rigorous quantitative data analysis and statistical deduction', name_ar: 'تحليل البيانات الكمية بدقة واستخراج النتائج الإحصائية', name_fr: 'Analyse quantitative rigoureuse de données et déduction statistique' },
  { id: 'prob_human_conflict_resolution', name_en: 'Interpersonal mediation, counseling, and human understanding', name_ar: 'فهم السلوك الإنساني وحل النزاعات وتقديم الإرشاد', name_fr: 'Médiation relationnelle, conseil et compréhension humaine' }
];
