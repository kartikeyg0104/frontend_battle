import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './CarbonGraph.module.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data for the chart
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Actual Emissions',
      data: [42, 38, 45, 40, 35, 32, 30, 28, 25],
      backgroundColor: '#3a86ff'
    }
  ]
};

const targetLines = [
  { value: 35, label: 'Target 2023' },
  { value: 25, label: 'Target 2025' },
  { value: 15, label: 'Target 2030' }
];

const CarbonGraph = () => {
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [chartInstance, setChartInstance] = useState(null);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          family: 'Inter',
          size: 14
        },
        bodyFont: {
          family: 'Inter',
          size: 12
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12
          }
        }
      }
    },
    // Add horizontal lines for targets
    plugins: {
      targetLines: {
        lines: targetLines
      }
    }
  };
  
  // Plugin to draw horizontal target lines
  const targetLinesPlugin = {
    id: 'targetLines',
    beforeDraw: (chart) => {
      if (chart.options.plugins.targetLines) {
        const { ctx, chartArea, scales } = chart;
        const lines = chart.options.plugins.targetLines.lines || [];
        
        ctx.save();
        
        lines.forEach(line => {
          const yPos = scales.y.getPixelForValue(line.value);
          
          // Draw line
          ctx.beginPath();
          ctx.moveTo(chartArea.left, yPos);
          ctx.lineTo(chartArea.right, yPos);
          ctx.lineWidth = 2;
          ctx.strokeStyle = line.color || '#ff006e';
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          
          // Draw label
          ctx.fillStyle = '#666';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.font = '12px Inter';
          ctx.fillText(line.label, chartArea.right - 10, yPos - 5);
        });
        
        ctx.restore();
      }
    }
  };
  
  // Register the plugin
  ChartJS.register(targetLinesPlugin);
  
  // Filter handling
  const handleTypeChange = (newType) => {
    setType(newType);
  };
  
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };
  
  // Add download functionality
  const handleDownload = () => {
    // Create a fake data CSV
    const csvContent = "Month,Emissions\nJan,42\nFeb,38\nMar,45\nApr,40\nMay,35\nJun,32\nJul,30\nAug,28\nSep,25";
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', 'carbon_emissions_data.csv');
    link.style.visibility = 'hidden';
    
    // Add to document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <section className={styles.carbonSection}>
      <div className="container">
        <div className={styles.carbonContainer}>
          <div className={styles.header}>
            <div className={styles.titleArea}>
              <h2 className={styles.title}>Embodied Carbon Emissions</h2>
              <p className={styles.subtitle}>Monthly carbon emissions from manufacturing operations</p>
            </div>
            
            <button 
              className={styles.downloadButton}
              onClick={handleDownload}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 13L12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download
            </button>
          </div>
          
          <div className={styles.filterContainer}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Filter by:</span>
              
              <div className={styles.toggleContainer}>
                <label className={`${styles.toggleButton} ${type === 'all' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    checked={type === 'all'}
                    onChange={() => handleTypeChange('all')}
                  />
                  All
                </label>
                <label className={`${styles.toggleButton} ${type === 'materials' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="materials"
                    checked={type === 'materials'}
                    onChange={() => handleTypeChange('materials')}
                  />
                  Materials
                </label>
                <label className={`${styles.toggleButton} ${type === 'energy' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="energy"
                    checked={type === 'energy'}
                    onChange={() => handleTypeChange('energy')}
                  />
                  Energy
                </label>
              </div>
            </div>
            
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Status:</span>
              
              <div className={styles.toggleContainer}>
                <label className={`${styles.toggleButton} ${status === 'all' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="status"
                    value="all"
                    checked={status === 'all'}
                    onChange={() => handleStatusChange('all')}
                  />
                  All
                </label>
                <label className={`${styles.toggleButton} ${status === 'verified' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="status"
                    value="verified"
                    checked={status === 'verified'}
                    onChange={() => handleStatusChange('verified')}
                  />
                  Verified
                </label>
              </div>
            </div>
          </div>
          
          <div className={styles.keyContainer}>
            <h3 className={styles.keyTitle}>Key:</h3>
            
            <div className={styles.keyItems}>
              {targetLines.map((target, index) => (
                <div key={index} className={styles.keyItem}>
                  <div 
                    className={styles.keyLine}
                    style={{ borderColor: target.color || '#ff006e' }}
                  ></div>
                  <span className={styles.keyLabel}>{target.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <Bar 
              data={chartData} 
              options={options}
              plugins={[targetLinesPlugin]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarbonGraph;
