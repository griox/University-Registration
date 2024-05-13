import React from "react";
import { ColorModeContext, useMode } from "./../../theme";
import "../../assets/css/style.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Redirect, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "../../components/admin/Dashboard";
// import University from "../../components/admin/University";
import Sidebar from "./Sidebar";
import routes from "../../routes/routes";

const Masterlayout = () => {
  const [theme, colorMode] = useMode();
  // const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Navbar />
            <Switch>
              {routes.map((route, idx) => {
                return (
                  route.component && (
                    <Route 
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props) => (
                        <route.component {...props} />
                      )}
                    />
                  )
                )
              })}
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Masterlayout;
