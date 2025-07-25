import { GA4_CONFIG } from '@config/analytics.config';
import { getGA4Client, runGA4Report } from './ga4Client';

export async function testGA4Connection() {
  const results = {
    configurationValid: false,
    connectionSuccessful: false,
    dataFetchSuccessful: false,
    errors: [] as string[],
    details: {} as any
  };
  
  // Test 1: Configuration
  try {
    if (!GA4_CONFIG.propertyId) {
      results.errors.push('GA4_PROPERTY_ID not configured');
    } else {
      results.details.propertyId = GA4_CONFIG.propertyId;
    }
    
    if (!GA4_CONFIG.serviceAccountKey) {
      results.errors.push('GA4_SERVICE_ACCOUNT_KEY not configured');
    } else {
      // Check if service account key has required fields
      const key = GA4_CONFIG.serviceAccountKey;
      if (!key.client_email) {
        results.errors.push('Service account key missing client_email');
      } else {
        results.details.serviceAccountEmail = key.client_email;
      }
      if (!key.private_key) {
        results.errors.push('Service account key missing private_key');
      }
      if (!key.project_id) {
        results.errors.push('Service account key missing project_id');
      } else {
        results.details.projectId = key.project_id;
      }
    }
    
    results.configurationValid = results.errors.length === 0;
  } catch (error: any) {
    results.errors.push(`Configuration error: ${error.message}`);
  }
  
  // Test 2: Connection
  if (results.configurationValid) {
    try {
      getGA4Client();
      results.connectionSuccessful = true;
    } catch (error: any) {
      results.errors.push(`Connection error: ${error.message}`);
    }
  }
  
  // Test 3: Data Fetch
  if (results.connectionSuccessful) {
    try {
      const response = await runGA4Report({
        metrics: ['totalUsers'],
        dateRanges: [{ startDate: 'yesterday', endDate: 'today' }]
      });
      results.dataFetchSuccessful = !!response;
      
      // Add some sample data to details
      if (response?.rows && response.rows.length > 0) {
        const totalUsers = response.rows[0]?.metricValues?.[0]?.value || '0';
        results.details.sampleData = {
          totalUsersYesterday: totalUsers
        };
      }
    } catch (error: any) {
      results.errors.push(`Data fetch error: ${error.message}`);
      results.dataFetchSuccessful = false;
    }
  }
  
  return results;
}