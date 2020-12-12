import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  clockConfig = {
    numbersType: '',
    width: null,
    height: null,
    faceColor: '',
    backgroundColor: '',
    frameColor: '',
    handColors: {
      hourHandColor: '',
      minHandColor: '',
      secHandColor: '',
    },
    handStyle: '',
    frameStyle: '',
    frameShape: '',
  };
  title = 'khadija-clock';
}
