// 비동기 라우트에서 발생한 오류를 Express 오류 처리기로 전달하는 도구를 불러옵니다.
const asyncHandler = require("express-async-handler");
// 연락처 데이터 조회와 변경을 담당하는 모델을 불러옵니다.  DB관련 작업
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /contacts
// 모든 연락처를 가져와 목록 화면에 전달하는 컨트롤러입니다.
const getAllContacts = asyncHandler(async (req, res) => {
  // 데이터베이스에서 전체 연락처 목록을 조회합니다.
  const contacts = await Contact.find();
  // 조회한 목록을 index 템플릿에 전달해 렌더링합니다.
  res.render("index", { contacts: contacts });
});

// @desc View add contact form
// @route GET /contacts/add
// 연락처 추가 양식을 보여주는 컨트롤러입니다.
const addContactForm = asyncHandler((req, res) => {
  // add 템플릿을 렌더링합니다.
  res.render("add");
});

// @desc Create a contact
// @route POST/contacts/add
// 요청 본문을 이용해 새 연락처를 만드는 컨트롤러입니다.
const createContact = asyncHandler(async (req, res) => {
  // 요청 본문에서 연락처의 이름, 이메일, 전화번호를 꺼냅니다.
  const { name, email, phone } = req.body;
  // 데이터베이스에 새 연락처를 저장합니다.
  const contact = Contact.create({//json의 축약형
    // 이름을 연락처 모델에 전달합니다.
    name,
    // 이메일을 연락처 모델에 전달합니다.
    email,
    // 전화번호를 연락처 모델에 전달합니다.
    phone,
  });
  // 연락처 목록 화면으로 이동합니다.
  res.redirect("/contacts");
});
// {
//   name: "홍길동",
//   email: "hong@test.com",
//   phone: "010-1234-5678"
// }
// @desc Get contact
// @route GET /contacts/:id
// URL의 ID에 해당하는 연락처를 조회해 수정 화면을 보여줍니다.
const getContact = asyncHandler(async (req, res) => {
  // URL 경로 매개변수에서 연락처 ID를 읽어 해당 연락처를 조회합니다.
  const contact = await Contact.findById(req.params.id);
  // 연락처가 없으면 404 응답을 반환하고 처리를 끝냅니다.
  if (!contact) {
    return res.status(404).send("해당 연락처를 찾을 수 없습니다.");
  }

  // 찾은 연락처를 update 템플릿에 전달해 렌더링합니다.
  res.render("update", { contact: contact });
});

// @desc Update contact
// @route PUT /contacts/:id
// URL의 ID에 해당하는 연락처 정보를 수정하는 컨트롤러입니다.
const updateContact = asyncHandler(async (req, res) => {
  // URL 경로 매개변수에서 수정할 연락처 ID를 가져옵니다.
  const id = req.params.id;
  // 요청 본문에서 수정할 연락처 정보를 꺼냅니다.
  const { name, email, phone } = req.body;
  // 데이터베이스의 연락처 정보를 수정하고 수정된 데이터를 돌려받습니다.
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    // 이름, 이메일, 전화번호를 수정 값으로 전달합니다.
    { name, email, phone },
    // 수정 후의 연락처를 반환하도록 옵션을 지정합니다.
    { new: true }
  );
  // 수정할 연락처가 없으면 404 응답을 반환하고 처리를 끝냅니다.
  if (!updatedContact) {
    return res.status(404).send("해당 연락처를 찾을 수 없습니다.");
  }

  // 수정이 끝나면 연락처 목록 화면으로 이동합니다.
  res.redirect("/contacts");
});

// @desc Delete contact
// @route DELETE /contacts/:id
// URL의 ID에 해당하는 연락처를 삭제하는 컨트롤러입니다.
const deleteContact = asyncHandler(async (req, res) => {
  // URL 경로 매개변수에서 삭제할 연락처 ID를 꺼냅니다.
  const { id } = req.params;

  // ID 유효성 검사
  // ID가 전달되지 않았다면 잘못된 요청 응답을 반환합니다.
  if (!id) {
    return res.status(400).json({ message: "유효하지 않은 ID입니다." });
  }

  // 문서 삭제 시도
  // 모델을 통해 ID에 해당하는 연락처를 삭제합니다.
  const result = await Contact.findByIdAndDelete(id);

  // 문서가 존재하지 않을 때의 처리
  // 삭제 대상이 없으면 404 응답을 반환합니다.
  if (!result) {
    return res.status(404).json({ message: "해당 연락처를 찾을 수 없습니다." });
  }

  // 삭제가 끝나면 연락처 목록 화면으로 이동합니다.
  res.redirect("/contacts");
});

// 라우터에서 사용할 컨트롤러 함수들을 객체로 내보냅니다.
module.exports = {
  // 전체 연락처 목록 조회 컨트롤러를 내보냅니다.
  getAllContacts,
  // 연락처 생성 컨트롤러를 내보냅니다.
  createContact,
  // 연락처 단건 조회 컨트롤러를 내보냅니다.
  getContact,
  // 연락처 수정 컨트롤러를 내보냅니다.
  updateContact,
  // 연락처 삭제 컨트롤러를 내보냅니다.
  deleteContact,
  // 연락처 추가 양식 표시 컨트롤러를 내보냅니다.
  addContactForm,
};
