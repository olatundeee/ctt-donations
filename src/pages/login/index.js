import { useCallback, useState } from "react";
import { Card, Button, Form, Input, Typography, Row, Col } from "antd";
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
    console.log("RequestLogin: ", RequestLogin);
    // TODO: Call the end-point for login;
  }

  const disableBtn = useCallback(
    () => password === "" || username === "" || password.length < 4,
    [password, username]
  );

  return (
    <div
      style={{
        margin: "auto",
        height: "100vh",
        width: "max-content",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Row>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 18 }}
          xl={{ span: 18 }}
          xxl={{ span: 18 }}
          style={{ margin: "3rem 0", padding: "2.5%" }}
        >
          <Card
            style={{
              margin: "auto",
              borderRadius: "2em",
              maxWidth: "100vw",
              height: "max-content",
            }}
          >
            <Title level={4}>Welcome back! Please login to access</Title>
            <Form>
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
                disabled={disableBtn()}
                style={{ marginTop: "10px", width: "100%" }}
                onClick={handleSave}
              >
                Login
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
