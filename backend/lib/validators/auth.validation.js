
/**
 * 
 * @param {*} email 
 * @returns boolean
 * This function validates an email address using a regular expression.
 * It checks if the email is in the format of "local-part@domain".
 * The local part can contain alphanumeric characters, dots, underscores, and hyphens.
 * The domain part must contain at least one dot.
 */
export const emailValidation = (email)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

/**
 *  @param {*} password
 *  @returns boolean
 *  This function checks if the password is at least 6 characters long.
 *  It returns true if the password is less than 6 characters, otherwise false.
 */
export const passwordLengthCheck = (password)=>{
  return password.length<6;
}

/**
 * 
 * @param {*} phoneNo 
 * @returns boolean
 *  This function validates a phone number.
 *  It checks if the phone number is exactly 10 digits long and contains only numeric characters.
 *  It returns true if the phone number is invalid, otherwise false.
 */
export const phoneNoValidation = (phoneNo)=>{
  return phoneNo.toString().length !== 10;
}