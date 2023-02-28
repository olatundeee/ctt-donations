import Container from '../pages/home/Container';
import Login from '../pages/login';

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
        component: <h1>This is the dashboard page</h1>
    }
]

export default routes;