import React from 'react';
import $ from 'jquery';
import { Table, Icon, Label, Input } from 'semantic-ui-react'

class Table_Tag extends React.Component{
	constructor(props){
		super(props);

		// console.log(this.props.data)
		this.tagEditOnclick = this.tagEditOnclick.bind(this);
		this.newTagInput = this.newTagInput.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.tagRemove = this.tagRemove.bind(this);

		this.state = {
			tagEdit:false,
			data:this.props.data,
			curTable:this.props.curTable
		}
	}

	tagEditOnclick(event, data){
		const filp = !this.state.tagEdit;
		this.setState({tagEdit:filp});
	}

	newTagInput(event, data){
		console.log(data)
		this.setState({newTagInput:data.value})
	}

	handleAddition(event, data_in){
		const {data, curTable, newTagInput} = this.state;
		data.push(newTagInput);
		this.setState({data})

		// call api to set in database
		const url = 'http://localhost:5003/meta_new/project/PERFCT/table/'+curTable+'/tag/'+newTagInput;
		$.post(url, {}, data => {console.log(data)});
	}

	tagRemove(event, data_click){
		let {data, curTable} = this.state;
		data = data.filter(e => e !== data_click.value);
		this.setState({data})

		// call api to remove in database
		const url = 'http://localhost:5003/meta_new/project/PERFCT/table/'+curTable+'/tag/'+data_click.value;
		// use ajax to mimic the delete request
		$.ajax({
			url:url,
			type:'delete',
			success: function(argument) {
				console.log(argument);
			}
		});
	}

	render() {
		const { tagEdit, data} = this.state;
		let returnCompo;
		let tags = data;
		// if we want to modify the tag
		if(tagEdit){
			// pop all the tag into label
			let tag_labels = [];
			for(let i = 0; i < tags.length; i++){
				tag_labels.push(
						<Label>{tags[i]}  <Icon value={tags[i]} onClick={this.tagRemove} name="blind"/></Label>
					)
			}
			// fomate a input for change itt'
			returnCompo = (	<Table.Row>
								<Table.Cell>
									tags
						 			<Icon name="pencil alternate" onClick={this.tagEditOnclick}/>
						 		</Table.Cell>
								<Table.Cell>
									{tag_labels}
									<div>
										<Input type="text" placeholder="Search..." onChange={this.newTagInput}/>
										<Icon onClick={this.handleAddition} name="angle right"/>
									</div>
								</Table.Cell>
							</Table.Row>)
		}
		else{
			// pop all the tag into label
			let tag_labels = [];
			for(let i = 0; i < tags.length; i++){
				tag_labels.push(<Label>{tags[i]}</Label>)
			}
			// fomate the rows
			returnCompo = (<Table.Row>
							<Table.Cell>
								tags
					 			<Icon name="pencil alternate" onClick={this.tagEditOnclick}/>
					 		</Table.Cell>
							<Table.Cell>{tag_labels}</Table.Cell>
						</Table.Row>)
		}
		return returnCompo;
	}
}

export default Table_Tag;