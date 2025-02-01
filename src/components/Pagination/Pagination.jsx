import { useSearchParams } from "react-router-dom";
import styled from "./Pagination.module.css";
export default function Pagination({ page, pageSize, totalItems }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const handlerChangePage = (num) => {
    const params = Object.fromEntries([...searchParams]);
    setSearchParams({
      ...params,
      page: page + num, // Gán page với giá trị mới
    });
  };

  return (
    <div className={styled["pagination-container"]}>
      <div>
        {pageSize * (page - 1) + 1}-
        {totalItems > pageSize * page ? pageSize * page : totalItems} of{" "}
        {totalItems}
      </div>
      <button
        className={styled.chevron}
        disabled={page === 1}
        onClick={() => {
          handlerChangePage(-1);
        }}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button
        className={styled.chevron}
        disabled={page * pageSize >= totalItems}
        onClick={() => {
          handlerChangePage(1);
        }}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
}
