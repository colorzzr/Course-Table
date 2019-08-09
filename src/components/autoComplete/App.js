import React from 'react';

import axios from "axios";
import { Dropdown } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'
import ShowResult from '../rootWorkFlow/ShowResult';

class App extends React.Component{
    state = { 
        autoinfo : [],
        pop_info : [],
        autoinfoall:{},
        finalquery:{},
        selectedOption:'',
        finalNeeded:[],
        putdropdown:[],
        getdropdown:[],
        resp:[]
    }

    get_info = async (event)=>{
        const temp = event.target.value;
        console.log('a')
        try{
            const res = await axios.post('http://localhost:5000/api/autocomplete',{info:temp});
            console.log(res.data);

            const updatedOption = res.data.map(
                (ele)=>{
                    return {
                        key:ele['formid']+" : "+ele['field'],
                        text:ele['formid']+" : "+ele['field'],
                        value:ele['formid']+" : "+ele['field']
                    }
                }
            );
            this.setState(
                {
                    pop_info: updatedOption
                }
            )
        }catch(err){
            console.log(err);
        }

    }

    get_value = async (e)=>{
        const temp = e.target.textContent;
        console.log(temp);
        try{
            const res = await axios.post('http://localhost:5000/api/autocomplete/value',{info:temp});
            
            await this.setState({autoinfo:res.data.valdes.split('  ,  ')})
            await this.setState({autoinfoall:res.data})

        }catch(err){
            console.log(err);
        }
    }


    toggleChoice = (e)=>{
        const [form, field, value] = e.target.textContent.split(' : ');
        console.log(form, field, value);
        let finalquery = {...this.state.finalquery};
        delete finalquery[form+" : "+field];
        this.setState({finalquery});
    }


    handleOptionChange = async (e,v)=>{
        if(!v){
            this.setState({selectedOption:e.target.value});
            const [form, fields, value] = e.target.value.split(' : ');
            const keyName = form + ' : ' +fields;
            const valueName = value;
            const newFinalquery = {...this.state.finalquery};
            newFinalquery[keyName] = valueName;
            this.setState({finalquery:newFinalquery});           
            await this.setState({finalquery:newFinalquery});
            console.log(this.state.finalquery);           
        }else{
            const [form, fields, value] = v.split(' : ');
            const keyName = form + ' : ' +fields;
            const valueName = value;
            const newFinalquery = {...this.state.finalquery};
            newFinalquery[keyName] = valueName;
            this.setState({finalquery:newFinalquery});
            await this.setState({finalquery:newFinalquery});
            console.log(this.state.finalquery);        
        }

    }

    specify_requirement =  ()=>{
        console.log(this.state.autoinfo)
        console.log(this.state.autoinfoall)
        return <div>
            {this.state.autoinfo.map(
                (option)=>{
                    if(this.state.autoinfo.length==1 && option=='text'){
                        return <div className="ui action input">
                        <input type="text" placeholder="Search..." onChange={
                            (e)=>{
                                this.handleOptionChange(e,this.state.autoinfoall.form+' : '+this.state.autoinfoall.field+' : '+ e.target.value)
                            }
                        }/>
                      </div>
                    }
                    // return <Form.Field label={option} control='input' type='radio' name='htmlRadios' onClick={(e)=>console.log(e.target.text())}/>
                    return   <div>
                        <label>
                    <input type="radio" 
                        value={this.state.autoinfoall.form+' : '+this.state.autoinfoall.field+' : '+ option} 
                        checked={this.state.selectedOption === this.state.autoinfoall.form+' : '+this.state.autoinfoall.field+' : '+ option} 
                        onChange={this.handleOptionChange}
                    />
                        {option}
                </label>
                </div>
                }
            )}
        </div>
    }

    get_value_needed = (e)=>{
        this.setState({finalNeeded:[...this.state.finalNeeded].concat(e.target.textContent)});
    }

    onNeededClick = (e)=>{
        let  finalNeeded = [...this.state.finalNeeded];
        finalNeeded = finalNeeded.filter((ele)=>{return ele!=e.target.textContent})
        this.setState({finalNeeded});
    }

    submitForm = (e)=>{
        const temp= {};
        let provided = this.state.finalquery;
        let needed = this.state.finalNeeded;
        needed=needed.map((ele)=>{
            let [form, field] = ele.split(' : ');
            return form+'+'+field;
         })
        let newProvided = {}
        Object.keys(provided).forEach((key)=>{
            let [form, field] = key.split(' : ');
            let newKey = form+'+'+field;
            newProvided[newKey] = provided[key];
        })
        temp['provided']= newProvided;
        temp['needed'] = needed;
        console.log(temp);
        axios.post('http://127.0.0.1:5000/api/queryPatient/submit', {
            info: JSON.stringify(temp)
        }).then( 
            (res)=>{
                console.log(res.data);
                this.setState({resp:res.data});
                
            }
        ).catch((error)=> {
            console.log(error);
        });    
    }

    resetForm = ()=>{
        console.log(this.state.finalquery)
    }

    onclickput = (e, d)=>{
        if(e.type==='click'){
            this.setState({putdropdown:[...this.state.putdropdown].concat(e.target.textContent)})
        }else if(e.type==='contextmenu'){
            console.log('right')
        }
    }
    onclickget = (e,d)=>{
        this.setState({getdropdown:[...this.state.getdropdown].concat(e.target.textContent)})
    }

    renderlabel = (text)=>{
        return <a className="ui image label">
              <span onClick={this.get_value}>{text.key}</span><i className="window close icon" onClick={(e)=>this.closeTag(e, text.key)}></i>
        </a>
    }

    closeTag = (e, text)=>{
          this.setState({putdropdown:[...this.state.putdropdown].filter((ele)=>{return ele!==text})})
    }

    render(){
        return(
            <div className="ui text container image-list">

                <div className="ui segments">
                    <div className="ui segment">
                    <Form>
                        <Dropdown
                            placeholder='State'
                            fluid
                            multiple={true}
                            search
                            selection
                            options={this.state.pop_info}
                            onSearchChange = {this.get_info}
                            value = {this.state.putdropdown}
                            onChange = {this.onclickput}
                            renderLabel = {this.renderlabel}
                        />

                        <Form.Group grouped>
                        <label>SPECIFY INFORMATION</label>
                            {this.specify_requirement()}
                        </Form.Group>
    
                        <div className="ui celled ordered list">
                            {
                                Object.keys(this.state.finalquery).map(
                                    (item)=><div className="item" onClick = {this.toggleChoice}>{item + ' : '+ this.state.finalquery[item]}</div>
                                )
                            }
                        </div> 
                    </Form>
                    </div>

                    <div className="ui segment">
                    <Form>
                        <Dropdown
                            placeholder='State'
                            fluid
                            multiple={true}
                            search
                            selection
                            options={this.state.pop_info}
                            onSearchChange = {this.get_info}
                            onLabelClick = {this.get_value_needed}
                            value = {this.state.getdropdown}
                            onChange = {this.onclickget}
        
                        />
    
                        <div className="ui celled ordered list">
                            {
                                this.state.finalNeeded.map(
                                    (item)=><div className="item" onClick = {this.onNeededClick}>{item}</div>
                                )
                            }
                        </div>
                    </Form>
                    </div>

                    <div className="ui segment">
                    <div className="ui large buttons">
                            <button className="ui button" onClick = {this.submitForm}>Submit</button>
                            <div className="or"></div>
                            <button className="ui button" onClick = {this.resetForm}>Reset</button>
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