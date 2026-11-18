// Express의 오류 처리 미들웨어로, 오류 상태 코드에 맞는 JSON 응답을 보냅니다.
const errorhandler = (err, req, res, next) => {
  // 오류에 상태 코드가 없으면 내부 서버 오류(500)를 기본값으로 사용합니다.
  const status = err.status || 500;
  // 상태 코드에 따라 응답 제목과 메시지를 선택합니다.
  switch (status) {
    // 잘못된 요청 오류(400)에 대한 응답을 처리합니다.
    case 400:
      // 상태 코드와 오류 설명을 JSON 응답으로 보냅니다.
      res.status(status).json({
        // 오류 종류를 제목으로 표시합니다.
        title: "Bad Request",
        // 발생한 오류의 메시지를 포함합니다.
        message: err.message,
      });
      // 다음 case로 이어지지 않도록 switch를 종료합니다.
      break;
    // 인증되지 않은 요청 오류(401)에 대한 응답을 처리합니다.
    case 401:
      // 상태 코드와 오류 설명을 JSON 응답으로 보냅니다.
      res.status(status).json({
        // 오류 종류를 제목으로 표시합니다.
        title: "Unauthorized",
        // 발생한 오류의 메시지를 포함합니다.
        message: err.message,
      });
      // 다음 case로 이어지지 않도록 switch를 종료합니다.
      break;
    // 권한이 없는 요청 오류(403)에 대한 응답을 처리합니다.
    case 403:
      // 상태 코드와 오류 설명을 JSON 응답으로 보냅니다.
      res.status(status).json({
        // 오류 종류를 제목으로 표시합니다.
        title: "Forbidden",
        // 발생한 오류의 메시지를 포함합니다.
        message: err.message,
      });
      // 다음 case로 이어지지 않도록 switch를 종료합니다.
      break;
    // 요청한 대상을 찾을 수 없는 오류(404)에 대한 응답을 처리합니다.
    case 404:
      // 상태 코드와 오류 설명을 JSON 응답으로 보냅니다.
      res.status(status).json({
        // 오류 종류를 제목으로 표시합니다.
        title: "Not Found",
        // 발생한 오류의 메시지를 포함합니다.
        message: err.message,
      });
      // 다음 case로 이어지지 않도록 switch를 종료합니다.
      break;
    // 내부 서버 오류(500)에 대한 응답을 처리합니다.
    case 500:
      // 상태 코드와 오류 설명을 JSON 응답으로 보냅니다.
      res.status(status).json({
        // 오류 종류를 제목으로 표시합니다.
        title: "Internal Server Error",
        // 발생한 오류의 메시지를 포함합니다.
        message: err.message,
      });
      // 다음 case로 이어지지 않도록 switch를 종료합니다.
      break;
    // 위에서 별도로 처리하지 않은 상태 코드의 응답을 처리합니다.
    default:
      // 전달된 상태 코드와 기본 메시지를 JSON 응답으로 보냅니다.
      res.status(status).json({
        // 기본 처리 메시지를 포함합니다.
        message: "No Error!",
      });
      // switch 문을 종료합니다.
      break;
  }
};

// Express 애플리케이션에서 사용할 오류 처리 미들웨어를 내보냅니다.
module.exports = errorhandler;
