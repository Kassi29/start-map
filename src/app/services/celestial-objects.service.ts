import {Injectable} from '@angular/core';
import {
  AstroTime,
  Body,
  Equator,
  EquatorialCoordinates,
  HorizonFromVector,
  Illumination,
  IlluminationInfo,
  Observer,
  RotateVector,
  Rotation_EQJ_HOR,
  Spherical,
  Vector,
  VectorFromSphere
} from 'astronomy-engine';
import {BRIGHT_STARS} from '../models/constants/bright-starts.constant';
import {ProjectedElement} from '../models/projected-element.interface';
import {GALAXIES} from '../models/constants/galaxies.constant';
import {CelestialObjectInterface} from '../models/celestial-object.interface';
import {ConstellationLineConstant} from '../models/constellation-line.constant';
import {CONSTELLATION_LINES} from '../models/constants/constellation-lines.constant';

@Injectable({
  providedIn: 'root',
})
export class CelestialObjectsService {
  private readonly _CELESTIAL_CHART_RADIUS = 200;
  private readonly _VIEWPORT_CENTER_OFFSET = 410;

  constructor() {
  }

  public getConstellationLines(projectedStars: ProjectedElement[]): ConstellationLineConstant[] {
    return this._mapStarsToLines(projectedStars);
  }

  public getProjectedGalaxies(date: Date, latitude: number, longitude: number): ProjectedElement[] {
    return this._projectObjects(GALAXIES, date, latitude, longitude);
  }

  public getProjectedPlanets(date: Date, latitude: number, longitude: number) {
    const planetData = this._getPlanetsData(date, latitude, longitude);

    return this._projectObjects(planetData, date, latitude, longitude);
  }

  public getProjectedStars(date: Date, latitude: number, longitude: number): ProjectedElement[] {
    return this._projectObjects(BRIGHT_STARS, date, latitude, longitude);
  }

  private _projectObjects(elementToProject: CelestialObjectInterface[], date: Date, latitude: number, longitude: number): ProjectedElement[] {
    const observer: Observer = new Observer(latitude, longitude, 0);
    const time: AstroTime = new AstroTime(date);

    const rotationMatrix = Rotation_EQJ_HOR(time, observer);

    return elementToProject.map((element: CelestialObjectInterface) => {
      const sphere: Spherical = new Spherical(element.declination, element.rightAscension * 15, 1.0);
      const vector: Vector = VectorFromSphere(sphere, time);
      const horizontalVector: Vector = RotateVector(rotationMatrix, vector);
      const horizon: Spherical = HorizonFromVector(horizontalVector, 'normal');

      return this._mapToProjectedPoint(element, horizon);
    });
  }

  private _mapToProjectedPoint(element: CelestialObjectInterface, horizon: Spherical): ProjectedElement {
    const radialDistance = this._CELESTIAL_CHART_RADIUS * (90 - horizon.lat) / 90;
    const azimuthInRadians: number = (horizon.lon - 180) * Math.PI / 180;

    return {
      ...element,
      altitude: horizon.lat,
      azimuth: horizon.lon,
      x: this._VIEWPORT_CENTER_OFFSET + radialDistance * Math.sin(azimuthInRadians),
      y: this._VIEWPORT_CENTER_OFFSET + radialDistance * Math.cos(azimuthInRadians)
    };
  }

  private _getPlanetsData(date: Date, latitude: number, longitude: number): CelestialObjectInterface[] {
    const observer = new Observer(latitude, longitude, 0);
    const time: AstroTime = new AstroTime(date);

    const bodies: Body[] = [Body.Mercury, Body.Venus, Body.Mars, Body.Jupiter, Body.Saturn];

    return bodies.map((body: Body) => {
      const equator: EquatorialCoordinates = Equator(body, time, observer, true, true);
      const illumination: IlluminationInfo = Illumination(body, time);

      return {
        declination: equator.dec,
        magnitude: illumination.mag,
        name: body.toString(),
        rightAscension: equator.ra
      }
    });
  }

  private _mapStarsToLines(projectedStars: ProjectedElement[]) {
    const lines: ConstellationLineConstant[] = [];

    for (const connection of CONSTELLATION_LINES) {
      const starA = projectedStars.find((star: ProjectedElement) => star.name === connection.from);
      const starB = projectedStars.find((star: ProjectedElement) => star.name === connection.to);

      if (starA && starB && starA.altitude > 0 && starB.altitude > 0) {
        lines.push({
          x1: starA.x,
          y1: starA.y,
          x2: starB.x,
          y2: starB.y
        });
      }else {
        console.warn("nel pastel")
      }
    }

    return lines;
  }
}
