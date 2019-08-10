import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'

const colorArray = [
  "red",
  "lightblue",
  "pink",
  "yellow",
  "brown",
  "magenta"
];
let used_color = 0;

let fake_data = [
	{
		classname:"ECE297",
		weekday: 2,
		// 0-12 + 9
		start_time: 9,
		end_time: 12
	}
]

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
		// empty map
		for(let i = 0; i < 12; i++){
			map[i] = []
			for(let j = 0; j < header.length; j++){
				map[i].push('')
			}
		}

		// with the course
		for(let i = 0; i < fake_data.length; i++){
			console.log(fake_data[i])
			const {classname, weekday, start_time, end_time} = fake_data[i]
			for(let j = start_time - 9; j < end_time - 9; j ++){
				const previous = map[j][weekday]
				map[j][weekday] = classname + ' ' + previous;
			}
		}

		
		let table_comp = []
		for(let i = 0; i < 12; i++){
			let temp = []
			for(let j = 0; j < header.length; j++){
				// if 0 it is time slot
				if(j === 0){
					temp.push(
						<div>
							<Table.Cell> {i+9} - {i+10}  o'clock</Table.Cell>
						</div>
					)
				}
				else{
					let color = {backgroundColor:colorArray[used_color]}
					temp.push(
							// <Table.Cell style={color}>{map[i][j]}</Table.Cell>
							<Table.Cell>{map[i][j]}</Table.Cell>
					)
				}
			}
			table_comp.push(<Table.Row>
			        {temp}
			      </Table.Row>)
			used_color += 1;
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