// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",                     // homepage public
  "/sign-in(.*)",          // sign in page
  "/sign-up(.*)",          // sign up page
  "/api/public/(.*)",      // public APIs
]);

export default clerkMiddleware((auth, req) => {
  // for public routes → allow, do nothing
  if (isPublicRoute(req)) return;

  // for private routes but not logged in → DO NOT REDIRECT here
  // simply let the request go through; page will handle authentication
  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
