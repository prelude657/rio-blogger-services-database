import { Component,OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticateService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';




interface blogData {
  Name: string;
  Price: number;
  Description: string;
  Author: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  blogList = [];
  blogData: blogData;
  blogForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthenticateService
  ) {
    this.blogData = {} as blogData;
  }

  ngOnInit() {

    this.blogForm = this.fb.group({
      Name: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      Author: ['', [Validators.required]]
    })

    this.firebaseService.read_blog().subscribe(data => {

      this.blogList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Price: e.payload.doc.data()['Price'],
          Description: e.payload.doc.data()['Description'],
          Author: e.payload.doc.data()['Author']
        };
      })

    });
  }

  CreateRecord() {
    this.firebaseService.create_blog(this.blogForm.value)
      .then(resp => {
        //Reset form
        this.blogForm.reset();
      })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_blog(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditPrice= record.Price;
    record.EditDescription= record.Description;
    record.EditAuthor= record.Author;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Price'] = recordRow.EditPrice;
    record['Description'] = recordRow.EditDescription;
    record['Author'] = recordRow.EditAuthor;
    this.firebaseService.update_blog(recordRow.id, record);
    recordRow.isEdit = false;
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
  }
  

}
