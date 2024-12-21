import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveForm("login");
  };

  return (
    <div className="container">
      <h1>Welcome to Resume Formatter</h1>
      {!isLoggedIn ? (
        <>
          {/* Form Switcher */}
          <div className="form-switcher">
            <button
              className={activeForm === "login" ? "active" : ""}
              onClick={() => setActiveForm("login")}
            >
              Login
            </button>
            <button
              className={activeForm === "signup" ? "active" : ""}
              onClick={() => setActiveForm("signup")}
            >
              Sign Up
            </button>
            <button
              className={activeForm === "forgot" ? "active" : ""}
              onClick={() => setActiveForm("forgot")}
            >
              Forgot Password
            </button>
          </div>

          {/* Render Form Based on Active State */}
          <div className="form-container">
            {activeForm === "login" && <LoginForm setIsLoggedIn={setIsLoggedIn} />}
            {activeForm === "signup" && <SignupForm />}
            {activeForm === "forgot" && <ForgotPasswordForm />}
          </div>
        </>
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

// Login Form Component
function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add logic to validate login credentials (e.g., API call)
    setIsLoggedIn(true); // Set logged-in state to true
    alert(`Welcome, ${email}`);
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

// Sign-Up Form Component
function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // Add logic to handle signup (e.g., API call)
    alert(`Account created for: ${name}, ${email}`);
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <div className="input-group">
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

// Forgot Password Form Component
function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const randomOtp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    setGeneratedOtp(randomOtp);
    setIsOtpSent(true);
    alert(`OTP sent to ${email}: ${randomOtp}`); // For testing purposes, show OTP
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (parseInt(otp) === generatedOtp) {
      setIsVerified(true);
      alert("OTP verified! You can now reset your password.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    alert("Password reset successfully!");
    setEmail("");
    setOtp("");
    setGeneratedOtp(null);
    setIsOtpSent(false);
    setIsVerified(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form>
      <h2>Forgot Password</h2>
      {!isOtpSent && !isVerified && (
        <>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleForgotPassword}>
            Send OTP
          </button>
        </>
      )}

      {isOtpSent && !isVerified && (
        <>
          <div className="input-group">
            <label>Enter OTP</label>
            <input
              type="number"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </>
      )}

      {isVerified && (
        <>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleResetPassword}>
            Reset Password
          </button>
        </>
      )}
    </form>
  );
}


// Dashboard Component


function Dashboard({ onLogout }) {
  const [isCreatingResume, setIsCreatingResume] = useState(false);

  const recentResumes = [
    { id: 1, title: "Software Engineer Resume", date: "2024-12-01" },
    { id: 2, title: "Data Analyst Resume", date: "2024-11-20" },
    { id: 3, title: "Project Manager Resume", date: "2024-11-10" },
  ];

  const progress = 75;

  const handleCreateNewResume = () => {
    setIsCreatingResume(true); // Show the resume creation form
  };

  const handleBackToDashboard = () => {
    setIsCreatingResume(false); // Go back to the dashboard
  };

  return (
    <div className="dashboard">
      {!isCreatingResume ? (
        <>
          <h2>Dashboard</h2>
          <p>Welcome to your personalized resume builder!</p>

          {/* Resume Progress */}
          <div className="progress-container">
            <h3>Resume Completion</h3>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>{progress}% Complete</p>
          </div>

          {/* Recent Resumes */}
          <div className="recent-resumes">
            <h3>Recent Resumes</h3>
            <ul>
              {recentResumes.map((resume) => (
                <li key={resume.id}>
                  <span>{resume.title}</span>
                  <span>{resume.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="actions">
            <button onClick={handleCreateNewResume}>Create New Resume</button>
            <button>View Resumes</button>
            <button>Edit Resumes</button>
            <button>Download Resumes</button>
          </div>

          <button className="logout" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        <div className="create-resume-form">
          <h2>Create New Resume</h2>
          <form>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input type="tel" placeholder="Enter your phone number" required />
            </div>
            <div className="input-group">
              <label>Summary</label>
              <textarea placeholder="Brief summary about yourself" rows="4"></textarea>
            </div>
            <div className="input-group">
              <label>Skills</label>
              <input type="text" placeholder="Enter your skills (comma-separated)" />
            </div>
            <div className="input-group">
              <label>Experience</label>
              <textarea placeholder="Describe your work experience" rows="4"></textarea>
            </div>
            <button type="submit">Save Resume</button>
            <button type="button" onClick={handleBackToDashboard}>
              Back to Dashboard
            </button>
          </form>
        </div>
      )}
    </div>
  );
}




export default App;
