export async function api(path, { token, ...options } = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Permintaan tidak berhasil.');
  return data;
}
