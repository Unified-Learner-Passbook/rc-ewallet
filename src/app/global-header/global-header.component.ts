import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from "../../app/services/theme/theme.service";
import { AuthService } from '../services/auth/auth.service';
import { AuthConfigService } from '../authentication/auth-config.service';


@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent implements OnInit {

  @Input() showBackground = false;
  @Input() showTitle = false;
  @Input() showUsername = false;
  ELOCKER_THEME: string;

  title: string = 'ELOCKER';

  constructor(
    private readonly themeService: ThemeService,
    public readonly authService: AuthService,
    private readonly authConfigService: AuthConfigService
  ) { }

  ngOnInit(): void {
    this.ELOCKER_THEME = localStorage.getItem('ELOCKER_THEME');
    this.title = this.authConfigService.config.title;
    if (!this.ELOCKER_THEME) {
      localStorage.setItem('ELOCKER_THEME', "default");
    }
  }
  changeTheme() {
    if (this.ELOCKER_THEME == 'default') {
      this.ELOCKER_THEME = "dark";
    } else {
      this.ELOCKER_THEME = "default";
    }
    this.themeService.setTheme(this.ELOCKER_THEME);
    localStorage.setItem('ELOCKER_THEME', this.ELOCKER_THEME);
  }
}


