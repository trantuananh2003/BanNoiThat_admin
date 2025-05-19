import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import clientAPI from "../../../client-api/rest-client";
import CreateProduct from "./CreateProduct";
import EditProductItem from "./EditProductItem";

const { Search } = Input;

interface Category {
  id: string;
  name: string;
  slug: string;
  children: Category[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string;
  thumbnailFile?: File;
  keyword: string;
  featured: boolean;
  visible: boolean;
  categoryId: string;
  brandId: string;
  description: string;
  isDeleted: boolean;
  category?: Category;
  brand?: Brand;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

const TableProduct: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editProductItemId, setEditProductItemId] = useState<string | null>(
    null
  );
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStatusProduct, setCurrentStatusProduct] =
    useState<Boolean>(false);
  const [isEditProductItemModalVisible, setIsEditProductItemsModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: { result: Product[] } = await clientAPI
          .service("Products")
          .find(
            `PageSize=${20}&PageCurrent=${currentPage}&IsDeleted=${currentStatusProduct}`
          );
        setData(response.result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchCategories = async () => {
      // Fetch categories
      const responseDataCategories = await clientAPI
        .service("Categories/admin")
        .find();
      const categories = (responseDataCategories as { result: Category[] })
        .result;
      const childrenFilter = categories.filter(
        (category) => category.children && category.children.length > 0
      );
      const childrenCategories = childrenFilter.flatMap(
        (category) => category.children
      );
      setCategories(childrenCategories);
    };
    const fetchBrands = async () => {
      const responseDataBrands = await clientAPI.service("Brands").find();
      const brands = (responseDataBrands as { result: Brand[] }).result;
      setBrands(brands);
    };
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, [currentStatusProduct]);

  const handleEdit = (record: Product) => {
    setEditId(record.id);
    setEditProduct(record);
  };

  const handleSave = async (key: string) => {
    const formData = new FormData();
    formData.append("Name", editProduct.name ?? "");
    if (editProduct.thumbnailFile) {
      formData.append("Image", editProduct.thumbnailFile);
    }
    formData.append("Category_Id", editProduct.categoryId ?? "");
    formData.append("Brand_Id", editProduct.brandId ?? "");
    formData.append("Description", editProduct.description ?? "");
    formData.append("Slug", editProduct.slug ?? "");
    console.log(editProduct);
    try {
      await clientAPI.service("products").put(key, formData);
      setData((prevData) =>
        prevData.map((item) =>
          item.id === key ? { ...item, ...editProduct } : item
        )
      );
      setEditId(null);
      // window.location.reload(); // Reload lại toàn bộ trang
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (key: string, isDeleted: Boolean) => {
    let confirm;

    if (isDeleted) {
      confirm = window.confirm("Are you sure you want to delete this product?");
      try {
        await clientAPI.service("Products").remove(key);
        setData((prevData) => prevData.filter((item) => item.id !== key));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    } else {
      confirm = window.confirm("Recover this product?");
      try {
        await clientAPI.service("Products").remove(key + "?isDeleted=false");
        setData((prevData) => prevData.filter((item) => item.id !== key));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleAddNewProduct = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    // Handle the logic for adding a new product here
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditModalCancel = () => {
    setIsEditProductItemsModalVisible(false);
  };

  const handleEditProductItem = (id: string) => {
    setEditProductItemId(id);
    setIsEditProductItemsModalVisible(true);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "isDeleted") {
      setCurrentStatusProduct(true);
    } else {
      setCurrentStatusProduct(false);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: Product) =>
        editId === record.id ? (
          <Input
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
        ) : (
          record.name
        ),
    },
    {
      title: "Danh mục sản phẩm",
      dataIndex: "category",
      key: "category",
      render: (_: any, record: Product) =>
        editId === record.id ? (
          <Select
            value={editProduct.categoryId ?? record.category?.id}
            onFocus={() => {
              // Thiết lập giá trị ban đầu nếu chưa có
              if (!editProduct.id) {
                setEditProduct({
                  ...record, // Giữ nguyên dữ liệu của record
                  id: record.id,
                  categoryId: record.category?.id,
                });
              }
            }}
            onChange={(value) => {
              if (value !== editProduct.categoryId) {
                setEditProduct((prev) => ({
                  ...prev,
                  categoryId: value,
                }));
              }
            }}
            style={{ width: "100%" }}
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          record.category?.name || "Không có danh mục"
        ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (_: any, record: Product) =>
        editId === record.id ? (
          <Select
            value={editProduct.brandId ?? record.brand?.id}
            onFocus={() => {
              if (!editProduct.id) {
                setEditProduct({
                  ...record, // Giữ nguyên dữ liệu của record
                  id: record.id,
                  brandId: record.brand?.id,
                });
              }
            }}
            onChange={(value) => {
              if (value !== editProduct.brandId) {
                setEditProduct((prev) => ({
                  ...prev,
                  brandId: value,
                }));
              }
            }}
            style={{ width: "100%" }}
          >
            {brands.map((brand) => (
              <Select.Option key={brand.id} value={brand.id}>
                {brand.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          record.brand?.name || "Không có thương hiệu"
        ),
    },

    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (_: any, record: Product) =>
        editId === record.id ? (
          <Input
            value={editProduct.slug}
            onChange={(e) =>
              setEditProduct({ ...editProduct, slug: e.target.value })
            }
          />
        ) : (
          record.slug
        ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (_: any, record: Product) =>
        editId === record.id ? (
          <div>
            {editProduct.thumbnailUrl && (
              <img
                src={editProduct.thumbnailUrl}
                alt="Preview"
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 10,
                  objectFit: "cover",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setEditProduct((prev) => ({
                      ...prev,
                      thumbnailFile: file,
                      thumbnailUrl: event.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        ) : (
          <img
            src={record.thumbnailUrl || editProduct.thumbnailUrl || ""}
            alt="Product"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (_: any, record: Product) =>
        editId === record.id ? (
          <Input
            value={editProduct.description}
            onChange={(e) =>
              setEditProduct({ ...editProduct, description: e.target.value })
            }
          />
        ) : (
          record.description
        ),
    },
    {
      title: "Từ khóa",
      dataIndex: "keyword",
      key: "keyword",
    },
    // {
    //     title: 'Tiêu biểu',
    //     dataIndex: 'featured',
    //     key: 'featured',
    //     render: (featured: boolean) => (
    //         <Checkbox
    //             checked={featured}
    //             onChange={(e) => setEditProduct({ ...editProduct, featured: e.target.checked })}
    //         />
    //     ),
    // },
    // {
    //     title: 'Hiển thị',
    //     dataIndex: 'visible',
    //     key: 'visible',
    //     render: (visible: boolean) => (
    //         <Checkbox
    //             checked={visible}
    //             onChange={(e) => setEditProduct({ ...editProduct, visible: e.target.checked })}
    //         />
    //     ),
    // },
    {
      title: "Tác vụ",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <div className="flex space-x-2">
          {editId === record.id ? (
            <div className="flex gap-3">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => handleSave(record.id)}
              />
              <Button onClick={() => setEditId(null)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Button
                type="primary"
                icon={<ToolOutlined />}
                onClick={() => handleEditProductItem(record.id)}
              >
                {" "}
                Phân loại
              </Button>
              {record.isDeleted === false ? (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id, true)}
                />
              ) : (
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDelete(record.id, false)}
                >
                  {" "}
                  Khôi phục{" "}
                </Button>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Search placeholder="Nhập từ khóa tìm kiếm" className="mb-4" />
      {/*Thêm mới sản phẩm*/}
      <div className="flex justify-between items-center mb-4">
        <Button type="primary" className="mb-4" onClick={handleAddNewProduct}>
          Thêm mới
        </Button>
        <div className="flex">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Trạng thái sản phẩm:
          </label>
          <select
            name="status"
            id="productStatus"
            onChange={handleStatusChange}
            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">Chưa xóa</option>
            <option value="isDeleted">Đã xóa</option>
          </select>
        </div>
      </div>

      <Modal
        isOpen={isModalVisible}
        ariaHideApp={false}
        onRequestClose={handleModalCancel}
      >
        <CreateProduct />
        <div className="flex justify-end mt-4">
          <Button type="primary" onClick={handleModalOk}>
            OK
          </Button>
          <Button onClick={handleModalCancel} className="ml-2">
            Cancel
          </Button>
        </div>
      </Modal>

      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20"],
        }}
      />
      {/*Cập nhập product items*/}
      <Modal
        isOpen={isEditProductItemModalVisible}
        onRequestClose={handleEditModalCancel}
        ariaHideApp={false}
      >
        <Button
          onClick={handleEditModalCancel}
          className="fixed top-10 right-10 m-3 bg-red-500 text-white"
        >
          X
        </Button>
        {editProductItemId && (
          <EditProductItem
            productId={editProductItemId}
            setEditProduct={setIsEditProductItemsModalVisible}
          />
        )}
      </Modal>
    </div>
  );
};

export default TableProduct;
