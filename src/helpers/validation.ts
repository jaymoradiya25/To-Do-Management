import bcryptjs from "bcryptjs";

export const hashPassword = async (password: string) => {
    let slat = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, slat)
}

export const comparePassword = async (plainPass: string, hashPass: string) => {
    return bcryptjs.compareSync(plainPass, hashPass)
}
