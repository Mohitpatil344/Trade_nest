import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);
  const [otp, setOtp] = useState(new Array(6).fill("")); // To hold OTP digits

  const handleOtpChange = (element, index) => {
    let otpArray = [...otp];
    otpArray[index] = element.value;
    setOtp(otpArray);
  };

  const handleSubmitOtp = () => {
    const otpString = otp.join(""); // Concatenate OTP digits
    console.log("Entered OTP:", otpString);
    // You can now use otpString for verification
  };

  return (
    <>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
              ></Form.Control>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
              ></Form.Control>

              <h5>Enter OTP</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  {otp.map((data, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      style={{
                        width: "50px",
                        textAlign: "center",
                        marginRight: "5px", // Adjust margin to bring OTP boxes closer
                      }}
                    />
                  ))}
                </div>
                <Button 
  variant="primary" 
  onClick={handleSubmitOtp} 
  style={{ 
    marginLeft: "10px", 
    marginTop: "10px", 
    // alignSelf: "center" // Aligns the button to the center of the container
  }}
>
  Submit OTP
</Button>


              </div>

              <Form.Control
                type="password"
                placeholder="Enter your Password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              ></Form.Control>

              <Button variant="primary" type="submit">
                {isRegisterLoading ? "Creating your account " : "Register"}
              </Button>

              {registerError?.error && (
                <Alert variant="danger">
                  <p>{registerError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
