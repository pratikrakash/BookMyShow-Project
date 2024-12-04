import {Tabs} from "antd";
import TheatreTable from "./TheatreTable";
function Partner(){
    const tabItems = [
        {
            key:"theatres",
            label:"Theatres",
            children:<TheatreTable/>
        }
    ]
    return (
        <>
            <Tabs items={tabItems}></Tabs>
        </>
    )
}
export default Partner;