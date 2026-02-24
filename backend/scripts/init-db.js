const database = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing StudyBuddy database...');
    
    // Initialize database and create tables
    await database.initialize();
    
    console.log('✅ Database initialized successfully!');
    console.log('📁 Database file location:', path.join(__dirname, '..', 'database.sqlite'));
    
    // Insert sample data for testing
    await insertSampleData();
    
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await database.close();
  }
}

async function insertSampleData() {
  const Course = require('../src/models/Course');
  const Note = require('../src/models/Note');
  
  try {
    console.log('📝 Inserting sample data...');
    
    // Sample courses
    const courses = [
      { title: 'Introduction to Computer Science', description: 'Fundamentals of programming and computer science concepts' },
      { title: 'Web Development', description: 'Modern web development with React and Node.js' },
      { title: 'Database Systems', description: 'Relational database design and SQL' }
    ];
    
    const createdCourses = [];
    for (const courseData of courses) {
      const course = await Course.create(courseData);
      createdCourses.push(course);
      console.log(`  ✓ Created course: ${course.title}`);
    }
    
    // Sample notes
    const notes = [
      {
        title: 'Variables and Data Types',
        content: 'In programming, variables are containers for storing data values. Common data types include integers, floating-point numbers, strings, and booleans. Variables must be declared before use and can be assigned values using the assignment operator.',
        course_id: createdCourses[0].id
      },
      {
        title: 'Control Structures',
        content: 'Control structures determine the flow of program execution. The main types are conditional statements (if-else), loops (for, while), and switch statements. These allow programs to make decisions and repeat actions based on conditions.',
        course_id: createdCourses[0].id
      },
      {
        title: 'React Components',
        content: 'React components are the building blocks of React applications. They can be functional or class-based. Components accept inputs called props and return React elements that describe what should appear on screen. Components can manage state and handle events.',
        course_id: createdCourses[1].id
      },
      {
        title: 'State Management',
        content: 'State management in React involves handling data that changes over time. Local state is managed within components using useState hook. For complex applications, external state management libraries like Redux or Context API can be used.',
        course_id: createdCourses[1].id
      },
      {
        title: 'SQL Basics',
        content: 'SQL (Structured Query Language) is used to manage relational databases. Basic commands include SELECT for retrieving data, INSERT for adding data, UPDATE for modifying data, and DELETE for removing data. JOIN operations combine data from multiple tables.',
        course_id: createdCourses[2].id
      }
    ];
    
    for (const noteData of notes) {
      const note = await Note.create(noteData);
      console.log(`  ✓ Created note: ${note.title}`);
    }
    
    console.log('✅ Sample data inserted successfully!');
    
  } catch (error) {
    console.error('❌ Failed to insert sample data:', error.message);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, insertSampleData };
