export default function useErrorThrow([result, error]) {
  if (error) {
    throw error;
  }
  return result;
}
