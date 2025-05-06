const { getFirestore, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } = require('firebase-admin/firestore'); // Removed 'collection' from here
const db = getFirestore();
const sessionsCollection = db.collection('sessions'); // Changed this line

// Get all sessions with optional pagination and status filtering
exports.getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const snapshot = await getDocs(sessionsCollection);
    let sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (status) {
      sessions = sessions.filter(session => session.status === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    res.json({
      total: sessions.length,
      sessions: sessions.slice(startIndex, endIndex),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
};

// Get a single session by ID
exports.getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionDoc = doc(sessionsCollection, id);
    const session = await getDoc(sessionDoc);

    if (!session.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ id: session.id, ...session.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session', error });
  }
};

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const newSession = req.body;
    const docRef = await addDoc(sessionsCollection, newSession);
    res.status(201).json({ id: docRef.id, ...newSession });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error });
  }
};

// Update an existing session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionDoc = doc(sessionsCollection, id);
    const session = await getDoc(sessionDoc);

    if (!session.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await updateDoc(sessionDoc, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error updating session', error });
  }
};

// Delete a session by ID
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionDoc = doc(sessionsCollection, id);
    const session = await getDoc(sessionDoc);

    if (!session.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await deleteDoc(sessionDoc);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session', error });
  }
};