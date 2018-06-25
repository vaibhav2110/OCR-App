import { Camera, PictureSourceType } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { NgProgress } from '@ngx-progressbar/core';
import * as Tesseract from 'tesseract.js';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    
    selectedImage: string;
    imageText: string;

  constructor(public navCtrl: NavController, private ac: ActionSheetController, private camera: Camera, public progress: NgProgress) {

  }
    
    selectSource(){
        let actionSheet = this.ac.create({
            buttons: [
                {
                    text: 'Use Library',
                    handler: ()=> {
                        this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Capture Image',
                    handler: ()=> {
                        this.getPicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }
    
    getPicture(sourceType: PictureSourceType){
        this.camera.getPicture({
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            allowEdit: true,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }).then(imageData => {
            console.log(imageData);
            this.selectedImage = `data:image/jpeg;base64,${imageData}`;
        });
    }

    recognizeImage(){
        Tesseract.recognize(this.selectedImage)
        .progress(message => {
            console.log(message);
            if(message.status === 'recognizing text'){
                this.progress.set(message.progress);
            }
            
        })
        .catch(err => console.log(err))
        .then(result => {
            console.log(result);
            this.imageText = result.text;
        })
        .finally(resultOrError => {
            this.progress.complete();
        });
    }
}
