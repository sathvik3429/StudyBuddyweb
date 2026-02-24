import { db, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit } from '../firebase/firebase.config';

class DatabaseService {
  constructor() {
    this.db = db;
  }

  // Get user-specific collection reference
  getUserCollection(userId, collectionName) {
    return collection(this.db, 'users', userId, collectionName);
  }

  // Get user-specific document reference
  getUserDoc(userId, collectionName, docId) {
    return doc(this.db, 'users', userId, collectionName, docId);
  }

  // COURSES OPERATIONS
  async createCourse(userId, courseData) {
    try {
      const courseRef = doc(this.getUserCollection(userId, 'courses'));
      const courseWithId = {
        ...courseData,
        id: courseRef.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(courseRef, courseWithId);
      return courseWithId;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async getUserCourses(userId) {
    try {
      const coursesRef = this.getUserCollection(userId, 'courses');
      const q = query(coursesRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  }

  async updateCourse(userId, courseId, updateData) {
    try {
      const courseRef = this.getUserDoc(userId, 'courses', courseId);
      await updateDoc(courseRef, {
        ...updateData,
        updated_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(userId, courseId) {
    try {
      const courseRef = this.getUserDoc(userId, 'courses', courseId);
      await deleteDoc(courseRef);
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // NOTES OPERATIONS
  async createNote(userId, noteData) {
    try {
      const noteRef = doc(this.getUserCollection(userId, 'notes'));
      const noteWithId = {
        ...noteData,
        id: noteRef.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(noteRef, noteWithId);
      return noteWithId;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async getUserNotes(userId) {
    try {
      const notesRef = this.getUserCollection(userId, 'notes');
      const q = query(notesRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting notes:', error);
      throw error;
    }
  }

  async updateNote(userId, noteId, updateData) {
    try {
      const noteRef = this.getUserDoc(userId, 'notes', noteId);
      await updateDoc(noteRef, {
        ...updateData,
        updated_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(userId, noteId) {
    try {
      const noteRef = this.getUserDoc(userId, 'notes', noteId);
      await deleteDoc(noteRef);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  // FLASHCARDS OPERATIONS
  async createFlashcard(userId, flashcardData) {
    try {
      const flashcardRef = doc(this.getUserCollection(userId, 'flashcards'));
      const flashcardWithId = {
        ...flashcardData,
        id: flashcardRef.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(flashcardRef, flashcardWithId);
      return flashcardWithId;
    } catch (error) {
      console.error('Error creating flashcard:', error);
      throw error;
    }
  }

  async getUserFlashcards(userId) {
    try {
      const flashcardsRef = this.getUserCollection(userId, 'flashcards');
      const q = query(flashcardsRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting flashcards:', error);
      throw error;
    }
  }

  async updateFlashcard(userId, flashcardId, updateData) {
    try {
      const flashcardRef = this.getUserDoc(userId, 'flashcards', flashcardId);
      await updateDoc(flashcardRef, {
        ...updateData,
        updated_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw error;
    }
  }

  async deleteFlashcard(userId, flashcardId) {
    try {
      const flashcardRef = this.getUserDoc(userId, 'flashcards', flashcardId);
      await deleteDoc(flashcardRef);
      return true;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      throw error;
    }
  }

  // STUDY STATS OPERATIONS
  async getStudyStats(userId) {
    try {
      const statsRef = doc(this.db, 'users', userId, 'stats', 'study');
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        return statsDoc.data();
      } else {
        // Create default stats if they don't exist
        const defaultStats = {
          totalStudyTime: 0,
          sessionsCompleted: 0,
          flashcardsReviewed: 0,
          notesStudied: 0,
          streak: 0,
          lastStudyDate: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await setDoc(statsRef, defaultStats);
        return defaultStats;
      }
    } catch (error) {
      console.error('Error getting study stats:', error);
      throw error;
    }
  }

  async updateStudyStats(userId, statsUpdate) {
    try {
      const statsRef = doc(this.db, 'users', userId, 'stats', 'study');
      await updateDoc(statsRef, {
        ...statsUpdate,
        updated_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating study stats:', error);
      throw error;
    }
  }

  // USER PROFILE OPERATIONS
  async createUserProfile(userId, profileData) {
    try {
      const profileRef = doc(this.db, 'users', userId, 'profile', 'info');
      const profileWithTimestamps = {
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(profileRef, profileWithTimestamps);
      return profileWithTimestamps;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const profileRef = doc(this.db, 'users', userId, 'profile', 'info');
      const profileDoc = await getDoc(profileRef);
      return profileDoc.exists() ? profileDoc.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
}

export default new DatabaseService();
