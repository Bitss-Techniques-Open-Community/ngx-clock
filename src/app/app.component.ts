import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  clockConfig = {
    numbersType: '',
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
