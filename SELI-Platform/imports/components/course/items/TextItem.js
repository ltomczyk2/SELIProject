import React from 'react';
import MenuItem from './MenuItem';
import Divider from '@material-ui/core/Divider';

export default class TextItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }



  componentDidMount(){
    
  }

  render() {
    return(
      <div className="content-box">
        <div className="text-content-item">
          {
            this.props.item.attributes.type === 'title' ?
              <div>
                <div className="text-item-title" style={{textAlign: this.props.item.attributes.alignment}}>
                  {this.props.item.attributes.content}
                </div>
                <Divider light={true}/>
              </div>
            :
            undefined
          }
          {
            this.props.item.attributes.type === 'section' ?
              <div className="text-item-section" style={{textAlign: this.props.item.attributes.alignment}}>
                {this.props.item.attributes.content}
              </div>
            :
            undefined
          }
          {
            this.props.item.attributes.type === 'subtitle' ?
              <div className="text-item-subtitle" style={{textAlign: this.props.item.attributes.alignment}}>
                {this.props.item.attributes.content}
              </div>
            :
            undefined
          }
        </div>
        <div className="menu-content-item">
          <MenuItem
            item={this.props.item}
            removeItem={this.props.removeItem.bind(this)}
          />
        </div>
      </div>
      );
    }
  }