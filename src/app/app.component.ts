import { Component, ChangeDetectorRef } from '@angular/core';
import docs from '../documents.json';
import { Doc } from './documents.model.js';
import { HttpClient } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'German';
  events: string[] = [];
  opened = true;
  documents: Doc[];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  selected: string;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private http: HttpClient) {
    this.documents = docs;
    this.loadFile(docs[0].file);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  loadFile(file: string) {
    this.http.get<string>(file, { responseType: 'text' as 'json' }).subscribe(data => {
      // console.log(data);
      this.selected = data;
    });
  }

}
