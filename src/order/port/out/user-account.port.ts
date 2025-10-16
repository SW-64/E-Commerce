// port/out/user-account.port.ts
export interface UserAccountPort {
  // 유저 정보 가져오기
  findById(userId: number): Promise<{ userId: number; balance: number } | null>;

  // 잔액 충분하면 차감, 아니면 에러
  decrementIfEnough(userId: number, amount: number): Promise<void>;
}
