import React, { useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Input, Divider, Radio, Space, notification, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import axios from "axios";

import cttLogo from './assets/cttLogo.png'
import cttCover from './assets/cttCoverImg.png'

const { Paragraph } = Typography;

export default function Container() {
    const [ellipsis, setEllipsis] = useState(true);
    const [ellText, setEllText] = useState('Expand')
    const [donationPlan, setDonationPlan] = useState('once');
    const [recDonationPlan, setRecDonationPlan] = useState('');
    const [donationAmount, setDonationAmount] = useState(0);
    const [cryptoDonationAmount, setCryptoDonationAmount] = useState('0');
    const [isOneTimeModalOpen, setIsOneTimeModalOpen] = useState(false);
    const [isDonationPlanModalOpen, setIsDonationPlanModalOpen] = useState(false);
    const [oneTimeAmtBg, setOneTimeAmtBg] = useState('#c1172c');
    const [enterPersonalDetails, setEnterPersonalDetails] = useState(false);
    const [donorFullName, setDonorFullName] = useState('');
    const [donorHiveUsername, setDonorHiveUsername] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [paymentOption, setPaymentOption] = useState('')
    const [donationChosen, setDonationChosen] = useState(false)
    const [noOfWeeks, setNoOfWeeks] = useState(1)
    const [noOfMonths, setNoOfMonths] = useState(1)
    const [lightningInvoice, setLightningInvoice] = useState('')
    const [lightningModal, setLightningModal] = useState(false)
    const [lightningQr, setLightningQr] = useState(false)
    const [straightToPlan, setStraightToPlan] = useState(false)
    const [qrDisp, setQrDisp] = useState(false)
    const [hivePayModal, setHivePayModal] = useState(false)

    const getDonationAmountInCrypto = async (token) => {
        const base = 'https://api.coingecko.com/api/v3';

        const getTokenPrice = await axios.get(`${base}/simple/price?ids=${token}&vs_currencies=usd`);
        let tokenPrice = 0

        if (token === 'hive') {
            tokenPrice = getTokenPrice.data.hive.usd
            setCryptoDonationAmount((donationAmount / tokenPrice).toFixed(3) + ' HIVE')
        }
        if (token === 'hive_dollar') {
            tokenPrice = getTokenPrice.data.hive_dollar.usd
            setCryptoDonationAmount((donationAmount / tokenPrice).toFixed(3) + ' HBD')
        }
        if (token === 'bitcoin') {
            tokenPrice = getTokenPrice.data.bitcoin.usd
            setCryptoDonationAmount((donationAmount / tokenPrice).toFixed(8) + ' BTC')
        }
        if (token === 'stellar') {
            tokenPrice = getTokenPrice.data.stellar.usd
            setCryptoDonationAmount((donationAmount / tokenPrice).toFixed(3) + ' XLM')
        }
    }

    const preparePaymentObj = () => {
        let paymentObj = {}
        paymentObj.name = donorFullName;
        paymentObj.hiveUsername = donorHiveUsername;
        paymentObj.email = donorEmail
        paymentObj.donationAmountInDollars = donationAmount;
        paymentObj.donationAmountInCrypto = cryptoDonationAmount;
        return paymentObj;
    }

    const showOneTimeModal = () => {
        setIsOneTimeModalOpen(true);
        setEnterPersonalDetails(false)
        setPaymentOption('')
        setQrDisp(false)
    };

    const handleOneTimeOk = () => {
    setIsOneTimeModalOpen(false);
    setDonationAmount(0);
    setEnterPersonalDetails(false)
    setPaymentOption('')
    setQrDisp(false)
    };

    const handleOneTimeCancel = () => {
    setIsOneTimeModalOpen(false);
    setDonationAmount(0);
    setEnterPersonalDetails(false)
    setPaymentOption('')
    setQrDisp(false)
    };

    const onOneTimeFinish = (values) => {
        console.log('Success:', values);
        setDonationAmount(values.oneTimeAmount)
        setEnterPersonalDetails(true)
        setPaymentOption('')
    };

    const onOneTimeFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onEnterDetailsFinish = async (values) => {
        notification.open({
            //message: 'Notification Title',
            description:
            'Processing..',
            onClick: () => {
            console.log('Notification Clicked!');
            },
        });

        setEnterPersonalDetails(true);
        setDonorFullName(values.donorFullName);
        setDonorEmail(values.donorEmail);
        setDonorHiveUsername(values.donorHiveUsername)
        try {
            switch(paymentOption) {
                case 'hive':
                    try {
                        const donationInCrypto = await getDonationAmountInCrypto('hive')
                        const memo = `One time donation in support of cttpodcast of a total sum of ${donationAmount} HIVE`;
                        
                        
                        /*const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'test', 'therealwolf', 5,  'test memo', 'HIVE')
                            if (isKeychainInstalled) {
                                notification.open({
                                    //message: 'Notification Title',
                                    description:
                                    'Loading, please wait',
                                    onClick: () => {
                                    console.log('Notification Clicked!');
                                    },
                                });
                                const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', donorHiveUsername, 'cttpodcast', parseFloat(donationAmount).toFixed(3), memo, 'HIVE');

                                if (success) {
                                    notification.open({
                                        //message: 'Notification Title',
                                        description:
                                        'Transfer completed successfully, thank you for your donation',
                                        onClick: () => {
                                        console.log('Notification Clicked!');
                                        },
                                    });
                                }
                            } else {
                                notification.open({
                                    //message: 'Notification Title',
                                    description:
                                    'Please install and login to Hive keychain to transfer',
                                    onClick: () => {
                                    console.log('Notification Clicked!');
                                    },
                                });
                            }
                            console.log(donationAmount, typeof donationAmount)
                        // All good
                        if(success) {
                        // do your thing
                        }
                        // User didn't cancel, so something must have happened
                        else if(!cancel) {
                        if(notActive) {
                            // alert('Please allow Keychain to access this website')
                        } else if(notInstalled) {
                            // alert('Please install Keychain')
                        } else {
                            // error happened - check msg
                        }
                        }*/



                    } catch (error) {
                        notification.open({
                            //message: 'Notification Title',
                            description:
                            'Error encountered, please try again',
                            onClick: () => {
                            console.log('Notification Clicked!');
                            },
                        });
                    }
                    break;
                case 'hbd':
                    try {
                        
                        const donationInCrypto = await getDonationAmountInCrypto('hive_dollar')
                        //const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'test', 'therealwolf', 5,  'test memo', 'HIVE')

                        // All good
                        /*if(success) {
                            // do your thing
                            if (isKeychainInstalled) {
                                notification.open({
                                    //message: 'Notification Title',
                                    description:
                                    'Loading, please wait',
                                    onClick: () => {
                                    console.log('Notification Clicked!');
                                    },
                                });
                                
                                const memo = `One time donation in support of cttpodcast`;
                                console.log(donorHiveUsername, 'cttpodcast', parseFloat(donationAmount).toFixed(3), memo)

                                let operation = [
                                    "transfer",
                                    {
                                        "from": donorHiveUsername,
                                        "to": 'cttpodcast',
                                        "amount": parseFloat(donationAmount).toFixed(3) + " HBD",
                                        "memo": memo
                                    }
                                ]

                                const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestBroadcast', donorHiveUsername, [operation], 'Active');

                                if (success) {
                                    notification.open({
                                        //message: 'Notification Title',
                                        description:
                                        'Transfer completed successfully, thank you for your donation',
                                        onClick: () => {
                                        console.log('Notification Clicked!');
                                        },
                                    });
                                }
                            } else {
                                notification.open({
                                    //message: 'Notification Title',
                                    description:
                                    'Please install and login to Hive keychain to transfer',
                                    onClick: () => {
                                    console.log('Notification Clicked!');
                                    },
                                });
                            }
                        }
                        // User didn't cancel, so something must have happened
                        else if(!cancel) {
                        if(notActive) {
                            // alert('Please allow Keychain to access this website')
                        } else if(notInstalled) {
                            // alert('Please install Keychain')
                        } else {
                            // error happened - check msg
                        }
                        }*/

                            
                            

                        

                    } catch (error) {
                        notification.open({
                            //message: 'Notification Title',
                            description:
                            'Error encountered, please try again',
                            onClick: () => {
                            console.log('Notification Clicked!');
                            },
                        });
                        console.log(error)
                    }
                    break;
                case 'lightning':
                    try {
                        
                        const donationInCrypto = await getDonationAmountInCrypto('bitcoin')
                        /*notification.open({
                            //message: 'Notification Title',
                            description:
                            'Loading, please wait',
                            onClick: () => {
                            console.log('Notification Clicked!');
                            },
                        });
                        notification.open({
                            //message: 'Notification Title',
                            description:
                            'Generating bar code, please be patient...',
                            onClick: () => {
                            console.log('Notification Clicked!');
                            },
                        });
                                            
                        const memo = `One time donation in support of cttpodcast`;
                        const getLightningInvoice = await axios.get(`https://api.v4v.app/v1/new_invoice_hive?hive_accname=cttpodcast&amount=${parseFloat(donationAmount).toFixed(3)}&currency=HIVE&usd_hbd=false&app_name=ctt_donations&expiry=300&message=${memo}&qr_code=base64_png`)
                        console.log(donorHiveUsername, 'cttpodcast', parseFloat(donationAmount).toFixed(3))
                        console.log(getLightningInvoice)
                        notification.open({
                            //message: 'Notification Title',
                            description:
                            'Almost done!',
                            onClick: () => {
                            console.log('Notification Clicked!');
                            },
                        });
                        setLightningInvoice(getLightningInvoice.data.payment_request)
                        setLightningQr(getLightningInvoice.data.qr_code_base64);
                        console.log('base64', getLightningInvoice.data.qr_code_base64)
                        setQrDisp(true)*/
                    } catch (error) {
                        console.log(error)
                        notification.open({
                            //message: 'Notification Title',
                            description:
                            'Error encountered, please try again',
                            onClick: () => {
                            console.log('Notification Clicked!');
                            },
                        });
                    }
                    break;
                case 'hivepay': 
                    try {
                        notification.open({
                            //message: 'Notification Title',
                            description:
                            'Loading, please wait',
                            onClick: () => {
                            console.log('Notification Clicked!');
                            },
                        });

                        setHivePayModal(true)
                    } catch (error) {

                    }
                    break;
                case 'btc' :
                    try {
                        const donationInCrypto = await getDonationAmountInCrypto('bitcoin')
                    } catch (error) {
                        
                    }
                    break;
                case 'xlm' :
                    try {
                        const donationInCrypto = await getDonationAmountInCrypto('stellar')
                    } catch (error) {
                        
                    }
                    break;
                default:
                // code block
            }
            setTimeout(async () => {
                const paymentObjDeets = await preparePaymentObj();
                console.log(paymentObjDeets)
            }, 8000)
            
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
        

    };

    const onEnterDetailsFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    };
    
    const showDonationPlanModal = () => {
        setIsDonationPlanModalOpen(true);
        //setRecDonationPlan('');
    };

    const handleDonationPlanOk = () => {
        setIsDonationPlanModalOpen(false);
        setRecDonationPlan('');
    };

    const handleDonationPlanCancel = () => {
        setIsDonationPlanModalOpen(false);
        setRecDonationPlan('');
    };

    const onChoosePlanRadioChange = (e) => {
        console.log('radio value', e.target.value)
        if (e.target.value === 'knighthood') setNoOfMonths(20)
        setRecDonationPlan(e.target.value)
        //setDonationChosen(true)
    }

    const onChoosePlanBtnChange = () => {
        console.log('salo', recDonationPlan)
        setDonationChosen(true)
    }

    const handleDonationChosenOk = () => {
        setRecDonationPlan('')
        setDonationChosen(false);
    };

    const handleDonationChosenCancel = () => {
        setRecDonationPlan('')
        setDonationChosen(false);
    };

    const onEnterRecDetailsFinish = (values) => {
        let subLength = 1 
        if (recDonationPlan === 'weekly') subLength = noOfWeeks;
        if (recDonationPlan === 'monthly') subLength = noOfMonths;
        if (recDonationPlan === 'knighthood') subLength = 20;
        console.log('Success:', donationAmount, donorFullName, donorHiveUsername, donorEmail, paymentOption, subLength);
    };
    
    const onEnterRecDetailsFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleLightningOk = () => {
        setLightningModal(false);
    };

    const handleLightningCancel = () => {
        setLightningModal(false);
    };

    const revealQr = async () => {
        
    }

    return (
        <>
            <div style={{margin: '1rem'}}>
                <img src={cttLogo} alt="logo" />
            </div>

            <div style={{backgroundImage: `url(${cttCover})`, padding: '3rem'}}>
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }}>
                        <h2 style={{backgroundColor: '#000', color: '#fff', width: 'fit-content', padding: '1rem'}}>SUPPORT OUR GROWING MOVEMENT</h2>
                        <h2 style={{backgroundColor: '#000', color: '#fff', width: 'fit-content', padding: '1rem'}}>DONATE TO RECIEVE MORE VALUE FROM US</h2>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }} xl={{ span: 18 }} xxl={{ span: 18 }} style={{margin: '3rem 0', padding: '2.5%'}}>
                    <Card style={{margin: 'auto', borderRadius: '2em', maxWidth: '100vw'}}>
                        <p style={{color: '#656565', fontSize: '1.5rem', display: 'flex', justifyContent: 'center'}}>
                            Join us every week for a lively discussion on the latest in Web3 and blockchain technology.<br /> From decentralized finance to NFTs, we'll dive into the most exciting developments shaping the future of the internet.<br /> Get ready for a thought-provoking and informative listen!
                        </p>

                        <p style={{color: '#656565', fontSize: '2rem', display: 'flex', justifyContent: 'center'}}>
                            <b>SUPPORT US, DONATE NOW</b>
                        </p>

                        <Row>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }} style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{margin: '1rem', backgroundColor: '#c1172c', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationPlan('once')
                                    setDonationAmount('others')
                                    showOneTimeModal()
                                }}>ONE TIME DONATION</Button>
                            </Col>

                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 12 }} xxl={{ span: 12 }} style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationPlan('recurring')
                                    showDonationPlanModal()
                                }}>CHECK OUT OUR DONATION PLANS</Button>
                            </Col>
                        </Row>
                    </Card>

                    <Card style={{margin: '2em auto', borderRadius: '2em', maxWidth: '100vw'}}>
                        <h2 style={{color: '#656565'}}>Donation Amount</h2>
                        <Row>
                            <Col style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{backgroundColor: donationAmount === 1000 ? oneTimeAmtBg : '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationAmount(1000)
                                    setDonationPlan('once')
                                    showOneTimeModal()
                                }}>$1000</Button>
                            </Col>

                            <Col style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{backgroundColor: donationAmount === 500 ? oneTimeAmtBg : '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationAmount(500)
                                    setDonationPlan('once')
                                    showOneTimeModal()
                                }}>$500</Button>
                            </Col>

                            <Col style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{overflowWrap: 'break-word', backgroundColor: donationAmount === 200 ? oneTimeAmtBg : '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationAmount(200)
                                    setDonationPlan('once')
                                    showOneTimeModal()
                                }}>$200</Button>
                            </Col>

                            <Col style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{overflowWrap: 'break-word', backgroundColor: donationAmount === 100 ? oneTimeAmtBg : '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationAmount(100)
                                    setDonationPlan('once')
                                    showOneTimeModal()
                                }}>$100</Button>
                            </Col>

                            <Col style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{overflowWrap: 'break-word', backgroundColor: donationAmount === 50 ? oneTimeAmtBg : '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationAmount(50)
                                    setDonationPlan('once')
                                    showOneTimeModal()
                                }}>$50</Button>
                            </Col>

                            <Col style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{overflowWrap: 'break-word', backgroundColor: donationAmount === 'others' ? oneTimeAmtBg : '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                    setDonationAmount('others')
                                    setDonationPlan('once')
                                    showOneTimeModal()
                                }}>Other</Button>
                            </Col>
                        </Row>
                    </Card>

                    <Card style={{margin: '2em auto', borderRadius: '2em', maxWidth: '100vw'}}>
                        <h2 style={{color: '#656565', textAlign: 'right'}}>One Time Donation</h2>
                        <p style={{color: '#666'}}>Support us with a one time donation. Donations above $50 get a special shoutout on the show. Donations above $200 will automatically become associate producers</p>
                        <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: 'teal', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                            setDonationPlan('once')
                            showOneTimeModal()
                        }}>SUPPORT US</Button>
                    </Card>

                    <Card style={{margin: '2em auto', borderRadius: '2em', maxWidth: '100vw'}}>
                        <h2 style={{color: '#656565', textAlign: 'center'}}>Knighthood</h2>
                        <p style={{color: '#666'}}>$1000 will get you seated at the roundtable with the rest of the glorious Knights of the realm. You also get a Sir/Dame title prepended to your name</p>
                        <div style={{textAlign: 'center'}}>
                            <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#c1172c', color: '#fff', height: '2.5rem', fontWeight: '700', textAlign: 'right'}} onClick={() => {
                                setDonationPlan('recurring')
                                setStraightToPlan(true)
                                setRecDonationPlan('knighthood')
                                showDonationPlanModal()
                            }}>BECOME A SPONSOR</Button>
                        </div>
                    </Card>

                    <Card style={{margin: '2em auto', borderRadius: '2em', maxWidth: '100vw'}}>
                        <h2 style={{color: '#656565', textAlign: 'left'}}>Knight Layaway Plan</h2>
                        <p style={{color: '#666'}}>This is our original 20 month program whereby you can obtain your Knighthood with a monthly $50 donation for 20 months. Click here for that.</p>
                        <div style={{textAlign: 'right'}}>
                            <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                                setDonationPlan('recurring')
                                setStraightToPlan(true)
                                setRecDonationPlan('knighthood')
                                showDonationPlanModal()
                            }}>GET STARTED</Button>
                        </div>
                        
                    </Card>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }} xl={{ span: 6 }} xxl={{ span: 6 }} style={{margin: '3rem 0', padding: '2.5%'}}>

                    <Card style={{margin: '1.5rem auto', borderTop: 'none', borderBottom: 'teal 3px solid', borderRight: 'none', borderLeft: 'none'}}>
                        <h3>Weekly</h3>
                        <p style={{color: '#666'}}>We are offering you tons of value for just $4 a week</p>
                        <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                            setDonationPlan('recurring')
                            setStraightToPlan(true)
                            setRecDonationPlan('weekly')
                            showDonationPlanModal()
                        }}>DONATE NOW</Button>
                    </Card>

                    <Card style={{margin: '1.5rem auto', borderTop: 'none', borderBottom: 'teal 3px solid', borderRight: 'none', borderLeft: 'none'}}>
                        <h3>Layaway Knighthood/Monthly</h3>
                        <p style={{color: '#666'}}>Commit to a $50/month donation for 20 months and earn a knighthood.</p>
                        <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                            setDonationPlan('recurring')
                            setStraightToPlan(true)
                            setRecDonationPlan('knighthood')
                            showDonationPlanModal()
                        }}>DONATE NOW</Button>
                    </Card>

                    <Card style={{margin: '1.5rem auto', borderTop: 'none', borderBottom: 'teal 3px solid', borderRight: 'none', borderLeft: 'none'}}>
                        <h3>Get a Podcast Licence</h3>
                        <p style={{color: '#666'}}>Every donation above $33.33 is qualified to get a podcasting licence from the CTT podcast team</p>
                        <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                            setDonationPlan('recurring')
                            setStraightToPlan(true)
                            setRecDonationPlan('monthly')
                            showDonationPlanModal()
                        }}>DONATE NOW</Button>
                    </Card>

                    <Card style={{margin: '1.5rem auto', borderTop: 'none', borderBottom: 'teal 3px solid', borderRight: 'none', borderLeft: 'none'}}>
                        <h3>Hyper Lucky 3</h3>
                        <p style={{color: '#666'}}>$33.33/month with a boarding pass to the Mothership</p>
                        <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                            setDonationPlan('recurring')
                            setStraightToPlan(true)
                            setRecDonationPlan('monthly')
                            showDonationPlanModal()
                        }}>DONATE NOW</Button>
                    </Card>

                    <Card style={{margin: '1.5rem auto', borderTop: 'none', borderBottom: 'teal 3px solid', borderRight: 'none', borderLeft: 'none'}}>
                        <h3>Full Knighthood</h3>
                        <p style={{color: '#666'}}>Get the prefix Sir/Dame added to your name. This is a very elite group of people</p>
                        <div s></div>
                        <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                            setDonationPlan('recurring')
                            setStraightToPlan(true)
                            setRecDonationPlan('knighthood')
                            showDonationPlanModal()
                        }}>DONATE NOW</Button>
                    </Card>

                    
                    <Card style={{margin: '1.5rem auto', borderTop: 'none', borderBottom: 'teal 3px solid', borderRight: 'none', borderLeft: 'none'}}>
                        <h3>Become an Executive Producer</h3>
                        <p style={{color: '#666'}}>Any donationabove $200 automatically becomes an executive producer on the podcast.</p>
                        <div s></div>
                        <Button style={{margin: '1rem', overflowWrap: 'break-word', backgroundColor: '#666', color: '#fff', height: '2.5rem', fontWeight: '700'}} onClick={() => {
                            setDonationPlan('once')
                            setDonationAmount('others')
                            showOneTimeModal()
                        }}>DONATE NOW</Button>
                    </Card>
                </Col>
            </Row>
            <Modal 
                open={isOneTimeModalOpen} 
                onOk={handleOneTimeOk} 
                onCancel={handleOneTimeCancel}
                okButtonProps={{ style:{...{ backgroundColor: '#c1172c', color: '#fff' }} }}
                cancelButtonProps={{ style:{...{ backgroundColor: '#666', color: '#fff' }} }}
            >
                {
                    donationAmount !== 'others' && 
                    <>
                        <p><b>Amount to Donate:</b> ${donationAmount} <span style={{cursor: 'pointer', color: '#c1172c'}} onClick={() => {
                            setDonationAmount('others')
                            setEnterPersonalDetails(false)
                            setPaymentOption('')
                        }}>Edit</span></p>
                        <Input placeholder={donationAmount} disabled />
                        {
                            !enterPersonalDetails && 
                            <div style={{margin: '2vw auto', display: 'flex', justifyContent: 'center'}}>
                                <Button type="primary" htmlType="submit" style={{
                                    backgroundColor: '#c1172c',
                                    padding: '0 3rem',
                                    textAlign: 'center'
                                }}
                                onClick={() => {
                                    setEnterPersonalDetails(true)
                                    setPaymentOption('')
                                }}>
                                    Submit
                                </Button>
                            </div>
                        }
                        
                    </>
                }
                {
                    donationAmount === 'others' && 
                    <Form
                        name="basic"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{
                            maxWidth: '100%',
                            minWidth: '100%',
                            width: '100%',
                            color: "#666"
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onOneTimeFinish}
                        onFinishFailed={onOneTimeFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Enter Donation Amount"
                            name="oneTimeAmount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Amount is required',
                                }
                            ]}
                            style={{
                                color: "#666"
                            }}
                            value={donationAmount !== 'others' ? donationAmount : ''}
                        >
                            <Input />
                        </Form.Item>
                        {
                            !enterPersonalDetails && 
                            <Form.Item
                                wrapperCol={{
                                    span: 24
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <Button type="primary" htmlType="submit" style={{
                                    backgroundColor: '#c1172c',
                                    padding: '0 3rem',
                                    textAlign: 'center'
                                }}>
                                    Submit
                                </Button>
                            </Form.Item>
                        }
                    </Form>
                }
                {
                    enterPersonalDetails &&
                    <Divider />
                }
                {
                    enterPersonalDetails &&
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Card style={{
                            width: '100%',
                            border: 'none'
                        }}>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 24,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                style={{
                                    maxWidth: '100%',
                                    minWidth: '100%',
                                    width: '100%',
                                    color: "#666"
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onEnterDetailsFinish}
                                onFinishFailed={onEnterDetailsFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Enter Full Name, Alias or Nickname"
                                    name="donorFullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Name is required',
                                        }
                                    ]}
                                    style={{
                                        color: "#666"
                                    }}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Enter Hive Username(optional)"
                                    name="donorHiveUsername"
                                    rules={[
                                        {
                                            required: false,
                                        }
                                    ]}
                                    style={{
                                        color: "#666"
                                    }}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Enter Email"
                                    name="donorEmail"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Email is required'
                                        }
                                    ]}
                                    style={{
                                        color: "#666"
                                    }}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Choose Payment Option"
                                    name="paymentOption"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Payment option is required'
                                        }
                                    ]}
                                    style={{
                                        color: "#666"
                                    }}
                                >
                                    <Radio.Group defaultValue={paymentOption} buttonStyle="solid" onChange={(e) => {setPaymentOption(e.target.value)}}>
                                        
                                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="hive">HIVE(Keychain)</Radio.Button>
                                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="hbd">Hive Back Dollars/HBD(Keychain)</Radio.Button>
                                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="btc">Bitcoin(BTC)</Radio.Button>
                                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="lightning">Lightning</Radio.Button>
                                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="xlm">Stellar(XLM)</Radio.Button>
                                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="hivepay">HivePay</Radio.Button>
                                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="usd">USD/PayPal</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            wrapperCol={{
                                                span: 24
                                            }}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Button type="primary" htmlType="submit" style={{
                                                backgroundColor: '#c1172c',
                                                textAlign: 'center'
                                            }}>
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            wrapperCol={{
                                                span: 24
                                            }}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Button type="primary" style={{
                                                backgroundColor: '#666',
                                                textAlign: 'center'
                                            }}
                                            onClick={() => {
                                                setEnterPersonalDetails(false)
                                                setPaymentOption('')
                                                setQrDisp(false)
                                            }}>
                                                Go Back
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </div>
                }
                {
                    paymentOption === 'lightning' && qrDisp && 
                    <Card>
                        <Row>
                            <Col span={20}>
                                <Paragraph ellipsis={ellipsis}>
                                    {lightningInvoice}
                                </Paragraph>
                                <p>
                                    <span style={{cursor: 'pointer'}} onClick={() => {
                                        if (ellText === 'Reduce') {
                                            setEllText('Expand')
                                        }
                                        if (ellText === 'Expand') {
                                            setEllText('Reduce')
                                        }
                                        setEllipsis(!ellipsis);
                                    }}><b>{ellText}</b></span>
                                </p>
                            </Col>
                            <Col span={4}><CopyOutlined style={{cursor: "pointer"}} onClick={() => {

                                try {
                                    navigator.clipboard.writeText(lightningInvoice)
                                    
                                    notification.open({
                                        //message: 'Notification Title',
                                        description:
                                        'Copied successfully',
                                        onClick: () => {
                                        console.log('Copied successfullly');
                                        },
                                    });
                                } catch (error) {
                                    notification.open({
                                        //message: 'Notification Title',
                                        description:
                                        'Error',
                                        onClick: () => {
                                        console.log('Notification Clicked!');
                                        },
                                    });
                                }

                                    
                            }} /></Col>
                            <Col span={24} id="qr-encloser">
                                <div style={{width: '50%'}}>
                                    <a href={`lightning:${lightningInvoice}`}>
                                        <img src={`data:image/png;base64,${lightningQr}`} style={{width: '100%'}} />
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                }
            </Modal>
            <Modal 
                open={isDonationPlanModalOpen} 
                onOk={handleDonationPlanOk} 
                onCancel={handleDonationPlanCancel}
                okButtonProps={{ style:{...{ backgroundColor: '#c1172c', color: '#fff' }} }}
                cancelButtonProps={{ style:{...{ backgroundColor: '#666', color: '#fff' }} }}
            >
                <Radio.Group defaultValue={paymentOption} buttonStyle="solid" onChange={onChoosePlanRadioChange} value={recDonationPlan} style={{width: '100%'}}>
                    <Space direction="vertical" style={{width: '100%'}}>
                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value={'weekly'}>Weekly($4 per week)</Radio.Button>
                        <Divider />
                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value={'monthly'}>Monthly($50 per month)</Radio.Button>
                        <Divider />
                        <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value={'knighthood'}>Knighthood($1000 for a 20 month long support)</Radio.Button>
                        <Divider />
                    </Space>
                </Radio.Group>
                <Button style={{backgroundColor: '#c1172c', borderRadius: '3rem', color: '#fff'}} onClick={onChoosePlanBtnChange}>Submit</Button>
            </Modal>
            <Modal 
                open={donationChosen} 
                onOk={handleDonationChosenOk} 
                onCancel={handleDonationChosenCancel}
                okButtonProps={{ style:{...{ backgroundColor: '#c1172c', color: '#fff' }} }}
                cancelButtonProps={{ style:{...{ backgroundColor: '#666', color: '#fff' }} }}
            >
                <h4 style={{textAlign: 'center'}}>Donation Plan: {recDonationPlan}</h4>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Card style={{
                        width: '100%',
                        border: 'none'
                    }}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 24,
                            }}
                            wrapperCol={{
                                span: 24,
                            }}
                            style={{
                                maxWidth: '100%',
                                minWidth: '100%',
                                width: '100%',
                                color: "#666"
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onEnterRecDetailsFinish}
                            onFinishFailed={onEnterRecDetailsFinishFailed}
                            autoComplete="off"
                        >
                            {recDonationPlan === 'weekly' &&
                            <Form.Item
                                label="Enter Number of Weeks"
                                name="noOfWeeks"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Number of weeks is required',
                                    }
                                ]}
                                style={{
                                    color: "#666"
                                }}
                            >
                                <Input type="number" value={noOfWeeks} onChange={(e) => {
                                    setNoOfWeeks(e.target.value)
                                }} />
                            </Form.Item>}
                            {recDonationPlan === 'monthly' &&
                            <Form.Item
                                label="Enter Number of Months"
                                name="noOfMonths"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Number of months is required',
                                    }
                                ]}
                                style={{
                                    color: "#666"
                                }}
                            >
                                <Input type="number" value={noOfMonths} onChange={(e) => {
                                    setNoOfMonths(e.target.value)
                                }} />
                            </Form.Item>}
                            {recDonationPlan === 'knighthood' &&
                            <Form.Item
                                label="Enter Number of Months"
                                name="noOfMonths"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Number of months is required',
                                    }
                                ]}
                                style={{
                                    color: "#666"
                                }}
                            >
                                <Input type="number" value={noOfMonths} onChange={(e) => {
                                    setNoOfMonths(e.target.value)
                                }} />
                            </Form.Item>}
                            <Form.Item
                                label="Enter Full Name, Alias or Nickname"
                                name="donorFullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Name is required',
                                    }
                                ]}
                                style={{
                                    color: "#666"
                                }}
                            >
                                <Input onChange={(e) => {setDonorFullName(e.target.value)}} />
                            </Form.Item>
                            <Form.Item
                                label="Enter Hive Username(optional)"
                                name="donorHiveUsername"
                                rules={[
                                    {
                                        required: false,
                                    }
                                ]}
                                style={{
                                    color: "#666"
                                }}
                            >
                                <Input onChange={(e) => {setDonorHiveUsername(e.target.value)}} />
                            </Form.Item>
                            <Form.Item
                                label="Enter Email"
                                name="donorEmail"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email is required'
                                    }
                                ]}
                                style={{
                                    color: "#666"
                                }}
                            >
                                <Input onChange={(e) => {setDonorEmail(e.target.value)}} />
                            </Form.Item>
                            <Form.Item
                                label="Choose Payment Option"
                                name="paymentOption"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Payment option is required'
                                    }
                                ]}
                                style={{
                                    color: "#666"
                                }}
                            >
                                <Radio.Group defaultValue={paymentOption} buttonStyle="solid" onChange={(e) => {setPaymentOption(e.target.value)}}>
                                    <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="hive">HIVE(Keychain)</Radio.Button>
                                    <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="hbd">Hive Back Dollars/HBD(Keychain)</Radio.Button>
                                    <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="btc">Bitcoin(BTC)</Radio.Button>
                                    <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="lightning">Lightning(BTC)</Radio.Button>
                                    <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="xlm">Stellar(XLM)</Radio.Button>
                                    <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="hivepay">HivePay</Radio.Button>
                                    <Radio.Button style={{overflowWrap: 'break-word', height: 'fit-content'}} value="usd">USD/PayPal</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{
                                            span: 24
                                        }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit" style={{
                                            backgroundColor: '#c1172c',
                                            textAlign: 'center'
                                        }}>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{
                                            span: 24
                                        }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Button type="primary" style={{
                                            backgroundColor: '#666',
                                            textAlign: 'center'
                                        }}
                                        onClick={() => {
                                            handleDonationChosenCancel()
                                            setQrDisp(false)
                                        }}>
                                            Go Back
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>

            </Modal>
            <Modal open={hivePayModal}>
                <h3>HivePay</h3>
                <form action="https://hivepay.io/pay/" method="post">
                    <input type="hidden" name="merchant" value="cttpodcast" />
                    <input type="hidden" name="item_name" value="CTT Podcast Donations Testing" />
                    <input type="hidden" name="description" value={`Donation from ${donorFullName} to cttpodcast`} />
                    <input type="hidden" name="notify_url" value="https://cttdonations.surge.sh?status=successful" />
                    <input type="hidden" name="return_url" value="https://cttdonations.surge.sh?status=successful" />
                    <input type="hidden" name="amount" value={donationAmount} />
                    <input type="hidden" name="base_currency" value="USD" />
                    <input type="hidden" name="merchant_email" value="olatunde.oladunni.dev@gmail.com" />
                    <input type="hidden" name="merchant_image" value="https://images.hive.blog/u/cttpodcast/avatar" />
                    <input type="hidden" name="pay_currency" value="CTP,HIVE,LEO,TOP10T" />
                    <input type="hidden" name="merchant_name" value="Community Token Talk Podcast Test" />
                    <input type="hidden" name="cancel_url" value="https://cttdonations.surge.sh?status=failed" />
                    <input type="image" src="https://hivepay.io/buttons/1.png" alt="Buy With HivePay" target="_blank" />
                </form>
            </Modal>
        </>
    )
}