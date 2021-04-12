import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'BlogEntries';

  constructor(
    private firestore: AngularFirestore
  ) { }

  create_blog(record) {
    console.log(record);

    return this.firestore.collection(this.collectionName).add(record);
  }

  read_blog() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update_blog(recordID, record) {
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  delete_blog(record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }
}