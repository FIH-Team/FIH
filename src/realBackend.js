// ============================================================================
// Campus Karma - Real Backend API & Real-time WebSocket Client
// Replaces fake LARP/mock data with true multi-device network persistence
// ============================================================================

const ACTIVE_USER_STORAGE_KEY = 'campus_karma_active_user_id';

let currentUserId = localStorage.getItem(ACTIVE_USER_STORAGE_KEY) || 'user-aditya';
let ws = null;
let eventListeners = [];

export function getActiveUserId() {
  return currentUserId;
}

export function setActiveUserId(id) {
  currentUserId = id;
  localStorage.setItem(ACTIVE_USER_STORAGE_KEY, id);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'IDENTIFY', userId: currentUserId }));
  }
}

async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': currentUserId,
    ...(options.headers || {})
  };

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

// ----------------------------------------------------------------------------
// Real-time WebSocket Hub
// ----------------------------------------------------------------------------

export function initWebSocket(onEvent) {
  if (onEvent) {
    eventListeners.push(onEvent);
  }

  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws`;

  function connect() {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[CK Live Hub] Connected to real-time server at', wsUrl);
      ws.send(JSON.stringify({ type: 'IDENTIFY', userId: currentUserId }));
    };

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        eventListeners.forEach(listener => listener(event));
      } catch (err) {
        console.error('WS parse error', err);
      }
    };

    ws.onclose = () => {
      console.warn('[CK Live Hub] WebSocket disconnected, reconnecting in 2s...');
      setTimeout(connect, 2000);
    };

    ws.onerror = (err) => {
      console.warn('[CK Live Hub] WebSocket error', err);
    };
  }

  connect();
}

export function onBackendEvent(listener) {
  eventListeners.push(listener);
}

// ----------------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------------

// Users
export async function apiGetUsers() {
  return apiFetch('/api/users');
}

export async function apiGetCurrentUser() {
  return apiFetch(`/api/users/${currentUserId}`);
}

export async function apiUpdateUserProfile(data) {
  return apiFetch(`/api/users/${currentUserId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Clubs
export async function apiGetClubs() {
  return apiFetch('/api/clubs');
}

export async function apiToggleClubMembership(clubId) {
  return apiFetch(`/api/clubs/${clubId}/toggle`, {
    method: 'POST'
  });
}

// Announcements / Notices
export async function apiGetAnnouncements() {
  return apiFetch('/api/announcements');
}

export async function apiCreateAnnouncement(data) {
  return apiFetch('/api/announcements', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiDeleteAnnouncement(id) {
  return apiFetch(`/api/announcements/${id}`, {
    method: 'DELETE'
  });
}

export async function apiToggleAnnouncementRsvp(id) {
  return apiFetch(`/api/announcements/${id}/rsvp`, {
    method: 'POST'
  });
}

export async function apiToggleAnnouncementBookmark(id) {
  return apiFetch(`/api/announcements/${id}/bookmark`, {
    method: 'POST'
  });
}

// Reels / Feels
export async function apiGetReels() {
  return apiFetch('/api/reels');
}

export async function apiCreateReel(data) {
  return apiFetch('/api/reels', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Applications Lifecycle
export async function apiGetApplications(role) {
  const query = role ? `?role=${role}` : '';
  return apiFetch(`/api/applications${query}`);
}

export async function apiGetItemApplications(itemId) {
  return apiFetch(`/api/applications?itemId=${itemId}`);
}

export async function apiSubmitApplication(data) {
  return apiFetch('/api/applications', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiUpdateApplicationStatus(appId, status) {
  return apiFetch(`/api/applications/${appId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

// Conversations & Real Chat
export async function apiGetConversations() {
  return apiFetch('/api/conversations');
}

export async function apiStartConversation(recipientId, topicContext) {
  return apiFetch('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ recipientId, topicContext })
  });
}

export async function apiSendMessage(convId, text) {
  return apiFetch(`/api/conversations/${convId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

// Karma & Telemetry
export async function apiGetKarmaLedger() {
  return apiFetch('/api/karma/ledger');
}

export async function apiGetTelemetry() {
  return apiFetch('/api/telemetry');
}
