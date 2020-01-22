import { Component, ChangeDetectorRef, OnInit, HostListener } from '@angular/core';
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

  groupTypes = GroupTypes;
  groupBy = GroupTypes.chapter;

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

    // Open menu by default in browser but not in mobile
    this.opened = !this.mobileQuery.matches;

    // Change the selection on url change
    this.router.events.subscribe(event => {
      if (this.location.path() !== '') {
        const urlParts = this.location.path().split('/');
        const groupType = urlParts[1];
        this.groupName = urlParts[2];
        const lessonId = urlParts[3];
        var selected: Lesson;

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

        if (selected) {
          this.title = selected.title;
          this.loadFile(selected.file);
        } else {
          console.error('Route not found!');
        }
      }
    });

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  @HostListener('panright')
  openSidenav() {
    // open the sidenav
    if (this.mobileQuery.matches) {
      this.opened = true;
    }
  }

  @HostListener('panleft')
  closeSidenav() {
    // close the sidenav
    if (this.mobileQuery.matches) {
      this.opened = false
    }
  }

  loadFile(file: string) {
    this.http.get<string>(file, { responseType: 'text' as 'json' }).subscribe(data => {
      this.lessonContent = data;
      // Leave the menu opened in browser but not in mobile
      this.opened = !this.mobileQuery.matches;
    },
      err => {
        console.log(err);
        this.router.navigate(['/']);
      });
  }

  switchGroupType() {
    this.groupBy = this.groupBy === GroupTypes.chapter ? GroupTypes.topic : GroupTypes.chapter;
  }

  // Workaround for angular component issue #13870
  disableAnimation = true;
  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }

}
