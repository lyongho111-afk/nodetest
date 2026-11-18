// Node.js 내장 파일 시스템 모듈을 불러옴 (파일/디렉터리 생성, 확인 등에 사용)
const fs = require("node:fs");
// Node.js 내장 경로 모듈을 불러옴 (OS에 맞는 경로 문자열을 만들어 줌)
const path = require("node:path");
// better-sqlite3 패키지를 불러옴 (동기 방식으로 동작하는 SQLite 드라이버)
const Database = require("better-sqlite3");

// 현재 파일(__dirname) 기준으로 "data" 폴더 경로를 생성
const dataDirectory = path.join(__dirname, "data");
// data 폴더를 생성 (이미 존재해도 에러가 나지 않도록 recursive: true 옵션 사용)
fs.mkdirSync(dataDirectory, { recursive: true });

// data 폴더 안의 contacts.sqlite 파일을 열거나 없으면 새로 생성하여 DB 연결 객체를 만듦
const database = new Database(path.join(dataDirectory, "contacts.sqlite"));
// SQLite의 외래 키(FOREIGN KEY) 제약 조건을 활성화 (기본값은 꺼져 있음)
database.pragma("foreign_keys = ON");
// 아래 SQL 문들을 한 번에 실행 (테이블이 없을 경우에만 생성)
database.exec(`
  -- contacts 테이블이 없으면 생성
  CREATE TABLE IF NOT EXISTS contacts (
    -- id: 자동 증가하는 기본 키 (정수)
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- name: 연락처 이름 (NULL 불가)
    name TEXT NOT NULL,
    -- email: 이메일 (NULL 허용)
    email TEXT,
    -- phone: 전화번호 (NULL 불가)
    phone TEXT NOT NULL,
    -- office: 사무실/직장 정보 (NULL 허용)
    office TEXT,
    -- createdAt: 생성 시각, 기본값은 현재 UTC 시간 문자열
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    -- updatedAt: 수정 시각, 기본값은 현재 UTC 시간 문자열
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
  -- users 테이블이 없으면 생성
  CREATE TABLE IF NOT EXISTS users (
    -- id: 자동 증가하는 기본 키
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- username: 사용자 이름, NULL 불가 + 중복 불가(UNIQUE)
    username TEXT NOT NULL UNIQUE,
    -- password: 비밀번호 (실무에서는 반드시 해시해서 저장해야 함)
    password TEXT NOT NULL,
    -- createdAt: 계정 생성 시각, 기본값은 현재 UTC 시간 문자열
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// 이 파일을 require 했을 때 DB 연결 객체를 반환하는 함수를 내보냄
// (다른 파일에서 const getDb = require("./db"); const db = getDb(); 형태로 사용)
module.exports = () => database;