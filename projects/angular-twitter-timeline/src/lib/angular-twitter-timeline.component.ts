import {Component, ElementRef, Input, OnChanges, OnDestroy, ErrorHandler, inject} from '@angular/core';
import {AngularTwitterTimelineService} from "./angular-twitter-timeline.service";
import {AngularTwitterTimelineOptionsInterface} from "./angular-twitter-timeline-options.interface";
import {AngularTwitterTimelineDataInterface} from "./angular-twitter-timeline-data.interface";

@Component({
  selector: 'angular-twitter-timeline',
  template: ``,
  standalone: true,
  providers: [AngularTwitterTimelineService]
})
export class AngularTwitterTimelineComponent implements OnChanges, OnDestroy {
  private errorHandler = inject(ErrorHandler);
  @Input() data?: AngularTwitterTimelineDataInterface;
  /**
   * A hash of additional options to configure the widget
   */
  @Input() opts?: AngularTwitterTimelineOptionsInterface;

  defaultOpts: AngularTwitterTimelineOptionsInterface = {
    tweetLimit: 5
  };

  defaultData: AngularTwitterTimelineDataInterface = {
    sourceType: 'url',
    url: 'https://twitter.com/mustafaer_dev',
    screenName: 'Mustafa ER'
  };

  constructor(
    private element: ElementRef,
    private twitterTimelineService: AngularTwitterTimelineService
  ) {
  }

  ngOnChanges() {
    if (this.data && this.data.sourceType) {
      switch (this.data.sourceType) {
        case 'url':
          delete this.defaultData.screenName;
          break;
        case 'profile':
          delete this.defaultData.url;
          break;
        default:
          break;
      }
      this.loadTwitterWidget();
    }
  }

  loadTwitterWidget() {
    this.twitterTimelineService
      .loadScript()
      .subscribe({
        next: () => {
          let nativeElement = this.element.nativeElement;
          nativeElement.innerHTML = "";
          (window as any)['twttr']
            .widgets
            .createTimeline(
              {...this.defaultData, ...this.data},
              nativeElement,
              {...this.defaultOpts, ...this.opts}
            )
            .then(() => {
            })
            .catch((error: unknown) => this.handleError(error))
        },
        error: (error: unknown) => this.handleError(error),
      });
  }

  private handleError(error: unknown): void {
    this.errorHandler.handleError(error);
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources if needed
  }

}
