import * as React from 'react';
import styles from './Applications.module.scss';
import { IApplicationsProps } from './IApplicationsProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class Applications extends React.Component<IApplicationsProps, {}> {
  
  private items:any;
  private myitems:any;
  private defaultIds = [];
  
  public render(): React.ReactElement<IApplicationsProps> {
    
    let self = this;

    function openList(){
      window.open( self.props.absoluteUrl + "/Lists/MyApplications/MyApps.aspx");
    }

    this.items = this.props.cantralAppsResult.map((item, key) => {
      if(item.Default){
        this.defaultIds.push(item.Id);
        return getAppItem(item);
      }
    });

    if(this.props.myAppsResult.length > 0){
      this.myitems = this.props.cantralAppsResult.map((item, key) => {
        if(item.Id == this.props.myAppsResult[0].Application1Id || item.Id == this.props.myAppsResult[0].Application2Id){
          if(this.defaultIds.indexOf(item.Id) == -1){
            return getAppItem(item);
          }
        }
      });
    }

    function getAppItem(item) {
      var target = item.OpenNewWindow ? '_blank' : '_self';
      var color = item.Color == 'Blue' ? styles.Blue : styles.Green;
      //console.info(item);
      return <a href={item.Link} target={target} className={styles.applicationItem + ' ' + color}><div className={styles.applicationItemCard}><div className={styles.applicationIconContainer}><Icon iconName={item.Icon} className={styles.applicationIcon} /></div><div className={styles.applicationTitle}>{item.Title}</div></div></a>;
    }
    
    return (
      <div className={ styles.applications }>
        <div className={styles.wptitle}>
          <Icon iconName='AppIconDefault' className={styles.wptitleIcon} />
          <span>{this.props.title}</span>
          <div className={styles.addAppContainer} title="Set my applications" onClick={openList}>
            <Icon iconName='AppIconDefaultAdd' id="addAppButton" className={styles.wptitleIcon} />
          </div>
        </div>
        <div>
          {this.items}
          {this.myitems}
          <div className={styles.clear}></div>
        </div>
      </div>
    );
  }
}
