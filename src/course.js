import React from 'react';
import CourseTable from 'course-table';

const courseTables = {
      1: [
        {
          startTime:1551920827000,
          endTime:1551924427000,
          stuNameList: ['123'],
          teaName: '312'
        }
      ]
    };

const handleConfirm = (data,handleOK) => {
    handleOK()
};

class Classic extends React.Component{
	constructor(props) {
		super(props);
	}

	render(){
		return(
			<div>
				<h1>HHHHHH</h1>
				<CourseTable 
			        courseTables={courseTables}
			        handleConfirm={handleConfirm}
			    />
			</div>
			)
	}

}

export default Classic