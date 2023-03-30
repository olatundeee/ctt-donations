import { useCallback, useState } from "react";
import { Card, Button, Form, Input, Typography, Row, Col, notification } from "antd";
import {keychain, isKeychainInstalled, hasKeychainBeenUsed} from '@hiveio/keychain';
import { useNavigate } from "react-router";
import ops from '../../services/ops'
const { Title } = Typography;
const hive = require("@hiveio/hive-js");
var jwt = require('jsonwebtoken');
const whitelist = ['starkerz', 'theycallmedan', 'gotgame']

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  
  async function callback2(data) {
    console.log('checkpoint 1')
    if (data.auth == true) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        localStorage.setItem('id', data.id)
        localStorage.setItem('keychain', data.keychain)
        localStorage.setItem('keychainHas', 'no')
        navigate('/dashboard')
    }
  }

  async function fetchMemo (username) {
    let data = await hive.api.getAccountsAsync([username]);
    let pub_key = data[0].posting.key_auths[0][0];
    let memoData = {
        username,
        encoded
    };

    if (data.length === 1)
    {
        const speakBountiesWif = '5Hqg424NMKGe8PtkzmhCc5no2cCRYJCPq6b7YQwTJ28mj3wKYgx'

        var encoded = await hive.memo.encode(speakBountiesWif, pub_key, `log user in`);
        memoData.username = username
        memoData.encoded = encoded
        return memoData
    }
  }

  async function keychainCallbackInner (message, username) {
    let authData = {
        auth: false,
        token: 'null',
        username: 'null',
        id: 'null',
        keychain: 'null'
    }
    console.log('pre checkpoint 2, callback inner running')
    if (message) {
        console.log('pre checkpoint 2 suffix, checking token')
        var token = await ops.getToken(username)
        const user = await hive.api.getAccountsAsync([username])
        
        console.log('pre checkpoint 3, I want to believe callback inner is good at this point')
        authData.auth = true
        authData.token = token
        authData.username = user[0].name
        authData.id = user[0].id
        authData.keychain = 'yes'
        return authData
    }
  }

  async function keychainCallback(memo) {
    const theUsername = memo.username
    const encoded = memo.encoded

    let successMessage = ''

    const res = await keychain(window, 'requestSignBuffer', theUsername, encoded, 'Posting')

    if (res.success) {
        successMessage = res.success
        if (successMessage) {
            console.log('pre checkpoint 1, about to call callback inner')
            const data = await keychainCallbackInner(successMessage, theUsername)
            callback2(data)
        }
    }
  }

  async function handleSave() {
    const RequestLogin = {
      username: username,
      password: password,
    };
    console.log("RequestLogin: ", RequestLogin);
    
    try {
      if (!whitelist.includes(username)){
        return notification.open({
          //message: 'Notification Title',
          description:
          `User is not an admin`,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      }
      if (whitelist.includes(username)){
        notification.open({
          //message: 'Notification Title',
          description:
          `Logging in user ${username}`,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
        const accountData = await hive.api.getAccountsAsync([username])

        const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'test', username, 5,  'test memo', 'HIVE')
        if(isKeychainInstalled) {
          const theMemo = await fetchMemo(username)
          console.log(theMemo)
          await keychainCallback(theMemo)
        }
        // User didn't cancel, so something must have happened
        else if(!cancel) {
            if(notActive) {
                notification.open({
                    //message: 'Notification Title',
                    description:
                    'Please allow Keychain to access this website',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            } else if(notInstalled) {
                notification.open({
                    //message: 'Notification Title',
                    description:
                    'Please install Keychain',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            } else {
                //console.log(error.message)
                notification.open({
                    //message: 'Notification Title',
                    description:
                    'Error encountered',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            }
        }
      }
    } catch (error) {
      notification.open({
        //message: 'Notification Title',
        description:
        'Error encountered',
        onClick: () => {
        console.log('Notification Clicked!');
        },
      });
    }
  }

  const disableBtn = useCallback(
    () => username === "",
    [username]
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
