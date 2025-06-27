export const emailValidation = (email)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export const passwordLengthCheck = (password)=>{
  return password.length<6;
}

export const phoneNoValidation = (phoneNo)=>{
  return phoneNo.length !== 10 || isNaN(phoneNo);
}