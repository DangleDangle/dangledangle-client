export enum ExceptionCode {
  /** SYSTEM-000 / 서버에서 알 수 없는 치명적인 에러 발생  */
  FATAL_ERROR = 'SYSTEM-000',
  /** SYSTEM-001 / 서버에서 핸들링 하지 않은 에러 발생  */
  UNHANDLED_ERROR = 'SYSTEM-001',

  /** API-002 / 인증되지 않은 사용자 / 만료된 토큰입니다. 다시 로그인을 진행해주세요.  */
  UNAUTHENTICATED = 'API-002',
  /** API-003 / 인가되지 않은 사용자 */
  UNAUTHORIZED = 'API-003',
  /** API-004 / 날짜 형식에러 */
  DATE_FORMAT_ERROR = 'API-004',
  /** API-005 / 파라미터 형식 에러 */
  PARAMETER_FORMAT_ERROR = 'API-005',
  /** API-006 / 토큰 유효 에러 */
  TOKEN_VALID_ERROR = 'API-006',

  /** LOCK-001 / Lock Key 생성 에러 (서버 내부 에러) */
  LOCK_KEY_CREATION_ERROR = 'LOCK-001',
  /** LOCK-002 / 동시성 에러 발생 (이벤트 참여 등등 | 재시도 정책등 정의 필요) */
  CONCURRENCY_ERROR = 'LOCK-002',

  /** VOLUNTEER_EVENT-001 / 이미 봉사에 참여중 */
  ALREADY_VOLUNTEERING = 'VOLUNTEER_EVENT-001',
  /** VOLUNTEER_EVENT-002 / 봉사에 참여중이지 않음 (봉사취소 API 호출시) */
  NOT_VOLUNTEERING = 'VOLUNTEER_EVENT-002',
  /** VOLUNTEER_EVENT-003 / 봉사 인원수 변경 불가 (봉사수정 API 호출시) */
  CANNOT_CHANGE_VOLUNTEER_COUNT = 'VOLUNTEER_EVENT-003',
  /** VOLUNTEER_EVENT-004 / 날짜 형식에러 */
  VOLUNTEER_DATE_FORMAT_ERROR = 'VOLUNTEER_EVENT-004',
  /** VOLUNTEER_EVENT-005 / 참여 할 수 없는 봉사 (봉사 참여 API 호출시) */
  CANNOT_VOLUNTEER = 'VOLUNTEER_EVENT-005',

  /** STOREAGE-001 / DB에서 해당하는 데이터를 찾을 수 없음 */
  DATA_NOT_FOUND_IN_DB = 'STORAGE-001'
}
