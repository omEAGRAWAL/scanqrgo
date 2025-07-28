import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch product");

      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/products"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2">{product.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Marketplace:</span>
                  <span className="ml-2">{product.marketplace || "Not specified"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Product ID:</span>
                  <span className="ml-2">{product.marketplaceProductId || "Not specified"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
              {product.campaigns && product.campaigns.length > 0 ? (
                <div className="space-y-2">
                  {product.campaigns.map((campaign) => (
                    <div key={campaign._id} className="p-3 bg-gray-50 rounded">
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-gray-600">Status: {campaign.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No campaigns created yet</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <Link
              to={`/products/${product._id}/edit`}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
            >
              Edit Product
            </Link>
            <Link
              to="/products"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
