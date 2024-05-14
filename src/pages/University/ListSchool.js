import React, { useState, useRef } from "react";
import { Table, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const data = [
  {
    key: "1",
    name: "Nha Trang University",
    ucode: "NTU",
    address: "Khánh Hòa",
    targets: 2100,
  },
  {
    key: "2",
    name: "Van Lang University",
    ucode: "VLU",
    address: "TP.HCM",
    targets: 3000,
  },
  {
    key: "3",
    name: "Duy Tan University",
    ucode: "DTU",
    address: "Đà Nẵng",
    targets: 2800,
  },
  {
    key: "4",
    name: "Ha Noi Medical University",
    ucode: "HMU",
    address: "Hà Nội",
    targets: 2000,
  },
  {
    key: "5",
    name: "Hutech University",
    ucode: "DKC",
    address: "TP.HCM",
    targets: 2400,
  },
  {
    key: "6",
    name: "Ha Noi National University",
    ucode: "VNU",
    address: "Hà Nội",
    targets: 2500,
  },
  {
    key: "7",
    name: "Hanoi Polytechnic University ",
    ucode: "BKA",
    address: "Hà Nội",
    targets: 3000,
  },
  {
    key: "8",
    name: "University of Transportation Technology",
    ucode: "GTA",
    address: "TP.HCM",
    targets: 2800,
  },
  {
    key: "9",
    name: "University of Social Sciences and Humanities",
    ucode: "QHX",
    address: "TP.HCM",
    targets: 2130,
  },
  {
    key: "10",
    name: "University of Natural Resources and Environment",
    ucode: "HUNRE",
    address: "Hà Nội",
    targets: 2450,
  },
  {
    key: "11",
    name: "Ton Duc Thang University",
    ucode: "TDTU",
    address: "Khánh Hòa",
    targets: 1900,
  },
  {
    key: "12",
    name: "Khanh Hoa University",
    ucode: "UKH",
    address: "Khánh Hòa",
    targets: 1750,
  },
];

const ListSchool = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const onChange = (pagination, filters, sorter, extra) => {
    const totalRows = extra.total;
    if (totalRows <= 5 && pagination.current === 1) {
      setPagination({ ...pagination, current: 2 });
    } else {
      setPagination(pagination);
    }
    console.log("params", pagination, filters, sorter, extra);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      with: "35%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "University code",
      dataIndex: "ucode",
      width: "15%",
      ...getColumnSearchProps("age"),
    },
    {
      title: "Address",
      dataIndex: "address",
      filters: [
        {
          text: "Hà Nội",
          value: "Hà Nội",
        },
        {
          text: "TP.HCM",
          value: "TP.HCM",
        },
        {
          text: "Đà Nẵng",
          value: "Đà Nẵng",
        },
        {
          text: "Khánh Hòa",
          value: "Khánh Hòa",
        },
      ],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      width: "35%",
    },
    {
      title: "Targets",
      dataIndex: "targets",
      width: "15%",
      sorter: (a, b) => a.targets - b.targets,
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      onChange={onChange}
      pagination={{
        defaultPageSize: "5",
        pageSizeOptions: ["5", "10", "15", "20"],
        total: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
};

export default ListSchool;
