require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const classesData = [
  { name: 'Playgroup', description: 'Early childhood education, focus on socialization and play.', color_hex: 'f472b6', academic_level: 'preSchool' },
  { name: 'Nursery', description: 'Basic alphabet, numbers, and rhymes.', color_hex: 'a78bfa', academic_level: 'preSchool' },
  { name: 'Prep', description: 'Preparation for primary school, beginner reading.', color_hex: '60a5fa', academic_level: 'preSchool' },
  { name: 'Class 1', description: 'Primary education grade 1.', color_hex: '34d399', academic_level: 'primary' },
  { name: 'Class 2', description: 'Primary education grade 2.', color_hex: 'fbbf24', academic_level: 'primary' },
  { name: 'Class 3', description: 'Primary education grade 3.', color_hex: 'f87171', academic_level: 'primary' },
  { name: 'Class 4', description: 'Primary education grade 4.', color_hex: '818cf8', academic_level: 'primary' },
  { name: 'Class 5', description: 'Primary education grade 5.', color_hex: 'c084fc', academic_level: 'primary' },
  { name: 'Class 6', description: 'Middle school grade 6.', color_hex: '2dd4bf', academic_level: 'middle' },
  { name: 'Class 7', description: 'Middle school grade 7.', color_hex: 'facc15', academic_level: 'middle' },
  { name: 'Class 8', description: 'Middle school grade 8.', color_hex: 'fb923c', academic_level: 'middle' },
  { name: 'Class 9 (Matric)', description: 'Secondary education grade 9.', color_hex: 'ef4444', academic_level: 'high' },
  { name: 'Class 10 (Matric)', description: 'Secondary education grade 10.', color_hex: '3b82f6', academic_level: 'high' },
  { name: 'Class 11 (Intermediate)', description: 'Higher Secondary grade 11.', color_hex: '10b981', academic_level: 'higherSecondary' },
  { name: 'Class 12 (Intermediate)', description: 'Higher Secondary grade 12.', color_hex: '6366f1', academic_level: 'higherSecondary' },
  { name: "Bachelor's (BS)", description: "Undergraduate university degree.", color_hex: 'ec4899', academic_level: 'university' },
  { name: "Master's (MS/MPhil)", description: "Postgraduate university degree.", color_hex: '8b5cf6', academic_level: 'university' }
];

const videos = [
  'https://res.cloudinary.com/demo/video/upload/dog.mp4',
  'https://res.cloudinary.com/demo/video/upload/elephants.mp4',
  'https://res.cloudinary.com/demo/video/upload/kitten-playing.mp4',
  'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4',
  'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4'
];

const generateSubjects = (className, academic_level) => {
  if (academic_level === 'preSchool') {
    return [
      { name: 'English', short_description: 'Basic Alphabets', icon_name: 'book-open' },
      { name: 'General Knowledge', short_description: 'Colors and Animals', icon_name: 'globe' }
    ];
  } else if (academic_level === 'primary') {
    return [
      { name: 'Mathematics', short_description: 'Basic Arithmetic', icon_name: 'calculator' },
      { name: 'Science', short_description: 'Basic Science', icon_name: 'flask-conical' }
    ];
  } else if (academic_level === 'middle') {
    return [
      { name: 'Mathematics', short_description: 'Algebra & Geometry', icon_name: 'calculator' },
      { name: 'Science', short_description: 'Physics, Chemistry, Biology basics', icon_name: 'microscope' }
    ];
  } else if (academic_level === 'high') {
    return [
      { name: 'Physics', short_description: 'Mechanics & Thermodynamics', icon_name: 'zap' },
      { name: 'Chemistry', short_description: 'Chemical Reactions', icon_name: 'flame' }
    ];
  } else if (academic_level === 'higherSecondary') {
    return [
      { name: 'Physics', short_description: 'Advanced Physics', icon_name: 'zap' },
      { name: 'Computer Science', short_description: 'Programming & Logic', icon_name: 'monitor' }
    ];
  } else {
    // University
    return [
      { name: 'Data Structures', short_description: 'Computer Science core', icon_name: 'database' },
      { name: 'Software Engineering', short_description: 'SDLC and Practices', icon_name: 'code' }
    ];
  }
};

const runSeed = async () => {
  console.log("Starting seeding...");

  console.log("wiping existing data...");
  await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('chapters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('subjects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('academic_classes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  for (let c of classesData) {
    console.log(`Inserting class: ${c.name}`);
    const { data: classData, error: classError } = await supabase
      .from('academic_classes')
      .insert({
        name: c.name,
        description: c.description,
        color_hex: c.color_hex,
        academic_level: c.academic_level
      })
      .select('id')
      .single();

    if (classError) {
      console.error(`Error inserting class ${c.name}:`, classError);
      continue;
    }

    const classId = classData.id;
    const subjects = generateSubjects(c.name, c.academic_level);

    for (let s of subjects) {
      console.log(`  Inserting subject: ${s.name}`);
      const { data: subData, error: subError } = await supabase
        .from('subjects')
        .insert({
          class_id: classId,
          name: s.name,
          short_description: s.short_description,
          icon_name: s.icon_name
        })
        .select('id')
        .single();
      
      if (subError) continue;
      
      const subId = subData.id;

      // Create 2 chapters per subject
      for (let chIdx = 1; chIdx <= 2; chIdx++) {
        const chapterTitle = `Chapter ${chIdx} - ${s.name} Basics`;
        console.log(`    Inserting chapter: ${chapterTitle}`);
        const { data: chData, error: chError } = await supabase
          .from('chapters')
          .insert({
            subject_id: subId,
            title: chapterTitle,
            description: `This is a demo chapter ${chIdx} for ${s.name}.`,
            order_index: chIdx
          })
          .select('id')
          .single();

        if (chError) continue;
        const chId = chData.id;

        // Create 5 lessons per chapter
        for (let lIdx = 1; lIdx <= 5; lIdx++) {
          const lessonTitle = `Lesson ${lIdx}: Intro to ${s.name} part ${lIdx}`;
          console.log(`      Inserting lesson: ${lessonTitle}`);
          await supabase
            .from('lessons')
            .insert({
              chapter_id: chId,
              subject_id: subId,
              title: lessonTitle,
              subtitle: `Demo subtitle ${lIdx}`,
              chapter_title: chapterTitle,
              lesson_number: lIdx,
              total_lessons_in_chapter: 5,
              video_url: videos[(lIdx - 1) % videos.length],
              thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=640&auto=format&fit=crop',
              transcript: `This is a demo transcript for ${lessonTitle}. It has a bit of text for testing purposes.`,
              key_points: ['Point 1 demo', 'Point 2 demo'],
              formulas: ['A = B + C'],
              duration_seconds: 180 + lIdx * 10,
              teacher_name: 'Demo Teacher'
            });
        }
      }
    }
  }

  console.log("Seeding complete!");
};

runSeed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
