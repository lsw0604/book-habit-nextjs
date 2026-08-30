const STORAGE_KEY = "last-main-path";

/** (main) 그룹 안에서 마지막으로 머문 경로. (auth) 화면의 뒤로가기 버튼이 이 값으로 이동한다. */
export function setLastMainPath(pathname: string) {
  sessionStorage.setItem(STORAGE_KEY, pathname);
}

/** 저장된 값이 없으면(딥링크·새 탭으로 로그인에 바로 진입) 홈으로 보낸다. */
export function getLastMainPath() {
  return sessionStorage.getItem(STORAGE_KEY) ?? "/";
}
