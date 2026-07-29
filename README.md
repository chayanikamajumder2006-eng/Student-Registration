output link given in the link :
https://chayanikamajumder2006-eng.github.io/Student-Registration/


# Student Login & Multi-Step Registration Portal

A dynamic, multi-step web application built with HTML5, CSS3, and JavaScript. This portal provides a registration and login system for students, including form data persistence, mock OTP verification, canvas-generated CAPTCHA security, and input validation.

---

## 🚀 Features

* **Multi-Step Form Navigation**: Splits registration into logical steps (Personal Details, Academic Records, Account Verification) without losing entered progress.
* **Session Persistence**: Form fields automatically persist in `sessionStorage` when navigating between steps or refreshing.
* **Canvas CAPTCHA Engine**: Client-side canvas CAPTCHA with noise lines and randomized character rotations to block automated submissions.
* **Mock OTP Verification**: Simulated 2-Factor Authentication (Email & Phone SMS) using interactive modals and auto-generated OTPs.
* **LocalStorage User Database**: Persists registered student records in the browser's `localStorage` for instant testing against the login portal.
* **Modern & Responsive UI**: Glassmorphism design system featuring CSS CSS variables, grid/flexbox layouts, hover animations, and subtle gradients.

---

## 📁 File Structure

```text
├── index.html         # Student Login Portal (Entry point)
├── register_1.html    # Step 1: Personal, Physical, Family & Address Details
├── register_2.html    # Step 2: Class 10/12 Marks, Extracurriculars & Hobbies
├── register_3.html    # Step 3: Program Selection, OTP Verification & Credentials
├── style.css          # Unified custom stylesheet and design variables
└── app.js             # Logic for navigation, storage, CAPTCHA, OTP, and validation
