// Network utility for menu upload/fetch

export class MenuNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuNetworkError';
  }
}

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Use proxy in dev
    return 'http://localhost:3001/v1';
  }
  // Use real API in prod/export
  return 'https://api.relationshipmenu.org/v1';
}

// Upload encrypted menu data, returns token
export async function uploadEncryptedMenu(encryptedData: Uint8Array): Promise<string> {
  try {
    const baseUrl = getApiBaseUrl();
    const base64 = btoa(String.fromCharCode(...encryptedData));
    const res = await fetch(`${baseUrl}/menus`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: base64
    });
    if (res.status === 201) {
      const json = await res.json();
      if (!json.token) throw new MenuNetworkError('Invalid response');
      return json.token;
    } else if (res.status === 400) {
      throw new MenuNetworkError('Bad request: malformed data');
    } else {
      throw new MenuNetworkError(`Unexpected status: ${res.status}`);
    }
  } catch {
    throw new MenuNetworkError('Upload failed');
  }
}

// Fetch encrypted menu data by token (triggers auto-deletion timer)
export async function fetchEncryptedMenu(token: string): Promise<Uint8Array> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/menus/${token}`);
    if (res.status === 200) {
      const base64 = await res.text();
      const binary = atob(base64);
      return new Uint8Array([...binary].map(c => c.charCodeAt(0)));
    } else if (res.status === 404) {
      throw new MenuNetworkError('Menu not found');
    } else {
      throw new MenuNetworkError(`Unexpected status: ${res.status}`);
    }
  } catch {
    console.error('Fetch failed:');
    throw new MenuNetworkError('Fetch failed');
  }
}

// Check if a menu exists (does NOT trigger auto-deletion)
export async function checkMenuExists(token: string): Promise<boolean> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/menus/${token}`, { method: 'HEAD' });
    if (res.status === 200) {
      return true;
    } else if (res.status === 404) {
      return false;
    } else {
      throw new MenuNetworkError(`Unexpected status: ${res.status}`);
    }
  } catch {
    throw new MenuNetworkError('Failed to check menu existence');
  }
} 