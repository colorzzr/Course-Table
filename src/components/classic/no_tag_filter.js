import React from 'react';
import { Dropdown, Input, Button, Card } from 'semantic-ui-react'
import $ from 'jquery';

class Classic extends React.Component{
	constructor(props) {
		super(props);

		this.inputChange = this.inputChange.bind(this);
		this.send2Back = this.send2Back.bind(this);
		this.dropdownClick = this.dropdownClick.bind(this);
		this.outputDropdownClick = this.outputDropdownClick.bind(this);
		this.handleAddition = this.handleAddition.bind(this);

		this.state = {
			// the field store all form and field from pg
			fields:[],
			fieldsRequire:[],
			// the field store same but in obnject
			fieldsObj:[],

			// user search card
			searchFields:[],
			// user required field
			requiredField:[],
			//table value
			tableContent:[],
			tableHead:[],
		};

		// query on the all the field infomation
		$.post('http://localhost:5000/table_detail_field_val',
			{},
			data => {
				if(data.length === 2){
					this.setState({fields:data[0], fieldsObj:data[1]})
					console.log(data)
				}
			}
		);

		$.post('http://localhost:5000/table_detail',
			{},
			data => {
				if(data.length === 2){
					this.setState({fieldsRequire:data[0]})
					console.log(data)
				}
			}
		);
	}


	inputChange(event, data) {
		this.setState({[data.id]: data.value});
	}

	dropdownClick(event, data) {
		this.setState({searchFields:data.value});
	}

	outputDropdownClick(event, data) {

		// pushh into data araay
		// let requiredField = this.state.requiredField;
		// requiredField = data.value;
		this.setState({requiredField:data.value});
	}

	// when user want to add new val
	handleAddition(event, data){
		this.setState(prevState => ({
	      fields: [{ text: data.value, value:data.value, description:"custom" }, ...prevState.fields],
	    }))
	}
	
	send2Back(event, data) {
		console.log(this.state)
		const { searchFields, requiredField } = this.state;

		// move the array of cards input to the object
		const searchFieldsComponent = {};
		for(let i = 0; i < searchFields.length; i+=1){
			let temp = searchFields[i].split(":")
			searchFieldsComponent[temp[0]] = temp[1];
		}
		// same as the output
		const requiredComponent = {};
		for(let i = 0; i < requiredField.length; i++){
			requiredComponent['requiredField' + i] = requiredField[i];
		}


		// send back
		$.post('http://localhost:5000/graphql',
			{...searchFieldsComponent, ...requiredComponent},
			data => {
				console.log(data);
				// console.log(typeof data);

				// for now we only return one it is ok
				let allTable = []
				for(var key in data) {
				    var value = data[key];
				    // console.log(value);

				    let table = [];
				    for(let i = 0; i < value.length; i++){
				    	let row = [<td>{i}</td>];
				    	// console.log(value[i]);
				    	for(var key1 in value[i]) row.push(<td>{value[i][key1]}</td>);
				    	// for(var key1 in value[i]) console.log(key1, value[i][key1])
				    	// console.log(row)
				    	table.push(<tr>{row}</tr>);
				    }

				    // then push it to the palce holds all
				    allTable.push(table);
					this.setState({tableContent:allTable});
				}

				// get the table header
				let allHeads = [];
				for(var key21 in data){
					var headers = data[key21][0];
					let tableHead = [<th>#</th>];
					for(var key22 in headers) tableHead.push(<th>{key22}</th>);
					// this.setState({tableHead});
					allHeads.push(tableHead);
				}
				this.setState({tableHead:allHeads});
			}
		);
	}


	// multiple allowAdditions
	render() {

		// populate the tables
		const tableHead = this.state.tableHead;
		const tableContent = this.state.tableContent;
		let tables = []
		for(let i = 0; i < tableHead.length; i += 1){
			tables.push(
				<div className="row">
					<div className="panel panel-primary filterable">
						<div className="panel-heading">
							<h3 className="panel-title">Results</h3>
						</div>

						<table className="table">
							<thead>
								<tr>{tableHead[i]}</tr>
							</thead>

							<tbody>{tableContent[i]}</tbody>
						</table>
					</div>
				</div>)
		}

		// const {currentValue} = currentValue
		return (
			<div>
				<h2>Search:</h2>
				<Dropdown
				    placeholder='Select Field'
				    fluid
				    search
				    selection 
				    multiple
				    clearable
				    allowAdditions
				    // value={currentValue}
        			onAddItem={this.handleAddition}
				    onChange={this.dropdownClick}
				    options={this.state.fields}
				  />
				<br/>

				<h2>Required Field:</h2>
				<Dropdown
				    placeholder='Select Output Field'
				    fluid
				    search
				    selection 
				    multiple
				    clearable
				    onChange={this.outputDropdownClick}
				    options={this.state.fieldsRequire}
				  />

				<br/>
				<Button onClick={this.send2Back} color='green'>Submit</Button>
				<br/>
				
				<div className="container">
				    <link href="//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
					<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.0/js/bootstrap.min.js"></script>
					<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>

				    {tables}
				</div>

			</div>

		);
	}
}

export default Classic;