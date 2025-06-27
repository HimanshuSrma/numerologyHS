import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAnimations } from '@angular/platform-browser/animations';

export const firebaseConfig = {
  apiKey: "AIzaSyAsqqShM1Of31eXBk7QSlnqyon_G5HS7uA",
  authDomain: "mynumerologyapp.firebaseapp.com",
  projectId: "mynumerologyapp",
  // storageBucket: "mynumerologyapp.firebasestorage.app",
  storageBucket: "mynumerologyapp.appspot.com", // ✅ FIXED
  messagingSenderId: "843810664720",
  appId: "1:843810664720:web:9a7f8738d9ce903e963595",
  measurementId: "G-CREPZYTV2K"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase())
  ]
};
