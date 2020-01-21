import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import chapters from '../assets/chapters.json';
import topics from '../assets/topics.json';
import { HttpClient } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { Group, Lesson } from './group.model';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

export enum GroupTypes {
  chapter = 'chapter',
  topic = 'topic'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'German';
  events: string[] = [];
  opened = true;

  public groupTypes = GroupTypes;
  groupBy = GroupTypes.topic;

  chapters: Group;
  topics: Group;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  groupName: string;
  lessonContent: string;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private http: HttpClient,
    private location: Location,
    private router: Router) {

    this.chapters = chapters;
    this.topics = topics;

    // this.loadFile(Object.values(chapters)[0][0].file);

    // Object.entries(chapters).forEach(
    //   ([key, value]) => this.loadFile(value[0].file));

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {

    // Change the selection on url change
    this.router.events.subscribe(event => {
      if (this.location.path() !== '') {
        const urlParts = this.location.path().split('/');
        const groupType = urlParts[1];
        this.groupName = urlParts[2];
        const lessonId = urlParts[3];
        var selected: Lesson;
        ;
        switch (groupType) {
          case GroupTypes.chapter:
            selected = this.chapters[this.groupName].find(a => a.id === lessonId);
            break;
          case GroupTypes.topic:
            selected = this.topics[this.groupName].find(a => a.id === lessonId);
            break;
          default:
            console.error('Group type not recognized!');
        }
        this.title = selected.title;
        this.loadFile(selected.file);
      }
    });

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  loadFile(file: string) {

    this.http.get<string>(file, { responseType: 'text' as 'json' }).subscribe(data => {
      this.lessonContent = data;
    });
  }

  // Workaround for angular component issue #13870
  disableAnimation = true;
  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }

}
