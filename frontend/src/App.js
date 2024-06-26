import theme from "./Theme";
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import {SnackbarProvider} from "notistack";
import {lazy} from "react";
import RootLayout from "./RootLayout";
import AuthLayout from "./pages/auth/AuthLayout";
import EditorContextProvider from "./pages/editor/EditorContextProvider";
import {Workspace} from "./pages/editor/Workspace";
import Profile from "./pages/users/Profile";
import UserLayout from "./pages/users/UserLayout";
import Projects from "./pages/Projects";

const Login = lazy(() => import("./pages/auth/Login"));
const Registration = lazy(() => import("./pages/auth/Registration"));
const PasswordRecovery = lazy(() => import("./pages/auth/PasswordRecovery"));
const PasswordReset = lazy(() => import("./pages/auth/PasswordReset"));


function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout/>}>
                <Route index element={<Projects />}/>
                <Route path="auth" element={<AuthLayout/>}>
                    <Route path="login" element={<Login/>}/>
                    <Route path="registration" element={<Registration/>}/>
                    <Route path="password-recovery" element={<PasswordRecovery/>}/>
                    <Route path="password-reset/:token" element={<PasswordReset/>}/>
                </Route>
                <Route path="users" element={<UserLayout />}>
                    {/*<Route path="me/settings" element={<ProfileSettings />} />*/}
                    <Route path=":user_id" element={<Profile />} />
                </Route>
                <Route path="projects" element={<EditorContextProvider/>}>
                    <Route index element={<Navigate to={'/projects/create'} />}/>
                    <Route path=":projectId" element={<Workspace/>}/>
                </Route>
                <Route path="*" element={<Navigate to={'/projects'}/>}/>
            </Route>
        )
    );

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <RouterProvider router={router}/>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
