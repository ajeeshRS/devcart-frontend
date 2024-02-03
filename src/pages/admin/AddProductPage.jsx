import React, { useEffect, useState } from "react";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import AddProduct from "../../components/AddProductPage/AddProduct";
import { getAdminHeaders } from "../../utils/adminAuth";
import axios from "axios";
import { BASE_URL } from "../../utils/helpers";
function AddProductPage() {
  const [admin, setAdmin] = useState(null);
  // to get the admin if existed for conditional rendering
  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/admin/add-product`,
          {},
          {
            headers: getAdminHeaders(),
          }
        );
        setAdmin(response.data.admin);
      } catch (err) {
        console.log(err);
      }
    };
    getAdmin();
  }, []);
  return (
    <>
      <AdminNavBar admin={admin} />
      <AddProduct admin={admin} />
    </>
  );
}

export default AddProductPage;
