import React, { useEffect, useState } from "react";
import EditProduct from "../../components/EditProductPage/EditProduct";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import { getAdminHeaders } from "../../utils/adminAuth";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/helpers";
function EditProductPage() {
  const [admin, setAdmin] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/auth-admin`,
          {
            headers: getAdminHeaders(),
          }
        );
        setAdmin(response.data.admin);
        // console.log(response.data.message);
      } catch (err) {
        console.log(err);
      }
    };
    getAdmin();
  }, []);

  return (
    <>
      <AdminNavBar admin={admin} />
      <EditProduct admin={admin} />
    </>
  );
}

export default EditProductPage;
