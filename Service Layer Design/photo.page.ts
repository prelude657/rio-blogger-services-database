import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthenticateService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';


export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage{

  

 // Upload Task 
 task: AngularFireUploadTask;

 // Progress in percentage
 percentage: Observable<number>;

 // Snapshot of uploading file
 snapshot: Observable<any>;

 // Uploaded File URL
 UploadedFileURL: Observable<string>;

 //Uploaded Image List
 images: Observable<MyData[]>;

 //File details  
 fileName:string;
 fileSize:number;

 //Status check 
 isUploading:boolean;
 isUploaded:boolean;

 private imageCollection: AngularFirestoreCollection<MyData>;
 constructor
 
 (private storage: AngularFireStorage, 
  private database: AngularFirestore,
  private firebaseService: FirebaseService,
  private navCtrl: NavController,
  private authService: AuthenticateService) 
  
  {
    this.isUploading = false;
   this.isUploaded = false;
   //Set collection where our documents/ images info will save
   this.imageCollection = database.collection<MyData>('Rio Photos');
   this.images = this.imageCollection.valueChanges();
 }


 uploadFile(event: FileList) {
   

   // The File object
   const file = event.item(0)

   // Validation for Images Only
   if (file.type.split('/')[0] !== 'image') { 
    console.error('unsupported file type :( ')
    return;
   }

   this.isUploading = true;
   this.isUploaded = false;


   this.fileName = file.name;

   // The storage path
   const path = `BlogStorage/${new Date().getTime()}_${file.name}`;

   // Totally optional metadata
   const customMetadata = { app: 'Rio Blog APP' };

   //File reference
   const fileRef = this.storage.ref(path);

   // The main task
   this.task = this.storage.upload(path, file, { customMetadata });

   // Get file progress percentage
   this.percentage = this.task.percentageChanges();
   this.snapshot = this.task.snapshotChanges().pipe(
     
     finalize(() => {
       // Get uploaded file storage path
       this.UploadedFileURL = fileRef.getDownloadURL();
       
       this.UploadedFileURL.subscribe(resp=>{
         this.addImagetoDB({
           name: file.name,
           filepath: resp,
           size: this.fileSize
         });
         this.isUploading = false;
         this.isUploaded = true;
       },error=>{
         console.error(error);
       })
     }),
     tap(snap => {
         this.fileSize = snap.totalBytes;
     })
   )
 }

 addImagetoDB(image: MyData) {
   //Create an ID for document
   const id = this.database.createId();

   //Set document id with value in database
   this.imageCollection.doc(id).set(image).then(resp => {
     console.log(resp);
   }).catch(error => {
     console.log("error " + error);
   });
 }
 logout() {
  this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    })

  }}