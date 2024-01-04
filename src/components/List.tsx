import { useEffect, useState } from "react";
interface Test {
    id:string;
    name:string;
}
const List = ()=>{
    const [cnt, setCnt] = useState(0);
    const [list, setList] = useState<Test[]>([]);
  
    useEffect(()=>{
        fetch('http://localhost/react/list')
        .then((res)=>res.json())
        .then((result)=>{
            setList(result);
        })
        console.log(1);
    },[]);
    return (
        <div>
            <ul>{list.map(it=>(
                <li key={it.id}>
                    {it.name}
                </li>
            ))}</ul>
            <span onClick={()=>setCnt(cnt+1)}>{cnt}</span>
        </div>
    )    
}
export default List;