/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import https from 'https';

let baseURL = process.env.NEXT_PUBLIC_API_AGENT_URL || '';
if (baseURL && !baseURL.endsWith('/')) {
  baseURL += '/';
}

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const apiSet = axios.create({
  baseURL,
  httpsAgent: agent,
});

const apiAgent = {
  get: (endpoint: any) => apiSet.get(endpoint).then((res: any) => (res as any).data),
  post: (endpoint: any, body?: Record<any, any>): Promise<any> =>
    apiSet.post(endpoint, body).then((res: any) => (res as any).data),
};

export default apiAgent;