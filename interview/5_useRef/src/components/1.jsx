import { useRef } from 'react'

const UseRef_1 = () => {

    const refInput = useRef(null)
    const sending =() =>{
        if(refInput.current){
            console.log(refInput.current)
        }
    }

    return (
       <>
       <input type="text" ref={refInput}/>
       <button onClick={()=>refInput.current.focus()}>再次聚焦输入框</button>
       <button onClick={()=>sending}>控制台打印</button>
       </>
    )
}

export default UseRef_1