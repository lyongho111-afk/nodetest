// const express = require("express");
// const router = express.Router();
// const Contact = require("../models/contactModel");
// const {
//   getAllContacts,
//   createContact,
//   getContact,
//   updateContact,
//   deleteContact,
// } = require("../controllers/contactController");

// router.route("/").get(getAllContacts).post(createContact);

// router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

// module.exports = router;


// Express 라우터를 만들기 위해 Express를 불러옵니다.
const express = require("express");
// 연락처 경로를 묶어서 처리할 라우터 인스턴스를 생성합니다.
const router = express.Router();
// 요청 쿠키를 읽을 수 있도록 cookie-parser 미들웨어를 불러옵니다.
const cookieParser = require("cookie-parser");
// 연락처 페이지에 접근하는 사용자의 로그인 여부를 확인하는 미들웨어를 불러옵니다.
const checkLogin = require("../middlewares/checkLogin");
// 연락처 요청을 처리하는 컨트롤러 함수들을 불러옵니다.
const {
  // 연락처 목록 조회 함수입니다.
  getAllContacts,
  // 연락처 생성 함수입니다.
  createContact,
  // 연락처 단건 조회 함수입니다.
  getContact,
  // 연락처 수정 함수입니다.
  updateContact,
  // 연락처 삭제 함수입니다.
  deleteContact,
  // 연락처 추가 양식 표시 함수입니다.
  addContactForm,
} = require("../controllers/contactController");

// 이 라우터로 들어오는 요청의 쿠키를 분석하는 미들웨어를 등록합니다.
router.use(cookieParser());

// GET /contacts 요청은 로그인 확인 후 전체 연락처 목록을 조회합니다.
router.route("/").get(checkLogin, getAllContacts);

// /add 경로의 연락처 추가 화면과 생성 요청을 정의합니다.
router
  // 연락처 추가 경로에 대한 라우트를 시작합니다.
  .route("/add")
  // GET 요청은 로그인 확인 후 추가 양식을 보여줍니다.
  .get(checkLogin, addContactForm)
  // POST 요청은 로그인 확인 후 새 연락처를 저장합니다.
  .post(checkLogin, createContact);

// ID가 포함된 연락처 경로의 조회, 수정, 삭제 요청을 정의합니다.
router
  // 경로 매개변수 :id를 포함하는 라우트를 시작합니다.
  .route("/:id")
  // GET 요청은 로그인 확인 후 해당 연락처를 조회합니다.
  .get(checkLogin, getContact)
  // PUT 요청은 로그인 확인 후 해당 연락처를 수정합니다.
  .put(checkLogin, updateContact)
  // DELETE 요청은 로그인 확인 후 해당 연락처를 삭제합니다.
  .delete(checkLogin, deleteContact);

// 애플리케이션에서 등록할 수 있도록 라우터를 내보냅니다.
module.exports = router;
