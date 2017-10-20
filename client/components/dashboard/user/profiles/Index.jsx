import React from 'react';

// Components
import Create from 'components/dashboard/user/profiles/Create';
import List from 'components/dashboard/user/profiles/List';
import Edit from 'components/dashboard/user/profiles/Edit';

export default () => {
  switch (location.hash.split('/')[4]) {
    case undefined: return <List />
    case 'create': return <Create />
    default: return <Edit />
  }
}