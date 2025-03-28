import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient)
  loadedUserPlaces = this.userPlaces.asReadonly();


  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Something went wrong fetching the available places. Please try again later!!')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Something went wrong fetching your favorite places. Please try again later!!')
  }

  addPlaceToUserPlaces(place: Place) {
    return this.httpClient.put<{ places: Place }>('http://localhost:3000/user-places', {
      placeId: place.id,
    })
  }

  removeUserPlace(place: Place) {
    return this.httpClient.delete<{ places: Place }>(`http://localhost:3000/user-places/${place.id}`)
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
      .pipe(
        map((resData) => resData.places),
        catchError((error) => {
          console.log(error)
          return throwError(
            () =>
              new Error(errorMessage)
          )
        })
      )
  }

}
