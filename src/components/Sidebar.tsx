import React from "react";
import { Layout, Menu, Avatar, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import {
  HomeFilled,
  FireFilled,
  HeartFilled,
  UserOutlined,
  PlaySquareOutlined,
  CustomerServiceOutlined,
  CoffeeOutlined,
  ReadOutlined,
  TrophyOutlined,
  SearchOutlined,
  ExperimentOutlined,
  SettingOutlined,
  CompassOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <HomeFilled style={{ fontSize: "22px" }} />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: "/featured",
      icon: <FireFilled style={{ fontSize: "22px" }} />,
      label: <Link to="/featured">推荐</Link>,
    },
    {
      key: "/follow",
      icon: <CompassOutlined style={{ fontSize: "22px" }} />,
      label: <Link to="/follow">关注</Link>,
    },
    {
      key: "/friend",
      icon: <UserOutlined style={{ fontSize: "22px" }} />,
      label: <Link to="/friend">朋友</Link>,
    },
    {
      key: "/liked",
      icon: <HeartFilled style={{ fontSize: "22px" }} />,
      label: <Link to="/liked">我的喜欢</Link>,
    },
    {
      type: "divider",
      style: { background: "rgba(255, 255, 255, 0.08)", margin: "12px 16px" },
    },
    {
      key: "/demo",
      icon: <ExperimentOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/demo">演示页面</Link>,
    },
    {
      key: "/game",
      icon: <PlaySquareOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/game">游戏</Link>,
    },
    {
      key: "/anime",
      icon: <PlaySquareOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/anime">二次元</Link>,
    },
    {
      key: "/music",
      icon: <CustomerServiceOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/music">音乐</Link>,
    },
    {
      key: "/food",
      icon: <CoffeeOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/food">美食</Link>,
    },
    {
      key: "/knowledge",
      icon: <ReadOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/knowledge">知识</Link>,
    },
    {
      key: "/sports",
      icon: <TrophyOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/sports">体育</Link>,
    },
    {
      type: "divider",
      style: { background: "rgba(255, 255, 255, 0.08)", margin: "12px 16px" },
    },
    {
      key: "/settings",
      icon: <SettingOutlined style={{ fontSize: "20px" }} />,
      label: <Link to="/settings">设置</Link>,
    },
  ];

  return (
    <Sider
      width={240} // 抖音侧边栏宽度
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
      className="custom-scrollbar"
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* 搜索框区域 */}
        <div style={{ padding: "20px 16px 12px" }}>
          <Button
            icon={
              <SearchOutlined
                style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "16px" }}
              />
            }
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "none",
              color: "rgba(255, 255, 255, 0.75)",
              borderRadius: "8px",
              textAlign: "left",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
            }}
            className="search-btn-hover"
          >
            搜索
          </Button>
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, border: "none" }}
        />

        {/* 底部登录/用户信息 */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            marginTop: "auto",
          }}
        >
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              className="user-info-hover"
            >
              <Avatar
                size={40}
                src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_724c0d4aa68cf5c9c275e3bf3949f029.jpeg?card_type=303&column_n=0&from=327834062"
                style={{
                  marginRight: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  我的抖音
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "12px",
                    marginTop: "2px",
                  }}
                >
                  查看个人主页
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
