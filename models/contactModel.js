// 데이터베이스 연결 함수를 불러옵니다.
const getDatabase = require("../config/dbConnect");
// 데이터베이스 연결 객체를 가져옵니다.
const database = getDatabase();

// 연락처 조회 시 실제 id를 모델에서 사용하는 _id 이름으로 반환할 SQL 조각입니다.
const contactColumns = "id AS _id, name, email, phone, office, createdAt, updatedAt";

// 전달된 ID를 양의 안전한 정수로 변환하고, 유효하지 않으면 null을 반환합니다.
const toId = (id) => {
  // 입력값을 숫자로 변환합니다.
  const parsedId = Number(id);
  // 양의 안전한 정수인 경우에만 ID를 반환합니다.
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
};

// 연락처 저장에 필요한 필수 항목을 검사합니다.
const validateContact = ({ name, phone }) => {
  // 이름 또는 전화번호가 없으면 오류를 발생시킵니다.
  if (!name || !phone) {
    throw new Error("이름과 전화번호는 꼭 입력해 주세요.");
  }
};

// SQLite 쿼리를 이용한 연락처 데이터 접근 메서드들을 정의합니다.
const Contact = {
  // ID 순서대로 모든 연락처를 조회합니다.
  find() {
    // 연락처 테이블의 모든 행을 읽어 배열로 반환합니다.
    return database.prepare(`SELECT ${contactColumns} FROM contacts ORDER BY id`).all();
  },

  // ID로 연락처 하나를 조회합니다.
  findById(id) {
    // ID 형식이 유효한지 검사하고 숫자로 변환합니다.
    const parsedId = toId(id);
    // 유효하지 않은 ID라면 조회 없이 null을 반환합니다.
    if (!parsedId) return null;

    // ID가 일치하는 연락처 한 건을 조회하고, 결과가 없으면 null을 반환합니다.
    return database
      // 매개변수 바인딩을 사용해 ID를 조건으로 하는 SQL 문을 준비합니다.
      .prepare(`SELECT ${contactColumns} FROM contacts WHERE id = ?`)
      // 변환된 ID를 전달해 조회를 실행합니다.
      .get(parsedId) || null;
  },

  // 필수 항목을 확인한 뒤 새 연락처를 저장합니다.
  create({ name, email = null, phone, office = null }) {
    // 이름과 전화번호가 입력되었는지 검사합니다.
    validateContact({ name, phone });
    // 연락처 행을 추가하고 생성된 행의 ID를 결과로 받습니다.
    const result = database
      // 연락처 데이터를 저장할 SQL 문을 준비합니다.
      .prepare("INSERT INTO contacts (name, email, phone, office) VALUES (?, ?, ?, ?)")
      // 각 입력 값을 SQL 매개변수로 안전하게 전달합니다.
      .run(name, email, phone, office);
    // 방금 생성된 연락처를 ID로 다시 조회해 반환합니다.
    return this.findById(result.lastInsertRowid);
  },

  // ID에 해당하는 연락처 정보를 수정합니다.
  findByIdAndUpdate(id, { name, email = null, phone, office = null }) {
    // ID 형식이 유효한지 검사하고 숫자로 변환합니다.
    const parsedId = toId(id);
    // 유효하지 않은 ID라면 수정 없이 null을 반환합니다.
    if (!parsedId) return null;
    // 수정할 필수 항목인 이름과 전화번호를 검사합니다.
    validateContact({ name, phone });

    // 연락처 정보를 갱신하고 수정 시각도 현재 시각으로 변경합니다.
    const result = database
      // ID와 바인딩 매개변수를 이용한 UPDATE 문을 준비합니다.
      .prepare(
        "UPDATE contacts SET name = ?, email = ?, phone = ?, office = ?, updatedAt = datetime('now') WHERE id = ?"
      )
      // 새 필드 값과 대상 ID를 전달해 UPDATE를 실행합니다.
      .run(name, email, phone, office, parsedId);

    // 실제 행이 수정되었으면 최신 데이터를, 아니면 null을 반환합니다.
    return result.changes ? this.findById(parsedId) : null;
  },

  // ID에 해당하는 연락처를 조회한 뒤 삭제합니다.
  findByIdAndDelete(id) {
    // 먼저 삭제 대상 연락처를 조회합니다.
    const contact = this.findById(id);
    // 대상이 없으면 null을 반환합니다.
    if (!contact) return null;
    // 확인한 연락처의 ID를 조건으로 행을 삭제합니다.
    database.prepare("DELETE FROM contacts WHERE id = ?").run(contact._id);
    // 삭제된 연락처 정보를 반환합니다.
    return contact;
  },

  // ID 조건으로 연락처를 삭제하고 삭제된 행의 개수를 반환합니다.
  deleteOne(filter = {}) {
    // 필터 객체의 _id 또는 id를 숫자로 변환해 검사합니다.
    const parsedId = toId(filter._id || filter.id);
    // 유효한 ID가 없으면 삭제된 행이 0개임을 반환합니다.
    if (!parsedId) return { deletedCount: 0 };
    // ID가 일치하는 연락처 행을 삭제합니다.
    const result = database.prepare("DELETE FROM contacts WHERE id = ?").run(parsedId);
    // SQLite 실행 결과에서 실제 삭제 건수를 반환합니다.
    return { deletedCount: result.changes };
  },
};

// 다른 모듈에서 연락처 데이터 접근 메서드를 사용할 수 있도록 내보냅니다.
module.exports = Contact;
