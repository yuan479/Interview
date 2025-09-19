import {useState, useRef, useEffect} from 'react'

const UseRef_2 =()=>{
    const [count,setCount] = useState(0)
    const TimeId = useRef(null)
    const insert1=()=>{
        setCount(count+1)
    }
    const startTimer=()=>{
        if(!TimeId.current){
            TimeId.current=setInterval(()=>{
                setCount(count=>count + 0.01
                )
            },10)
    }
}
    const stopTimer=()=>{
        if(TimeId.current){
            clearInterval(TimeId.current)
            TimeId.current =null
        }
    }
    useEffect(()=>{
        stopTimer()
    },[])

    return (
        <>
           <h1>{count.toFixed(2)}</h1>
           <button onClick={insert1}> + 1</button>
           <button onClick={startTimer}>启动计时器</button>
           <button onClick={stopTimer}>停止计时器</button>
        </>
    )
}

export default UseRef_2