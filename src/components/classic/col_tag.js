import React from 'react';
import $ from 'jquery';
import { Table, Icon, Label, Input } from 'semantic-ui-react'

class Col_Tag extends React.Component{
	constructor(props){
		super(props);

		console.log(this.props.data)
		this.state = {
			data:this.props.data
		}
	}

	render() {
		const {data} = this.state;
		const arr_length = data.length;
		const cells = [];
		cells.push(
			<Table.Row>
				<Table.Cell rowSpan={arr_length+1}>columns</Table.Cell>
			</Table.Row>
		);
		for(let j = 0; j < arr_length; j++){
			cells.push(
				<Table.Row>
					<Table.Cell width='two'>{data[j]}</Table.Cell>
				</Table.Row>
			);
		}

		return cells;
	}
}

export default Col_Tag;