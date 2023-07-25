import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInteractEventInput } from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';
import { CredentialService } from '../services/credential/credential.service';
import { SchemaService } from '../services/data/schema.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  sidebarFor = 'default';
  tabList: any[];
  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly credentialService: CredentialService,
    private readonly schemaService: SchemaService
  ) { }

  ngOnInit(): void {
    this.schemaService.getToolbarJson().subscribe((schemaRes) => {
      const filtered = schemaRes.sidebar.filter(obj => {
        return Object.keys(obj)[0] === this.sidebarFor;
      });
      this.tabList = filtered[0][this.sidebarFor];
    });
  }

  clearCredentials() {
    this.credentialService.credentialList = [];
    this.credentialService.selectedCategory = '';
  }

  raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
    const telemetryInteract: IInteractEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: []
      },
      edata: {
        id,
        type,
        subtype,
        pageid: 'toolbar',
      }
    };
    this.telemetryService.interact(telemetryInteract);
  }
}
