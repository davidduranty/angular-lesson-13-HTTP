import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private placesService = inject(PlacesService)
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef)
  isFetching = signal(false);
  error = signal('');



  ngOnInit(): void {
    const subscription =
      this.placesService.loadUserPlaces().subscribe(
        {
          next: (places) => {
            this.places.set(places)
          },
          complete: () => {
            this.isFetching.set(false);
          },
          error: (error: Error) => {
            this.error.set(error.message)
          }
        }
      )
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  deletePlace(selectedPlace: Place) {
    this.placesService.removeUserPlace(selectedPlace).subscribe()
  }
}
