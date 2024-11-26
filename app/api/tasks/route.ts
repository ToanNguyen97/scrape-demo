import { ApifyClient } from 'apify-client';
import { errorResponse, successResponse } from '../responseHandler'
// Client initialization with the API token
const client = new ApifyClient({
    token: 'apify_api_h68gAHh6ts7AQhrBl0EYM6kk7DlRQE2JFIal',
});

export const maxDuration = 300

export const GET = async () => {
  try {
    const runs = await client.actor('commanding_tape/workday-scrape').runs().list()
    return successResponse(runs.items)
  } catch (error) {
    return errorResponse(JSON.stringify(error))
  }
}