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

// Sales Trend: total sales per day within date range
exports.getSalesTrend = async (req, res) => {
  try {
    const { from, to } = req.query;
    
    // Simplify the query to avoid needing a composite index
    // First get all sessions
    const sessionsSnap = await db.collection('sessions').get();
    
    // Then filter in memory
    const filteredSessions = sessionsSnap.docs
      .map(doc => doc.data())
      .filter(data => {
        return data.status === 'completed' && 
               data.endedAt && 
               data.endedAt.toDate() >= new Date(from) && 
               data.endedAt.toDate() <= new Date(to);
      });
    
    // Process data
    const salesByDate = {};
    filteredSessions.forEach(data => {
      const dateKey = data.endedAt.toDate().toISOString().slice(5,10); // MM-DD
      salesByDate[dateKey] = (salesByDate[dateKey] || 0) + (data.totalCost || 0);
    });
    
    const result = Object.entries(salesByDate).map(([date, sales]) => ({ date, sales }));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching sales trend:', error);
    return res.status(500).json({ error: 'Failed to fetch sales trend' });
  }
};

// Inventory Levels: current stock per category
exports.getInventoryLevels = async (req, res) => {
  try {
    const itemsSnap = await db.collection('items').get();
    const stockByCategory = {};
    itemsSnap.docs.forEach(doc => {
      const { category, stockQuantity = 0 } = doc.data();
      stockByCategory[category] = (stockByCategory[category] || 0) + stockQuantity;
    });
    const result = Object.entries(stockByCategory).map(([category, stock]) => ({ category, stock }));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching inventory levels:', error);
    return res.status(500).json({ error: 'Failed to fetch inventory levels' });
  }
};

// Cart Status Distribution: count of carts by status
exports.getCartStatus = async (req, res) => {
  try {
    const cartsSnap = await db.collection('carts').get();
    const statusCount = {};
    cartsSnap.docs.forEach(doc => {
      const { status } = doc.data();
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    const result = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching cart status distribution:', error);
    return res.status(500).json({ error: 'Failed to fetch cart status distribution' });
  }
};

// Session Status Distribution: count of sessions by status
exports.getSessionStatus = async (req, res) => {
  try {
    const sessionsSnap = await db.collection('sessions').get();
    const statusCount = {};
    sessionsSnap.docs.forEach(doc => {
      const { status } = doc.data();
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    const result = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching session status distribution:', error);
    return res.status(500).json({ error: 'Failed to fetch session status distribution' });
  }
};

// Cart Usage: number of sessions per cart within date range
exports.getCartUsage = async (req, res) => {
  try {
    const { from, to } = req.query;
    
    // Get all sessions and filter in memory to avoid composite index
    const sessionsSnap = await db.collection('sessions').get();
    
    // Filter sessions in date range
    const filteredSessions = sessionsSnap.docs
      .map(doc => doc.data())
      .filter(data => {
        return data.startedAt && 
               data.startedAt.toDate() >= new Date(from) && 
               data.startedAt.toDate() <= new Date(to);
      });
    
    // Calculate usage by cartId
    const usage = {};
    filteredSessions.forEach(data => {
      const { cartId } = data;
      if (cartId) {
        usage[cartId] = (usage[cartId] || 0) + 1;
      }
    });
    
    const result = Object.entries(usage).map(([cart, sessions]) => ({ cart, sessions }));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching cart usage:', error);
    return res.status(500).json({ error: 'Failed to fetch cart usage' });
  }
};

// Average Session Value per day within date range
exports.getAvgSessionValue = async (req, res) => {
  try {
    const { from, to } = req.query;
    
    // Get all sessions and filter in memory
    const sessionsSnap = await db.collection('sessions').get();
    
    // Filter completed sessions in date range
    const filteredSessions = sessionsSnap.docs
      .map(doc => doc.data())
      .filter(data => {
        return data.status === 'completed' && 
               data.endedAt && 
               data.endedAt.toDate() >= new Date(from) && 
               data.endedAt.toDate() <= new Date(to);
      });
    
    // Process data
    const totals = {};
    const counts = {};
    filteredSessions.forEach(data => {
      const dateKey = data.endedAt.toDate().toISOString().slice(5,10);
      totals[dateKey] = (totals[dateKey] || 0) + (data.totalCost || 0);
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });
    
    const result = Object.entries(totals).map(([date, total]) => ({
      date,
      value: counts[date] ? total / counts[date] : 0
    }));
    
    return res.json(result);
  } catch (error) {
    console.error('Error fetching average session value:', error);
    return res.status(500).json({ error: 'Failed to fetch average session value' });
  }
};

// Hourly Session Activity for a specific date
exports.getHourlySessionActivity = async (req, res) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD
    
    // Get all sessions and filter in memory to avoid composite index
    const sessionsSnap = await db.collection('sessions').get();
    
    // Filter sessions for the specific date
    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');
    
    const filteredSessions = sessionsSnap.docs
      .map(doc => doc.data())
      .filter(data => {
        return data.startedAt && 
               data.startedAt.toDate() >= startOfDay && 
               data.startedAt.toDate() <= endOfDay;
      });
    
    // Process hourly activity
    const hourly = {};
    filteredSessions.forEach(data => {
      const hour = data.startedAt.toDate().getHours().toString().padStart(2,'0');
      hourly[hour] = (hourly[hour] || 0) + 1;
    });
    
    const result = Object.entries(hourly).map(([hour, sessions]) => ({ hour, sessions }));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching hourly session activity:', error);
    return res.status(500).json({ error: 'Failed to fetch hourly session activity' });
  }
};

// Sales by Category: total sales per category within date range
exports.getSalesByCategory = async (req, res) => {
  try {
    const { from, to } = req.query;
    
    // Get all sessions and filter in memory to avoid composite index
    const sessionsSnap = await db.collection('sessions').get();
    
    // Filter completed sessions in date range
    const filteredSessions = sessionsSnap.docs
      .map(doc => doc.data())
      .filter(data => {
        return data.status === 'completed' && 
               data.endedAt && 
               data.endedAt.toDate() >= new Date(from) && 
               data.endedAt.toDate() <= new Date(to);
      });
    
    // Map itemId to category
    const itemsSnap = await db.collection('items').get();
    const categoryMap = {};
    itemsSnap.docs.forEach(doc => {
      const data = doc.data();
      categoryMap[data.id || doc.id] = data.category;
    });
    
    // Calculate sales by category
    const salesByCategory = {};
    filteredSessions.forEach(data => {
      const { items = [] } = data;
      items.forEach(({ itemId, quantity = 0, unitPrice = 0 }) => {
        const cat = categoryMap[itemId] || 'Unknown';
        salesByCategory[cat] = (salesByCategory[cat] || 0) + quantity * unitPrice;
      });
    });
    
    const result = Object.entries(salesByCategory).map(([category, sales]) => ({ category, sales }));
    return res.json(result);
  } catch (error) {
    console.error('Error fetching sales by category:', error);
    return res.status(500).json({ error: 'Failed to fetch sales by category' });
  }
};