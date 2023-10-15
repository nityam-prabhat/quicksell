import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import './style.css';
import { useState,useEffect } from "react";
import { fetchData } from "../Utils/FetchData";
import Card from '../Components/Card';
import Plus from '../Components/Images/icons8-plus.svg';
import Dots from '../Components/Images/three-dots.svg';
import Todo from '../Components/Images/todo.png';
import prog from '../Components/Images/progress.png';
import xyz from '../Components/Images/backlog-svgrepo-com.svg';

// - Urgent (Priority level 4)
// - High (Priority level 3)
// - Medium (Priority level 2)
// - Low (Priority level 1)
// - No priority (Priority level 0)

const priorityMap={
    0:'No priority',
    1:'Low',
    2:'Medium',
    3:'High',
    4:'Urgent'
}

export default function Dashboard() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const [data,setData] = useState(null);
    const [grouping,setGrouping] = useState('status');
    const [filter,setFilter] = useState('priority');
    const [filterValue,setFilterValue] = useState({});

    async function FetchData() {
        try {
          const data = await fetchData();
          console.log('Data:', data);
            setData(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    const updateUrl = () => {
        const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      };

    const updateFilter = (e) => {
        setFilter(e.target.value);
        urlSearchParams.set('filter', e.target.value);
        updateUrl();
    }

    const updateGrouping = (e) => {
        setGrouping(e.target.value);
        urlSearchParams.set('grouping', e.target.value);
        updateUrl();
    }
    useEffect(() => {
        FetchData();
        setFilter(urlSearchParams.get('filter') || 'priority');
        setGrouping(urlSearchParams.get('grouping') || 'status');
    },[])

    useEffect(() => {
        if(data){
            let tempData = {};
            data.tickets.forEach((item) => {
                if(!tempData[item[grouping]]){
                    tempData[item[grouping]] = [];
                }
                tempData[item[grouping]].push(item);
            })
            console.log('-->',tempData);
            let tempFilter = {};
            Object.keys(tempData).forEach((item) => {
                tempFilter[item] = tempData[item].sort((a,b) => {
                    if(filter === 'priority'){
                        return b.priority - a.priority;
                    }else{
                        return a.title.localeCompare(b.title);
                    }
                })
            })
            console.log('tempFilter',tempFilter);
            setFilterValue(tempFilter);
        }
    },[filter,grouping,data])

    return (
        <div className="dashboard">
            <div className="filter-box">
                <Dropdown>
                    <Dropdown.Toggle size="sm" style={{color:'black',backgroundColor:'white',border:'1px solid rgb(229, 228, 228)',boxShadow:'0 0 0.5rem rgba(0,0,0,0.3)'}} id="dropdown-basic">
                        Display
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <div style={{width:'20rem',display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',padding:'1rem'}}>
                            <p>Grouping</p>
                            <Form.Select value={grouping} size='sm' onChange={updateGrouping}>
                                <option value="status">Status</option>
                                <option value="userId">User</option>
                                <option value="priority">Priority</option>
                            </Form.Select>
                            <p>Ordering</p>
                            <Form.Select value={filter} size='sm' onChange={updateFilter}>
                                <option value="priority">Priority</option>
                                <option value="title">Title</option>
                            </Form.Select>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <br></br>
            <div className="cards">
                {
                    Object.keys(filterValue).map((item,index) => {
                        return (
                            <div key={index} className="column">
                                <div className="column-title">
                                <div>
                                    <p style={{marginBottom:0}}>{grouping==='priority'?
                                        <>{priorityMap[item]}</>
                                        :grouping==='userId'?
                                        <div style={{display:'flex', alignItems:'center'}}>
                                        <div className='uname'>
                                            {
                                                data?.users?.filter((user) => user.id === item)[0]?.name.substring(0, 1)
                                            }
                                        </div>
                                        <div  className={
                                            data?.users?.filter((user) => user.id === item)[0]?.available? 'avail' : 'avail active'
                                        }></div>
                                        {
                                            data?.users?.filter((user) => user.id === item)[0]?.name
                                        }
                                        </div>
                                        :<>
                                        {item=='Todo'?
                                            <img src={Todo} height="20px"/>
                                            :item =='In progress'?
                                                <img src={prog} height='20px'/>
                                                :<img src={xyz} height='20px'/>
                                        }
                                        &nbsp;
                                        {item}
                                        
                                        </>
                                }</p>
                                </div>
                                <div>
                                    <img src={Plus} style={{height:'0.9rem'}}/>
                                    &nbsp;&nbsp;
                                    <img src={Dots} style={{height:'0.9rem'}}/>
                                    &nbsp;
                                </div>
                                </div>
                                <div className="column-cards">
                                    {
                                        filterValue[item].map((card,index) => {
                                            return <Card key={index} data={card} grouping={grouping} name={
                                                data?.users?.filter((user) => user.id === card.userId)[0]?.name
                                            }
                                             available={data?.users?.filter((user) => user.id === card.userId)[0]?.available}
                                            />
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}