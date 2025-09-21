// This file is part of Console Server
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

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginStrategyType } from "./login.types";
import { AppState, useAppDispatch } from "../../store";
import { useSelector } from "react-redux";
import { getFetchConfigurationAsync } from "./loginThunks";
import { fetchSession } from "./sessionThunk";
import LoadingComponent from "common/LoadingComponent";

const SSOLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userLoggedIn = useSelector((state: AppState) => state.system.loggedIn);
  const sessionLoadingState = useSelector(
    (state: AppState) => state.console.sessionLoadingState,
  );

  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  const loginStrategy = useSelector(
    (state: AppState) => state.login.loginStrategy,
  );
  const loadingFetchConfiguration = useSelector(
    (state: AppState) => state.login.loadingFetchConfiguration,
  );
  useEffect(() => {
    if (loadingFetchConfiguration) {
      dispatch(getFetchConfigurationAsync());
    }
  }, [loadingFetchConfiguration, sessionLoadingState, dispatch]);

  useEffect(() => {
    if (!loadingFetchConfiguration) {
      if (!userLoggedIn) {
        if (loginStrategy.loginStrategy === loginStrategyType.redirect) {
          if (
            loginStrategy.redirectRules &&
            loginStrategy.redirectRules.length > 0
          ) {
            if (loginStrategy.redirectRules[0].redirect) {
              window.location.href = loginStrategy.redirectRules[0].redirect;
              return;
            }
          }
        } else {
          navigate("login");
          return;
        }
      } else {
        navigate("browser");
        return;
      }
    }
  }, [
    loadingFetchConfiguration,
    sessionLoadingState,
    userLoggedIn,
    loginStrategy,
    dispatch,
    navigate,
  ]);

  return <LoadingComponent />;
};

export default SSOLogin;
