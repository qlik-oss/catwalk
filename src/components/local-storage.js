export default function isLocalStorage() {
  const enabled = 'enabled';
  try {
    localStorage.setItem(enabled, enabled);
    localStorage.removeItem(enabled);
    return true;
  } catch {
    return false;
  }
}
