import React,{useState} from "react"

function EmailAutomation(){

const [email,setEmail] = useState("")
const [subject,setSubject] = useState("")
const [message,setMessage] = useState("")
const [status,setStatus] = useState("")

const sendEmail = async()=>{

try{

const res = await fetch("http://localhost:5000/send-email",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
subject,
message
})

})

const data = await res.json()

if(data.success){
setStatus("Email Sent Successfully")
}else{
setStatus("Email Failed")
}

}catch(err){

setStatus("Server Error")

}

}

return(

<div style={{
border:"1px solid #ddd",
padding:"20px",
marginTop:"30px"
}}>

<h2>Email Automation</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"10px"}}
/>

<input
type="text"
placeholder="Subject"
value={subject}
onChange={(e)=>setSubject(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"10px"}}
/>

<textarea
placeholder="Message"
value={message}
onChange={(e)=>setMessage(e.target.value)}
rows="5"
style={{width:"100%",padding:"10px"}}
/>

<br/><br/>

<button
onClick={sendEmail}
style={{
padding:"10px 20px",
background:"#28a745",
color:"#fff",
border:"none"
}}
>
Send Email
</button>

<br/><br/>

{status && <p>{status}</p>}

</div>

)

}

export default EmailAutomation