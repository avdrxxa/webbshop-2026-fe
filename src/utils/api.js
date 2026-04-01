
export function getBaseUrl() {
  if (window.location.hostname.includes("localhost")) {
    return "http://localhost:3000/api/";
  }
  // TODO: Add deployed backend URL
  return "https://webbshop-2026-ply7firm6-ludvig-ds-projects.vercel.app/api/";
}
