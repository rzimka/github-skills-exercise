const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

function inferCodespacesApiBaseUrl() {
  if (typeof window === 'undefined') {
    return null;
  }

  const host = window.location.hostname;
  if (!host.endsWith('.app.github.dev')) {
    return null;
  }

  const codespaceHost = host.replace(/-\d+\.app\.github\.dev$/, '-8000.app.github.dev');
  if (codespaceHost === host) {
    return null;
  }

  return `https://${codespaceHost}/api`;
}

const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : inferCodespacesApiBaseUrl() ?? 'http://localhost:8000/api';

export function getApiBaseUrl() {
  return apiBaseUrl;
}

export function buildApiUrl(resource) {
  return `${apiBaseUrl}/${resource}/`;
}

export function normalizeApiPayload(payload) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      count: payload.length,
      pagination: null,
      raw: payload,
    };
  }

  if (!payload || typeof payload !== 'object') {
    return {
      items: [],
      count: 0,
      pagination: null,
      raw: payload,
    };
  }

  const items = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.results)
      ? payload.results
      : [];

  return {
    items,
    count: typeof payload.count === 'number' ? payload.count : items.length,
    pagination: {
      next: payload.next ?? null,
      previous: payload.previous ?? null,
      page: payload.page ?? null,
      totalPages: payload.totalPages ?? null,
    },
    raw: payload,
  };
}
