import {Component, ElementRef, input, OnDestroy, ErrorHandler, inject, effect, signal} from '@angular/core';
import {AngularTwitterTimelineService} from "./angular-twitter-timeline.service";
import {AngularTwitterTimelineOptionsInterface} from "./angular-twitter-timeline-options.interface";
import {AngularTwitterTimelineDataInterface} from "./angular-twitter-timeline-data.interface";

@Component({
  selector: 'angular-twitter-timeline-standalone',
  template: ``,
  standalone: true,
  providers: [AngularTwitterTimelineService]
})
export class AngularTwitterTimelineStandaloneComponent implements OnDestroy {
  private errorHandler = inject(ErrorHandler);
  private element = inject(ElementRef);
  private twitterTimelineService = inject(AngularTwitterTimelineService);

  // Modern signal inputs
  data = input<AngularTwitterTimelineDataInterface>();
  opts = input<AngularTwitterTimelineOptionsInterface>();

  // Internal state
  private isLoading = signal(false);

  readonly defaultOpts: AngularTwitterTimelineOptionsInterface = {
    tweetLimit: 5
  };

  readonly defaultData: AngularTwitterTimelineDataInterface = {
    sourceType: 'url',
    url: 'https://twitter.com/mustafaer_dev',
    screenName: 'Mustafa ER'
  };

  constructor() {
    // Use effect to react to input changes
    effect(() => {
      const currentData = this.data();
      if (currentData?.sourceType) {
        this.loadTwitterWidget();
      }
    });
  }

  private loadTwitterWidget(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    const currentData = this.data();

    if (!currentData) return;

    // Update default data based on source type
    const updatedDefaultData = { ...this.defaultData };
    switch (currentData.sourceType) {
      case 'url':
        delete updatedDefaultData.screenName;
        break;
      case 'profile':
        delete updatedDefaultData.url;
        break;
    }

    this.twitterTimelineService
      .loadScript()
      .subscribe({
        next: () => {
          const nativeElement = this.element.nativeElement;
          nativeElement.innerHTML = "";

          (window as any)['twttr']
            .widgets
            .createTimeline(
              { ...updatedDefaultData, ...currentData },
              nativeElement,
              { ...this.defaultOpts, ...this.opts() }
            )
            .then(() => {
              this.isLoading.set(false);
            })
            .catch((error: unknown) => {
              this.isLoading.set(false);
              this.handleError(error);
            });
        },
        error: (error: unknown) => {
          this.isLoading.set(false);
          this.handleError(error);
        },
      });
  }

  private handleError(error: unknown): void {
    this.errorHandler.handleError(error);
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources if needed
  }
}