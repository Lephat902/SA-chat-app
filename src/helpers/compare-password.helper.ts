import * as bcrypt from 'bcryptjs';

export function comparePassword(inputPassword: string, hashedPassword: string) {
    return bcrypt.compare(inputPassword, hashedPassword);
}