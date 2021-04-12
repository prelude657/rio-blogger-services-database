// dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  options: VideoOptions
  userEmail: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private videoPlayer: VideoPlayer
  )  
  { this.options = {
    scalingMode: 0,
    volume: 0.5
  };
}

showSuccessAlert() {
  Swal.fire('Time to write a blog!', 'Add your blog post on the next screen. Please be informative. Your blog posts help others in the community', 'success')
}

  ngOnInit() {

    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })

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

