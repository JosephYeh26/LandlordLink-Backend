export const validateRegisterInput = (data: any) => {
  const errors: any = {};

  if (!data.username) errors.username = "Username is required";
  if (!data.email) errors.email = "Email is required";
  if (!data.password) errors.password = "Password is required";
  if (!data.confirmPassword)
    errors.confirmPassword = "Confirm password is required";
  if (!data.propertyAddress)
    errors.propertyAddress = "Property address is required";
  if (data.isAccreditedInvestor === undefined)
    errors.isAccreditedInvestor = "Accredited investor status is required";
  if (!data.referralSource)
    errors.referralSource = "Referral source is required";

  if (data.password !== data.confirmPassword)
    errors.passwordMatch = "Passwords do not match";

  return { errors, isValid: Object.keys(errors).length === 0 };
};
