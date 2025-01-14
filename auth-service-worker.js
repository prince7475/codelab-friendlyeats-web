import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

// this is set during install
let firebaseConfig;

self.addEventListener('install', event => {
  // extract firebase config from query string
  const serializedFirebaseConfig = new URL(location).searchParams.get('firebaseConfig');
  
  if (!serializedFirebaseConfig) {
    throw new Error('Firebase Config object not found in service worker query string.');
  }
  
  firebaseConfig = JSON.parse(serializedFirebaseConfig);
  console.log("Service worker installed with Firebase config", firebaseConfig);
});

self.addEventListener("fetch", (event) => {
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
}


async function fetchWithFirebaseHeaders(request) {
  let authIdToken = await getAuthIdToken();
  if (!authIdToken) {
    // sleep for 0.25s
    await new Promise((resolve) => setTimeout(resolve, 250));
    authIdToken = await getAuthIdToken();
  }
  if (!authIdToken) {
    // sleep for 0.25s
    await new Promise((resolve) => setTimeout(resolve, 250));
    authIdToken = await getAuthIdToken();
  }
  if (authIdToken) {
    const headers = new Headers(request.headers);
    headers.append("Authorization", `Bearer ${authIdToken}`);
    request = new Request(request, { headers });
  }
  return await fetch(request).catch((reason) => {
    console.error(reason);
    return new Response("Fail.", {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  });
}
