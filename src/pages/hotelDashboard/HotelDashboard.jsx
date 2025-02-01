import { useEffect } from "react";
import Hotels from "../../features/Hotel/Hotels";
import { useSearchParams } from "react-router-dom";
import HotelForm from "../../features/Hotel/HotelForm";
export default function HotelDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isShowHotelForm = searchParams.get("editing");
  const editing = searchParams.get("editing") === "true" ? true : false;

  const handlerAddHotel = () => {
    setSearchParams({
      editing: false,
    });
  };
  return (
    <div className="dashboard-container">
      {!isShowHotelForm && (
        <>
          <div className="dashboard-head">
            <div className="dashboard-head__title">Hotels List</div>
            <button className="btn btn-add" onClick={handlerAddHotel}>
              Add New
            </button>
          </div>
          <Hotels />
        </>
      )}
      {isShowHotelForm && (
        <>
          <div className="dashboard-head__title box-shadow">
            {editing ? "Update Hotel" : "Add New Hotel"}
          </div>
          <HotelForm />
        </>
      )}
    </div>
  );
}
