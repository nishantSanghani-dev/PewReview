import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { sidebarMenus } from '../data/SideBarMenu';

export default function SideBar({ mobileSlideBar, setmobileSlideBar }) {
  const [masterSubMenu, setmasterSubMenu] = useState(false);
  const location = useLocation();
  const permission = useSelector((store) => store.user.permissions);
  // console.log(permission[0]);

  const res = sidebarMenus.filter((menu) => {
    // console.log(menu);
    return permission.some((value) => menu.menuId === value.menuId);
  });
  // console.log(res);

  return (
    <div
      id="wrapper"
      className={`content-wrapper ${mobileSlideBar ? 'toggled' : ''}`}
    >
      {/* sidebar start */}
      <aside id="sidebar">
        <div className="sidebar-menu-section">
          <ul>
            {sidebarMenus
              .filter((menu) => {
                if (menu.isSubMenu) {
                  return menu.children.some((child) =>
                    permission.some(
                      (value) => child.menuId === value.menuId && value.canRead
                    )
                  );
                }

                return permission.some((value) => menu.menuId === value.menuId);
              })
              .map((menu) => {
                // console.log(menu);

                return menu.isSubMenu ? (
                  <li
                    key={menu.menuName}
                    className={`has-submenu ${masterSubMenu ? 'open' : ''}`}
                  >
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setmasterSubMenu(!masterSubMenu);
                      }}
                      className="submenu-toggle d-flex w-100 justify-content-between"
                    >
                      <span>
                        <i className={`demo-icon ${menu.icon}`} />
                        <span>{menu.title}</span>
                      </span>

                      <i className="demo-icon icon-down-arrow" />
                    </Link>

                    <ul
                      className={`submenu ${
                        masterSubMenu ? 'd-block' : 'd-none'
                      }`}
                    >
                      {menu.children
                        .filter((child) =>
                          permission.some(
                            (value) =>
                              child.menuId === value.menuId && value.canRead
                          )
                        )
                        .map((child) => (
                          <li key={child.menuId}>
                            <NavLink to={child.path}>{child.title}</NavLink>
                          </li>
                        ))}
                    </ul>
                  </li>
                ) : (
                  <li
                    key={menu.menuId}
                    onClick={() => setmobileSlideBar(false)}
                  >
                    <NavLink
                      to={menu.path}
                      className={
                        menu.activePath &&
                        location.pathname.includes(menu.activePath)
                          ? 'active'
                          : ''
                      }
                    >
                      <i className={`demo-icon ${menu.icon}`} />
                      <span>{menu.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            {/* {
                            sidebarMenus.filter(menu => {
                                console.log(menu);
                                return permission.some(value => menu.menuId === value.menuId);
                            })
                        } */}
            {/* {sidebarMenus
                            .filter(menu =>
                                permission.some(
                                    permission =>
                                        permission.menuId === menu.menuId && permission.isRead
                                )
                            )
                                
                            .map(menu => (
                                <li key={menu.menuId} onClick={() => setmobileSlideBar(false)}>
                                    <NavLink
                                        to={menu.path}
                                        className={
                                            menu.activePath &&
                                                location.pathname.includes(menu.activePath)
                                                ? "active"
                                                : ""
                                        }
                                    >
                                        <i className={`demo-icon ${menu.icon}`} />
                                        <span>{menu.title}</span>
                                    </NavLink>
                                </li>
                            ))} */}
          </ul>
        </div>
      </aside>
      {/* sidebar end */}
      {/* right content start */}
      <div className="content-inside">
        <Outlet />
      </div>
      {/* right content end */}
    </div>
  );
}
