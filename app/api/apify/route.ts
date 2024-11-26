import { ApifyClient } from 'apify-client';
import type { NextRequest } from 'next/server'
import { errorResponse, successResponse } from '../responseHandler'
// Client initialization with the API token
const client = new ApifyClient({
    token: 'apify_api_h68gAHh6ts7AQhrBl0EYM6kk7DlRQE2JFIal',
    timeoutSecs: 360,
});
export const maxDuration = 300

interface ApifyPayload {
  url: string,
  email: string,
  password: string,
  taskId: string
  resume_url?: string
  cover_letter?: string
}

export const POST = async (request: NextRequest) => {
  try {
    const params: ApifyPayload = await request.json()
    client.actor('commanding_tape/workday-scrape').call({
      url: params.url,
      email: params.email,
      password: params.password,
      taskId: params.taskId,
      resume_url: params.resume_url || 'https://pic.origapp.com/resume/NguyenVanToan.pdf',
      cover_letter: params.cover_letter || 'My cover letter',
    });
    return successResponse('success')
  } catch (error) {
    return errorResponse(JSON.stringify(error))
  }
}