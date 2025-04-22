const admin = require('firebase-admin');
const db = admin.firestore();

// Handler to fetch KPI data
exports.getDashboardKPIs = async (req, res) => {
  try {
    // Total items
    const itemsSnap = await db.collection('items').get();
    const totalItems = itemsSnap.size;

    // Total carts
    const cartsSnap = await db.collection('carts').get();
    const totalCarts = cartsSnap.size;

    // Active sessions
    const sessionsSnap = await db.collection('sessions').get();
    const activeSessions = sessionsSnap.docs.filter(doc => doc.data().status === 'active').length;

    // Total sales (sum totalCost of completed sessions)
    const completedSessSnap = await db.collection('sessions').where('status', '==', 'completed').get();
    const totalSales = completedSessSnap.docs.reduce((sum, doc) => sum + (doc.data().totalCost || 0), 0);

    return res.json({
      totalItems,
      totalCarts,
      activeSessions,
      totalSales
    });
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    return res.status(500).json({ error: 'Failed to fetch KPI data' });
  }
};