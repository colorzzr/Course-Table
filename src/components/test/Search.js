import React, {PureComponent} from 'react';
import { Dropdown, Input, Table,Button, Card } from 'semantic-ui-react'
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

import { Select } from 'antd';

const { Option } = Select;





class SearchUI extends PureComponent{
	constructor(props) {
		super(props);

		
	}


	// multiple allowAdditions
	render() {
		return (
			<div>
				<select className="browser-default custom-select">
				  <option selected>Open this select menu</option>
				  <option value="1">One</option>
				  <option value="2">Two</option>
				  <option value="3">Three</option>
				</select>
			</div>

		);
	}
}

export default SearchUI;