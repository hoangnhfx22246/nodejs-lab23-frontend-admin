import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
export default function HotelForm() {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [hotel, setHotel] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const idHotel = searchParams.get("id");
  const editing = searchParams.get("editing") === "true" ? true : false;
  // get hotel by id
  useEffect(() => {
    if (idHotel) {
      axios
        .get(
          `${process.env.REACT_APP_ADMIN_URL}/admin/hotels/hotel/${idHotel}`,
          {
            headers: {
              authorization: user["_id"],
            },
          }
        )
        .then((res) => {
          setHotel(res.data.results);
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 400) {
            alert(err.response.data.message);
          }
          if (err.status === 500) {
            alert(err.response.data.message);
            navigate("/hotels");
          }
        });
    }
  }, [idHotel, user, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name");
    const cheapestPrice = fd.get("cheapestPrice");
    const type = fd.get("type");
    const city = fd.get("city");
    const address = fd.get("address");
    const distance = fd.get("distance");
    const photos = fd.get("photos").split("\n").filter(Boolean);
    const desc = fd.get("desc");
    const featured = fd.get("featured");
    const rooms = fd.get("rooms").split("\n").filter(Boolean);

    // Kiểm tra nếu đang ở chế độ chỉnh sửa
    const method = editing ? "put" : "post";
    const url = editing
      ? `${process.env.REACT_APP_ADMIN_URL}/admin/hotels/hotel/${idHotel}`
      : `${process.env.REACT_APP_ADMIN_URL}/admin/hotels/hotel`;

    axios({
      method,
      url,
      data: {
        name,
        cheapestPrice,
        type,
        city,
        address,
        distance,
        photos,
        desc,
        featured,
        rooms,
      },
      headers: {
        authorization: `${user["_id"]}`,
      },
    })
      .then(() => {
        navigate("/hotels");
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={editing ? hotel.name : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="type">Type</label>
          <input
            type="text"
            name="type"
            id="type"
            defaultValue={editing ? hotel.type : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            defaultValue={editing ? hotel.city : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            defaultValue={editing ? hotel.address : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="distance">Distance from City Center</label>
          <input
            type="text"
            name="distance"
            id="distance"
            defaultValue={editing ? hotel.distance : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={editing ? hotel.name : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="desc">Description</label>
          <input
            type="text"
            name="desc"
            id="desc"
            defaultValue={editing ? hotel.desc : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="cheapestPrice">Price</label>
          <input
            type="text"
            name="cheapestPrice"
            id="cheapestPrice"
            defaultValue={editing ? hotel.cheapestPrice : ""}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="photos">Images</label>
          <textarea
            name="photos"
            id="photos"
            defaultValue={
              editing && hotel.photos ? hotel.photos.join("\n") : ""
            }
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label htmlFor="featured">Featured</label>
          <select
            name="featured"
            id="featured"
            value={editing ? hotel.featured : false} // Đặt giá trị của select dựa trên `hotel.featured`
            onChange={(e) =>
              setHotel((prev) => ({
                ...prev,
                featured: e.target.value === "true",
              }))
            } // Chuyển giá trị từ chuỗi thành boolean khi cập nhật state
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="form-control full-col">
          <label htmlFor="rooms">Rooms</label>
          <textarea
            name="rooms"
            id="rooms"
            defaultValue={
              editing && hotel.rooms
                ? hotel.rooms.map((room) => room.title).join("\n")
                : ""
            }
            required
          ></textarea>
        </div>
        <div className="form-actions full-col">
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}
