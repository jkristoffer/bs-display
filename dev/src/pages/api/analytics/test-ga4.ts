import type { APIRoute } from 'astro';
import { testGA4Connection } from '@utils/analytics/ga4Test';
import { createAPIResponse, handleAPIError } from '@utils/api/apiHelpers';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const testResults = await testGA4Connection();
    
    return new Response(JSON.stringify(createAPIResponse({
      ...testResults,
      allTestsPassed: testResults.configurationValid && 
                      testResults.connectionSuccessful && 
                      testResults.dataFetchSuccessful
    })), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleAPIError(error);
  }
};