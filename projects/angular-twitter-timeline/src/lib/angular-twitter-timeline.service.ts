import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AngularTwitterTimelineService {
  private TWITTER_SCRIPT_ID = 'twitter-wjs';
  private TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js';

  loadScript(): Observable<unknown> {
    return new Observable((observer) => {

      this.startScriptLoad();

      (window as any)['twttr'].ready((twttr: unknown) => {
        observer.next(twttr);
        observer.complete();
      });

    });
  }

  private startScriptLoad(): void {
    (window as any)['twttr'] = (function (d: Document, s: string, id: string, url: string) {
      let script: HTMLScriptElement,
        firstScriptEl: Element = d.getElementsByTagName(s)[0],
        twitterScript: any = (window as any)['twttr'] || {};
      if (d.getElementById(id)) {
        return twitterScript;
      }

      script = d.createElement(s) as HTMLScriptElement;
      script.id = id;
      script.src = url;
      firstScriptEl.parentNode?.insertBefore(script, firstScriptEl);

      twitterScript._e = [];

      twitterScript.ready = function (f: () => void) {
        twitterScript._e.push(f);
      };

      return twitterScript;
    }(document, 'script', this.TWITTER_SCRIPT_ID, this.TWITTER_WIDGET_URL));
  }
}
