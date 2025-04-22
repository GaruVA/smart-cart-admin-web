// Import libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import analyticsService from './analyticsService';
import html2canvas from 'html2canvas';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Set of colors for charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', 
  '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57'
];

const reportService = {
  /**
   * Export analytics data as PDF
   * @param {string} reportType - Type of report (sales, inventory, carts, sessions)
   * @param {Object} data - The data to export
   * @param {Object} metadata - Report metadata (date range, title, etc.)
   */
  exportPDF: async (reportType, data, metadata) => {
    // Create a new PDF document
    const doc = new jsPDF();
    const { from, to, title } = metadata;
    
    // Add title and metadata
    doc.setFontSize(18);
    doc.text(title || `${reportType.toUpperCase()} Report`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Date Range: ${from} to ${to}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);
    
    let currentY = 46;
    
    // Fetch chart images for the selected report type
    const chartImagesData = await reportService.fetchChartData(reportType, from, to);
    
    // Based on report type, create appropriate tables and include charts
    switch(reportType) {
      case 'sales':
        // Sales trend table
        if (data.salesTrend && data.salesTrend.length) {
          doc.text('Sales Trend Data', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Date', 'Sales ($)']],
            body: data.salesTrend.map(item => [item.date, item.sales.toFixed(2)]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.salesTrend || data.salesTrend.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const salesTrendResponse = await analyticsService.getSalesTrend(from, to);
            if (salesTrendResponse.data && salesTrendResponse.data.length > 0) {
              doc.text('Sales Trend Data', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Date', 'Sales ($)']],
                body: salesTrendResponse.data.map(item => [item.date, item.sales.toFixed(2)]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching sales trend data:', error);
          }
        }
        
        // Check if we need to add a new page
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        // Sales by category table
        if (data.salesByCategory && data.salesByCategory.length) {
          doc.text('Sales by Category Data', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Category', 'Sales ($)']],
            body: data.salesByCategory.map(item => [item.category, item.sales.toFixed(2)]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.salesByCategory || data.salesByCategory.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const salesByCategoryResponse = await analyticsService.getSalesByCategory(from, to);
            if (salesByCategoryResponse.data && salesByCategoryResponse.data.length > 0) {
              doc.text('Sales by Category Data', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Category', 'Sales ($)']],
                body: salesByCategoryResponse.data.map(item => [item.category, item.sales.toFixed(2)]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching sales by category data:', error);
          }
        }
        
        // Include chart images if available
        if (chartImagesData.salesTrend) {
          // Check if we need to add a new page
          if (currentY > 150) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text('Sales Trend Chart', 14, currentY);
          currentY += 10;
          
          try {
            doc.addImage(chartImagesData.salesTrend, 'PNG', 20, currentY, 170, 120);
            currentY += 130;
          } catch (error) {
            console.error('Error adding sales trend chart to PDF:', error);
          }
        }
        
        // Check if we need to add a new page
        if (currentY > 150) {
          doc.addPage();
          currentY = 20;
        }
        
        if (chartImagesData.salesByCategory) {
          doc.text('Sales by Category Chart', 14, currentY);
          currentY += 10;
          
          try {
            doc.addImage(chartImagesData.salesByCategory, 'PNG', 20, currentY, 170, 120);
          } catch (error) {
            console.error('Error adding sales by category chart to PDF:', error);
          }
        }
        break;
        
      case 'inventory':
        // Inventory levels table
        if (data.inventoryLevels && data.inventoryLevels.length) {
          doc.text('Inventory Levels Data', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Category', 'Stock']],
            body: data.inventoryLevels.map(item => [item.category, item.stock]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.inventoryLevels || data.inventoryLevels.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const inventoryLevelsResponse = await analyticsService.getInventoryLevels();
            if (inventoryLevelsResponse.data && inventoryLevelsResponse.data.length > 0) {
              doc.text('Inventory Levels Data', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Category', 'Stock']],
                body: inventoryLevelsResponse.data.map(item => [item.category, item.stock]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching inventory levels data:', error);
          }
        }
        
        // Check if we need to add a new page
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        // Low stock items table
        if (data.lowStockItems && data.lowStockItems.length) {
          doc.text('Low Stock Items', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Product', 'Category', 'Quantity']],
            body: data.lowStockItems.map(item => [item.name, item.category, item.quantity]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.lowStockItems || data.lowStockItems.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const lowStockItemsResponse = await analyticsService.getLowStockItems(20);
            if (lowStockItemsResponse.data && lowStockItemsResponse.data.length > 0) {
              doc.text('Low Stock Items', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Product', 'Category', 'Quantity']],
                body: lowStockItemsResponse.data.map(item => [item.name, item.category, item.quantity]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching low stock items data:', error);
          }
        }
        
        // Include chart image if available
        if (chartImagesData.inventoryLevels) {
          // Check if we need to add a new page
          if (currentY > 150) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text('Inventory Levels Chart', 14, currentY);
          currentY += 10;
          
          try {
            doc.addImage(chartImagesData.inventoryLevels, 'PNG', 20, currentY, 170, 120);
          } catch (error) {
            console.error('Error adding inventory levels chart to PDF:', error);
          }
        }
        break;
        
      case 'carts':
        // Cart status table
        if (data.cartStatus && data.cartStatus.length) {
          doc.text('Cart Status Data', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Status', 'Count']],
            body: data.cartStatus.map(item => [item.name, item.value]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.cartStatus || data.cartStatus.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const cartStatusResponse = await analyticsService.getCartStatus();
            if (cartStatusResponse.data && cartStatusResponse.data.length > 0) {
              doc.text('Cart Status Data', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Status', 'Count']],
                body: cartStatusResponse.data.map(item => [item.name, item.value]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching cart status data:', error);
          }
        }
        
        // Check if we need to add a new page
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        // Cart usage table
        if (data.cartUsage && data.cartUsage.length) {
          doc.text('Cart Usage Data', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Cart ID', 'Sessions']],
            body: data.cartUsage.map(item => [item.cart, item.sessions]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.cartUsage || data.cartUsage.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const cartUsageResponse = await analyticsService.getCartUsage(from, to);
            if (cartUsageResponse.data && cartUsageResponse.data.length > 0) {
              doc.text('Cart Usage Data', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Cart ID', 'Sessions']],
                body: cartUsageResponse.data.map(item => [item.cart, item.sessions]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching cart usage data:', error);
          }
        }
        
        // Include chart images if available
        if (chartImagesData.cartStatus) {
          // Check if we need to add a new page
          if (currentY > 150) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text('Cart Status Chart', 14, currentY);
          currentY += 10;
          
          try {
            doc.addImage(chartImagesData.cartStatus, 'PNG', 20, currentY, 170, 120);
            currentY += 130;
          } catch (error) {
            console.error('Error adding cart status chart to PDF:', error);
          }
        }
        
        // Check if we need to add a new page
        if (currentY > 150) {
          doc.addPage();
          currentY = 20;
        }
        
        if (chartImagesData.cartUsage) {
          doc.text('Cart Usage Chart', 14, currentY);
          currentY += 10;
          
          try {
            doc.addImage(chartImagesData.cartUsage, 'PNG', 20, currentY, 170, 120);
          } catch (error) {
            console.error('Error adding cart usage chart to PDF:', error);
          }
        }
        break;
        
      case 'sessions':
        // Average session value table
        if (data.avgSessionValue && data.avgSessionValue.length) {
          doc.text('Average Session Value Data', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Date', 'Value ($)']],
            body: data.avgSessionValue.map(item => [item.date, item.value.toFixed(2)]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.avgSessionValue || data.avgSessionValue.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const avgSessionValueResponse = await analyticsService.getAvgSessionValue(from, to);
            if (avgSessionValueResponse.data && avgSessionValueResponse.data.length > 0) {
              doc.text('Average Session Value Data', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Date', 'Value ($)']],
                body: avgSessionValueResponse.data.map(item => [item.date, item.value.toFixed(2)]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching average session value data:', error);
          }
        }
        
        // Check if we need to add a new page
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        // Hourly session activity table
        if (data.hourlySessionActivity && data.hourlySessionActivity.length) {
          doc.text('Hourly Session Activity Data', 14, currentY);
          currentY += 4;
          
          autoTable(doc, {
            startY: currentY,
            head: [['Hour', 'Sessions']],
            body: data.hourlySessionActivity.map(item => [item.hour, item.sessions]),
          });
          
          // Safely update currentY
          currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
        } else if (!data.hourlySessionActivity || data.hourlySessionActivity.length === 0) {
          // Attempt to fetch the data if it wasn't provided
          try {
            const hourlySessionActivityResponse = await analyticsService.getHourlySessionActivity(from);
            if (hourlySessionActivityResponse.data && hourlySessionActivityResponse.data.length > 0) {
              doc.text('Hourly Session Activity Data', 14, currentY);
              currentY += 4;
              
              autoTable(doc, {
                startY: currentY,
                head: [['Hour', 'Sessions']],
                body: hourlySessionActivityResponse.data.map(item => [item.hour, item.sessions]),
              });
              
              // Safely update currentY
              currentY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : currentY + 60;
            }
          } catch (error) {
            console.error('Error fetching hourly session activity data:', error);
          }
        }
        
        // Include chart images if available
        if (chartImagesData.avgSessionValue) {
          // Check if we need to add a new page
          if (currentY > 150) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text('Average Session Value Chart', 14, currentY);
          currentY += 10;
          
          try {
            doc.addImage(chartImagesData.avgSessionValue, 'PNG', 20, currentY, 170, 120);
            currentY += 130;
          } catch (error) {
            console.error('Error adding average session value chart to PDF:', error);
          }
        }
        
        // Check if we need to add a new page
        if (currentY > 150) {
          doc.addPage();
          currentY = 20;
        }
        
        if (chartImagesData.hourlySessionActivity) {
          doc.text('Hourly Session Activity Chart', 14, currentY);
          currentY += 10;
          
          try {
            doc.addImage(chartImagesData.hourlySessionActivity, 'PNG', 20, currentY, 170, 120);
          } catch (error) {
            console.error('Error adding hourly session activity chart to PDF:', error);
          }
        }
        break;
        
      default:
        break;
    }
    
    // Save the PDF file
    doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
  },

  /**
   * Fetch chart data for the selected report type
   * @param {string} reportType - Type of report (sales, inventory, carts, sessions)
   * @param {string} from - Start date for the range
   * @param {string} to - End date for the range
   * @returns {Object} Chart data as base64 images
   */
  fetchChartData: async (reportType, from, to) => {
    const chartData = {};
    
    // Create temporary chart containers
    const chartContainer = document.createElement('div');
    chartContainer.style.position = 'absolute';
    chartContainer.style.left = '-9999px';
    chartContainer.style.width = '600px';
    chartContainer.style.height = '400px';
    document.body.appendChild(chartContainer);
    
    try {
      // Fetch and process chart data based on report type
      switch (reportType) {
        case 'sales':
          // Fetch sales trend data
          const salesTrendResponse = await analyticsService.getSalesTrend(from, to);
          if (salesTrendResponse.data && salesTrendResponse.data.length > 0) {
            // Create a Recharts line chart component
            const SalesTrendChart = () => (
              <div style={{ width: '600px', height: '400px', backgroundColor: 'white' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesTrendResponse.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
            
            // Render the chart to HTML string
            const salesTrendHtml = ReactDOMServer.renderToString(<SalesTrendChart />);
            
            // Create a container for the rendered HTML
            const salesTrendDiv = document.createElement('div');
            salesTrendDiv.innerHTML = salesTrendHtml;
            chartContainer.appendChild(salesTrendDiv);
            
            // Convert to image using html2canvas
            const salesTrendCanvas = await html2canvas(salesTrendDiv, {
              backgroundColor: 'white',
              scale: 2, // Higher scale for better quality
              logging: false
            });
            
            // Convert canvas to image
            chartData.salesTrend = salesTrendCanvas.toDataURL('image/png');
            
            // Clean up
            chartContainer.removeChild(salesTrendDiv);
          }
          
          // Fetch sales by category data
          const salesByCategoryResponse = await analyticsService.getSalesByCategory(from, to);
          if (salesByCategoryResponse.data && salesByCategoryResponse.data.length > 0) {
            // Create a Recharts pie chart component
            const SalesByCategoryChart = () => (
              <div style={{ width: '600px', height: '400px', backgroundColor: 'white' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategoryResponse.data}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="sales"
                      nameKey="category"
                      label={({category, percent}) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesByCategoryResponse.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
            
            // Render the chart to HTML string
            const salesByCategoryHtml = ReactDOMServer.renderToString(<SalesByCategoryChart />);
            
            // Create a container for the rendered HTML
            const salesByCategoryDiv = document.createElement('div');
            salesByCategoryDiv.innerHTML = salesByCategoryHtml;
            chartContainer.appendChild(salesByCategoryDiv);
            
            // Convert to image using html2canvas
            const salesByCategoryCanvas = await html2canvas(salesByCategoryDiv, {
              backgroundColor: 'white',
              scale: 2, // Higher scale for better quality
              logging: false
            });
            
            // Convert canvas to image
            chartData.salesByCategory = salesByCategoryCanvas.toDataURL('image/png');
            
            // Clean up
            chartContainer.removeChild(salesByCategoryDiv);
          }
          break;
          
        case 'inventory':
          // Fetch inventory levels data
          const inventoryLevelsResponse = await analyticsService.getInventoryLevels();
          if (inventoryLevelsResponse.data && inventoryLevelsResponse.data.length > 0) {
            // Create a Recharts bar chart component
            const InventoryLevelsChart = () => (
              <div style={{ width: '600px', height: '400px', backgroundColor: 'white' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryLevelsResponse.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stock" fill="#82ca9d" name="Stock" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
            
            // Render the chart to HTML string
            const inventoryLevelsHtml = ReactDOMServer.renderToString(<InventoryLevelsChart />);
            
            // Create a container for the rendered HTML
            const inventoryLevelsDiv = document.createElement('div');
            inventoryLevelsDiv.innerHTML = inventoryLevelsHtml;
            chartContainer.appendChild(inventoryLevelsDiv);
            
            // Convert to image using html2canvas
            const inventoryLevelsCanvas = await html2canvas(inventoryLevelsDiv, {
              backgroundColor: 'white',
              scale: 2, // Higher scale for better quality
              logging: false
            });
            
            // Convert canvas to image
            chartData.inventoryLevels = inventoryLevelsCanvas.toDataURL('image/png');
            
            // Clean up
            chartContainer.removeChild(inventoryLevelsDiv);
          }
          break;
          
        case 'carts':
          // Fetch cart status data
          const cartStatusResponse = await analyticsService.getCartStatus();
          if (cartStatusResponse.data && cartStatusResponse.data.length > 0) {
            // Create a Recharts pie chart component
            const CartStatusChart = () => (
              <div style={{ width: '600px', height: '400px', backgroundColor: 'white' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cartStatusResponse.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {cartStatusResponse.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
            
            // Render the chart to HTML string
            const cartStatusHtml = ReactDOMServer.renderToString(<CartStatusChart />);
            
            // Create a container for the rendered HTML
            const cartStatusDiv = document.createElement('div');
            cartStatusDiv.innerHTML = cartStatusHtml;
            chartContainer.appendChild(cartStatusDiv);
            
            // Convert to image using html2canvas
            const cartStatusCanvas = await html2canvas(cartStatusDiv, {
              backgroundColor: 'white',
              scale: 2, // Higher scale for better quality
              logging: false
            });
            
            // Convert canvas to image
            chartData.cartStatus = cartStatusCanvas.toDataURL('image/png');
            
            // Clean up
            chartContainer.removeChild(cartStatusDiv);
          }
          
          // Fetch cart usage data
          const cartUsageResponse = await analyticsService.getCartUsage(from, to);
          if (cartUsageResponse.data && cartUsageResponse.data.length > 0) {
            // Create a Recharts bar chart component
            const CartUsageChart = () => (
              <div style={{ width: '600px', height: '400px', backgroundColor: 'white' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cartUsageResponse.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cart" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#8884d8" name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
            
            // Render the chart to HTML string
            const cartUsageHtml = ReactDOMServer.renderToString(<CartUsageChart />);
            
            // Create a container for the rendered HTML
            const cartUsageDiv = document.createElement('div');
            cartUsageDiv.innerHTML = cartUsageHtml;
            chartContainer.appendChild(cartUsageDiv);
            
            // Convert to image using html2canvas
            const cartUsageCanvas = await html2canvas(cartUsageDiv, {
              backgroundColor: 'white',
              scale: 2, // Higher scale for better quality
              logging: false
            });
            
            // Convert canvas to image
            chartData.cartUsage = cartUsageCanvas.toDataURL('image/png');
            
            // Clean up
            chartContainer.removeChild(cartUsageDiv);
          }
          break;
          
        case 'sessions':
          // Fetch average session value data
          const avgSessionValueResponse = await analyticsService.getAvgSessionValue(from, to);
          if (avgSessionValueResponse.data && avgSessionValueResponse.data.length > 0) {
            // Create a Recharts line chart component
            const AvgSessionValueChart = () => (
              <div style={{ width: '600px', height: '400px', backgroundColor: 'white' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={avgSessionValueResponse.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Average Value" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
            
            // Render the chart to HTML string
            const avgSessionValueHtml = ReactDOMServer.renderToString(<AvgSessionValueChart />);
            
            // Create a container for the rendered HTML
            const avgSessionValueDiv = document.createElement('div');
            avgSessionValueDiv.innerHTML = avgSessionValueHtml;
            chartContainer.appendChild(avgSessionValueDiv);
            
            // Convert to image using html2canvas
            const avgSessionValueCanvas = await html2canvas(avgSessionValueDiv, {
              backgroundColor: 'white',
              scale: 2, // Higher scale for better quality
              logging: false
            });
            
            // Convert canvas to image
            chartData.avgSessionValue = avgSessionValueCanvas.toDataURL('image/png');
            
            // Clean up
            chartContainer.removeChild(avgSessionValueDiv);
          }
          
          // Fetch hourly session activity data
          const hourlySessionActivityResponse = await analyticsService.getHourlySessionActivity();
          if (hourlySessionActivityResponse.data && hourlySessionActivityResponse.data.length > 0) {
            // Create a Recharts bar chart component
            const HourlySessionActivityChart = () => (
              <div style={{ width: '600px', height: '400px', backgroundColor: 'white' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourlySessionActivityResponse.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#82ca9d" name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
            
            // Render the chart to HTML string
            const hourlySessionActivityHtml = ReactDOMServer.renderToString(<HourlySessionActivityChart />);
            
            // Create a container for the rendered HTML
            const hourlySessionActivityDiv = document.createElement('div');
            hourlySessionActivityDiv.innerHTML = hourlySessionActivityHtml;
            chartContainer.appendChild(hourlySessionActivityDiv);
            
            // Convert to image using html2canvas
            const hourlySessionActivityCanvas = await html2canvas(hourlySessionActivityDiv, {
              backgroundColor: 'white',
              scale: 2, // Higher scale for better quality
              logging: false
            });
            
            // Convert canvas to image
            chartData.hourlySessionActivity = hourlySessionActivityCanvas.toDataURL('image/png');
            
            // Clean up
            chartContainer.removeChild(hourlySessionActivityDiv);
          }
          break;
          
        default:
          break;
      }
      
      return chartData;
    } catch (error) {
      console.error('Error generating chart data:', error);
      return {};
    } finally {
      // Clean up - remove the container
      if (document.body.contains(chartContainer)) {
        document.body.removeChild(chartContainer);
      }
    }
  },

  /**
   * Export analytics data as CSV
   * @param {string} reportType - Type of report (sales, inventory, carts, sessions)
   * @param {Object} data - The data to export
   * @param {Object} metadata - Report metadata (date range, title, etc.)
   */
  exportCSV: (reportType, data, metadata) => {
    const { title } = metadata;
    const filename = `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    let csvContent = '';
    
    // Based on report type, create appropriate CSV content
    switch(reportType) {
      case 'sales':
        // Sales trend data
        if (data.salesTrend && data.salesTrend.length) {
          // Add section header
          csvContent += 'Sales Trend Data\r\n';
          // Add headers
          csvContent += 'Date,Sales ($)\r\n';
          // Add data rows
          data.salesTrend.forEach(item => {
            csvContent += `${item.date},${item.sales.toFixed(2)}\r\n`;
          });
          // Add separator
          csvContent += '\r\n';
        }
        
        // Sales by category data
        if (data.salesByCategory && data.salesByCategory.length) {
          // Add section header
          csvContent += 'Sales by Category Data\r\n';
          // Add headers
          csvContent += 'Category,Sales ($)\r\n';
          // Add data rows
          data.salesByCategory.forEach(item => {
            csvContent += `${item.category},${item.sales.toFixed(2)}\r\n`;
          });
        }
        break;
        
      case 'inventory':
        // Inventory levels data
        if (data.inventoryLevels && data.inventoryLevels.length) {
          // Add section header
          csvContent += 'Inventory Levels Data\r\n';
          // Add headers
          csvContent += 'Category,Stock\r\n';
          // Add data rows
          data.inventoryLevels.forEach(item => {
            csvContent += `${item.category},${item.stock}\r\n`;
          });
          // Add separator
          csvContent += '\r\n';
        }
        
        // Low stock items data
        if (data.lowStockItems && data.lowStockItems.length) {
          // Add section header
          csvContent += 'Low Stock Items\r\n';
          // Add headers
          csvContent += 'Product,Category,Quantity\r\n';
          // Add data rows
          data.lowStockItems.forEach(item => {
            csvContent += `${item.name},${item.category},${item.quantity}\r\n`;
          });
        }
        break;
        
      case 'carts':
        // Cart status data
        if (data.cartStatus && data.cartStatus.length) {
          // Add section header
          csvContent += 'Cart Status Data\r\n';
          // Add headers
          csvContent += 'Status,Count\r\n';
          // Add data rows
          data.cartStatus.forEach(item => {
            csvContent += `${item.name},${item.value}\r\n`;
          });
          // Add separator
          csvContent += '\r\n';
        }
        
        // Cart usage data
        if (data.cartUsage && data.cartUsage.length) {
          // Add section header
          csvContent += 'Cart Usage Data\r\n';
          // Add headers
          csvContent += 'Cart ID,Sessions\r\n';
          // Add data rows
          data.cartUsage.forEach(item => {
            csvContent += `${item.cart},${item.sessions}\r\n`;
          });
        }
        break;
        
      case 'sessions':
        // Average session value data
        if (data.avgSessionValue && data.avgSessionValue.length) {
          // Add section header
          csvContent += 'Average Session Value Data\r\n';
          // Add headers
          csvContent += 'Date,Value ($)\r\n';
          // Add data rows
          data.avgSessionValue.forEach(item => {
            csvContent += `${item.date},${item.value.toFixed(2)}\r\n`;
          });
          // Add separator
          csvContent += '\r\n';
        }
        
        // Hourly session activity data
        if (data.hourlySessionActivity && data.hourlySessionActivity.length) {
          // Add section header
          csvContent += 'Hourly Session Activity Data\r\n';
          // Add headers
          csvContent += 'Hour,Sessions\r\n';
          // Add data rows
          data.hourlySessionActivity.forEach(item => {
            csvContent += `${item.hour},${item.sessions}\r\n`;
          });
        }
        break;
        
      default:
        break;
    }
    
    // Create a blob and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link and trigger the download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  
  /**
   * Export analytics data as Excel
   * @param {string} reportType - Type of report (sales, inventory, carts, sessions)
   * @param {Object} data - The data to export
   * @param {Object} metadata - Report metadata (date range, title, etc.)
   */
  exportExcel: (reportType, data, metadata) => {
    // You would need xlsx or similar library to implement Excel export
    console.warn('Excel export not implemented yet');
  }
};

export default reportService;