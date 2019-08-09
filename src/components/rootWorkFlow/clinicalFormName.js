import React from 'react';


const ImageList = props =>{
    return <table className="ui celled padded table">
  <thead>
    <tr>
        <th>Form Name</th>
        <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {props.form_list.map(x=>{return <tr>
      <td >
      <button className="ui secondary button" onClick={props.click}>
        {x}
      </button>
      </td>
      <td>This is description for this form </td>
    </tr>})}
  </tbody>
</table>
};

export default ImageList;