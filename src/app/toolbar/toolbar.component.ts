import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent {
  title = 'Angular 5 CRUD Mat-Table Http';

  @Output()
  onRefreshClick = new EventEmitter();

  refresh() {
    this.onRefreshClick.emit();
  }
}
