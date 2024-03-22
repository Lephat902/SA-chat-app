import * as bcrypt from 'bcryptjs';

export function hashPassword(password: string) {
    return bcrypt.hash(password, 7);
}