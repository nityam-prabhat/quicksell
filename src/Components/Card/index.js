import React from "react"
import './style.css'

const statusIcon = {
    'Todo': <i style={{color:'green'}} className="bi bi-check-circle-fill"></i>,
    'In progress': <i style={{color:'yellowgreen'}} className="bi bi-circle"></i>,
    'Backlog': <i style={{color:'red'}} className="bi bi-x-circle-fill"></i>,
}

export default function Card(props){
    return(
        <div className="cardc">
           {props.grouping!=='userId' && <div className="name">
                {
                props?.name?.substring(0,1)
                }
                <div  className={
                    props?.available ? "available" : "available active"
                }></div>
            </div>}
            <p style={{color:'rgba(63, 62, 62, 0.7)'}}>{props.data?.id}</p>
            <div style={{display:'flex',alignItems:'start',gap:'0.5rem'}}>
                <p>{
                    props.grouping !== 'status' &&
                    statusIcon[props.data?.status]
                    } </p>
                    <p>{props.data?.title}</p>
            </div>
            <div style={{display:'flex'}}>
                {
                    props?.data?.tag?.map((tag,index) => {
                        return (
                                <div key={index} className="tag"><div className="featReq"></div>&nbsp;{tag}</div>
                        )
                    })
                }
            </div>
        </div>
    )
}