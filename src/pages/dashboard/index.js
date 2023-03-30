import React, { useEffect, useState }from "react";
import { Button, Card,  Avatar, List } from "antd";
import axios from "axios";
import ops from "../../services/ops";


export default function Dashboard () {
    const [donations, setDonations] = useState([])

    useEffect(() => {
        const fetchSubs = async function () {
            try {
                const subs = await ops.getAllDonations()
                console.log(subs)
                setDonations(subs.data)
            } catch (error) {
                console.log(error)
            }
        }
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/login')
        }

        if (token) fetchSubs();
    }, []);

    return (
        <>
            <div style={{textAlign: 'right', padding: '4vh 4vw'}}>
                <Button style={{textAlign: 'right'}} onClick={() => {
                    localStorage.removeItem('token');
                    window.location.replace('/login')
                }}>Logout</Button>
            </div>
            <div style={{padding: '4vh 20vw'}}>
                <Card style={{
                    margin: "2em auto",
                    borderRadius: "2em",
                    maxWidth: "100vw",
                }}>
                    <h3 style={{textAlign: "center"}}>CTT Donations</h3>
                    <List
                        itemLayout="horizontal"
                        dataSource={donations}
                        renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                            //avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
                            title={<a href="https://ant.design">Donor: {item.name}</a>}
                            description={
                                <>
                                    <p>Amount In Dollars: ${item.donationAmountInDollars}</p>
                                    <p>Amount In Crypto: {item.donationAmountInCrypto}</p>
                                    <p>Payment Option: {item.paymentOption}</p>
                                    <p>Subscription Plan: {item.subscriptionPlan}</p>
                                    {
                                        item.subscription && 
                                        <p>Subscription Period: {item.subscriptionPeriod} {item.subscriptionTimeline}</p>
                                    }
                                </>
                            }
                            />
                        </List.Item>
                        )}
                    />
                </Card>
            </div>
        </>
    )
}