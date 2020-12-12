import {
  Component,
  ViewChild,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { timeInterval, tap, map } from 'rxjs/operators';
import { TimeDate } from './TimeDate';
@Component({
  selector: 'app-kb-basic-clock',
  templateUrl: './kb-basic-clock.component.html',
  styleUrls: ['./kb-basic-clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbBasicClockComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas') canvasRef: ElementRef;
  @Input() public width;
  @Input() public height;

  clockConfig = {
    numbersType: 'number' /* bullet,number*/,
    numberColor: '#ff0000',
    width: 200,
    height: 200,
    faceColor: '#fff',
    backgroundColor: '#000',
    frameColor: '#ff0000',
    handColors: {
      hourHandColor: '#ff0000',
      minHandColor: '#00ff00',
      secHandColor: '#0000ff',
    },
    handStyle: 'thinLine', /* solidLine,dashedLine,thinLine*/
    frameShape: 'square', /* square,circle*/
    dark: false,
  };

  canvasContext: CanvasRenderingContext2D;
  subscription: Subscription;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {}
  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvasRef.nativeElement;
    canvasEl.width = this.clockConfig.width;
    canvasEl.height = this.clockConfig.height;
    const radius = canvasEl.height / 2;
    const innerRadius = radius * 0.9;
    this.canvasContext = canvasEl.getContext('2d');
    this.canvasContext.translate(radius, radius);

    this.ngZone.runOutsideAngular(() => this.draw(innerRadius));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  draw(innerRadius: number) {
    this.subscription = timer(0, 1000)
      .pipe(
        tap((t) => {
          this.drawFace(this.canvasContext, innerRadius);
          this.drawNumbers(this.canvasContext, innerRadius);
          this.drawTime(this.canvasContext, innerRadius);
        })
      )
      .subscribe();
  }

  drawFace(ctx: CanvasRenderingContext2D, radius: number) {
    if (this.clockConfig.frameShape == 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.clockConfig.dark
        ? this.clockConfig.backgroundColor
        : this.clockConfig.faceColor;
      ctx.fill();
      const grad = ctx.createRadialGradient(
        0,
        0,
        radius * 0.95,
        0,
        0,
        radius * 1.05
      );
      grad.addColorStop(0, '#333');
      grad.addColorStop(0.5, this.clockConfig.frameColor);
      grad.addColorStop(1, '#333');
      ctx.strokeStyle = grad;
      ctx.lineWidth = radius * 0.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
      ctx.fillStyle = this.clockConfig.numberColor;
      ctx.fill();
    }
    if (this.clockConfig.frameShape == 'square') {
      ctx.fillStyle = this.clockConfig.dark
        ? this.clockConfig.backgroundColor
        : this.clockConfig.faceColor;
      ctx.fillRect(-100, -100, this.clockConfig.width, this.clockConfig.height);
      ctx.lineWidth = radius * 0.2;
      ctx.strokeStyle = this.clockConfig.frameColor;
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 2;
      ctx.strokeRect(
        -100,
        -100,
        this.clockConfig.width,
        this.clockConfig.height
      );
    }
  }

  drawNumbers(ctx: CanvasRenderingContext2D, radius: number) {
    let ang;
    let num;
    ctx.font = radius * 0.15 + 'px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = this.clockConfig.numberColor;
    for (num = 1; num < 13; num++) {
      ang = (num * Math.PI) / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      if (this.clockConfig.numbersType == 'number') {
        ctx.fillText(num.toString(), 0, 0);
      }
      if (this.clockConfig.numbersType == 'bullet') {
        ctx.fillText('•', 0, 0);
      }
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  drawTime(ctx: CanvasRenderingContext2D, radius: number) {
    const { seconds, minutes, hours } = new TimeDate(new Date());
    const hourHand =
      ((hours % 12) * Math.PI) / 6 +
      (minutes * Math.PI) / (6 * 60) +
      (seconds * Math.PI) / (360 * 60);
    this.drawHand(
      ctx,
      hourHand,
      radius * 0.5,
      radius * 0.07,
      this.clockConfig.handColors.hourHandColor
    );

    const minuteHand =
      (minutes * Math.PI) / 30 + (seconds * Math.PI) / (30 * 60);
    this.drawHand(
      ctx,
      minuteHand,
      radius * 0.8,
      radius * 0.07,
      this.clockConfig.handColors.minHandColor
    );

    const secondHand = (seconds * Math.PI) / 30;
    this.drawHand(
      ctx,
      secondHand,
      radius * 0.9,
      radius * 0.02,
      this.clockConfig.handColors.secHandColor
    );
  }

  drawHand(
    ctx: CanvasRenderingContext2D,
    pos: number,
    length: number,
    width: number,
    color: string
  ) {
    ctx.beginPath();
    if (this.clockConfig.handStyle == 'solidLine') {
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
    }
    if (this.clockConfig.handStyle == 'dashedLine') {
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);
      console.log(ctx.getLineDash());
    }
    if (this.clockConfig.handStyle == 'thinLine') {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }
}
