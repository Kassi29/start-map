import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {BehaviorSubject, map, Observable, shareReplay} from 'rxjs';
import {CommonModule, DatePipe} from '@angular/common';
import {ProjectedElement} from '../../models/projected-element.interface';
import {CelestialObjectsService} from '../../services/celestial-objects.service';
import {MILESTONES} from '../../models/constants/milestones.constant';
import {CelestialMoment} from '../../models/celestial-moment.interface';

@Component({
  selector: 'app-star-component',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './star-component.html',
  styleUrl: './star-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarComponent implements OnInit {

  public currentIndex = 0;

  private readonly activeMomentSource = new BehaviorSubject<CelestialMoment>(MILESTONES[this.currentIndex]);

  public readonly activeMoment$ = this.activeMomentSource.asObservable();

  private readonly _GEOGRAPHIC_LATITUDE = -16.5000;
  private readonly _GEOGRAPHIC_LONGITUDE = -68.1500;
  private readonly _celestialObjectsService = inject(CelestialObjectsService);

  public readonly projectedCelestialData$: Observable<{
    galaxies: ProjectedElement[],
    planets: ProjectedElement[],
    stars: ProjectedElement[],
  }> = this.activeMoment$.pipe(
    map((moment) => {
      const coords = {
        date: moment.occurrenceDate,
        lat: this._GEOGRAPHIC_LATITUDE,
        lon: this._GEOGRAPHIC_LONGITUDE
      };

      const stars = this._celestialObjectsService.getProjectedStars(coords.date, coords.lat, coords.lon);
      const galaxies = this._celestialObjectsService.getProjectedGalaxies(coords.date, coords.lat, coords.lon);
      const planets = this._celestialObjectsService.getProjectedPlanets(coords.date, coords.lat, coords.lon)

      return {stars, galaxies, planets};
    }),
    shareReplay(1)
  );

  public nextMoment(): void {
    this.currentIndex = (this.currentIndex + 1) % MILESTONES.length;

    this.activeMomentSource.next(MILESTONES[this.currentIndex]);
  }

  public prevMoment(): void {
    this.currentIndex = (this.currentIndex - 1 + MILESTONES.length) % MILESTONES.length;

    this.activeMomentSource.next(MILESTONES[this.currentIndex]);
  }

  public calculateVisualRadius(magnitude: number): number {
    const BASE_RADIUS = 4;
    return Math.max(0.8, BASE_RADIUS - magnitude);
  }

  public ngOnInit(): void {
    console.log(
      "%cTe amo mi amorcitlo lindo, lo hice con mucho amor <3",
      "color: #d199ff; font-size: 18px; font-weight: bold; font-family: 'Courier New', monospace; text-shadow: 0 0 8px rgba(209, 153, 255, 0.8);"
    );
  }
}
