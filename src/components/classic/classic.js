import React from 'react';
import { Dropdown, Input, Button, Card, Label } from 'semantic-ui-react'
import $ from 'jquery';
import { CSVLink, CSVDownload } from "react-csv";
import Table_mata from "./table_meta";


class Classic extends React.Component{
	constructor(props) {
		super(props);

		this.inputChange = this.inputChange.bind(this);
		this.send2Back = this.send2Back.bind(this);
		this.dropdownClick = this.dropdownClick.bind(this);
		this.cardsInputChange = this.cardsInputChange.bind(this)
		this.deleteButtonOnClick = this.deleteButtonOnClick.bind(this)
		this.outputDropdownClick = this.outputDropdownClick.bind(this)
		this.searchInput = this.searchInput.bind(this)

		this.state = {
			// the field store all form and field from pg
			fields:[],
			// the field store same but in obnject
			fieldsObj:[],
			// user search card
			cards:{},
			// user required field
			requiredField:[],
			//table value
			tableContent:[],
			tableHead:[],
		};

		// query on the all the field infomation
		// $.post('http://localhost:5000/table_detail',
		// 	{},
		// 	data => {
		// 		if(data.length === 2){
		// 			this.setState({fields:data[0], fieldsObj:data[1]})
		// 			console.log(data)
		// 		}
		// 	}
		// );
	}

	inputChange(event, data) {
		this.setState({[data.id]: data.value});
	}

	cardsInputChange(event, data) {
		// console.log(event.target.id);
		// console.log(data.value)
		// get the input value and corresponding data
		const field = event.target.id;
		const value = data.value;

		// get the card input and chagne it
		const cards = this.state.cards;
		cards[field]['input'] = value;
		this.setState({cards});
	}

	dropdownClick(event, data) {
		// console.log(event.target);
		// console.log(data.value.split('+'))
		let [formName, fieldName] = data.value.split('+');

		let cards = this.state.cards;
		cards[data.value] = {
			formName,
			fieldName,
			input:"",
		}

		this.setState({cards});
	}

	// this function would be called when required field input is selected
	outputDropdownClick(event, data) {
		console.log(data)
		// pushh into data araay
		let {requiredField} = this.state;
		requiredField = data.value;
		this.setState({requiredField});
	}

	// this function is called when search input is typed and call
	// backend api to facilitate the suggestion
	searchInput(event, data){

		$.post('http://localhost:5000/table_detail_in_es',
			{input:data.searchQuery},
			data => {
				console.log(data)
				this.setState({fields:data[0], fieldsObj:data[1]});
			}
		);
	}

	deleteButtonOnClick(event, data) {
		// if delete onclick remove from list
		// console.log(data);
		let cards = this.state.cards;
		// console.log(cards[data.value]);
		delete cards[data.value];
		this.setState(cards);
	}

