import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import ISO6391 from 'iso-639-1';
import { AuthConfigService } from './authentication/auth-config.service';

export function initLang(http: HttpClient, translate: TranslateService, authConfig: AuthConfigService) {

  return () => {
    const defaultSetLanguage = 'en';
    const localUrl = `${authConfig?.config?.languageFolder}/local` || '/assets/i18n/local';
    const globalUrl = `${authConfig?.config?.languageFolder}/global` || '/assets/i18n/global';

    const suffix = '.json';
    const local = '-local';
    const global = '-global';

    const storageLocale = localStorage.getItem('setLanguage');
    const setLanguage = storageLocale || defaultSetLanguage;

    forkJoin([
      http.get(`${localUrl}/${setLanguage}${local}${suffix}`).pipe(
        catchError(() => of(null))
      ),
      http.get(`${globalUrl}/${setLanguage}${global}${suffix}`).pipe(
        catchError(() => of(null))
      )
    ]).subscribe((response: any[]) => {
      const devKeys = response[0];
      const translatedKeys = response[1];

      translate.setTranslation(defaultSetLanguage, devKeys || {});
      translate.setTranslation(setLanguage, translatedKeys || {}, true);

      translate.setDefaultLang(defaultSetLanguage);

      const languages = authConfig.config.languages;
      let installedLanguages = [];

      for (let i = 0; i < languages.length; i++) {
        installedLanguages.push({
          "code": languages[i],
          "name": ISO6391.getNativeName(languages[i])
        });
      }

      localStorage.setItem('languages', JSON.stringify(installedLanguages));
      translate.addLangs(languages);

      if (localStorage.getItem('setLanguage') && languages.includes(localStorage.getItem('setLanguage'))) {
        translate.use(localStorage.getItem('setLanguage'));
      } else {
        const browserLang = translate.getBrowserLang();
        let lang = languages.includes(browserLang) ? browserLang : defaultSetLanguage;
        translate.use(lang);
        localStorage.setItem('setLanguage', lang);
      }
    });
  };
}
