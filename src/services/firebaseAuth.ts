import axios from 'axios';

const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY as string;

interface FirebaseLoginResponse {
  idToken: string;
  email: string;
}

export async function firebaseLogin(email: string, password: string): Promise<FirebaseLoginResponse> {
  if (!FIREBASE_API_KEY) {
    throw new Error('Missing VITE_FIREBASE_API_KEY environment variable');
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

  const payload = {
    email,
    password,
    returnSecureToken: true,
  };

  const response = await axios.post(url, payload);
  const { idToken, email: returnedEmail } = response.data;

  if (!idToken) {
    throw new Error('Failed to retrieve ID token from Firebase Auth.');
  }

  return { idToken, email: returnedEmail };
}
