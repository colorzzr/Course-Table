import React from 'react';

const fn = (info)=>{
    if(info.length>0){
        return <tr>
            {Object.keys(info[0]).map((i)=>{
                return <th>
                    {i}
                </th>
            })}
        </tr>
    }
}
const fb = (info)=>{
  
    if(info.length>0){
        return info.map((row)=>{return <tr>
            {Object.keys(row).map((key)=>{
                return <td>{row[key]}</td>
            })}
            </tr>
        })
    } 
}

const ImageList = props =>{
    // return <div className="ui text container image-list">
    //     <div className="ui segments">
    //         <div className="ui segment">
    //             <div className="fields">
    //                 <table className="ui celled padded table">
    //                     <thead>
    //                         {fn(props.info)}
    //                     </thead>
    //                     <tbody>
    //                         {fb(props.info)}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    let  patientList = props.info.map((pt)=>{
        return pt['participant_id'];
    });
    patientList = new Set(patientList)


    return  <div className="ui segments">
            <div className="ui segment">
            <h4 className="ui horizontal divider header">
                <i className="tag icon"></i>
                RESULT : Number of patients {patientList.size}
            </h4>
                <div className="fields">
                    <table className="ui celled padded table">
                        <thead>
                            {fn(props.info)}
                        </thead>
                        <tbody>
                            {fb(props.info)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
};

export default ImageList;
