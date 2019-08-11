import React from 'react';
import { Icon, Label, Menu, Table,Dropdown, Button } from 'semantic-ui-react'
import $ from 'jquery'

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
			header: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Firday'],
			options:[],
			course:[],
			current_course_option:0
		}

		$.get('http://localhost:5000/get_tables',{}, (data)=>{
			console.log(data)
			this.setState({options:data['result']})
		})
	}

	labelOnClick(evnet, target){
		console.log(target.value)
		let classname = {}
		for(let i = 0; i < target.value.length; i++){
			classname['classname'+i] = target.value[i]
		}

		$.get('http://localhost:5000/get_data',
			classname, 
			(data)=>{
				console.log(data)
				if(data['result'] === false){
					this.setState({course:[]})
				}
				// append result
				let course = data['result']
				this.setState({course})
			}
		)
	}

	buttonOnClick(evnet, target){
		console.log(target)
		this.setState({current_course_option:parseInt(target.value)})
	}

	render(){
		let {header, options, course, current_course_option} = this.state;
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

		let buttons = []
		if(course.length !== 0){
			// with the course map
			for(let i = 0; i < course[0].length; i++){
				// console.log(course[current_course_option][i])
				const {classname, weekday, start_time, end_time} = course[current_course_option][i]
				for(let j = start_time - 9; j < end_time - 9; j ++){
					const previous = map[j][weekday]
					map[j][weekday] = classname + ' ' + previous;
				}
			}

			// populating buttons
			for(let i = 0; i < course[current_course_option].length; i++){
				buttons.push(<Button value={i} onClick={this.buttonOnClick.bind(this)}>{i}</Button>)
			}
		}

		// populating component
		let table_comp = []
		for(let i = 0; i < 12; i++){
			let temp = []
			for(let j = 0; j < header.length; j++){
				// if 0 it is time slot
				if(j === 0){
					temp.push(
							<Table.Cell> {i+9} - {i+10}  o'clock</Table.Cell>
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

				<Dropdown
				    placeholder='Select Friend'
				    multiple
				    search
				    selection
				    fluid
				    options={options}
				    onChange = {this.labelOnClick.bind(this)}
				  />

				{buttons}

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