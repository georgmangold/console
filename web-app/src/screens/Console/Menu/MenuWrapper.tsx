// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  DocumentationIcon,
  LicenseIcon,
  Menu,
  MenuDivider,
  MenuItem,
} from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { validRoutes } from "../valid-routes";
import { menuOpen } from "../../../systemSlice";
import { selFeatures } from "../consoleSlice";
import { getLogoApplicationVariant, getLogoVar } from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import UserMenu from "./UserMenu";

const MenuWrapper = () => {
  const dispatch = useAppDispatch();
  const features = useSelector(selFeatures);
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();

  const sidebarOpen = useSelector(
    (state: AppState) => state.system.sidebarOpen,
  );

  const allowedMenuItems = validRoutes(features);

  return (
    <Menu
      isOpen={sidebarOpen}
      displayGroupTitles
      options={allowedMenuItems}
      applicationLogo={{
        applicationName: getLogoApplicationVariant(),
        subVariant: getLogoVar(),
      }}
      callPathAction={(path) => {
        navigate(path);
      }}
      signOutAction={() => {
        navigate("/logout");
      }}
      collapseAction={() => {
        dispatch(menuOpen(!sidebarOpen));
      }}
      currentPath={pathname}
      mobileModeAuto={false}
      endComponent={
        <Box
          sx={{
            display: "block",
            marginTop: "20px",
          }}
        >
          <MenuDivider />
          <MenuItem
            name={"MinIO Documentation"}
            icon={<DocumentationIcon />}
            path={"https://docs.min.io/community/minio-object-store/index.html"}
            visibleTooltip={!sidebarOpen}
            id="menu-documentation"
          />
          <MenuItem
            name={"License"}
            icon={<LicenseIcon />}
            path={IAM_PAGES.LICENSE}
            onClick={() => navigate(IAM_PAGES.LICENSE)}
            visibleTooltip={!sidebarOpen}
            id="menu-license"
          />
        </Box>
      }
      middleComponent={<UserMenu />}
    />
  );
};

export default MenuWrapper;
