import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'


class Classic extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			header: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Firday']
		}
	}

	render(){
		let {header} = this.state;
		let header_comp = []
		for(let i = 0; i < header.length; i++){
			header_comp.push(
				<Table.HeaderCell>{header[i]}</Table.HeaderCell>
			)
		}

		let map = [];
		for(let i = 0; i < 12; i++){
			map[i] = []
			for(let j = 0; j < header.length; j++){
				map[i].push(j)
			}
		}
		console.log(map)
		
		let table_comp = []
		for(let i = 0; i < 12; i++){
			let temp = []
			for(let j = 0; j < header.length; j++){
				// if 0 it is time slot
				if(j == 0){
					temp.push(<Table.Cell> {i+9} - {i+10}  o'clock</Table.Cell>)
				}
				else{
					temp.push(<Table.Cell>{j}</Table.Cell>)
				}
			}
			table_comp.push(<Table.Row>
			        {temp}
			      </Table.Row>)
		}

		return(
			<div>
				<h1>HHHHHH</h1>
				<Table celled>
			    <Table.Header>
			      <Table.Row>
			        {header_comp}
			      </Table.Row>
			    </Table.Header>

			    <Table.Body>
			      {table_comp}
			    </Table.Body>
			  </Table>
			</div>
			)
	}

}

export default Classic