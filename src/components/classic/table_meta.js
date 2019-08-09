import React from 'react';
import $ from 'jquery';
import { Table, Dropdown, Icon, Button, Label, Input } from 'semantic-ui-react'
import Table_Tag from './table_tag'
import Col_Tag from './col_tag'



class Table_meta extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			colTagEdit:'',
			colTag:[],
		}

		this.dropdownItemClick = this.dropdownItemClick.bind(this);
		this.colTagEditOnclick = this.colTagEditOnclick.bind(this);
		this.newTagInput = this.newTagInput.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.tagRemove = this.tagRemove.bind(this);

		$.get('http://localhost:5003/meta_new/project/PERFCT',
			{},
			data => {
				console.log(data);
				let tables = [];
				const tables_names = data['table_names'];
				for(let i = 0; i < tables_names.length; i++){
					tables.push(<Dropdown.Item key={tables_names[i]} text={tables_names[i]} onClick={this.dropdownItemClick}/>)
				}
				this.setState({tables});
			}
		);
	}

	dropdownItemClick(event, data){
		console.log(data.text)
		const curTable = data.text;
		const url = 'http://localhost:5003/meta_new/project/PERFCT/table/'.concat(curTable)

		$.get(url, {}, data => {
				console.log(data);
				this.setState({data, curTable});
			}
		);
	}

	colTagEditOnclick(event, data){
		console.log(data);

		// get the current editing
		const {colTagEdit, curTable} = this.state;
		if(data.value !== colTagEdit){
			const col_name = data.value;
			// then only query clicked column tag
			const url = 'http://localhost:5003/meta_new/project/PERFCT/table/'+curTable+'/column/'+col_name+'/tag';
			$.get(url, {}, data => {
					this.setState({colTag:data['tag'], colTagEdit:col_name});
					console.log(data['tag'])
				}
			);
		}
		else{
			this.setState({colTag:[], colTagEdit:''});
		}
	}

	newTagInput(event, data){
		console.log(data)
		this.setState({newTagInput:data.value})
	}

	handleAddition(event, data_in){
		const {colTagEdit, newTagInput, curTable, colTag} = this.state;
		colTag.push(newTagInput)
		this.setState({colTag})

		// // call api to set in database
		const url = 'http://localhost:5003/meta_new/project/PERFCT/table/'+curTable+'/column/'+colTagEdit+'/tag/'+newTagInput;
		$.post(url, {}, data => {console.log(data)});
	}

	tagRemove(event, data){
		let {colTagEdit, colTag, curTable} = this.state;
		// remove from web array first
		colTag = colTag.filter(e => e !== data.value);
		this.setState({colTag})


		// call api to set in database
		const url = 'http://localhost:5003/meta_new/project/PERFCT/table/'+curTable+'/column/'+colTagEdit+'/tag/'+data.value;
		$.ajax({
			url:url,
			type:'delete',
			success: function(argument) {
				console.log(argument);
			}
		});
	}

	render(){
		const { tables, colTagEdit, data, curTable, colTag} = this.state;
		let cells = [];
		for(let key in data){
			if(key === 'cols'){
				const cols = data['cols'];
				const arr_length = cols.length;
				// push the field name
				cells.push(
					<Table.Row>
						<Table.Cell rowSpan={arr_length+1}>columns</Table.Cell>
					</Table.Row>
				);

				// push the all columns
				for(let j = 0; j < arr_length; j++){
					// if user want to edit the tag
					if(cols[j] === colTagEdit){
						// display existing tag
						let tag_labels = [];
						for(let k = 0; k < colTag.length; k++){
							tag_labels.push(
								<Label>{colTag[k]}  <Icon value={colTag[k]} onClick={this.tagRemove} name="blind"/></Label>
							)
						}

						// merge all cell together
						cells.push(
							<Table.Row>
								<Table.Cell width='two'>
									{cols[j] + " "}
									<Icon name="pencil alternate" value={cols[j]} onClick={this.colTagEditOnclick}/>
									{tag_labels}
									<Input type="text" placeholder="Search..." onChange={this.newTagInput}/>
									<Icon onClick={this.handleAddition} name="angle right"/>
								</Table.Cell>
							</Table.Row>
						);
					}
					else{
						cells.push(
							<Table.Row>
								<Table.Cell width='two'>
									{cols[j] + " "}
									<Icon name="pencil alternate" value={cols[j]} onClick={this.colTagEditOnclick}/>
								</Table.Cell>
							</Table.Row>
						);
					}
				}
			}
			else if(key === 'tag'){
				cells.push(<Table_Tag data={data['tag']} curTable={curTable}/>)
			}
			else{
				cells.push(
					<Table.Row>
						<Table.Cell width='two'>{key}</Table.Cell>
						<Table.Cell width='two'>{data[key]}</Table.Cell>
					</Table.Row>
				);
			}
		}

		return(
			<div style={{width:500}}>
				<br/>
				<h3>Table Detail</h3>
				<Dropdown 
					placeholder='Pick Table'
					selection
				>
					<Dropdown.Menu>
						{tables}
					</Dropdown.Menu>
				</Dropdown>

				<Table celled structured>

			    <Table.Body>
			      {cells}
			    </Table.Body>
			  </Table>
			</div>
		);
	}
}

export default Table_meta;