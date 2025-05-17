// This file exists to prevent build issues with Next.js 15.0.3 and route groups
// It shouldn't be accessed directly as the redirect in page.tsx will take precedence

export default function FallbackAuthenticatedPage() {
  return null;
}
