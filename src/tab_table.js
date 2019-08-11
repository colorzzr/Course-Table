import React from 'react';
import { Tab, Label, List } from 'semantic-ui-react'
import {Classic} from './course'

const panes = [
	{ menuItem: 'Tab 1', pane: { key: 'tab1', content: 'This is massive tab', size: 'massive' } },
	{
		menuItem: 'Tab 2',
		pane: { key: 'tab2', content: 'This tab has a center aligned text', textAlign: 'center' },
	},
	{
		menuItem: 'Tab 3',
		pane: {
			key: 'tab3',
			content: (
				<div>
					<Classic />
				</div>
			),
		},
	},
]

class Tab_table extends React.Component{
	// constructor(props){
	// 	super(props)
	// }

	render(){
		return(
			<Tab panes={panes} renderActiveOnly={false}/>
		)
	}
}

export default Tab_table
