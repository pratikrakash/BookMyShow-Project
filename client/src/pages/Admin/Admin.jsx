import {Tabs} from "antd";
import MovieTable from "./MovieTable";
import TheatreTable from "./TheatreTable";
function Admin(){
    const tabList = [
        {
            key:"movies",
            label:"Movies",
            children:<MovieTable/>
        },
        {
            key:"theatres",
            label:"Theatres",
            children:<TheatreTable/>
        }
    ]
    return (
        <>
            <h1>Admin Page</h1>
            <Tabs items={tabList}></Tabs>
        </>
    )
}
export default Admin;