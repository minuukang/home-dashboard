export function createFetcherAndAbortController<T = any>(url: string | URL | (() => string | URL), callback: (t: T) => void) {
  const abortController = new AbortController();
  let timer: number | undefined;

  abortController.signal.addEventListener("abort", () => {
    if (timer) {
      window.clearTimeout(timer);
    }
  });

  async function call(retryCount = 0) {
    if (retryCount > 3) {
      throw new Error('api fetch response error');
    }
    try {
      const response = await fetch(
        typeof url === 'function' ? url() : url,
        { signal: abortController.signal }
      );
      const json = await response.json();
      if (response.ok) {
        callback(json);
      } else {
        throw new Error('api fetch response error');
      }
    } catch (err) {
      timer = window.setTimeout(() => call(retryCount + 1), 1000);
    }
  }
  return {
    controller: abortController,
    call,
    abort() {
      abortController.abort();
    }
  };
}