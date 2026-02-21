import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccountsMenuIcon,
  AddIcon,
  MenuItem,
  MenuSectionHeader,
  MultipleBucketsIcon,
  ObjectBrowserIcon,
} from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { useLocation, useNavigate } from "react-router-dom";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import BucketsListing from "./Listing/BucketsListing";
import { setAddBucketOpen } from "../Buckets/ListBuckets/AddBucket/addBucketsSlice";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();

  const sidebarOpen = useSelector(
    (state: AppState) => state.system.sidebarOpen,
  );

  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <>
      <MenuSectionHeader label={"User"} />
      <MenuItem
        name={"Create Bucket"}
        icon={<AddIcon />}
        onClick={() => dispatch(setAddBucketOpen(true))}
        visibleTooltip={!sidebarOpen}
      />
      <MenuItem
        group="User"
        name="Object Browser"
        id="object-browser"
        path={IAM_PAGES.OBJECT_BROWSER_VIEW}
        icon={<ObjectBrowserIcon />}
        currentPath={pathname}
        onClick={(path) => {
          navigate(path);
        }}
      />
      <MenuItem
        group="User"
        id="nav-accesskeys"
        path={IAM_PAGES.ACCOUNT}
        name="Access Keys"
        icon={<AccountsMenuIcon />}
        currentPath={pathname}
        onClick={(path) => {
          navigate(path);
        }}
      />
      <Accordion
        title={
          <MenuItem
            name={"Buckets"}
            icon={<MultipleBucketsIcon />}
            visibleTooltip={!sidebarOpen}
          />
        }
        id={"menu-bucket-list"}
        expanded={expanded}
        onTitleClick={() => setExpanded(!expanded)}
        sx={{
          border: "0px",
          padding: "0px",
          ".accordionTitle": {
            padding: "unset",
            backgroundColor: "unset !important",
            width: sidebarOpen ? "250px" : "80px",
            menuItemButton: {
              width: "29px",
            },
            "svg.min-icon:nth-child(2)": {
              marginRight: "25px",
              backgroundColor: "rgb(28, 36, 54)",
              color: "rgb(202, 218, 232)",
              width: "15px",
              height: "15px",
              minWidth: "15px",
              minHeight: "15px",
              borderRadius: "2px",
              position: sidebarOpen ? "unset" : "relative",
              left: sidebarOpen ? "unset" : "-50%",
              top: sidebarOpen ? "unset" : "7px",
              transform: sidebarOpen
                ? "unset"
                : "translateX(50%) translateY(20%)",
            },
            "span:nth-child(1) > button:nth-child(1)": {
              width: "80px",
            },
          },
          ".accordionContent": {
            borderTop: expanded ? "1px solid rgb(50, 60, 78)" : "0px",
          },
        }}
      >
        <BucketsListing />
      </Accordion>
    </>
  );
};

export default UserMenu;
