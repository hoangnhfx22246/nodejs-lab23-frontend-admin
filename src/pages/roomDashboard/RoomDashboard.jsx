import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Rooms from "../../features/Room/Rooms";
import RoomForm from "../../features/Room/RoomForm";

export default function RoomDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isShowRoomFrom = searchParams.get("editing");
  const editing = searchParams.get("editing") === "true" ? true : false;

  const handlerAdd = () => {
    setSearchParams({
      editing: false,
    });
  };
  return (
    <div className="dashboard-container">
      {!isShowRoomFrom && (
        <>
          <div className="dashboard-head">
            <div className="dashboard-head__title">Rooms List</div>
            <button className="btn btn-add" onClick={handlerAdd}>
              Add New
            </button>
          </div>
          <Rooms />
        </>
      )}
      {isShowRoomFrom && (
        <>
          <div className="dashboard-head__title box-shadow">
            {editing ? "Update Room" : "Add New Room"}
          </div>
          <RoomForm />
        </>
      )}
    </div>
  );
}
