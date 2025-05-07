const admin = require('firebase-admin'); // Required for Timestamp and FieldValue
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
const sessionsCollection = db.collection('sessions');

// Helper function to map session data and convert timestamps
const mapSessionDataWithId = (doc) => {
  const data = doc.data();
  const result = { id: doc.id, ...data };

  // Ensure sessionId is present and matches id
  if (!result.sessionId || result.sessionId !== doc.id) {
    result.sessionId = doc.id;
  }

  if (result.startedAt && typeof result.startedAt.toDate === 'function') {
    result.startedAt = result.startedAt.toDate().toISOString();
  }
  if (result.endedAt && typeof result.endedAt.toDate === 'function') {
    result.endedAt = result.endedAt.toDate().toISOString();
  }

  // Ensure items array is present
  if (!result.items) {
    result.items = [];
  }

  return result;
};

// Get all sessions with optional pagination and status filtering
exports.getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status: statusFilter } = req.query;
    let query = sessionsCollection;

    if (statusFilter) {
      query = query.where('status', '==', statusFilter);
    }

    // Firestore pagination is typically done with startAfter/endBefore,
    // but for simplicity, matching original logic of in-memory pagination after full fetch.
    // Consider server-side cursor-based pagination for large datasets.
    const snapshot = await query.get();
    let allSessions = snapshot.docs.map(doc => mapSessionDataWithId(doc));

    const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const endIndex = startIndex + parseInt(limit, 10);
    const paginatedSessions = allSessions.slice(startIndex, endIndex);

    res.json({
      total: allSessions.length,
      sessions: paginatedSessions,
    });
  } catch (error) {
    console.error('Error in getSessions:', error);
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

// Get a single session by ID
exports.getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionDocRef = sessionsCollection.doc(id);
    const session = await sessionDocRef.get();

    if (!session.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const sessionData = mapSessionDataWithId(session);

    // Fetch item details from the items collection
    if (sessionData.items && sessionData.items.length > 0) {
      const itemPromises = sessionData.items.map(async (item) => {
        try {
          const itemDoc = await db.collection('items').doc(item.itemId).get(); // Use itemId as the document ID
          if (itemDoc.exists) {
            const itemData = itemDoc.data();
            return {
              barcode: item.itemId, // Treat itemId as the barcode
              name: itemData.name || 'N/A', // Fetch the item name
              quantity: item.quantity || 0,
              unitPrice: itemData.unitPrice || 0.0, // Fetch the unit price
              totalPrice: ((item.quantity || 0) * (itemData.unitPrice || 0.0)).toFixed(2), // Calculate total price
            };
          }
          return {
            barcode: item.itemId, // Treat itemId as the barcode
            name: 'N/A',
            quantity: item.quantity || 0,
            unitPrice: 0.0,
            totalPrice: 0.0,
          };
        } catch (error) {
          console.error(`Error fetching item with ID ${item.itemId}:`, error);
          return {
            barcode: item.itemId, // Treat itemId as the barcode
            name: 'Error',
            quantity: item.quantity || 0,
            unitPrice: 0.0,
            totalPrice: 0.0,
          };
        }
      });

      sessionData.items = await Promise.all(itemPromises);
    }

    res.json(sessionData);
  } catch (error) {
    console.error('Error in getSession:', error);
    res.status(500).json({ message: 'Error fetching session', error: error.message });
  }
};

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const sessionData = req.body;
    const sessionRef = sessionsCollection.doc(); // Auto-generate ID

    const newSessionObject = {
      ...sessionData,
      sessionId: sessionRef.id, // Ensure sessionId is the document ID
    };

    // Convert date strings from req.body to Timestamps before saving
    if (sessionData.startedAt && typeof sessionData.startedAt === 'string') {
      newSessionObject.startedAt = admin.firestore.Timestamp.fromDate(new Date(sessionData.startedAt));
    } else if (!sessionData.startedAt) {
      newSessionObject.startedAt = admin.firestore.FieldValue.serverTimestamp(); // Default if not provided
    }

    if (sessionData.endedAt && typeof sessionData.endedAt === 'string') {
      newSessionObject.endedAt = admin.firestore.Timestamp.fromDate(new Date(sessionData.endedAt));
    } else if (sessionData.hasOwnProperty('endedAt') && sessionData.endedAt === null) {
      newSessionObject.endedAt = null;
    } else if (!sessionData.hasOwnProperty('endedAt')) {
      newSessionObject.endedAt = null; // Default to null if not specified
    }


    await sessionRef.set(newSessionObject);
    const createdDoc = await sessionRef.get();
    res.status(201).json(mapSessionDataWithId(createdDoc));
  } catch (error) {
    console.error('Error in createSession:', error);
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

// Update an existing session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionDocRef = sessionsCollection.doc(id);
    const sessionSnapshot = await sessionDocRef.get();

    if (!sessionSnapshot.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const sessionDataToUpdate = { ...req.body };

    // Convert date strings from req.body to Timestamps before saving
    if (sessionDataToUpdate.startedAt && typeof sessionDataToUpdate.startedAt === 'string') {
      sessionDataToUpdate.startedAt = admin.firestore.Timestamp.fromDate(new Date(sessionDataToUpdate.startedAt));
    }
    
    if (sessionDataToUpdate.hasOwnProperty('endedAt')) {
      if (sessionDataToUpdate.endedAt === null) {
        sessionDataToUpdate.endedAt = null;
      } else if (typeof sessionDataToUpdate.endedAt === 'string') {
        sessionDataToUpdate.endedAt = admin.firestore.Timestamp.fromDate(new Date(sessionDataToUpdate.endedAt));
      }
    }

    await sessionDocRef.update(sessionDataToUpdate);
    const updatedSessionDoc = await sessionDocRef.get();
    res.json(mapSessionDataWithId(updatedSessionDoc));
  } catch (error) {
    console.error('Error in updateSession:', error);
    res.status(500).json({ message: 'Error updating session', error: error.message });
  }
};

// Delete a session by ID
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionDocRef = sessionsCollection.doc(id);
    const session = await sessionDocRef.get();

    if (!session.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await sessionDocRef.delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteSession:', error);
    res.status(500).json({ message: 'Error deleting session', error: error.message });
  }
};