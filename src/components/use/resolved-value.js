export default function useResolvedValue([result, error]) {
  if (error) {
    throw error;
  }
  return result;
}
