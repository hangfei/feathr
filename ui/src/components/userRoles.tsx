import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Menu,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import { UserRole } from "../models/model";
import { deleteUserRole, listUserRole } from "../api";

const UserRoles = () => {
  const navigate = useNavigate();

  const onDelete = async (row: UserRole) => {
    console.log(
      `The [${row.roleName}] Role of [${row.userName}] user role delete request is sent.`
    );
    const res = await deleteUserRole(row);
    if (res.status === 200) {
      message.success(`Role ${row.roleName} of user ${row.userName} deleted`);
    } else {
      message.error("Failed to delete userrole.");
    }
    setLoading(false);
    fetchData();
  };

  const columns = [
    {
      title: <div>Scope (Project/Global)</div>,
      dataIndex: "scope",
      key: "scope",
      align: "center" as "center",
      sorter: {
        compare: (a: UserRole, b: UserRole) => a.scope.localeCompare(b.scope),
        multiple: 3,
      }
    },
    {
      title: <div style={{ userSelect: "none" }}>Role</div>,
      dataIndex: "roleName",
      key: "roleName",
      align: "center" as "center",
    },
    {
      title: <div>User</div>,
      dataIndex: "userName",
      key: "userName",
      align: "center" as "center",
      sorter: {
        compare: (a: UserRole, b: UserRole) => a.userName.localeCompare(b.userName),
        multiple: 1,
      }
    },
    {
      title: <div>Permissions</div>,
      key: "access",
      dataIndex: "access",
      render: (tags: any[]) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "red" : "green";
            if (tag === "write") color = "blue";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: <div>Create By</div>,
      dataIndex: "createBy",
      key: "createBy",
      align: "center" as "center",
    },
    {
      title: <div>Create Reason</div>,
      dataIndex: "createReason",
      key: "createReason",
      align: "center" as "center",
    },
    {
      title: <div>Create Time</div>,
      dataIndex: "createTime",
      key: "createTime",
      align: "center" as "center",
      sorter: {
        compare: (a: UserRole, b: UserRole) => a.createTime.localeCompare(b.createTime),
        multiple: 2,
      }
    },
    {
      title: "Action",
      key: "action",
      render: (userName: string, row: UserRole) => (
        <Space size="middle">
          <Menu>
            <Menu.Item key="delete">
              <Popconfirm
                placement="left"
                title="Are you sure to delete?"
                onConfirm={() => {
                  onDelete(row);
                }}
              >
                Delete
              </Popconfirm>
            </Menu.Item>
          </Menu>
        </Space>
      ),
    },
  ];
  const [page, setPage] = useState(1);
  const [, setLoading] = useState(false);
  const [tableData, setTableData] = useState<UserRole[]>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await listUserRole();
    console.log(result);
    setPage(page);
    setTableData(result);
    setLoading(false);
  }, [page]);

  const onClickRoleAssign = () => {
    navigate("/role-management");
    return;
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Row>
        <div style={{ flex: 1 }}>
          <>
            <p style={{ width: "80%" }}>
              This page is protected by Feathr Access Control. Only Project
              Admins can retrieve management details and grant or delete user
              roles.
            </p>
          </>
        </div>
      </Row>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={onClickRoleAssign}
          style={{ position: "absolute", right: "12px", top: "70px" }}
        >
          + Create Role Assignment
        </Button>
      </Space>
      <Table dataSource={tableData} columns={columns} />;
    </div>
  );
};

export default UserRoles;