	send2Back(event, data) {
		// console.log(this.state)
		const { cards, requiredField } = this.state;

		// move the array of cards input to the object
		const cardsComponent = {};
		for(var key in cards){
			cardsComponent[key] = cards[key]['input'];
		}
		// same as the output
		const requiredComponent = {};
		for(let i = 0; i < requiredField.length; i++){
			requiredComponent['requiredField' + i] = requiredField[i];
		}

		// send back
		// $.post('http://localhost:5000/graphql',
		// 	{...cardsComponent, ...requiredComponent},
		// 	data => {
		// 		console.log(data);
		// 		// console.log(typeof data);

		// 		// for now we only return one it is ok
		// 		let allTable = {}
		// 		for(var key in data) {
		// 		    var value = data[key];
		// 		    console.log(key);

		// 		    let table = [];
		// 		    for(let i = 0; i < (value.length > 5?5:value.length); i++){
		// 		    	let row = [<td>{i}</td>];
		// 		    	// console.log(value[i]);
		// 		    	for(var key1 in value[i]) row.push(<td>{value[i][key1]}</td>);
		// 		    	// for(var key1 in value[i]) console.log(key1, value[i][key1])
		// 		    	// console.log(row)
		// 		    	table.push(<tr>{row}</tr>);
		// 		    }

		// 		    // then push it to the palce holds all
		// 		    allTable[key] = {
		// 		    	table,
		// 		    	data:data[key],
		// 		    	length:value.length,
		// 		    };
		// 		}
		// 		this.setState({tableContent:allTable});
 
		// 		// get the table header
		// 		let allHeads = {};
		// 		for(var key21 in data){
		// 			var headers = data[key21][0];
		// 			let tableHead = [<th>#</th>];
		// 			for(var key22 in headers) tableHead.push(<th>{key22}</th>);
		// 			// this.setState({tableHead});
		// 			allHeads[key21] = tableHead;
		// 		}
		// 		this.setState({tableHead:allHeads});
		// 	}
		// );

		// send back
		$.post('http://localhost:5000/api/get',
			{...cardsComponent, ...requiredComponent},
			data => {
				console.log(data);
				// console.log(typeof data);

				// for now we only return one it is ok
				let allTable = {}
				for(var key in data) {
				    var value = data[key]['data'];
				    console.log(key);

				    let table = [];
				    for(let i = 0; i < (value.length > 5?5:value.length); i++){
				    	let row = [<td>{i}</td>];
				    	// console.log(value[i]);
				    	for(var key1 in value[i]) row.push(<td>{value[i][key1]}</td>);
				    	// for(var key1 in value[i]) console.log(key1, value[i][key1])
				    	// console.log(row)
				    	table.push(<tr>{row}</tr>);
				    }

				    // then push it to the palce holds all
				    allTable[key] = {
				    	table,
				    	data:data[key]['data'],
				    	length:value.length,
				    };
				}
				this.setState({tableContent:allTable});
 
				// get the table header
				let allHeads = {};
				for(var key21 in data){
					var headers = data[key21]['data'][0];
					let tableHead = [<th>#</th>];
					for(var key22 in headers) tableHead.push(<th>{key22}</th>);
					// this.setState({tableHead});
					allHeads[key21] = tableHead;
				}
				this.setState({tableHead:allHeads});
			}
		);
	}

	boc(event, data){
		var data = [
		   ['Foo', 'programmer'],
		   ['Bar', 'bus driver'],
		   ['Moo', 'Reindeer Hunter']
		];

		var csv = 'Name,Title\n';
	    data.forEach(function(row) {
	            csv += row.join(',');
	            csv += "\n";
	    });
	 
	    console.log(csv);
	    var hiddenElement = document.createElement('a');
	    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
	    hiddenElement.target = '_blank';
	    hiddenElement.download = 'people.csv';
	    hiddenElement.click();
	}

	// multiple allowAdditions
	render() {
		// populate the cards in the search
		const cards = this.state.cards;
		const cardsComponent = [];
		for(var key in cards){
			// console.log(key, cards[key]);
			cardsComponent.push(
				<Card>
			      <Card.Content>
			        <Card.Header>{cards[key]['fieldName']}</Card.Header>
			        <Card.Meta>{cards[key]['formName']}</Card.Meta>
			        <Card.Description>
			          Field Name: {cards[key]['fieldName']}<br/>
			          Form Name: {cards[key]['formName']}
			        </Card.Description>
			        <Input id={key} onChange={this.cardsInputChange} placeholder="search"/>
			        <Button color='red' value={key} onClick={this.deleteButtonOnClick}>Delete</Button>
			      </Card.Content>
			    </Card>)
		}

		// populate the tables
		const tableHead = this.state.tableHead;
		const tableContent = this.state.tableContent;
		let tables = []
		for(var key in tableHead){
			tables.push(
			<div className="row">
				<div className="panel panel-primary filterable">
					<div className="panel-heading">
						<h3 className="panel-title">{key} total rows:{tableContent[key]['length']}</h3>
						<Button name={key}><CSVLink data={tableContent[key]['data']}>Download me</CSVLink></Button>
					</div>

					<table className="table">
						<thead>
							<tr className="filters">{tableHead[key]}</tr>
						</thead>

						<tbody>{tableContent[key]['table']}</tbody>
					</table>
				</div>
			</div>)
		}

		const {requiredField} = this.state;
		let labels = []
		for(let i = 0; i < requiredField.length; i++){
			labels.push(<Label key={requiredField[i]} as='a' image>
					      {requiredField[i]}
					    </Label>)
		}

		return (
			<div>
				<h2>Search:</h2>
				<Dropdown
				    placeholder='Select Field'
				    fluid
				    search
				    selection
				    onSearchChange={this.searchInput}
				    onChange={this.dropdownClick}
				    options={this.state.fields}
				  />
				<br/>
				<Card.Group>
					{cardsComponent}
				</Card.Group>

				<h2>Required Field:</h2>
				<div>
					{labels}
				</div>
				<Dropdown
				    placeholder='Select Output Field'
				    fluid
				    search
				    selection 
				    multiple
				    clearable
				    onSearchChange={this.searchInput}
				    onChange={this.outputDropdownClick}
				    options={this.state.fields}
				  />

				<br/>
				<Button onClick={this.send2Back} color='green'>Submit</Button>
				<br/>
				
				<div className="container">
				    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>

				    {tables}
				</div>


				<Table_mata/>
			</div>

		);
	}
}

export default Classic;