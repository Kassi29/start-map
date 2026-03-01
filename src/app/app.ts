import {Component, signal} from '@angular/core';
import {StarComponent} from './components/star-component/star-component';

@Component({
  selector: 'app-root',
  imports: [StarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
