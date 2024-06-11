export function useCors(lambda) {
  return {
    ...lambda,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Credentials": true,
    },
  };
}
