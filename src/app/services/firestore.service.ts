// firestore.service.ts
import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  CollectionReference,
  setDoc,
} from '@angular/fire/firestore';
@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);
  englishMobilePairsMeaningArr: any;
  hindiMobilePairsMeaningArr: any;
  numbersData: any;
  personalYearData: any;
  personalMonthData: any;
  personalDayData: any;
  nameNumberCharacteristics: any;
  repetitionOfNumbers: any;
  nameLettersData: any;

  // async addUser(data: any) {
  //   const colRef = collection(this.firestore, 'users'); // collection name
  //   return await addDoc(colRef, data);
  // }

  async addUser(data: any) {
    const colRef = collection(
      this.firestore,
      'users'
    ) as CollectionReference<DocumentData>;
    return await addDoc(colRef, data); // Firestore auto-generates ID
  }

  // Data of specific Driver conductor combination
  async getDriverConductorData(lifePath: string): Promise<any> {
    const docRef = doc(this.firestore, 'driverConductordata', lifePath);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  }

  // Data of personal time
  // async getData(json: string, key?: any): Promise<any> {
  //   let docRef: DocumentReference<DocumentData> | undefined = undefined;
  //   let colRef: CollectionReference<DocumentData> | undefined = undefined;
  //   switch (json) {
  //     case 'numbersRemedy':
  //     case 'personalYearData':
  //     case 'personalMonthData':
  //     case 'personalDayData':
  //     case 'repetitionOfNumbers':
  //     case 'nameNumberCharacteristics':
  //     case 'englishMobilePairsMeaningArr':
  //     case 'hindiMobilePairsMeaningArr':
  //     case 'nameLettersData':
  //       colRef = collection(this.firestore, json);
  //       break;
  //     case 'collectionname':
  //       docRef = doc(this.firestore, json, key?.toString());
  //       break;
  //     default:
  //       throw new Error(`Invalid json: ${json}`);
  //   }

  //   let snap;
  //   if (docRef) {
  //     snap = await getDoc(docRef);
  //   } else if (colRef) {
  //     // getDocs returns a QuerySnapshot, not a DocumentSnapshot
  //     const querySnap = await getDocs(colRef);
  //     // Return all documents' data as an array
  //     return querySnap.docs.map((doc) => ({
  //       id: doc?.id,
  //       ...doc.data()
  //   }));
  //   } else {
  //     throw new Error('Neither docRef nor colRef is defined');
  //   }
  //   return snap.exists() ? snap.data() : null;
  // }

  async getData(json: string, key?: any): Promise<any> {
    if (key) {
      // Fetch a document inside the collection
      const docRef = doc(this.firestore, json, key.toString());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } else {
      // Fetch all documents in a collection
      const colRef = collection(this.firestore, json);
      const querySnap = await getDocs(colRef);
      const result: any = {};
      querySnap.forEach((docSnap) => {
        result[docSnap.id] = docSnap.data();
      });
      return result;
    }
  }

  async setDocument(collectionName: string, docId: string, data: any) {
    const docRef = doc(this.firestore, collectionName, docId);
    let paylod = {};
    if (docId == 'default') {
      paylod = {
        data: data,
      };
    } else {
      paylod = data;
    }
    await setDoc(docRef, paylod);
  }

  async uploadData(data: Record<string, any>, collectionName: string) {
    for (const key in data) {
      const docData = data[key];
      // ✅ Skip if the object is null, undefined, or empty
      if (!docData) {
        continue;
      }
      await this.setDocument(collectionName, key, docData);
    }
  }
}
