import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export default function RoomForm() {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [room, setRoom] = useState({});
  const [hotels, setHotels] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const idRoom = searchParams.get("id");
  const editing = searchParams.get("editing") === "true" ? true : false;
  // get room by id
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_ADMIN_URL}/admin/hotels/all`, {
        headers: {
          authorization: `${user["_id"]}`,
        },
      })
      .then((res) => {
        setHotels(res.data.results); // Lưu dữ liệu giao dịch vào state
      })
      .catch((err) => console.log(err));
    if (idRoom) {
      axios
        .get(`${process.env.REACT_APP_ADMIN_URL}/admin/rooms/room/${idRoom}`, {
          headers: {
            authorization: user["_id"],
          },
        })
        .then((res) => {
          setRoom(res.data.results);
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 400) {
            alert(err.response.data.message);
          }
          if (err.status === 500) {
            alert(err.response.data.message);
            navigate("/rooms");
          }
        });
    }
  }, [idRoom, user, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const title = fd.get("title");
    const desc = fd.get("desc");
    const price = fd.get("price");
    const maxPeople = fd.get("maxPeople");
    const hotel = fd.get("hotel");
    const roomNumbers = fd
      .get("roomNumbers")
      .split(",")
      .filter(Boolean)
      .map((roomNumber) => Number(roomNumber));
    // return console.log(roomNumbers);

    // Kiểm tra nếu đang ở chế độ chỉnh sửa
    const method = editing ? "put" : "post";
    const url = editing
      ? `${process.env.REACT_APP_ADMIN_URL}/admin/rooms/room/${idRoom}`
      : `${process.env.REACT_APP_ADMIN_URL}/admin/rooms/room`;

    axios({
      method,
      url,
      data: {
        title,
        desc,
        price,
        maxPeople,
        roomNumbers,
        hotel,
      },
      headers: {
        authorization: `${user["_id"]}`,
      },
    })
      .then(() => {
        navigate("/rooms");
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          alert(err.response.data.message);
        }
      });
  };

  return (
    <div className="box-shadow">
      <form className="form-container" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={editing ? room.title : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="desc">Description</label>
          <input
            type="text"
            name="desc"
            id="desc"
            defaultValue={editing ? room.desc : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            defaultValue={editing ? room.price : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="maxPeople">Max People</label>
          <input
            type="text"
            name="maxPeople"
            id="maxPeople"
            defaultValue={editing ? room.maxPeople : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="roomNumbers">Rooms</label>
          <textarea
            name="roomNumbers"
            id="roomNumbers"
            defaultValue={
              editing && room.roomNumbers ? room.roomNumbers.join(", ") : ""
            }
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label htmlFor="hotel">Choose a hotel</label>
          <select name="hotel" id="hotel">
            <option>select hotel</option>
            {hotels.map((hotel) => (
              <option value={hotel["_id"]} key={hotel["_id"]}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions full-col">
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}
