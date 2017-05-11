import React from 'react';

// Components
import Delete from 'components/dashboard/developer/Delete';
import Edit from 'components/dashboard/developer/Edit';
import View from 'components/dashboard/developer/View';

export default class ManageService extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    // #/dashboard/developer/:id[/:action]
    const id = this.props.hash[3];
    const hash = '#/dashboard/developer/' + id;
    
    const view = (() => {
      switch (this.props.hash[4]) {
        case 'delete':
          return <Delete id={id} />;
        case 'edit':
          return <Edit id={id} />;
        default:
          return <View id={id} />;
      }
    })();

    return (
      <div className='dashboard-body manage'>
        <nav className='navbar-sub'>
          <a href={hash + '/view'}>View</a>
          <a href={hash + '/edit'}>Edit</a>
          <a href={hash + '/delete'}>Delete</a>
        </nav>
        
        {view}
      </div>
    );
  }

}