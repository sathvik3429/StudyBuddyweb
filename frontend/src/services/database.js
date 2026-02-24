import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Database service for user-specific data operations
class DatabaseService {
  constructor() {
    this.db = db;
    console.log('Database service initialized with Firestore:', db);
  }

  // Get user document reference
  getUserDoc(userId) {
    if (!userId) {
      console.error('No userId provided to getUserDoc');
      return null;
    }
    return doc(this.db, 'users', userId);
  }

  // Get subcollection reference for user
  getUserCollection(userId, collectionName) {
    if (!userId || !collectionName) {
      console.error('Missing userId or collectionName in getUserCollection');
      return null;
    }
    return collection(this.db, 'users', userId, collectionName);
  }

  // Save user profile to database
  async saveUserProfile(userId, userData) {
    try {
      console.log('Saving user profile for:', userId, userData);
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const userDoc = this.getUserDoc(userId);
      if (!userDoc) {
        throw new Error('Failed to create user document reference');
      }
      
      await setDoc(userDoc, {
        ...userData,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
      console.log('User profile saved successfully');
      return { success: true };
    } catch (error) {
      console.error('Error saving user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const userDoc = this.getUserDoc(userId);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save note for user
  async saveNote(userId, noteData) {
    try {
      console.log('Saving note for user:', userId, noteData);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      if (!noteData || !noteData.title || !noteData.content) {
        throw new Error('Note title and content are required');
      }
      
      const notesCollection = this.getUserCollection(userId, 'notes');
      if (!notesCollection) {
        throw new Error('Failed to create notes collection reference');
      }
      
      // Use addDoc instead of creating doc reference manually
      const docRef = await addDoc(notesCollection, {
        ...noteData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Note saved successfully with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving note:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all notes for user
  async getUserNotes(userId) {
    try {
      const notesCollection = this.getUserCollection(userId, 'notes');
      const q = query(notesCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push(doc.data());
      });
      return { success: true, data: notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update note for user
  async updateNote(userId, noteId, noteData) {
    try {
      const noteDoc = doc(this.db, 'users', userId, 'notes', noteId);
      await updateDoc(noteDoc, {
        ...noteData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete note for user
  async deleteNote(userId, noteId) {
    try {
      const noteDoc = doc(this.db, 'users', userId, 'notes', noteId);
      await deleteDoc(noteDoc);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save course to Firestore
  async saveCourse(userId, courseData) {
    try {
      console.log('Saving course for user:', userId, courseData);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      if (!courseData || !courseData.title) {
        throw new Error('Course title is required');
      }
      
      const coursesCollection = this.getUserCollection(userId, 'courses');
      if (!coursesCollection) {
        throw new Error('Failed to create courses collection reference');
      }
      
      // Use addDoc for better document ID generation
      const docRef = await addDoc(coursesCollection, {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Course saved successfully with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving course:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all courses for user
  async getUserCourses(userId) {
    try {
      const coursesCollection = this.getUserCollection(userId, 'courses');
      const q = query(coursesCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push(doc.data());
      });
      return { success: true, data: courses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update course for user
  async updateCourse(userId, courseId, courseData) {
    try {
      const courseDoc = doc(this.db, 'users', userId, 'courses', courseId);
      await updateDoc(courseDoc, {
        ...courseData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete course for user
  async deleteCourse(userId, courseId) {
    try {
      const courseDoc = doc(this.db, 'users', userId, 'courses', courseId);
      await deleteDoc(courseDoc);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save flashcard for user
  async saveFlashcard(userId, flashcardData) {
    try {
      console.log('Saving flashcard for user:', userId, flashcardData);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      if (!flashcardData || !flashcardData.front || !flashcardData.back) {
        throw new Error('Flashcard front and back are required');
      }
      
      const flashcardsCollection = this.getUserCollection(userId, 'flashcards');
      if (!flashcardsCollection) {
        throw new Error('Failed to create flashcards collection reference');
      }
      
      // Use addDoc for better document ID generation
      const docRef = await addDoc(flashcardsCollection, {
        ...flashcardData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Flashcard saved successfully with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving flashcard:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all flashcards for user
  async getUserFlashcards(userId) {
    try {
      const flashcardsCollection = this.getUserCollection(userId, 'flashcards');
      const q = query(flashcardsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const flashcards = [];
      querySnapshot.forEach((doc) => {
        flashcards.push(doc.data());
      });
      return { success: true, data: flashcards };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update flashcard for user
  async updateFlashcard(userId, flashcardId, flashcardData) {
    try {
      const flashcardDoc = doc(this.db, 'users', userId, 'flashcards', flashcardId);
      await updateDoc(flashcardDoc, {
        ...flashcardData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete flashcard for user
  async deleteFlashcard(userId, flashcardId) {
    try {
      const flashcardDoc = doc(this.db, 'users', userId, 'flashcards', flashcardId);
      await deleteDoc(flashcardDoc);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save study session for user
  async saveStudySession(userId, sessionData) {
    try {
      const sessionsCollection = this.getUserCollection(userId, 'studySessions');
      const sessionDoc = doc(sessionsCollection);
      await setDoc(sessionDoc, {
        ...sessionData,
        id: sessionDoc.id,
        createdAt: serverTimestamp()
      });
      return { success: true, id: sessionDoc.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete all test/dummy data for user (comprehensive cleanup)
  async deleteAllTestData(userId) {
    try {
      console.log('Deleting all test/dummy data for user:', userId);
      let totalDeleted = 0;

      // Delete test notes (multiple patterns)
      const notesCollection = this.getUserCollection(userId, 'notes');
      const notesQuery1 = query(notesCollection, where('title', '==', 'Test Note'));
      const notesQuery2 = query(notesCollection, where('title', '==', 'Test'));
      const notesQuery3 = query(notesCollection, where('title', '==', 'Dummy Note'));
      const notesQuery4 = query(notesCollection, where('content', '==', 'This is a test note to verify database connectivity.'));
      
      const [notesSnapshot1, notesSnapshot2, notesSnapshot3, notesSnapshot4] = await Promise.all([
        getDocs(notesQuery1),
        getDocs(notesQuery2),
        getDocs(notesQuery3),
        getDocs(notesQuery4)
      ]);
      
      const allNoteDocs = [...notesSnapshot1.docs, ...notesSnapshot2.docs, ...notesSnapshot3.docs, ...notesSnapshot4.docs];
      const uniqueNoteIds = [...new Set(allNoteDocs.map(doc => doc.id))];
      
      const noteDeletePromises = [];
      uniqueNoteIds.forEach((docId) => {
        console.log('Deleting test/dummy note:', docId);
        noteDeletePromises.push(deleteDoc(doc(notesCollection, docId)));
        totalDeleted++;
      });
      await Promise.all(noteDeletePromises);

      // Delete test courses (multiple patterns)
      const coursesCollection = this.getUserCollection(userId, 'courses');
      const coursesQuery1 = query(coursesCollection, where('title', '==', 'Test Course'));
      const coursesQuery2 = query(coursesCollection, where('title', '==', 'Test'));
      const coursesQuery3 = query(coursesCollection, where('title', '==', 'Dummy Course'));
      
      const [coursesSnapshot1, coursesSnapshot2, coursesSnapshot3] = await Promise.all([
        getDocs(coursesQuery1),
        getDocs(coursesQuery2),
        getDocs(coursesQuery3)
      ]);
      
      const allCourseDocs = [...coursesSnapshot1.docs, ...coursesSnapshot2.docs, ...coursesSnapshot3.docs];
      const uniqueCourseIds = [...new Set(allCourseDocs.map(doc => doc.id))];
      
      const courseDeletePromises = [];
      uniqueCourseIds.forEach((docId) => {
        console.log('Deleting test/dummy course:', docId);
        courseDeletePromises.push(deleteDoc(doc(coursesCollection, docId)));
        totalDeleted++;
      });
      await Promise.all(courseDeletePromises);

      // Delete test flashcards (multiple patterns)
      const flashcardsCollection = this.getUserCollection(userId, 'flashcards');
      const flashcardsQuery1 = query(flashcardsCollection, where('front', '==', 'Test Question'));
      const flashcardsQuery2 = query(flashcardsCollection, where('front', '==', 'Test'));
      const flashcardsQuery3 = query(flashcardsCollection, where('back', '==', 'Test Answer'));
      const flashcardsQuery4 = query(flashcardsCollection, where('back', '==', 'Test'));
      
      const [flashcardsSnapshot1, flashcardsSnapshot2, flashcardsSnapshot3, flashcardsSnapshot4] = await Promise.all([
        getDocs(flashcardsQuery1),
        getDocs(flashcardsQuery2),
        getDocs(flashcardsQuery3),
        getDocs(flashcardsQuery4)
      ]);
      
      const allFlashcardDocs = [...flashcardsSnapshot1.docs, ...flashcardsSnapshot2.docs, ...flashcardsSnapshot3.docs, ...flashcardsSnapshot4.docs];
      const uniqueFlashcardIds = [...new Set(allFlashcardDocs.map(doc => doc.id))];
      
      const flashcardDeletePromises = [];
      uniqueFlashcardIds.forEach((docId) => {
        console.log('Deleting test/dummy flashcard:', docId);
        flashcardDeletePromises.push(deleteDoc(doc(flashcardsCollection, docId)));
        totalDeleted++;
      });
      await Promise.all(flashcardDeletePromises);

      console.log(`Deleted ${totalDeleted} test/dummy items total`);
      return { success: true, deletedCount: totalDeleted };
    } catch (error) {
      console.error('Error deleting test/dummy data:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const dbService = new DatabaseService();
export default dbService;
