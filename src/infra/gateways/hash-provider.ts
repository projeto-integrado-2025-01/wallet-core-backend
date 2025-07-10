import * as bcrypt from 'bcrypt';

export class HashProvider {
  public async handle(password: string, rounds = 6): Promise<string> {
    return await bcrypt.hash(password, rounds);
  }

  public async verifyOldPassword(
    candidate: string,
    real: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(candidate, real);
  }
}
