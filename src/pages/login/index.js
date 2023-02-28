import { useState } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Typography,
} from "antd";
const { Title } = Typography;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChange = (e) => {
    switch (e.target.name) {
      case "username":
        setUsername(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;

      default:
        break;
    }
  };

  async function handleSave() {
    const RequestLogin = {
      username: username,
      password: password,
    };
    // TODO: Call the end-point for login;
  }
  return (
    <div style={{ margin: "auto", height: "100vh", width: "max-content" }}>
      <Card>
        <Title level={4}>Welcome back! Please login to access</Title>
        <Form style={{ height: "200px" }}>
          <Input
            type="text"
            name="username"
            value={username}
            label="Username"
            onChange={onChange}
            placeholder="username"
          />
          <Input
            type="password"
            value={password}
            name="password"
            label="Password"
            onChange={onChange}
            placeholder="password"
            style={{ marginTop: "10px" }}
          />

          <Button
            type="primary"
            style={{ marginTop: "10px", width: "100%" }}
            onClick={handleSave}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
