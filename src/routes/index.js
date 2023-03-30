import Container from '../pages/home/Container';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';

const routes = [
    {
        key: "/",
        route: "/",
        component: <Container />
    },
    
    {
        key: "login",
        route: "/login",
        component: <Login />
    },
    
    {
        key: "dashboard",
        route: "/dashboard",
        component: <Dashboard />
    }
]

export default routes;