import React from 'react';
import {Menu, Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default() => {
    return(
        <Menu stackable style={{marginTop: '50px'}}>
            <Button color='blue' as={Link} to='/'>Main</Button>
            <Button color='red' as={Link} to='/admin'>Admin Panel</Button>
        </Menu>
    );
}