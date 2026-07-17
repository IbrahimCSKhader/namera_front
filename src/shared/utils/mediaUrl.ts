import { apiBaseUrl } from '../services/api/apiClient';

const apiOrigin = new URL(apiBaseUrl).origin;

export function resolveMediaUrl(url: string): string {
  if (!url) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  return `${apiOrigin}${url.startsWith('/') ? url : `/${url}`}`;
}
