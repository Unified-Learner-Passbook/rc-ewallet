import { Component, OnInit } from '@angular/core';
import * as opp from '../../assets/config/ui-config/opportunities.json';

@Component({
  selector: 'app-opportunitie',
  templateUrl: './opportunitie.component.html',
  styleUrls: ['./opportunitie.component.scss']
})
export class OpportunitieComponent implements OnInit {
  opportunities: any[];

  constructor() { }

  ngOnInit(): void {
    this.opportunities= (opp as any).default;
  }
}