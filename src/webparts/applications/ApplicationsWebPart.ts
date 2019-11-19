import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ApplicationsWebPartStrings';
import Applications from './components/Applications';
import { IApplicationsProps } from './components/IApplicationsProps';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface IApplicationsWebPartProps {
  title: string;
  cantralAppsResult: any;
  myAppsResult:any;
  absoluteUrl: string;
}

export default class ApplicationsWebPart extends BaseClientSideWebPart<IApplicationsWebPartProps> {

  private centralApps;
  private centralAppsinit = false;
  private myApps;
  private myAppsinit = false;

  public onInit<T>(): Promise<T> {
    let cquery = '';
    //cquery += '$filter=(Default eq 1)&';
    //cquery += '$top=4';
    this._getListData(cquery,'Applications').then((response) => {
      this.centralApps = response.value;
      this.centralAppsinit = true;
      this.render();
    });

    let mquery = '';
    mquery += '$filter=AuthorId eq ' + this.context.pageContext.legacyPageContext.userId +'&';
    //mquery += '$top=100&';
    //mquery += '$orderby=EventDate asc';
    this._getListData(mquery,'My Applications').then((response) => {
      this.myApps = response.value;
      this.myAppsinit = true;
      this.render();
    });
    return Promise.resolve();
  }

  private _getListData(query:string,listName:string): Promise<any> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/Lists/GetByTitle('`+listName+`')/Items?` + query, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  public render(): void {
    const element: React.ReactElement<IApplicationsProps > = React.createElement(
      Applications,
      {
        title: this.properties.title,
        cantralAppsResult: this.centralApps,
        myAppsResult: this.myApps,
        absoluteUrl: this.context.pageContext.site.absoluteUrl,
      }
    );
    
    if(this.centralAppsinit && this.myAppsinit){
      ReactDom.render(element, this.domElement);
    }
    
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
