import { useState, useRef } from "react";
import axios from "axios";
import { server } from "../../main.jsx";
import { toast } from "react-toastify";

const OtpForm = ({ onBack }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [btnLoading, setBtnLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    if (!pasted.every(d => /^\d$/.test(d))) return;

    const newOtp = [...otp];
    pasted.forEach((d, i) => (newOtp[i] = d));
    setOtp(newOtp);
    inputsRef.current[pasted.length - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const email = localStorage.getItem("email");
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      toast.error("Please enter complete OTP");
      setBtnLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/api/v1/verify`,
        { email, otp: otpValue },
        { withCredentials: true }
      );

      toast.success(data.message);
      localStorage.removeItem("email");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-white/80 hover:text-white flex items-center gap-2 text-sm"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold text-center text-white">
        Enter OTP
      </h2>

      <form onSubmit={handleVerify} className="space-y-6">
        <div
          className="flex justify-center gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
                w-12 h-14 text-center text-xl
                rounded-xl bg-white/10
                border border-white/20
                outline-none text-white
                focus:border-white/40
                transition
              "
            />
          ))}
        </div>

        <button
          disabled={btnLoading}
          className="
            w-full py-3 rounded-xl
            bg-white/20 hover:bg-white/30
            transition text-white
            disabled:opacity-50
          "
        >
          {btnLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
