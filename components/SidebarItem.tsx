import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@mui/material";
import classNames from "classnames";
import ExpandArrow from "../assets/icons/expandArrow.svg";
import { useRouter } from "next/router";

const SidebarItem = ({ toggleCollapse, menu }: any) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<any>({} as any);
  useEffect(() => {
    if (router.pathname !== "/") {
      const _activeMenu = menu.subMenu
        ?.filter((item: any) => item.link !== "/")
        .find((item: any) => router.pathname.indexOf(item.link) >= 0);
      setActiveMenu(_activeMenu);
      if (_activeMenu) {
        setIsexpanded(Object.keys(_activeMenu).length > 0 ? true : false);
      }
    } else {
      const _activeMenu = menu.subMenu?.find(
        (item: any) => router.pathname === item.link
      );
      setActiveMenu(_activeMenu);
      if (_activeMenu) {
        setIsexpanded(Object.keys(_activeMenu).length > 0 ? true : false);
      }
    }
    console.log(router.pathname);
  }, [router.pathname, menu.subMenu]);
  const [isExpanded, setIsexpanded] = useState(
    activeMenu && Object.keys(activeMenu).length > 0 ? true : false
  );

  const getNavItemClasses = () => {
    return classNames(
      "items-center cursor-pointer hover:bg-sky-200 rounded w-full overflow-hidden whitespace-nowrap"
    );
  };
  const getSubMenuItems = (menu: any) => {
    let submenus = menu.subMenu?.map((submenu: any, i: number) => {
      const classes = getNavItemClasses();

      const bgcolor = activeMenu?.id == submenu.id ? "#e0ffff" : "";
      return (
        <div className={classes} style={{ backgroundColor: bgcolor }} key={i}>
          <Link href={submenu.link}>
          <button className="flex py-4 px-3 items-center w-full h-full xxx">
              <div style={{ width: "2.5rem" }}>
                <submenu.icon />
              </div>
              {!toggleCollapse && (
                 <div style={{ fontSize: "14px" }} className="mobile-view">
                  <span
                    className={classNames(
                      "text-md font-medium text-text-light",
                      {
                        hidden: toggleCollapse,
                      }
                    )}
                  >
                    {submenu.label}
                  </span>
                </div>
              )}
            </button>
          </Link>
        </div>
      );
    });

    return submenus;
  };

  const subMenuitems = getSubMenuItems(menu);

  return (
    <div style={{ width: "100%", borderBottom: "1px solid #f7f3f3" }}>
      <div className={getNavItemClasses()}>
        <Link
          href={menu.link}
          onClick={() => {
            setIsexpanded(!isExpanded);
          }}
        >
         <button className="flex py-4 px-3 items-center w-full h-full yyy">
            <div style={{ width: "2.5rem" }}>
              <menu.icon />
            </div>
            {!toggleCollapse && (
              <div
                style={{
                  width: "70%",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                className="mobile-view"
              >
                <span
                  className={classNames("text-md font-medium text-text-light", {
                    hidden: toggleCollapse,
                  })}
                >
                  {menu.label}
                </span>
              </div>
            )}
            {menu.isGroupMenu && (
              <div className={isExpanded ? "rotate-180" : ""}>
                <ExpandArrow />
              </div>
            )}
          </button>
        </Link>
      </div>
      {isExpanded && <div>{subMenuitems}</div>}
    </div>
  );
};

export default SidebarItem;
