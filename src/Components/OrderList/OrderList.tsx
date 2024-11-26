import { Outlet } from "react-router-dom"


function OrderList() {
  return (
    <div className="w-screen h-screen flex flex-col items-center pt-28" >
        there is no items
      <Outlet />
    </div>
  )
}

export default OrderList
