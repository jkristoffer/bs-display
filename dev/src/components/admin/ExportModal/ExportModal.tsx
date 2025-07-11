import { useState } from 'react';
import styles from './ExportModal.module.scss';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: 'overview' | 'products' | 'visitors' | 'journeys';
}

export default function ExportModal({ isOpen, onClose, dataType }: ExportModalProps) {
  const [format, setFormat] = useState('csv');
  const [period, setPeriod] = useState('7d');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const params = new URLSearchParams({
        format,
        type: dataType,
        period,
      });
      
      const response = await fetch(`/api/analytics/export?${params}`);
      
      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        a.download = `analytics-${dataType}-${period}-${timestamp}.${format}`;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        onClose();
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getDataTypeLabel = () => {
    const labels = {
      overview: 'Overview Analytics',
      products: 'Product Analytics',
      visitors: 'Visitor Analytics',
      journeys: 'Customer Journey Analytics'
    };
    return labels[dataType] || 'Analytics';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Export {getDataTypeLabel()}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.field}>
            <label>Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
          
          <div className={styles.field}>
            <label>Time Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          
          <div className={styles.info}>
            <p>This will download a {format.toUpperCase()} file containing {getDataTypeLabel().toLowerCase()} data for the selected time period.</p>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button 
            className={styles.exportButton} 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}