/** @format */
import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

import { ConnectButton } from "./ConnectButton.jsx";
import { Hooks } from "../Wagmi/Hooks.jsx";

export const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState("");

  const handleChange = (e) => {
    const regex = /^(?:100(?:\.0+)?|\d{0,2}(?:\.\d+)?|0(?:\.\d+)?)$/;

    if (
      (e.target.value !== "" && regex.test(e.target.value)) ||
      e.target.value >= 0
    ) {
      setAmount(e.target.value);
    } else if (e.target.value === "") {
      setAmount(0);
    } else if (e.target.value === e) {
      setAmount(0);
    }
  };

  const submitHandler = async () => {
    if (walletAddress == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Wallet Address Not Found",
      });
      return false;
    }

    if (amount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Amount must be greater than 0",
      });
      return false;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Transfer it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        document.getElementById("loaderVisibility").classList.add("is-active");

        try {
          // show loader
          const contract = Hooks();
          const response = await contract.sendTransactions(
            walletAddress,
            amount
          );

          if (response.status) {
            Swal.fire({
              icon: "success",
              title: "Transferred Amount",
              text: response.message,
            });

            setHash(response.hash);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.message,
            });
          }
        } catch (e) {
          console.log("Amount not Transferd --->>", e);
          document
            .getElementById("loaderVisibility")
            .classList.remove("is-active");

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
        }

        document
          .getElementById("loaderVisibility")
          .classList.remove("is-active");
      }
    });
  };

  return (
    <div>
      <Row style={{ backgroundColor: "rgb(14, 52, 100)", minHeight: "4rem" }}>
        <Col>
          <h4 className="p-3" style={{ color: "#ffffff" }}>
            Transfer Tokens from Wallet to Another
          </h4>
        </Col>

        <Col>
          <div className="connectWallet text-end">
            <ConnectButton />
          </div>
        </Col>
      </Row>

      <Row className="pt-5">
        <Col className="d-flex justify-content-center">
          <Form className="form col-md-6">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Wallet Address"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="tel"
                value={amount}
                onChange={handleChange}
                placeholder="Enter Amount"
              />
            </Form.Group>

            <Button
              onClick={submitHandler}
              className="btn btn-sucess form-control"
              style={{
                maxWidth: "fit-content",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor: "rgb(14, 52, 100)",
                color: "#ffffff",
              }}>
              Transfer Amount
            </Button>
          </Form>
        </Col>
      </Row>

      {hash != "" && (
        <div className="mt-5 text-center">
          <hr />
          <a
            href={"https://sepolia.etherscan.io/tx/" + hash}
            target="_blank"
            className="mt-5  text-decoration-none">
            View Transaction
          </a>
        </div>
      )}
    </div>
  );
};
