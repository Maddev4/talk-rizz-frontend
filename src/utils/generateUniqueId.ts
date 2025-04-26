import md5 from "md5";

export const generateUniqueId = (plainText: string) => {
    return md5(`${Math.floor(Math.random() * 100000)}${plainText}${Date.now()}`)
};
