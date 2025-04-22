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

// Handler to fetch extended analytics KPI data: Total Sales, Average Session Value, Conversion Rate, Top Selling Category
exports.getAnalyticsKPIs = async (req, res) => {
  try {
    // Fetch all sessions
    const sessionsSnap = await db.collection('sessions').get();
    const totalSessions = sessionsSnap.size;

    // Completed sessions for sales and average value
    const completedSnap = await db.collection('sessions').where('status', '==', 'completed').get();
    const completedCount = completedSnap.size;

    // Total Sales
    const totalSales = completedSnap.docs.reduce((sum, doc) => sum + (doc.data().totalCost || 0), 0);

    // Average Session Value
    const averageSessionValue = completedCount ? totalSales / completedCount : 0;

    // Conversion Rate: completed sessions / total sessions * 100
    const conversionRate = totalSessions ? (completedCount / totalSessions) * 100 : 0;

    // Top Selling Category: aggregate quantities by item category
    // Build itemId -> category map
    const itemsSnap = await db.collection('items').get();
    const categoryMap = {};
    itemsSnap.docs.forEach(doc => {
      const data = doc.data();
      categoryMap[data.id || data.itemId || doc.id] = data.category;
    });
    // Accumulate sales quantity per category
    const salesByCategory = {};
    completedSnap.docs.forEach(doc => {
      const { items = [] } = doc.data();
      items.forEach(({ itemId, quantity = 0 }) => {
        const cat = categoryMap[itemId] || 'Unknown';
        salesByCategory[cat] = (salesByCategory[cat] || 0) + quantity;
      });
    });
    // Determine top category
    let topSellingCategory = null;
    let maxQty = 0;
    for (const [cat, qty] of Object.entries(salesByCategory)) {
      if (qty > maxQty) {
        maxQty = qty;
        topSellingCategory = cat;
      }
    }

    return res.json({ totalSales, averageSessionValue, conversionRate, topSellingCategory });
  } catch (error) {
    console.error('Error fetching analytics KPI data:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics KPI data' });
  }
};