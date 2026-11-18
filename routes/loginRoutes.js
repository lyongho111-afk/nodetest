// Express 라우터를 만들기 위해 Express를 불러옵니다.
const express = require("express");
// 로그인과 회원가입 경로를 처리할 라우터 인스턴스를 생성합니다.
const router = express.Router();
// 로그인 및 회원가입 요청을 처리하는 컨트롤러 함수들을 불러옵니다.
const {
  // 회원가입 화면 표시 함수입니다.
  getRegister,
  // 사용자 등록 함수입니다.
  registerUser,
  // 로그인 화면 표시 함수입니다.
  getLogin,
  // 로그인 인증 함수입니다.
  loginUser,
  // 로그아웃 함수입니다.
  logout,
} = require("../controllers/loginController");

// 루트 경로의 GET 요청은 로그인 화면을, POST 요청은 로그인을 처리합니다.
router.route("/").get(getLogin).post(loginUser);
// /register 경로의 GET 요청은 가입 화면을, POST 요청은 회원가입을 처리합니다.
router.route("/register").get(getRegister).post(registerUser);
// /logout 경로의 GET 요청은 로그아웃을 처리합니다.
router.route("/logout").get(logout);
// 애플리케이션에서 등록할 수 있도록 라우터를 내보냅니다.
module.exports = router;
