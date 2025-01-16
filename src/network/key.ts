let key: string | null =
  typeof process !== "undefined" && process.env?.SIGN_SPEAK_API_KEY
    ? process.env.SIGN_SPEAK_API_KEY
    : null;

/**
 * Sets the API key manually. This will override any environment variable.
 * @param k - The API key to set.
 */
export function setKey(k: string): void {
    key = k;
}

/**
 * Retrieves the API key.
 * @returns The API key if set, otherwise throws an error.
 */
export function getKey(): string {
    if (!key) {
        throw new Error("API key is not set. Use setKey() or define SIGN_SPEAK_API_KEY in your environment.");
    }
    return key;
}