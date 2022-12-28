import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';

@Component({
  selector: 'app-norequest-component',
  templateUrl: './norequest-component.component.html',
  styles: [
  ]
})
export class NorequestComponentComponent implements OnInit {

  constructor(
    private serverService: ServerService,
  ) { }

    ngOnInit(): void {
        this.serverService.closeServer();
    }
}
