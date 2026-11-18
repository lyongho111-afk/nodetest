// JWT의 서명 검증과 토큰 해석에 사용할 라이브러리를 불러옵니다.
const jwt = require("jsonwebtoken");
// 환경 변수 파일의 경로를 구성하기 위해 Node.js 내장 경로 모듈을 불러옵니다.
const path = require("node:path");
// 프로젝트 루트의 .env 파일에서 환경 변수를 읽어옵니다.
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
// JWT 검증에 사용할 비밀 키를 환경 변수에서 가져옵니다.
const jwtSecret = process.env.JWT_SECRET;
// 비밀 키가 없으면 안전하지 않은 상태로 실행되지 않도록 오류를 발생시킵니다.
if (!jwtSecret) {
  // 설정에 필요한 환경 변수 이름과 위치를 안내합니다.
  throw new Error("JWT_SECRET을 sqlite/.env 또는 환경변수로 설정해 주세요.");
}

// 로그인 토큰을 검사해 보호된 라우트의 접근을 제어하는 미들웨어입니다.
const checkLogin = async (req, res, next) => {
  // 브라우저가 보호된 응답을 캐시에 보관하지 않도록 응답 헤더를 설정합니다.
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  // 요청 쿠키에서 로그인 토큰을 읽어옵니다.
  const token = req.cookies.token;

  // 토큰이 없으면 로그인 화면으로 이동시킵니다.
  if (!token) {
    return res.redirect("/");
  }

  // 토큰 검증 중 오류가 생기면 인증 실패로 처리할 수 있도록 시도 블록을 시작합니다.
  try {
    // 서명과 만료 시간을 검증하고 토큰의 페이로드를 해석합니다.
    const decoded = jwt.verify(token, jwtSecret);
    // 인증된 사용자의 아이디를 요청 객체에 저장합니다.
    req.username = decoded.username;
    // 인증이 성공했으므로 다음 미들웨어나 라우트 핸들러를 실행합니다.
    next();
  // 토큰이 잘못되었거나 만료된 경우 실행합니다.
  } catch (error) {
    // 인증 실패 응답을 반환하고 요청 처리를 끝냅니다.
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
};

// 다른 라우트에서 로그인 검사 미들웨어를 사용할 수 있도록 내보냅니다.
module.exports = checkLogin;
