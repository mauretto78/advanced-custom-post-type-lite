// External Dependencies
import React, {Component} from 'react';
// Internal Dependencies
import './style.css';

class Fields extends Component {

  static slug = 'acpt_fields';

  constructor(props){
    super(props);
  }

  render() {

    if(typeof this.props.__render === 'undefined'){
      return <div>Sorry, preview unavaliable.</div>;
    }

    return (
        <div dangerouslySetInnerHTML={{__html: this.props.__render}}/>
    );
  }
}

export default Fields;
