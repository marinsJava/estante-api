export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const request = async (url, { timeoutMs = 8000, signal, headers, body, ...options } = {}) => {
  const controller = new AbortController();
  const forwardAbort = () => controller.abort(signal.reason);
  if (signal?.aborted) controller.abort(signal.reason);
  signal?.addEventListener('abort', forwardAbort);

  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new ApiError('A requisição demorou demais. Tente novamente.', 408));
    }, timeoutMs);
  });

  try {
    const response = await Promise.race([
      fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { ...(body && { 'Content-Type': 'application/json' }), ...headers },
        body: body && JSON.stringify(body),
      }),
      timeout,
    ]);
    if (!response.ok) throw new ApiError(`O servidor respondeu com erro ${response.status}.`, response.status);
    return await response.json();
  } catch (err) {
    if (err instanceof ApiError || err.name === 'AbortError') throw err;
    throw new ApiError('Não foi possível conectar ao servidor. A API está rodando?');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
};
