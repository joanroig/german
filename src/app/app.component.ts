import { Component, ChangeDetectorRef } from '@angular/core';
import chapters from '../assets/chapters.json';
import topics from '../assets/topics.json';
import { HttpClient } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { Group } from './group.model.js';

export enum GroupTypes {
  chapters,
  topics
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'German';
  events: string[] = [];
  opened = true;

  public groupTypes = GroupTypes;
  groupBy = GroupTypes.topics;

  chapters: Group;
  topics: Group;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  selected: string;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private http: HttpClient) {
    this.chapters = chapters;
    this.topics = topics;

    this.loadFile(Object.values(chapters)[0][0].file);

    // Object.entries(chapters).forEach(
    //   ([key, value]) => this.loadFile(value[0].file));

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
