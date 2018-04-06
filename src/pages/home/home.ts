import { Component } from '@angular/core';
import {ActionSheetController, NavController, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {SMS} from "@ionic-native/sms";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [SMS]
})
export class HomePage {

  smsList = [];
  refresher;

  constructor(public navCtrl: NavController, private http: HttpClient,
              private actionSheet: ActionSheetController,
              private toastCtrl: ToastController,
              private smsPlugin: SMS) {
    this.refresh();
  }

  refresh() {
    this.http.get<any[]>('http://api.agava.rs/communication/GetSms').subscribe(
      data => {
        this.smsList = data;
        if (this.refresher) {
          this.refresher.complete();
          this.refresher = null;
        }
      }
    );
  }

  pullToRefresh(e) {
    this.refresher = e;
    setTimeout(() => this.refresh(), 1500);
  }

  send(sms) {
    this.actionSheet.create({
      title: 'Izabrana poruka',
      subTitle: sms.text,
      buttons: [
        {text: "Pošalji SMS", handler: () => this.sendSelectedMessage(sms)},
        {text: "Otkaži", role: "cancel"}
      ]
    }).present();
  }

  sendSelectedMessage(sms) {
    this.smsPlugin.send(sms.phoneNumbers, sms.text).then(
      () => {
        const ix = this.smsList.indexOf(sms);
        this.smsList.splice(ix, 1);
        this.toastCtrl.create({message: 'SMS je uspešno poslat', duration: 2000}).present();
      }
    ).catch(err => {});
  }
}
