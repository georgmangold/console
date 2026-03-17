// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
import { useNavigate } from "react-router-dom";
import { BucketsIcon, MenuItem } from "mds";
import { Bucket } from "../../../../api/consoleApi";

interface IBucketListItem {
  bucket: Bucket;
  sidebarOpen: boolean;
  currentPath: string;
}

const BucketListItem = ({
  bucket,
  sidebarOpen,
  currentPath,
}: IBucketListItem) => {
  const navigate = useNavigate();

  const path = `/browser/${bucket.name}`;
  let selected = false;

  if (currentPath && path) {
    if (currentPath.endsWith(path)) {
      selected = true;
    }
  }

  return (
    <MenuItem
      name={bucket.name}
      icon={<BucketsIcon />}
      onClick={() => navigate(path)}
      id={`manageBucket-${bucket.name}`}
      visibleTooltip={!sidebarOpen}
      path={path}
      selected={selected}
    />
  );
};

export default BucketListItem;
