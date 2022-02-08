export function createFetcherAndAbortController<T = any>(url: string | (() => string), callback: (t: T) => void) {
  const abortController = new AbortController();
  async function call () {
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
      location.reload();
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