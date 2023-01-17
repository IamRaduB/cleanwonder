import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import iconsConfig from '@core/icons.config';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements AfterViewInit {
  @ViewChild('icon') iconRef!: ElementRef<SVGElement>;

  @Input()
  icon!: string;
  @Input()
  size = 'w-4 h-4'
  @Input()
  color = 'text-white'

  viewbox!: string;

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.iconRef.nativeElement.innerHTML = iconsConfig[this.icon].path;
      this.viewbox = iconsConfig[this.icon].viewbox;
    })
  }

}
