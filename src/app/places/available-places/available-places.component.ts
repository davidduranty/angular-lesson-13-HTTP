import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  private placesService = inject(PlacesService)
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private destroyRef = inject(DestroyRef)


  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription =
      this.placesService.loadAvailablePlaces().subscribe(
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

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe()

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }


}
