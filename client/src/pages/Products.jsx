// give a similar table structure to this
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts(); // eslint-disable-next-line
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-20">
           {" "}
      <div className="max-w-5xl mx-auto">
               {" "}
        <div className="flex justify-between items-center mb-6">
                   {" "}
          <Link
            to="/products/create"
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 shadow font-semibold flex items-center space-x-2"
          >
                        <span>+ New Product</span>         {" "}
          </Link>
                   {" "}
          <select className="border rounded px-3 py-1 text-gray-600">
                        <option>Show All</option>         {" "}
          </select>
                 {" "}
        </div>
               {" "}
        <div className="mb-4 text-sm text-gray-600">
                    Active Products:          {" "}
          <span className="font-bold text-gray-900">
                        {products.filter((p) => p.active).length} /{" "}
            {products.length}         {" "}
          </span>
                 {" "}
        </div>
               {" "}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}         {" "}
          </div>
        )}
               {" "}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}         {" "}
          </div>
        )}
               {" "}
        <div className="overflow-x-auto bg-white rounded shadow">
                   {" "}
          <table className="min-w-full">
                       {" "}
            <thead>
                           {" "}
              <tr className="text-left text-gray-500 border-b">
                                <th className="py-3 px-4 font-medium"></th>     
                         {" "}
                <th className="py-3 px-2 font-medium">Product Name</th>         
                      <th className="py-3 px-4 font-medium">ASIN</th>           
                    <th className="py-3 px-4 font-medium">Added On</th>         
                     {" "}
                <th className="py-3 px-4 font-medium text-center">Actions</th> 
                           {" "}
              </tr>
                         {" "}
            </thead>
                       {" "}
            <tbody>
                           {" "}
              {loading ? (
                <tr>
                                   {" "}
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                                        Loading products...                  {" "}
                  </td>
                                 {" "}
                </tr>
              ) : products.length === 0 ? (
                <tr>
                                   {" "}
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No products found.                  {" "}
                  </td>
                                 {" "}
                </tr>
              ) : (
                products.map((product, i) => (
                  <tr
                    key={product._id}
                    className={
                      i % 2 === 0
                        ? "bg-gray-50 border-b hover:bg-blue-50"
                        : "bg-white border-b hover:bg-blue-50"
                    }
                  >
                                       {" "}
                    <td className="py-3 px-4">
                                           {" "}
                      <img
                        src={
                          product.imageurl ||
                          "https://via.placeholder.com/40?text=No+Image"
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200 bg-gray-100"
                      />
                                         {" "}
                    </td>
                                       {" "}
                    <td className="py-3 px-2">
                                           {" "}
                      <div className="font-semibold text-gray-900">
                                                {product.name}                 
                           {" "}
                      </div>
                                         {" "}
                    </td>
                                       {" "}
                    <td className="py-3 px-4">
                                           {" "}
                      <div className="flex items-center space-x-2">
                                               {" "}
                        <span>
                                                    {/* Amazon icon */}         
                                         {" "}
                          <svg width="18" height="18" viewBox="0 0 32 32">
                                                       {" "}
                            <circle cx="16" cy="16" r="14" fill="#ff9900" />   
                                                   {" "}
                            <text
                              x="8"
                              y="22"
                              fontSize="16"
                              fontFamily="Arial"
                              fill="#FFF"
                            >
                                                            a                  
                                       {" "}
                            </text>
                                                     {" "}
                          </svg>
                                                 {" "}
                        </span>
                                               {" "}
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-xs font-mono">
                                                   {" "}
                          {product.marketplaceProductId || "--"}               
                                 {" "}
                        </span>
                                             {" "}
                      </div>
                                         {" "}
                    </td>
                                       {" "}
                    <td className="py-3 px-4 text-sm">
                                           {" "}
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "-"}
                                         {" "}
                    </td>
                                       {" "}
                    <td className="py-3 px-4 flex justify-center items-center space-x-2">
                                           {" "}
                      <Link
                        to={`/products/${product._id}/edit`}
                        className="inline-flex p-2 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 focus:outline-none"
                        title="Edit"
                      >
                                                <FiEdit size={18} />           
                                 {" "}
                      </Link>
                                           {" "}
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex p-2 bg-red-50 text-red-700 rounded-full hover:bg-red-100 focus:outline-none"
                        title="Delete"
                      >
                                                <FiTrash2 size={18} />         
                                   {" "}
                      </button>
                                         {" "}
                    </td>
                                     {" "}
                  </tr>
                ))
              )}
                         {" "}
            </tbody>
                     {" "}
          </table>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
