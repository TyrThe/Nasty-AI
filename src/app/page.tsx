import Chat from "@/pages/chat";



export default function Home(){
  const apiKey = process.env.NEXT_PUBLIC_API_KEY

  console.log("Key:", apiKey)

  return(
    <div>
      <Chat key={apiKey}/>
    </div>
  )
}