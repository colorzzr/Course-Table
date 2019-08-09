import React from 'react';
import './App.css';
import Clinical from './clinicalFormName';
import ShowResult from './ShowResult';
import axios from "axios";

class App extends React.Component{
    state = { 
        tableName :[
        'molecular',
        'mel_diag', 
        'mel_stg', 
        'pr_ther_q', 
        'pt_weight_loss', 
        'pr_surg_1', 
        'pt_race_2', 
        'patient_info', 
        'relapse', 
        'col_stg', 
        'prior_surg_crc_q', 
        'pt_info', 
        'pr_rt_3', 
        'pr_rt_q', 
        'main_intro', 
        'crc_diag', 
        'nsclc_diag', 
        'pr_ther_4', 
        'mmp_1', 
        'rand_pt', 
        'nsclc_stg', 
        'prior_surg_nsclc_q', 
        'prior_surg_mel_q', 
        'smoke_1', 
        'mmp_q1', 
        'death', 
        'pt_race_1'],
        given_or_needed: false,
        formName:null,
        column_names:[],
        selected_column:{},
        resp : [],
        needed:[],
        
    }
    get_fields = (event)=>{
        this.setState({formName:event.currentTarget.textContent})
        axios.post('http://127.0.0.1:5000/api/queryPatient/columns', {
            info: event.currentTarget.textContent
        }).then( (response)=> {
            const col = response.data.map((item)=>{return item['column_name']});
            this.setState({column_names:col});
        }).catch((error)=> {
            console.log(error);
        });
    }

    select_fields = (event)=>{
        const name = event.currentTarget.textContent;
        const keyName = this.state.formName.concat('+', name);
        if(this.state.given_or_needed){
            if(this.state.needed.includes(keyName)){
                const new_needed = [...this.state.needed];
                const index = new_needed.indexOf(keyName);
                new_needed.splice(index,1);
                this.setState({needed:new_needed});
            }else{
                this.setState({needed:[...this.state.needed].concat(keyName)});
            }
            
        }else{
            if(keyName in this.state.selected_column){
                const new_selected_column = {...this.state.selected_column};
                delete new_selected_column[keyName];
                this.setState({selected_column:new_selected_column},
                    ()=>{console.log(this.state)});
            }else{
                const new_selected_column = {...this.state.selected_column};
                new_selected_column[keyName] = 'init'
                this.setState({selected_column:new_selected_column},
                    ()=>{console.log(this.state)});
            }
        }
    }

    changeFormat = (token)=>{
        this.setState({given_or_needed:token})
    }

    addFields= (e, name)=>{
        console.log(name)
        const selected_column = {...this.state.selected_column};
        selected_column[name] = e.target.value;
        this.setState({selected_column:selected_column}, ()=>{
            console.log(this.state);
        });
    }

    submitForm = (e)=>{
        e.preventDefault();
        const temp= {};
        temp['provided']= this.state.selected_column;
        temp['needed'] = this.state.needed;
        axios.post('http://127.0.0.1:5000/api/queryPatient/submit', {
            info: JSON.stringify(temp)
        }).then( (response)=> {
            this.setState({resp:response.data});
        }).catch((error)=> {
            console.log(error);
        });
    }
    render(){
        return(
            
            <div>
                {/* form */}
                <div className="ui text container image-list">
                    <div className="ui segments">
                        <button className="positive ui button" onClick={()=>this.changeFormat(false)}>Giving Infomation</button>
                        <button className="primary ui button" onClick={()=>this.changeFormat(true)}>Requiring Information</button>
                    </div>
                    <div className="ui segments">
                        <div className="ui segment">
                            <div className="fields">
                                <Clinical form_list={this.state.tableName} 
                                click={this.get_fields}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* fields */}
                <div className="ui text container image-list">
                    <div className="ui segments">
                        <div className="ui segment">
                            <div className="fields">
                            <table className="ui celled padded table">
                                <thead>
                                    <tr>
                                        <th>Fields Name</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.column_names.map(x=>{return <tr>
                                    <td >
                                    <button className="ui secondary button" onClick={this.select_fields}>
                                        {x}
                                    </button>
                                    </td>
                                    <td>This is the description for this field </td>
                                    </tr>})}
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* query */}
                <div className="ui text container image-list">
                    <div className="ui segments">
                        <div className="ui segment">
                            <div className="fields">
                            <form onSubmit={this.onFormSubmit} className="ui form">
                                <div className="field">
                                    {Object.keys(this.state.selected_column).map((name)=>{
                                        return <div>
                                            <label>
                                                {name}
                                            </label>
                                            <input
                                                type="text"
                                                value={this.state.selected_column[name]}
                                                onChange={(e) => this.addFields(e, name)}
                                                />
                                        </div>
                                    })}
                                </div>
                                <div className="field">
                                    <div>
                                        <label>
                                            REQUIRED INFO
                                        </label>
                                        <input
                                            type="text"
                                            value={this.state.needed}
                                            />
                                    </div>
                                </div>
                                <button className="ui button" type="submit" onClick={(e)=>this.submitForm(e)}>Submit</button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* result */}
                <ShowResult info={this.state.resp}/>
                </div>
        )
    }
}

export default App;
